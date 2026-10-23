"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type CreatorChoice = { id: string; username: string; display_name: string | null };
const networks = {
  USDT: ["Solana", "BNB Smart Chain", "Polygon", "Ethereum"],
  USDC: ["Solana", "BNB Smart Chain", "Polygon", "Ethereum"],
  TRX: ["Tron"],
} as const;
type PaymentType = "creator_payment" | "creator_tip" | "store_order" | "donation";

export function PaymentProofForm({ userId, creators, initialPaymentType = "creator_payment", initialCreatorId = "" }: {
  userId: string;
  creators: CreatorChoice[];
  initialPaymentType?: "creator_payment" | "creator_tip";
  initialCreatorId?: string;
}) {
  const [asset, setAsset] = useState<keyof typeof networks>("USDT");
  const [paymentType, setPaymentType] = useState<PaymentType>(initialPaymentType);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function fail(text: string) {
    setMessage(text);
    setHasError(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setMessage("");
    setHasError(false);
    const form = new FormData(formElement);
    const file = form.get("screenshot");
    const amount = Number(form.get("amount"));
    const network = String(form.get("network"));
    const txHash = String(form.get("transactionHash") ?? "").trim();
    const orderReference = String(form.get("orderReference") ?? "").trim();
    const creatorId = String(form.get("creatorId") ?? "");
    const isCreatorPayment = paymentType === "creator_payment" || paymentType === "creator_tip";
    if (!(file instanceof File) || !file.size) return fail("Choose your payment screenshot.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) return fail("Use a JPG, PNG, or WEBP image up to 5 MB.");
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) return fail("Enter the amount you sent.");
    if (!(networks[asset] as readonly string[]).includes(network)) return fail("Choose a supported asset and network.");
    if (txHash.length < 8 || txHash.length > 180) return fail("Enter the transaction ID from your wallet.");
    if ((paymentType === "creator_payment" || paymentType === "store_order") && !orderReference) return fail("Enter the order reference provided by VIXEN.");
    if (isCreatorPayment && !creatorId) return fail("Choose the creator for this payment.");

    setBusy(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.id !== userId) throw new Error("Please sign in again before submitting proof.");
      const id = crypto.randomUUID();
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = user.id + "/" + id + "." + extension;
      const upload = await supabase.storage.from("crypto-payment-proofs").upload(path, file, { contentType: file.type, upsert: false });
      if (upload.error) throw new Error("The private screenshot upload failed. Please try again.");
      const insert = await supabase.from("crypto_payment_proofs").insert({
        id,
        user_id: user.id,
        payment_type: paymentType,
        creator_id: isCreatorPayment ? creatorId : null,
        order_reference: orderReference || null,
        asset,
        network,
        amount,
        transaction_hash: txHash,
        screenshot_path: path,
        status: "pending",
      });
      if (insert.error) {
        await supabase.storage.from("crypto-payment-proofs").remove([path]);
        throw new Error("We could not save the review request. No purchase access was unlocked.");
      }
      formElement.reset();
      setAsset("USDT");
      setPaymentType(initialPaymentType);
      setMessage(paymentType === "creator_tip"
        ? "Tip proof submitted for admin review. The creator’s balance updates only after VIXEN verifies the transfer."
        : "Proof submitted for admin review. VIXEN will verify the transfer before updating the purchase or creator balance.");
      setHasError(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not submit your proof. Please try again.");
      setHasError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="payment-proof-form" onSubmit={submit}>
      <label>What is this payment for?
        <select value={paymentType} onChange={(event) => setPaymentType(event.target.value as PaymentType)}>
          <option value="creator_payment">Creator payment</option>
          <option value="creator_tip">Tip a creator</option>
          <option value="store_order">Store order</option>
          <option value="donation">Donation</option>
        </select>
      </label>
      {paymentType === "creator_tip" && <p className="payment-proof-tip-note">Tips are voluntary and do not buy access or require a membership. After VIXEN independently verifies the transfer, the tip is credited to the selected creator’s earnings after the disclosed platform commission.</p>}
      {(paymentType === "creator_payment" || paymentType === "creator_tip") && <label>Creator
        <select name="creatorId" required defaultValue={initialCreatorId}>
          <option value="" disabled>Choose a creator</option>
          {creators.map((creator) => <option key={creator.id} value={creator.id}>@{creator.username} · {creator.display_name || creator.username}</option>)}
        </select>
      </label>}
      {(paymentType === "creator_payment" || paymentType === "store_order") && <label>Order reference<input name="orderReference" required maxLength={120} placeholder="Ask VIXEN for your reference" /></label>}
      <div className="payment-proof-grid">
        <label>Asset<select name="asset" value={asset} onChange={(event) => setAsset(event.target.value as keyof typeof networks)}><option>USDT</option><option>USDC</option><option>TRX</option></select></label>
        <label>Network<select name="network">{networks[asset].map((network) => <option key={network}>{network}</option>)}</select></label>
        <label>Amount sent<input name="amount" type="number" min="0.00000001" max="1000000000" step="0.00000001" required /></label>
      </div>
      <label>Transaction ID<input name="transactionHash" required minLength={8} maxLength={180} autoComplete="off" /></label>
      <label>Payment screenshot<input name="screenshot" type="file" accept="image/jpeg,image/png,image/webp" required /></label>
      <p className="payment-proof-privacy">Private upload · JPG, PNG, or WEBP · up to 5 MB. A screenshot alone is not proof of settlement; the administrator checks the transaction independently. Creator tips are credited only after approval.</p>
      <p className={hasError ? "payment-proof-error" : "payment-proof-status"} role={hasError ? "alert" : "status"} aria-live="polite">{busy ? "Uploading securely…" : message}</p>
      <button className="button" type="submit" disabled={busy}>{busy ? "Submitting…" : paymentType === "creator_tip" ? "Submit tip for review" : "Submit payment proof"}</button>
      <style>{" .payment-proof-form{display:grid;gap:16px;max-width:760px;margin:0 auto;padding:24px;border:1px solid var(--line);background:#100d12}.payment-proof-form label{display:grid;gap:7px;color:#e8e1e9;font-size:13px}.payment-proof-form input,.payment-proof-form select{width:100%;min-height:46px;padding:10px 12px;color:#f6eff7;background:#09070a;border:1px solid var(--line)}.payment-proof-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.payment-proof-privacy,.payment-proof-tip-note{color:#a59aa8;font-size:12px;line-height:1.6}.payment-proof-tip-note{margin:0;padding:13px;border:1px solid rgba(255,22,136,.3);background:rgba(255,22,136,.06)}.payment-proof-error{color:#ff78b8;font-size:13px}.payment-proof-status{color:#91e9b3;font-size:13px}@media(max-width:600px){.payment-proof-grid{grid-template-columns:1fr}}"}</style>
    </form>
  );
}
