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
  const isMouseDown = useRef<boolean>(false);
  const mouseStartX = useRef<number>(0);
  const swipeThreshold = 80; // 確定に必要なスワイプピクセル数

  // 1. タッチイベント（スマホ用）
  const handleTouchStart = (e: React.TouchEvent) => {
    if (coolDownActive) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || coolDownActive) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX.current;
    
    // ドラッグ距離を設定
    setDragOffset(diffX);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || coolDownActive) return;
    
    processSwipe();
    touchStartX.current = null;
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
    setDragOffset(diffX);
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown.current || coolDownActive) return;
    isMouseDown.current = false;
    processSwipe();
  };

  // 3. スワイプ確定処理
  const processSwipe = () => {
    const offset = dragOffset;
    setDragOffset(0); // リセット

    if (isLifeEvent) {
      // ライフイベントは一定以上のスワイプ（左右どちらでも）で次に進む
      if (Math.abs(offset) >= swipeThreshold) {
        onNext();
      }
      return;
    }

    if (offset <= -swipeThreshold && leftChoice) {
      onChoice(leftChoice.id, leftChoice.label);
    } else if (offset >= swipeThreshold && rightChoice) {
      onChoice(rightChoice.id, rightChoice.label);
    }
  };

  // グローバルなマウスイベント解除用
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown.current) {
        isMouseDown.current = false;
        setDragOffset(0);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [dragOffset, setDragOffset]);

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
            人生を進める (タップ)
          </button>
          <div style={styles.swipeHint}>
            ← 左右にスワイプしても進みます →
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
            <span style={styles.arrow}>←</span>
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
            <span style={styles.arrow}>→</span>
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
  },
  choiceArea: {
    display: 'flex',
    width: '100%',
    gap: '12px',
  },
  choiceButton: {
    flex: 1,
    minHeight: '70px',
    padding: '12px 14px',
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
  },
  leftButton: {
    borderLeft: '4px solid var(--text-secondary)',
  },
  rightButton: {
    borderRight: '4px solid var(--accent-color)',
  },
  highlightLeft: {
    transform: 'scale(1.03)',
    backgroundColor: '#fafbfc',
    borderColor: 'var(--text-secondary)',
    boxShadow: 'var(--shadow-md)',
  },
  highlightRight: {
    transform: 'scale(1.03)',
    backgroundColor: '#f6f9f7',
    borderColor: 'var(--accent-color)',
    boxShadow: 'var(--shadow-md)',
  },
  arrow: {
    fontSize: '1rem',
    fontWeight: 600,
    opacity: 0.7,
  },
  label: {
    flex: 1,
    lineHeight: '1.4',
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
