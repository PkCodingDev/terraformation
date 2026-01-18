// app/api/earnings/route.ts
import { NextResponse } from "next/server";
import { BagsSDK } from "@bagsfm/bags-sdk";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const BAGS_API_KEY = process.env.BAGS_API_KEY!;

const DOLLARS_PER_TREE = 25;

const sdk = new BagsSDK(
  BAGS_API_KEY,
  new Connection(HELIUS_RPC_URL),
  "processed"
);

export async function GET() {
  try {
    // 1️⃣ Fees von BagsFM
    const lamports = await sdk.state.getTokenLifetimeFees(
      new PublicKey("BBSAW49Sru7jiSajWVKTSWs39psrjjHbMMtWGWTJBAGS")
    );

    const feesSOL = lamports / LAMPORTS_PER_SOL;

    // 2️⃣ SOL Preis über Helius DAS
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "sol-price",
        method: "getAsset",
        params: {
          id: "So11111111111111111111111111111111111111112",
          displayOptions: { showFungible: true },
        },
      }),
    });

    const data = await res.json();
    const solPriceUSD =
      data?.result?.token_info?.price_info?.price_per_token;

    if (!solPriceUSD) throw new Error("No SOL price");

    // 3️⃣ Umrechnung
    const earningsUSD = feesSOL * solPriceUSD;
    const trees = Math.floor(earningsUSD / DOLLARS_PER_TREE);
    const remainder = earningsUSD % DOLLARS_PER_TREE;
    const progress = remainder / DOLLARS_PER_TREE;

    return NextResponse.json({
      earningsUSD,
      trees,
      progress,
      solPriceUSD,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}
