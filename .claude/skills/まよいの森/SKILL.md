---
name: まよいの森
description: ANRINOアプリ（ena-quiz）のクエスト（rpg.html）の中の「まよいの森」を直す・ステージやモンスターを足す。森・おしろ（へいわに なる）・うみべ・うみの どうくつ の エリア、入る条件、ぬし、ずかん・しんか・なかま、曲、3D／2D の描き方、島への ごほうび、ブラウザでの確認と本番反映まで通しで行う。「まよいの森」「森の〇〇を直して」「おしろ」「うみべ」「どうくつ」「もりのぬし」「モンスターを増やして」「つぎの ステージ」「ずかん」などで使う。島（/game）の機能や月の切りかえはスキル「島の月更新」。
---

# まよいの森（クエストの中の ドラクエふう フィールド）

- 場所: `~/Desktop/開発/ena-quiz`（git 管理・Vercel 本番 https://ena-quiz.vercel.app ）。作業の前に `change_directory` でここへ移る。
- 遊ぶのは小学生（アンリ）。応答は日本語で、専門用語を避ける。見た目の質を重視する人なので、手抜きの絵は出さない。
- 入口：クエスト画面の「🌲 もりに はいる」、または 島の「もりの こじま」から `/rpg.html#forest`（出るときは島へ戻る）。

## ファイル
| ファイル | 役割 |
|---|---|
| `js/forest.js` | 本体（約1700行）。エリア・ちず・あるく・しらべる・たたかいの入口と結果・3D（three.js 0.169 を `js/vendor` から）・2D（WebGL が無い端末）・ずかん画面 |
| `js/forest_monsters.js` | モンスターの絵（`FMON_DRAW` の SVG）・`FOREST_MONSTERS`・`FOREST_MOBS`（出る場所ごと）・ずかんの説明・`FOREST_DEX_ORDER`・しんか `FOREST_EVOS`／`FMON_CROWN_AT` |
| `js/forest_base.js` | 🏜 さばくの アジト（だっかんさくせん）の しくみ：ちず `BASE_ROWS`・みはり `BASE_GUARDS`（みち・みえる ところ `forestBaseView`・`forestBaseTick`）・ろうや `BASE_CELLS`・むせん `forestBriefing`・レーダー・せいこう画面 `forestBaseComplete`・その日の しんこう `save.forest.base`。3D は forest.js の `buildBase`／`drawBase`、2D は `forestBaseDraw2D` |
| `js/forest_music.js` | 曲（`FM_SONGS`。すべてオリジナル。WebAudio で合成）。`fmPlay(name)` |
| `rpg.html` | たたかい画面・メダル台帳・`save`（`anrino_rpg_v1`）。森の戦いは `bt.forest` があると `forestEndBattle` に回る |

## エリア（`save.forest.area`）
| area | ちず | 記号（あるける＝`FOREST_WALK`） | ぬし |
|---|---|---|---|
| `field` 森 | `forestBuild(日付)`＝毎日すこし変わる 34×26 | `. " T = B`（みち・はしは敵が出ない） | どうくつの ばんにん（4問）→ 🗝しろの かぎ |
| `castle` おしろ | `CASTLE_ROWS`（17×14 固定） | `o r`（H かべ・I はしら・L たいまつ・D でぐち・S ひみつの とびら・V まちの人・M ミミック） | もりのぬし（8問。`N`） |
| `beach` うみべ | `BEACH_ROWS`（20×14） | `s`（~ うみ・k いわ・p やし・U どうくつ・E おしろへ） | — |
| `seacave` うみの どうくつ | `SEACAVE_ROWS`（15×12） | `c`（G かべ・~ みずたまり・Y でぐち） | うみのぬし オオダコ（8問。`Q`） |
| `base` さばくの アジト | `BASE_ROWS`（24×18。うみべの ボート `u` から） | `a h`（w かべ・b はこ・h くさ＝かくれる・J ろうや・A ダンボール・O だんちょう・Z ヘリポート・u ボート） | かげの だんちょう（8問。3にん たすけてから）→ ヘリポートで せいこう。はじめて せいこうで `save.basePeace` |

