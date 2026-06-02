import type { PlayerState, GameEvent, LifeStatus, PlayerStats } from '../types/game';
import { lifeEvents } from '../data/lifeEvents';
import { events } from '../data/events';
import { randomEvents } from '../data/randomEvents';
import { adaptiveEvents } from '../data/adaptiveEvents';

const START_AGE = 18;
const END_AGE = 75;
export const TARGET_TURNS = 100;

export const INITIAL_STATE: PlayerState = {
  lifeStatus: {
    age: 18,
    maritalStatus: 'single',
    childrenCount: 0,
    jobStatus: 'student',
    housingStatus: 'withParents',
    healthStatus: 'good',
    localConnection: 'none',
    emergencyContact: 'none',
  },
  stats: {
    money: 5,
    health: 7,
    career: 1,
    freedom: 8,
    relationshipCapital: 5,
    familyCapital: 5,
    localCommunity: 2,
    outsideWorkBelonging: 1,
    nextGeneration: 0,
    emergencySupport: 2,
    meaningCapital: 3,
    lonelinessRisk: 1,
  },
  history: [],
  flags: {
    has_old_friends: true, // デフォルトで古い友人がいるフラグ
  },
  seenEventIds: [],
  turnCount: 0,
  targetTurns: TARGET_TURNS
};

// 条件判定ヘルパー
export function checkConditions(event: GameEvent, state: PlayerState): boolean {
  if (!event.conditions) return true;
  const conds = event.conditions;
  const status = state.lifeStatus;
  const stats = state.stats;

  // 年齢範囲
  if (conds.ageRange) {
    if (status.age < conds.ageRange[0] || status.age > conds.ageRange[1]) return false;
  }

  // 婚姻状況
  if (conds.maritalStatus && !conds.maritalStatus.includes(status.maritalStatus)) return false;

  // 子ども人数
  if (conds.childrenCount !== undefined && status.childrenCount !== conds.childrenCount) return false;
  if (conds.childrenCountMin !== undefined && status.childrenCount < conds.childrenCountMin) return false;
  if (conds.childrenCountMax !== undefined && status.childrenCount > conds.childrenCountMax) return false;

  // 職業
  if (conds.jobStatus && !conds.jobStatus.includes(status.jobStatus)) return false;

  // 住まい
  if (conds.housingStatus && !conds.housingStatus.includes(status.housingStatus)) return false;

  // 健康状態
  if (conds.healthStatus && !conds.healthStatus.includes(status.healthStatus)) return false;

  // 地域接点
  if (conds.localConnection && !conds.localConnection.includes(status.localConnection)) return false;

  // 緊急連絡先
  if (conds.emergencyContact && !conds.emergencyContact.includes(status.emergencyContact)) return false;

  // 必須フラグ
  if (conds.requiredFlags) {
    for (const flag of conds.requiredFlags) {
      if (!state.flags[flag]) return false;
    }
  }

  // いずれかのフラグが必要
  if (conds.anyRequiredFlags) {
    const hasAnyFlag = conds.anyRequiredFlags.some(flag => state.flags[flag]);
    if (!hasAnyFlag) return false;
  }

  // 除外フラグ
  if (conds.excludedFlags) {
    for (const flag of conds.excludedFlags) {
      if (state.flags[flag]) return false;
    }
  }

  // ステータス最小値
  if (conds.minStats) {
    for (const [key, value] of Object.entries(conds.minStats)) {
      if (stats[key as keyof PlayerStats] < (value ?? 0)) return false;
    }
  }

  // ステータス最大値
  if (conds.maxStats) {
    for (const [key, value] of Object.entries(conds.maxStats)) {
      if (stats[key as keyof PlayerStats] > (value ?? 0)) return false;
    }
  }

  return true;
}

