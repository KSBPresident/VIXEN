"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  creatorPostMaxMediaBytes,
  creatorPostMediaTypes,
  validateCreatorPublication,
} from "@/lib/kernel/creator-post";
import { publishCreatorPost, type CreatorPublicationActionState } from "@/app/creator/posts/actions";

const initialState: CreatorPublicationActionState = { status: "idle", message: "" };

export function CreatorPostComposer() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch, pending] = useActionState(publishCreatorPost, initialState);
  const [uploading, setUploading] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  async function submitPublication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalMessage("");
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const file = formData.get("mediaFile");
    const selectedFile = file instanceof File && file.size > 0 ? file : null;
    const kind = String(formData.get("kind") ?? "post");
    const caption = String(formData.get("caption") ?? "");
    const validationMessage = validateCreatorPublication({
      kind,
      caption,
      mediaType: selectedFile?.type ?? null,
      mediaSize: selectedFile?.size ?? null,
    });
    if (validationMessage) {
      setLocalMessage(validationMessage);
      return;
    }
    if (formData.get("consentConfirmed") !== "on") {
      setLocalMessage("Confirm that everyone shown is an adult and has consented to publication.");
      return;
    }

    let mediaPath = "";
    if (selectedFile) {
      setUploading(true);
      const extension = creatorPostMediaTypes[selectedFile.type as keyof typeof creatorPostMediaTypes];
      if (!extension) {
        setLocalMessage("Choose a JPEG, PNG, WebP, MP4, or WebM file.");
        setUploading(false);
        return;
      }
      const client = createClient();
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        setLocalMessage("Sign in again before uploading creator media.");
        setUploading(false);
        return;
      }
      mediaPath = user.id + "/" + crypto.randomUUID() + "." + extension;
      const { error } = await client.storage.from("creator-post-media").upload(mediaPath, selectedFile, {
        cacheControl: "3600",
        contentType: selectedFile.type,
        upsert: false,
      });
      if (error) {
        setLocalMessage(error.message.includes("row-level security")
          ? "Only approved creators can upload. Confirm that your creator account is approved."
          : "The media upload failed. Try a smaller file or try again.");
        setUploading(false);
        return;
      }
      formData.set("mediaPath", mediaPath);
      formData.set("mediaType", selectedFile.type);
    }
    formData.delete("mediaFile");
    dispatch(formData);
    setUploading(false);
  }

  const busy = pending || uploading;

  return (
    <section className="creator-publish-panel" aria-labelledby="creator-publish-heading">
      <div>
        <p className="vixen-kicker">PUBLIC UPDATES</p>
        <h2 id="creator-publish-heading">Share with everyone.</h2>
        <p>Posts remain on your public profile. Stories leave VIXEN feeds after 24 hours. Public media can be viewed or saved by anyone with its link, and a copied link may still work afterward. Paid or member-only publishing is not active.</p>
      </div>
      <form ref={formRef} className="creator-publish-form" onSubmit={submitPublication}>
        <label htmlFor="creator-publication-kind">Update type</label>
        <select id="creator-publication-kind" name="kind" defaultValue="post">
          <option value="post">Public profile post</option>
          <option value="story">24-hour public story</option>
        </select>
        <label htmlFor="creator-publication-caption">Caption</label>
        <textarea id="creator-publication-caption" name="caption" maxLength={2000} rows={4} placeholder="Share a studio update with your audience." />
        <label htmlFor="creator-publication-media">Image or video</label>
        <input id="creator-publication-media" name="mediaFile" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" />
        <small>JPEG, PNG, WebP, MP4, or WebM · maximum 45 MiB</small>
        <label className="creator-publish-consent" htmlFor="creator-publish-consent">
          <input id="creator-publish-consent" name="consentConfirmed" type="checkbox" required />
          <span>I confirm everyone shown is 18 or older, has consented to publication, and I have the right to share this media.</span>
        </label>
        <p className={localMessage || state.status === "error" ? "is-error" : state.status === "success" ? "is-success" : ""} role={localMessage || state.status === "error" ? "alert" : "status"} aria-live="polite">
          {localMessage || (uploading ? "Uploading directly to VIXEN storage…" : pending ? "Publishing your update…" : state.message)}
        </p>
        <button type="submit" disabled={busy}>{uploading ? "Uploading…" : pending ? "Publishing…" : "Publish publicly"}</button>
      </form>
    </section>
  );
}
