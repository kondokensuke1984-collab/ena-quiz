// ============================================================
// ✉️ アンリノの伝説 第2章「ひかりの てがみ」
//   ・game.js より 先に よむ。関数は 実行するときに game.js の ものを つかう。
//   ・すすみ具合は セーブの S.f（フラグ）だけ。第1章の セーブを そのまま つかえる。
//     ch2 はじまった / l_○○ てがみ / c2_100 100年に 気づいた / c2_tree 木 / c2_ask カギを おねがい
//     c2_key カギ / c2_door とびら / c2_eat1・c2_eat2 なまえが きえる / c2_lit 火 / c2_end おわり
// ============================================================

// なまえ ＝ {M}。かげに 食べられると「ミ●」「●●」に かわる
const C2_LETTERS = {
  l1: { title: 'さいしょの てがみ', voice: ['l1_0', 'l1_1'], pages: [
    'この てがみを ひろった 人へ。\n\nわたしは 島の 灯台の 火を\nまもっています。\n\nゆうべ、海の むこうに、\n見たことのない\nあたたかい 光が 見えました。',
    'だれか、この あかりを\n見ていますか。\n\n{M}'] },
  l2: { title: 'へんじが きた', voice: [null, 'l2_1', null], pages: [
    'アンリノへ。\n\nへんじが きた！\nうれしくて、とびはねちゃった。\n\nでも まっくらって なあに？\nゆうべも ちゃんと ともしたよ。\n灯台は ことし できたばかりで、\nぴかぴかなのに。',
    'そうだ、わたしの なまえの\nいみを おしえるね。\n\n{M}は、船の とおる 海の みちの こと。\n船が まよわないようにって、\n父さんが つけてくれたの。',
    'かたの うえには\nともだちの 小さな カメ。\n火の ばんを いつも\nてつだってくれるよ。\n\n{M}'] },
  l3: { title: '100年', pages: [
    'アンリノへ。\n\n100年！ びっくりして\nカメを おとしそうに なったよ。',
    'じゃあ、ためしてみよう。\n100年 たっても のこることを\nおねがいして。\nほんとうなら、アンリノの\nところに とどくはず。\n\n{M}'] },
  l4: { title: '木を うえたよ', pages: [
    'うえたよ！\nカメが 水を かけてくれた。\n\n大きくなあれ、大きくなあれ。\n\n{M}'] },
  l4b: { title: 'カギの こと', pages: [
    'わかった！\n灯台の カギ、いどの そばに\nうめておくね。\n\n100年は ながいから、\nふかく うめるよ。\nちゃんと 見つけてね。\n\n{M}'] },
  l5: { title: 'ひみつ', voice: ['l5_0', 'l5_1', 'l5_2'], pages: [
    'アンリノへ。\n\nひみつを ひとつ おしえるね。\n\n島の 人は みんな 海を わたって、\nいなくなりました。\n「もう 火を ともさなくて いいよ」\nって 言われたの。',
    'でも、もし 船が 1そうでも\nまよったら こまるでしょう。\nだから、だれも 見ていなくても、\n毎ばん ともしました。',
    'ほんとうは、ときどき さみしかった。\nきょう ともしても、\nだれも 知らないんだもの。\n\nでも、いまは ちがうよ。\nアンリノが 見ていてくれるから。\n\n{M}'] },
  l6: { title: 'むしくいの てがみ', pages: [
    'アン●●へ。\n\nかげが ●●に きたの。\n●を けせって。 でも けさないよ。\n●●●●●も、ともすから。\n\nわすれないで。 ●●●●。\n\n{M}'] },
  lf: { title: 'さいごの てがみ', voice: ['lf_0', 'lf_1', 'lf_2', 'lf_3'], pages: [
    'アンリノへ。\n\nおばあさんに なりました。\n字が へたで ごめんね。\n\nあの日から、いちども\nあかりを けさなかったよ。',
    'だれも 見ていない 夜なんて、\nもう なかったから。\n\nきみが 見ていてくれたから。',
    'カメに たのんで おきます。\nこの子は 長生きだから、\nきっと とどけてくれる。',
    '海の いちばん むこうには\n『ゆめの とびら』が あるそうです。\nアンリノなら、きっと たどりつけるよ。\n\nまよったら、ふりかえって。\nわたしの あかりが ついているから。\n\n{M}'] },
};
const C2_ORDER = ['l1', 'l2', 'l3', 'l4', 'l4b', 'l5', 'l6', 'lf'];
const C2_NOTE_HEAVY = { pages: ['アンリノへ。\n\nカメと いっしょに おしたけど、\nおもくて びくとも しないよ。\n\n100年 かけて できること、\nほかに ないかな？\n\n{M}'] };
const C2_CARVE = { carve: true, voice: ['carve_0'], pages: ['アンリノへ。\n\nかげは なまえを たべるんだって。\n\nわすれても だいじょうぶ。\nきみが よんでくれたら、\nわたしは ここに いるよ。'] };
const C2_NAME = 'ミオ', C2_KANA = ['ナ', 'ミ', 'ソ', 'ル', 'オ', 'ハ'];

