import type { GameEvent } from '../types/game';

export const events: GameEvent[] = [
  // ==================== 18-22歳 ====================
  {
    id: "choice_leave_home_01",
    type: "choice",
    title: "自立か、実家か",
    description: "進学・就職を控え、親元を離れて一人暮らしをするか、それとも実家にとどまるか。",
    ageRange: [18, 22],
    conditions: {
      housingStatus: ["withParents"]
    },
    choices: [
      {
        id: "leave",
        label: "一人暮らしに挑戦",
        effects: { freedom: 3, money: -3 },
        flags: { left_parent_home: true }
      },
      {
        id: "stay",
        label: "実家に残る",
        effects: { money: 3, familyCapital: 2 },
        flags: { left_parent_home: false }
      }
    ],
    once: true
  },
  {
    id: "choice_career_path_01",
    type: "choice",
    title: "初めての就職選択",
    description: "安定した大企業への就職を目指すか、裁量の大きい小さなベンチャーへ進むか。",
    ageRange: [18, 22],
    choices: [
      {
        id: "stable",
        label: "大企業に入社する",
        effects: { career: 2, money: 2, freedom: -1 },
        lifeStatusEffects: { jobStatus: "employee" }
      },
      {
        id: "venture",
        label: "ベンチャーに飛び込む",
        effects: { career: 3, freedom: 1, money: -1 },
        lifeStatusEffects: { jobStatus: "employee" },
        flags: { aspire_independent: true }
      }
    ],
    once: true
  },
  {
    id: "choice_friendship_early_01",
    type: "choice",
    title: "週末の過ごし方",
    description: "大学や仕事のあと、新しい友達と飲みに出かけるか、自分の趣味に時間を使うか。",
    ageRange: [18, 22],
    choices: [
      {
        id: "hangout",
        label: "友達と遊びに行く",
        effects: { relationshipCapital: 3, money: -2 },
        flags: { has_old_friends: true, socially_open: true }
      },
      {
        id: "hobby",
        label: "一人で趣味に没頭する",
        effects: { freedom: 3, meaningCapital: 2 }
      }
    ]
  },

  // ==================== 23-29歳 ====================
  {
    id: "choice_drink_01",
    type: "choice",
    title: "会社の飲み会に誘われた",
    description: "少し疲れている今日の仕事終わり。同期たちからの誘いがある。どうする？",
    ageRange: [23, 29],
    conditions: {
      jobStatus: ["employee"]
    },
    choices: [
      {
        id: "go_drink",
        label: "一杯だけ付き合う",
        effects: { relationshipCapital: 3, health: -1, freedom: -1 },
        flags: { socially_open: true }
      },
      {
        id: "go_home",
        label: "今日は帰って休む",
        effects: { health: 2, freedom: 1, relationshipCapital: -1 }
      }
    ]
  },
  {
    id: "choice_overtime_01",
    type: "choice",
    title: "残業を頼まれた",
    description: "定時間際に、上司から急ぎの仕事を頼まれた。プライベートの予定があるが……",
    ageRange: [23, 29],
    conditions: {
      jobStatus: ["employee"]
    },
    choices: [
      {
        id: "accept",
        label: "引き受けて残業する",
        effects: { career: 3, money: 2, health: -2 },
        flags: { work_harder: true }
      },
      {
        id: "decline",
        label: "断って約束を優先する",
        effects: { freedom: 3, relationshipCapital: 2, career: -1 },
        flags: { relationship_prioritized: true }
      }
    ]
  },

  // ==================== 30-39歳 ====================
  {
    id: "choice_hobby_class_01",
    type: "choice",
    title: "習い事を始めるか",
    description: "社外のコミュニティに興味が湧いた。料理教室やスポーツジムに通ってみる？",
    ageRange: [30, 39],
    choices: [
      {
        id: "join",
        label: "スクールに入会する",
        effects: { outsideWorkBelonging: 4, money: -3, relationshipCapital: 2 },
        flags: { socially_open: true }
      },
      {
        id: "dont_join",
        label: "貯金に回す",
        effects: { money: 3, freedom: 1 }
      }
    ],
    once: true
  },
  {
    id: "choice_visit_parents_01",
    type: "choice",
    title: "長期休暇の予定",
    description: "久しぶりの大型連休。実家に帰省するか、それとも一人で旅行に出かけるか。",
    ageRange: [30, 39],
    choices: [
      {
        id: "parents",
        label: "実家に帰省する",
        effects: { familyCapital: 4, money: -2 },
        flags: { parents_connected: true }
      },
      {
        id: "travel",
        label: "一人で旅行に行く",
        effects: { freedom: 4, money: -3 }
      }
    ]
  },

  // ==================== 40-49歳 ====================
  {
    id: "choice_health_check_01",
    type: "choice",
    title: "体の不調を覚える",
    description: "最近疲れが取れにくく、たまに胸が痛む。すぐに検査を受けるか、様子を見るか。",
    ageRange: [40, 49],
    choices: [
      {
        id: "check",
        label: "病院で検査を受ける",
        effects: { health: 3, money: -2, freedom: -1 }
      },
      {
        id: "wait",
        label: "様子を見る",
        effects: { freedom: 1, health: -3, lonelinessRisk: 1 }
      }
    ]
  },
  {
    id: "choice_local_festival_01",
    type: "choice",
    title: "地域のボランティア",
    description: "町内会のイベントのボランティア募集を見かけた。参加してみるか？",
    ageRange: [40, 59],
    choices: [
      {
        id: "volunteer",
        label: "手伝いに申し込む",
        effects: { localCommunity: 4, relationshipCapital: 2, freedom: -2 },
        lifeStatusEffects: { localConnection: "medium" }
      },
      {
        id: "skip",
        label: "家で静かに過ごす",
        effects: { freedom: 2, localCommunity: -1 }
      }
    ]
  },

  // ==================== 50-59歳 ====================
  {
    id: "choice_pet_01",
    type: "choice",
    title: "ペットを飼うか",
    description: "少し寂しい暮らしの中、ペットショップで犬や猫を見かけた。飼い始める？",
    ageRange: [50, 59],
    conditions: {
      housingStatus: ["alone"]
    },
    choices: [
      {
        id: "adopt",
        label: "ペットを迎える",
        effects: { meaningCapital: 5, money: -3, freedom: -3 },
        flags: { has_pet: true }
      },
      {
        id: "refuse",
        label: "あきらめる",
        effects: { money: 2, freedom: 1 }
      }
    ],
    once: true
  },
  {
    id: "choice_alumni_01",
    type: "choice",
    title: "同窓会の誘い",
    description: "何年も連絡を取っていなかった高校の同窓会。仕事が忙しいが、どうする？",
    ageRange: [50, 59],
    choices: [
      {
        id: "attend",
        label: "仕事を休んで参加する",
        effects: { relationshipCapital: 4, money: -2, career: -1 },
        flags: { has_old_friends: true, reconnected_friend: true }
      },
      {
        id: "ignore",
        label: "欠席で返事をする",
        effects: { career: 2, relationshipCapital: -2 }
      }
    ],
    once: true
  },

  // ==================== 60-69歳 ====================
  {
    id: "choice_retirement_hobby_01",
    type: "choice",
    title: "退職後の暇つぶし",
    description: "時間が余る日々。市民サークルに入って趣味を始めるか、自宅で読書やテレビで過ごすか。",
    ageRange: [60, 69],
    conditions: {
      jobStatus: ["retired"]
    },
    choices: [
      {
        id: "circle",
        label: "サークルに参加する",
        effects: { outsideWorkBelonging: 4, relationshipCapital: 2, money: -2 },
        lifeStatusEffects: { localConnection: "medium" }
      },
      {
        id: "home",
        label: "家でゆっくり過ごす",
        effects: { freedom: 3, outsideWorkBelonging: -2 }
      }
    ]
  },
  {
    id: "choice_part_time_01",
    type: "choice",
    title: "再雇用の誘い",
    description: "週に2日だけ、元の職場でシニア枠として働いてみないかと声をかけられた。",
    ageRange: [60, 69],
    conditions: {
      jobStatus: ["retired"]
    },
    choices: [
      {
        id: "work",
        label: "週2回だけ働く",
        effects: { money: 3, outsideWorkBelonging: 3, freedom: -2 },
        lifeStatusEffects: { jobStatus: "employee" } // 一時的に就労へ
      },
      {
        id: "rest",
        label: "完全に隠居する",
        effects: { freedom: 4, money: -1 }
      }
    ],
    once: true
  },

  // ==================== 70-75歳 ====================
  {
    id: "choice_smart_phone_01",
    type: "choice",
    title: "スマホの新しいアプリ",
    description: "地域で高齢者向けの交流チャットアプリが始まった。インストールしてみる？",
    ageRange: [70, 75],
    choices: [
      {
        id: "install",
        label: "アプリを使ってみる",
        effects: { localCommunity: 3, relationshipCapital: 2 },
        lifeStatusEffects: { localConnection: "weak" }
      },
      {
        id: "pass",
        label: "難しそうだからやめる",
        effects: { freedom: 1, lonelinessRisk: 1 }
      }
    ],
    once: true
  },
  {
    id: "choice_neighbors_greeting_01",
    type: "choice",
    title: "近所とのすれ違い",
    description: "ゴミ出しの際、最近引っ越してきた若い夫婦と遭遇した。挨拶をする？",
    ageRange: [70, 75],
    choices: [
      {
        id: "greet",
        label: "笑顔で挨拶する",
        effects: { localCommunity: 3, meaningCapital: 1 },
        lifeStatusEffects: { localConnection: "medium" }
      },
      {
        id: "ignore",
        label: "黙って会釈だけする",
        effects: { localCommunity: -1 }
      }
    ]
  },
  {
    id: "alone_choice_01",
    type: "choice",
    title: "一人暮らしの夜",
    description: "初めての実家を離れた夜。外から聞こえる他人の足音に緊張する。どう過ごす？",
    ageRange: [18, 29],
    choices: [
      {
        id: "outside",
        label: "近所の店に入ってみる",
        effects: { localCommunity: 2, relationshipCapital: 1, money: -1 },
        lifeStatusEffects: { localConnection: "weak" }
      },
      {
        id: "inside",
        label: "部屋で静かに過ごす",
        effects: { freedom: 3, familyCapital: -1 }
      }
    ]
  },
  {
    id: "first_salary_choice_01",
    type: "choice",
    title: "初任給の使い道",
    description: "手にした給料をどう使う？ 記念すべき使い道を決めよう。",
    ageRange: [18, 25],
    choices: [
      {
        id: "treat",
        label: "親や友人に食事をごちそうする",
        effects: { familyCapital: 4, relationshipCapital: 3, money: -3 }
      },
      {
        id: "self",
        label: "自分の欲しかった物を買う",
        effects: { freedom: 4, money: -3 }
      }
    ]
  },
  {
    id: "dating_choice_01",
    type: "choice",
    title: "恋人との週末の対話",
    description: "将来の話が少しずつ出るようになった。結婚についてどう切り出す？",
    ageRange: [23, 35],
    conditions: {
      maritalStatus: ["dating"]
    },
    choices: [
      {
        id: "future",
        label: "真面目に将来の話をする",
        effects: { familyCapital: 3, freedom: -1 },
        flags: { ready_to_marry: true, marriage_avoidant: false }
      },
      {
        id: "present",
        label: "今は今を楽しもうと流す",
        effects: { freedom: 3, relationshipCapital: -1 },
        flags: { ready_to_marry: false, marriage_avoidant: true }
      }
    ]
  },
  {
    id: "breakup_choice_01",
    type: "choice",
    title: "失恋の夜",
    description: "どうしても眠れない、寂しい夜。どうしてこの時間を埋める？",
    ageRange: [23, 39],
    conditions: {
      maritalStatus: ["single"],
      requiredFlags: ["relationship_ended"]
    },
    choices: [
      {
        id: "call",
        label: "友人に電話してみる",
        effects: { relationshipCapital: 3, lonelinessRisk: -2 }
      },
      {
        id: "endure",
        label: "一人で感情を抱え込む",
        effects: { freedom: 2, health: -1, lonelinessRisk: 3 }
      }
    ]
  },
  {
    id: "marriage_choice_01",
    type: "choice",
    title: "家事の分担ルール",
    description: "新生活のルール作り。日々の忙しい家事について話し合う必要がある。",
    ageRange: [24, 40],
    conditions: {
      maritalStatus: ["married"],
      housingStatus: ["withPartner", "withFamily"]
    },
    choices: [
      {
        id: "discuss",
        label: "家事を徹底的に分担する",
        effects: { familyCapital: 3, health: 1 },
        flags: { partner_relationship_good: true, partner_relationship_distant: false, open_to_family: true }
      },
      {
        id: "leave",
        label: "気づいた方がやることにして流す",
        effects: { freedom: 2, familyCapital: -2 },
        flags: { partner_relationship_distant: true, open_to_family: false }
      }
    ]
  },
  {
    id: "childcare_night_01",
    type: "choice",
    title: "子どもの夜泣きが続く",
    description: "睡眠不足が数週間続き、体も精神もボロボロになっている。今日の夜泣きにどう対応する？",
    ageRange: [30, 45],
    conditions: {
      childrenCountMin: 1,
      maritalStatus: ["married", "divorced", "widowed"],
      requiredFlags: ["has_infant_child"],
      excludedFlags: ["childfree_path"]
    },
    choices: [
      {
        id: "share",
        label: "交代で休むよう頼む",
        effects: { familyCapital: 4, health: 1, freedom: -1 },
        flags: { parent_teamwork: true, has_infant_child: false }
      },
      {
        id: "alone",
        label: "一人で抱えてあやす",
        effects: { health: -3, familyCapital: -2, lonelinessRisk: 2 },
        flags: { has_infant_child: false }
      }
    ]
  },
  {
    id: "no_children_choice_01",
    type: "choice",
    title: "子どもを持たない選択の後",
    description: "自分の後継者や、次世代との関わりについて、どのような姿勢でいくか。",
    ageRange: [40, 49],
    conditions: {
      childrenCountMax: 0,
      requiredFlags: ["childfree_path"]
    },
    choices: [
      {
        id: "young",
        label: "後輩や若い人を手伝う",
        effects: { nextGeneration: 4, outsideWorkBelonging: 2 },
        flags: { childfree_path: true }
      },
      {
        id: "self",
        label: "自分の人生と時間を優先する",
        effects: { freedom: 4, meaningCapital: 2 },
        flags: { childfree_path: true }
      }
    ]
  },
  {
    id: "mortgage_choice_01",
    type: "choice",
    title: "新居のご近所付き合い",
    description: "新築の家に引っ越してきた。隣近所への挨拶回りをどうする？",
    ageRange: [30, 45],
    conditions: {
      maritalStatus: ["married"],
      housingStatus: ["withFamily"]
    },
    choices: [
      {
        id: "greet",
        label: "手土産を持って挨拶にいく",
        effects: { localCommunity: 4, relationshipCapital: 1 },
        lifeStatusEffects: { localConnection: "weak" }
      },
      {
        id: "skip",
        label: "家族だけで静かに暮らす",
        effects: { freedom: 2, localCommunity: -2 }
      }
    ]
  },
  {
    id: "colleague_quit_choice_01",
    type: "choice",
    title: "同期との今後の付き合い",
    description: "社外になった彼/彼女と、今後どのように関係を続けるか。",
    ageRange: [25, 45],
    choices: [
      {
        id: "keep",
        label: "プライベートの連絡先を交換する",
        effects: { relationshipCapital: 4, freedom: 1 },
        flags: { socially_open: true }
      },
      {
        id: "cut",
        label: "会社だけの関係にして流す",
        effects: { relationshipCapital: -2, career: 1 }
      }
    ]
  },
  {
    id: "transfer_choice_01",
    type: "choice",
    title: "転勤の打診を受けるか",
    description: "拒否すればキャリアに響くが、今の友人関係や住みやすさは維持できる。どう答える？",
    ageRange: [28, 50],
    choices: [
      {
        id: "accept",
        label: "転勤を受け入れる",
        effects: { career: 4, money: 3, relationshipCapital: -3 },
        lifeStatusEffects: { localConnection: "none" }
      },
      {
        id: "decline",
        label: "暮らしを優先して断る",
        effects: { relationshipCapital: 3, career: -3, freedom: 2 }
      }
    ]
  },
  {
    id: "manager_choice_01",
    type: "choice",
    title: "部下のマネジメント方針",
    description: "初めての部下たちができた。どんな上司として振る舞う？",
    ageRange: [35, 50],
    choices: [
      {
        id: "mentor",
        label: "辛抱強く若手を育てる",
        effects: { nextGeneration: 4, relationshipCapital: 3 },
        flags: { is_good_mentor: true }
      },
      {
        id: "result",
        label: "成果と数字だけを厳しく追う",
        effects: { career: 5, money: 3, relationshipCapital: -3 }
      }
    ]
  },
  {
    id: "independent_choice_01",
    type: "choice",
    title: "経営の苦悩",
    description: "資金繰りや戦略の判断で行き詰まっている。誰に相談する？",
    ageRange: [30, 55],
    choices: [
      {
        id: "consult",
        label: "同業の相談相手を作る",
        effects: { relationshipCapital: 4, emergencySupport: 2 },
        lifeStatusEffects: { localConnection: "weak" }
      },
      {
        id: "alone",
        label: "経営者は孤独。一人で決める",
        effects: { career: 4, freedom: 1, lonelinessRisk: 3 }
      }
    ]
  },
  {
    id: "bankruptcy_choice_01",
    type: "choice",
    title: "失業後の求職活動",
    description: "再就職のために、プライドを捨てて知人に頭を下げるか、自力で探すか。",
    ageRange: [30, 55],
    choices: [
      {
        id: "help",
        label: "プライドを捨てて知人に相談する",
        effects: { relationshipCapital: 2, emergencySupport: 3, career: 1 }
      },
      {
        id: "self",
        label: "自力でインターネットで探す",
        effects: { freedom: 3, lonelinessRisk: 2 }
      }
    ]
  },
  {
    id: "parent_hospital_choice_01",
    type: "choice",
    title: "親の入院のお見舞い",
    description: "仕事が非常に立て込んでいる。実家のお見舞いにどう対応する？",
    ageRange: [40, 59],
    conditions: {
      requiredFlags: ["parent_alive"]
    },
    choices: [
      {
        id: "visit",
        label: "有給を取って病院へ駆けつける",
        effects: { familyCapital: 5, career: -2, health: -1 }
      },
      {
        id: "phone",
        label: "電話で様子を尋ねる",
        effects: { freedom: 2, familyCapital: -3 }
      }
    ]
  },
  {
    id: "health_warning_choice_01",
    type: "choice",
    title: "医師からの勧告",
    description: "「このままだと糖尿病の恐れがあります」と言われた。日々の生活をどう変える？",
    ageRange: [40, 65],
    choices: [
      {
        id: "change",
        label: "食事と睡眠を徹底改善する",
        effects: { health: 4, freedom: -3, money: -1 }
      },
      {
        id: "ignore",
        label: "まだ大丈夫と思って放置する",
        effects: { freedom: 2, health: -5, lonelinessRisk: 1 }
      }
    ]
  },
  {
    id: "old_friend_choice_01",
    type: "choice",
    title: "旧友との再会その後",
    description: "話が盛り上がり、「今度飲みに行こう」となった。実際に次の約束を取り付ける？",
    ageRange: [40, 69],
    choices: [
      {
        id: "promise",
        label: "その場の日程調整で約束をする",
        effects: { relationshipCapital: 5, outsideWorkBelonging: 2 }
      },
      {
        id: "social",
        label: "社交辞令で終わらせる",
        effects: { relationshipCapital: -1, freedom: 1 }
      }
    ]
  },
  {
    id: "child_leaves_choice_01",
    type: "choice",
    title: "子供の独立後の距離感",
    description: "子どもが家を出たあと、どれくらいの頻度で連絡を入れるか。",
    ageRange: [50, 65],
    conditions: {
      childrenCountMin: 1,
      requiredFlags: ["has_child"]
    },
    choices: [
      {
        id: "regular",
        label: "週に一度は近況連絡を入れる",
        effects: { familyCapital: 4, emergencySupport: 2 }
      },
      {
        id: "casual",
        label: "用事がある時だけにする",
        effects: { freedom: 4, familyCapital: -2 }
      }
    ]
  },
  {
    id: "distant_partner_choice_01",
    type: "choice",
    title: "無言のリビング",
    description: "今日もテレビの音だけが響くリビング。何か会話を切り出す？",
    ageRange: [50, 65],
    conditions: {
      maritalStatus: ["married"],
      requiredFlags: ["partner_relationship_distant"],
      housingStatus: ["withPartner", "withFamily"]
    },
    choices: [
      {
        id: "speak",
        label: "夕食時にお互いの話を切り出す",
        effects: { familyCapital: 4, health: 1 },
        flags: { partner_relationship_good: true, partner_relationship_distant: false }
      },
      {
        id: "ignore",
        label: "気付かないふりをして自室に籠る",
        effects: { freedom: 3, familyCapital: -3 },
        flags: { partner_relationship_distant: true }
      }
    ]
  },
  {
    id: "parent_passed_choice_01",
    type: "choice",
    title: "実家の整理",
    description: "親の遺品や実家の売却など、山積みの手続きが待っている。誰と相談して進める？",
    ageRange: [50, 69],
    conditions: {
      excludedFlags: ["parent_alive"]
    },
    choices: [
      {
        id: "family",
        label: "親族と話し合い協力して進める",
        effects: { familyCapital: 4, emergencySupport: 2 }
      },
      {
        id: "alone",
        label: "一人で手続きを抱えて済ませる",
        effects: { freedom: 1, health: -2, lonelinessRisk: 3 }
      }
    ]
  },
  {
    id: "early_retirement_choice_01",
    type: "choice",
    title: "希望退職に応じるか",
    description: "割増退職金は魅力的だが、再就職先が見つかる保証はない。どうする？",
    ageRange: [50, 59],
    conditions: {
      jobStatus: ["employee", "manager"]
    },
    choices: [
      {
        id: "accept",
        label: "退職して第2の人生を始める",
        effects: { money: 6, freedom: 5, career: -4 },
        lifeStatusEffects: { jobStatus: "unemployed" }
      },
      {
        id: "stay",
        label: "会社に残ってしがみつく",
        effects: { career: 2, health: -2, freedom: -2 }
      }
    ]
  },
  {
    id: "store_closed_choice_01",
    type: "choice",
    title: "消えた居場所の代わり",
    description: "なじみの店がなくなり、外出の機会が減りそう。別の居場所を探しに行く？",
    ageRange: [50, 75],
    conditions: {
      localConnection: ["medium", "strong"]
    },
    choices: [
      {
        id: "find",
        label: "別の個人経営の店を開拓する",
        effects: { outsideWorkBelonging: 4, localCommunity: 2 }
      },
      {
        id: "giveup",
        label: "もう面倒だから家で飲む",
        effects: { freedom: 3, outsideWorkBelonging: -2, lonelinessRisk: 2 }
      }
    ]
  },
  {
    id: "retirement_choice_01",
    type: "choice",
    title: "第二の人生のスタート",
    description: "退職後、最初にどのような習慣を作る？",
    ageRange: [60, 69],
    conditions: {
      jobStatus: ["retired"]
    },
    choices: [
      {
        id: "routine",
        label: "朝のボランティア等で週1の予定を作る",
        effects: { outsideWorkBelonging: 5, localCommunity: 3, health: 2 },
        lifeStatusEffects: { localConnection: "medium" }
      },
      {
        id: "rest",
        label: "しばらくは目覚ましなしで泥のように休む",
        effects: { freedom: 5, outsideWorkBelonging: -3, health: -1 }
      }
    ]
  },
  {
    id: "divorce_warning_choice_01",
    type: "choice",
    title: "突きつけられた離婚届",
    description: "パートナーの真剣な表情。どう対応する？",
    ageRange: [60, 69],
    conditions: {
      maritalStatus: ["married"],
      requiredFlags: ["partner_relationship_distant"]
    },
    choices: [
      {
        id: "face",
        label: "正面から向き合って話し合う",
        effects: { familyCapital: 3, lonelinessRisk: -2 },
        flags: { partner_relationship_distant: false, partner_relationship_good: true }
      },
      {
        id: "ignore",
        label: "聞かなかったことにして逃げる",
        effects: { familyCapital: -5, lonelinessRisk: 4 },
        flags: { partner_relationship_distant: true }
      }
    ]
  },
  {
    id: "divorce_choice_01",
    type: "choice",
    title: "離婚後の生活基盤",
    description: "一人暮らしのアパートへ引越し。周囲の知人や家族にこのことを打ち明ける？",
    ageRange: [65, 72],
    conditions: {
      maritalStatus: ["divorced"],
      requiredFlags: ["divorced_path"]
    },
    choices: [
      {
        id: "tell",
        label: "暮らしの変化を友人に相談する",
        effects: { relationshipCapital: 3, emergencySupport: 2 }
      },
      {
        id: "hide",
        label: "恥ずかしいので誰にも話さない",
        effects: { freedom: 3, lonelinessRisk: 5 }
      }
    ]
  },
  {
    id: "grandchild_choice_01",
    type: "choice",
    title: "孫へのお祝いと関わり",
    description: "孫の面倒やサポートのために、週末は積極的に手伝いに行く？",
    ageRange: [60, 75],
    conditions: {
      childrenCountMin: 1,
      requiredFlags: ["grandchild_related"]
    },
    choices: [
      {
        id: "help",
        label: "育児のサポートに自ら赴く",
        effects: { nextGeneration: 5, familyCapital: 4, freedom: -3 }
      },
      {
        id: "watch",
        label: "送られてくる写真だけを眺める",
        effects: { freedom: 3, familyCapital: -1 }
      }
    ]
  },
  // ==================== 18歳〜 序盤の分岐・詳細連鎖質問 ====================
  {
    id: "start_education_choice_01",
    type: "choice",
    title: "高校卒業後の進路",
    description: "将来について決める大事な岐路。大学や専門学校に進学するか、それとも就職など別の道を歩み始めるか。",
    ageRange: [18, 19],
    choices: [
      {
        id: "go_college",
        label: "進学する（大学・専門学校）",
        effects: { freedom: 2, money: -3 },
        flags: { education_college: true, education_no_college: false },
        followUpEventId: "early_career_college_01"
      },
      {
        id: "no_college",
        label: "進学しない（就職・その他）",
        effects: { money: 2, career: 1 },
        flags: { education_college: false, education_no_college: true },
        followUpEventId: "early_career_no_college_01"
      }
    ],
    once: true
  },
  {
    id: "early_career_college_01",
    type: "choice",
    title: "キャンパスライフの拠点",
    description: "進学が決まった。実家から通うか、それとも親元を離れて一人暮らしをするか。",
    ageRange: [18, 20],
    conditions: {
      requiredFlags: ["education_college"]
    },
    choices: [
      {
        id: "leave_home",
        label: "一人暮らしを始める",
        effects: { freedom: 4, money: -4 },
        flags: { left_parent_home: true, stayed_with_parents: false },
        followUpEventId: "early_career_college_life_01"
      },
      {
        id: "stay_home",
        label: "実家から通う",
        effects: { money: 3, familyCapital: 2 },
        flags: { left_parent_home: false, stayed_with_parents: true },
        followUpEventId: "early_career_college_life_01"
      }
    ],
    once: true
  },
  {
    id: "early_career_college_life_01",
    type: "choice",
    title: "学生生活の優先事項",
    description: "日々の暮らしが本格的に始まった。授業や勉強を最優先にするか、サークルや人間関係を広げるか。",
    ageRange: [18, 22],
    conditions: {
      requiredFlags: ["education_college"]
    },
    choices: [
      {
        id: "study_first",
        label: "学業や専門知識の探求に専念",
        effects: { career: 3, meaningCapital: 2 },
        flags: { socially_open: false, socially_closed: true },
        followUpEventId: "early_career_college_grad_01"
      },
      {
        id: "friends_first",
        label: "サークルや友人と交流を広げる",
        effects: { relationshipCapital: 4, freedom: 2, money: -2 },
        flags: { socially_open: true, socially_closed: false },
        followUpEventId: "early_career_college_grad_01"
      }
    ],
    once: true
  },
  {
    id: "early_career_college_grad_01",
    type: "choice",
    title: "卒業が近づく進路決定",
    description: "学生生活の終わりが迫る。安定した一般企業への就職を目指すか、フリーランスや起業といった独自の道を志すか。",
    ageRange: [20, 24],
    conditions: {
      requiredFlags: ["education_college"]
    },
    choices: [
      {
        id: "stable_job",
        label: "安定した企業に就職する",
        effects: { career: 2, money: 2, freedom: -1 },
        lifeStatusEffects: { jobStatus: "employee" },
        flags: { early_worker: true, delayed_career_start: false }
      },
      {
        id: "independent_path",
        label: "フリーランスや起業を目指す",
        effects: { freedom: 4, career: 1, money: -2 },
        lifeStatusEffects: { jobStatus: "freelance" },
        flags: { early_worker: false, delayed_career_start: true, aspire_independent: true }
      }
    ],
    once: true
  },
  {
    id: "early_career_no_college_01",
    type: "choice",
    title: "進学しない道の一歩",
    description: "高校卒業後、すぐに就職活動をして社会人としてのキャリアをスタートするか、一旦様子を見て別の道を模索するか。",
    ageRange: [18, 20],
    conditions: {
      requiredFlags: ["education_no_college"]
    },
    choices: [
      {
        id: "direct_worker",
        label: "すぐ就職を目指す",
        effects: { career: 3, money: 2 },
        flags: { early_worker: true, delayed_career_start: false },
        followUpEventId: "early_career_no_college_job_01"
      },
      {
        id: "find_myself",
        label: "就職せず、アルバイトや独自の道を模索",
        effects: { freedom: 4, money: -1 },
        flags: { early_worker: false, delayed_career_start: true, unstable_early_adulthood: true },
        followUpEventId: "early_career_no_college_free_01"
      }
    ],
    once: true
  },
  {
    id: "early_career_no_college_job_01",
    type: "choice",
    title: "就職先の選定",
    description: "働く決心をした。地元の安定した中小企業にするか、裁量の大きい急成長ベンチャーに挑戦するか。",
    ageRange: [18, 22],
    conditions: {
      requiredFlags: ["early_worker", "education_no_college"]
    },
    choices: [
      {
        id: "local_stable",
        label: "地元の安定企業でじっくり働く",
        effects: { career: 2, money: 3, familyCapital: 2 },
        lifeStatusEffects: { jobStatus: "employee" },
        flags: { stayed_with_parents: true, left_parent_home: false }
      },
      {
        id: "venture_challenge",
        label: "ベンチャーに挑戦する",
        effects: { career: 4, freedom: 1, health: -1 },
        lifeStatusEffects: { jobStatus: "employee" },
        flags: { aspire_independent: true, left_parent_home: true }
      }
    ],
    once: true
  },
  {
    id: "early_career_no_college_free_01",
    type: "choice",
    title: "独自の生活基盤の選択",
    description: "定職に就かない生活が始まった。実家に残って夢やアルバイトに専念するか、自力でアパートを借りてバイト生活を送るか。",
    ageRange: [18, 23],
    conditions: {
      requiredFlags: ["delayed_career_start", "education_no_college"]
    },
    choices: [
      {
        id: "parents_house",
        label: "実家に残って夢を追う",
        effects: { money: 2, familyCapital: 2 },
        lifeStatusEffects: { jobStatus: "unemployed", housingStatus: "withParents" },
        flags: { stayed_with_parents: true, left_parent_home: false }
      },
      {
        id: "own_apartment",
        label: "バイトをしながら一人暮らし",
        effects: { freedom: 5, money: -3 },
        lifeStatusEffects: { jobStatus: "freelance", housingStatus: "alone" },
        flags: { left_parent_home: true, stayed_with_parents: false }
      }
    ],
    once: true
  },
  // ==================== 超汎用内省イベント (フォールバック安全装置) ====================
  {
    id: "fallback_reflection_01",
    type: "choice",
    category: "reflection",
    topicKey: "fallback_reflection",
    isFallback: true,
    title: "ふとした内省の時間",
    description: "これまでの人生の歩みを静かに振り返る。少し疲れた心を整え、次のステップへ向かおう。",
    ageRange: [18, 75],
    choices: [
      {
        id: "focus_self",
        label: "自分の時間を大切に過ごす",
        effects: { freedom: 2, health: 1 }
      },
      {
        id: "focus_others",
        label: "身近な人とのつながりを意識する",
        effects: { relationshipCapital: 2, meaningCapital: 1 }
      }
    ]
  },
  {
    id: "local_role_choice_01",
    type: "choice",
    title: "自治会役員を引き受けるか",
    description: "資料作りや会議で時間と手間を取られる。しかし地域の防犯なども担う責任がある。",
    ageRange: [60, 75],
    choices: [
      {
        id: "accept",
        label: "無理のない範囲で引き受ける",
        effects: { localCommunity: 5, outsideWorkBelonging: 3, freedom: -3 },
        lifeStatusEffects: { localConnection: "strong" }
      },
      {
        id: "decline",
        label: "面倒なのできっぱり断る",
        effects: { freedom: 3, localCommunity: -3 }
      }
    ]
  },
  {
    id: "quiet_morning_choice_01",
    type: "choice",
    title: "朝の過ごし方",
    description: "退職して時間がたくさんある。今日の朝はどのように始める？",
    ageRange: [60, 72],
    choices: [
      {
        id: "walk",
        label: "朝の散歩を始めて近所を回る",
        effects: { health: 3, localCommunity: 2 },
        lifeStatusEffects: { localConnection: "weak" }
      },
      {
        id: "tv",
        label: "テレビをつけたまま家で横になる",
        effects: { freedom: 3, health: -2, lonelinessRisk: 2 }
      }
    ]
  },
  {
    id: "sick_hospital_choice_01",
    type: "choice",
    title: "診断書と連絡",
    description: "数日の入院を要する可能性があると言われた。誰に連絡する？",
    ageRange: [65, 75],
    choices: [
      {
        id: "call",
        label: "誰かに連絡して入院を伝える",
        effects: { emergencySupport: 4, lonelinessRisk: -3 }
      },
      {
        id: "silent",
        label: "誰にも頼らず一人で手続きする",
        effects: { freedom: 2, lonelinessRisk: 4 }
      }
    ]
  },
  {
    id: "emergency_contact_choice_01",
    type: "choice",
    title: "緊急連絡先の選択",
    description: "万が一のために書く名前。どうするか決める時間だ。",
    ageRange: [70, 75],
    choices: [
      {
        id: "write",
        label: "電話して確認し、名前を書く",
        effects: { emergencySupport: 8, lonelinessRisk: -4 },
        lifeStatusEffects: { emergencyContact: "friend" } // デフォルトは友人もしくは親族
      },
      {
        id: "blank",
        label: "空欄のまま提出する",
        effects: { freedom: 2, lonelinessRisk: 6 },
        lifeStatusEffects: { emergencyContact: "none" }
      }
    ]
  },
  {
    id: "monitoring_service_choice_01",
    type: "choice",
    title: "見守りサービス導入",
    description: "毎日一度、返事がないと安否確認が来るサービス。導入を決める？",
    ageRange: [70, 75],
    choices: [
      {
        id: "apply",
        label: "資料を読み申し込む",
        effects: { emergencySupport: 6, lonelinessRisk: -3 },
        lifeStatusEffects: { emergencyContact: "service" }
      },
      {
        id: "refuse",
        label: "「まだ早い」と書類を捨てる",
        effects: { freedom: 3, lonelinessRisk: 3 }
      }
    ]
  }
];
