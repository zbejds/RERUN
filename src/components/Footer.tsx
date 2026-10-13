import Link from "next/link";
import { X_HANDLE, X_URL } from "@/lib/site";
import { Mark } from "./Logo";
import { RerunPill, XIcon } from "./Social";

export function Footer() {
  return (
    <footer className="relative mt-10">
      <div className="bars h-1 w-full opacity-80" aria-hidden="true" />
      <div className="border-t border-line bg-ink-2/80">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-8 text-xs text-muted sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mark className="h-8 w-8" />
              <div>
                <p className="font-display text-xl leading-none tracking-[0.08em] text-bone">RERUN</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em]">Every legend deserves a rerun.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RerunPill compact />
              {X_URL && (
                <a
                  href={X_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-line-strong px-3 py-1.5 font-mono text-[11px] text-bone-dim transition hover:border-bone/40 hover:text-bone"
                >
                  <XIcon className="h-3.5 w-3.5" /> {X_HANDLE}
                </a>
              )}
            </div>
          </div>
          <p className="max-w-3xl leading-relaxed">
            Market data from DexScreener and GeckoTerminal. Swaps routed by Jupiter. Memecoins are extremely volatile and can go to zero; nothing here is financial advice.{" "}
            <Link href="/rules" className="underline underline-offset-2 hover:text-bone">Rules, fees & data sources</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
