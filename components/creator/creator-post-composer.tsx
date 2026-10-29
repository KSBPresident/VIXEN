"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { createResumableUploadPath, uploadSupabaseResumable } from "@/lib/adapters/supabase-resumable-upload";
import { createCreatorPost, type CreatorPostActionState } from "@/app/creator/posts/actions";

const initialState: CreatorPostActionState = { status: "idle", message: "" };
const maximumBytes = 45 * 1024 * 1024;
const mediaTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export function CreatorPostComposer() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, dispatch, pending] = useActionState(createCreatorPost, initialState);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadMessage("");
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const file = fileRef.current?.files?.[0];
    if (file && file.size > maximumBytes) {
      setUploadMessage("Each photo or video must be 45 MiB or smaller.");
      return;
    }
    const extension = file ? mediaTypes[file.type] : undefined;
    if (file && !extension) {
      setUploadMessage("Choose a JPEG, PNG, WebP, MP4, or WebM file.");
      return;
    }

    if (file && extension) {
      setUploading(true);
      try {
        const client = createClient();
        const { data: { user }, error } = await client.auth.getUser();
        if (error || !user) throw new Error("Sign in again before uploading.");
        const { path, resumeKey } = createResumableUploadPath({
          userId: user.id,
          bucket: "creator-feed-media",
          kind: "post",
          extension,
          file,
        });
        await uploadSupabaseResumable({
          client,
          bucket: "creator-feed-media",
          path,
          file,
          onProgress: setProgress,
        });
        window.localStorage.removeItem(resumeKey);
        data.set("mediaPath", path);
        data.set("mediaType", file.type);
      } catch (err) {
        const message = err instanceof Error ? err.message : "The upload was interrupted. Try again with the same file to resume.";
        setUploadMessage(message.includes("403") || message.includes("row-level security")
          ? "Only approved creator accounts can upload feed media."
          : message);
        setUploading(false);
        return;
      }
    }
    data.delete("mediaFile");
    dispatch(data);
    setUploading(false);
  }

  const busy = pending || uploading;
  return <form ref={formRef} className="creator-post-composer" onSubmit={submit}>
    <label htmlFor="creator-post-caption">Write an update</label>
    <textarea id="creator-post-caption" name="caption" rows={4} maxLength={2000} placeholder="Share an update with your audience…" />
    <label htmlFor="creator-post-media">Add a photo or video</label>
    <input ref={fileRef} id="creator-post-media" name="mediaFile" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" />
    <small>JPEG, PNG, WebP, MP4, or WebM · up to 45 MiB · uploads go directly to VIXEN storage.</small>
    <p className={uploadMessage || state.status === "error" ? "creator-post-feedback is-error" : "creator-post-feedback"} role={uploadMessage || state.status === "error" ? "alert" : "status"} aria-live="polite">
      {uploadMessage || (uploading ? `Uploading directly to secure storage… ${progress}%` : state.message)}
    </p>
    <button type="submit" disabled={busy}>{uploading ? `Uploading ${progress}%` : pending ? "Publishing…" : "Publish public post"}</button>
    <p className="creator-post-access-note">Feed posts are public. Paid or member-only access controls are not available yet, so don’t publish content that should be restricted to paying members.</p>
    <style>{".creator-post-composer{display:grid;gap:10px;margin:18px 0;padding:18px;border:1px solid rgba(255,255,255,.14);background:#100d12}.creator-post-composer label{font-size:13px;font-weight:650}.creator-post-composer textarea{min-height:110px;padding:12px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16);font:inherit;resize:vertical}.creator-post-composer input[type=file]{max-width:100%;padding:10px;background:#09070a;border:1px solid rgba(255,255,255,.16);color:#fff}.creator-post-composer small,.creator-post-access-note{color:#aaa2ad;font-size:12px;line-height:1.55}.creator-post-composer button{min-height:44px;padding:0 16px;color:#fff;background:#bd0c68;border:1px solid #ff1688;font-weight:700;cursor:pointer}.creator-post-composer button:disabled{opacity:.6}.creator-post-feedback{min-height:20px;color:#84dda7;font-size:13px}.creator-post-feedback.is-error{color:#ff9bbf}"}</style>
  </form>;
}
