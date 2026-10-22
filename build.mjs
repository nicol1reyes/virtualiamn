// Virtualiamn — builds the static site in /dist from /content.
// Run: npm run build   (Netlify runs this automatically on every change)
import fs from "node:fs";
import path from "node:path";
import { render } from "./render.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, "dist");
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const jsonFiles = dir => fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith(".json"));

const content = {
  settings: read("content/settings.json"),
  theme: fs.existsSync(path.join(ROOT, "content/theme.json")) ? read("content/theme.json") : null,
  home: read("content/home.json"),
  ui: read("templates/ui.json"),
  services: jsonFiles("content/services").map(f => ({ slug: f.replace(/\.json$/, ""), ...read(`content/services/${f}`) })),
  pages: Object.fromEntries(jsonFiles("content/pages").map(f => [f.replace(/\.json$/, ""), read(`content/pages/${f}`)])),
  posts: jsonFiles("content/posts").map(f => ({ slug: f.replace(/\.json$/, ""), ...read(`content/posts/${f}`) })),
  templates: {
    index: fs.readFileSync(path.join(ROOT, "templates/index.html"), "utf8"),
    siteJs: fs.readFileSync(path.join(ROOT, "templates/site.js"), "utf8"),
  },
};

const files = render(content);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(ROOT, "static"), OUT, { recursive: true });
fs.cpSync(path.join(ROOT, "admin"), path.join(OUT, "admin"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "render.mjs"), path.join(OUT, "admin", "render.mjs"));
for (const [name, html] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(path.join(OUT, name)), { recursive: true });
  fs.writeFileSync(path.join(OUT, name), html);
}
console.log(`Built ${Object.keys(files).length} pages → dist/`);
