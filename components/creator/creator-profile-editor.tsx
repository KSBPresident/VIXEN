"use client";

import Image from "next/image";
import { useActionState, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateCreatorProfile, type CreatorProfileActionState } from "@/app/creator/profile/actions";

const initialState: CreatorProfileActionState = { status: "idle", message: "" };
const maximumImageBytes = 45 * 1024 * 1024;
const supportedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type CreatorProfileEditorProps = {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
};

export function CreatorProfileEditor({
  username,
  displayName,
  bio,
  avatarUrl,
  coverUrl,
}: CreatorProfileEditorProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch, pending] = useActionState(updateCreatorProfile, initialState);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadMessage("");
    setUploading(true);
    const form = formRef.current;
    if (!form) {
      setUploadMessage("The profile form is unavailable. Please reload and try again.");
      setUploading(false);
      return;
    }

    const formData = new FormData(form);
    const avatarFile = formData.get("avatarFile");
    const coverFile = formData.get("coverFile");
    const uploadTasks = [
      { kind: "avatar" as const, field: "avatarPath", file: avatarFile instanceof File ? avatarFile : null },
      { kind: "cover" as const, field: "coverPath", file: coverFile instanceof File ? coverFile : null },
    ].filter((task) => task.file && task.file.size > 0);

    for (const task of uploadTasks) {
      if (!task.file) continue;
      if (task.file.size > maximumImageBytes) {
        setUploadMessage("Each image must be 45 MiB or smaller.");
        setUploading(false);
        return;
      }
      if (!supportedImageTypes[task.file.type]) {
        setUploadMessage("Choose a JPEG, PNG, or WebP image.");
        setUploading(false);
        return;
      }
    }

    const uploadedPaths: string[] = [];
    if (uploadTasks.length) {
      const client = createClient();
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError || !user) {
        setUploadMessage("Sign in again before uploading profile images.");
        setUploading(false);
        return;
      }

      for (const task of uploadTasks) {
        if (!task.file) continue;
        const extension = supportedImageTypes[task.file.type];
        const path = `${user.id}/${task.kind}-${crypto.randomUUID()}.${extension}`;
        const { error } = await client.storage
          .from("creator-profile-media")
          .upload(path, task.file, {
            cacheControl: "3600",
            contentType: task.file.type,
            upsert: false,
          });
        if (error) {
          if (uploadedPaths.length) {
            await client.storage.from("creator-profile-media").remove(uploadedPaths);
          }
          setUploadMessage(error.message.includes("row-level security")
            ? "Only approved creator accounts can upload profile images."
            : "The image upload failed. Please try a smaller image or try again.");
          setUploading(false);
          return;
        }
        uploadedPaths.push(path);
        formData.set(task.field, path);
      }
    }

    formData.delete("avatarFile");
    formData.delete("coverFile");
    dispatch(formData);
    setUploading(false);
  }

  const busy = pending || uploading;

  return (
    <section className="vixen-profile-editor creator-profile-editor" aria-labelledby="creator-profile-editor-heading">
      <div className="vixen-profile-editor-heading">
        <p className="vixen-kicker">PUBLIC CREATOR PROFILE</p>
        <h2 id="creator-profile-editor-heading">Your page, your identity.</h2>
        <p>Update the profile members see. Your username is searchable; your bio is limited to 500 characters.</p>
      </div>
      <form ref={formRef} className="vixen-profile-form" onSubmit={submitProfile}>
        <label htmlFor="creator-profile-username">Username</label>
        <div className="vixen-profile-username-field">
          <span aria-hidden="true">@</span>
          <input id="creator-profile-username" name="username" autoComplete="username" minLength={3} maxLength={30} pattern="[A-Za-z0-9_.]{3,30}" required defaultValue={username} />
        </div>
        <label htmlFor="creator-profile-display-name">Display name</label>
        <input id="creator-profile-display-name" name="displayName" autoComplete="name" minLength={1} maxLength={80} required defaultValue={displayName} />
        <label htmlFor="creator-profile-bio">About you</label>
        <textarea id="creator-profile-bio" name="bio" maxLength={500} rows={5} defaultValue={bio} placeholder="Tell members what you create and what they can expect." />
        <small>Keep your bio respectful and within VIXEN’s creator policies.</small>

        <div className="creator-profile-image-grid">
          <div>
            <label htmlFor="creator-profile-avatar">Profile image</label>
            {avatarUrl && <Image className="creator-profile-image-preview" src={avatarUrl} alt="Current public profile image" width={96} height={96} unoptimized />}
            <input id="creator-profile-avatar" name="avatarFile" type="file" accept="image/jpeg,image/png,image/webp" />
            <small>JPEG, PNG, or WebP · up to 45 MiB</small>
          </div>
          <div>
            <label htmlFor="creator-profile-cover">Cover image</label>
            {coverUrl && <Image className="creator-profile-cover-preview" src={coverUrl} alt="Current public cover image" width={240} height={96} unoptimized />}
            <input id="creator-profile-cover" name="coverFile" type="file" accept="image/jpeg,image/png,image/webp" />
            <small>JPEG, PNG, or WebP · up to 45 MiB</small>
          </div>
        </div>

        <div className="vixen-profile-form-footer">
          <p className={uploadMessage || state.status === "error" ? "is-error" : state.status === "success" ? "is-success" : ""} role={uploadMessage || state.status === "error" ? "alert" : "status"} aria-live="polite">
            {uploadMessage || (uploading ? "Uploading directly to VIXEN storage…" : pending ? "Saving your profile…" : state.message)}
          </p>
          <button type="submit" disabled={busy}>{uploading ? "Uploading…" : pending ? "Saving…" : "Save public profile"}</button>
        </div>
      </form>
    </section>
  );
}
