"use client";

import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useXrpl } from "@/context/XrplProvider";
import { useState, useSyncExternalStore } from "react";
import NumbersRain from "@/components/NumbersRain";
import PrizeStructure from "@/components/PrizeStructure";
import { currentSeason } from "@/lib/season-data";
import PreviousWiner from "@/components/PreviousWiner";
import MyTickets from "@/components/MyTickets";
import CurrentSeasonStats from "@/components/CurrentSeasonStats";
import SeasonSnapshot from "@/components/SeasonSnapshot";
import Steps from "@/components/Steps";

const soldNumbers = new Set([12, 34, 68, 88, 142, 200, 311, 420, 499]);
const defaultQuickPickNumbers = [7, 21, 37, 42, 140, 237, 398, 500];
const myTickets = [137, 243, 716, 824, 936];
let clientQuickPickNumbers: number[] | undefined;

const getRandomQuickPickNumbers = (ticketSupply: number) => {
  const availableNumbers = Array.from(
    { length: ticketSupply },
    (_, index) => index + 1,
  ).filter((number) => !soldNumbers.has(number));

  for (let index = availableNumbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [availableNumbers[index], availableNumbers[randomIndex]] = [
      availableNumbers[randomIndex],
      availableNumbers[index],
    ];
  }

  return availableNumbers.slice(0, 12);
};

const subscribeToQuickPicks = () => () => {};

const getClientQuickPickNumbers = () => {
  clientQuickPickNumbers ??= getRandomQuickPickNumbers(
    currentSeason.ticketSupply,
  );
  return clientQuickPickNumbers;
};

