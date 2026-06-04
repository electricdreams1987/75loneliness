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
    health: 16,
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
    parent_alive: true,
    has_child: false,
    has_infant_child: false,
    lives_with_partner: false,
    lives_with_family: false,
    education_college: false,
    education_no_college: false,
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

export function getAllEvents(): GameEvent[] {
  return [...lifeEvents, ...events, ...randomEvents, ...adaptiveEvents];
}

export function findEventById(id: string): GameEvent | undefined {
  return getAllEvents().find(event => event.id === id);
}

function isInAgeRange(state: PlayerState, event: GameEvent): boolean {
  const range = event.ageRange || event.conditions?.ageRange || [18, 75];
  return state.lifeStatus.age >= range[0] && state.lifeStatus.age <= range[1];
}

export function getEventCategory(event: GameEvent): GameEvent['category'] {
  if (event.category) return event.category;
  const source = `${event.id} ${event.title} ${event.description}`;
  if (/education|college|student|進学|学生|卒業|高校/.test(source)) return 'education';
  if (/career|job|salary|retirement|manager|company|worker|仕事|会社|職|退職|管理職|給料/.test(source)) return event.id.includes('retirement') ? 'retirement' : 'career';
  if (/dating|marriage|partner|breakup|divorce|恋人|結婚|パートナー|離婚|夫婦/.test(source)) return 'partner';
  if (/child|grandchild|子ども|孫|育児/.test(source)) return 'children';
  if (/parent|family|実家|親|家族/.test(source)) return 'family';
  if (/house|home|mortgage|住|家|ローン/.test(source)) return 'housing';
  if (/health|sick|hospital|健康|病|入院|体調/.test(source)) return 'health';
  if (/friend|colleague|old_friend|友人|同期|知人/.test(source)) return 'friendship';
  if (/local|neighbor|store|community|自治会|地域|近所|店/.test(source)) return 'community';
  if (/emergency|contact|shelter|緊急|避難|見守り/.test(source)) return 'emergency';
  if (event.id.startsWith('random_')) return 'random';
  if (event.id.includes('fallback') || event.id.includes('reflection')) return 'reflection';
  return undefined;
}

export function getEventTopicKey(event: GameEvent): string | undefined {
  if (event.topicKey) return event.topicKey;
  return event.id
    .replace(/^life_/, '')
    .replace(/^random_/, '')
    .replace(/^adaptive_/, '')
    .replace(/_choice_\d+$/, '')
    .replace(/_\d+$/, '');
}

function getSeenTopicKeys(state: PlayerState): Set<string> {
  const allEvents = getAllEvents();
  const topics = new Set(state.history.map(entry => entry.topicKey).filter(Boolean) as string[]);
  for (const id of state.seenEventIds) {
    const event = allEvents.find(candidate => candidate.id === id);
    const topic = event ? getEventTopicKey(event) : undefined;
    if (topic) topics.add(topic);
  }
  return topics;
}

export function hasSeenTopic(state: PlayerState, event: GameEvent): boolean {
  const topicKey = getEventTopicKey(event);
  if (!topicKey) return false;
  if (event.isFallback) {
    return state.seenEventIds.slice(-5).some(id => id === event.id);
  }
  return getSeenTopicKeys(state).has(topicKey);
}

export function getRecentCategories(state: PlayerState, count: number): Array<GameEvent['category']> {
  const allEvents = getAllEvents();
  return state.seenEventIds
    .slice(-count)
    .map(id => {
      const event = allEvents.find(candidate => candidate.id === id);
      return event ? getEventCategory(event) : undefined;
    })
    .filter(Boolean);
}

export function isCategoryTooRecent(state: PlayerState, event: GameEvent, windowTurns = 3): boolean {
  const category = getEventCategory(event);
  if (!category || event.isFallback) return false;
  const recent = getRecentCategories(state, windowTurns);
  return recent.length >= windowTurns && recent.every(recentCategory => recentCategory === category);
}

