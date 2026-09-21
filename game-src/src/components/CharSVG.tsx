import React, { useEffect, useMemo, useState } from 'react';
import { loadChars, type CharKey, type CharMap } from '../lib/chars';
import { EggSVG } from './EggSVG';

let shared: CharMap | null = null;

export function useChars(): CharMap | null {
  const [chars, setChars] = useState<CharMap | null>(shared);
  useEffect(() => {
    if (shared) return;
    let alive = true;
    loadChars().then((m) => {
      shared = m;
      if (alive) setChars(m);
    });
    return () => { alive = false; };
  }, []);
  return chars;
}

interface Props {
  charKey: CharKey;
  level: number;
  fillPct: number;
  size: number;
  silhouette?: boolean;
  stars?: number;
  label: string;
}

/**
 * js/chars.js が返す SVG 文字列をそのまま差し込む。
 *
 * dangerouslySetInnerHTML について：
 *  - 文字列は自前の chars.js が生成したもので、渡すのは数値と真偽値だけ。
 *    props の型に自由文字列がなく、呼ぶ前に Number()/!! で強制変換するので markup は混ざらない。
 *  - chars.js は <mask id> に Math.random() のIDを使う。メモ化しないと再レンダーのたびに
 *    サブツリーが丸ごと差し替わってチラつくので、memo と useMemo は必須（最適化ではない）。
 *  - 差し込んだHTMLの中は React が管理できないので、きせかえなどは上に重ねて描くこと。
 */
function CharSVGBase({ charKey, level, fillPct, size, silhouette = false, stars = 0, label }: Props) {
  const chars = useChars();

  const html = useMemo(() => {
    const fn = chars?.[charKey];
    if (!fn) return null;
    try {
      return fn(Number(level) | 0, Number(fillPct) || 0, Number(size) | 0, {
        silhouette: !!silhouette,
        stars: Number(stars) | 0,
      });
    } catch {
      return null;
    }
  }, [chars, charKey, level, fillPct, size, silhouette, stars]);

  if (!html) return <EggSVG size={size} wobble={false} />;
  return <div role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const CharSVG = React.memo(CharSVGBase);