const getServerQuickPickNumbers = () => defaultQuickPickNumbers;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { address: xrplAddress, isConnected: xrplConnected } = useXrpl();
  const { open } = useAppKit();
  const walletConnected = isConnected || xrplConnected;
  const activeAddress = address ?? xrplAddress;
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const quickPickNumbers = useSyncExternalStore(
    subscribeToQuickPicks,
    getClientQuickPickNumbers,
    getServerQuickPickNumbers,
  );
  const [searchNumber, setSearchNumber] = useState("");
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "sold" | "out-of-range" | "invalid" | "available"
  >("idle");
  const maxTicketNumber = currentSeason.ticketSupply;
  const totalPrice = selectedNumbers.length * currentSeason.ticketPriceUsdc;

  const searchResults = (() => {
    const parsed = Number(searchNumber.trim());

    if (!searchNumber.trim() || !Number.isInteger(parsed)) {
      return [];
    }

    const start = Math.min(
      Math.max(parsed - 4, 1),
      Math.max(maxTicketNumber - 7, 1),
    );

    return Array.from({ length: 8 }, (_, index) => start + index).filter(
      (number) => number <= maxTicketNumber,
    );
  })();

  const handleSelectTicket = (nextNumber: number) => {
    if (soldNumbers.has(nextNumber)) return;

    setSelectedNumbers((current) => {
      if (current.includes(nextNumber)) {
        return current.filter((number) => number !== nextNumber);
      }

      return [...current, nextNumber];
    });
  };

  const handleSearchSubmit = () => {
    const trimmed = searchNumber.trim();
    const parsed = Number(trimmed);

    if (!trimmed || !Number.isInteger(parsed)) {
      setSearchStatus("invalid");
      return;
    }

    if (parsed < 1 || parsed > maxTicketNumber) {
      setSearchStatus("out-of-range");
      return;
    }

    if (soldNumbers.has(parsed)) {
      setSearchStatus("sold");
      return;
    }

    handleSelectTicket(parsed);
    setSearchStatus("available");
    setSearchNumber("");
  };

  const handleRandomPick = () => {
    const availableNumbers = Array.from(
      { length: maxTicketNumber },
      (_, index) => index + 1,
    ).filter((number) => !soldNumbers.has(number));

    const randomNumber =
      availableNumbers[Math.floor(Math.random() * availableNumbers.length)] ??
      1;

    setSelectedNumbers((current) => {
      if (current.includes(randomNumber)) {
        return current;
      }

      return [...current, randomNumber];
    });
  };

  const handleBuyTicket = () => {
    if (!walletConnected) {
      open();
      return;
    }

    console.log("Buying tickets:", selectedNumbers);
  };

  return (
    <div className="relative min-h-screen bg-[#050816] text-white">
      <div className="opacity-25">
        <NumbersRain />
      </div>

      <main className="relative z-10 w-full space-y-8 px-6 pb-16 pt-8 sm:px-8 lg:px-10">
        <div className="mb-4">
          <h2 className="text-center lg:text-5xl text-3xl font-black text-white leading-none tracking-[-0.04em]">
            Pick your number.
            <br /> Own your chance.
          </h2>
        </div>

        <CurrentSeasonStats season={currentSeason} />
        <Steps />

        <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(12,23,45,0.9)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300/80">
                Ticket selector
              </p>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                {selectedNumbers.length ? selectedNumbers.length : "No"} tickets
                selected
              </h3>
            </div>

            <div className="rounded-2xl border border-teal-400/30 bg-teal-400/10 px-4 py-3 text-left md:text-right">
              <div className="text-xs uppercase tracking-[0.2em] text-teal-200/80">
                Total
              </div>
              <div className="mt-1 text-xl font-bold text-teal-300">
                {totalPrice.toFixed(2)} USDC
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>Find</span>
              <span>Choose your ticket(s)</span>
              <span>{maxTicketNumber}</span>
            </div>

            <div className="flex gap-3">
              <input
                type="number"
                min={1}
                max={maxTicketNumber}
                value={searchNumber}
                onChange={(event) => {
                  setSearchNumber(event.target.value);
                  if (searchStatus !== "idle") {
                    setSearchStatus("idle");
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search ticket number"
                className="w-full rounded-full border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="rounded-full bg-teal-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-300"
              >
                Add
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                {searchResults.map((number) => {
                  const isSold = soldNumbers.has(number);
                  const isSelected = selectedNumbers.includes(number);

                  return (
                    <button
                      key={number}
                      type="button"
                      disabled={isSold}
                      onClick={() => handleSelectTicket(number)}
                      className={[
                        "rounded-xl border px-3 py-2 text-left transition-colors",
                        isSold
                          ? "cursor-not-allowed border-red-500/40 bg-red-500/10 text-red-200 opacity-70"
                          : isSelected
                            ? "border-teal-400 bg-teal-400/20 text-teal-200"
                            : "border-slate-700 bg-slate-800/70 text-slate-200 hover:border-teal-400/60 hover:bg-slate-800",
                      ].join(" ")}
                    >
                      <span className="block text-sm font-semibold">
                        #{number}
                      </span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.12em]">
                        {isSold
                          ? "SOLD"
                          : isSelected
                            ? "Selected"
                            : "Available"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {searchStatus !== "idle" && (
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-red-300">
                {searchStatus === "sold" &&
                  "Ticket not available — already sold"}
                {searchStatus === "out-of-range" &&
                  "Ticket number is out of range"}
                {searchStatus === "invalid" && "Enter a valid ticket number"}
                {searchStatus === "available" && "Ticket available and added"}
              </p>
            )}
          </div>

          {selectedNumbers.length > 0 && (
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Selected tickets
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedNumbers([])}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-red-300 transition-colors hover:text-red-200"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedNumbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => handleSelectTicket(number)}
                    className="rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1.5 text-sm font-semibold text-teal-200 transition-colors hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200"
                  >
                    #{number} ×
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {quickPickNumbers.map((number) => {
                const isSelected = selectedNumbers.includes(number);
                const isSold = soldNumbers.has(number);

                return (
                  <button
                    key={number}
                    type="button"
                    disabled={isSold}
                    onClick={() => handleSelectTicket(number)}
                    className={[
                      "rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200",
                      isSold
                        ? "cursor-not-allowed border-red-500/40 bg-red-500/10 text-red-200 opacity-55"
                        : isSelected
                          ? "border-teal-400 bg-teal-400/20 text-teal-200 shadow-[0_0_25px_rgba(45,212,191,0.35)]"
                          : "border-slate-700 bg-slate-800/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <span className="block">#{number}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.15em]">
                      {isSold ? "Sold" : isSelected ? "Selected" : "Available"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBuyTicket}
              className="flex-1 rounded-full bg-linear-to-r from-teal-400 to-cyan-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Buy ticket</span>
                {selectedNumbers.length > 0 && (
                  <span className="rounded-full bg-slate-950/10 px-2 py-0.5 text-[10px] tracking-[0.12em]">
                    {totalPrice.toFixed(2)} USDC
                  </span>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={handleRandomPick}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-200 transition-colors hover:bg-white/10"
            >
              Random pick
            </button>
          </div>
        </section>
        {/* End of current season section */}
        {/* Season Snapshot*/}

        <section className="mx-auto max-w-4xl rounded-[28px]">
          <SeasonSnapshot season={currentSeason} />
        </section>
        {walletConnected && (
          <MyTickets
            address={activeAddress}
            seasonNumber={currentSeason.seasonNumber}
            tickets={myTickets}
          />
        )}
        <PreviousWiner />
        <PrizeStructure />
      </main>
    </div>
  );
}