export function isDuplicateLikeEvent(state: PlayerState, event: GameEvent): boolean {
  if (event.isFallback) return state.seenEventIds.includes(event.id);
  if (state.seenEventIds.includes(event.id)) return true;
  const topicKey = getEventTopicKey(event);
  if (!topicKey) return false;
  if (event.once || event.type === 'life_event') return hasSeenTopic(state, event);
  return hasSeenTopic(state, event) && !event.cooldownTurns;
}

function isEventAvailable(
  state: PlayerState,
  event: GameEvent,
  options: { allowFallback?: boolean; ignoreDuplicate?: boolean; ignoreCategoryRecency?: boolean } = {}
): boolean {
  if (!options.allowFallback && event.isFallback) return false;
  if (!isInAgeRange(state, event)) return false;
  if (!checkConditions(event, state)) return false;
  if (!options.ignoreDuplicate && isDuplicateLikeEvent(state, event)) return false;
  if (!options.ignoreCategoryRecency && isCategoryTooRecent(state, event)) return false;
  return true;
}

export function scoreEvent(state: PlayerState, event: GameEvent, previousEvent?: GameEvent | null): number {
  let score = event.priority ?? 0;
  const category = getEventCategory(event);
  const previousCategory = previousEvent ? getEventCategory(previousEvent) : getRecentCategories(state, 1)[0];
  const topicKey = getEventTopicKey(event);
  const previousTopicKey = previousEvent ? getEventTopicKey(previousEvent) : undefined;

  if (event.type === 'life_event') score += 10;
  if (adaptiveEvents.some(candidate => candidate.id === event.id)) score += 8;
  if (event.id.startsWith('start_') || event.id.startsWith('early_career_')) score += 20;
  if (category && previousCategory && category === previousCategory) score += 5;
  if (topicKey && previousTopicKey && topicKey === previousTopicKey) score += 8;
  if (event.id.startsWith('random_')) score -= 8;
  if (event.isFallback) score -= 100;

  const range = event.ageRange || event.conditions?.ageRange;
  if (range) {
    const center = (range[0] + range[1]) / 2;
    score += Math.max(0, 8 - Math.abs(state.lifeStatus.age - center) / 3);
  }
  if (category && getRecentCategories(state, 3).filter(recent => recent === category).length >= 2) {
    score -= 8;
  }

  return score + Math.random() * 2;
}

function pickBestEvent(state: PlayerState, candidates: GameEvent[], previousEvent?: GameEvent | null): GameEvent | null {
  if (candidates.length === 0) return null;
  const ranked = candidates
    .map(event => ({ event, score: scoreEvent(state, event, previousEvent) }))
    .sort((a, b) => b.score - a.score);
  const topScore = ranked[0].score;
  const close = ranked.filter(item => item.score >= topScore - 3).slice(0, 3);
  return close[Math.floor(Math.random() * close.length)].event;
}