function c2Eat() { return flag('c2_lit') ? 0 : flag('c2_eat2') ? 2 : flag('c2_eat1') ? 1 : 0; }
function c2Text(s) { return s.replace(/\{M\}/g, ['ミオ', 'ミ●', '●●'][c2Eat()]); }
function c2Has(id) { return flag('l_' + id); }

// ── 見どころの 声（audio/densetsu。tools/make_densetsu_voice.py で 作る）──
//   タップの 外から 鳴らすので、まよいの森の 音源と 同じ AudioContext で 鳴らす。🔇のときは 鳴らさない（文字だけ）
const C2_VOICES = ['l1_0', 'l1_1', 'l2_1', 'l5_0', 'l5_1', 'l5_2', 'carve_0', 'lf_0', 'lf_1', 'lf_2', 'lf_3', 't1', 't2', 't3', 't4', 't5', 't6', 'c_tree', 'c_who', 'c_forget', 'c_saw', 'h_mio'];
const c2Vc = { buf: {}, src: null, token: 0, pre: false, log: [] };
function c2VoiceLoad(id) {
  const ctx = fmEnsure();
  if (!ctx) return Promise.reject(new Error('no audio'));
  if (!c2Vc.buf[id]) c2Vc.buf[id] = fetch(`/audio/densetsu/${id}.mp3`).then(r => r.arrayBuffer()).then(a => ctx.decodeAudioData(a)).catch(e => { delete c2Vc.buf[id]; throw e; });
  return c2Vc.buf[id];
}
function c2VoiceStop() {
  c2Vc.token++;
  if (c2Vc.src) { try { c2Vc.src.stop(); } catch (e) {} c2Vc.src = null; }
  if (FM.ctx && FM.music) FM.music.gain.setTargetAtTime(0.7, FM.ctx.currentTime, 0.2);
}
function c2VoicePlay(id) {
  c2VoiceStop();
  if (!id || !FM.on) return;
  const tok = c2Vc.token;
  c2VoiceLoad(id).then(buf => {
    const ctx = FM.ctx;
    if (tok !== c2Vc.token || !ctx || ctx.state !== 'running') return;
    const src = ctx.createBufferSource(), gain = ctx.createGain();
    src.buffer = buf; gain.gain.value = 0.95;
    src.connect(gain); gain.connect(ctx.destination);
    src.onended = () => { if (c2Vc.src === src) { c2Vc.src = null; FM.music.gain.setTargetAtTime(0.7, ctx.currentTime, 0.3); } };
    FM.music.gain.setTargetAtTime(0.22, ctx.currentTime, 0.12);   // 声の あいだは 曲を 小さく
    src.start(ctx.currentTime + 0.08);
    c2Vc.src = src; c2Vc.log.push(id);
  }).catch(() => {});   // 読めなかったら 文字だけ
}
function c2VoicePreload() {
  if (c2Vc.pre || !FM.on || !FM.ctx) return;
  c2Vc.pre = true;
  C2_VOICES.forEach(id => c2VoiceLoad(id).catch(() => {}));
}

// ── てがみを よむ ──
let c2Lt = null;
function c2OpenLetter(l, cb) {
  const def = typeof l === 'string' ? C2_LETTERS[l] : l;
  if (typeof l === 'string' && S && !S.f['l_' + l]) { S.f['l_' + l] = 1; writeSave(); }
  c2Lt = { def, i: 0, cb, song: FM.want };
  G.mode = 'letter';
  if (!def.carve && G.id !== 'eT') fmPlay('d_letter');
  $('ovLetter').hidden = false; $('ltPaper').classList.toggle('stone', !!def.carve);
  c2ShowPage(); c2RefreshBtn();
}
function c2ShowPage() {
  $('ltText').textContent = c2Text(c2Lt.def.pages[c2Lt.i]);
  $('ltNext').textContent = c2Lt.i < c2Lt.def.pages.length - 1 ? '▼ つぎ' : '▼ とじる';
  // なまえが 食べられて いるあいだは 読み上げない（声で なまえが わかって しまうから）
  c2VoicePlay(c2Lt.def.voice && (c2Eat() === 0 || c2Lt.def.carve) ? c2Lt.def.voice[c2Lt.i] : null);
}
function c2LetterNext() {
  if (G.mode !== 'letter' || !c2Lt) return;
  if (++c2Lt.i < c2Lt.def.pages.length) { c2ShowPage(); Sfx.text(); return; }
  const { cb, song } = c2Lt;
  c2VoiceStop();
  c2Lt = null; $('ovLetter').hidden = true; G.mode = 'play';
  if (song && FM.want === 'd_letter' && song !== 'd_letter') fmPlay(song);
  input.ap = input.bp = input.cp = false;
  if (cb) cb();
}

