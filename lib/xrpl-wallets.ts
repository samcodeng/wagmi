export type XrplWalletId = "gemwallet" | "crossmark" | "xaman";

export interface XrplWalletInfo {
  id: XrplWalletId;
  name: string;
  /** "extension" wallets need no backend; "xaman" works via QR/deep-link. */
  kind: "extension" | "xaman";
  installed: boolean;
}

export interface XamanPayloadInfo {
  /** Payload UUID. */
  id: string;
  qrUrl: string;
  deepLink: string;
}

export type XamanPayloadStatus =
  | { status: "pending" }
  | { status: "signed"; account: string }
  | { status: "rejected" };