function createBridgeFallbackEvent(state: PlayerState): GameEvent {
  const prompts = [
    {
      title: "生活リズムを整える日",
      description: "大きな出来事はない一日。睡眠、食事、外出のどれを少し整えるかを考える。",
      choices: [
        { id: "body", label: "体調を優先して早めに休む", effects: { health: 2, freedom: -1 } },
        { id: "outside", label: "少し外へ出て気分を変える", effects: { outsideWorkBelonging: 1, health: 1 } },
      ],
    },
    {
      title: "連絡先を見直す時間",
      description: "スマートフォンの連絡先を眺めながら、最近話していない人の名前に目が止まる。",
      choices: [
        { id: "message", label: "一人に短い近況を送る", effects: { relationshipCapital: 2, lonelinessRisk: -1 }, flags: { socially_open: true } },
        { id: "close", label: "今日は眺めるだけにする", effects: { freedom: 1 } },
      ],
    },
    {
      title: "部屋の片付け",
      description: "棚の奥に古い書類や思い出の品が残っている。少しだけ整理する時間がある。",
      choices: [
        { id: "sort", label: "必要なものだけ残して整える", effects: { health: 1, meaningCapital: 1 } },
        { id: "leave", label: "今はそのままにしておく", effects: { freedom: 1 } },
      ],
    },
    {
      title: "近所を歩く夕方",
      description: "夕方の空気が少し涼しい。いつもの道を歩くか、知らない道を曲がってみるか。",
      choices: [
        { id: "new_route", label: "知らない道を少し歩く", effects: { localCommunity: 1, health: 1 } },
        { id: "usual", label: "いつもの道で早めに帰る", effects: { freedom: 1 } },
      ],
    },
  ] as const;
  const prompt = prompts[state.turnCount % prompts.length];

  return {
    id: `bridge_reflection_${state.turnCount + 1}`,
    type: 'choice',
    category: 'reflection',
    topicKey: `bridge_reflection_${state.turnCount + 1}`,
    isFallback: true,
    title: prompt.title,
    description: prompt.description,
    ageRange: [18, 75],
    choices: prompt.choices.map(choice => ({
      id: choice.id,
      label: choice.label,
      effects: choice.effects,
      flags: 'flags' in choice ? choice.flags : undefined,
    })),
  };
}

export function getFollowUpEvent(
  state: PlayerState,
  followUp: string | string[] | null,
  previousEvent?: GameEvent | null
): GameEvent | null {
  const followUpIds = Array.isArray(followUp) ? followUp : followUp ? [followUp] : [];
  if (followUpIds.length === 0) return null;

  const directCandidates: GameEvent[] = [];
  for (const id of followUpIds) {
    const event = findEventById(id);
    if (!event) {
      console.warn(`[gameEngine] followUpEventId "${id}" was not found.`);
      continue;
    }
    const sameFollowUpTopic = previousEvent && getEventTopicKey(event) === getEventTopicKey(previousEvent);
    const isUsableFollowUp =
      !state.seenEventIds.includes(event.id) &&
      isEventAvailable(state, event, {
        ignoreCategoryRecency: true,
        ignoreDuplicate: Boolean(sameFollowUpTopic),
      });
    if (isUsableFollowUp) {
      directCandidates.push(event);
    } else {
      console.warn(`[gameEngine] followUpEventId "${id}" was skipped because conditions, age, or duplicate checks failed.`);
    }
  }
  if (directCandidates.length > 0) return pickBestEvent(state, directCandidates, previousEvent);

  if (!previousEvent) return null;
  const previousCategory = getEventCategory(previousEvent);
  const previousTopicKey = getEventTopicKey(previousEvent);
  const alternatives = getAllEvents().filter(event => {
    const sameCategory = previousCategory && getEventCategory(event) === previousCategory;
    const sameTopic = previousTopicKey && getEventTopicKey(event) === previousTopicKey;
    return (sameCategory || sameTopic) && isEventAvailable(state, event, { ignoreCategoryRecency: true });
  });

  return pickBestEvent(state, alternatives, previousEvent);
}

export function pickValidFollowUpId(state: PlayerState, followUpIds?: string[]): string | null {
  return getFollowUpEvent(state, followUpIds ?? null)?.id ?? null;
}

