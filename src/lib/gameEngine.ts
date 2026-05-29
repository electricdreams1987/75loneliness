import type { PlayerState, GameEvent, LifeStatus, PlayerStats } from '../types/game';
import { lifeEvents } from '../data/lifeEvents';
import { events } from '../data/events';
import { randomEvents } from '../data/randomEvents';

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
  seenEventIds: []
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

  if (currentAge >= 75) {
    return null; // 75歳で終了
  }

  // 1. アクティブなフォローアップ質問があればそれを最優先
  if (activeFollowUpId) {
    const fup = events.find(e => e.id === activeFollowUpId) ||
                randomEvents.find(e => e.id === activeFollowUpId);
    if (fup) return fup;
  }

  // 年代フィルター
  const filterByAge = (e: GameEvent) => {
    const range = e.ageRange || [18, 75];
    return currentAge >= range[0] && currentAge <= range[1];
  };

  // 2. ライフイベントの選定（未発生かつ条件を満たすもの）
  const availableLifeEvents = lifeEvents.filter(e => 
    !state.seenEventIds.includes(e.id) && 
    filterByAge(e) && 
    checkConditions(e, state)
  );

  if (availableLifeEvents.length > 0) {
    // ランダムに1つ選定
    const idx = Math.floor(Math.random() * availableLifeEvents.length);
    return availableLifeEvents[idx];
  }

  // 3. ランダムイベントの選定（低確率 15% で発生、条件合致、未発生のもの）
  const dice = Math.random();
  if (dice < 0.18) {
    const availableRandomEvents = randomEvents.filter(e => 
      !state.seenEventIds.includes(e.id) && 
      filterByAge(e) && 
      checkConditions(e, state)
    );
    if (availableRandomEvents.length > 0) {
      const idx = Math.floor(Math.random() * availableRandomEvents.length);
      return availableRandomEvents[idx];
    }
  }

  // 4. 通常の質問イベントの選定（未発生、条件合致するもの）
  const availableEvents = events.filter(e => 
    !state.seenEventIds.includes(e.id) && 
    filterByAge(e) && 
    checkConditions(e, state)
  );

  if (availableEvents.length > 0) {
    const idx = Math.floor(Math.random() * availableEvents.length);
    return availableEvents[idx];
  }

  // 条件に合うイベントが全くない場合、年齢に合う任意の通常イベントを探す（フォールバック）
  const fallbackEvents = events.filter(e => filterByAge(e));
  if (fallbackEvents.length > 0) {
    const idx = Math.floor(Math.random() * fallbackEvents.length);
    return fallbackEvents[idx];
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
export function advanceAge(currentAge: number): number {
  if (currentAge >= 75) return 75;

  // ライフステージに応じて、1回あたりの進み幅を調整し、45〜60ステップで75歳になるようにする
  if (currentAge < 22) {
    return currentAge + 1; // 18~22
  } else if (currentAge < 30) {
    return currentAge + 1; // 23~29
  } else if (currentAge < 40) {
    return currentAge + 1; // 30~39
  } else if (currentAge < 50) {
    // 40代はたまに2歳進む
    return currentAge + (Math.random() < 0.3 ? 2 : 1);
  } else if (currentAge < 60) {
    return currentAge + (Math.random() < 0.4 ? 2 : 1);
  } else if (currentAge < 70) {
    return currentAge + (Math.random() < 0.4 ? 2 : 1);
  } else {
    // 70代は1歳ずつ慎重に
    return currentAge + 1;
  }
}
