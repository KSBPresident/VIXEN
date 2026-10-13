"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileActionState } from "@/app/account/actions";

const initialState: ProfileActionState = { status: "idle", message: "" };

type ProfileEditorProps = {
  username: string;
  displayName: string;
};

export function ProfileEditor({ username, displayName }: ProfileEditorProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <section className="vixen-profile-editor" aria-labelledby="profile-editor-heading">
      <div className="vixen-profile-editor-heading">
        <p className="vixen-kicker">ACCOUNT DETAILS</p>
        <h2 id="profile-editor-heading">Your profile</h2>
        <p>Choose the name and @username you want to use on VIXEN. Approved creator profiles can be found by username.</p>
      </div>
      <form action={formAction} className="vixen-profile-form">
        <label htmlFor="vixen-profile-username">Username</label>
        <div className="vixen-profile-username-field">
          <span aria-hidden="true">@</span>
          <input
            id="vixen-profile-username"
            name="username"
            type="text"
            autoComplete="username"
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_.]{3,30}"
            required
            defaultValue={username}
            aria-describedby="vixen-profile-username-help"
          />
        </div>
        <small id="vixen-profile-username-help">3–30 letters, numbers, periods, or underscores.</small>
        <label htmlFor="vixen-profile-display-name">Display name</label>
        <input
          id="vixen-profile-display-name"
          name="displayName"
          type="text"
          autoComplete="name"
          maxLength={80}
          defaultValue={displayName}
          placeholder="How you want to appear"
        />
        <div className="vixen-profile-form-footer">
          <p className={state.status === "error" ? "is-error" : state.status === "success" ? "is-success" : ""} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
            {pending ? "Saving your profile…" : state.message}
          </p>
          <button type="submit" disabled={pending}>{pending ? "Saving…" : "Save profile"}</button>
        </div>
      </form>
    </section>
  );
}
