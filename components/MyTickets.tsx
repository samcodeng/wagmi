type MyTicketsProps = {
  address?: string;
  seasonNumber: number;
  tickets: number[];
};

export default function MyTickets({
  address,
  seasonNumber,
  tickets,
}: MyTicketsProps) {
  return (
    <section
      className="mx-auto max-w-4xl rounded-[28px] border border-teal-300/20 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(12,23,45,0.75)] backdrop-blur-sm sm:p-8"
      id="my-tickets"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
            My tickets
          </p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Your lucky numbers
          </h2>
        </div>
        {address && (
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {tickets.map((number, index) => (
          <div
            key={number}
            className="relative overflow-hidden rounded-2xl border border-teal-400/25 bg-teal-400/10 p-4"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/70">
              Ticket {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-3xl font-black text-teal-200">#{number}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
              Season {seasonNumber} · Active
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
