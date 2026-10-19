"use client";

import { Upload } from "tus-js-client";
import type { SupabaseClient } from "@supabase/supabase-js";

const maximumBytes = 45 * 1024 * 1024;
const chunkSize = 6 * 1024 * 1024;

type UploadPathOptions = {
  userId: string;
  bucket: string;
  kind: "avatar" | "cover" | "post" | "story";
  extension: string;
  file: File;
};

type UploadOptions = {
  client: SupabaseClient;
  bucket: string;
  path: string;
  file: File;
  onProgress?: (percentage: number) => void;
};

export function createResumableUploadPath({ userId, bucket, kind, extension, file }: UploadPathOptions) {
  const resumeKey = [
    "vixen",
    "supabase-upload",
    userId,
    bucket,
    kind,
    file.name,
    file.size,
    file.lastModified,
    file.type,
  ].join(":");
  const validPath = new RegExp("^" + userId + "/" + kind + "-[0-9a-f-]{36}\\." + extension + "$", "i");
  let path = "";
  try {
    const storedPath = window.localStorage.getItem(resumeKey);
    if (storedPath && validPath.test(storedPath)) path = storedPath;
    if (!path) {
      path = userId + "/" + kind + "-" + crypto.randomUUID() + "." + extension;
      window.localStorage.setItem(resumeKey, path);
    }
  } catch {
    path = userId + "/" + kind + "-" + crypto.randomUUID() + "." + extension;
  }
  return { path, resumeKey };
}

export async function uploadSupabaseResumable({
  client,
  bucket,
  path,
  file,
  onProgress,
}: UploadOptions): Promise<void> {
  if (file.size > maximumBytes) throw new Error("Each file must be 45 MiB or smaller.");
  const { data: { session }, error: sessionError } = await client.auth.getSession();
  if (sessionError || !session?.access_token) throw new Error("Sign in again before uploading.");

  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!configuredUrl) throw new Error("Supabase Storage is not configured.");
  const configured = new URL(configuredUrl);
  const endpointHost = configured.hostname.endsWith(".supabase.co")
    ? configured.hostname.slice(0, -".supabase.co".length) + ".storage.supabase.co"
    : configured.hostname;
  const endpoint = configured.protocol + "//" + endpointHost + "/storage/v1/upload/resumable";
  const fingerprint = "vixen:" + endpoint + ":" + bucket + ":" + path;

  await new Promise<void>((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize,
      headers: { Authorization: "Bearer " + session.access_token },
      metadata: {
        bucketName: bucket,
        objectName: path,
        contentType: file.type,
        cacheControl: "3600",
      },
      fingerprint: () => Promise.resolve(fingerprint),
      removeFingerprintOnSuccess: true,
      uploadDataDuringCreation: true,
      onError: reject,
      onProgress(bytesUploaded, bytesTotal) {
        onProgress?.(bytesTotal ? Math.round((bytesUploaded / bytesTotal) * 100) : 0);
      },
      onSuccess: () => resolve(),
    });

    void upload.findPreviousUploads().then((previousUploads) => {
      const priorUpload = previousUploads.find((item) =>
        item.metadata.bucketName === bucket && item.metadata.objectName === path,
      );
      if (priorUpload) upload.resumeFromPreviousUpload(priorUpload);
      upload.start();
    }).catch(reject);
  });
}
