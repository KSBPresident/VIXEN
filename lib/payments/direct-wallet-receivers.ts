/**
 * Public merchant receive routes supplied by the VIXEN owner.
 * A configured address is not proof that an order was paid; all receipts require
 * independent chain verification and manual fulfillment until a trusted adapter exists.
 */
export type DirectWalletRoute = {
  asset: "USDT" | "TRX";
  network: "Solana" | "BNB Smart Chain" | "Polygon" | "Ethereum" | "Tron";
  address: string;
  status: "manual_review";
  /** Asset displayed in the owner's wallet receive screen for this network. */
  screenshotAsset: "USDT" | "TRX";
};

export const directWalletRoutes: readonly DirectWalletRoute[] = [
  {
    asset: "USDT",
    network: "Solana",
    address: "72jittFfSyu7cPSPMEhSv83qXG8TBt3GERdSxyFp56Rg",
    status: "manual_review",
    screenshotAsset: "USDT",
  },
  {
    asset: "TRX",
    network: "Tron",
    address: "TYMeD5NpSEShWuJyMDwopwaEHGnvrbw82c",
    status: "manual_review",
    screenshotAsset: "TRX",
  },
  {
    asset: "USDT",
    network: "BNB Smart Chain",
    address: "0xE51A7Ca633e27a1e369A9480BAC69cA64e48dE75",
    status: "manual_review",
    screenshotAsset: "USDT",
  },
  {
    asset: "USDT",
    network: "Polygon",
    address: "0xE51A7Ca633e27a1e369A9480BAC69cA64e48dE75",
    status: "manual_review",
    screenshotAsset: "USDT",
  },
  {
    asset: "USDT",
    network: "Ethereum",
    address: "0xE51A7Ca633e27a1e369A9480BAC69cA64e48dE75",
    status: "manual_review",
    screenshotAsset: "USDT",
  },
] as const;

/** USDC is deliberately absent until its exact receiving network/address is supplied. */
export function getDirectWalletRoutes(asset?: DirectWalletRoute["asset"]) {
  return directWalletRoutes.filter((route) => !asset || route.asset === asset);
}