// ── えらぶ（タッチは 直接 おす。キーボードは 上下で えらんで きめる）──
let c2Menu = null;
function c2Choose(title, opts, cb) {
  G.mode = 'choice';
  const box = $('chBtns');
  $('chTitle').textContent = title;
  box.textContent = '';
  const btns = opts.map((t, i) => {
    const b = document.createElement('button');
    b.className = 'mbtn chBtn'; b.textContent = t;
    b.addEventListener('click', () => { c2Menu = null; $('ovChoice').hidden = true; G.mode = 'play'; input.ap = input.bp = input.cp = false; cb(i); });
    box.appendChild(b);
    return b;
  });
  $('ovChoice').hidden = false;
  c2Menu = { btns, i: -1, py: 0 };
}
function c2TickMenu() {
  const m = c2Menu; if (!m) return;
  const dy = input.y + input.x;
  if (dy && dy !== m.py) {
    m.i = m.i < 0 ? 0 : (m.i + (dy > 0 ? 1 : -1) + m.btns.length) % m.btns.length;
    m.btns.forEach((b, j) => b.classList.toggle('sel', j === m.i));
  }
  m.py = dy;
  // きめるのは えらんだ あとだけ（💬の 連打で うっかり きまらないように）
  if (m.i >= 0 && (input.ap || input.cp)) m.btns[m.i].click();
}

// ── 島を しらべる ──
function c2Story(e) {
  const k = e.def.kind;
  if (k === 'bottle') return c2Bottle();
  if (k === 'stele') return c2Stele();
  if (k === 'rock') return c2Rock();
  if (k === 'lock') return c2Lock();
  if (k === 'well') return say('ふるい いど。\nのぞくと、ずっと 下で 水の 音が する。');
  if (k === 'mound') return c2Dig();
  if (k === 'carve') return c2NameScene();
}
function c2Bottle() {
  give('bottle', () => c2OpenLetter('l1', () => {
    colonSay('海の むこうの 光って……\nぼくたちが ともした 火かな？', () => {
      c2Choose('へんじを かこう', ['その光、わたしが ともした 火だよ', '島の 灯台は まっくらだよ'], () => {
        say(['アンリノは へんじを びんに いれて、海へ ながした。', 'びんは 波に のって 見えなくなり……\nすぐに、べつの びんが はこばれてきた。'], () => {
          fmJingle('d_get');
          c2OpenLetter('l2', () => colonSay('灯台は まっくらなのに、ぴかぴか……？\nきたの 灯台へ いって みよう！'));
        });
      });
    });
  }));
}
function c2Stele() {
  say('この灯台、100年前に たてられる。\n火が きえてからは、のぼる者も なし。', () => {
    if (!c2Has('l2')) return colonSay('なんだろう……。\nはまべの びんも 気に なるなあ。');
    if (flag('c2_100')) return;
    colonSay(['100年前……？\nミオは「ことし できた」って 言ってたよね。', 'アンリノ……ミオって、100年 まえの 人なの？'], () => {
      c2Choose('へんじを かこう', ['ミオ。きみは 100年 まえに いるのかも'], () => {
        say('アンリノは へんじを びんに いれて、海へ ながした。', () => {
          fmJingle('d_get');
          setFlag('c2_100');
          c2OpenLetter('l3', () => colonSay('100年 たっても のこること……。\nあの 大きな 岩を、どうにか できないかな？'));
        });
      });
    });
  });
}
function c2Rock() {
  if (!flag('c2_100')) return say('大きな 岩で、道が ふさがれている。\nおしても びくとも しない。');
  c2Choose('ミオに おねがいしよう', ['岩を どかして', '岩の そばに 木を うえて'], i => {
    if (i === 0) return c2OpenLetter(C2_NOTE_HEAVY, () => colonSay('100年 かけて できること……\nなにが あるかなあ。'));
    say('アンリノは へんじを びんに いれて、海へ ながした。', () => {
      c2OpenLetter('l4', () => {
        G.c2Flash = 40; G.shake = 8; Sfx.boom(); fmJingle('d_solve');
        setFlag('c2_tree');
        colonSay('うわあ……！\nこれ、ミオが きのう うえた 木だよ！', () => colonSay('100年ぶんの 根っこが、岩を おしのけたんだ！'), ['c_tree']);
      });
    });
  });
}
function c2Lock() {
  if (flag('c2_key')) {
    Sfx.door(); setFlag('c2_door'); toast('さびた カギで あけた！');
    return colonSay('ミオが うめてくれた カギだ。\n……なかへ 入ろう。');
  }
  if (flag('c2_ask')) return colonSay('ひがしの 村の いどの そばを、さがしてみよう！');
  colonSay('とびらに カギが かかってる。\nこれも、ミオに たのめないかな？', () => {
    c2Choose('へんじを かこう', ['灯台の カギを、いどの そばに うめて'], () => {
      say('アンリノは へんじを びんに いれて、海へ ながした。', () => {
        setFlag('c2_ask');
        c2OpenLetter('l4b', () => colonSay('いどは、丘を ひがしへ いった 村に あったはず！'));
      });
    });
  });
}
function c2Dig() {
  say('土が すこし もりあがっている。\nほってみた。', () => {
    S.f.c2_key = 1; writeSave(); rebuildTiles(); bakeRoom();
    give('oldkey', () => {
      say('カギと いっしょに、石が でてきた。\n字が ほってある。\n\nアンリノへ。 とどいた？', () => {
        colonSay('……100年、ずっと ここで まってたんだね。', () => {
          fmJingle('d_get');
          colonSay('あ！ また びんが とどいたよ。', () => c2OpenLetter('l5', () => colonSay('……灯台へ いこう、アンリノ。')));
        });
      });
    });
  });
}