// 次に発生するイベントを選定する
export function getNextEvent(
  state: PlayerState,
  activeFollowUp: string | string[] | null,
  previousEvent?: GameEvent | null
): GameEvent | null {
  if (state.lifeStatus.age >= END_AGE || state.turnCount >= state.targetTurns) {
    return null;
  }

  const followUpEvent = getFollowUpEvent(state, activeFollowUp, previousEvent);
  if (followUpEvent) return followUpEvent;

  if (state.turnCount === 0) {
    const startEvent = findEventById('start_education_choice_01');
    if (startEvent && isEventAvailable(state, startEvent, { ignoreCategoryRecency: true })) return startEvent;
  }

  const currentAge = state.lifeStatus.age;
  if (currentAge >= 18 && currentAge <= 25) {
    const earlyEvents = events.filter(event =>
      (event.id.startsWith('start_') || event.id.startsWith('early_career_')) &&
      isEventAvailable(state, event, { ignoreCategoryRecency: true })
    );
    const earlyEvent = pickBestEvent(state, earlyEvents, previousEvent);
    if (earlyEvent) return earlyEvent;
  }

  const includeRandom = Math.random() < 0.18;
  const candidates = [
    ...adaptiveEvents,
    ...lifeEvents,
    ...events.filter(event => !event.id.startsWith('start_') && !event.id.startsWith('early_career_')),
    ...(includeRandom ? randomEvents : []),
  ].filter(event => isEventAvailable(state, event));

  const bestEvent = pickBestEvent(state, candidates, previousEvent);
  if (bestEvent) return bestEvent;

  const fallbackCandidates = events.filter(event =>
    event.isFallback &&
    isEventAvailable(state, event, { allowFallback: true, ignoreDuplicate: false, ignoreCategoryRecency: true })
  );
  return pickBestEvent(state, fallbackCandidates, previousEvent) ?? createBridgeFallbackEvent(state);
}

// 状態の矛盾を自動補正する安全装置
export function normalizeState(state: PlayerState): PlayerState {
  const nextLifeStatus = { ...state.lifeStatus };
  const nextFlags = { ...state.flags };

  if (nextLifeStatus.childrenCount <= 0) {
    nextLifeStatus.childrenCount = 0;
    nextFlags.has_child = false;
    nextFlags.has_infant_child = false;
    nextFlags.grandchild_related = false;
    nextFlags.has_grandchild = false;
  } else {
    nextFlags.has_child = true;
  }

  if (nextLifeStatus.maritalStatus !== 'married') {
    nextFlags.lives_with_partner = false;
    nextFlags.partner_relationship_good = false;
    nextFlags.partner_relationship_distant = false;
  }

  if (nextLifeStatus.maritalStatus === 'married') {
    nextFlags.lives_with_partner = true;
  }

  if (['single', 'divorced', 'widowed'].includes(nextLifeStatus.maritalStatus)) {
    nextFlags.partner_relationship_good = false;
    nextFlags.partner_relationship_distant = false;
    nextFlags.lives_with_partner = false;
  }

  if (nextLifeStatus.maritalStatus === 'single') {
    nextFlags.lives_with_partner = false;
    if (nextLifeStatus.childrenCount === 0) {
      nextFlags.lives_with_family = false;
    }
  }

  if (nextLifeStatus.housingStatus === 'withPartner' && !['dating', 'married'].includes(nextLifeStatus.maritalStatus)) {
    nextLifeStatus.housingStatus = nextFlags.left_parent_home || nextLifeStatus.age >= 23 ? 'alone' : 'withParents';
  }

  if (
    nextLifeStatus.housingStatus === 'withFamily' &&
    nextLifeStatus.childrenCount === 0 &&
    nextLifeStatus.maritalStatus !== 'married'
  ) {
    nextLifeStatus.housingStatus = nextFlags.left_parent_home || nextLifeStatus.age >= 23 ? 'alone' : 'withParents';
    nextFlags.lives_with_family = false;
  }

  if (nextLifeStatus.housingStatus === 'withFamily') {
    nextFlags.lives_with_family = true;
  }

  if (!['withPartner', 'withFamily'].includes(nextLifeStatus.housingStatus)) {
    nextFlags.lives_with_family = false;
  }

  if (nextFlags.childfree_path) {
    nextFlags.open_to_family = false;
  }

  if (nextFlags.open_to_family) {
    nextFlags.childfree_path = false;
  }

  if (nextFlags.divorced_path) {
    nextFlags.partner_relationship_good = false;
    nextFlags.partner_relationship_distant = false;
    nextFlags.lives_with_partner = false;
  }

  return {
    ...state,
    lifeStatus: nextLifeStatus,
    flags: nextFlags
  };
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

  if (effects?.health !== undefined && !lifeStatusEffects?.healthStatus) {
    nextLifeStatus.healthStatus = getHealthStatusFromValue(nextStats.health);
  }

  const nextState = {
    ...currentState,
    stats: nextStats,
    lifeStatus: nextLifeStatus,
    flags: nextFlags
  };

  return normalizeState(nextState);
}

