"use client";

import { useEffect, useState } from "react";
import styles from "./launch-countdown.module.css";

const LAUNCH_AT = new Date("2026-10-20T00:00:00-04:00").getTime();
const SECOND = 1000;

function getRemainingSeconds() {
  return Math.max(0, Math.ceil((LAUNCH_AT - Date.now()) / SECOND));
}

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
    <section className={styles.banner} aria-label="VIXEN beta soft launch countdown">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>VIXEN · BETA SOFT LAUNCH</p>
        <h2>{launched ? "The beta soft launch is here." : "Coming soon."}</h2>
        <p>{launched ? "Welcome to VIXEN beta. Some creator, messaging, video, and payment features remain in preview." : "VIXEN opens in beta at 12:00 a.m. Tuesday, October 20 (Trinidad & Tobago time)."}</p>
      </div>
      {!launched && (
        <div className={styles.timer} role="timer" aria-label="Time until the VIXEN beta soft launch">
          {parts.map(({ label, value }) => (
            <div className={styles.unit} key={label}>
              <strong>{remaining === null ? "--" : String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
      <p className={styles.note}>Beta release · Some features are still previews and are not available for use.</p>
    </section>
  );
}
