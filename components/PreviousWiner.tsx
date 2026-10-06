import React from "react";

function PreviousWiner() {
  return (
    <section className="relative mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-amber-300/25 bg-[linear-gradient(135deg,rgba(30,24,12,0.96),rgba(14,23,35,0.96))] p-6 shadow-[0_0_40px_rgba(251,191,36,0.12)] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border border-amber-300/10 bg-amber-300/5" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full border border-teal-300/10 bg-teal-300/5" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
            Previous season winner
          </p>
          <h2 className="mt-2 text-3xl font-black leading-none text-white sm:text-4xl">
            Someone picked lucky.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Season 2 grand prize went to a single perfect pick. The winning
            ticket is still on the wall.
          </p>
        </div>

        <div className="relative shrink-0 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-6 py-5 text-center shadow-[0_0_30px_rgba(251,191,36,0.12)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">
            Winning ticket
          </p>
          <p className="mt-2 text-5xl font-black leading-none text-amber-300">
            #0420
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-300">
            12,500 USDC
          </p>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.16em] text-slate-400">
        <span>Winner: 0x7A...91F</span>
        <span className="text-teal-300">Prize claimed</span>
        <span>Season 2 · Autumn Draw</span>
        <a
          href="https://sepolia.etherscan.io"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-[10px] font-semibold tracking-[0.14em] text-amber-200 transition-colors hover:bg-amber-300/20"
        >
          Verify onchain
        </a>
      </div>
    </section>
  );
}

export default PreviousWiner;
