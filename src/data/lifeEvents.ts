import type { GameEvent } from '../types/game';

export const lifeEvents: GameEvent[] = [
  {
    id: "life_alone_01",
    type: "life_event",
    title: "一人暮らしを始めた",
    description: "実家を出て、新しい自分の部屋での生活が始まった。自由と、少しの心細さがある。",
    ageRange: [18, 29],
    conditions: {
      housingStatus: ["withParents"],
      requiredFlags: ["left_parent_home"]
    },
    effects: {
      freedom: 5,
      money: -4,
      familyCapital: -1
    },
    lifeStatusEffects: {
      housingStatus: "alone"
    },
    followUpEventIds: ["alone_choice_01"],
    once: true
  },
  {
    id: "life_first_salary_01",
    type: "life_event",
    title: "初任給が入った",
    description: "自分で働いて得た初めての給料。通帳の数字を見て、社会人の実感が湧く。",
    ageRange: [18, 25],
    conditions: {
      jobStatus: ["employee", "freelance", "owner"]
    },
    effects: {
      money: 5,
      freedom: 2
    },
    followUpEventIds: ["first_salary_choice_01"],
    once: true
  },
  {
    id: "life_dating_01",
    type: "life_event",
    title: "恋人ができた",
    description: "お互いの気持ちが通じ合い、交際が始まった。誰かと時間を分け合う日々。",
    ageRange: [23, 35],
    conditions: {
      maritalStatus: ["single"],
      anyRequiredFlags: ["socially_open", "relationship_prioritized", "open_to_relationship", "reconnected_friend"],
      excludedFlags: ["romance_closed"],
      minStats: { relationshipCapital: 8 }
    },
    effects: {
      relationshipCapital: 4,
      freedom: -2
    },
    lifeStatusEffects: {
      maritalStatus: "dating"
    },
    followUpEventIds: ["dating_choice_01"],
    once: true
  },
  {
    id: "life_breakup_01",
    type: "life_event",
    title: "恋人と別れた",
    description: "すれ違いの末、別々の道を歩むことになった。部屋が少し広く感じる。",
    ageRange: [23, 39],
    conditions: {
      maritalStatus: ["dating"]
    },
    effects: {
      relationshipCapital: -3,
      freedom: 3,
      lonelinessRisk: 2
    },
    lifeStatusEffects: {
      maritalStatus: "single"
    },
    followUpEventIds: ["breakup_choice_01"],
    once: true
  },
  {
    id: "life_marriage_01",
    type: "life_event",
    title: "結婚した",
    description: "パートナーと人生を共に歩む約束をし、婚姻届を出した。これからは二人の生活。",
    ageRange: [24, 40],
    conditions: {
      maritalStatus: ["dating"],
      requiredFlags: ["ready_to_marry"],
      minStats: { familyCapital: 6 }
    },
    effects: {
      familyCapital: 8,
      freedom: -4,
      money: -3
    },
    lifeStatusEffects: {
      maritalStatus: "married",
      housingStatus: "withPartner"
    },
    followUpEventIds: ["marriage_choice_01"],
    once: true
  },
  {
    id: "life_birth_child_01",
    type: "life_event",
    title: "子どもが生まれた",
    description: "新しい命が家族に加わった。言葉にならない愛おしさと、かつてない責任の重さを感じる。",
    ageRange: [30, 45],
    conditions: {
      maritalStatus: ["married"],
      childrenCountMax: 2,
      requiredFlags: ["open_to_family"],
      excludedFlags: ["childfree_path"]
    },
    effects: {
      familyCapital: 10,
      nextGeneration: 8,
      freedom: -6,
      money: -6,
      health: -2
    },
    lifeStatusEffects: {
      childrenCountDelta: 1
    },
    followUpEventIds: ["childcare_night_01"],
    once: true
  },
  {
    id: "life_no_children_01",
    type: "life_event",
    title: "子どもを持たない人生になった",
    description: "選択か偶然か、子どもを持たないライフプランが確定した。自分の時間をどう使うか。",
    ageRange: [40, 49],
    conditions: {
      childrenCountMax: 0,
      excludedFlags: ["open_to_family"]
    },
    effects: {
      freedom: 3,
      nextGeneration: -2
    },
    followUpEventIds: ["no_children_choice_01"],
    once: true
  },
  {
    id: "life_mortgage_01",
    type: "life_event",
    title: "住宅ローンを組んだ",
    description: "35年ローンでマイホームを購入した。大きな安心と同時に、長い返済義務を背負う。",
    ageRange: [30, 45],
    conditions: {
      maritalStatus: ["married"]
    },
    effects: {
      money: -8,
      familyCapital: 4,
      freedom: -3
    },
    lifeStatusEffects: {
      housingStatus: "withFamily"
    },
    followUpEventIds: ["mortgage_choice_01"],
    once: true
  },
  {
    id: "life_colleague_quit_01",
    type: "life_event",
    title: "会社の同期が辞めた",
    description: "苦楽を共にしてきた優秀な同期が、転職を理由に会社を去る。社内に風通しの悪さを感じる。",
    ageRange: [25, 45],
    conditions: {
      jobStatus: ["employee", "manager"]
    },
    effects: {
      relationshipCapital: -1,
      career: -1
    },
    followUpEventIds: ["colleague_quit_choice_01"],
    once: true
  },
  {
    id: "life_transfer_01",
    type: "life_event",
    title: "転勤の話が出た",
    description: "辞令か打診か、遠方の支社への異動が持ち上がった。キャリアアップの好機だが、生活環境は変わる。",
    ageRange: [28, 50],
    conditions: {
      jobStatus: ["employee", "manager"]
    },
    effects: {
      career: 2,
      localCommunity: -2
    },
    followUpEventIds: ["transfer_choice_01"],
    once: true
  },
  {
    id: "life_promotion_manager_01",
    type: "life_event",
    title: "管理職になった",
    description: "肩書が変わり、自分の仕事だけでなくチーム全体の数字やマネジメントを任されることになった。",
    ageRange: [35, 50],
    conditions: {
      jobStatus: ["employee"],
      minStats: { career: 20 }
    },
    effects: {
      career: 8,
      money: 5,
      health: -3,
      freedom: -3
    },
    lifeStatusEffects: {
      jobStatus: "manager"
    },
    followUpEventIds: ["manager_choice_01"],
    once: true
  },
  {
    id: "life_independent_01",
    type: "life_event",
    title: "独立した",
    description: "長年温めていた計画を実行に移し、自分で事業を立ち上げた。全ての意思決定は自分の肩にかかる。",
    ageRange: [30, 55],
    conditions: {
      jobStatus: ["employee", "freelance"],
      requiredFlags: ["aspire_independent"]
    },
    effects: {
      freedom: 6,
      career: 4,
      money: -5,
      emergencySupport: -2
    },
    lifeStatusEffects: {
      jobStatus: "owner"
    },
    followUpEventIds: ["independent_choice_01"],
    once: true
  },
  {
    id: "life_bankruptcy_01",
    type: "life_event",
    title: "会社が倒産した",
    description: "業績悪化による突然の会社倒産。明日からの仕事と収入を失い、途方に暮れる。",
    ageRange: [30, 55],
    conditions: {
      jobStatus: ["employee", "manager"]
    },
    effects: {
      money: -8,
      career: -5,
      lonelinessRisk: 4,
      health: -2
    },
    lifeStatusEffects: {
      jobStatus: "unemployed"
    },
    followUpEventIds: ["bankruptcy_choice_01"],
    once: true
  },
  {
    id: "life_parent_hospital_01",
    type: "life_event",
    title: "親が入院した",
    description: "故郷の親が倒れ、急きょ入院したとの連絡が入った。高齢化に伴う介護の問題が現実味を帯びる。",
    ageRange: [40, 59],
    effects: {
      familyCapital: 1,
      health: -1,
      freedom: -2
    },
    followUpEventIds: ["parent_hospital_choice_01"],
    once: true
  },
  {
    id: "life_health_warning_01",
    type: "life_event",
    title: "健康診断で注意された",
    description: "数値の異常が見つかり、医師から生活習慣の劇的な改善か精密検査を求められた。",
    ageRange: [40, 65],
    effects: {
      health: -3
    },
    followUpEventIds: ["health_warning_choice_01"],
    once: true
  },
  {
    id: "life_old_friend_01",
    type: "life_event",
    title: "昔の友人と再会した",
    description: "街角で偶然、あるいは同窓会で学生時代の親友と再会した。一瞬で昔の距離感に戻る。",
    ageRange: [40, 69],
    conditions: {
      requiredFlags: ["has_old_friends"]
    },
    effects: {
      relationshipCapital: 3
    },
    followUpEventIds: ["old_friend_choice_01"],
    once: true
  },
  {
    id: "life_child_leaves_01",
    type: "life_event",
    title: "子どもが家を出た",
    description: "進学や就職を機に、子どもが独立して一人暮らしを始めた。賑やかだった家が急に静かになる。",
    ageRange: [50, 65],
    conditions: {
      childrenCountMin: 1
    },
    effects: {
      familyCapital: -2,
      freedom: 4,
      nextGeneration: -1
    },
    followUpEventIds: ["child_leaves_choice_01"],
    once: true
  },
  {
    id: "life_distant_partner_01",
    type: "life_event",
    title: "パートナーとの会話が減った",
    description: "同じ家で暮らしているが、すれ違いが多く必要最低限の業務連絡しか交わさなくなっている。",
    ageRange: [50, 65],
    conditions: {
      maritalStatus: ["married"],
      excludedFlags: ["partner_relationship_good"],
      maxStats: { familyCapital: 7 }
    },
    effects: {
      familyCapital: -3,
      lonelinessRisk: 2
    },
    followUpEventIds: ["distant_partner_choice_01"],
    once: true
  },
  {
    id: "life_parent_passed_01",
    type: "life_event",
    title: "親を見送った",
    description: "長い闘病の末、親がこの世を去った。幼少期の記憶が駆け巡り、深い喪失感に包まれる。",
    ageRange: [50, 69],
    effects: {
      familyCapital: -4,
      meaningCapital: 3,
      lonelinessRisk: 2
    },
    followUpEventIds: ["parent_passed_choice_01"],
    once: true
  },
  {
    id: "life_early_retirement_01",
    type: "life_event",
    title: "早期退職の話が出た",
    description: "会社から割増退職金を上乗せした希望退職の募集が発表された。セカンドキャリアを考える機会。",
    ageRange: [50, 59],
    conditions: {
      jobStatus: ["employee", "manager"]
    },
    effects: {
      career: -2,
      freedom: 1
    },
    followUpEventIds: ["early_retirement_choice_01"],
    once: true
  },
  {
    id: "life_store_closed_01",
    type: "life_event",
    title: "なじみの店が閉店した",
    description: "長年通い、店主とも気軽に言葉を交わしていた近所の飲食店が、高齢化のため店を閉じた。",
    ageRange: [50, 75],
    conditions: {
      localConnection: ["medium", "strong"]
    },
    effects: {
      outsideWorkBelonging: -3,
      lonelinessRisk: 1
    },
    followUpEventIds: ["store_closed_choice_01"],
    once: true
  },
  {
    id: "life_retirement_01",
    type: "life_event",
    title: "定年退職した",
    description: "長年勤め上げた仕事の最終日。花束を受け取り会社を後にする。明日からは何時に起きてもいい。",
    ageRange: [60, 69],
    conditions: {
      jobStatus: ["employee", "manager", "executive"]
    },
    effects: {
      career: -5,
      freedom: 8,
      money: -3,
      outsideWorkBelonging: -3
    },
    lifeStatusEffects: {
      jobStatus: "retired"
    },
    followUpEventIds: ["retirement_choice_01"],
    once: true
  },
  {
    id: "life_divorce_warning_01",
    type: "life_event",
    title: "パートナーから離婚の提案",
    description: "「これからの人生、お互い別々に歩みませんか」と離婚届を突きつけられた。突然の宣告に凍りつく。",
    ageRange: [60, 69],
    conditions: {
      maritalStatus: ["married"],
      requiredFlags: ["partner_relationship_distant"],
      maxStats: { familyCapital: 5 }
    },
    effects: {
      familyCapital: -4,
      lonelinessRisk: 3
    },
    followUpEventIds: ["divorce_warning_choice_01"],
    once: true
  },
  {
    id: "life_divorce_01",
    type: "life_event",
    title: "熟年離婚した",
    description: "話し合いは平行線をたどり、離婚が成立した。財産を分与し、完全に一人での再出発となる。",
    ageRange: [65, 72],
    conditions: {
      maritalStatus: ["married"],
      requiredFlags: ["partner_relationship_distant"]
    },
    effects: {
      familyCapital: -8,
      freedom: 4,
      lonelinessRisk: 6
    },
    lifeStatusEffects: {
      maritalStatus: "divorced",
      housingStatus: "alone"
    },
    followUpEventIds: ["divorce_choice_01"],
    once: true
  },
  {
    id: "life_grandchild_01",
    type: "life_event",
    title: "孫が生まれた",
    description: "我が子に子どもが生まれたとの報告。生命のバトンが次の世代へと繋がっていくのを感じる。",
    ageRange: [60, 75],
    conditions: {
      childrenCountMin: 1,
      minStats: { familyCapital: 8 }
    },
    effects: {
      nextGeneration: 6,
      familyCapital: 3
    },
    followUpEventIds: ["grandchild_choice_01"],
    once: true
  },
  {
    id: "life_local_role_01",
    type: "life_event",
    title: "地域の役を頼まれた",
    description: "自治会やマンションの管理組合から、「次の期、役員をお願いできませんか」と打診が来た。",
    ageRange: [60, 75],
    conditions: {
      localConnection: ["medium", "strong"]
    },
    effects: {
      localCommunity: 2
    },
    followUpEventIds: ["local_role_choice_01"],
    once: true
  },
  {
    id: "life_quiet_morning_01",
    type: "life_event",
    title: "退職後の朝が静かすぎる",
    description: "満員電車も締め切りもない。静まり返ったリビングで、コーヒーを飲みながら余る時間に戸惑う。",
    ageRange: [60, 72],
    conditions: {
      jobStatus: ["retired"]
    },
    effects: {
      freedom: 2,
      lonelinessRisk: 3
    },
    followUpEventIds: ["quiet_morning_choice_01"],
    once: true
  },
  {
    id: "life_sick_hospital_01",
    type: "life_event",
    title: "体調を崩して病院に行った",
    description: "朝から激しいめまいと動悸に襲われ、一人で近くの総合病院を受診した。体が以前のように動かない。",
    ageRange: [65, 75],
    effects: {
      health: -4
    },
    followUpEventIds: ["sick_hospital_choice_01"],
    once: true
  },
  {
    id: "life_emergency_contact_01",
    type: "life_event",
    title: "緊急連絡先を書く場面が来た",
    description: "高齢者支援窓口や新しい病院の登録カードで、「緊急連絡先」の記入欄が白く残っている。",
    ageRange: [70, 75],
    effects: {
      emergencySupport: 0 // 現状の確認を促す意味でダミー値
    },
    followUpEventIds: ["emergency_contact_choice_01"],
    once: true
  },
  {
    id: "life_monitoring_service_01",
    type: "life_event",
    title: "見守りサービスの案内が届いた",
    description: "自治体または民間企業から、安否確認やスマートメーターによる高齢者向け見守りサービスの案内が届いた。",
    ageRange: [70, 75],
    conditions: {
      housingStatus: ["alone"],
      emergencyContact: ["none"]
    },
    effects: {
      emergencySupport: 1
    },
    followUpEventIds: ["monitoring_service_choice_01"],
    once: true
  }
];
