import type {
  XamanPayloadInfo,
  XamanPayloadStatus,
  XrplWalletInfo,
} from "./xrpl-wallets";

/**
 * XRPL wallet integrations without WalletConnect:
 * - GemWallet (browser extension)
 * - Crossmark (browser extension)
 * - Xaman (mobile, QR / deep-link payloads via the app's API routes,
 *   so the Xaman API secret never reaches the browser)
 */

export const XRPL_NETWORK_LABEL = "Testnet";

export const toHex = (message: string) =>
  Array.from(new TextEncoder().encode(message))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

/** Which XRPL wallets are currently usable. Call client-side only. */
export async function getAvailableWallets(): Promise<XrplWalletInfo[]> {
  let gemInstalled = false;
  let crossmarkInstalled = false;

  try {
    const { isInstalled } = await import("@gemwallet/api");
    gemInstalled = (await isInstalled()).result.isInstalled;
  } catch {
    gemInstalled = false;
  }

  try {
    const { default: sdk } = await import("@crossmarkio/sdk");
    crossmarkInstalled = (await sdk.methods.detect(1500)) === true;
  } catch {
    crossmarkInstalled = false;
  }

  return [
    {
      id: "gemwallet",
      name: "GemWallet",
      kind: "extension",
      installed: gemInstalled,
    },
    {
      id: "crossmark",
      name: "Crossmark",
      kind: "extension",
      installed: crossmarkInstalled,
    },
    { id: "xaman", name: "Xaman", kind: "xaman", installed: true },
  ];
}

// ---------------------------------------------------------------------------
// GemWallet
// ---------------------------------------------------------------------------

export async function connectGemWallet(): Promise<string> {
  const { getAddress } = await import("@gemwallet/api");
  const response = await getAddress();
  const address = response.result?.address;
  if (response.type !== "response" || !address) {
    throw new Error("GemWallet connection was rejected");
  }
  return address;
}

// ---------------------------------------------------------------------------
// Crossmark
// ---------------------------------------------------------------------------

export async function connectCrossmark(): Promise<string> {
  const { default: sdk } = await import("@crossmarkio/sdk");
  const { response } = await sdk.methods.signInAndWait();
  const address = (response as { data?: { address?: string } })?.data?.address;
  if (!address) {
    throw new Error("Crossmark connection was rejected");
  }
  return address;
}

// ---------------------------------------------------------------------------
// Xaman (via Next.js API routes)
// ---------------------------------------------------------------------------

export async function createXamanSignIn(): Promise<XamanPayloadInfo> {
  const res = await fetch("/api/xrpl/signin", { method: "POST" });
  if (!res.ok) {
    throw new Error("Could not create a Xaman sign-in request");
  }
  return (await res.json()) as XamanPayloadInfo;
}

export async function pollXamanPayload(
  id: string,
): Promise<XamanPayloadStatus> {
  const res = await fetch(`/api/xrpl/payload/${id}`);
  if (!res.ok) {
    throw new Error("Could not check the Xaman payload status");
  }
  return (await res.json()) as XamanPayloadStatus;
}

// ---------------------------------------------------------------------------
// Signing (extension wallets; Xaman would use its own payload flow)
// ---------------------------------------------------------------------------

export async function signXrplMessage(
  walletId: "gemwallet" | "crossmark",
  address: string,
  message: string,
): Promise<string> {
  if (walletId === "gemwallet") {
    const { signMessage } = await import("@gemwallet/api");
    const response = await signMessage(toHex(message));
    const signed = response.result?.signedMessage;
    if (response.type !== "response" || !signed) {
      throw new Error("GemWallet message signing was rejected");
    }
    return signed;
  }

  throw new Error(`Message signing is not implemented for ${walletId} yet`);
}
