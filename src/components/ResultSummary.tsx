import React, { useState } from 'react';
import type { PlayerState, Ending } from '../types/game';
import { determineEnding } from '../data/endings';
import { generateDailyScenario, extractKeyChoices } from '../lib/resultEngine';

interface ResultSummaryProps {
  state: PlayerState;
  onRestart: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ state, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const ending: Ending = determineEnding(state);
  const scenario = generateDailyScenario(state);
  const keyChoices = extractKeyChoices(state.history);

  // 最終ステータス変換用
  const getMaritalLabel = (s: string) => {
    const m: Record<string, string> = { single: '独身', dating: '交際中', married: '既婚', divorced: '離婚', widowed: '死別' };
    return m[s] || s;
  };
  const getJobLabel = (s: string) => {
    const m: Record<string, string> = { student: '学生', employee: '会社員', manager: '管理職', executive: '役員', owner: '経営者', freelance: '個人事業', unemployed: '無職', retired: '退職' };
    return m[s] || s;
  };
  const getHousingLabel = (s: string) => {
    const m: Record<string, string> = { withParents: '実家暮らし', alone: '一人暮らし', withPartner: '夫婦二人', withFamily: '家族同居', shared: 'シェアハウス', seniorHousing: 'シニア住宅' };
    return m[s] || s;
  };
  const getHealthLabel = (s: string) => {
    const m: Record<string, string> = { good: '健康良好', normal: '健康ふつう', anxious: '健康不安', needsSupport: '要支援' };
    return m[s] || s;
  };

  // 共有テキストの生成
  const getShareText = () => {
    const statusText = `【75歳の孤独 - 診断結果】
私の75歳時点の孤立リスクタイプ：
「${ending.title}」

■最終人生ステータス：
・年齢: 75歳
・配偶者: ${getMaritalLabel(state.lifeStatus.maritalStatus)}
・仕事: ${getJobLabel(state.lifeStatus.jobStatus)}
・住まい: ${getHousingLabel(state.lifeStatus.housingStatus)}

■75歳のある一日（一部）：
${scenario.split('\n\n')[0]}...

あなたも18歳から75歳までの人生シミュレーションを体験してみませんか？
#75歳の孤独 #人生シミュレーション`;
    return statusText;
  };

  // クリップボードへコピー
  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // X (Twitter) でシェア
  const handleShareX = () => {
    const text = encodeURIComponent(getShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.scrollContent}>
        {/* ヘッダー */}
        <div style={styles.header}>
          <span style={styles.ageBadge}>75歳 到達</span>
          <h1 style={styles.title}>あなたの人生の終着点</h1>
        </div>

        {/* セクション1: 孤立リスクタイプ */}
        <div style={styles.section}>
          <div style={styles.endingCard}>
            <div style={styles.endingType}>孤立リスクタイプ</div>
            <h2 style={styles.endingTitle}>{ending.title}</h2>
            <p style={styles.endingDesc}>{ending.description}</p>
            
            {/* シェアボタン群 */}
            <div style={styles.shareGroup}>
              <button onClick={handleCopy} style={{...styles.shareBtn, ...styles.copyBtn}}>
                {copied ? 'コピー完了！' : '結果をコピー'}
              </button>
              <button onClick={handleShareX} style={{...styles.shareBtn, ...styles.xBtn}}>
                Xで結果をシェア
              </button>
            </div>
          </div>
        </div>

        {/* セクション2: 75歳のある一日 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>75歳のある一日</h3>
          <div style={styles.scenarioCard}>
            {scenario.split('\n\n').map((paragraph, index) => (
              <p key={index} style={styles.scenarioParagraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* セクション3: 最終人生ステータス */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>最終人生ステータス</h3>
          <div style={styles.statusGrid}>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>配偶者</span>
              <span style={styles.statusValue}>{getMaritalLabel(state.lifeStatus.maritalStatus)}</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>子ども</span>
              <span style={styles.statusValue}>{state.lifeStatus.childrenCount} 人</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>仕事</span>
              <span style={styles.statusValue}>{getJobLabel(state.lifeStatus.jobStatus)}</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>住まい</span>
              <span style={styles.statusValue}>{getHousingLabel(state.lifeStatus.housingStatus)}</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>健康</span>
              <span style={styles.statusValue}>{getHealthLabel(state.lifeStatus.healthStatus)}</span>
            </div>
            <div style={styles.statusItem}>
              <span style={styles.statusLabel}>緊急連絡先</span>
              <span style={styles.statusValue}>
                {state.lifeStatus.emergencyContact === 'none' ? '未登録' : '登録あり'}
              </span>
            </div>
          </div>
        </div>

        {/* セクション4: 人生に残った選択 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>人生に残った重要な選択</h3>
          <div style={styles.choicesCard}>
            {keyChoices.map((choiceText, index) => (
              <div key={index} style={styles.choiceRow}>
                <span style={styles.choiceDot}>•</span>
                <p style={styles.choiceText}>{choiceText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* セクション5: 現実でできる小さな行動 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>現実でできる小さな一歩</h3>
          <div style={styles.actionCard}>
            <p style={styles.actionIntro}>孤立を防ぎ、穏やかな未来を作るために、今日からできるアクションです：</p>
            {ending.actions.map((action, index) => (
              <div key={index} style={styles.actionRow}>
                <span style={styles.actionNum}>{index + 1}</span>
                <p style={styles.actionText}>{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* フッターアクション */}
      <div style={styles.footer}>
        <button onClick={onRestart} style={styles.restartButton}>
          もう一度最初から歩む
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: 'var(--bg-color)',
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    textAlign: 'center' as const,
    marginTop: '12px',
    marginBottom: '8px',
  },
  ageBadge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--accent-color)',
    backgroundColor: '#e8eedc',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '8px',
    letterSpacing: '1px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    paddingLeft: '4px',
  },
  endingCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-md)',
    textAlign: 'center' as const,
  },
  endingType: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '2px',
    marginBottom: '6px',
  },
  endingTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--accent-color)',
    marginBottom: '12px',
  },
  endingDesc: {
    fontSize: '0.9rem',
    color: '#555555',
    lineHeight: '1.6',
    marginBottom: '18px',
  },
  shareGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '12px',
  },
  shareBtn: {
    flex: 1,
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: 600,
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
  },
  copyBtn: {
    backgroundColor: '#ffffff',
    color: 'var(--text-primary)',
  },
  xBtn: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderColor: '#1a1a1a',
  },
  scenarioCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },
  scenarioParagraph: {
    fontSize: '0.9rem',
    color: '#4c4c4c',
    lineHeight: '1.7',
    marginBottom: '14px',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  statusItem: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    boxShadow: 'var(--shadow-sm)',
  },
  statusLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  statusValue: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  choicesCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  choiceRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  choiceDot: {
    color: 'var(--accent-color)',
    fontWeight: 'bold',
  },
  choiceText: {
    fontSize: '0.85rem',
    color: '#4c4c4c',
    lineHeight: '1.5',
  },
  actionCard: {
    backgroundColor: '#f7f6f2',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
  },
  actionIntro: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: '1.5',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  actionNum: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  actionText: {
    fontSize: '0.85rem',
    color: '#4c4c4c',
    lineHeight: '1.5',
  },
  footer: {
    padding: '16px 20px 32px 20px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'center',
  },
  restartButton: {
    width: '100%',
    maxWidth: '280px',
    height: '52px',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: 600,
    boxShadow: 'var(--shadow-md)',
  }
};
