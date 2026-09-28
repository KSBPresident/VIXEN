export function GET() {
  return Response.json({ status: "ok", service: "vixen-web" }, { status: 200 });
}
