export interface LifeStatus {
  age: number;
  maritalStatus: 'single' | 'dating' | 'married' | 'divorced' | 'widowed';
  childrenCount: number;
  jobStatus: 'student' | 'employee' | 'manager' | 'executive' | 'owner' | 'freelance' | 'unemployed' | 'retired';
  housingStatus: 'withParents' | 'alone' | 'withPartner' | 'withFamily' | 'shared' | 'seniorHousing';
  healthStatus: 'good' | 'normal' | 'anxious' | 'needsSupport';
  localConnection: 'none' | 'weak' | 'medium' | 'strong';
  emergencyContact: 'none' | 'family' | 'friend' | 'neighbor' | 'service' | 'multiple';
}

export interface PlayerStats {
  money: number;
  health: number;
  career: number;
  freedom: number;
  relationshipCapital: number;
  familyCapital: number;
  localCommunity: number;
  outsideWorkBelonging: number;
  nextGeneration: number;
  emergencySupport: number;
  meaningCapital: number;
  lonelinessRisk: number;
}

export interface HistoryEntry {
  eventId: string;
  eventTitle: string;
  age: number;
  selectedChoiceId: string;
  selectedChoiceLabel: string;
  effects: Partial<PlayerStats>;
  lifeStatusEffects: Partial<LifeStatus> & { childrenCountDelta?: number };
  timestamp: number;
}

export interface PlayerState {
  lifeStatus: LifeStatus;
  stats: PlayerStats;
  history: HistoryEntry[];
  flags: Record<string, boolean>;
  seenEventIds: string[];
}

export interface ChoiceEffects {
  stats?: Partial<PlayerStats>;
  lifeStatus?: Partial<LifeStatus> & { childrenCountDelta?: number };
  flags?: Record<string, boolean>;
}

export interface Choice {
  id: string;
  label: string;
  effects: Partial<PlayerStats>;
  lifeStatusEffects?: Partial<LifeStatus> & { childrenCountDelta?: number };
  flags?: Record<string, boolean>;
  followUpEventId?: string; // フォローアップ用の質問ID
}

export interface EventConditions {
  ageRange?: [number, number];
  maritalStatus?: ('single' | 'dating' | 'married' | 'divorced' | 'widowed')[];
  childrenCount?: number;
  childrenCountMin?: number;
  childrenCountMax?: number;
  jobStatus?: ('student' | 'employee' | 'manager' | 'executive' | 'owner' | 'freelance' | 'unemployed' | 'retired')[];
  housingStatus?: ('withParents' | 'alone' | 'withPartner' | 'withFamily' | 'shared' | 'seniorHousing')[];
  healthStatus?: ('good' | 'normal' | 'anxious' | 'needsSupport')[];
  localConnection?: ('none' | 'weak' | 'medium' | 'strong')[];
  emergencyContact?: ('none' | 'family' | 'friend' | 'neighbor' | 'service' | 'multiple')[];
  requiredFlags?: string[];
  excludedFlags?: string[];
  minStats?: Partial<PlayerStats>;
  maxStats?: Partial<PlayerStats>;
}

export interface GameEvent {
  id: string;
  type: 'choice' | 'life_event';
  title: string;
  description: string;
  ageRange?: [number, number];
  conditions?: EventConditions;
  effects?: Partial<PlayerStats>; // life_event用
  lifeStatusEffects?: Partial<LifeStatus> & { childrenCountDelta?: number }; // life_event用
  choices?: Choice[]; // choice用
  followUpEventIds?: string[]; // life_event用
  once?: boolean;
}

export interface Ending {
  id: string;
  title: string;
  type: 'connected_life' | 'independent_but_connected' | 'family_present_but_lonely' | 'work_identity_loss' | 'isolated_life' | 'reconnectable_life';
  description: string;
  conditions: (state: PlayerState) => boolean;
  actions: string[]; // 現実でできる小さな行動
}
