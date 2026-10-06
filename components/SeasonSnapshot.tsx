import type { SeasonInfo } from "@/lib/season-data";

type SeasonSnapshotProps = {
  season: SeasonInfo;
};

export default function SeasonSnapshot({ season }: SeasonSnapshotProps) {
  const remainingTickets = Math.max(
    season.ticketSupply - season.ticketsSold,
    0,
  );
  const stats = [
    ["Season number", `#${season.seasonNumber}`],
    ["Ticket supply", season.ticketSupply.toLocaleString()],
    ["Ticket price", `${season.ticketPriceUsdc.toFixed(2)} USDC`],
    ["Tickets sold", season.ticketsSold.toLocaleString()],
    ["Remaining tickets", remainingTickets.toLocaleString()],
  ];

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Season snapshot
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-cyan-300/30 hover:bg-white/[0.06]"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-base font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
