import type { GameEvent } from '../types/game';

export const randomEvents: GameEvent[] = [
  {
    id: "random_bankruptcy_01",
    type: "choice",
    title: "会社の経営危機",
    description: "勤務先の会社が急激に傾き、人員整理の対象に選ばれてしまった。どう対応する？",
    ageRange: [30, 55],
    conditions: {
      jobStatus: ["employee", "manager"]
    },
    choices: [
      {
        id: "quit",
        label: "退職金上乗せを受け入れ辞める",
        effects: { money: 4, freedom: 3, career: -3 },
        lifeStatusEffects: { jobStatus: "unemployed" }
      },
      {
        id: "stay",
        label: "残って再建のために働き続ける",
        effects: { career: 3, health: -4, freedom: -2 }
      }
    ],
    once: true
  },
  {
    id: "random_parent_hospital_01",
    type: "choice",
    title: "実家からの緊急コール",
    description: "夜中、実家の近所の人から親が倒れて緊急搬送されたと連絡が入った。どうする？",
    ageRange: [40, 75],
    choices: [
      {
        id: "go",
        label: "明朝一番の特急で実家へ向かう",
        effects: { familyCapital: 5, money: -3, freedom: -2 }
      },
      {
        id: "wait",
        label: "病院からの正式な連絡を待つ",
        effects: { freedom: 1, familyCapital: -4, lonelinessRisk: 1 }
      }
    ],
    once: true
  },
  {
    id: "random_friend_contact_01",
    type: "choice",
    title: "懐かしい名前からのメッセージ",
    description: "数年やり取りのなかった友人から「近くに来てるんだけど、今夜時間ある？」と連絡が来た。",
    conditions: {
      requiredFlags: ["has_old_friends"]
    },
    choices: [
      {
        id: "meet",
        label: "短時間だけでも会いに行く",
        effects: { relationshipCapital: 4, money: -2, freedom: -1 }
      },
      {
        id: "decline",
        label: "忙しいので丁寧に断る",
        effects: { freedom: 2, relationshipCapital: -2 }
      }
    ],
    once: true
  },
  {
    id: "random_neighbor_help_01",
    type: "choice",
    title: "鍵を忘れて締め出された",
    description: "ゴミ出しの際、ドアが閉まり閉め出されてしまった。近所の人に助けを求める？",
    conditions: {
      localConnection: ["medium", "strong"]
    },
    choices: [
      {
        id: "ask",
        label: "近所の人に声をかけ携帯を借りる",
        effects: { localCommunity: 4, emergencySupport: 2 }
      },
      {
        id: "search",
        label: "管理会社に自力で連絡する",
        effects: { freedom: 2, money: -2 }
      }
    ],
    once: true
  },
  {
    id: "random_sick_alone_01",
    type: "choice",
    title: "激しい高熱で動けない",
    description: "季節性のインフルエンザにかかり、高熱で布団から起き上がれない。どうする？",
    ageRange: [50, 75],
    choices: [
      {
        id: "contact",
        label: "誰かに連絡して買い出しを頼む",
        effects: { emergencySupport: 4, familyCapital: 1, lonelinessRisk: -3 }
      },
      {
        id: "endure",
        label: "ポカリを飲んでひたすら耐える",
        effects: { health: -4, freedom: 1, lonelinessRisk: 4 }
      }
    ],
    once: true
  },
  {
    id: "random_partner_sick_01",
    type: "choice",
    title: "パートナーの緊急入院",
    description: "パートナーが突然激しい腹痛を訴え救急車で運ばれた。仕事の重要な会議がある。",
    conditions: {
      maritalStatus: ["married"]
    },
    choices: [
      {
        id: "accompany",
        label: "仕事を休んで付き添う",
        effects: { familyCapital: 5, career: -3, health: -1 }
      },
      {
        id: "work",
        label: "会議を終えてから病院へ行く",
        effects: { career: 3, familyCapital: -4 }
      }
    ],
    once: true
  },
  {
    id: "random_scam_call_01",
    type: "choice",
    title: "怪しい電話（給付金手続き）",
    description: "「市役所の者ですが、還付金があります。ATMへ行ってください」と電話が来た。",
    ageRange: [70, 75],
    choices: [
      {
        id: "consult",
        label: "一度切って家族や警察に相談する",
        effects: { emergencySupport: 3, relationshipCapital: 2 }
      },
      {
        id: "listen",
        label: "本当かもしれないので詳しく聞く",
        effects: { money: -5, lonelinessRisk: 4, health: -1 }
      }
    ],
    once: true
  },
  {
    id: "random_store_close_alt_01",
    type: "choice",
    title: "お気に入りの喫茶店が移転",
    description: "朝、毎日のように通っていた喫茶店が隣町に移転することになった。どうする？",
    conditions: {
      localConnection: ["medium", "strong"]
    },
    choices: [
      {
        id: "follow",
        label: "隣町まで週1回通い続ける",
        effects: { outsideWorkBelonging: 3, health: 1, money: -2 }
      },
      {
        id: "stop",
        label: "通うのをあきらめる",
        effects: { freedom: 2, outsideWorkBelonging: -3 }
      }
    ],
    once: true
  },
  {
    id: "random_disaster_shelter_01",
    type: "choice",
    title: "大型台風で避難勧告",
    description: "大雨で近くの川が警戒水位に。地域の避難所に行くか、自宅の上階で耐えるか。",
    ageRange: [60, 75],
    choices: [
      {
        id: "shelter",
        label: "避難所へ行き周りと助け合う",
        effects: { localCommunity: 5, emergencySupport: 3, freedom: -3 }
      },
      {
        id: "home",
        label: "住み慣れた自宅の上階で耐える",
        effects: { freedom: 3, health: -3, lonelinessRisk: 3 }
      }
    ],
    once: true
  },
  {
    id: "random_animal_encounter_01",
    type: "choice",
    title: "庭先の一匹の迷い猫",
    description: "雨の日、ガレージの隅で小さく鳴いている子猫を見つけた。ひどく濡れている。",
    conditions: {
      housingStatus: ["alone"]
    },
    choices: [
      {
        id: "feed",
        label: "保護してエサを与えてみる",
        effects: { meaningCapital: 4, money: -2 },
        flags: { has_pet: true }
      },
      {
        id: "ignore",
        label: "心を鬼にして戸を閉める",
        effects: { lonelinessRisk: 1 }
      }
    ],
    once: true
  }
];
