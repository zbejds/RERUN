"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { XButton } from "./Social";
import { WalletButton } from "./WalletButton";

const NAV = [
  { href: "/", label: "Lineup", ch: "01" },
  { href: "/discover", label: "Tape library", ch: "02" },
  { href: "/rules", label: "Rules & fees", ch: "03" },
];

/** Broadcast clock, rendered only after mount so server and client markup match. */
function OnAirClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="num tabular-nums text-bone-dim">{now ?? "--:--:--"}</span>;
}

export function Header() {
  const path = usePathname();
  const isOn = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="sticky top-0 z-40 bg-ink/85 backdrop-blur-md" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* On-air strip */}
      <div className="border-b border-line">
        <div className="mx-auto flex h-7 max-w-[1440px] items-center gap-4 px-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted sm:px-6">
          <span className="flex items-center gap-1.5 text-down">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-down" aria-hidden="true" /> On air
          </span>
          <span className="hidden sm:inline">Late-night reruns of Solana&apos;s legendary memecoins</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="hidden md:inline">Free votes · Live charts · Phantom</span>
            <OnAirClock />
          </span>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-5 px-4 sm:px-6">
          <Link href="/" className="shrink-0" aria-label="RERUN home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.06em] transition ${
                  isOn(n.href) ? "bg-panel-2 text-bone" : "text-bone-dim hover:text-bone"
                }`}
              >
                <span className={`ch h-5 w-7 text-[10px] ${isOn(n.href) ? "border-pulse text-pulse" : ""}`}>{n.ch}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <XButton />
            <WalletButton />
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-2 md:hidden" aria-label="Main mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`chip shrink-0 ${isOn(n.href) ? "chip-on" : ""}`}>
              <span className="text-[10px] opacity-70">CH {n.ch}</span> {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
