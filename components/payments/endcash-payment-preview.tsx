import Image from "next/image";
import styles from "./endcash-payment-preview.module.css";

export function EndcashPaymentPreview() {
  return (
    <section className={styles.card} aria-labelledby="endcash-payment-title">
      <div className={styles.copy}>
        <p className={styles.kicker}>TRINIDAD &amp; TOBAGO · PLANNED LOCAL PAYMENT</p>
        <h2 id="endcash-payment-title">Endcash QR</h2>
        <p>This local payment option is being prepared for VIXEN members in Trinidad and Tobago.</p>
        <p className={styles.warning}><strong>Preview only — do not send payment.</strong> VIXEN cannot create an order, confirm an Endcash transfer, or unlock access yet. The QR is shown for setup review only.</p>
      </div>
      <figure className={styles.figure}>
        <Image className={styles.qr} src="/assets/endcash-payment-qr.png" alt="Endcash QR code supplied for the planned Trinidad and Tobago payment option" width={315} height={315} />
        <figcaption className={styles.caption}>VIXEN checkout does not process or reconcile this QR yet.</figcaption>
      </figure>
    </section>
  );
}