// ── へやに 入ったときの できごと（ダイアログを 出したら true）──
function c2Tick() {
  if (!S || !flag('ending')) return false;
  if (flag('ch2')) c2VoicePreload();
  if (G.id === 's0' && !flag('c2_arrive')) {
    S.f.c2_arrive = 1; writeSave();
    colonSay(['ここが しおさいの島……。\nだれも いないみたい。', 'あ！ 波うちぎわで、なにか 光ってる！']);
    return true;
  }
  if (G.id === 'e0' && !flag('c2_eat1')) {
    S.f.c2_eat1 = 1; writeSave(); Sfx.ting();
    say('かげの 気配が して、もっていた てがみが くろく にじんだ。', () => colonSay('たいへん！\nかげが、てがみの 字を 食べてる！\n📜で 見てみて！'));
    return true;
  }
  if (G.id === 'e4' && !flag('c2_eat2')) {
    S.f.c2_eat2 = 1; writeSave(); fmJingle('d_get');
    colonSay('びんだ！ こんな 灯台の 中まで……。', () => c2OpenLetter('l6', () => {
      colonSay(['この てがみの 子……\nなまえ、なんだっけ？', 'おかしいな。\nぼく、ぜんぜん 思いだせない。'], null, ['c_who', 'c_forget']);
    }));
    return true;
  }
  if (flag('c2_lit') && !flag('c2_end')) {
    if (G.id === 'h1') { c2Finale(); return true; }
    if (G.id === 'eT') { startFade('h1', 120, 104, 'u'); return true; }
  }
  return false;
}
function c2Hint() {
  if (!c2Has('l1')) return '波うちぎわで 光っている びんを しらべよう！';
  if (!flag('c2_100')) return 'きたへ すすんで、灯台の そばの 石を 読んでみよう！';
  if (!flag('c2_tree')) return '灯台の まえの 大きな 岩を しらべてみよう。\n100年 かけて できることって、なんだろう？';
  if (!flag('c2_key')) return flag('c2_ask') ? '丘を ひがしへ いくと、村の あとが あるよ。\nいどの そばを さがそう！' : '灯台の とびらを しらべてみよう！';
  if (!flag('c2_door')) return '灯台の とびらへ もどろう。\nミオの カギが あるよ！';
  if (!flag('e0_clear')) return 'かげを ぜんぶ たおすと、とびらが ひらくよ！';
  if (!flag('e1_n')) return S.keys > 0 ? 'ひろまの きたの とびらを カギで あけよう！' : 'ひろまの ひだりの へやで、いわを おしてみよう！';
  if (!flag('e4_n')) {
    if (S.keys > 0) return flag('e4_bridge') ? 'はしを わたって、きたの とびらを あけよう！' : '風で まるい いわを 赤い いしいたへ。\nはしが かかるよ！';
    return 'ひろまの みぎの 風車を 風で まわしてごらん。\nカギが あるかも！';
  }
  if (!flag('e5_dead')) return 'きたの 大きな かげの ぬしを たおそう！\nむらさきの たては 風で はがしてから たたくんだ！';
  return 'てっぺんの かべに、なにか 字が 見えるよ。\nしらべてみよう！';
}

