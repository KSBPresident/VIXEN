import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const host = "127.0.0.1";
const port = Number(process.env.VIXEN_SMOKE_PORT || 4321);
const origin = `http://${host}:${port}`;
const startPaths = [
  "/",
  "/about",
  "/launch",
  "/events",
  "/creators",
  "/creators/nova-luxe",
  "/creators/vee-saint",
  "/creators/kira-moss",
  "/pricing",
  "/pricing?creator=Nova%20Luxe",
  "/store",
  "/sign-up?type=member",
  "/sign-up?type=creator",
  "/member-preview",
  "/member-preview/messages",
  "/member-preview/sessions",
  "/creator/studio",
  "/membership-preview/checkout?plan=bronze",
  "/discover",
  "/profile",
  "/account",
  "/account/reset-password",
  "/auth/callback",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/api/health",
];
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", host, "--port", String(port)],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
for (const stream of [child.stdout, child.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => { logs = (logs + chunk).slice(-5000); });
}
let childError;
child.on("error", (error) => { childError = error; });

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (childError) throw childError;
    if (child.exitCode !== null) throw new Error(`Next.js exited early (code ${child.exitCode}).\n${logs}`);
    try {
      const response = await fetch(`${origin}/api/health`, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) {
        const health = await response.json();
        assert.equal(health.status, "ok", "health endpoint reports ready");
        return;
      }
    } catch {
      // The production server may need a few seconds to start.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for the production server.\n${logs}`);
}

async function verifyRoute(path) {
  const url = new URL(path, origin);
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  assert.ok(response.status >= 200 && response.status < 400, `${path} returned HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const html = await response.text();
    return html;
  }
  return "";
}

try {
  await waitForServer();
  const queue = [...startPaths];
  const checked = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const url = new URL(path, origin);
    const key = `${url.pathname}${url.search}`;
    if (checked.has(key)) continue;
    checked.add(key);

    const html = await verifyRoute(path);
    if (checked.size > 120) throw new Error("Internal-link crawl exceeded 120 routes.");
    for (const match of html.matchAll(/href=["']([^"'#]+)["']/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (!href.startsWith("/")) continue;
      const linked = new URL(href, origin);
      if (linked.origin === origin && !linked.pathname.startsWith("/_next/") && !linked.pathname.startsWith("/assets/")) {
        queue.push(`${linked.pathname}${linked.search}`);
      }
    }
    console.log(`✓ HTTP ${key}`);
  }

  assert.ok(checked.size >= startPaths.length, "route smoke check covered its configured routes");
  console.log(`Production route and internal-link smoke check passed (${checked.size} unique routes).`);
} catch (error) {
  console.error(error);
  if (logs) console.error(logs);
  process.exitCode = 1;
} finally {
  if (child.exitCode === null) child.kill("SIGTERM");
}
