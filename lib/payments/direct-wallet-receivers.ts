/**
 * Public merchant receive routes supplied by the VIXEN owner.
 * An address is not proof that an order was paid. Receipts require independent
 * chain verification and manual fulfillment until a trusted adapter exists.
 */
export type DirectWalletRoute = {
  asset: "USDT" | "USDC" | "TRX" | "BNB" | "SOL" | "ETH" | "MATIC";
  network: "Solana" | "BNB Smart Chain" | "Polygon" | "Ethereum" | "Tron";
  address: string;
  status: "manual_review" | "coming_soon";
};

const evmAddress = "0xE51A7Ca633e27a1e369A9480BAC69cA64e48dE75";
const solanaAddress = "72jittFfSyu7cPSPMEhSv83qXG8TBTt3GERdSxyFp56Rg";

export const directWalletRoutes: readonly DirectWalletRoute[] = [
  { asset: "USDT", network: "Solana", address: solanaAddress, status: "manual_review" },
  { asset: "USDC", network: "Solana", address: solanaAddress, status: "manual_review" },
  { asset: "TRX", network: "Tron", address: "TYMeD5NpSEShWuJyMDwopwaEHGnvrbw82c", status: "manual_review" },
  { asset: "USDT", network: "Tron", address: "TYMeD5NpSEShWuJyMDwopwaEHGnvrbw82c", status: "manual_review" },
  { asset: "USDT", network: "BNB Smart Chain", address: evmAddress, status: "manual_review" },
  { asset: "USDC", network: "BNB Smart Chain", address: evmAddress, status: "manual_review" },
  { asset: "USDT", network: "Polygon", address: evmAddress, status: "manual_review" },
  { asset: "USDC", network: "Polygon", address: evmAddress, status: "manual_review" },
  { asset: "USDT", network: "Ethereum", address: evmAddress, status: "manual_review" },
  { asset: "USDC", network: "Ethereum", address: evmAddress, status: "manual_review" },
  { asset: "BNB", network: "BNB Smart Chain", address: evmAddress, status: "coming_soon" },
  { asset: "SOL", network: "Solana", address: solanaAddress, status: "coming_soon" },
  { asset: "ETH", network: "Ethereum", address: evmAddress, status: "coming_soon" },
  { asset: "MATIC", network: "Ethereum", address: evmAddress, status: "coming_soon" },
] as const;

export function getDirectWalletRoutes(asset?: DirectWalletRoute["asset"]) {
  return directWalletRoutes.filter((route) => !asset || route.asset === asset);
}
