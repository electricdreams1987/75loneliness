import type { PlayerState, Ending } from '../types/game';

export const endings: Ending[] = [
  {
    id: "connected_life",
    title: "人々と繋がり続ける温かな老後",
    type: "connected_life",
    description: "あなたは長年、友人や地域、そして家族との良好な関係を育んできました。75歳になった今、頼れる人がそばにいて、孤立とは無縁の豊かで温かな日々を送っています。困った時にもすぐに誰かが気付いてくれる安心感があります。",
    conditions: (state: PlayerState) => {
      const stats = state.stats;
      return stats.relationshipCapital >= 12 && stats.emergencySupport >= 12 && stats.localCommunity >= 10;
    },
    actions: [
      "月一度、友人や子供たちと短い電話や連絡を取る習慣を続ける",
      "地域のサロンやイベントに時折顔を出し、顔見知りを維持する",
      "近くの店や図書館など「いつもの居場所」に毎日足を運ぶ"
    ]
  },
  {
    id: "independent_but_connected",
    title: "一人だが孤立していない老後",
    type: "independent_but_connected",
    description: "あなたは独身または一人暮らしですが、地域との繋がりや信頼できる相談先をしっかりと確保してきました。家族と同居していなくても、困った時に助け合えるネットワークや支援サービスがあります。自立と社会的な繋がりが両立した理想的な姿です。",
    conditions: (state: PlayerState) => {
      const status = state.lifeStatus;
      const stats = state.stats;
      const isAlone = status.housingStatus === 'alone' || status.maritalStatus === 'single' || status.maritalStatus === 'divorced';
      return isAlone && (stats.localCommunity >= 8 || stats.emergencySupport >= 8);
    },
    actions: [
      "緊急連絡先を信頼できる友人やサービスとして明確に決めておく",
      "見守りサービスや配食サービスなど、外部支援システムを登録する",
      "近所の人とすれ違った時に笑顔で挨拶を交わすことを習慣にする"
    ]
  },
  {
    id: "family_present_but_lonely",
    title: "家族はいるが頼りにくい老後",
    type: "family_present_but_lonely",
    description: "あなたには配偶者や子どもがいますが、日々のコミュニケーション不足やすれ違いにより、精神的な距離が開いてしまっています。「家族がいるから大丈夫」と周囲は思っていますが、実際には弱音を吐いたり助けを求めたりしにくい、隠れた孤独を抱えています。",
    conditions: (state: PlayerState) => {
      const status = state.lifeStatus;
      const stats = state.stats;
      const hasFamily = status.maritalStatus === 'married' || status.childrenCount >= 1;
      return hasFamily && stats.familyCapital < 5 && stats.emergencySupport < 6;
    },
    actions: [
      "用事がない時でも、家族に「最近どう？」と短いLINEやメッセージを送る",
      "夕食時にテレビを消し、パートナーと今日の出来事を1つだけ話す",
      "家族以外にも愚痴をこぼせる社外・地域での小さな話し相手を作る"
    ]
  },
  {
    id: "work_identity_loss",
    title: "仕事中心で退職後に揺らぐ老後",
    type: "work_identity_loss",
    description: "あなたは仕事で素晴らしいキャリアを築き、成功を収めてきました。しかし、退職した途端に名刺や肩書がなくなり、社会との接点を失ってしまいました。職場以外での居場所を作ってこなかったため、ぽっかりと空いた時間に深い孤独を感じています。",
    conditions: (state: PlayerState) => {
      const stats = state.stats;
      const status = state.lifeStatus;
      return status.jobStatus === 'retired' && stats.career >= 20 && stats.outsideWorkBelonging < 4;
    },
    actions: [
      "かつての肩書やプライドを一度脇に置き、地域の初心者向けサークルに入る",
      "朝の散歩や買い物など、名刺の要らない「顔見知り」を作る外出をする",
      "現役時代のスキルを活かせる無償のボランティアや地域活動を探す"
    ]
  },
  {
    id: "reconnectable_life",
    title: "今から再接続できる老後",
    type: "reconnectable_life",
    description: "あなたの人間関係のキャピタルは低下しており、孤立のリスクがやや高まっています。しかし、完全に閉ざされているわけではありません。自治体の見守り案内や、近所の馴染みのお店など、再接続のための糸口はまだ残されています。少しの勇気で繋がりを取り戻せます。",
    conditions: (state: PlayerState) => {
      const stats = state.stats;
      return stats.lonelinessRisk >= 8 && (stats.emergencySupport >= 4 || stats.localCommunity >= 4 || stats.relationshipCapital >= 4);
    },
    actions: [
      "昔の友人に「懐かしいね、元気？」と短く返信をしてみる",
      "地域の見守りサービスや高齢者窓口からの案内に目を通してみる",
      "行きつけの店を1つだけ作り、店員に「ごちそうさま」と声をかける"
    ]
  },
  {
    id: "isolated_life",
    title: "自由はあるが支えが薄い孤立した老後",
    type: "isolated_life",
    description: "あなたは誰にも縛られない「自由」を選択し続けてきましたが、同時に他者と深く関わることを避けてきました。その結果、75歳の今、あなたが病気で倒れても誰にも気づかれないリスクが極めて高い状態です。自由の代償としての深い静寂の中にいます。",
    conditions: () => true, // 他のどれにも当てはまらない場合のデフォルト
    actions: [
      "地域包括支援センターなどの相談窓口に一度自分の存在を登録しておく",
      "スマートメーターやセンサー型などの非対面での見守りサービスを契約する",
      "月に一度でも声を発して誰かと対話する機会を強制的に設定する"
    ]
  }
];

export function determineEnding(state: PlayerState): Ending {
  for (const ending of endings) {
    if (ending.id !== 'isolated_life' && ending.conditions(state)) {
      return ending;
    }
  }
  // デフォルトは isolated_life
  return endings.find(e => e.id === 'isolated_life') || endings[endings.length - 1];
}