// ── なまえを かく ──
let c2Nm = null;
function c2NameScene() {
  if (flag('c2_lit')) return say('ともった 火が、海を てらしている。');
  c2OpenLetter(C2_CARVE, () => colonSay('きみが よんでくれたら……？\nこの 子の なまえ……アンリノ、おぼえてる？', c2OpenName));
}
function c2OpenName() {
  G.mode = 'name';
  c2Nm = { typed: '', miss: 0 };
  const box = $('nmKana'); box.textContent = '';
  C2_KANA.forEach(k => {
    const b = document.createElement('button');
    b.className = 'mbtn nmBtn'; b.textContent = k; b.dataset.k = k;
    b.addEventListener('click', () => c2Type(k));
    box.appendChild(b);
  });
  $('nmHint').textContent = 'かなを えらんで、なまえを かこう';
  $('ovName').hidden = false; c2ShowName();
}
function c2ShowName() { $('nmSlots').textContent = (c2Nm.typed + '＿＿').slice(0, 2).split('').join(' '); }
function c2Type(k) {
  if (G.mode !== 'name' || !c2Nm || c2Nm.typed.length >= 2) return;
  c2Nm.typed += k; Sfx.text(); c2ShowName();
  if (c2Nm.typed.length < 2) return;
  if (c2Nm.typed === C2_NAME) return c2Named();
  c2Nm.miss++;
  Sfx.hurt();
  $('nmHint').textContent = c2Nm.miss === 1 ? 'コロン「ちがう みたい。……船の とおる 海の みち……って、だれかが 言ってたね」' : 'コロン「もう いちど！ 光っている 字から」';
  if (c2Nm.miss >= 2) document.querySelectorAll('.nmBtn').forEach(b => b.classList.toggle('glow', b.dataset.k === C2_NAME[0]));
  setTimeout(() => { if (c2Nm) { c2Nm.typed = ''; c2ShowName(); } }, 700);
}
function c2Named() {
  $('ovName').hidden = true; c2Nm = null; G.mode = 'play';
  S.f.c2_lit = 1; writeSave();
  fmStop();
  say('ミオ！', () => {
    G.mode = 'ending2'; G.end = { t: 0 };
  }, 'アンリノ', ['h_mio']);
}

