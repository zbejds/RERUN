"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePoll } from "@/lib/client";
import { changeClass, fmtAge, fmtNum, fmtPct, fmtPrice, fmtUsd } from "@/lib/format";
import type { Category, RegistryToken, TokenListItem } from "@/lib/types";
import { Sparkline } from "./Sparkline";
import { TokenLogo } from "./TokenLogo";
import { ComingSoon } from "./Social";
import { VoteButton } from "./VoteButton";

type SortKey = "legend" | "votes" | "volume" | "liquidity" | "activity" | "oldest";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "legend", label: "Historical relevance" },
  { id: "votes", label: "Community votes" },
  { id: "volume", label: "24h volume" },
  { id: "liquidity", label: "Liquidity" },
  { id: "activity", label: "Recent activity (24h trades)" },
  { id: "oldest", label: "Oldest pool first" },
];

const PLATFORMS = [
  { id: "all", label: "Any launch" },
  { id: "pump", label: "pump.fun" },
  { id: "raydium", label: "Raydium" },
  { id: "other", label: "Other / unverified" },
];

export function DiscoverView({
  categories,
  archived,
  otherChains,
}: {
  categories: Category[];
  archived: RegistryToken[];
  otherChains: { symbol: string; name: string; chain: string; blurb: string }[];
}) {
  const { data, error, reload } = usePoll<{ items: TokenListItem[]; votingOnline: boolean }>("/api/tokens?window=all", 60_000);
  const [cat, setCat] = useState<string>("all");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState<SortKey>("legend");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    if (!data) return [];
    const query = q.trim().toLowerCase();
    const metric = (i: TokenListItem): number => {
      const m = i.market;
      switch (sort) {
        case "votes": return i.votes?.votes ?? -1;
        case "volume": return m?.volume24h ?? -1;
        case "liquidity": return m?.liquidityUsd ?? -1;
        case "activity": return m?.txns24h ? m.txns24h.buys + m.txns24h.sells : -1;
        case "oldest": return m?.firstPoolAt ? -m.firstPoolAt : -Infinity;
        default: return -i.token.legendRank;
      }
    };
    return data.items
      .filter((i) => cat === "all" || i.token.categories.includes(cat))
      .filter((i) => {
        const p = (i.token.launchPlatform ?? "").toLowerCase();
        if (platform === "pump") return p.includes("pump.fun");
        if (platform === "raydium") return p.includes("raydium");
        if (platform === "other") return !p.includes("pump.fun") && !p.includes("raydium");
        return true;
      })
      .filter((i) =>
        !query ||
        i.token.symbol.toLowerCase().includes(query) ||
        i.token.name.toLowerCase().includes(query) ||
        i.token.mint.toLowerCase() === query,
      )
      .sort((a, b) => metric(b) - metric(a));
  }, [data, cat, platform, sort, q]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          <button className={`chip ${cat === "all" ? "chip-on" : ""}`} onClick={() => setCat("all")} aria-pressed={cat === "all"}>
            All tapes
          </button>
          {categories.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? "chip-on" : ""}`} onClick={() => setCat(c.id)} aria-pressed={cat === c.id}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <label className="sr-only" htmlFor="discover-search">Search</label>
          <input
            id="discover-search"
            className="input"
            placeholder="Search by name, ticker or full mint address"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="sr-only" htmlFor="discover-platform">Launch platform</label>
          <select id="discover-platform" className="input sm:w-44" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="discover-sort">Sort</label>
          <select id="discover-sort" className="input sm:w-60" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === "votes" && data?.votingOnline === false}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && !data && (
        <p className="mt-6 text-sm text-down">
          Couldn&apos;t load the archive: {error} <button className="underline" onClick={() => void reload()}>Retry</button>
        </p>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {!data && !error && Array.from({ length: 6 }).map((_, i) => <li key={i} className="panel h-[300px] animate-pulse" />)}
        {items.map((i) => <Card key={i.token.mint} item={i} onVoted={() => void reload()} />)}
        {data && <ComingSoon variant="card" />}
      </ul>
      {data && items.length === 0 && (
        <p className="panel mt-6 p-6 text-sm text-bone-dim">
          No listed token matches. RERUN only lists tokens by verified mint, so unknown or look-alike tickers won&apos;t show up here.
        </p>
      )}

      <section className="mt-14" aria-labelledby="vault-title">
        <p className="label text-pulse">Off air</p>
        <h2 id="vault-title" className="mt-1 font-display text-3xl uppercase tracking-[0.01em]">The vault</h2>
        <p className="mt-1 max-w-2xl text-sm text-bone-dim">
          Part of meme history, but not in the RERUN market. Each one says why.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {archived.map((t) => (
            <li key={t.mint} className="rounded-md border border-dashed border-line-strong bg-ink-2/60 p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl uppercase tracking-[0.02em]">{t.symbol}</span>
                <span className="chip">{t.status === "migrated" ? "Migrated" : "Not listed"}</span>
              </div>
              <p className="mt-2 text-sm text-bone-dim">{t.blurb}</p>
              <p className="mt-2 text-xs leading-relaxed text-warn">{t.notListedReason}</p>
              <p className="num mt-2 break-all text-[11px] text-muted">Old mint: {t.mint}</p>
            </li>
          ))}
          {otherChains.map((t) => (
            <li key={t.symbol} className="rounded-md border border-dashed border-line-strong bg-ink-2/60 p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl uppercase tracking-[0.02em]">{t.symbol}</span>
                <span className="chip">{t.chain}</span>
              </div>
              <p className="mt-2 text-sm text-bone-dim">{t.name}. {t.blurb}</p>
              <p className="mt-2 text-xs text-muted">Not a Solana token, so it can&apos;t be voted on or traded on RERUN.</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** A tape reel; it spins while the cassette is hovered. */
function Reel() {
  return (
    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-[#3A3D47] bg-[#0b0b0d] group-hover:animate-[spin_2.4s_linear_infinite]" aria-hidden="true">
      <span className="absolute h-[2px] w-full bg-[#3A3D47]" />
      <span className="absolute h-full w-[2px] bg-[#3A3D47]" />
      <span className="relative h-3 w-3 rounded-full border-2 border-[#3A3D47] bg-[#0b0b0d]" />
    </span>
  );
}

function Card({ item, onVoted }: { item: TokenListItem; onVoted: () => void }) {
  const { token, market, votes } = item;
  const href = `/token/${token.mint}`;
  return (
    <li className="group flex flex-col rounded-md border border-line-strong bg-gradient-to-b from-[#17181D] to-[#111215] p-3 shadow-[0_24px_50px_-30px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 hover:border-pulse/60">
      {/* cassette label */}
      <Link href={href} className="relative block overflow-hidden rounded-[4px] bg-bone px-3 pb-2.5 pt-3.5 text-[#14110c]">
        <span className="absolute inset-x-0 top-0 h-1.5 bg-pulse" aria-hidden="true" />
        <span className="flex items-center gap-3">
          <TokenLogo src={market?.imageUrl} symbol={token.symbol} size={38} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[28px] uppercase leading-none tracking-[0.02em]">{token.symbol}</span>
            <span className="mt-0.5 block truncate font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#14110c]/65">{token.era}</span>
          </span>
          <span className="self-start font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#14110c]/60">SP · T-120</span>
        </span>
      </Link>
      {/* reel window with the 48h signal */}
      <div className="mt-3 flex items-center gap-3 rounded-[6px] border border-line bg-black/60 px-3 py-2">
        <Reel />
        <span className="flex min-w-0 flex-1 justify-center">
          <Sparkline mint={token.mint} width={120} height={32} />
        </span>
        <Reel />
      </div>
      <p className="mt-3 line-clamp-2 min-h-[2.6em] text-sm leading-snug text-bone-dim">{token.blurb}</p>
      <dl className="mt-3 grid grid-cols-4 gap-x-3 gap-y-0.5 border-t border-line/70 pt-3 text-xs">
        <dt className="label text-[10px]">Price</dt>
        <dt className="label text-[10px]">24h</dt>
        <dt className="label text-[10px]">Liq.</dt>
        <dt className="label text-[10px]">Votes</dt>
        <dd className="num truncate">{fmtPrice(market?.priceUsd)}</dd>
        <dd className={`num ${changeClass(market?.change.h24)}`}>{fmtPct(market?.change.h24)}</dd>
        <dd className="num">{fmtUsd(market?.liquidityUsd)}</dd>
        <dd className="num">{votes ? fmtNum(votes.votes, 0) : "—"}</dd>
      </dl>
      <div className="mt-3 flex items-start justify-between gap-2">
        <Link href={href} className="btn-ghost px-3 py-1.5 text-xs">
          Play tape <span className="num normal-case tracking-normal text-muted" title="Time since the first trading pool we can see">· {fmtAge(market?.firstPoolAt)}</span>
        </Link>
        <VoteButton mint={token.mint} symbol={token.symbol} onVoted={onVoted} />
      </div>
    </li>
  );
}
