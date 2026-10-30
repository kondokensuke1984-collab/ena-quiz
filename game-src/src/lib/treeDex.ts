// きのずかん：森を クリアすると、その森の 木が ずかんに のる。写真は Wikimedia Commons の 自由に つかえる 写真
// （ライセンスと 撮った 人の 名前は 画面に 出す）。写真が その 森の 場所では ないものは、note に そう 書く。
// 針葉樹・広葉樹の せつめいは 教材（ringyo.html）に あわせた：針葉樹＝細長い葉。成長が早く まっすぐ のびる／広葉樹＝幅の 広い 葉（ぶな・かし・しい など）。
export interface TreeDexEntry {
  id: string;          // FORESTS の id と おなじ
  tree: string;        // 木の 名前
  look: string;        // 見分け方・ようす
  use: string;         // 使いみち・まなび
  photo: { src: string; note: string; author: string; license: string; url: string };
}

const P = (id: string, note: string, author: string, license: string, curid: number) =>
  ({ src: `/images/forest_${id}.jpg`, note, author, license, url: `https://commons.wikimedia.org/w/index.php?curid=${curid}` });

export const TREE_DEX: TreeDexEntry[] = [
  { id: 'yoshino', tree: 'すぎ（吉野すぎ）', look: 'まっすぐ 上に のびる 針葉樹。年輪が こまかくて きれいな 木目に なるよ。', use: 'たる・酒だる、家の 柱や 板に 使われるよ。',
    photo: P('yoshino', '和歌山県 高野山の すぎ林（吉野と おなじ 紀伊山地）の 写真だよ', 'Josep M. Gracia', 'CC BY-SA 4.0', 197034894) },
  { id: 'tenryu', tree: 'すぎ（天竜すぎ）', look: '茶色い 皮が たてに うすく はがれる、まっすぐな 幹。', use: '人が 植えて 手入れして 育てた すぎ。家や 家具の 材料に なるよ。',
    photo: P('tenryu', '茨城県 つくばの すぎ林の 写真だよ（天竜の 写真では ないよ）', 'Raita Futo', 'CC BY 2.0', 147638149) },
  { id: 'owase', tree: 'ひのき（尾鷲ひのき）', look: 'いいにおいの 針葉樹。まっすぐで、木が かたく 長もちするよ。', use: 'お風呂や お寺・神社の 建物に 使われるよ。',
    photo: P('owase', '日本の ひのきの 人工林の 写真だよ（尾鷲の 写真では ないよ）', "Akiyoshi's Room", 'CC BY 2.5', 2507419) },
  { id: 'akita', tree: 'すぎ（秋田すぎ）', look: '天然の すぎの 森。まっすぐで 目が つんだ 木に なるよ。', use: '切らずに 守り 育てる 天然の 美林。建物や 家具の 材料に なるよ。',
    photo: P('akita', '秋田県 能代市の すぎ林（米代川ぞい）の 写真だよ', '掬茶', 'CC BY-SA 4.0', 107651244) },
  { id: 'aomori', tree: 'ひば（青森ひば）', look: 'うろこの ような 平たい 葉の 針葉樹。いい 香りが するよ。', use: '水や 虫に 強いので、建物や お風呂に 使われるよ。',
    photo: P('aomori', 'ひばの 木の 写真だよ（大阪市立大学の 植物園で 撮った もの）', 'KENPEI', 'CC BY-SA 3.0', 2946323) },
  { id: 'kiso', tree: 'ひのき（木曽ひのき）', look: '天然の ひのきの 森。赤みの ある 木の 皮が たてに はがれるよ。', use: 'むかしから 大切に 守られてきた 天然の 美林だよ。',
    photo: P('kiso', '長野県 赤沢自然休養林（木曽ひのきの 森）の 写真だよ', 'Saigen Jiro', 'CC0（パブリックドメイン）', 62062192) },
  { id: 'shirakami', tree: 'ぶな', look: '幅の 広い 葉の 広葉樹。みきは 白っぽい はだで、秋に 葉を 落とす（落葉広葉樹）よ。', use: '白神山地の ぶなの 原生林は 世界自然遺産。ぶなの 森は 雨水を ためて ゆっくり 川に 流すよ。',
    photo: P('shirakami', '白神山地の「400年ぶな」の 写真だよ', 'Ocavis Leechroot', 'CC BY 3.0', 52674912) },
  { id: 'yaku', tree: '屋久すぎ', look: '屋久島の 山に はえる すぎ。ゆっくり 育って、太く ごつごつした 幹に なるよ。', use: '樹齢 1000年を こえる すぎを「屋久すぎ」と よぶよ。屋久島は 世界自然遺産だよ。',
    photo: P('yaku', '屋久島の「縄文杉」の 写真だよ', 'Σ64', 'CC BY 3.0', 18761852) },
];
export const TREE_DEX_BY_ID: Record<string, TreeDexEntry> = Object.fromEntries(TREE_DEX.map((e) => [e.id, e]));
