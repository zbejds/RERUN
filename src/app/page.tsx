import Link from "next/link";
import { HeroTV } from "@/components/HeroTV";
import { Leaderboard } from "@/components/Leaderboard";
import { RerunPill, XIcon } from "@/components/Social";
import { listedTokens } from "@/lib/registry";
import { X_URL } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="relative mt-8 grid items-center gap-12 lg:mt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div>
          <p className="chip w-fit">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-down" aria-hidden="true" /> Now showing · Solana classics
          </p>
          <h1 className="rgb-split mt-6 font-display text-[58px] uppercase leading-[0.92] tracking-[0.005em] sm:text-[88px] xl:text-[104px]">
            Legends
            <br />
            don&apos;t die.
            <br />
            <span className="grad-text [text-shadow:none]">They rerun.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-bone-dim">
            Tune in to Solana&apos;s greatest memecoins, one more time. Vote for the legends you want back on air, watch
            live charts and trade them with Phantom whenever a real route exists.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#lineup" className="btn-pulse px-6 py-3">
              ▶ Watch the lineup
            </Link>
            <Link href="/discover" className="btn-ghost px-6 py-3">
              Tape library
            </Link>
            {X_URL && (
              <a href={X_URL} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-3" aria-label="Follow RERUN on X">
                <XIcon /> Follow
              </a>
            )}
          </div>
          <div className="mt-6">
            <RerunPill />
          </div>
        </div>

        <HeroTV channels={listedTokens.length} />
      </section>

      <dl className="mt-12 grid grid-cols-2 overflow-hidden rounded-md border border-line sm:grid-cols-4">
        {[
          ["Channels", String(listedTokens.length), "text-bone"],
          ["Network", "Solana", "text-bone"],
          ["Vote cost", "Free", "text-up"],
          ["Ranking", "Votes only", "text-ember"],
        ].map(([k, v, c], i) => (
          <div key={k} className={`bg-ink-2/80 px-5 py-4 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line sm:border-t-0 sm:border-l" : ""}`}>
            <dt className="label text-[10px]">{k}</dt>
            <dd className={`mt-1 font-display text-2xl uppercase tracking-[0.02em] ${c}`}>{v}</dd>
          </div>
        ))}
      </dl>

      <Leaderboard />
    </>
  );
}
