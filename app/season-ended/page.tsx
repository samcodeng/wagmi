"use client";

import { useAccount, useChainId } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useXrpl } from "@/context/XrplProvider";
import { useState } from "react";
import NumbersRain from "@/components/NumbersRain";
import PrizeStructure from "@/components/PrizeStructure";
import { prizeStructure } from "@/lib/season-data";

const winningNumbers = [137, 408, 716, 888, 936];
const winningPrizes = [10000, 5000, 1000, 250, 250];
const myTickets = [137, 243, 716, 824, 936];
const seasonNumber = 2;
const totalWinners = prizeStructure.reduce((total, tier) => {
  const winnerCount = Number.parseInt(tier.place, 10);

  return total + (Number.isNaN(winnerCount) ? 0 : winnerCount);
}, 0);

export default function SeasonEnded() {
  const { address, isConnected } = useAccount();
  const { address: xrplAddress, isConnected: xrplConnected } = useXrpl();
  const chainId = useChainId();
  const { open } = useAppKit();
  const connected = isConnected || xrplConnected;
  const activeAddress = address ?? xrplAddress;
  const [isClaimed, setIsClaimed] = useState(false);
  const [isViewingWinnings, setIsViewingWinnings] = useState(false);
  const winningSet = new Set(winningNumbers);
  const prizeByNumber = new Map(
    winningNumbers.map((number, index) => [number, winningPrizes[index]]),
  );
  const matchingTickets = myTickets.filter((ticket) => winningSet.has(ticket));
  const totalWinnings = matchingTickets.reduce(
    (total, ticket) => total + (prizeByNumber.get(ticket) ?? 0),
    0,
  );

  const handleClaim = () => {
    if (matchingTickets.length === 0 || isClaimed) return;

    console.log("Claiming winnings:", totalWinnings, "USDC");
    setIsClaimed(true);
  };

  const handleVerifyOnchain = () => {
    if (!activeAddress) {
      open();
      return;
    }

    if (!address && xrplAddress) {
      window.open(
        `https://testnet.xrpl.org/accounts/${xrplAddress}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    const explorer =
      chainId === 11155111
        ? "https://sepolia.etherscan.io/address/"
        : "https://etherscan.io/address/";
    window.open(`${explorer}${address}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <NumbersRain />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-12 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">
            Season {seasonNumber} · Results
          </p>
          <h1 className="mt-4 text-4xl font-black leading-none tracking-[-0.04em] text-white sm:text-6xl">
            The numbers are in.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Season {seasonNumber} has ended. Check the winning numbers below,
            then connect your wallet to see whether one of your tickets won.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-4xl rounded-[28px] border border-teal-300/25 bg-slate-900/85 p-6 shadow-[0_0_45px_rgba(12,23,45,0.8)] backdrop-blur-sm sm:p-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                Winning numbers
              </p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                Season {seasonNumber} draw
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Draw complete · {totalWinners} winners
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {winningNumbers.map((number, index) => (
              <div
                key={number}
                className="rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-5 text-center shadow-[0_0_24px_rgba(251,191,36,0.12)]"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                  Number {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-3xl font-black text-amber-200">
                  #{number}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100">
                  {winningPrizes[index].toLocaleString()} USDC
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleVerifyOnchain}
              className="rounded-full border border-teal-300/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-teal-200 transition-colors hover:bg-teal-300/10"
            >
              Verify onchain
            </button>
          </div>

          {isViewingWinnings && (
            <p className="mx-auto mt-4 max-w-xl text-center text-xs leading-5 text-amber-100/80">
              The Season {seasonNumber} draw awarded a total prize pool of{" "}
              {winningPrizes
                .reduce((total, prize) => total + prize, 0)
                .toLocaleString()}{" "}
              USDC across the five winning numbers.
            </p>
          )}
        </section>

        <section className="mx-auto mt-6 max-w-4xl rounded-[28px] border border-white/10 bg-slate-900/80 p-6 sm:p-10">
          {!connected ? (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Your result
              </p>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                Connect to check your tickets
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Your ticket history is linked to your wallet, so we need your
                address to calculate the result.
              </p>
              <button
                type="button"
                onClick={() => open()}
                className="mt-6 rounded-full bg-teal-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-950 transition-colors hover:bg-teal-300"
              >
                Connect wallet
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                    Your result
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                    {matchingTickets.length > 0
                      ? `${matchingTickets.length} winning ticket${matchingTickets.length === 1 ? " 🎉" : "s 🎉"}`
                      : "No winning tickets"}
                  </h2>
                  {matchingTickets.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-200">
                        Total won: {totalWinnings.toLocaleString()} USDC
                      </p>
                      <button
                        type="button"
                        onClick={handleClaim}
                        disabled={isClaimed}
                        className="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isClaimed ? "Claimed" : "Claim winnings"}
                      </button>
                    </div>
                  )}
                </div>
                {activeAddress && (
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
                  </p>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {myTickets.map((ticket) => {
                  const won = winningSet.has(ticket);

                  return (
                    <div
                      key={ticket}
                      className={`rounded-2xl border p-4 ${
                        won
                          ? "border-amber-300/40 bg-amber-300/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Your ticket
                      </p>
                      <p
                        className={`mt-2 text-3xl font-black ${
                          won ? "text-amber-200" : "text-slate-200"
                        }`}
                      >
                        #{ticket}
                      </p>
                      <p
                        className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          won ? "text-amber-200" : "text-slate-500"
                        }`}
                      >
                        {won ? "Winner" : "Not selected"}
                      </p>
                      {won && (
                        <p className="mt-2 text-sm font-bold text-amber-100">
                          {(prizeByNumber.get(ticket) ?? 0).toLocaleString()}{" "}
                          USDC
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
        <PrizeStructure />
      </main>
    </div>
  );
}