- エリアを移るのは `forestGoArea(area, [x,y], むき, メッセージ)`。行き先の座標は `CASTLE_SPOTS`・`BEACH_SPOTS`・`SEACAVE_SPOTS`。ちずの 行は**同じ長さ**（足すときは python で長さを assert）。
- `forestLoad()` が area から `fz` を作る（森は `fzField` に1日ぶん覚える）。固定ちずは `forestFixedMap(rows, area, start, 外側の記号)`。
- 1日ごとに `forestState()` が作りなおす（キャンプから・かぎ なし・area は field）。`bossDay`・`umiDay`・`bossEver` は引きつぐ。
- たからばこの記録は `f.opened` に エリアの頭文字つき（森 `x,y`／おしろ `c:`／うみべ `b:`／どうくつ `s:`）。`forestChestKey`。
- 敵の出やすさ `FOREST_ENC`（記号ごと）。へいわな おしろは 0。敵は `FOREST_MOBS[area]`（森は west / east＝川むこう）。

## おしろ に 入る 条件・へいわ
- 条件（3つ）：🗝かぎ ＋ 島の たてもの `FOREST_CASTLE_BUILD`=7こ（島の `ena_island_save_v1.buildings` の `bd_`）＋ これまでに たおした数 `FOREST_CASTLE_KILLS`=30（`forestDex` の合計）。足りないときは もんで `forestCastleTodo()`「◯◯まで しないと いけないよ」。目標の文は `forestGoal()`。
- もりのぬしを おしろで はじめて たおすと `save.forestPeace = true`（**ずっと**）。モンスターが出ない・あかるい・曲 `peace`・まちの人 `CASTLE_VILLAGERS`（ちずに `V` を入れる）・ミミックは ふつうの箱・もんは条件なし・ぬしは おうさまで 2かい話すと再戦（`forestNushiAsk`）・`S` が ひらいて うみべへ。
- うみのぬしを はじめて たおすと `save.umiPeace = true`（`forestUmiPeace()`）：うみべ・どうくつで 出ない・どうくつが あかるく 曲 `peace`・まちの人 `BEACH_VILLAGERS`／`SEACAVE_VILLAGERS`（`forestVillagers`）・オオダコは 2かい話すと再戦。
- 🏃 にげた モンスター：しんか まえ（`forestEvo` なし）の おしろの子は へいわ後 うみの どうくつへ、うみも へいわなら おしろ＋うみの子は 森の 川むこうへ（`forestRunaways`・`forestRunawayHome`・4わり `FOREST_RUNAWAY_RATE`）。ミミックは `forestMimicAt`（どうくつ 左の $ → 川むこうの はこ）。ずかんに「いまは ◯◯」。新しい「へいわ」を足すときも、その場所の子が 二度と 出なくならないように ここに 足す。
- 🧭 いどう：`forestWarps()`（行き先・解放条件）。おしろ へいわ後は 森に入ると `forestWarpOpen(true)`、HUD の「🧭 いどう」でも。新しい エリアを足したら ここにも 1行 足す。
- 「つぎの ステージ」を足すときは この形にならう：どこかの ぬしを たおす → フラグ → とびら/かいだん の記号で `forestGoArea`。

## 島への ごほうび
- rpg.html は localStorage に しるしを書くだけ：`ena_forest_trophy`（もりのぬし→`fn_forest`）、`ena_castle_peace`（へいわ→`fn_castle` おしろの もけい）。
- 島は `game-src/src/state/GameProvider.tsx` の `QUEST_GIFTS` で読んで家具を とどける。家具は `lib/items.ts`（reward: true）＋ `components/FurnitureSVG.tsx` の絵（2D・3D 共通）。島を直したら `game-src` で `npm run build`（`game/` に出る）。

