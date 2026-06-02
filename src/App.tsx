import { useState } from 'react';
import type { PlayerState, GameEvent } from './types/game';
import { StatusBar } from './components/StatusBar';
import { EventCard } from './components/EventCard';
import { SwipeChoice } from './components/SwipeChoice';
import { ResultSummary } from './components/ResultSummary';
import { INITIAL_STATE, getNextEvent, applyEffects, advanceAge } from './lib/gameEngine';

type GameScreen = 'title' | 'playing' | 'result';

function App() {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_STATE);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  
  // スワイプ演出用
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [coolDownActive, setCoolDownActive] = useState<boolean>(false);

  // ゲームスタート
  const handleStartGame = () => {
    const freshState = {
      ...INITIAL_STATE,
      seenEventIds: [],
      history: [],
      flags: { has_old_friends: true },
      turnCount: 0,
      targetTurns: INITIAL_STATE.targetTurns
    };
    setPlayerState(freshState);
    
    // 最初のイベント選定
    const firstEvent = getNextEvent(freshState, null);
    setActiveEvent(firstEvent);
    setScreen('playing');
  };

  // 選択肢決定時の処理
  const handleChoiceSelected = (choiceId: string, choiceLabel: string) => {
    if (!activeEvent || coolDownActive) return;

    const choice = activeEvent.choices?.find(c => c.id === choiceId);
    if (!choice) return;

    // クールダウン開始（連続入力防止）
    setCoolDownActive(true);

    // ステート更新の適用
    let nextState = applyEffects(
      playerState,
      choice.effects,
      choice.lifeStatusEffects,
      choice.flags
    );

    // 履歴エントリーの作成
    const historyEntry = {
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      age: playerState.lifeStatus.age,
      selectedChoiceId: choiceId,
      selectedChoiceLabel: choiceLabel,
      effects: choice.effects,
      lifeStatusEffects: choice.lifeStatusEffects || {},
      timestamp: Date.now()
    };

    // 既読イベント追加
    const nextSeenIds = [...playerState.seenEventIds, activeEvent.id];
    
    // 年齢の進捗
    const nextTurnCount = playerState.turnCount + 1;
    const nextAge = advanceAge(
      playerState.lifeStatus.age,
      nextTurnCount,
      playerState.targetTurns
    );

    nextState = {
      ...nextState,
      lifeStatus: {
        ...nextState.lifeStatus,
        age: nextAge
      },
      seenEventIds: nextSeenIds,
      history: [...playerState.history, historyEntry],
      turnCount: nextTurnCount
    };

    setPlayerState(nextState);

    // フォローアップ質問または次のイベントの準備
    const nextFollowUpId = choice.followUpEventId || null;

    // 0.3秒後（カードが消えるアニメーション後）に次のイベントを表示
    setTimeout(() => {
      if (nextAge >= 75 || nextTurnCount >= nextState.targetTurns) {
        setScreen('result');
        setCoolDownActive(false);
      } else {
        const nextEvent = getNextEvent(nextState, nextFollowUpId);
        if (nextEvent) {
          setActiveEvent(nextEvent);
        } else {
          setScreen('result');
        }
        setCoolDownActive(false);
      }
    }, 350);
  };

  // ライフイベントを承諾し、次に進む処理
  const handleNextLifeEvent = () => {
    if (!activeEvent || coolDownActive) return;

    setCoolDownActive(true);

    // ライフイベントの効果適用
    let nextState = applyEffects(
      playerState,
      activeEvent.effects || {},
      activeEvent.lifeStatusEffects,
      {}
    );

    // 既読イベント追加
    const nextSeenIds = [...playerState.seenEventIds, activeEvent.id];
    
    // 年齢の進捗
    const nextTurnCount = playerState.turnCount + 1;
    const nextAge = advanceAge(
      playerState.lifeStatus.age,
      nextTurnCount,
      playerState.targetTurns
    );

    nextState = {
      ...nextState,
      lifeStatus: {
        ...nextState.lifeStatus,
        age: nextAge
      },
      seenEventIds: nextSeenIds,
      turnCount: nextTurnCount
    };

    setPlayerState(nextState);

    // フォローアップ質問（ライフイベント直後）
    const nextFollowUpId = activeEvent.followUpEventIds?.[0] || null;

    setTimeout(() => {
      if (nextAge >= 75 || nextTurnCount >= nextState.targetTurns) {
        setScreen('result');
        setCoolDownActive(false);
      } else {
        const nextEvent = getNextEvent(nextState, nextFollowUpId);
        if (nextEvent) {
          setActiveEvent(nextEvent);
        } else {
          setScreen('result');
        }
        setCoolDownActive(false);
      }
    }, 350);
  };

  // タイトルへ戻る
  const handleRestart = () => {
    setScreen('title');
  };

  return (
    <div style={styles.appContainer}>
      {screen === 'title' && (
        <div style={styles.titleScreen} className="fade-in">
          <div style={styles.titleBadge}>LIFE SIMULATOR</div>
          <h1 style={styles.appTitle}>75歳の孤独</h1>
          <p style={styles.appDesc}>
            これは、18歳から75歳までの人生を2択で歩み、<br />
            「孤独」や「社会との繋がり」を追体験する人生の物語です。<br /><br />
            何を選び、誰と繋がり、どんな最後を迎えるか。<br />
            あなたの選択が未来を形作ります。
          </p>
          <button onClick={handleStartGame} style={styles.startButton}>
            人生を歩み始める
          </button>
        </div>
      )}

      {screen === 'playing' && activeEvent && (
        <div style={styles.gamePlayArea}>
          <StatusBar
            lifeStatus={playerState.lifeStatus}
            stats={playerState.stats}
            turnCount={playerState.turnCount}
            targetTurns={playerState.targetTurns}
          />

          <EventCard 
            event={activeEvent} 
            dragOffset={dragOffset} 
          />
          
          <SwipeChoice 
            event={activeEvent}
            onChoice={handleChoiceSelected}
            onNext={handleNextLifeEvent}
            dragOffset={dragOffset}
            setDragOffset={setDragOffset}
            coolDownActive={coolDownActive}
          />
        </div>
      )}

      {screen === 'result' && (
        <ResultSummary 
          state={playerState} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'var(--bg-color)',
  },
  titleScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    textAlign: 'center' as const,
    backgroundColor: '#ffffff',
  },
  titleBadge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '3px',
    color: 'var(--accent-color)',
    border: '1.5px solid var(--accent-color)',
    padding: '4px 12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  appTitle: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '20px',
    letterSpacing: '1px',
  },
  appDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.8',
    maxWidth: '340px',
    marginBottom: '40px',
  },
  startButton: {
    width: '100%',
    maxWidth: '260px',
    height: '52px',
    backgroundColor: 'var(--accent-color)',
    color: '#ffffff',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: 600,
    boxShadow: 'var(--shadow-md)',
  },
  gamePlayArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    width: '100%',
  }
};

export default App;
