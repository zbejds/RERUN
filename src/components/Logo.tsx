/**
 * The RERUN mark: an old TV set showing the rewind symbol. Legends, played again.
 */
export function Mark({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  // Same gradient everywhere, so a shared id is safe even if the mark appears twice.
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="rr-screen" x1="6" y1="11" x2="42" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF9445" />
          <stop offset="1" stopColor="#FF5A0A" />
        </linearGradient>
      </defs>
      <path d="M17 3.5L24 10.5L31 3.5" stroke="#FFC23D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4.5" y="10.5" width="39" height="31" rx="8" fill="url(#rr-screen)" />
      <g
        className={animate ? "animate-[rewind-in_.7s_ease-out_1]" : undefined}
        fill="#1E0900"
        stroke="#1E0900"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M23.5 18.5V33.5L12.5 26Z" />
        <path d="M35.5 18.5V33.5L24.5 26Z" />
      </g>
    </svg>
  );
}

/** Kept for existing call sites (footer, 404). */
export function Pulse({ className = "" }: { className?: string }) {
  return <Mark className={className} />;
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <Mark className="h-9 w-9" animate />
      <span className="font-display text-[24px] leading-none tracking-[0.08em] text-bone">RERUN</span>
    </span>
  );
}