// 次に発生するイベントを選定する
export function getNextEvent(state: PlayerState, activeFollowUpId: string | null): GameEvent | null {
  const currentAge = state.lifeStatus.age;

  if (currentAge >= END_AGE || state.turnCount >= state.targetTurns) {
    return null; // 75歳または目標質問数で終了
  }

  // 1. アクティブなフォローアップ質問があればそれを最優先
  if (activeFollowUpId) {
    const fup = events.find(e => e.id === activeFollowUpId) ||
                randomEvents.find(e => e.id === activeFollowUpId);
    if (fup) return fup;
  }

  const filterByAge = (e: GameEvent) => {
    const range = e.ageRange || [18, 75];
    return currentAge >= range[0] && currentAge <= range[1];
  };

  const pickOne = (list: GameEvent[]) => {
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  };

  const availableRandomEvents = randomEvents.filter(e => 
    !state.seenEventIds.includes(e.id) && 
    filterByAge(e) && 
    checkConditions(e, state)
  );

  // 2. こちらの選択とは別に起こる出来事。一定確率で人生イベントより先に割り込む。
  if (availableRandomEvents.length > 0 && Math.random() < 0.24) {
    return pickOne(availableRandomEvents);
  }

  // 3. 現在のステータスに反応する質問。弱点や積み上げた資本に合わせて出す。
  const availableAdaptiveEvents = adaptiveEvents.filter(e =>
    !state.seenEventIds.includes(e.id) &&
    filterByAge(e) &&
    checkConditions(e, state)
  );

  if (availableAdaptiveEvents.length > 0) {
    return pickOne(availableAdaptiveEvents);
  }

  // 4. ライフイベントの選定（未発生かつ条件を満たすもの）
  const availableLifeEvents = lifeEvents.filter(e => 
    !state.seenEventIds.includes(e.id) && 
    filterByAge(e) && 
    checkConditions(e, state)
  );

  if (availableLifeEvents.length > 0) {
    return pickOne(availableLifeEvents);
  }

  // 5. 通常の質問イベントの選定（未発生、条件合致するもの）
  const availableEvents = events.filter(e => 
    !state.seenEventIds.includes(e.id) && 
    filterByAge(e) && 
    checkConditions(e, state)
  );

  if (availableEvents.length > 0) {
    return pickOne(availableEvents);
  }

  // 6. 割り込み機会を逃したランダムイベントを最後に拾う。
  if (availableRandomEvents.length > 0) {
    return pickOne(availableRandomEvents);
  }

  // 条件に合うイベントが全くない場合、年齢に合う任意の通常イベントを探す（フォールバック）
  const fallbackEvents = events.filter(e => filterByAge(e) && checkConditions(e, state));
  if (fallbackEvents.length > 0) {
    return pickOne(fallbackEvents);
  }

  return null;
}

// 選択肢適用またはライフイベント適用のステート更新
export function applyEffects(
  currentState: PlayerState,
  effects: Partial<PlayerStats>,
  lifeStatusEffects?: Partial<LifeStatus> & { childrenCountDelta?: number },
  flags?: Record<string, boolean>
): PlayerState {
  const nextStats = { ...currentState.stats };
  const nextLifeStatus = { ...currentState.lifeStatus };
  const nextFlags = { ...currentState.flags };

  // 内部数値の更新
  if (effects) {
    for (const [key, val] of Object.entries(effects)) {
      const k = key as keyof PlayerStats;
      nextStats[k] = Math.max(0, Math.min(30, (nextStats[k] || 0) + (val || 0)));
    }
  }

  // 人生ステータスの更新
  if (lifeStatusEffects) {
    const { childrenCountDelta, ...rest } = lifeStatusEffects;
    
    // 子ども人数のデルタ
    if (childrenCountDelta !== undefined) {
      nextLifeStatus.childrenCount = Math.max(0, nextLifeStatus.childrenCount + childrenCountDelta);
    }

    // その他のステータスの直接更新
    for (const [key, val] of Object.entries(rest)) {
      const k = key as keyof LifeStatus;
      (nextLifeStatus as unknown as Record<string, unknown>)[k] = val;
    }
  }

  // フラグの更新
  if (flags) {
    for (const [key, val] of Object.entries(flags)) {
      nextFlags[key] = val;
    }
  }

  return {
    ...currentState,
    stats: nextStats,
    lifeStatus: nextLifeStatus,
    flags: nextFlags
  };
}

// 年齢進行の判定ロジック
export function advanceAge(currentAge: number, completedTurns: number, targetTurns: number = TARGET_TURNS): number {
  if (currentAge >= END_AGE || completedTurns >= targetTurns) return END_AGE;

  const progress = completedTurns / targetTurns;
  const nextAge = Math.floor(START_AGE + (END_AGE - START_AGE) * progress);

  return Math.max(currentAge, Math.min(END_AGE, nextAge));
}
