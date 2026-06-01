import React, { useRef, useEffect } from 'react';
import type { GameEvent } from '../types/game';

interface SwipeChoiceProps {
  event: GameEvent;
  onChoice: (choiceId: string, label: string) => void;
  onNext: () => void;
  dragOffset: number;
  setDragOffset: (offset: number) => void;
  coolDownActive: boolean;
}

export const SwipeChoice: React.FC<SwipeChoiceProps> = ({
  event,
  onChoice,
  onNext,
  dragOffset,
  setDragOffset,
  coolDownActive
}) => {
  const isLifeEvent = event.type === 'life_event';
  const leftChoice = event.choices?.[0];
  const rightChoice = event.choices?.[1];

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const dragOffsetRef = useRef<number>(0);
  const isMouseDown = useRef<boolean>(false);
  const mouseStartX = useRef<number>(0);
  const swipeThreshold = 56; // スマホで軽くフリックして決まる距離
  const maxDragOffset = 180;

  const updateDragOffset = (offset: number) => {
    const clamped = Math.max(-maxDragOffset, Math.min(maxDragOffset, offset));
    dragOffsetRef.current = clamped;
    setDragOffset(clamped);
  };

  const resetDragOffset = () => {
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  // 1. タッチイベント（スマホ用）
  const handleTouchStart = (e: React.TouchEvent) => {
    if (coolDownActive) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || coolDownActive) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - (touchStartY.current ?? currentY);

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 6) {
      e.preventDefault();
    }
    
    updateDragOffset(diffX);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || coolDownActive) return;
    
    processSwipe();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // 2. マウスイベント（PCドラッグ用）
  const handleMouseDown = (e: React.MouseEvent) => {
    if (coolDownActive) return;
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || coolDownActive) return;
    const diffX = e.clientX - mouseStartX.current;
    updateDragOffset(diffX);
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown.current || coolDownActive) return;
    isMouseDown.current = false;
    processSwipe();
  };

  // 3. スワイプ確定処理
  const processSwipe = () => {
    const offset = dragOffsetRef.current;
    resetDragOffset();

    if (isLifeEvent) {
      // ライフイベントは一定以上のスワイプ（左右どちらでも）で次に進む
      if (Math.abs(offset) >= swipeThreshold) {
        window.navigator.vibrate?.(18);
        onNext();
      }
      return;
    }

    if (offset <= -swipeThreshold && leftChoice) {
      window.navigator.vibrate?.(18);
      onChoice(leftChoice.id, leftChoice.label);
    } else if (offset >= swipeThreshold && rightChoice) {
      window.navigator.vibrate?.(18);
      onChoice(rightChoice.id, rightChoice.label);
    }
  };

  // グローバルなマウスイベント解除用
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown.current) {
        isMouseDown.current = false;
        dragOffsetRef.current = 0;
        setDragOffset(0);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [setDragOffset]);

  // クリック時の直接決定処理
  const handleChoiceClick = (choiceId: string, label: string) => {
    if (coolDownActive) return;
    onChoice(choiceId, label);
  };

  const handleNextClick = () => {
    if (coolDownActive) return;
    onNext();
  };

  // スワイプ中に左右の選択肢を強調するためのスタイル
  const leftHighlight = !isLifeEvent && dragOffset < -20;
  const rightHighlight = !isLifeEvent && dragOffset > 20;

  return (
    <div
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {isLifeEvent ? (
        <div style={styles.lifeActionArea}>
          <button
            onClick={handleNextClick}
            style={styles.nextButton}
            disabled={coolDownActive}
          >
            タップで進む
          </button>
          <div style={styles.swipeHint}>
            左右どちらへフリックしても進みます
          </div>
        </div>
      ) : (
        <div style={styles.choiceArea}>
          {/* 左側の選択肢 */}
          <button
            onClick={() => leftChoice && handleChoiceClick(leftChoice.id, leftChoice.label)}
            style={{
              ...styles.choiceButton,
              ...styles.leftButton,
              ...(leftHighlight ? styles.highlightLeft : {})
            }}
            disabled={coolDownActive}
          >
            <span style={{ ...styles.arrow, ...styles.arrowLeft }}>←</span>
            <span style={styles.label}>{leftChoice?.label}</span>
          </button>

          {/* 右側の選択肢 */}
          <button
            onClick={() => rightChoice && handleChoiceClick(rightChoice.id, rightChoice.label)}
            style={{
              ...styles.choiceButton,
              ...styles.rightButton,
              ...(rightHighlight ? styles.highlightRight : {})
            }}
            disabled={coolDownActive}
          >
            <span style={styles.label}>{rightChoice?.label}</span>
            <span style={{ ...styles.arrow, ...styles.arrowRight }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 20px 40px 20px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    touchAction: 'pan-y',
  },
  choiceArea: {
    display: 'flex',
    width: '100%',
    gap: '12px',
  },
  choiceButton: {
    flex: 1,
    minHeight: '70px',
    padding: '12px 32px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
    backgroundColor: '#ffffff',
    color: 'var(--text-primary)',
    textAlign: 'center' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    position: 'relative' as const,
  },
  leftButton: {
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid' as const,
    borderLeftColor: 'var(--text-secondary)',
  },
  rightButton: {
    borderRightWidth: '4px',
    borderRightStyle: 'solid' as const,
    borderRightColor: 'var(--accent-color)',
  },
  highlightLeft: {
    transform: 'scale(1.03)',
    backgroundColor: '#fafbfc',
    borderLeftColor: 'var(--text-secondary)',
    boxShadow: 'var(--shadow-md)',
  },
  highlightRight: {
    transform: 'scale(1.03)',
    backgroundColor: '#f6f9f7',
    borderRightColor: 'var(--accent-color)',
    boxShadow: 'var(--shadow-md)',
  },
  arrow: {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    fontWeight: 600,
    opacity: 0.7,
  },
  arrowLeft: {
    left: '12px',
  },
  arrowRight: {
    right: '12px',
  },
  label: {
    flex: 1,
    lineHeight: 1.35,
    wordBreak: 'keep-all' as const,
    overflowWrap: 'anywhere' as const,
  },
  lifeActionArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '100%',
    gap: '12px',
  },
  nextButton: {
    width: '100%',
    maxWidth: '280px',
    height: '52px',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: 600,
    boxShadow: 'var(--shadow-md)',
  },
  swipeHint: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: 400,
    letterSpacing: '0.5px',
  }
};
