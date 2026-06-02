import type { GameEvent } from '../types/game';

export const adaptiveEvents: GameEvent[] = [
  {
    id: "adaptive_low_money_20s_01",
    type: "choice",
    title: "月末の残高",
    description: "給料日前、口座残高が心細い。誘われていた食事会に行く？",
    ageRange: [23, 29],
    conditions: {
      maxStats: { money: 5 }
    },
    choices: [
      {
        id: "go",
        label: "顔だけ出して関係を保つ",
        effects: { relationshipCapital: 2, money: -2, lonelinessRisk: -1 },
        flags: { socially_open: true }
      },
      {
        id: "skip",
        label: "節約を優先して断る",
        effects: { money: 2, relationshipCapital: -1, freedom: 1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_high_career_30s_01",
    type: "choice",
    title: "評価面談のあと",
    description: "仕事の評価は高い。一方で、友人からの連絡にはほとんど返せていない。",
    ageRange: [30, 39],
    conditions: {
      minStats: { career: 10 },
      maxStats: { relationshipCapital: 6 }
    },
    choices: [
      {
        id: "reply",
        label: "今夜まとめて返信する",
        effects: { relationshipCapital: 3, freedom: -1, lonelinessRisk: -1 },
        flags: { socially_open: true }
      },
      {
        id: "work",
        label: "今は仕事に集中する",
        effects: { career: 3, relationshipCapital: -2, lonelinessRisk: 1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_family_low_30s_01",
    type: "choice",
    title: "実家からの不在着信",
    description: "親から何度か着信があった。特に用件は書かれていない。",
    ageRange: [30, 39],
    conditions: {
      maxStats: { familyCapital: 5 }
    },
    choices: [
      {
        id: "call_back",
        label: "帰り道に電話する",
        effects: { familyCapital: 3, freedom: -1, emergencySupport: 1 }
      },
      {
        id: "later",
        label: "落ち着いたら返すことにする",
        effects: { freedom: 2, familyCapital: -2 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_health_low_40s_01",
    type: "choice",
    title: "階段で息が切れる",
    description: "以前なら平気だった駅の階段で足が重い。生活を見直すきっかけにする？",
    ageRange: [40, 49],
    conditions: {
      maxStats: { health: 5 }
    },
    choices: [
      {
        id: "walk",
        label: "一駅分だけ歩く習慣を作る",
        effects: { health: 3, meaningCapital: 1, freedom: -1 }
      },
      {
        id: "ignore",
        label: "年齢のせいにして流す",
        effects: { freedom: 1, health: -2, lonelinessRisk: 1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_local_none_40s_01",
    type: "choice",
    title: "管理組合の掲示板",
    description: "マンションの清掃活動のお知らせが貼られている。休日の朝だ。",
    ageRange: [40, 55],
    conditions: {
      localConnection: ["none", "weak"],
      maxStats: { localCommunity: 4 }
    },
    choices: [
      {
        id: "join",
        label: "30分だけ参加してみる",
        effects: { localCommunity: 3, emergencySupport: 1, freedom: -1 },
        lifeStatusEffects: { localConnection: "weak" }
      },
      {
        id: "pass",
        label: "関わらずに済ませる",
        effects: { freedom: 2, localCommunity: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_relationship_low_40s_01",
    type: "choice",
    title: "連絡先だけ増えていく",
    description: "スマホには知人の名前が並ぶが、最近会った人は少ない。",
    ageRange: [40, 49],
    conditions: {
      maxStats: { relationshipCapital: 5 }
    },
    choices: [
      {
        id: "invite",
        label: "一人にだけ近況を送る",
        effects: { relationshipCapital: 3, lonelinessRisk: -1 },
        flags: { socially_open: true }
      },
      {
        id: "scroll",
        label: "画面だけ眺めて閉じる",
        effects: { freedom: 1, lonelinessRisk: 2 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_childless_50s_01",
    type: "choice",
    title: "若手からの相談",
    description: "職場の若手が、キャリアのことで相談したそうにしている。",
    ageRange: [50, 59],
    conditions: {
      childrenCountMax: 0,
      minStats: { career: 8 }
    },
    choices: [
      {
        id: "mentor",
        label: "時間を取って話を聞く",
        effects: { nextGeneration: 4, meaningCapital: 3, freedom: -1 }
      },
      {
        id: "busy",
        label: "忙しいので軽く流す",
        effects: { career: 1, freedom: 2, nextGeneration: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_alone_50s_01",
    type: "choice",
    title: "休日の無言",
    description: "誰とも話さないまま夕方になった。少しだけ外へ出る？",
    ageRange: [50, 59],
    conditions: {
      housingStatus: ["alone"],
      maxStats: { outsideWorkBelonging: 5 }
    },
    choices: [
      {
        id: "cafe",
        label: "近所の店で夕食を食べる",
        effects: { outsideWorkBelonging: 3, localCommunity: 1, money: -2 }
      },
      {
        id: "delivery",
        label: "配達で済ませる",
        effects: { freedom: 2, money: -1, lonelinessRisk: 2 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_partner_good_50s_01",
    type: "choice",
    title: "二人の予定表",
    description: "パートナーと過ごす時間はあるが、会話は生活の連絡に寄りがちだ。",
    ageRange: [50, 59],
    conditions: {
      maritalStatus: ["married"],
      requiredFlags: ["partner_relationship_good"]
    },
    choices: [
      {
        id: "date",
        label: "月一回の外食を決める",
        effects: { familyCapital: 3, relationshipCapital: 1, money: -2 }
      },
      {
        id: "routine",
        label: "今のままで十分と考える",
        effects: { freedom: 2, familyCapital: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_emergency_low_60s_01",
    type: "choice",
    title: "保証人の欄",
    description: "新しい契約書に緊急時の連絡先を書く欄がある。すぐには名前が浮かばない。",
    ageRange: [60, 69],
    conditions: {
      maxStats: { emergencySupport: 4 }
    },
    choices: [
      {
        id: "ask",
        label: "頼めそうな人に確認する",
        effects: { emergencySupport: 4, relationshipCapital: 1, lonelinessRisk: -2 },
        lifeStatusEffects: { emergencyContact: "friend" }
      },
      {
        id: "blank",
        label: "いったん空欄にしておく",
        effects: { freedom: 1, lonelinessRisk: 3 },
        lifeStatusEffects: { emergencyContact: "none" }
      }
    ],
    once: true
  },
  {
    id: "adaptive_meaning_low_60s_01",
    type: "choice",
    title: "朝の予定がない",
    description: "カレンダーが真っ白な週が続く。何か役割を作る？",
    ageRange: [60, 69],
    conditions: {
      maxStats: { meaningCapital: 5 }
    },
    choices: [
      {
        id: "role",
        label: "週一回の手伝いを探す",
        effects: { meaningCapital: 4, localCommunity: 2, freedom: -2 }
      },
      {
        id: "free",
        label: "予定がない自由を味わう",
        effects: { freedom: 3, meaningCapital: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_money_low_60s_01",
    type: "choice",
    title: "年金だけの計算",
    description: "支出を見直すと、思ったより余裕がない。働き方を少し戻す？",
    ageRange: [60, 69],
    conditions: {
      maxStats: { money: 6 }
    },
    choices: [
      {
        id: "part_time",
        label: "短時間の仕事を探す",
        effects: { money: 4, outsideWorkBelonging: 2, freedom: -2 },
        lifeStatusEffects: { jobStatus: "employee" }
      },
      {
        id: "cut_cost",
        label: "支出を削って暮らす",
        effects: { money: 2, freedom: -1, lonelinessRisk: 1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_loneliness_high_70s_01",
    type: "choice",
    title: "誰にも話していない不安",
    description: "夜になると、もし倒れたら誰が気づくだろうと考えてしまう。",
    ageRange: [70, 75],
    conditions: {
      minStats: { lonelinessRisk: 8 }
    },
    choices: [
      {
        id: "tell",
        label: "支援窓口に相談する",
        effects: { emergencySupport: 5, lonelinessRisk: -4, localCommunity: 1 },
        lifeStatusEffects: { emergencyContact: "service" }
      },
      {
        id: "hide",
        label: "大げさにしたくなくて黙る",
        effects: { freedom: 1, health: -1, lonelinessRisk: 4 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_high_local_70s_01",
    type: "choice",
    title: "地域の人からの頼まれごと",
    description: "近所の人に、見守り活動の声かけ役を頼まれた。",
    ageRange: [70, 75],
    conditions: {
      localConnection: ["medium", "strong"],
      minStats: { localCommunity: 8 }
    },
    choices: [
      {
        id: "accept",
        label: "無理ない範囲で引き受ける",
        effects: { localCommunity: 4, meaningCapital: 3, freedom: -2 },
        lifeStatusEffects: { localConnection: "strong" }
      },
      {
        id: "decline",
        label: "体力を理由に断る",
        effects: { freedom: 2, localCommunity: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_health_low_70s_01",
    type: "choice",
    title: "薬の飲み忘れ",
    description: "処方薬が余っている。どうやら何度か飲み忘れていたようだ。",
    ageRange: [70, 75],
    conditions: {
      maxStats: { health: 6 }
    },
    choices: [
      {
        id: "setup",
        label: "薬箱と通知を整える",
        effects: { health: 3, emergencySupport: 1, freedom: -1 }
      },
      {
        id: "memory",
        label: "まだ自分の記憶で大丈夫",
        effects: { freedom: 2, health: -3 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_no_contact_70s_01",
    type: "choice",
    title: "電話帳の一番上",
    description: "緊急時に誰へ電話するか、スマホを開いて考える。",
    ageRange: [70, 75],
    conditions: {
      emergencyContact: ["none"]
    },
    choices: [
      {
        id: "pin",
        label: "連絡先を一人固定する",
        effects: { emergencySupport: 5, lonelinessRisk: -3 },
        lifeStatusEffects: { emergencyContact: "friend" }
      },
      {
        id: "later",
        label: "今度でいいと閉じる",
        effects: { freedom: 1, lonelinessRisk: 3 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_family_high_70s_01",
    type: "choice",
    title: "親しい人からの写真",
    description: "家族や親しい人から何気ない日常の写真が届いた。返信する？",
    ageRange: [70, 75],
    conditions: {
      minStats: { familyCapital: 10 }
    },
    choices: [
      {
        id: "reply",
        label: "短くても返事を送る",
        effects: { familyCapital: 3, nextGeneration: 1, lonelinessRisk: -1 }
      },
      {
        id: "watch",
        label: "見るだけで満足する",
        effects: { freedom: 1, familyCapital: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_work_identity_70s_01",
    type: "choice",
    title: "肩書きのない自己紹介",
    description: "初対面の集まりで、元の会社名以外に何を話せばいいか迷う。",
    ageRange: [65, 75],
    conditions: {
      minStats: { career: 15 },
      maxStats: { outsideWorkBelonging: 6 }
    },
    choices: [
      {
        id: "new_topic",
        label: "今の関心ごとを話す",
        effects: { meaningCapital: 3, outsideWorkBelonging: 2, lonelinessRisk: -1 }
      },
      {
        id: "old_title",
        label: "昔の肩書きを詳しく話す",
        effects: { career: 1, outsideWorkBelonging: -1 }
      }
    ],
    once: true
  },
  {
    id: "adaptive_pet_later_70s_01",
    type: "choice",
    title: "世話を続ける体力",
    description: "ペットとの暮らしは支えになっているが、通院や世話の負担も増えてきた。",
    ageRange: [65, 75],
    conditions: {
      requiredFlags: ["has_pet"]
    },
    choices: [
      {
        id: "support",
        label: "預け先や相談先を決める",
        effects: { emergencySupport: 3, meaningCapital: 2, money: -1 }
      },
      {
        id: "alone",
        label: "自分だけで面倒を見る",
        effects: { meaningCapital: 2, health: -2, lonelinessRisk: 1 }
      }
    ],
    once: true
  }
];
