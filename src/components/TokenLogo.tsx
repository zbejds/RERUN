"use client";

import { useState } from "react";

export function TokenLogo({ src, symbol, size = 36 }: { src: string | null | undefined; symbol: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };
  if (!src || broken) {
    return (
      <span
        style={style}
        className="grid shrink-0 place-items-center rounded-md border border-line bg-panel-3 font-mono text-[11px] font-semibold text-bone-dim"
        aria-hidden="true"
      >
        {symbol.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      style={style}
      loading="lazy"
      onError={() => setBroken(true)}
      className="shrink-0 rounded-md border border-line bg-panel-3 object-cover"
    />
  );
}
