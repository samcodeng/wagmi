import { prizeStructure } from "@/lib/season-data";

export default function PrizeStructure() {
  return (
    <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            This Season Prize structure
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
            907 winners · 34,592 USDC prize pool
          </p>
        </div>
        <span className="text-sm font-semibold text-teal-300">34,592 USDC</span>
      </div>
      <div className="grid gap-2">
        {prizeStructure.map((tier) => (
          <div
            key={tier.place}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/50"
          >
            <div>
              <span className="font-mono text-teal-400 font-semibold mr-3">
                {tier.place}
              </span>
              <span className="text-slate-300 text-sm">{tier.description}</span>
            </div>
            <span className="font-mono font-semibold text-white">
              {tier.amountUsdc.toLocaleString()} USDC
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
