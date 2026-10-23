"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CreatorBalance = { asset: string; network: string; available_balance: number | string };

export function WithdrawalRequestForm({ balances }: { balances: CreatorBalance[] }) {
  const router = useRouter();
  const options = balances.filter((balance) => Number(balance.available_balance) > 0);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const balance = options[selected];
    if (!balance) {
      setMessage("There is no available balance to withdraw yet.");
      setIsError(true);
      return;
    }
    const data = new FormData(formElement);
    const amount = Number(data.get("amount"));
    const address = String(data.get("destinationAddress") ?? "").trim();
    const note = String(data.get("creatorNote") ?? "").trim();
    if (!Number.isFinite(amount) || amount <= 0 || amount > Number(balance.available_balance)) {
      setMessage("Enter an amount within your available balance.");
      setIsError(true);
      return;
    }
    if (address.length < 20 || address.length > 180) {
      setMessage("Enter a valid wallet address for the selected asset and network.");
      setIsError(true);
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("request_creator_withdrawal", {
        p_asset: balance.asset,
        p_network: balance.network,
        p_amount: amount,
        p_destination_address: address,
        p_creator_note: note || null,
      });
      if (error) throw new Error(error.message);
      formElement.reset();
      setMessage("Your withdrawal request was sent. VIXEN will review and pay it manually.");
      setIsError(false);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The request could not be submitted.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="creator-withdrawal-form" onSubmit={submit}>
      <h2>Request a withdrawal</h2>
      <p>Choose the matching asset and network. VIXEN sends approved payouts manually.</p>
      {options.length === 0 ? <p>Your available balance will appear here after a verified creator payment is approved.</p> : <>
        <label>Balance<select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>{options.map((option, index) => <option value={index} key={option.asset + option.network}>{option.asset} · {option.network} · available {Number(option.available_balance).toFixed(8)}</option>)}</select></label>
        <label>Amount<input name="amount" type="number" min="0.00000001" step="0.00000001" max={Number(options[selected]?.available_balance ?? 0)} required /></label>
        <label>Destination wallet address<input name="destinationAddress" required maxLength={180} autoComplete="off" /></label>
        <label>Note for VIXEN (optional)<textarea name="creatorNote" maxLength={500} /></label>
        <button type="submit" disabled={busy}>{busy ? "Sending request…" : "Request withdrawal"}</button>
      </>}
      <p className={isError ? "creator-withdrawal-error" : "creator-withdrawal-status"} role={isError ? "alert" : "status"} aria-live="polite">{message}</p>
      <style>{".creator-withdrawal-form{display:grid;gap:12px;margin-top:22px;padding:20px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-withdrawal-form h2,.creator-withdrawal-form p{margin:0}.creator-withdrawal-form p{color:#aaa2ad;font-size:12px;line-height:1.6}.creator-withdrawal-form label{display:grid;gap:6px;color:#ddd5e0;font-size:12px}.creator-withdrawal-form input,.creator-withdrawal-form select,.creator-withdrawal-form textarea{width:100%;min-height:44px;padding:10px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16)}.creator-withdrawal-form textarea{min-height:70px}.creator-withdrawal-form button{min-height:44px;border:1px solid #ff1688;background:#bd0c68;color:#fff;cursor:pointer}.creator-withdrawal-form button:disabled{opacity:.6;cursor:wait}.creator-withdrawal-status{color:#91e9b3!important}.creator-withdrawal-error{color:#ff78b8!important}"}
      </style>
    </form>
  );
}
