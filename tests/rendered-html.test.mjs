import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the authenticated entry point", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/i);
  const html = await response.text();
  assert.match(html, /Bar Flow/);
  assert.match(html, /auth-shell/);
  assert.match(html, /Carregando seu espa/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("keeps the product identity and accessibility basics", async () => {
  const [page, layout, css] = await Promise.all([
    import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/page.tsx", import.meta.url), "utf8")),
    import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/layout.tsx", import.meta.url), "utf8")),
    import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/globals.css", import.meta.url), "utf8")),
  ]);
  assert.match(page, /aria-label="Navegação principal"/);
  assert.match(page, /aria-label="Notificações"/);
  assert.match(layout, /lang="pt-BR"/);
  assert.match(layout, /Bar Flow/);
  assert.match(css, /prefers|@media\(max-width/);
});
