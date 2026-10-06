import { NextResponse } from "next/server";
import { Xumm } from "xumm";

/**
 * Creates a Xaman sign-in payload (QR / deep-link). Server-side only, so the
 * Xaman API secret stays out of the browser bundle.
 */
export async function POST() {
  const apiKey = process.env.XAMAN_API_KEY;
  const apiSecret = process.env.XAMAN_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Xaman API credentials are not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const xumm = new Xumm(apiKey, apiSecret);
    const payloadApi = xumm.payload;
    if (!payloadApi) {
      throw new Error("Xaman payload API is unavailable");
    }
    const payload = await payloadApi.create({
      txjson: { TransactionType: "SignIn" },
    });

    if (!payload) {
      return NextResponse.json(
        { error: "Xaman returned an empty payload." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      id: payload.uuid,
      qrUrl: payload.refs.qr_png,
      deepLink: payload.next.always,
    });
  } catch (error) {
    console.error("Failed to create Xaman sign-in payload", error);
    return NextResponse.json(
      { error: "Failed to create a Xaman sign-in payload." },
      { status: 502 },
    );
  }
}
