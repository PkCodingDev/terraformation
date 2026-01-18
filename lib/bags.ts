import { BagsSDK } from "@bagsfm/bags-sdk";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const BAGS_API_KEY = process.env.BAGS_API_KEY!;
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL!;
const connection = new Connection(SOLANA_RPC_URL);
const sdk = new BagsSDK(BAGS_API_KEY, connection, "processed");

export async function getLifetimeFeesSOL(tokenMint: string): Promise<number> {
  const lamports = await sdk.state.getTokenLifetimeFees(
    new PublicKey(tokenMint)
  );

  return lamports / LAMPORTS_PER_SOL;
}
