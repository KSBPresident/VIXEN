export interface ChainPaymentExpectation {
  networkId: string;
  transactionId: string;
  recipient: string;
  /** Contract address or a server-defined native asset identifier. */
  assetId: string;
  /** Exact chain base units as a decimal string, avoiding floating-point money. */
  expectedAmountBaseUnits: string;
  /** Unique server-created order reference to prevent replay. */
  orderReference: string;
}

export interface ChainSettlementEvidence {
  status: "pending" | "confirmed" | "rejected";
  transactionId: string;
  confirmedAmountBaseUnits?: string;
  recipient?: string;
  assetId?: string;
  blockReference?: string;
  confirmations?: number;
  rejectionCode?: string;
}

/** Implemented by a trusted Back OS chain RPC/indexer adapter. */
export interface ChainSettlementVerifier {
  verifySettlement(input: ChainPaymentExpectation): Promise<ChainSettlementEvidence>;
}
