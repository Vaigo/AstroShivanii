// A stand-in for the GrahaAPI, to rehearse how the nightly build behaves when the API misbehaves
// (the bake code is in lib/build-api.ts, the checks in scripts/verify-baked.mjs):
//
//   node scripts/stub-api.mjs hang   [port]   accepts connections, never answers
//   node scripts/stub-api.mjs 502    [port]   answers every request with an HTML 502 (what an API redeploy looks like)
//   node scripts/stub-api.mjs test   [port]   answers 200 in test mode (fixed sample data, must never be baked)
//
// Then, in another terminal (port 8000 is the default; NEXT_PUBLIC_API_KEY must be set so a request is made):
//
//   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 NEXT_PUBLIC_API_KEY=any npm run build
//     -> finishes, the daily pages fall back to the live widget (verify-baked warns)
//   BAKE_STRICT=1 NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 NEXT_PUBLIC_API_KEY=any npm run build
//     -> FAILS with "[bake] ..." (the nightly's behaviour: yesterday's complete pages stay live)
//
// "API refuses connections" needs no stub: just run the build with nothing listening on the port.
import http from "node:http";

const mode = process.argv[2];
const port = Number(process.argv[3] ?? 8000);
if (!["hang", "502", "test"].includes(mode)) {
  console.error("usage: node scripts/stub-api.mjs <hang|502|test> [port]");
  process.exit(1);
}

const held = [];
const server = http.createServer((req, res) => {
  req.resume();
  if (mode === "hang") {
    held.push(res); // never answered, never closed
    return;
  }
  if (mode === "502") {
    res.writeHead(502, { "Content-Type": "text/html" });
    res.end("<html><body><h1>502 Bad Gateway</h1></body></html>");
    return;
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, data: {}, meta: { mode: "test" } }));
});
server.listen(port, "127.0.0.1", () => console.log(`stub API (${mode}) listening on http://localhost:${port}`));
