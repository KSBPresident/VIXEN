import assert from "node:assert/strict";
import { test } from "node:test";
import creatorPost from "../.test-build/lib/kernel/creator-post.js";

const { validateCreatorPublication, creatorPostMaxMediaBytes } = creatorPost;

test("allows public text posts and supported media under the 45 MiB cap", () => {
  assert.equal(validateCreatorPublication({ kind: "post", caption: "A studio note", mediaType: null, mediaSize: null }), null);
  assert.equal(validateCreatorPublication({ kind: "post", caption: "", mediaType: "image/webp", mediaSize: 100 }), null);
  assert.equal(validateCreatorPublication({ kind: "post", caption: "", mediaType: "video/mp4", mediaSize: creatorPostMaxMediaBytes }), null);
});

test("requires media for stories and content for every publication", () => {
  assert.match(validateCreatorPublication({ kind: "story", caption: "A moment", mediaType: null, mediaSize: null }) ?? "", /Stories need/);
  assert.match(validateCreatorPublication({ kind: "post", caption: " ", mediaType: null, mediaSize: null }) ?? "", /Add a caption/);
});

test("rejects unsupported files, empty files, and files above 45 MiB", () => {
  assert.match(validateCreatorPublication({ kind: "post", caption: "", mediaType: "image/gif", mediaSize: 100 }) ?? "", /JPEG/);
  assert.match(validateCreatorPublication({ kind: "post", caption: "", mediaType: "video/mp4", mediaSize: 0 }) ?? "", /valid/);
  assert.match(validateCreatorPublication({ kind: "post", caption: "", mediaType: "video/mp4", mediaSize: creatorPostMaxMediaBytes + 1 }) ?? "", /45 MiB/);
});

test("rejects invalid kinds and overlong captions", () => {
  assert.match(validateCreatorPublication({ kind: "live", caption: "x", mediaType: null, mediaSize: null }) ?? "", /post or a 24-hour story/);
  assert.match(validateCreatorPublication({ kind: "post", caption: "x".repeat(2001), mediaType: null, mediaSize: null }) ?? "", /2,000/);
});
