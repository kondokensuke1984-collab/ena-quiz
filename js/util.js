// index.html から機械的に切り出した汎用関数。手で編集しない。

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderMath(text) {
  if (!text) return '';
  let s = String(text);
  // Mixed number: 3と2/7 → KaTeX
  s = s.replace(/(\d+)と(\d+)\/(\d+)/g, (_, a, b, c) => {
    try { return typeof katex !== 'undefined'
      ? katex.renderToString(a + '\\dfrac{' + b + '}{' + c + '}', {throwOnError:false})
      : a + ' ' + b + '/' + c; }
    catch(e) { return _; }
  });
  // Simple fraction: 2/7 → KaTeX
  s = s.replace(/(\d+)\/(\d+)/g, (_, a, b) => {
    try { return typeof katex !== 'undefined'
      ? katex.renderToString('\\dfrac{' + a + '}{' + b + '}', {throwOnError:false})
      : a + '/' + b; }
    catch(e) { return _; }
  });
  return s;
}

let _audioCtx = null;   // index.html 側の宣言が別行にあるため、ここで補う
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

function playSound(isCorrect) {
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      if (isCorrect) {
        [[880, 0, 0.15], [1100, 0.18, 0.15]].forEach(([freq, delay, dur]) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.4, ctx.currentTime + delay);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          o.start(ctx.currentTime + delay);
          o.stop(ctx.currentTime + delay + dur);
        });
      } else {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(220, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.25, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.3);
      }
    });
  } catch(e) {}
}

