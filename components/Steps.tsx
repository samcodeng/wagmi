const steps = [
  {
    number: "01",
    title: "Select numbers",
    description: "Search or pick available tickets.",
    icon: "ticket",
  },
  {
    number: "02",
    title: "Confirm selection",
    description: "Review your tickets and total.",
    icon: "check",
  },
  {
    number: "03",
    title: "Complete purchase",
    description: "Connect your wallet and enter the draw.",
    icon: "wallet",
  },
];

function StepIcon({ icon }: { icon: string }) {
  if (icon === "ticket") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 fill-none stroke-current stroke-2"
      >
        <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V9a2 2 0 0 0 0 4v1.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 14.5V13a2 2 0 0 0 0-4V7.5Z" />
        <path d="M9 8v1M9 15v1M9 11.5v1" />
      </svg>
    );
  }

  if (icon === "check") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 fill-none stroke-current stroke-2"
      >
        <path d="m5 12 4 4L19 6" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-none stroke-current stroke-2"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h3M16 13h.01M8 16h5M16 16h.01" />
    </svg>
  );
}

function Steps() {
  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-[0_0_30px_rgba(12,23,45,0.5)] backdrop-blur-sm sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-300">
            How it works
          </p>
          <h2 className="mt-1 text-lg font-black text-white sm:text-xl">
            Three steps to your chance
          </h2>
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:block">
          Simple · transparent · onchain
        </span>
      </div>

      <ol className="grid gap-3 md:grid-cols-3 md:gap-0">
        {steps.map((step, index) => (
          <li
            key={step.number}
            className="relative flex gap-3 md:px-4 first:md:pl-0 last:md:pr-0"
          >
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/30 bg-teal-300/10 text-teal-200">
              <StepIcon icon={step.icon} />
            </span>
            <div className="relative z-10 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black tabular-nums text-teal-300/60">
                  {step.number}
                </span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
              </div>
              <p className="mt-1 max-w-[18rem] text-xs leading-5 text-slate-400">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Steps;
