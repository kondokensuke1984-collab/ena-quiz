// さかなずかん：しゅっこうで つった さかな・産地で そだてた さかなの 写真つき ずかん。
// 写真は Wikimedia Commons の 自由に 使える 写真（CC0・CC BY・CC BY-SA・パブリックドメイン）。
// 作者の 名前・ライセンス・元の ページを 画面に 出す（credit）。写真は images/fish/ に 小さく して おいた。
// 文は 教材（suisan.html）・問題・各港／各県の 資料で 確かめた ことだけ（くわしくは lib/suisanPorts.ts・lib/suisanFarmPlaces.ts）。

export interface ZukanEntry {
  id: string;
  name: string;
  kind: 'sea' | 'farm' | 'stock' | 'both';   // 海で とる／養殖／栽培（放流）／養殖と栽培
  fact: string;
  where: string;
  credit: { by: string; lic: string; page: string };
}

export const ZUKAN: ZukanEntry[] = [
  { id: 'aji', name: 'あじ', kind: 'sea', fact: '沿岸漁業の 魚。長崎県の 松浦港は あじの 水あげが 日本一に なった 年が 何度も あるよ。', where: '境港・松浦・枕崎', credit: { by: "Izuzuki", lic: "CC BY 2.5", page: "https://commons.wikimedia.org/wiki/File:MaAji.jpg" } },
  { id: 'saba', name: 'さば', kind: 'sea', fact: '沿岸と 沖合で とれる 魚。石巻の「金華さば」が 有名。銚子・八戸・境港・松浦でも 水あげされるよ。', where: '銚子・八戸・石巻・境港・枕崎・松浦', credit: { by: "Ruff tuff cream puff", lic: "CC0", page: "https://commons.wikimedia.org/wiki/File:Scomber_japonicus_haul.jpg" } },
  { id: 'iwashi', name: 'いわし', kind: 'sea', fact: '沖合漁業の 魚。まき網で とって、銚子・八戸・石巻・境港・釧路で 水あげされるよ。', where: '銚子・八戸・石巻・境港・釧路', credit: { by: "", lic: "CC BY-SA 2.5", page: "https://commons.wikimedia.org/wiki/File:Sardinops_melanostictus.jpg" } },
  { id: 'sanma', name: 'さんま', kind: 'sea', fact: '沖合漁業の 魚（教材）。釧路の 港で 水あげされるよ。', where: '釧路', credit: { by: "Fumikas Sagisavas", lic: "CC0", page: "https://commons.wikimedia.org/wiki/File:Frozen_fresh_saury.jpg" } },
  { id: 'suketo', name: 'すけとうだら', kind: 'sea', fact: '沖合漁業の 魚（教材）。釧路の 港で 水あげされるよ。', where: '釧路', credit: { by: "Totti", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Gadus_chalcogrammus_Marinepia.jpg" } },
  { id: 'tara', name: 'たら', kind: 'sea', fact: '沿岸漁業の 魚（教材）。釧路や 石巻の 港で 水あげされるよ。', where: '釧路・石巻', credit: { by: "Totti", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Gadus_macrocephalus_Kamo1.jpg" } },
  { id: 'hirame', name: 'ひらめ', kind: 'both', fact: '海の 底に すむ 平たい 魚。稚魚の 放流（栽培漁業）も しているよ。', where: '八戸／愛媛（放流）', credit: { by: "Totti", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Paralichthys_olivaceus_Umigatari.jpg" } },
  { id: 'ika', name: 'いか', kind: 'sea', fact: '八戸の 港で 水あげされるよ。', where: '八戸', credit: { by: "", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Todarodes_pacificus_(white_background).jpg" } },
  { id: 'kani', name: 'かに', kind: 'sea', fact: '境港は あじ・いわし・かにの 水あげが 多い 港。', where: '境港', credit: { by: "Blue Rose Man", lic: "CC0", page: "https://commons.wikimedia.org/wiki/File:Blue_Chionoecetes_opilio.JPG" } },
  { id: 'katsuo', name: 'かつお', kind: 'sea', fact: '遠洋漁業の 魚。焼津は 遠洋漁業の 基地、枕崎は かつお節で 有名だよ。', where: '焼津・枕崎', credit: { by: "タウナギ", lic: "CC0", page: "https://commons.wikimedia.org/wiki/File:Katsuwonus_pelamis_Kagoshima.jpg" } },
  { id: 'maguro', name: 'まぐろ', kind: 'sea', fact: '遠洋漁業の 魚。焼津港は 遠洋漁業の 基地で、まぐろ・かつおが 多いよ。', where: '焼津', credit: { by: "aes256", lic: "CC BY 2.1 jp", page: "https://commons.wikimedia.org/wiki/File:Pacific_bluefin_tuna.jpg" } },
  { id: 'kaki', name: 'かき', kind: 'farm', fact: '広島県は かきの 養殖が 全国の 61.3％。波が おだやかな 広島湾で そだつよ。', where: '広島湾', credit: { by: "", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Crassostrea_gigas_p1040847.jpg" } },
  { id: 'hotate', name: 'ほたて', kind: 'both', fact: '養殖は 青森県が 全国の 68.1％。北海道の オホーツク海では 稚貝を まく「地まき」の 栽培漁業だよ。', where: '陸奥湾／サロマ湖（放流）', credit: { by: "harum.koh from Kobe city, Japan", lic: "CC BY-SA 2.0", page: "https://commons.wikimedia.org/wiki/File:Japan_sea_animal,_Ezo_giant_scallop_(Mizuhopecten_yessoensis)_(15152229484).jpg" } },
  { id: 'nori', name: 'のり', kind: 'farm', fact: '養殖は 佐賀県の 有明海が いちばん 多く 25.9％。つづいて 兵庫県、福岡県だよ。', where: '有明海', credit: { by: "Anonymous Powered", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Neopyropia_yezoensis.jpg" } },
  { id: 'shinju', name: '真珠', kind: 'farm', fact: '愛媛・長崎・三重が 3大産地。アコヤガイの 中で 育てるよ。', where: '愛媛・長崎・英虞湾', credit: { by: "MASAYUKI KATO", lic: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:Akoya_pearl.jpg" } },
  { id: 'unagi', name: 'うなぎ', kind: 'farm', fact: 'うなぎの 養殖で 有名なのは 浜名湖だよ。', where: '浜名湖', credit: { by: "opencage", lic: "CC BY-SA 2.5", page: "https://commons.wikimedia.org/wiki/File:Anguilla_japonica.jpg" } },
  { id: 'wakame', name: 'わかめ', kind: 'farm', fact: '養殖は 宮城県が 全国1位。三陸の リアス海岸は 波が おだやかで 養殖に 向いているよ。', where: '三陸', credit: { by: "division, CSIRO", lic: "CC BY 3.0", page: "https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_868_Undaria_pinnatifida_Japanese_kelp.jpg" } },
  { id: 'kingyo', name: 'きんぎょ', kind: 'farm', fact: 'きんぎょの 養殖で 有名なのは 奈良県の 大和郡山だよ。', where: '大和郡山', credit: { by: "James St. John", lic: "CC BY 2.0", page: "https://commons.wikimedia.org/wiki/File:Carassius_auratus_auratus_(goldfish)_1.jpg" } },
  { id: 'tai', name: 'まだい', kind: 'both', fact: '養殖は 愛媛県が 有名。愛媛や 三重では 稚魚の 放流（栽培漁業）も しているよ。', where: '愛媛／愛媛・英虞湾（放流）', credit: { by: "Totti", lic: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Pagrus_major_Umi-Tamago.jpg" } },
  { id: 'sake', name: 'さけ', kind: 'stock', fact: '川で ふ化した 稚魚を 春に 放流すると、3〜5年して 生まれた 川へ もどってくるよ（栽培漁業）。', where: '北海道・岩手（放流）', credit: { by: "Roger Tabor/USFWS", lic: "Public domain", page: "https://commons.wikimedia.org/wiki/File:Chum_salmon_Allison_Springs_Creek.png" } },
];
export const ZUKAN_BY_ID: Record<string, ZukanEntry> = Object.fromEntries(ZUKAN.map((z) => [z.id, z]));
export const KIND_JA: Record<ZukanEntry['kind'], string> = { sea: '🎣 海で とる', farm: '🐟 養殖', stock: '🌊 栽培（放流）', both: '🐟 養殖・🌊 栽培' };
export const photoOf = (id: string): string => `/images/fish/${id}.jpg`;

/** つった（水あげした）・そだてて うった さかなか */
export function zukanGot(id: string, portDex: string[], dex: string[]): boolean {
  return dex.includes(id) || portDex.some((k) => k.endsWith(':' + id));
}
