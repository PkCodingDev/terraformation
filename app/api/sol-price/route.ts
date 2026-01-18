import { NextRequest, NextResponse } from "next/server";

    const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
    const SOLANA_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const res = await fetch(`${SOLANA_RPC_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenPrice",
        params: { mint: "So11111111111111111111111111111111111111112" }
      }),
    });
    const data = await res.json();
    const solPriceUSD = data.result?.price

    return NextResponse.json({ solPrice: solPriceUSD });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch SOL price" }, { status: 500 });
  }
}
