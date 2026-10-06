"use client";

import { useState } from "react";
import InfoModal from "@/layout/InfoModal";

type ModalType = "how-it-works" | "terms" | null;

export default function Footer() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <>
      <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-white/10 px-6 py-6 text-xs uppercase tracking-[0.16em] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 text-center">
        <span>© 2026 Numevia</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 w-full justify-center lg:w-auto lg:justify-end">
          <button
            type="button"
            className="transition-colors cursor-pointer hover:text-teal-300"
            onClick={() => setModal("how-it-works")}
          >
            How it works
          </button>
          <button
            type="button"
            className="transition-colors cursor-pointer hover:text-teal-300"
            onClick={() => setModal("terms")}
          >
            Terms and conditions
          </button>
        </nav>
      </footer>

      {modal === "how-it-works" && (
        <InfoModal title="How it works" onClose={() => setModal(null)}>
          <p>Choose one or more available ticket numbers from the selector.</p>
          <p>Connect your wallet and confirm the purchase using USDC.</p>
          <p>
            Tickets remain visible in My Tickets while the season is active.
          </p>
          <p>
            There is no countdown. The season finishes when all tickets have
            been sold. Winning numbers are then selected, rewards are paid to
            the winners, and the next season can begin.
          </p>
        </InfoModal>
      )}

      {modal === "terms" && (
        <InfoModal title="Terms and conditions" onClose={() => setModal(null)}>
          <p>
            Ticket availability and draw information shown here are placeholder
            data for this interface.
          </p>
          <p>
            Purchases are final once confirmed onchain. Please check the
            selected numbers before approving a transaction.
          </p>
          <p>
            Prize eligibility, draw timing, and settlement are subject to the
            final deployed smart contract rules.
          </p>
          <p>
            By using Numevia, you confirm that participation is permitted in
            your jurisdiction.
          </p>
        </InfoModal>
      )}
    </>
  );
}
