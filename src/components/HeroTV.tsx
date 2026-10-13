"use client";

import { useEffect, useState } from "react";
import { Mark } from "./Logo";

/** VHS-style tape counter that starts when the page loads. */
function Counter() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setT(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="num">
      {p(Math.floor(t / 3600))}:{p(Math.floor(t / 60) % 60)}:{p(t % 60)}
    </span>
  );
}

/** The hero television: color bars, an on-screen display and a rolling tracking band. */
export function HeroTV({ channels }: { channels: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px]" aria-hidden="true">
      {/* rabbit-ear antenna */}
      <svg viewBox="0 0 200 60" className="mx-auto -mb-1 block h-12 w-40" fill="none">
        <path d="M100 58L52 6" stroke="#4A4D57" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 58L150 4" stroke="#4A4D57" strokeWidth="3" strokeLinecap="round" />
        <circle cx="52" cy="6" r="4" fill="#FFC23D" />
        <circle cx="150" cy="4" r="4" fill="#FF6A1A" />
      </svg>
      <div className="rounded-[26px] border border-line-strong bg-gradient-to-b from-[#1C1D22] to-[#111215] p-3.5 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)] sm:p-4">
        <div className="crt flicker aspect-[4/3] bg-black">
          <div className="jitter absolute inset-0">
            <div className="bars absolute inset-x-0 top-0 h-[66%] opacity-90" />
            <div className="bars-low absolute inset-x-0 top-[66%] h-[10%] opacity-90" />
            <div className="absolute inset-x-0 bottom-0 top-[76%] bg-[linear-gradient(90deg,#0b1a5a_0_18%,#f1ebdd_18%_36%,#2a0f5e_36%_54%,#111_54%_100%)] opacity-90" />
          </div>
          {/* center card */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex items-center gap-3 rounded-md bg-black/80 px-5 py-3 shadow-[0_0_0_2px_rgba(255,255,255,.08)]">
              <Mark className="h-11 w-11" />
              <span className="font-display text-[44px] leading-none tracking-[0.08em] text-bone sm:text-[54px]">RERUN</span>
            </div>
          </div>
          {/* on-screen display */}
          <div className="absolute left-4 top-3 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-white [text-shadow:0_0_6px_rgba(255,255,255,.6)] sm:left-5 sm:top-4 sm:text-[15px]">
            Play ▶
          </div>
          <div className="absolute right-4 top-3 flex items-center gap-1.5 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-white [text-shadow:0_0_6px_rgba(255,255,255,.6)] sm:right-5 sm:top-4 sm:text-[15px]">
            <span className="h-2 w-2 animate-blink rounded-full bg-down" /> CH {String(channels).padStart(2, "0")}
          </div>
          <div className="absolute bottom-3 left-4 font-mono text-[13px] font-semibold tracking-[0.12em] text-white [text-shadow:0_0_6px_rgba(255,255,255,.6)] sm:bottom-4 sm:left-5 sm:text-[15px]">
            <Counter />
          </div>
          <div className="absolute bottom-3 right-4 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-white [text-shadow:0_0_6px_rgba(255,255,255,.6)] sm:bottom-4 sm:right-5 sm:text-[15px]">
            SP
          </div>
          <div className="tracking" />
        </div>
        {/* bezel controls */}
        <div className="mt-3 flex items-center gap-3 px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Rerun · Solana</span>
          <span className="ml-auto flex items-center gap-1" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="h-3 w-[3px] rounded-full bg-line-strong" />
            ))}
          </span>
          <span className="h-5 w-5 rounded-full border border-line-strong bg-gradient-to-b from-[#2a2c33] to-[#15161a]" />
          <span className="h-5 w-5 rounded-full border border-line-strong bg-gradient-to-b from-[#2a2c33] to-[#15161a]" />
          <span className="h-1.5 w-1.5 rounded-full bg-pulse shadow-[0_0_8px_#FF6A1A]" />
        </div>
      </div>
    </div>
  );
}
