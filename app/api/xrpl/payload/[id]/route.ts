import { NextResponse } from "next/server";
import { Xumm } from "xumm";

/**
 * Checks the status of a Xaman payload. Server-side only, so the Xaman API
 * secret stays out of the browser bundle.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
    const payload = await payloadApi.get(id);

    if (!payload) {
      return NextResponse.json({ status: "pending" });
    }

    const signed = payload.meta.signed === true;
    const resolved = payload.meta.resolved === true;

    if (signed) {
      return NextResponse.json({
        status: "signed",
        account: payload.response.account ?? null,
      });
    }

    if (resolved && !signed) {
      return NextResponse.json({ status: "rejected" });
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error("Failed to fetch Xaman payload", error);
    return NextResponse.json(
      { error: "Failed to fetch the Xaman payload." },
      { status: 502 },
    );
  }
}