## モンスターを 足す（js/forest_monsters.js）
1. かたち：`FMON_DRAW.<shape> = (p) => SVG`（viewBox 200、足もと y≈188、線は `FMON_INK` の太線。目は `fmonEye`、つやは `fmonShine`）。色ちがいは p（色の配列）だけ変える。
2. `FOREST_MONSTERS.fm_xxx = [shape, [色…], 'なまえ']`、`FOREST_MONSTER_INFO.fm_xxx`（ずかんの説明）。
3. 出る場所：`FOREST_MOBS.<area>` に入れる。ずかんの並び：`FOREST_DEX_ORDER` に `[key, 'ばしょ']`。
4. しんか：`FOREST_EVOS.fm_xxx`（色・なまえ）＋ `FMON_CROWN_AT[shape]`（かんむりの位置）＋ `_evo` の説明。5かい たおすと しんか・なかま（`FOREST_EVO_NEED`・`FOREST_PAL_NEED`）。
5. ずかんは キーで記録しているので、並びや数が かわっても 記録は のこる。

## 3D の 注意（forest3DInit）
- `build()` が エリアごとに `buildCastle`／`buildBeach`／`buildSeacave`／森 を呼ぶ。空の色・霧・明るさ（`hemi`・`sun`）・水の板 `water` も エリアごとに 設定する。
- 作りなおしの目じるし `buildKey()`＝日付＋エリア＋へいわ。見た目が 切りかわる状態を足したら ここにも入れる（入れないと 再読みこみまで 古いまま）。
- カメラは 南の ななめ上から。**ゆかの すぐ南の かべ・いわは ひくく**しないと ルナが かくれる（`walk(x, y-1)` で 判定）。
- 絵（Sprite）が かべ・おうざに めりこむときは `depthTest:false, depthWrite:false`＋`renderOrder`（ルナ 6 より 小さく）。ぬしは `nushi`・`tako`（scene に おいて draw で visible を切りかえ）、まちの人は `standSprite`（world に おくので ちずと いっしょに きえる）。
- 点の光（PointLight）は たいまつ など 数こまで（iPad が 重くなる）。

## 確かめる
0. **大人の 点検は `rpg.html?tenken=1`**（`js/tenken.js`）：きろくは メモリだけ（本物の セーブ・メダル・島は かわらない）。右下「🔧 点検モード」から アジトの とちゅうから・みはり停止・とうめい・たたかいを かった／まけたことに・どこへでも。新しい ステージを 足したら ここにも 近道を 足す。
1. `python3 -m http.server 3939`（バックグラウンド）→ 内蔵ブラウザで `http://localhost:3939/rpg.html`。
2. JS で 状態を作って 直接よぶと はやい：`localStorage.clear(); startGame(); enterForest();` → `save.forest.x/y/dir/key` を変えて `forestLastBump=''; forestSearch();`（めのまえを しらべる）。条件は `ena_island_save_v1.buildings` と `save.forestDex` を入れかえて試す。たたかいは `startForestBattle(kind)` → `bt.correct=n; forestEndBattle(true)` → `backToForest()`。
3. 2D は `forestView = forest2DInit()`、地図は `toggleForestMap()`。画面写真は 1まい おくれることが あるので もう1まい とる。
4. 試したあとは `localStorage.clear()`、サーバーは `pkill -f "http.server 3939"`。

## 本番に 出す
- `git status` で **ほかのセッションの 作業中の変更**が ないか見る。`vercel --prod` は 作業フォルダの中身を そのまま 出すので、まざっていたら ユーザーに 伝える（コミットするか きく）。
- 自分の ファイルだけ `git add` → コミット（末尾に Co-Authored-By）→ `npx vercel --prod --yes` → `curl` で `/rpg.html` 200 と `/js/forest.js` に 変更が 入ったかを 確かめる。
