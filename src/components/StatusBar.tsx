import React from 'react';
import type { LifeStatus, PlayerStats } from '../types/game';

interface StatusBarProps {
  lifeStatus: LifeStatus;
  stats: PlayerStats;
  turnCount: number;
  targetTurns: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ lifeStatus, stats, turnCount, targetTurns }) => {
  // ステータスを日本語の読みやすいラベルに変換する
  const getMaritalLabel = (status: LifeStatus['maritalStatus']) => {
    switch (status) {
      case 'single': return '独身';
      case 'dating': return '交際中';
      case 'married': return '既婚';
      case 'divorced': return '離婚';
      case 'widowed': return '死別';
      default: return '未定';
    }
  };

  const getJobLabel = (status: LifeStatus['jobStatus']) => {
    switch (status) {
      case 'student': return '学生';
      case 'employee': return '会社員';
      case 'manager': return '管理職';
      case 'executive': return '役員';
      case 'owner': return '経営者';
      case 'freelance': return 'フリーランス';
      case 'unemployed': return '無職';
      case 'retired': return '退職';
      default: return '未定';
    }
  };

  const getHousingLabel = (status: LifeStatus['housingStatus']) => {
    switch (status) {
      case 'withParents': return '実家暮らし';
      case 'alone': return '一人暮らし';
      case 'withPartner': return '夫婦二人暮らし';
      case 'withFamily': return '家族暮らし';
      case 'shared': return 'シェアハウス';
      case 'seniorHousing': return '高齢者向け住宅';
      default: return '未定';
    }
  };

  const getHealthLabel = (status: LifeStatus['healthStatus']) => {
    switch (status) {
      case 'good': return '健康: 良好';
      case 'normal': return '健康: ふつう';
      case 'anxious': return '健康: 不安';
      case 'needsSupport': return '要介護・支援';
      default: return '健康: 普通';
    }
  };

  const getLocalLabel = (status: LifeStatus['localConnection']) => {
    switch (status) {
      case 'none': return '地域なし';
      case 'weak': return '地域接点: 薄い';
      case 'medium': return '地域あり';
      case 'strong': return '地域活動あり';
      default: return '地域なし';
    }
  };

  const getEmergencyLabel = (status: LifeStatus['emergencyContact']) => {
    switch (status) {
      case 'none': return '緊急連絡先なし';
      case 'family': return '緊急連絡先: 家族';
      case 'friend': return '緊急連絡先: 友人';
      case 'neighbor': return '緊急連絡先: 近所';
      case 'service': return '緊急連絡先: 支援窓口';
      case 'multiple': return '緊急連絡先: 複数あり';
      default: return '緊急連絡先なし';
    }
  };

  const statItems: { key: keyof PlayerStats; label: string; danger?: boolean }[] = [
    { key: 'money', label: 'お金' },
    { key: 'health', label: '健康' },
    { key: 'career', label: 'キャリア' },
    { key: 'freedom', label: '自由' },
    { key: 'relationshipCapital', label: '人間関係' },
    { key: 'familyCapital', label: '家族' },
    { key: 'localCommunity', label: '地域' },
    { key: 'outsideWorkBelonging', label: '居場所' },
    { key: 'emergencySupport', label: '緊急支え' },
    { key: 'lonelinessRisk', label: '孤独リスク', danger: true },
  ];

  const getBarWidth = (value: number) => `${Math.min(100, Math.max(0, (value / 30) * 100))}%`;

  return (
    <div style={styles.container}>
      <div style={styles.progressRow}>
        <span style={styles.progressLabel}>人生の選択</span>
        <span style={styles.progressValue}>{Math.min(turnCount + 1, targetTurns)} / {targetTurns}</span>
      </div>
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.min(100, (turnCount / targetTurns) * 100)}%`
          }}
        />
      </div>
      <div style={styles.row}>
        <span style={{ ...styles.chip, ...styles.ageChip }}>
          {lifeStatus.age} 歳
        </span>
        <span style={styles.chip}>{getMaritalLabel(lifeStatus.maritalStatus)}</span>
        <span style={styles.chip}>子ども {lifeStatus.childrenCount}人</span>
        <span style={styles.chip}>{getJobLabel(lifeStatus.jobStatus)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.chip}>{getHousingLabel(lifeStatus.housingStatus)}</span>
        <span style={styles.chip}>{getHealthLabel(lifeStatus.healthStatus)}</span>
        <span style={styles.chip}>{getLocalLabel(lifeStatus.localConnection)}</span>
        <span style={styles.chip}>{getEmergencyLabel(lifeStatus.emergencyContact)}</span>
      </div>
      <div style={styles.statsGrid}>
        {statItems.map(item => (
          <div key={item.key} style={styles.statItem}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>{item.label}</span>
              <span style={styles.statValue}>{stats[item.key]}</span>
            </div>
            <div style={styles.statTrack}>
              <div
                style={{
                  ...styles.statFill,
                  ...(item.danger ? styles.dangerFill : {}),
                  width: getBarWidth(stats[item.key])
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
  },
  progressLabel: {
    letterSpacing: '0.5px',
  },
  progressValue: {
    color: 'var(--accent-color)',
  },
  progressTrack: {
    width: '100%',
    height: '5px',
    borderRadius: '999px',
    backgroundColor: '#ece9e3',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    backgroundColor: 'var(--accent-color)',
    transition: 'width 0.28s ease',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    justifyContent: 'flex-start',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '7px',
    marginTop: '2px',
  },
  statItem: {
    minWidth: 0,
    padding: '6px 8px',
    backgroundColor: '#fbfaf7',
    border: '1px solid #e8e6e0',
    borderRadius: '10px',
    boxShadow: 'var(--shadow-sm)',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  statLabel: {
    minWidth: 0,
    fontSize: '0.68rem',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statValue: {
    fontSize: '0.68rem',
    color: 'var(--text-primary)',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  statTrack: {
    width: '100%',
    height: '4px',
    borderRadius: '999px',
    backgroundColor: '#ece9e3',
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: '999px',
    backgroundColor: 'var(--accent-color)',
    transition: 'width 0.25s ease',
  },
  dangerFill: {
    backgroundColor: 'var(--danger-color)',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 10px',
    backgroundColor: '#f6f5f2',
    border: '1px solid #e8e6e0',
    borderRadius: '16px',
    fontSize: '0.75rem',
    color: '#555555',
    fontWeight: 500,
    boxShadow: 'var(--shadow-sm)',
  },
  ageChip: {
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    borderColor: 'var(--accent-color)',
    fontWeight: 600,
  }
};
