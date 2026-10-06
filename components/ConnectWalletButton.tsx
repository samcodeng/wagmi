"use client";

import {
  useAppKitAccount,
  useDisconnect,
  useAppKit,
} from "@reown/appkit/react";
import { useEffect, useRef, useState } from "react";
import { useXrpl } from "@/context/XrplProvider";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const WALLET_LABEL: Record<string, string> = {
  gemwallet: "GemWallet",
  crossmark: "Crossmark",
  xaman: "Xaman",
};

export default function ConnectWalletButton() {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const {
    address: xrplAddress,
    isConnected: xrplConnected,
    isConnecting: xrplConnecting,
    walletId: xrplWalletId,
    wallets: xrplWallets,
    xamanPayload,
    error: xrplError,
    connect: connectXrpl,
    disconnect: disconnectXrpl,
    clearXamanPayload,
  } = useXrpl();

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the wallet picker when clicking outside of it.
  useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [pickerOpen]);

  return (
    <div className="flex items-center gap-2 lg:gap-3">
      {isConnected && address ? (
        <>
          <span className="rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1.5 text-xs font-semibold lg:tracking-[0.12em] text-teal-200 uppercase">
            {shortenAddress(address)}
          </span>
          <a
            href="#my-tickets"
            className="px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-white uppercase lg:block hidden"
          >
            My Tickets
          </a>
          <button
            type="button"
            onClick={() => disconnect()}
            className="rounded-full border border-white/10 bg-white/5 px-1 lg:px-3 py-1.5 text-xs font-semibold lg:tracking-[0.12em] text-slate-200 uppercase transition-colors hover:bg-white/10"
          >
            Disconnect
          </button>
        </>
      ) : (
        !xrplConnected && (
          <button
            type="button"
            onClick={() => open()}
            className="rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2.5 text-sm font-semibold tracking-[0.08em] text-slate-950 uppercase shadow-[0_0_30px_rgba(45,212,191,0.45)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(45,212,191,0.6)] cursor-pointer"
          >
            Connect Wallet
          </button>
        )
      )}

      {xrplConnected && xrplAddress ? (
        <>
          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold lg:tracking-[0.12em] text-amber-200 uppercase">
            {xrplWalletId ? `${WALLET_LABEL[xrplWalletId]} · ` : "XRP · "}
            {shortenAddress(xrplAddress)}
          </span>
          <a
            href="#my-tickets"
            className="px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-white uppercase lg:block hidden"
          >
            My Tickets
          </a>
          <button
            type="button"
            onClick={() => disconnectXrpl()}
            className="rounded-full border border-white/10 bg-white/5 px-1 lg:px-3 py-1.5 text-xs font-semibold lg:tracking-[0.12em] text-slate-200 uppercase transition-colors hover:bg-white/10"
          >
            Disconnect
          </button>
        </>
      ) : (
        !isConnected && (
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setPickerOpen((openPicker) => !openPicker)}
              disabled={xrplConnecting}
              className="rounded-full border border-amber-300/50 bg-amber-300/10 px-5 py-2.5 text-sm font-semibold tracking-[0.08em] text-amber-200 uppercase transition-colors hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {xrplConnecting ? "Connecting…" : "Connect XRP"}
            </button>

            {pickerOpen && !xrplConnecting && (
              <div className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                <p className="px-4 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Choose an XRP wallet
                </p>
                {xrplWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => {
                      setPickerOpen(false);
                      connectXrpl(wallet.id);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:bg-white/5 cursor-pointer"
                  >
                    <span className="font-semibold">{wallet.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      {wallet.kind === "xaman"
                        ? "Mobile · QR"
                        : wallet.installed
                          ? "Installed"
                          : "Extension"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {xrplError && (
        <p className="absolute right-6 top-20 z-30 max-w-xs rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-200">
          {xrplError}
        </p>
      )}

      {xamanPayload && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Xaman sign-in
            </p>
            <h3 className="mt-2 text-lg font-black text-white">
              Scan with the Xaman app
            </h3>
            <img
              src={xamanPayload.qrUrl}
              alt="Xaman sign-in QR code"
              className="mx-auto mt-4 h-48 w-48 rounded-2xl bg-white p-2"
            />
            <p className="mt-3 text-xs leading-5 text-slate-400">
              Open Xaman on your phone and scan the QR code, or tap the link on
              mobile.
            </p>
            <a
              href={xamanPayload.deepLink}
              className="mt-4 inline-block rounded-full bg-amber-300 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-950 transition-colors hover:bg-amber-200"
            >
              Open in Xaman
            </a>
            <button
              type="button"
              onClick={clearXamanPayload}
              className="mt-3 block w-full text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