// ── 夜明け：2つの 時代の 灯台に、同時に 火が ともる ──
const C2_DAWN_LINES = [[840, 'コロン「……見えた？ いま」'], [1080, 'アンリノは、だまって うなずいた。']];
function c2TickDawn() {
  const e = G.end; e.t++;
  if (e.t === 110) fmPlay('d_hikari');
  if (e.t === C2_DAWN_LINES[0][0]) c2VoicePlay('c_saw');
  if (e.t >= 1320) { G.mode = 'play'; G.end = null; enterRoom('h1', 120, 104, 'u'); }
}
function c2DrawDawn() {
  const t = G.end.t, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dawn = clamp((t - 520) / 500, 0, 1);
  const sky = g.createLinearGradient(0, 0, 0, 130);
  sky.addColorStop(0, `rgb(${10 + dawn * 70},${14 + dawn * 90},${44 + dawn * 120})`);
  sky.addColorStop(1, `rgb(${34 + dawn * 220},${40 + dawn * 150},${90 + dawn * 50})`);
  g.fillStyle = sky; g.fillRect(0, 0, W, 130);
  for (let i = 0; i < 44; i++) { const x = (i * 83) % 240, y = (i * 37) % 110; g.fillStyle = `rgba(255,255,255,${.7 * (1 - dawn) * (.4 + .6 * Math.sin(t * .03 + i) ** 2)})`; g.fillRect(x, y, 1, 1); }
  if (dawn > 0) { const sy = 132 - dawn * 34; g.fillStyle = 'rgba(255,240,190,.9)'; g.beginPath(); g.arc(120, sy, 15, 0, 7); g.fill(); g.fillStyle = 'rgba(255,230,160,.22)'; g.beginPath(); g.arc(120, sy, 30, 0, 7); g.fill(); }
  g.fillStyle = `rgb(${30 + dawn * 60},${60 + dawn * 70},${110 + dawn * 50})`; g.fillRect(0, 130, W, 62);
  for (let i = 0; i < 26; i++) { const x = (i * 47 + t * .15 * (1 + i % 3)) % 250 - 5, y = 134 + (i * 13) % 56; g.fillStyle = 'rgba(190,230,255,.3)'; g.fillRect(x, y, 8, 1); }
  // みさき
  g.fillStyle = '#27304f'; g.fillRect(0, 120, 80, 14); g.fillRect(0, 112, 66, 10); g.fillRect(160, 120, 80, 14); g.fillRect(174, 112, 66, 10);
  const on = t > 170, grow = clamp((t - 170) / 170, 0, 1);
  Art.c2Tower(g, 26, 44, true, on); Art.c2Tower(g, 192, 44, false, on);
  if (on) {
    [[37, 1], [203, -1]].forEach(([lx, s]) => {
      const L = 96 * grow, ly = 32, ey = 40;
      const beam = g.createLinearGradient(lx, ly, lx + s * L, ey);
      beam.addColorStop(0, 'rgba(255,236,150,.9)'); beam.addColorStop(1, 'rgba(255,236,150,.15)');
      g.fillStyle = beam; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx + s * L, ey - 7); g.lineTo(lx + s * L, ey + 7); g.closePath(); g.fill();
    });
    // 光が かさなる
    const hit = clamp((t - 340) / 60, 0, 1) * (1 - clamp((t - 620) / 260, 0, 1));
    if (hit > 0) {
      const r = 4 + hit * 10 + Math.sin(t * .08) * 1.5;
      g.fillStyle = `rgba(255,250,210,${.28 * hit})`; g.beginPath(); g.arc(120, 40, r * 2.4, 0, 7); g.fill();
      g.fillStyle = `rgba(255,255,235,${.9 * hit})`; g.beginPath(); g.arc(120, 40, r, 0, 7); g.fill();
    }
    if (t > 340 && t < 400) { g.fillStyle = `rgba(255,255,240,${(1 - Math.abs(t - 370) / 30) * .8})`; g.fillRect(0, 0, W, H); }
  }
  // かげが きえていく
  const fade = 1 - clamp((t - 350) / 220, 0, 1);
  if (fade > 0) for (let i = 0; i < 18; i++) {
    const x = (i * 61 + 13) % 240, y = ((i * 29) % 90) + 8 - (1 - fade) * 50 - i % 5;
    g.fillStyle = `rgba(16,10,38,${.55 * fade})`; g.beginPath(); g.arc(x, y, 5 + i % 5 * 1.6, 0, 7); g.fill();
  }
  // ふたつの 時代の さかい
  const seam = 1 - clamp((t - 340) / 90, 0, 1);
  if (seam > 0) { g.fillStyle = `rgba(255,255,255,${.5 * seam})`; g.fillRect(119, 0, 2, 192); }
  // ひとびと
  g.drawImage(Art.heroFrames.u[0], 46, 96); g.drawImage(Art.colon, 66, 100);
  Art.c2Mio(g, 178, 96);
  // ことば
  let line = null; C2_DAWN_LINES.forEach(([f, s]) => { if (t >= f) line = s; });
  if (line) c2DrawLine(line);
}
function c2DrawLine(s) {
  g.fillStyle = 'rgba(10,14,40,.76)'; g.fillRect(4, 148, 232, 34);
  g.fillStyle = '#fff7e0'; g.font = '13px DotGothic16, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  s.split('\n').forEach((l, i, a) => g.fillText(l, W / 2, 165 + (i - (a.length - 1) / 2) * 15));
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
}

