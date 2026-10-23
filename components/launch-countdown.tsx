"use client";

import { useEffect, useState } from "react";
import styles from "./launch-countdown.module.css";

const OFFICIAL_LAUNCH_AT = new Date("2026-11-03T00:00:00-04:00").getTime();
const SECOND = 1000;

function getRemainingSeconds() {
  return Math.max(0, Math.ceil((OFFICIAL_LAUNCH_AT - Date.now()) / SECOND));
}

const launchDetails = [
  {
    title: "Launch-week creator discount",
    copy: "November 3–9 only: VIXEN’s fee is 5%, so creators keep 95%. The standard 15% / 85% split returns November 10.",
  },
  {
    title: "Available account paths",
    copy: "Free member logins and creator applicant accounts. Applications remain pending until age and identity review and approval.",
  },
  {
    title: "Wallet routes · manual review",
    copy: "USDT, USDC, and TRX proof submissions are reviewed manually. Sending a screenshot does not automatically fulfill a purchase.",
  },
  {
    title: "Still coming soon",
    copy: "Creator publishing, paid memberships and messages, private video calls, VIXEN and NINE coin purchases, store checkout, VIP/VVIP entry, and automatic payments or payouts.",
  },
];

export function LaunchCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setRemaining(getRemainingSeconds());
    update();
    const interval = window.setInterval(update, SECOND);
    return () => window.clearInterval(interval);
  }, []);

  const launched = remaining !== null && remaining === 0;
  const seconds = remaining ?? 0;
  const parts = [
    { label: "Days", value: Math.floor(seconds / 86400) },
    { label: "Hours", value: Math.floor((seconds % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((seconds % 3600) / 60) },
    { label: "Seconds", value: seconds % 60 },
  ];

  return (
    <section className={styles.banner} aria-label="VIXEN official launch countdown">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>VIXEN · BETA SOFT LAUNCH</p>
        <h2>{launched ? "The official launch has begun." : "Beta ends Monday night, November 2."}</h2>
        <p>{launched
          ? "Welcome to the VIXEN official launch. Any feature that is not fully available remains marked Coming soon."
          : "Official launch: Tuesday, November 3, 2026 at 12:00 a.m. Trinidad & Tobago time (AST, UTC−4)."}
        </p>
      </div>
      {!launched && (
        <div className={styles.timer} role="timer" aria-label="Time until VIXEN official launch">
          {parts.map(({ label, value }) => (
            <div className={styles.unit} key={label}>
              <strong>{remaining === null ? "--" : String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.details} aria-label="Official launch features and availability">
        {launchDetails.map(({ title, copy }) => (
          <article className={styles.detail} key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </article>
        ))}
      </div>
      <p className={styles.note}>Beta mode ends at midnight. New features will open only when every part of that feature is ready.</p>
    </section>
  );
}
