import React from 'react';

// まだ孵っていないたまご。chars.js が読めなかったときの代役も兼ねる。
function EggSVGBase({ size = 90, wobble = true }: { size?: number; wobble?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ overflow: 'visible' }}>
      <ellipse cx="50" cy="93" rx="22" ry="5" fill="rgba(0,0,0,0.22)" />
      <g style={wobble ? { animation: 'egg-wobble 2.6s ease-in-out infinite', transformOrigin: '50px 90px' } : undefined}>
        <path
          d="M50 12 C66 12 78 38 78 58 C78 77 65 90 50 90 C35 90 22 77 22 58 C22 38 34 12 50 12 Z"
          fill="#fffaf3"
          stroke="#c4b5fd"
          strokeWidth="2.6"
        />
        <ellipse cx="38" cy="40" rx="6" ry="9" fill="#fff" opacity="0.9" />
        <circle cx="40" cy="64" r="4.5" fill="#fbcfe8" />
        <circle cx="60" cy="56" r="3.5" fill="#bfdbfe" />
        <circle cx="55" cy="74" r="3" fill="#fde68a" />
        <circle cx="33" cy="76" r="2.6" fill="#bbf7d0" />
      </g>
    </svg>
  );
}

export const EggSVG = React.memo(EggSVGBase);