// ── 村長と さいごの 1通 ──
function c2Finale() {
  const n = NAMES.turtle;
  say(['おかえり、アンリノ。……会えたようじゃな。',
    'これを わたす 日を、ずっと まっておった。',
    'わしの ともだちから あずかったんじゃ。\n100年 まえにな。',
    'わしは そのころ、小さな カメでな。\nその子の かたに のって、火の ばんを しておった。',
    'あの子は おばあさんに なるまで、\n毎ばん 灯台に のぼったよ。'], () => {
    fmPlay('d_letter');
    c2OpenLetter('lf', () => {
      say('……ずいぶん かかって しまったな、ミオ。', () => {
        S.f.c2_end = 1; writeSave(); c2SyncClear(S);
        G.mode = 'ending3'; G.end = { t: 0 }; $('ovEnd').hidden = false; fmPlay('d_letter');
      }, n, ['t6']);
    });
  }, n, ['t1', 't2', 't3', 't4', 't5']);
}
function c2TickDusk() { if (++G.end.t >= 820) $('btnEnd').hidden = false; }
function c2DrawDusk() {
  const t = G.end.t;
  const sky = g.createLinearGradient(0, 0, 0, 130);
  sky.addColorStop(0, '#2b2a66'); sky.addColorStop(.55, '#b0568a'); sky.addColorStop(1, '#ffb36a');
  g.fillStyle = sky; g.fillRect(0, 0, W, 130);
  for (let i = 0; i < 26; i++) { const x = (i * 83) % 240, y = (i * 37) % 50; g.fillStyle = `rgba(255,255,255,${.6 * (.3 + .7 * Math.sin(t * .03 + i) ** 2)})`; g.fillRect(x, y, 1, 1); }
  g.fillStyle = '#7d4a6e'; g.fillRect(0, 130, W, 62);
  for (let i = 0; i < 22; i++) { const x = (i * 47 + t * .12 * (1 + i % 3)) % 250 - 5, y = 134 + (i * 13) % 34; g.fillStyle = 'rgba(255,200,160,.32)'; g.fillRect(x, y, 8, 1); }
  // とおくの しおさいの島と、1つの あかり
  g.fillStyle = '#39274f'; g.fillRect(150, 122, 62, 8); g.fillRect(162, 116, 34, 6); g.fillRect(176, 104, 4, 12);
  if (t > 160) {
    const a = .55 + .45 * Math.sin(t * .05);
    g.fillStyle = `rgba(255,236,150,${.22 * a})`; g.beginPath(); g.arc(178, 103, 7, 0, 7); g.fill();
    g.fillStyle = `rgba(255,244,190,${a})`; g.fillRect(177, 102, 2, 2);
  }
  // さんばしの 3にん
  g.fillStyle = '#4a2c3e'; g.fillRect(0, 136, 150, 56);
  g.fillStyle = '#6b4256'; for (let i = 0; i < 150; i += 12) g.fillRect(i, 136, 11, 2);
  g.drawImage(Art.heroFrames.u[0], 66, 116); g.drawImage(Art.colon, 88, 122); g.drawImage(Art.NPC.turtle, 40, 120);
  if (t >= 640) {
    g.fillStyle = `rgba(255,247,224,${Math.min(1, (t - 640) / 90)})`; g.font = '16px DotGothic16, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('第2章 おわり', W / 2, 62);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  }
}

// ── はじまり ──
function c2StartScene() {
  const n = NAMES.turtle;
  colonSay('アンリノ、見て！\n海の むこうの かげが、まだ きえてない。', () => {
    say(['あれは しおさいの島じゃ。\n……なつかしい 名じゃのう。', '気をつけて おいき。\nわしは ここで まっておるよ。'], () => {
      S.f.ch2 = 1; S.keys = 0; S.hp = S.maxHp; writeSave();
      startFade('s0', 88, 104, 'u');
    }, n);
  });
}
function c2StartFromMenu() {
  if (!S) S = loadSave();
  if (!S) return;
  $('ovTitle').hidden = true; $('ovEnd').hidden = true; $('btnEnd').hidden = true; $('btnCh2End').hidden = true;
  G.end = null; fmUnlock();
  G.mode = 'play';
  enterRoom('h1', 120, 104, 'u');
  c2StartScene();
}
function c2Boat(toIsland) {
  c2Choose(toIsland ? 'しおさいの島へ いく？' : 'みなとの村へ もどる？', ['いく', 'やめる'], i => {
    if (i) return;
    if (toIsland) startFade('s0', 88, 104, 'u'); else startFade('v0', 72, 104, 'r');
  });
}

// ── 章を えらぶ ──
//   ena_densetsu_clear：クリアした 章（セーブを 作りなおしても のこる）
//   ena_densetsu_slots：遊びかけの 章の セーブ（べつの 章へ いくあいだ あずかる）
const C2_CLEAR_KEY = 'ena_densetsu_clear', C2_SLOT_KEY = 'ena_densetsu_slots';
const c2Read = k => { try { return JSON.parse(localStorage.getItem(k) || '{}') || {}; } catch (e) { return {}; } };
const c2Write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const c2ChapterOf = sv => (sv.f.ch2 ? 2 : 1);
const c2IsCleared = sv => (sv.f.ch2 ? !!sv.f.c2_end : !!sv.f.ending);
// セーブを 見て、クリアの きろくを のこす（前から クリアしていた人の ぶんも ここで 入る）
function c2SyncClear(sv) {
  if (!sv || !sv.f.ending) return c2Read(C2_CLEAR_KEY);
  const c = c2Read(C2_CLEAR_KEY);
  // 第2章の しずくの うつわを ふくめないよう、第2章の セーブでは 第1章の 上限（10）までに する
  const hp = sv.f.ch2 ? Math.min(sv.maxHp, 10) : sv.maxHp;
  c.c1 = { maxHp: Math.max(hp, (c.c1 && c.c1.maxHp) || 0), shells: Math.max(sv.shells || 0, (c.c1 && c.c1.shells) || 0) };
  if (sv.f.c2_end) c.c2 = true;
  c2Write(C2_CLEAR_KEY, c);
  return c;
}
function c2ParkCurrent() {
  const cur = loadSave();
  if (!cur) return;
  const slots = c2Read(C2_SLOT_KEY), ch = c2ChapterOf(cur);
  if (c2IsCleared(cur)) delete slots[ch]; else slots[ch] = cur;
  c2Write(C2_SLOT_KEY, slots);
}
function c2Resumable(ch) {
  const cur = loadSave();
  if (cur && c2ChapterOf(cur) === ch && !c2IsCleared(cur)) return true;
  return !!c2Read(C2_SLOT_KEY)[ch];
}
function c2Resume(ch) {
  const cur = loadSave();
  if (!(cur && c2ChapterOf(cur) === ch && !c2IsCleared(cur))) {
    c2ParkCurrent();
    const slots = c2Read(C2_SLOT_KEY), sv = slots[ch];
    delete slots[ch]; c2Write(C2_SLOT_KEY, slots);
    localStorage.setItem(SAVE_KEY, JSON.stringify(sv));
  }
  S = null; startCont();
}
function c2NewChapter(ch) {
  const clear = c2SyncClear(S || loadSave());
  c2ParkCurrent();
  const slots = c2Read(C2_SLOT_KEY); delete slots[ch]; c2Write(C2_SLOT_KEY, slots);
  c2CloseChapters();
  $('ovEnd').hidden = true; $('btnEnd').hidden = true; $('btnCh2End').hidden = true;
  if (ch === 1) return startNew();
  S = Object.assign(newSave(), { staff: true, jar: true, maxHp: (clear.c1 && clear.c1.maxHp) || 8, shells: (clear.c1 && clear.c1.shells) || 0, f: { ending: 1, boss_dead: 1 } });
  S.hp = S.maxHp; writeSave();
  c2StartFromMenu();
}
// 第2章へ：遊びかけなら つづきから、なければ はじめから
function c2GoCh2() {
  if (S) writeSave();
  c2SyncClear(S || loadSave());
  $('ovEnd').hidden = true; $('btnEnd').hidden = true; $('btnCh2End').hidden = true;
  if (c2Resumable(2)) { c2CloseChapters(); return c2Resume(2); }
  c2NewChapter(2);
}
const C2_CHAPTERS = [[1, '第1章 きえた ともしび'], [2, '第2章 ひかりの てがみ']];
function c2OpenChapters() {
  const box = $('cpBtns'); box.textContent = '';
  $('cpTitle').textContent = '章を えらぶ';
  const add = (label, fn) => { const b = document.createElement('button'); b.className = 'mbtn chBtn'; b.textContent = label; b.addEventListener('click', fn); box.appendChild(b); };
  C2_CHAPTERS.forEach(([ch, label]) => add(label, () => {
    if (!c2Resumable(ch)) return c2NewChapter(ch);
    $('cpTitle').textContent = label; box.textContent = '';
    add('つづきから', () => { c2CloseChapters(); c2Resume(ch); });
    add('はじめから', () => c2NewChapter(ch));
  }));
  $('ovChapters').hidden = false;
}
function c2CloseChapters() { $('ovChapters').hidden = true; }

// ── てがみの 入れもの ──
function c2RefreshBtn() { if (S) $('btnLetters').hidden = !C2_ORDER.some(c2Has); }
function c2OpenList() {
  if (G.mode !== 'play' || !S) return;
  G.mode = 'list';
  const box = $('lsBtns'); box.textContent = '';
  C2_ORDER.filter(c2Has).forEach(id => {
    const b = document.createElement('button');
    b.className = 'mbtn chBtn'; b.textContent = C2_LETTERS[id].title;
    b.addEventListener('click', () => { $('ovList').hidden = true; c2OpenLetter(id, () => { c2OpenList(); }); });
    box.appendChild(b);
  });
  $('ovList').hidden = false;
}
function c2CloseList() { if (G.mode === 'list') { $('ovList').hidden = true; G.mode = 'play'; } }
function c2Init() {
  $('ovLetter').addEventListener('click', c2LetterNext);
  $('btnLetters').addEventListener('click', c2OpenList);
  $('lsClose').addEventListener('click', c2CloseList);
  $('btnCh2').addEventListener('click', c2GoCh2);
  $('btnCh2End').addEventListener('click', c2GoCh2);
  $('btnChapters').addEventListener('click', c2OpenChapters);
  $('cpClose').addEventListener('click', c2CloseChapters);
}
