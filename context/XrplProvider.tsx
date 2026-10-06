"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  XamanPayloadInfo,
  XrplWalletId,
  XrplWalletInfo,
} from "@/lib/xrpl-wallets";
import {
  connectCrossmark,
  connectGemWallet,
  createXamanSignIn,
  getAvailableWallets,
  pollXamanPayload,
  signXrplMessage,
} from "@/lib/xrpl";

const STORAGE_KEY = "numevia:xrpl-wallet";
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

interface XrplContextValue {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  walletId: XrplWalletId | undefined;
  wallets: XrplWalletInfo[];
  xamanPayload: XamanPayloadInfo | null;
  error: string | undefined;
  connect: (id: XrplWalletId) => Promise<void>;
  disconnect: () => void;
  clearXamanPayload: () => void;
  signMessage: (message: string) => Promise<string>;
}

const XrplContext = createContext<XrplContextValue | null>(null);

export function useXrpl() {
  const context = useContext(XrplContext);
  if (!context) {
    throw new Error("useXrpl must be used within XrplProvider");
  }
  return context;
}

const readStoredWallet = (): { id: XrplWalletId; address: string } | null => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as {
      id: XrplWalletId;
      address: string;
    } | null;
  } catch {
    return null;
  }
};

export default function XrplProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<XrplWalletInfo[]>([]);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [walletId, setWalletId] = useState<XrplWalletId | undefined>(undefined);
  const [isConnecting, setIsConnecting] = useState(false);
  const [xamanPayload, setXamanPayload] = useState<XamanPayloadInfo | null>(
    null,
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  // Detect wallets and restore a previous extension-wallet session.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const detected = await getAvailableWallets();
      if (cancelled) return;
      setWallets(detected);

      const stored = readStoredWallet();
      if (!stored) return;

      const info = detected.find((wallet) => wallet.id === stored.id);
      if (info?.kind === "extension" && info.installed) {
        setWalletId(stored.id);
        setAddress(stored.address);
      }
    })();

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [stopPolling]);

  const connectXaman = useCallback(async () => {
    const payload = await createXamanSignIn();
    setXamanPayload(payload);

    const startedAt = Date.now();
    stopPolling();
    pollTimer.current = setInterval(async () => {
      try {
        const result = await pollXamanPayload(payload.id);
        if (result.status === "signed") {
          stopPolling();
          setXamanPayload(null);
          setAddress(result.account);
          setWalletId("xaman");
          setIsConnecting(false);
        } else if (result.status === "rejected") {
          stopPolling();
          setXamanPayload(null);
          setError("The Xaman sign-in request was declined.");
          setIsConnecting(false);
        } else if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          stopPolling();
          setXamanPayload(null);
          setError("The Xaman sign-in request timed out.");
          setIsConnecting(false);
        }
      } catch {
        stopPolling();
        setXamanPayload(null);
        setError("Lost connection while waiting for Xaman.");
        setIsConnecting(false);
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling]);

  const connect = useCallback(
    async (id: XrplWalletId) => {
      setError(undefined);
      setIsConnecting(true);
      try {
        if (id === "gemwallet") {
          const nextAddress = await connectGemWallet();
          setAddress(nextAddress);
          setWalletId("gemwallet");
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ id: "gemwallet", address: nextAddress }),
          );
          setIsConnecting(false);
        } else if (id === "crossmark") {
          const nextAddress = await connectCrossmark();
          setAddress(nextAddress);
          setWalletId("crossmark");
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ id: "crossmark", address: nextAddress }),
          );
          setIsConnecting(false);
        } else {
          await connectXaman();
          // isConnecting stays true until the payload resolves.
        }
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not connect the wallet",
        );
        setIsConnecting(false);
      }
    },
    [connectXaman],
  );

  const disconnect = useCallback(() => {
    stopPolling();
    setXamanPayload(null);
    setAddress(undefined);
    setWalletId(undefined);
    setIsConnecting(false);
    setError(undefined);
    localStorage.removeItem(STORAGE_KEY);
  }, [stopPolling]);

  const clearXamanPayload = useCallback(() => {
    stopPolling();
    setXamanPayload(null);
    setIsConnecting(false);
  }, [stopPolling]);

  const signMessage = useCallback(
    async (message: string) => {
      if (!address || !walletId) {
        throw new Error("No XRPL wallet connected");
      }
      if (walletId === "xaman") {
        throw new Error(
          "Xaman message signing uses payloads — not wired up yet",
        );
      }
      return signXrplMessage(walletId, address, message);
    },
    [address, walletId],
  );

  return (
    <XrplContext.Provider
      value={{
        address,
        isConnected: Boolean(address),
        isConnecting,
        walletId,
        wallets,
        xamanPayload,
        error,
        connect,
        disconnect,
        clearXamanPayload,
        signMessage,
      }}
    >
      {children}
    </XrplContext.Provider>
  );
}