function getHealthStatusFromValue(health: number): LifeStatus['healthStatus'] {
  if (health >= 13) return 'good';
  if (health >= 8) return 'normal';
  if (health >= 4) return 'anxious';
  return 'needsSupport';
}

function getAgingHealthPenalty(previousAge: number, nextAge: number): number {
  let penalty = 0;

  for (let age = previousAge + 1; age <= nextAge; age += 1) {
    if (age >= 65 && age % 3 === 0) {
      penalty += 1;
    } else if (age >= 55 && age < 65 && age % 4 === 0) {
      penalty += 1;
    } else if (age >= 45 && age < 55 && age % 5 === 0) {
      penalty += 1;
    }
  }

  return penalty;
}

export function applyAgingEffects(state: PlayerState, previousAge: number, nextAge: number): PlayerState {
  const healthPenalty = getAgingHealthPenalty(previousAge, nextAge);
  if (healthPenalty <= 0) return state;

  const nextHealth = Math.max(0, state.stats.health - healthPenalty);

  return {
    ...state,
    stats: {
      ...state.stats,
      health: nextHealth,
    },
    lifeStatus: {
      ...state.lifeStatus,
      healthStatus: getHealthStatusFromValue(nextHealth),
    },
  };
}

// 年齢進行の判定ロジック
export function advanceAge(currentAge: number, completedTurns: number, targetTurns: number = TARGET_TURNS): number {
  if (currentAge >= END_AGE || completedTurns >= targetTurns) return END_AGE;

  const progress = completedTurns / targetTurns;
  const nextAge = Math.floor(START_AGE + (END_AGE - START_AGE) * progress);

  return Math.max(currentAge, Math.min(END_AGE, nextAge));
}

export function validateEventDefinitions(allEvents: GameEvent[]): void {
  const ids = new Set<string>();
  const duplicateIds = new Set<string>();
  const topicCounts = new Map<string, number>();
  const allIds = new Set(allEvents.map(event => event.id));

  for (const event of allEvents) {
    if (ids.has(event.id)) duplicateIds.add(event.id);
    ids.add(event.id);

    const topicKey = getEventTopicKey(event);
    if (topicKey) topicCounts.set(topicKey, (topicCounts.get(topicKey) ?? 0) + 1);

    if (event.followUpEventIds) {
      for (const id of event.followUpEventIds) {
        if (!allIds.has(id)) console.warn(`[gameEngine] Missing followUpEventIds target: ${event.id} -> ${id}`);
      }
    }

    for (const choice of event.choices ?? []) {
      if (choice.followUpEventId && !allIds.has(choice.followUpEventId)) {
        console.warn(`[gameEngine] Missing choice followUpEventId target: ${event.id}/${choice.id} -> ${choice.followUpEventId}`);
      }
    }

    const text = `${event.title} ${event.description}`;
    const hasConditions = Boolean(event.conditions);
    if (!hasConditions && /(パートナー|結婚|離婚|子ども|孫|親|会社|仕事|退職|緊急連絡先)/.test(text)) {
      console.warn(`[gameEngine] Event may need conditions: ${event.id}`);
    }
  }

  for (const id of duplicateIds) {
    console.warn(`[gameEngine] Duplicate event id: ${id}`);
  }

  for (const [topicKey, count] of topicCounts) {
    if (count > 2 && topicKey !== 'fallback_reflection') {
      console.warn(`[gameEngine] Repeated topicKey "${topicKey}" appears ${count} times.`);
    }
  }
}

if (import.meta.env?.DEV) {
  validateEventDefinitions(getAllEvents());
}
