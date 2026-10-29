"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { createResumableUploadPath, uploadSupabaseResumable } from "@/lib/adapters/supabase-resumable-upload";
import { publishCreatorStory, type CreatorStoryActionState } from "@/app/creator/stories/actions";

const initialState: CreatorStoryActionState = { status: "idle", message: "" };
const maximumBytes = 45 * 1024 * 1024;
const mediaTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export function CreatorStoryComposer() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, dispatch, pending] = useActionState(publishCreatorStory, initialState);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadMessage("");
    const form = formRef.current;
    const file = fileRef.current?.files?.[0];
    if (!form || !file) {
      setUploadMessage("Choose a photo or video for your story.");
      return;
    }
    if (file.size > maximumBytes) {
      setUploadMessage("Each photo or video must be 45 MiB or smaller.");
      return;
    }
    const extension = mediaTypes[file.type];
    if (!extension) {
      setUploadMessage("Choose a JPEG, PNG, WebP, MP4, or WebM file.");
      return;
    }

    setUploading(true);
    const data = new FormData(form);
    try {
      const client = createClient();
      const { data: { user }, error } = await client.auth.getUser();
      if (error || !user) throw new Error("Sign in again before uploading.");
      const { path, resumeKey } = createResumableUploadPath({
        userId: user.id,
        bucket: "creator-story-media",
        kind: "story",
        extension,
        file,
      });
      await uploadSupabaseResumable({
        client,
        bucket: "creator-story-media",
        path,
        file,
        onProgress: setProgress,
      });
      window.localStorage.removeItem(resumeKey);
      data.set("mediaPath", path);
      data.set("mediaType", file.type);
    } catch (err) {
      const message = err instanceof Error ? err.message : "The upload was interrupted. Try again with the same file to resume.";
      setUploadMessage(message.includes("403") || message.toLowerCase().includes("row-level security")
        ? "Only approved creator accounts can upload story media."
        : message);
      setUploading(false);
      return;
    }

    dispatch(data);
    setUploading(false);
  }

  const busy = pending || uploading;
  return <form ref={formRef} className="creator-story-composer" onSubmit={submit}>
    <label htmlFor="creator-story-caption">Add a short caption (optional)</label>
    <textarea id="creator-story-caption" name="caption" rows={2} maxLength={500} placeholder="Add a line to your story…" />
    <label htmlFor="creator-story-media">Photo or video</label>
    <input ref={fileRef} id="creator-story-media" name="mediaFile" type="file" required accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" />
    <small>JPEG, PNG, WebP, MP4, or WebM · up to 45 MiB.</small>
    <p className="creator-story-privacy">Stories are available to signed-in members for up to 24 hours. Media is stored privately and its access link expires with the story.</p>
    <p className={uploadMessage || state.status === "error" ? "creator-story-feedback is-error" : "creator-story-feedback"} role={uploadMessage || state.status === "error" ? "alert" : "status"} aria-live="polite">
      {uploadMessage || (uploading ? `Uploading privately… ${progress}%` : state.message)}
    </p>
    <button type="submit" disabled={busy}>{uploading ? `Uploading ${progress}%` : pending ? "Publishing…" : "Share 24-hour story"}</button>
    <style>{".creator-story-composer{display:grid;gap:10px;margin:18px 0;padding:18px;border:1px solid rgba(255,61,156,.24);border-radius:12px;background:linear-gradient(145deg,#171019,#100c12)}.creator-story-composer label{font-size:13px;font-weight:650}.creator-story-composer textarea{min-height:70px;padding:12px;color:#fff;background:#09070a;border:1px solid rgba(255,255,255,.16);font:inherit;resize:vertical}.creator-story-composer input[type=file]{max-width:100%;padding:10px;background:#09070a;border:1px solid rgba(255,255,255,.16);color:#fff}.creator-story-composer small,.creator-story-privacy{color:#aaa2ad;font-size:12px;line-height:1.55}.creator-story-composer button{min-height:44px;padding:0 16px;color:#fff;background:#bd0c68;border:1px solid #ff1688;font-weight:700;cursor:pointer}.creator-story-composer button:disabled{opacity:.6}.creator-story-feedback{min-height:20px;color:#84dda7;font-size:13px}.creator-story-feedback.is-error{color:#ff9bbf}"}</style>
  </form>;
}
