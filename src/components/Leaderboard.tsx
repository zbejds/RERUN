"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePoll } from "@/lib/client";
import { changeClass, fmtPct, fmtPrice, fmtUsd } from "@/lib/format";
import type { TokenListItem, VoteWindow } from "@/lib/types";
import { Sparkline } from "./Sparkline";
import { TokenLogo } from "./TokenLogo";
import { ComingSoon } from "./Social";
import { VoteButton } from "./VoteButton";

interface ListResponse {
  window: VoteWindow;
  votingOnline: boolean;
  items: TokenListItem[];
  generatedAt: number;
}

const WINDOWS: { id: VoteWindow; label: string }[] = [
  { id: "24h", label: "24 hours" },
  { id: "7d", label: "7 days" },
  { id: "all", label: "All time" },
];

export function Leaderboard() {
  const [window, setWindow] = useState<VoteWindow>("24h");
  const { data, error, loading, reload } = usePoll<ListResponse>(`/api/tokens?window=${window}`, 30_000);

  const rows = useMemo(() => {
    if (!data) return [];
    return [...data.items].sort((a, b) => {
      if (data.votingOnline) {
        const ra = a.votes?.rank ?? Infinity, rb = b.votes?.rank ?? Infinity;
        if (ra !== rb) return ra - rb;
      }
      return a.token.legendRank - b.token.legendRank;
    });
  }, [data]);

  const totalVotes = data?.votingOnline ? data.items.reduce((s, i) => s + (i.votes?.votes ?? 0), 0) : null;
  const podium = data?.votingOnline ? rows.filter((r) => (r.votes?.votes ?? 0) > 0).slice(0, 3) : [];

  return (
    <section id="lineup" aria-labelledby="lb-title" className="mt-14 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="label text-pulse">TV guide · ranked by votes</p>
          <h2 id="lb-title" className="mt-1 font-display text-4xl uppercase leading-none tracking-[0.01em] sm:text-5xl">
            Tonight&apos;s lineup
          </h2>
          <p className="mt-2 max-w-xl text-sm text-bone-dim">
            The crowd picks what airs next. Price doesn&apos;t move a coin up this guide; votes do.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalVotes != null && (
            <span className="label">
              <span className="num text-bone">{totalVotes.toLocaleString()}</span> votes · {WINDOWS.find((w) => w.id === window)?.label}
            </span>
          )}
          <div role="tablist" aria-label="Vote window" className="flex rounded-md border border-line-strong bg-ink-2 p-0.5">
            {WINDOWS.map((w) => (
              <button
                key={w.id}
                role="tab"
                aria-selected={window === w.id}
                onClick={() => setWindow(w.id)}
                className={`rounded-[4px] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition ${window === w.id ? "bg-pulse text-pulse-ink" : "text-muted hover:text-bone"}`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {data && !data.votingOnline && (
        <p className="mt-4 rounded-lg border border-warn/25 bg-warn/[0.06] px-3 py-2 text-xs text-warn">
          Voting is offline on this deployment, so tokens are shown in archive order instead of by votes.
        </p>
      )}

      {podium.length > 0 && (
        <ol className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Prime time">
          {podium.map((r) => (
            <li key={r.token.mint}>
              <Link
                href={`/token/${r.token.mint}`}
                className="group relative block overflow-hidden rounded-md border border-line-strong bg-panel p-4 transition hover:-translate-y-0.5 hover:border-pulse/70"
              >
                <span className="bars absolute inset-x-0 top-0 h-1" aria-hidden="true" />
                <span className="flex items-center justify-between">
                  <span className="label text-pulse">Prime time · #{r.votes?.rank}</span>
                  <span className={`num text-xs ${changeClass(r.market?.change.h24)}`}>{fmtPct(r.market?.change.h24)}</span>
                </span>
                <span className="mt-3 flex items-center gap-3">
                  <TokenLogo src={r.market?.imageUrl} symbol={r.token.symbol} size={48} />
                  <span className="min-w-0">
                    <span className="block truncate font-display text-3xl uppercase leading-none tracking-[0.02em]">{r.token.symbol}</span>
                    <span className="num mt-1 block text-xs text-bone-dim">{r.votes?.votes.toLocaleString()} votes</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="panel mt-6 overflow-hidden">
        <div className="hidden grid-cols-[64px_minmax(180px,1.6fr)_1fr_.8fr_1fr_1fr_.7fr_130px_190px] items-center gap-3 border-b border-line bg-ink-2 px-4 py-2.5 lg:grid">
          {["CH", "Show", "Price", "24h", "Market cap", "Liquidity", "Votes", "48h", ""].map((h, i) => (
            <span key={i} className={`label ${i >= 2 && i <= 6 ? "text-right" : ""}`}>{h}</span>
          ))}
        </div>

        {loading && !data && <SkeletonRows />}
        {error && !data && (
          <div className="p-6 text-sm text-down">
            Couldn&apos;t load the leaderboard: {error}{" "}
            <button className="underline" onClick={() => void reload()}>Retry</button>
          </div>
        )}

        <ul>
          {rows.map((r) => (
            <Row key={r.token.mint} item={r} votingOnline={!!data?.votingOnline} onVoted={() => void reload()} />
          ))}
        </ul>
      </div>
      <ComingSoon />
      {data && (
        <p className="label mt-2 text-right normal-case tracking-normal">
          Market data via DexScreener · signal refreshes every 30s
        </p>
      )}
    </section>
  );
}

function Row({ item, votingOnline, onVoted }: { item: TokenListItem; votingOnline: boolean; onVoted: () => void }) {
  const { token, market, votes } = item;
  const href = `/token/${token.mint}`;
  return (
    <li className="border-b border-line/60 last:border-0">
      <div className="group grid grid-cols-[48px_1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 transition hover:bg-panel-2/70 lg:grid-cols-[64px_minmax(180px,1.6fr)_1fr_.8fr_1fr_1fr_.7fr_130px_190px] lg:gap-3">
        <span
          className={`ch h-9 w-11 text-[13px] transition group-hover:border-pulse/70 ${votingOnline && votes?.rank && votes.rank <= 3 ? "border-pulse text-pulse" : ""}`}
          title={votingOnline && votes?.rank ? `Rank ${votes.rank}` : "Not ranked yet"}
        >
          {votingOnline && votes?.rank ? String(votes.rank).padStart(2, "0") : "--"}
        </span>

        <Link href={href} className="flex min-w-0 items-center gap-3">
          <TokenLogo src={market?.imageUrl} symbol={token.symbol} />
          <span className="min-w-0">
            <span className="block truncate font-display text-[20px] uppercase leading-none tracking-[0.02em]">{token.symbol}</span>
            <span className="mt-0.5 block truncate font-mono text-[11px] text-muted">{token.name} · {token.era.split(" · ")[0]}</span>
          </span>
        </Link>

        {/* mobile summary */}
        <span className="text-right lg:hidden">
          <span className="num block text-sm">{fmtPrice(market?.priceUsd)}</span>
          <span className={`num block text-xs ${changeClass(market?.change.h24)}`}>{fmtPct(market?.change.h24)}</span>
        </span>

        <span className="num hidden text-right text-sm lg:block">{market ? fmtPrice(market.priceUsd) : <NoData />}</span>
        <span className={`num hidden text-right text-sm lg:block ${changeClass(market?.change.h24)}`}>{fmtPct(market?.change.h24)}</span>
        <span className="num hidden text-right text-sm text-bone-dim lg:block" title={market?.marketCap == null && market?.fdv != null ? "Market cap unavailable; showing FDV" : undefined}>
          {market?.marketCap != null ? fmtUsd(market.marketCap) : market?.fdv != null ? <>{fmtUsd(market.fdv)} <span className="text-[10px] text-muted">FDV</span></> : "—"}
        </span>
        <span className="num hidden text-right text-sm text-bone-dim lg:block">{fmtUsd(market?.liquidityUsd)}</span>
        <span className="num hidden text-right text-sm font-bold lg:block">{votes ? votes.votes.toLocaleString() : "—"}</span>
        <span className="hidden lg:block">
          <Sparkline mint={token.mint} />
        </span>

        <div className="col-span-3 flex items-center justify-between gap-2 lg:col-span-1 lg:justify-end">
          <span className="num text-xs text-bone-dim lg:hidden">
            {votes ? `${votes.votes.toLocaleString()} votes` : ""} {market?.liquidityUsd != null ? `· liq ${fmtUsd(market.liquidityUsd)}` : ""}
          </span>
          <div className="flex items-start gap-2">
            <Link href={`${href}#trade`} className="btn-ghost px-3 py-1.5 text-xs">
              Trade
            </Link>
            <VoteButton mint={token.mint} symbol={token.symbol} onVoted={onVoted} />
          </div>
        </div>
      </div>
    </li>
  );
}

function NoData() {
  return <span className="text-xs text-muted">No market</span>;
}

function SkeletonRows() {
  return (
    <ul aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 border-b border-line/60 px-4 py-4">
          <span className="h-9 w-11 animate-pulse rounded bg-panel-2" />
          <span className="h-9 w-9 animate-pulse rounded-md bg-panel-2" />
          <span className="h-4 w-40 animate-pulse rounded bg-panel-2" />
          <span className="ml-auto h-4 w-24 animate-pulse rounded bg-panel-2" />
        </li>
      ))}
    </ul>
  );
}
