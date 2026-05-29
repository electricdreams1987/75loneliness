import React from 'react';
import type { GameEvent } from '../types/game';

interface EventCardProps {
  event: GameEvent;
  dragOffset: number; // 左右フリック・スワイプのズレ幅（傾き制御用）
}

export const EventCard: React.FC<EventCardProps> = ({ event, dragOffset }) => {
  const isLifeEvent = event.type === 'life_event';

  // ドラッグ時の傾きと透明度の変化を計算
  const rotate = dragOffset * 0.08; // 傾き角度
  const opacity = Math.max(0.6, 1 - Math.abs(dragOffset) / 300); // 離れるほど薄くなる

  const cardStyle = {
    ...styles.card,
    ...(isLifeEvent ? styles.lifeEventCard : {}),
    transform: `translateX(${dragOffset}px) rotate(${rotate}deg)`,
    opacity,
    transition: dragOffset === 0 ? 'transform 0.3s ease, opacity 0.3s ease' : 'none'
  };

  return (
    <div className="fade-in" style={styles.container}>
      <div style={cardStyle}>
        {isLifeEvent ? (
          <div style={styles.lifeBadge}>LIFE EVENT</div>
        ) : (
          <div style={styles.choiceBadge}>QUESTION</div>
        )}
        <h2 style={styles.title}>{event.title}</h2>
        <p style={styles.description}>{event.description}</p>
        
        {isLifeEvent && (
          <div style={styles.lifeInfo}>
            <span style={styles.infoText}>💡 この出来事により、人生の状況が変化しました。</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    position: 'relative' as const,
  },
  card: {
    width: '100%',
    maxWidth: '340px',
    minHeight: '260px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px 24px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    position: 'relative' as const,
    userSelect: 'none' as const,
    touchAction: 'none' as const,
  },
  lifeEventCard: {
    border: '2px solid var(--accent-color)',
    backgroundColor: '#fafbfc',
  },
  choiceBadge: {
    position: 'absolute' as const,
    top: '16px',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  lifeBadge: {
    position: 'absolute' as const,
    top: '16px',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: '#ffffff',
    backgroundColor: 'var(--accent-color)',
    padding: '3px 10px',
    borderRadius: '4px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '16px',
    marginTop: '12px',
  },
  description: {
    fontSize: '0.95rem',
    color: '#555555',
    lineHeight: '1.7',
    marginBottom: '20px',
  },
  lifeInfo: {
    marginTop: 'auto',
    padding: '8px 12px',
    backgroundColor: '#f1f5f2',
    borderRadius: '8px',
    border: '1px solid #d4dec9',
  },
  infoText: {
    fontSize: '0.75rem',
    color: 'var(--accent-color)',
    fontWeight: 500,
  }
};
