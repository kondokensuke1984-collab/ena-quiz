// 🏫 がっこうの じゅぎょう：教科キャラが、その子の月・教科の問題を 1もん だす。
// クイズと同じ /data/questions_<月>.json と /data/subjects_<月>.json を読むだけ（メダルは出さない）。

export interface Lesson {
  q: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface RawQ {
  id?: string; subject?: string; q?: string; answer?: unknown; explanation?: string;
  options?: unknown; qImage?: unknown; qImage2?: unknown;
}
interface RawSubject { category?: string; parent?: string }

const cache: Record<string, Promise<{ qs: RawQ[]; subs: Record<string, RawSubject> } | null>> = {};

function load(month: string) {
  if (!/^\d{6}$/.test(month)) return Promise.resolve(null);
  cache[month] ??= Promise.all([
    fetch(`/data/questions_${month}.json`).then((r) => (r.ok ? r.json() : null)),
    fetch(`/data/subjects_${month}.json`).then((r) => (r.ok ? r.json() : null)),
  ])
    .then(([qs, subs]) => (Array.isArray(qs) && subs && typeof subs === 'object' ? { qs, subs } : null))
    .catch(() => null);
  return cache[month];
}

/** タグを はずし、ふつうの文字に（改行は のこす） */
function plain(s: unknown): string {
  return String(s ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .trim();
}

/** 1行めの「基本問題1-1」などの 見出しは けす */
function stripHeading(q: string): string {
  const lines = q.split('\n');
  if (lines.length > 1 && /問題|演習|チャレンジ/.test(lines[0]) && lines[0].length <= 16) lines.shift();
  return lines.join('\n').trim();
}

/** 図や 上の文を 見ないと とけない問題は 出さない */
const FIG_REF = /図|グラフ|写真|[(（][0-9０-９]+[)）]の|[①-⑩]の|下の|右の|左の|上の/;

/** その月・教科（cat）から、図のない みじかい問題を 1もん。出せなければ null */
export async function pickLesson(month: string, cat: string, notId?: string): Promise<(Lesson & { id: string }) | null> {
  const d = await load(month);
  if (!d) return null;
  const catOf = (key: string): string => {
    const s = d.subs[key];
    return s?.category ?? (s?.parent ? d.subs[s.parent]?.category ?? '' : '');
  };
  const pool = d.qs.filter((x) =>
    x.id && x.subject && catOf(x.subject) === cat && !x.qImage && !x.qImage2 &&
    typeof x.q === 'string' && !/<(svg|img|table)/i.test(x.q) && !FIG_REF.test(x.q) && plain(x.q).length <= 120 && (typeof x.answer === 'number' || plain(x.answer).length > 0));
  if (!pool.length) return null;
  const others = pool.filter((x) => x.id !== notId);
  const x = (others.length ? others : pool)[Math.floor(Math.random() * (others.length || pool.length))];
  const ex = plain(x.explanation);
  const options = Array.isArray(x.options) ? x.options.map(plain).filter(Boolean) : [];
  // えらぶ問題の answer は 番号（0から）
  const answer = options.length && typeof x.answer === 'number' ? options[x.answer] ?? '' : plain(x.answer);
  return {
    id: x.id!,
    q: stripHeading(plain(x.q)),
    options,
    answer,
    explanation: ex.length > 200 ? ex.slice(0, 200) + '…' : ex,
  };
}
