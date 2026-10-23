"use client";

import { useMemo, useState } from "react";
import type { DirectWalletRoute } from "@/lib/payments/direct-wallet-receivers";
import styles from "./direct-wallet-options.module.css";

type PaymentAsset = DirectWalletRoute["asset"];
const assets: readonly PaymentAsset[] = ["USDT", "USDC", "TRX", "BNB", "SOL", "ETH", "MATIC"];

export function DirectWalletOptions({ routes }: { routes: readonly DirectWalletRoute[] }) {
  const [asset, setAsset] = useState<PaymentAsset>("USDT");
  const [copied, setCopied] = useState<string | null>(null);
  const visibleRoutes = useMemo(() => routes.filter((route) => route.asset === asset), [routes, asset]);

  async function copyAddress(network: string, address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(network);
      window.setTimeout(() => setCopied((current) => current === network ? null : current), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <>
      <div className={styles.tabs} role="group" aria-label="Choose crypto asset">
        {assets.map((item) => (
          <button
            className={asset === item ? styles.activeTab : styles.tab}
            key={item}
            type="button"
            aria-pressed={asset === item}
            onClick={() => { setAsset(item); setCopied(null); }}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleRoutes.length ? (
        <div className={styles.grid}>
          {visibleRoutes.map((route) => {
            const available = route.status === "manual_review";
            return (
              <article className={styles.card} key={\`\${route.asset}-\${route.network}\`}>
                <div className={styles.cardTop}>
                  <div>
                    <span className={styles.kicker}>{route.asset} · NETWORK</span>
                    <h2>{route.network}</h2>
                  </div>
                  <span className={available ? styles.review : styles.comingSoon}>
                    {available ? "Available · manual review" : "Coming soon"}
                  </span>
                </div>
                {available ? (
                  <>
                    <p className={styles.warning}>Send {route.asset} on {route.network} only. Using another asset or network may permanently lose your funds.</p>
                    <code className={styles.address}>{route.address}</code>
                    <button
                      className={styles.copy}
                      type="button"
                      onClick={() => void copyAddress(route.network, route.address)}
                    >
                      {copied === route.network ? "Address copied" : "Copy receive address"}
                    </button>
                  </>
                ) : (
                  <p className={styles.warning}>This wallet can receive {route.asset} on {route.network}, but VIXEN is still preparing exact-amount quoting and balance accounting for this asset. Do not send funds for a VIXEN purchase yet.</p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <strong>{asset} receiving details are not configured.</strong>
          <span>Choose USDT or USDC to view currently available routes.</span>
        </div>
      )}
    </>
  );
}
