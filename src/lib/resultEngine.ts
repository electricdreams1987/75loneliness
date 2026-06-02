import type { PlayerState, HistoryEntry } from '../types/game';

// 最終的なステータスから「75歳のある一日」の生活シナリオを生成する
export function generateDailyScenario(state: PlayerState): string {
  const stats = state.stats;
  const status = state.lifeStatus;
  const isAlone = status.housingStatus === 'alone';
  const livesWithPartner = status.maritalStatus === 'married' &&
    (status.housingStatus === 'withPartner' || status.housingStatus === 'withFamily');
  const livesWithChildren = status.childrenCount > 0 && status.housingStatus === 'withFamily';

  let morning: string;
  let afternoon: string;
  let evening: string;
  let night: string;

  // 1. 朝の情景 (住まいと家族構成)
  if (isAlone) {
    if (stats.meaningCapital >= 10) {
      morning = "朝日が差し込む静かな部屋で目が覚める。一人暮らしの朝は静かだが、自分で淹れるコーヒーの香りが心地よく、今日一日の予定に胸が少し弾む。";
    } else {
      morning = "しんと静まり返ったリビングで目を覚ます。テレビをつけてニュースの音で部屋を満たし、余りある一日の時間にどう折り合いをつけるか考える。";
    }
  } else if (livesWithPartner) {
    if (stats.familyCapital >= 8) {
      morning = "隣で起き出すパートナーの気配と共に朝が始まる。「おはよう」と言葉を交わし、今日のご飯について他愛もない話を交わす。";
    } else {
      morning = "同じ屋根の下にパートナーはいるが、ほとんど会話のないまま朝食を済ませる。互いの干渉を避けるように、別々の部屋で過ごし始める。";
    }
  } else if (livesWithChildren) {
    morning = "家族の足音や気配を感じながら朝を迎える。完全に一人ではない安心感がそこにはある。";
  } else if (status.housingStatus === 'shared' || status.housingStatus === 'seniorHousing') {
    morning = "同じ建物で暮らす人の気配を遠くに感じながら朝を迎える。深く関わる相手がいるかどうかは、自分から少し動けるかにかかっている。";
  } else {
    morning = "長く暮らした部屋で朝を迎える。誰かの気配に頼るというより、自分の予定と小さな習慣で一日を始める。";
  }

  // 2. 昼の情景 (地域接点と活動)
  if (status.localConnection === 'strong' || status.localConnection === 'medium') {
    afternoon = "昼下がり、散歩や買い物で外へ出ると、近所の人や馴染みの店員から「こんにちは」と声をかけられる。立ち話で地域の他愛もない噂話を交わし、温かな繋がりを感じる。";
  } else {
    afternoon = "昼過ぎ、買い物にスーパーへ出かけるが、誰と言葉を交わすこともなくレジでセルフレジを操作して帰路につく。すれ違う人々は皆、自分の生活に忙しそうだ。";
  }

  // 3. 夕方の情景 (緊急連絡先と安心感)
  if (status.emergencyContact !== 'none' && stats.emergencySupport >= 8) {
    evening = "夕方、ふと足腰の痛みを感じるが、スマートフォンの連絡先にはすぐに頼れる名前が並んでいる。何かあった時には、あの人たちが気づいてくれるという確かな安心感がある。";
  } else if (status.emergencyContact === 'none') {
    evening = "夕暮れ時、少し体調の異変を感じて不安がよぎる。緊急連絡先の欄は空欄のままであり、もし自分がここで倒れたとして、一体誰がいつ気づいてくれるのだろうかと静かな恐怖を覚える。";
  } else {
    evening = "夕暮れ時、少し体調の異変を感じて不安がよぎる。連絡先はあるものの、すぐ頼ってよいのか迷い、支えを日頃から確かめておく必要を感じる。";
  }

  // 4. 夜の情景 (心の豊かさ、結び)
  if (stats.lonelinessRisk >= 10) {
    night = "夜、窓の外の明かりを眺めながら、社会との細くなった糸を実感する。自由ではあるが、誰にも知られない静かな時間がゆっくりと流れていく。";
  } else {
    night = "夜、今日出会った人や家族のことを思い浮かべながら、穏やかな眠りにつく。一人か大勢かに関わらず、確かに社会と接続された人生がある。";
  }

  return `${morning}\n\n${afternoon}\n\n${evening}\n\n${night}`;
}

// 履歴から重要な選択を3〜5個抽出する
export function extractKeyChoices(history: HistoryEntry[]): string[] {
  if (history.length === 0) return ["目立った選択は記録されませんでした。"];

  // 興味深い選択（人生のターニングポイント）を優先的に抽出
  const priorityKeywords = [
    "結婚", "子ども", "一人暮らし", "ローン", "転職", "退職", "独立", "離婚", "緊急連絡先", "見守り", "同期", "親の"
  ];

  const matched = history.filter(entry => 
    priorityKeywords.some(keyword => entry.eventTitle.includes(keyword))
  );

  // マッチしたものが足りない場合は、年代の最初と最後などを混ぜて補う
  const pool = matched.length >= 3 ? matched : history;
  
  // 年代順にソートし、最大5件に絞る
  const sorted = [...pool].sort((a, b) => a.age - b.age);
  
  // 重複を避けつつ、最初、中間、最後をバランス良く抽出
  const result: HistoryEntry[] = [];
  if (sorted.length <= 5) {
    result.push(...sorted);
  } else {
    result.push(sorted[0]); // 最初
    result.push(sorted[Math.floor(sorted.length / 2)]); // 中間
    result.push(sorted[sorted.length - 1]); // 最後
    
    // あと2件追加
    const idx1 = Math.floor(sorted.length / 4);
    const idx2 = Math.floor((3 * sorted.length) / 4);
    if (!result.includes(sorted[idx1])) result.push(sorted[idx1]);
    if (!result.includes(sorted[idx2])) result.push(sorted[idx2]);
  }

  // 年齢順に並べ直してテキスト化
  return result
    .sort((a, b) => a.age - b.age)
    .map(entry => {
      let stage: string;
      if (entry.age < 30) stage = `${entry.age}歳（若者期）`;
      else if (entry.age < 50) stage = `${entry.age}歳（壮年期）`;
      else if (entry.age < 65) stage = `${entry.age}歳（中年期）`;
      else stage = `${entry.age}歳（高齢期）`;

      return `${stage}、${entry.eventTitle}において「${entry.selectedChoiceLabel}」を選択した。`;
    });
}
