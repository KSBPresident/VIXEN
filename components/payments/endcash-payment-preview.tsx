import Image from "next/image";
import styles from "./endcash-payment-preview.module.css";

export function EndcashPaymentPreview() {
  return (
    <section className={styles.card} aria-labelledby="endcash-payment-title">
      <div className={styles.copy}>
        <p className={styles.kicker}>TRINIDAD &amp; TOBAGO · PLANNED STORE/TOKEN PAYMENT</p>
        <h2 id="endcash-payment-title">Endcash QR</h2>
        <p>Endcash is a candidate for eligible VIXEN store and token purchases only, pending provider approval.</p>
        <p className={styles.warning}><strong>Preview only — do not send payment.</strong> VIXEN has no Endcash checkout or verified transfer confirmation. This QR cannot confirm a store order or token purchase. Do not send funds.</p>
      </div>
      <figure className={styles.figure}>
        <Image className={styles.qr} src="/assets/endcash-payment-qr.png" alt="Endcash QR code for a potential VIXEN store and token payment option; preview only" width={315} height={315} />
        <figcaption className={styles.caption}>No VIXEN checkout or payment reconciliation is active.</figcaption>
      </figure>
    </section>
  );
}
