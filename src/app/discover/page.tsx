import type { Metadata } from "next";
import { DiscoverView } from "@/components/DiscoverView";
import { archivedTokens, categories, listedTokens, otherChainTokens } from "@/lib/registry";

export const metadata: Metadata = { title: "Tape library: Solana legends" };

// Tape spine colors cycle through the brand palette.
const SPINES = ["#FF6A1A", "#FFC23D", "#F1EBDD", "#4D6BFF", "#3DDC97", "#FF5470"];

export default function DiscoverPage() {
  return (
    <div className="mt-8">
      <div className="grid items-end gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="chip w-fit">CH 02 · Tape library</p>
          <h1 className="rgb-split mt-4 font-display text-[52px] uppercase leading-[0.95] tracking-[0.005em] sm:text-[80px]">
            Every classic,
            <br />
            <span className="grad-text [text-shadow:none]">on tape.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone-dim">
            A shelf of Solana meme history, from the first dog coins of 2021 to the pump.fun era. Browse by era, launch
            platform or meme family. Every price, chart and age comes straight from on-chain market data.
          </p>
        </div>
        {/* the shelf: one spine per listed tape */}
        <div className="flex h-44 items-end gap-[3px] overflow-hidden rounded-md border border-line bg-ink-2 px-3 pt-3" aria-hidden="true">
          {listedTokens.slice(0, 18).map((t, i) => (
            <span
              key={t.mint}
              className="flex w-[22px] shrink-0 items-start justify-center rounded-t-[3px] pt-2 font-display text-[12px] uppercase tracking-[0.06em] text-[#14110c] [writing-mode:vertical-rl]"
              style={{ background: SPINES[i % SPINES.length], height: `${78 + ((i * 37) % 22)}%` }}
            >
              {t.symbol}
            </span>
          ))}
        </div>
      </div>
      <DiscoverView categories={categories} archived={archivedTokens} otherChains={otherChainTokens} />
    </div>
  );
}
