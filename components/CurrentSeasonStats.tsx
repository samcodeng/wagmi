"use client";

import { prizeStructure, type SeasonInfo } from "@/lib/season-data";

type CurrentSeasonStatsProps = {
  season: SeasonInfo;
};

export default function CurrentSeasonStats({
  season,
}: CurrentSeasonStatsProps) {
  const remainingTickets = Math.max(
    season.ticketSupply - season.ticketsSold,
    0,
  );
  const grandPrize = prizeStructure[0]?.amountUsdc ?? 0;

  return (
    <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-900/85 shadow-[0_0_30px_rgba(12,23,45,0.7)] backdrop-blur-sm">
      <div className="border-b border-white/10 bg-[linear-gradient(110deg,rgba(20,184,166,0.15),rgba(8,47,73,0.1)_45%,rgba(15,23,42,0.2))] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Current season
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {season.name}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Every number is a chance. The season ends when all tickets are
              sold.
            </p>
          </div>
          <span className="w-fit rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
            {season.status}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 shadow-[0_0_24px_rgba(251,191,36,0.1)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/80">
            Grand prize
          </p>
          <p className="text-2xl font-black tabular-nums text-amber-300 sm:text-3xl">
            {grandPrize.toLocaleString()} USDC
          </p>
        </div>
      </div>
    </section>
  );
}
