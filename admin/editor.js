// Virtualiamn — visual editor (live preview, click-to-edit, publish to GitHub → Netlify)
import { render, BUILTINS, DEFAULT_LAYOUTS, BLOCK_TYPES, pageKind } from "./render.mjs";
import { SCHEMAS, homeKey, HOME_IMAGES } from "./schema.js";

const REPO = "nicol1reyes/virtualiamn";
const BRANCH = "main";
const DEV = new URLSearchParams(location.search).has("dev"); // local testing without GitHub

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};

/* ---------------------------------------------------------------- icons */
const ICONS = {
  page: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  "chevron-down": '<path d="M6 9l6 6 6-6"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  desktop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  cards: '<rect x="3" y="5" width="8" height="14" rx="1.5"/><rect x="13" y="5" width="8" height="14" rx="1.5"/>',
  badge: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h3"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  building: '<path d="M4 21V5l8-2v18M12 8l8 2v11M4 21h16M8 8v.01M8 12v.01M8 16v.01M16 13v.01M16 17v.01"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  quote: '<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5"/><path d="M16 5.2a3 3 0 010 5.6M18 14.8c1.6.8 2.7 2.6 3 5.2"/>',
  text: '<path d="M4 6V4h16v2M12 4v16M9 20h6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  logout: '<path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M10 16l4-4-4-4M14 12H4"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  post: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  grip: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off": '<path d="M3 3l18 18M10.6 5.1A10.9 10.9 0 0112 5c6.4 0 10 7 10 7a17.8 17.8 0 01-3.2 4.1M6.6 6.6A17.6 17.6 0 002 12s3.6 7 10 7a10 10 0 005.4-1.6M9.9 9.9a3 3 0 004.2 4.2"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',
};
const ic = name => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
const paintIcons = (root = document) => $$("[data-ic]", root).forEach(el => { el.innerHTML = ic(el.dataset.ic); });
const escHtml = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------------------------------------------------------------- state */
const S = {
  token: null,
  files: {},        // repo path → { data, original }
  uploads: {},      // repo path → { base64, dataUrl, publicPath }
  imageCache: {},   // public path → data URL (shows new images before Netlify finishes)
  deleted: new Set(),
  templates: null,
  lang: "es",
  device: "desktop",
  page: "home",
  section: null,
  openItems: {},    // "fieldKey" → index of expanded list item
};

/* ---------------------------------------------------------------- utils */
const toast = (msg, kind = "") => {
  const t = $("#toast"); t.textContent = msg; t.className = "toast " + kind; t.hidden = false;
  clearTimeout(toast.tm); toast.tm = setTimeout(() => (t.hidden = true), kind === "error" ? 6000 : 3200);
};
const decode64 = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), c => c.charCodeAt(0)));
const slugify = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "archivo";
const getPath = (o, p) => p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o);
function setPath(o, p, v) {
  const ks = p.split(".");
  let cur = o;
  ks.slice(0, -1).forEach((k, i) => {
    if (cur[k] == null) cur[k] = /^\d+$/.test(ks[i + 1]) ? [] : {};
    cur = cur[k];
  });
  cur[ks.at(-1)] = v;
}
const clone = v => JSON.parse(JSON.stringify(v ?? null));
const serialize = data => JSON.stringify(data, null, 2) + "\n";

/* ---------------------------------------------------------------- pages */
function pageFile(id) {
  if (id === "home") return "content/home.json";
  if (id === "settings") return "content/settings.json";
  return `content/${id}.json`; // services/x, pages/x, posts/x
}
function pageSchema(id) {
  if (id === "home") return SCHEMAS.home;
  if (id === "settings") return SCHEMAS.settings;
  const [kind, slug] = id.split("/");
  if (kind === "services") return SCHEMAS.service;
  if (kind === "posts") return SCHEMAS.post;
  if (slug === "privacidad" || slug === "terminos") return SCHEMAS.legal;
  return SCHEMAS[slug];
}
function pagePreview(id) {
  if (id === "home" || id === "settings") return "index.html";
  const [kind, slug] = id.split("/");
  if (kind === "posts") return `blog/${slug}.html`;
  return `${slug}.html`;
}
const fileData = id => S.files[pageFile(id)]?.data;
function pageName(id) {
  if (id === "home") return "Inicio";
  if (id === "settings") return "Datos de contacto y redes";
  const d = fileData(id);
  const [kind, slug] = id.split("/");
  if (kind === "services") return d?.es?.name || slug;
  if (kind === "posts") return d?.es?.title || slug;
  return { nosotros: "Nosotros", casos: "Casos de éxito", blog: "Blog", empleos: "Empleos", privacidad: "Política de privacidad", terminos: "Términos y condiciones" }[slug] || slug;
}
const idsUnder = prefix => Object.keys(S.files).filter(p => p.startsWith(`content/${prefix}/`)).map(p => p.slice(8, -5));
function serviceIds() {
  return idsUnder("services").sort((a, b) => (fileData(a)?.es?.order ?? 99) - (fileData(b)?.es?.order ?? 99));
}
function pageFromHref(href) {
  let path;
  try { path = new URL(href, location.origin).pathname; } catch { return null; }
  if (path === "/" || path === "/index.html") return "home";
  let m;
  if ((m = path.match(/^\/blog\/([^/]+)\.html$/))) return S.files[`content/posts/${m[1]}.json`] ? `posts/${m[1]}` : null;
  if ((m = path.match(/^\/([^/]+)\.html$/))) {
    if (S.files[`content/services/${m[1]}.json`]) return `services/${m[1]}`;
    if (S.files[`content/pages/${m[1]}.json`]) return `pages/${m[1]}`;
  }
  return null;
}

/* ---------------------------------------------------------------- GitHub */
async function gh(method, path, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${S.token}`, Accept: "application/vnd.github+json", ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`GitHub ${res.status}`);
    err.status = res.status;
    try { err.detail = (await res.json()).message; } catch {}
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

function netlifyLogin() {
  return new Promise((resolve, reject) => {
    const base = "https://api.netlify.com";
    const url = `${base}/auth?provider=github&site_id=${encodeURIComponent(location.hostname)}&scope=repo`;
    const w = 960, h = 600;
    const win = window.open(url, "Netlify Authorization", `width=${w},height=${h},top=${(screen.height - h) / 2},left=${(screen.width - w) / 2}`);
    if (!win) { reject(new Error("popup")); return; }
    const onAuth = e => {
      if (e.origin !== base) return;
      const m = String(e.data).match(/^authorization:github:(success|error):(.+)$/s);
      if (!m) return;
      window.removeEventListener("message", onAuth);
      try { win.close(); } catch {}
      const payload = JSON.parse(m[2]);
      m[1] === "success" ? resolve(payload.token) : reject(new Error(payload.message || "error"));
    };
    const onHandshake = e => {
      if (e.origin !== base || e.data !== "authorizing:github") return;
      window.removeEventListener("message", onHandshake);
      window.addEventListener("message", onAuth);
      win.postMessage(e.data, e.origin);
    };
    window.addEventListener("message", onHandshake);
  });
}

async function loadRepo() {
  if (DEV) {
    const files = await (await fetch("./dev-files.json")).json();
    return files;
  }
  const tree = await gh("GET", `/repos/${REPO}/git/trees/${BRANCH}?recursive=1`);
  const want = tree.tree.filter(n => n.type === "blob" && (
    (n.path.startsWith("content/") && n.path.endsWith(".json")) ||
    ["templates/index.html", "templates/site.js", "templates/ui.json"].includes(n.path)));
  const out = {};
  await Promise.all(want.map(async n => {
    const blob = await gh("GET", `/repos/${REPO}/git/blobs/${n.sha}`);
    out[n.path] = decode64(blob.content);
  }));
  return out;
}

/* ---------------------------------------------------------------- boot */
async function boot() {
  paintIcons();
  if (!DEV) {
    S.token = store.get("v_editor_token");
    if (!S.token) return showLogin();
  }
  $("#login").hidden = true;
  $("#loading").hidden = false;
  try {
    const raw = await loadRepo();
    S.templates = { index: raw["templates/index.html"], siteJs: raw["templates/site.js"], ui: JSON.parse(raw["templates/ui.json"]) };
    for (const [p, txt] of Object.entries(raw)) {
      if (p.startsWith("content/")) S.files[p] = { data: JSON.parse(txt), original: txt.endsWith("\n") ? txt : txt + "\n" };
    }
    for (const f of Object.values(S.files)) f.original = serialize(JSON.parse(f.original));
    if (!DEV) {
      const user = await gh("GET", "/user");
      $("#user-img").src = user.avatar_url; $("#user-name").textContent = user.name || user.login;
    } else { $("#user-name").textContent = "Modo prueba"; }
  } catch (e) {
    $("#loading").hidden = true;
    if (e.status === 401) { store.set("v_editor_token", null); return showLogin("Tu sesión expiró. Vuelve a iniciar sesión."); }
    if (e.status === 404) return showLogin(`No encontramos el repositorio ${REPO} o tu cuenta no tiene acceso.`);
    return showLogin("No pudimos cargar el sitio. Revisa tu conexión e inténtalo de nuevo.");
  }
  const saved = store.get("v_editor_page");
  if (saved && (saved === "home" || saved === "settings" || S.files[pageFile(saved)])) S.page = saved;
  $("#loading").hidden = true;
  $("#app").hidden = false;
  wireTopbar();
  renderSidebar();
  renderPreview(true);
  updateStatus();
}

function showLogin(msg) {
  $("#app").hidden = true; $("#loading").hidden = true; $("#login").hidden = false;
  const m = $("#login-msg"); m.hidden = !msg; m.textContent = msg || "";
}
$("#login-btn").addEventListener("click", async () => {
  try {
    S.token = await netlifyLogin();
    store.set("v_editor_token", S.token);
    boot();
  } catch (e) {
    showLogin(e.message === "popup" ? "Tu navegador bloqueó la ventana de inicio de sesión. Permite ventanas emergentes para este sitio e inténtalo otra vez." : "No se pudo iniciar sesión. Inténtalo de nuevo.");
  }
});

/* ---------------------------------------------------------------- top bar */
function wireTopbar() {
  if (wireTopbar.done) return; wireTopbar.done = true;
  const pageBtn = $("#page-btn"), pageMenu = $("#page-menu");
  const userBtn = $("#user-btn"), userMenu = $("#user-menu");
  const closeMenus = () => { pageMenu.hidden = userMenu.hidden = true; pageBtn.setAttribute("aria-expanded", "false"); userBtn.setAttribute("aria-expanded", "false"); };
  pageBtn.addEventListener("click", e => { e.stopPropagation(); const open = pageMenu.hidden; closeMenus(); if (open) { buildPageMenu(); pageMenu.hidden = false; pageBtn.setAttribute("aria-expanded", "true"); } });
  userBtn.addEventListener("click", e => { e.stopPropagation(); const open = userMenu.hidden; closeMenus(); if (open) { userMenu.hidden = false; userBtn.setAttribute("aria-expanded", "true"); } });
  document.addEventListener("click", e => { if (!e.target.closest(".picker-menu")) closeMenus(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenus(); });

  $$("[data-lang]").forEach(b => b.addEventListener("click", () => {
    S.lang = b.dataset.lang;
    $$("[data-lang]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    renderSidebar(); renderPreview();
  }));
  $$("[data-device]").forEach(b => b.addEventListener("click", () => {
    S.device = b.dataset.device;
    $$("[data-device]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $("#frame-wrap").classList.toggle("mobile", S.device === "mobile");
  }));
  $("#publish-btn").addEventListener("click", publish);
  $("#discard-btn").addEventListener("click", discard);
  $("#logout-btn").addEventListener("click", () => {
    if (changes().length && !window.confirm("Tienes cambios sin publicar. ¿Cerrar sesión de todas formas?")) return;
    store.set("v_editor_token", null); location.reload();
  });
  addEventListener("beforeunload", e => { if (changes().length) { e.preventDefault(); e.returnValue = ""; } });
  addEventListener("message", onFrameMessage);
}

function buildPageMenu() {
  const menu = $("#page-menu");
  const dirty = new Set(changes().map(c => c.page));
  const item = (id, icon) => `<button class="menu-item" role="option" data-page="${escHtml(id)}" aria-selected="${id === S.page}">${ic(icon)}<span>${escHtml(pageName(id))}</span>${dirty.has(id) ? '<span class="dot" title="Cambios sin publicar"></span>' : ""}</button>`;
  const posts = idsUnder("posts").sort((a, b) => String(fileData(b)?.es?.date).localeCompare(String(fileData(a)?.es?.date)));
  menu.innerHTML = [
    item("home", "home"),
    `<div class="menu-group">Servicios</div>`, ...serviceIds().map(id => item(id, "page")),
    `<div class="menu-group">Páginas</div>`, ...["nosotros", "casos", "empleos", "blog", "privacidad", "terminos"].filter(s => S.files[`content/pages/${s}.json`]).map(s => item(`pages/${s}`, "page")),
    `<div class="menu-group">Artículos del blog</div>`, ...posts.map(id => item(id, "post")),
    `<div class="menu-sep"></div>`, item("settings", "settings"),
  ].join("");
  $$("[data-page]", menu).forEach(b => b.addEventListener("click", () => { menu.hidden = true; goPage(b.dataset.page); }));
}

function goPage(id, sectionId = null) {
  if (id !== S.page) { S.page = id; S.openItems = {}; store.set("v_editor_page", id); }
  S.section = sectionId;
  renderSidebar();
  renderPreview(true);
}

/* ---------------------------------------------------------------- sections & layout */
const HOME_LAYOUT_SECTION = { trust: "trust", programs: "services", facilities: "studio", stats: "stats", testimonials: "testimonials" };
const DUPLICABLE = ["grid", "steps", "chips", "faq", "statement", "imageText", "cta"];
const titleTextFields = [{ k: "title", t: "text", l: "Título" }, { k: "text", t: "textarea", l: "Texto" }];
const BLOCK_ICON = { grid: "cards", steps: "list", chips: "tag", faq: "quote", statement: "text", imageText: "image", cta: "flag" };

function blockFields(id, type) {
  const b = `blocks.${id}`;
  const head = [{ k: `${b}.eyebrow`, t: "text", l: "Etiqueta" }, { k: `${b}.title`, t: "textarea", l: "Título", lines: true }];
  const list = (l, itemTitle, fields) => ({ k: `${b}.items`, t: "list", l, itemTitle, fields });
  switch (type) {
    case "grid": return [...head, list("Tarjeta", "title", titleTextFields)];
    case "steps": return [...head, list("Paso", "title", titleTextFields)];
    case "chips": return [...head, list("Etiqueta", "text", [{ k: "text", t: "text", l: "Texto" }])];
    case "faq": return [...head, list("Pregunta", "question", [{ k: "question", t: "text", l: "Pregunta" }, { k: "answer", t: "textarea", l: "Respuesta" }])];
    case "statement": return [head[0], { k: `${b}.text`, t: "textarea", l: "Texto" }];
    case "imageText": return [...head, { k: `${b}.text`, t: "textarea", l: "Texto" }, { k: `${b}.image`, t: "image", l: "Imagen", shared: true },
      { k: `${b}.side`, t: "select", l: "Posición de la imagen", shared: true, options: [{ value: "left", label: "Izquierda" }, { value: "right", label: "Derecha" }] }];
    case "cta": return [{ k: `${b}.title`, t: "textarea", l: "Título", lines: true }, { k: `${b}.text`, t: "textarea", l: "Texto" }, { k: `${b}.button`, t: "text", l: "Texto del botón" }];
    default: return [];
  }
}
function blockDefaults(type) {
  const two = (es, en) => ({ es, en });
  const items = (n, mk) => two(Array.from({ length: n }, (_, i) => mk("es", i)), Array.from({ length: n }, (_, i) => mk("en", i)));
  const tt = (lang, i) => (lang === "es" ? { title: `Elemento ${i + 1}`, text: "Describe este punto en una o dos frases." } : { title: `Item ${i + 1}`, text: "Describe this point in one or two sentences." });
  const base = { eyebrow: two("Nueva sección", "New section"), title: two("Título de\nla sección", "Section\ntitle") };
  switch (type) {
    case "grid": return { ...base, items: items(3, tt) };
    case "steps": return { ...base, items: items(3, tt) };
    case "chips": return { ...base, items: items(3, (l, i) => ({ text: l === "es" ? `Etiqueta ${i + 1}` : `Tag ${i + 1}` })) };
    case "faq": return { ...base, items: items(3, (l, i) => (l === "es" ? { question: `¿Pregunta ${i + 1}?`, answer: "Escribe aquí la respuesta." } : { question: `Question ${i + 1}?`, answer: "Write the answer here." })) };
    case "statement": return { eyebrow: base.eyebrow, text: two("Escribe aquí una frase importante para tu marca.", "Write an important statement for your brand here.") };
    case "imageText": return { ...base, text: two("Cuenta aquí la historia o el detalle que acompaña a la imagen.", "Tell the story or detail that goes with the image here."), image: "/assets/uploads/swirl.webp", side: "left" };
    case "cta": return { title: two("¿Listos para\nempezar?", "Ready to\nget started?"), text: two("Agenda una llamada y armamos juntos tu plan.", "Book a call and we'll build your plan together."), button: two("Agenda una llamada", "Book a call") };
    default: return {};
  }
}
function getLayout() {
  const d = fileData(S.page);
  const kind = pageKind(S.page);
  return clone(d?.es?.layout || DEFAULT_LAYOUTS[kind] || []);
}
function setLayout(lay) {
  const d = fileData(S.page);
  d.es ??= {}; d.en ??= {};
  d.es.layout = clone(lay); d.en.layout = clone(lay);
  changed();
}
const builtinOf = id => BUILTINS[pageKind(S.page)]?.[id];
function customType(id) { return fileData(S.page)?.es?.blocks?.[id]?.type; }
function sectionMeta(entry) {
  const b = builtinOf(entry.id);
  const schema = pageSchema(S.page);
  if (b) {
    const sid = S.page === "home" ? HOME_LAYOUT_SECTION[entry.id] : entry.id;
    const sec = schema?.sections.find(s => s.id === sid);
    return { id: entry.id, label: b.label, icon: sec?.icon || BLOCK_ICON[b.type] || "list", section: sec || null, type: b.type, builtin: true };
  }
  const type = customType(entry.id) || entry.type;
  const t = BLOCK_TYPES[type];
  const title = String(fileData(S.page)?.es?.blocks?.[entry.id]?.title || fileData(S.page)?.es?.blocks?.[entry.id]?.eyebrow || "").split("\n").join(" ");
  return { id: entry.id, label: (t?.label || "Sección") + (title ? ` · ${title}` : ""), icon: BLOCK_ICON[type] || "list", type, builtin: false,
    section: { id: entry.id, icon: BLOCK_ICON[type], label: t?.label || "Sección", fields: blockFields(entry.id, type) } };
}
// all sections that can be opened on this page (fixed + layout + custom)
function findSection(id) {
  const schema = pageSchema(S.page);
  const direct = schema?.sections.find(s => s.id === id);
  if (direct) return direct;
  if (S.page === "home" && HOME_LAYOUT_SECTION[id]) return schema.sections.find(s => s.id === HOME_LAYOUT_SECTION[id]);
  if (fileData(S.page)?.es?.blocks?.[id]) return sectionMeta({ id }).section;
  return null;
}
function layoutSectionIds() {
  const kind = pageKind(S.page);
  const ids = new Set(Object.keys(BUILTINS[kind] || {}));
  if (S.page === "home") return new Set(Object.values(HOME_LAYOUT_SECTION));
  return ids;
}
function newBlockId() { return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
function addBlock(type, afterIndex = null) {
  const id = newBlockId();
  const d = fileData(S.page); d.es ??= {}; d.en ??= {};
  const def = blockDefaults(type);
  for (const lang of ["es", "en"]) {
    d[lang].blocks ??= {};
    const data = { type };
    for (const [k, v] of Object.entries(def)) data[k] = v && typeof v === "object" && "es" in v ? clone(v[lang]) : clone(v);
    d[lang].blocks[id] = data;
  }
  const lay = getLayout();
  lay.splice(afterIndex == null ? lay.length : afterIndex + 1, 0, { id, type });
  setLayout(lay);
  return id;
}
function duplicateSection(i) {
  const lay = getLayout(), entry = lay[i], b = builtinOf(entry.id);
  const d = fileData(S.page); d.es ??= {}; d.en ??= {};
  const id = newBlockId();
  if (b) {
    if (!DUPLICABLE.includes(b.type)) return;
    for (const [li, lang] of ["es", "en"].entries()) {
      d[lang].blocks ??= {};
      const data = { type: b.type, eyebrow: b.eyebrow?.[li] || "", title: b.title?.[li] || "" };
      if (b.type === "statement") data.text = d[lang][b.textKey] ?? d.es[b.textKey] ?? "";
      else data.items = clone(d[lang][entry.id] ?? d.es[entry.id] ?? []);
      d[lang].blocks[id] = data;
    }
    lay.splice(i + 1, 0, { id, type: b.type });
  } else {
    for (const lang of ["es", "en"]) { d[lang].blocks ??= {}; d[lang].blocks[id] = clone(d[lang].blocks?.[entry.id] ?? d.es.blocks[entry.id]); }
    lay.splice(i + 1, 0, { id, type: customType(entry.id) });
  }
  setLayout(lay);
  toast("Sección duplicada.");
}
function removeSection(i) {
  const lay = getLayout(), entry = lay[i];
  if (builtinOf(entry.id)) return;
  if (!window.confirm(`¿Eliminar la sección “${sectionMeta(entry).label}”?`)) return;
  const d = fileData(S.page);
  for (const lang of ["es", "en"]) if (d[lang]?.blocks) delete d[lang].blocks[entry.id];
  lay.splice(i, 1);
  setLayout(lay);
}
function toggleSection(i) { const lay = getLayout(); lay[i].hidden = !lay[i].hidden; setLayout(lay); }
function moveSection(from, to) {
  const lay = getLayout();
  if (to < 0 || to >= lay.length || from === to) return;
  const [e] = lay.splice(from, 1); lay.splice(to, 0, e);
  setLayout(lay);
}

/* ---------------------------------------------------------------- sidebar */
function renderSidebar() {
  const sb = $("#sidebar");
  $("#page-name").textContent = pageName(S.page);
  const schema = pageSchema(S.page);
  if (!schema) { sb.innerHTML = '<div class="sb-scroll"><p class="panel-hint">Esta página no tiene campos editables.</p></div>'; return; }
  const section = S.section ? findSection(S.section) : null;
  if (!section) { S.section = null; return renderSectionList(sb, schema); }
  sb.innerHTML = `<div class="sb-head"><button class="icon-btn" id="sb-back" type="button" aria-label="Volver">${ic("back")}</button><h2>${escHtml(section.label)}</h2>${schema.single ? "" : `<span class="badge lang">${S.lang.toUpperCase()}</span>`}</div><div class="sb-scroll"><div class="fields" id="fields"></div></div>`;
  $("#sb-back").addEventListener("click", () => { S.section = null; renderSidebar(); });
  const box = $("#fields");
  if (section.hint) box.insertAdjacentHTML("beforeend", `<p class="panel-hint">${escHtml(section.hint)}</p>`);
  for (const f of section.fields) box.append(fieldEl(f, f.k, schema));
}

function renderSectionList(sb, schema) {
  const isPost = S.page.startsWith("posts/"), isBlog = S.page === "pages/blog", isHome = S.page === "home";
  const movable = layoutSectionIds();
  const fixed = schema.sections.filter(s => !movable.has(s.id));
  const top = isHome ? fixed.filter(s => s.id !== "closing") : fixed;
  const bottom = isHome ? fixed.filter(s => s.id === "closing") : [];
  const lay = schema.single ? [] : getLayout();
  const row = s => `<button class="sec-item" type="button" data-sec="${s.id}">${ic(s.icon)}<span>${escHtml(s.label)}</span><span class="chev">${ic("chevron")}</span></button>`;
  const layRows = lay.map((e, i) => {
    const m = sectionMeta(e);
    const canDup = m.builtin ? DUPLICABLE.includes(m.type) : true;
    return `<div class="lay-row${e.hidden ? " is-hidden" : ""}" draggable="true" data-i="${i}">
      <button class="grip" type="button" aria-label="Mover ${escHtml(m.label)} (usa las flechas)" data-grip="${i}">${ic("grip")}</button>
      <button class="lay-open" type="button" data-open="${i}"${m.section ? "" : " disabled"}>${ic(m.icon)}<span class="t">${escHtml(m.label)}</span></button>
      <span class="lay-actions">
        ${canDup && !isHome ? `<button class="icon-btn" type="button" data-dup="${i}" aria-label="Duplicar" title="Duplicar">${ic("copy")}</button>` : ""}
        ${!m.builtin ? `<button class="icon-btn" type="button" data-del="${i}" aria-label="Eliminar" title="Eliminar">${ic("trash")}</button>` : ""}
        <button class="icon-btn" type="button" data-eye="${i}" aria-label="${e.hidden ? "Mostrar" : "Ocultar"}" title="${e.hidden ? "Mostrar" : "Ocultar"}">${ic(e.hidden ? "eye-off" : "eye")}</button>
      </span></div>`;
  }).join("");
  const picker = isHome ? "" : `<button class="add-btn" type="button" id="add-sec">${ic("plus")} Agregar sección</button>
      <div class="type-picker" id="type-picker" hidden>${Object.entries(BLOCK_TYPES).map(([k, t]) => `<button class="type-opt" type="button" data-type="${k}">${ic(BLOCK_ICON[k])}<span><b>${escHtml(t.label)}</b><small>${escHtml(t.desc)}</small></span></button>`).join("")}</div>`;
  sb.innerHTML = `<div class="sb-head"><h2>${escHtml(pageName(S.page))}</h2></div>
    <div class="sb-scroll">
      ${top.length ? `<div class="sb-label">${isHome ? "Encabezado" : schema.single ? "Ajustes" : "Arriba"}</div>${top.map(row).join("")}` : ""}
      ${schema.single ? "" : `<div class="sb-label">Secciones${isPost ? " debajo del artículo" : ""}</div>
      <div class="lay-list" id="lay-list">${layRows || '<p class="panel-hint">Todavía no hay secciones aquí.</p>'}</div>${picker}`}
      ${bottom.length ? `<div class="sb-label">Pie de página</div>${bottom.map(row).join("")}` : ""}
      ${isBlog ? postsBlock() : ""}
      <p class="panel-hint">Arrastra las secciones para cambiar el orden. Haz clic sobre un texto o imagen de la vista previa para editarlo.</p>
    </div>
    <div class="sb-foot">
      ${isPost ? `<button class="btn btn-critical" type="button" id="del-post">${ic("trash")} Eliminar artículo</button>` : `<button class="sec-item" type="button" id="go-settings">${ic("settings")}<span>Datos de contacto y redes</span><span class="chev">${ic("chevron")}</span></button>`}
    </div>`;
  $$("[data-sec]", sb).forEach(b => b.addEventListener("click", () => { S.section = b.dataset.sec; renderSidebar(); }));
  $$("[data-open]", sb).forEach(b => b.addEventListener("click", () => { const m = sectionMeta(getLayout()[+b.dataset.open]); if (m.section) { S.section = m.section.id; renderSidebar(); } }));
  $$("[data-eye]", sb).forEach(b => b.addEventListener("click", () => { toggleSection(+b.dataset.eye); renderSidebar(); }));
  $$("[data-dup]", sb).forEach(b => b.addEventListener("click", () => { duplicateSection(+b.dataset.dup); renderSidebar(); }));
  $$("[data-del]", sb).forEach(b => b.addEventListener("click", () => { removeSection(+b.dataset.del); renderSidebar(); }));
  $$("[data-grip]", sb).forEach(b => b.addEventListener("keydown", e => {
    const i = +b.dataset.grip;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const to = e.key === "ArrowUp" ? i - 1 : i + 1;
    moveSection(i, to); renderSidebar();
    $(`#sidebar [data-grip="${Math.max(0, Math.min(to, getLayout().length - 1))}"]`)?.focus();
  }));
  wireDrag(sb);
  $("#add-sec")?.addEventListener("click", () => { const p = $("#type-picker"); p.hidden = !p.hidden; });
  $$("[data-type]", sb).forEach(b => b.addEventListener("click", () => { const id = addBlock(b.dataset.type); S.section = id; renderSidebar(); renderPreview(); toast("Sección agregada al final de la página."); }));
  $("#go-settings")?.addEventListener("click", () => goPage("settings"));
  $("#del-post")?.addEventListener("click", deletePost);
  if (isBlog) wirePostsBlock(sb);
}

function wireDrag(sb) {
  const list = $("#lay-list", sb); if (!list) return;
  let from = null;
  const rows = () => $$(".lay-row", list);
  const clear = () => rows().forEach(r => r.classList.remove("drop-before", "drop-after", "dragging"));
  list.addEventListener("dragstart", e => {
    const r = e.target.closest(".lay-row"); if (!r) return;
    from = +r.dataset.i; r.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(from));
  });
  list.addEventListener("dragover", e => {
    if (from == null) return;
    e.preventDefault();
    const r = e.target.closest(".lay-row"); if (!r) return;
    rows().forEach(x => x.classList.remove("drop-before", "drop-after"));
    const box = r.getBoundingClientRect();
    r.classList.add(e.clientY < box.top + box.height / 2 ? "drop-before" : "drop-after");
  });
  list.addEventListener("drop", e => {
    e.preventDefault();
    const r = e.target.closest(".lay-row");
    if (r && from != null) {
      let to = +r.dataset.i;
      const after = r.classList.contains("drop-after");
      if (after) to += 1;
      if (to > from) to -= 1;
      moveSection(from, to);
    }
    from = null; clear(); renderSidebar();
  });
  list.addEventListener("dragend", () => { from = null; clear(); });
}

function postsBlock() {
  const posts = idsUnder("posts").sort((a, b) => String(fileData(b)?.es?.date).localeCompare(String(fileData(a)?.es?.date)));
  return `<div class="sb-label">Artículos</div>
    ${posts.map(id => `<button class="sec-item" type="button" data-post="${escHtml(id)}">${ic("post")}<span>${escHtml(pageName(id))}</span><span class="badge ${fileData(id)?.es?.published ? "ok" : ""}">${fileData(id)?.es?.published ? "Publicado" : "Borrador"}</span></button>`).join("")}
    <button class="add-btn" type="button" id="new-post">${ic("plus")} Nuevo artículo</button>
    <form class="newpost" id="newpost-form" hidden>
      <label class="field"><span class="flabel">Título del artículo (español)</span><input class="input" id="newpost-title" required></label>
      <div class="row"><button class="btn btn-secondary" type="button" id="newpost-cancel">Cancelar</button><button class="btn btn-primary" type="submit">Crear</button></div>
    </form>`;
}
function wirePostsBlock(sb) {
  $$("[data-post]", sb).forEach(b => b.addEventListener("click", () => goPage(b.dataset.post)));
  const form = $("#newpost-form", sb);
  $("#new-post", sb).addEventListener("click", () => { form.hidden = false; $("#newpost-title", sb).focus(); });
  $("#newpost-cancel", sb).addEventListener("click", () => { form.hidden = true; });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = $("#newpost-title", sb).value.trim();
    if (!title) return;
    let slug = slugify(title), n = 2;
    while (S.files[`content/posts/${slug}.json`]) slug = `${slugify(title)}-${n++}`;
    const today = new Date().toISOString().slice(0, 10);
    const base = { title, category: "", excerpt: "", image: "", date: today, published: false, body: "" };
    S.files[`content/posts/${slug}.json`] = { data: { es: { ...base }, en: { ...base } }, original: null };
    S.deleted.delete(`content/posts/${slug}.json`);
    goPage(`posts/${slug}`, "basics");
    updateStatus();
  });
}
function deletePost() {
  if (!window.confirm(`¿Eliminar el artículo “${pageName(S.page)}”? Se borra del sitio al publicar.`)) return;
  const p = pageFile(S.page);
  if (S.files[p].original != null) S.deleted.add(p);
  delete S.files[p];
  goPage("pages/blog");
  updateStatus();
}

/* ---------------------------------------------------------------- field values */
// shared fields live in both languages; text fields per language; settings has no languages
function readVal(path, shared) {
  const d = fileData(S.page);
  if (pageSchema(S.page).single) return getPath(d, path);
  return getPath(d[shared ? "es" : S.lang] ?? {}, path);
}
function writeVal(path, value, shared) {
  const d = fileData(S.page);
  if (pageSchema(S.page).single) setPath(d, path, value);
  else if (shared) { setPath(d.es ??= {}, path, value); alignLists(d, path); setPath(d.en ??= {}, path, value); }
  else { if (S.lang === "en") alignLists(d, path); setPath(d[S.lang] ??= {}, path, value); }
  changed();
}
// make sure EN lists have the same items as ES before writing into them
function alignLists(d, path) {
  const ks = path.split(".");
  for (let i = 0; i < ks.length; i++) {
    if (!/^\d+$/.test(ks[i])) continue;
    const listPath = ks.slice(0, i).join(".");
    const es = getPath(d.es, listPath) || [];
    d.en ??= {};
    let en = getPath(d.en, listPath);
    if (!Array.isArray(en)) { en = []; setPath(d.en, listPath, en); }
    for (let j = en.length; j < es.length; j++) en[j] = clone(es[j]);
  }
}
function listOp(key, op, idx, fields) {
  const d = fileData(S.page);
  const single = pageSchema(S.page).single;
  if (!single) { // keep EN list aligned with ES before changing both
    d.es ??= {}; d.en ??= {};
    let es = getPath(d.es, key); if (!Array.isArray(es)) { es = []; setPath(d.es, key, es); }
    let en = getPath(d.en, key); if (!Array.isArray(en)) { en = []; setPath(d.en, key, en); }
    for (let j = en.length; j < es.length; j++) en[j] = clone(es[j]);
    en.length = es.length;
  }
  for (const root of single ? [d] : [d.es, d.en]) {
    let arr = getPath(root, key);
    if (!Array.isArray(arr)) { arr = []; setPath(root, key, arr); }
    if (op === "add") arr.push(Object.fromEntries(fields.map(f => [f.k, f.t === "toggle" ? false : ""])));
    if (op === "remove") arr.splice(idx, 1);
    if (op === "up" && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    if (op === "down" && idx < arr.length - 1) [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
  }
  changed();
}

/* ---------------------------------------------------------------- field widgets */
let uid = 0;
function fieldEl(f, path, schema, sharedParent = false) {
  const shared = !!(f.shared || sharedParent);
  const wrap = document.createElement("div");
  wrap.className = "field";
  wrap.dataset.path = path;
  const id = `f${++uid}`;
  const label = `<label for="${id}">${escHtml(f.l)}${shared && !schema.single ? '<span class="badge" title="Igual en español e inglés">Ambos idiomas</span>' : ""}</label>`;
  const hint = f.hint || (f.lines ? "Cada renglón es una línea del título." : "");
  const hintHtml = hint ? `<p class="hint">${escHtml(hint)}</p>` : "";
  const val = readVal(path, shared);
  const placeholder = !shared && S.lang === "en" && !schema.single ? ` placeholder="${escHtml(getPath(fileData(S.page)?.es, path) ?? "")}"` : "";

  if (f.t === "text" || f.t === "number" || f.t === "date") {
    const type = f.t === "number" ? "number" : f.t === "date" ? "date" : "text";
    wrap.innerHTML = `${label}<input class="input" id="${id}" type="${type}" value="${escHtml(val ?? "")}"${placeholder}>${hintHtml}`;
    $("input", wrap).addEventListener("input", e => writeVal(path, f.t === "number" ? Number(e.target.value) : e.target.value, shared));
  } else if (f.t === "textarea" || f.t === "markdown") {
    wrap.innerHTML = `${label}<textarea class="textarea${f.t === "markdown" ? " md" : ""}" id="${id}" rows="${f.lines ? 2 : 4}"${placeholder}>${escHtml(val ?? "")}</textarea>${hintHtml}`;
    $("textarea", wrap).addEventListener("input", e => writeVal(path, e.target.value, shared));
  } else if (f.t === "select") {
    wrap.innerHTML = `${label}<select class="select" id="${id}">${f.options.map(o => `<option value="${escHtml(o.value)}"${o.value === val ? " selected" : ""}>${escHtml(o.label)}</option>`).join("")}</select>${hintHtml}`;
    $("select", wrap).addEventListener("change", e => writeVal(path, e.target.value, shared));
  } else if (f.t === "toggle") {
    wrap.innerHTML = `<label class="toggle" for="${id}"><input type="checkbox" id="${id}"${val ? " checked" : ""}><span class="flabel">${escHtml(f.l)}</span></label>${hintHtml}`;
    $("input", wrap).addEventListener("change", e => { writeVal(path, e.target.checked, shared); if (S.page.startsWith("posts/")) updateStatus(); });
  } else if (f.t === "image") {
    wrap.innerHTML = `<span class="flabel">${escHtml(f.l)}${!schema.single ? '<span class="badge">Ambos idiomas</span>' : ""}</span>
      <div class="img-field"><img class="img-thumb" alt=""><div class="img-actions"><span class="img-name"></span>
      <button class="btn btn-plain" type="button" data-pick>Cambiar imagen</button><button class="btn btn-critical" type="button" data-clear>Quitar</button></div>
      <input type="file" accept="image/*" hidden id="${id}"></div>${hintHtml}`;
    const img = $("img", wrap), name = $(".img-name", wrap), input = $("input", wrap);
    const paint = v => { img.src = v ? (S.imageCache[v] || v) : ""; img.style.visibility = v ? "visible" : "hidden"; name.textContent = v ? v.split("/").pop() : "Sin imagen"; $("[data-clear]", wrap).hidden = !v; };
    paint(val);
    $("[data-pick]", wrap).addEventListener("click", () => input.click());
    $("[data-clear]", wrap).addEventListener("click", () => { writeVal(path, "", true); paint(""); });
    input.addEventListener("change", async () => {
      const file = input.files[0]; input.value = "";
      if (!file) return;
      try {
        const pub = await addUpload(file);
        writeVal(path, pub, true); paint(pub);
      } catch { toast("No pudimos leer esa imagen. Prueba con un JPG, PNG o WebP.", "error"); }
    });
  } else if (f.t === "group") {
    wrap.className = "group";
    wrap.innerHTML = `<div class="group-title">${escHtml(f.l)}</div>`;
    for (const sub of f.fields) wrap.append(fieldEl(sub, `${path}.${sub.k}`, schema));
  } else if (f.t === "list") {
    wrap.className = "list";
    paintList(wrap, f, path, schema);
  }
  return wrap;
}

function paintList(wrap, f, path, schema) {
  const items = (pageSchema(S.page).single ? getPath(fileData(S.page), path) : getPath(fileData(S.page).es, path)) || [];
  const open = S.openItems[path];
  wrap.innerHTML = "";
  items.forEach((_, i) => {
    const titleVal = readVal(`${path}.${i}.${f.itemTitle}`, f.fields.find(x => x.k === f.itemTitle)?.shared) || getPath(fileData(S.page).es, `${path}.${i}.${f.itemTitle}`);
    const el = document.createElement("div");
    el.className = "list-item" + (open === i ? " open" : "");
    el.innerHTML = `<div class="li-head"><button class="li-toggle" type="button" aria-expanded="${open === i}">${ic("chevron")}<span class="t">${escHtml(titleVal || `${f.l} ${i + 1}`)}</span></button>
      <button class="icon-btn" type="button" data-op="up" aria-label="Subir"${i === 0 ? " disabled" : ""}>${ic("up")}</button>
      <button class="icon-btn" type="button" data-op="down" aria-label="Bajar"${i === items.length - 1 ? " disabled" : ""}>${ic("down")}</button>
      <button class="icon-btn" type="button" data-op="remove" aria-label="Eliminar">${ic("trash")}</button></div>`;
    $(".li-toggle", el).addEventListener("click", () => { S.openItems[path] = open === i ? null : i; paintList(wrap, f, path, schema); });
    $$("[data-op]", el).forEach(b => b.addEventListener("click", () => {
      const op = b.dataset.op;
      if (op === "remove" && !window.confirm(`¿Eliminar “${titleVal || `${f.l} ${i + 1}`}”?`)) return;
      listOp(path, op, i, f.fields);
      S.openItems[path] = op === "up" ? i - 1 : op === "down" ? i + 1 : null;
      paintList(wrap, f, path, schema);
    }));
    if (open === i) {
      const body = document.createElement("div");
      body.className = "li-body";
      for (const sub of f.fields) {
        const fe = fieldEl(sub, `${path}.${i}.${sub.k}`, schema);
        if (sub.k === f.itemTitle) $("input,textarea", fe)?.addEventListener("input", e => { $(".li-toggle .t", el).textContent = e.target.value || `${f.l} ${i + 1}`; });
        body.append(fe);
      }
      el.append(body);
    }
    wrap.append(el);
  });
  const add = document.createElement("button");
  add.type = "button"; add.className = "add-btn";
  add.innerHTML = `${ic("plus")} Agregar ${escHtml(f.l.toLowerCase())}`;
  add.addEventListener("click", () => { listOp(path, "add", 0, f.fields); S.openItems[path] = items.length; paintList(wrap, f, path, schema); });
  wrap.append(add);
}

/* ---------------------------------------------------------------- images */
async function addUpload(file) {
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) + "-" + Date.now().toString(36);
  let blob = file, ext = (file.name.split(".").pop() || "png").toLowerCase();
  if (!/svg|gif/.test(file.type)) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
    blob = await new Promise(r => canvas.toBlob(r, "image/webp", 0.82));
    ext = "webp";
  }
  const dataUrl = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
  const name = `${base}.${ext}`;
  const publicPath = `/assets/uploads/${name}`;
  S.uploads[`static/assets/uploads/${name}`] = { base64: dataUrl.split(",")[1], dataUrl, publicPath };
  S.imageCache[publicPath] = dataUrl;
  return publicPath;
}

/* ---------------------------------------------------------------- preview */
const PREVIEW_HELPER = `<script>(function(){
  var css=document.createElement("style");
  css.textContent="[data-v-hover]{outline:2px solid #005bd3!important;outline-offset:3px!important;cursor:pointer!important;border-radius:4px}[data-v-hover][data-edit*='@section']{outline:2px dashed #005bd3!important;outline-offset:-4px!important}";
  document.head.appendChild(css);
  var SEL="[data-edit],[data-t],[data-words-t],[data-lines-t],[data-fade-t],#hero-img,#mem-img,#fac-icon,#tile1,#tile2";
  var last=null;
  function find(n){return n&&n.closest?n.closest(SEL):null}
  function keyOf(el){
    if(el.dataset.edit) return el.dataset.edit;
    var k=el.dataset.t||el.dataset.wordsT||el.dataset.linesT||el.dataset.fadeT;
    if(k) return "t:"+k;
    if(el.id) return "img:"+el.id;
    return null;
  }
  document.addEventListener("mouseover",function(e){var el=find(e.target);if(last&&last!==el)last.removeAttribute("data-v-hover");if(el){el.setAttribute("data-v-hover","");last=el}},true);
  document.addEventListener("mouseleave",function(){if(last)last.removeAttribute("data-v-hover")});
  document.addEventListener("click",function(e){
    var el=find(e.target);
    if(el){var k=keyOf(el);if(k){e.preventDefault();e.stopPropagation();parent.postMessage({vEditor:"edit",key:k},"*");return}}
    var a=e.target.closest&&e.target.closest("a[href]");
    if(!a) return;
    var href=a.getAttribute("href");
    if(href.charAt(0)==="#") return;
    var u=new URL(href,location.origin);
    if(u.origin!==location.origin){e.preventDefault();return}
    if(u.pathname===window.__PAGE__&&u.hash){e.preventDefault();var t=document.getElementById(u.hash.slice(1));if(t)t.scrollIntoView();return}
    e.preventDefault();parent.postMessage({vEditor:"nav",href:href},"*");
  },true);
  document.addEventListener("submit",function(e){e.preventDefault()},true);
})();<\/script>`;

let renderTimer = null, active = "a";
function contentForRender() {
  const svc = [], pages = {}, posts = [];
  for (const [p, f] of Object.entries(S.files)) {
    let m;
    if ((m = p.match(/^content\/services\/(.+)\.json$/))) svc.push({ slug: m[1], ...f.data });
    else if ((m = p.match(/^content\/pages\/(.+)\.json$/))) pages[m[1]] = f.data;
    else if ((m = p.match(/^content\/posts\/(.+)\.json$/))) posts.push({ slug: m[1], ...f.data });
  }
  return { settings: S.files["content/settings.json"]?.data || {}, home: S.files["content/home.json"].data, ui: S.templates.ui, services: svc, pages, posts,
    templates: { index: S.templates.index, siteJs: S.templates.siteJs } };
}
function renderPreview(resetScroll = false) {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => doRender(resetScroll), resetScroll ? 0 : 220);
}
function doRender(resetScroll) {
  let files;
  try { files = render(contentForRender(), { preview: true }); }
  catch (e) { console.error(e); toast("No se pudo mostrar la vista previa de este cambio.", "error"); return; }
  const path = pagePreview(S.page);
  let html = files[path] || files["index.html"];
  for (const [pub, data] of Object.entries(S.imageCache)) html = html.split(pub).join(data);
  html = html.replace("<head>", `<head><script>window.__PREVIEW__=true;window.__LANG__=${JSON.stringify(S.lang)};window.__PAGE__=${JSON.stringify("/" + path)};<\/script>`)
    .replace("</body>", PREVIEW_HELPER + "</body>");
  const cur = $("#frame-" + active), next = $("#frame-" + (active === "a" ? "b" : "a"));
  let y = 0;
  try { y = resetScroll ? 0 : cur.contentWindow.scrollY; } catch {}
  next.onload = () => {
    try { next.contentWindow.scrollTo(0, y); } catch {}
    requestAnimationFrame(() => { next.hidden = false; cur.hidden = true; active = active === "a" ? "b" : "a"; });
  };
  next.srcdoc = html;
}

function onFrameMessage(e) {
  const msg = e.data;
  if (!msg || !msg.vEditor) return;
  if (msg.vEditor === "nav") {
    const id = pageFromHref(msg.href);
    if (id) goPage(id); else toast("Esa página no se edita desde aquí.");
    return;
  }
  if (msg.vEditor === "edit") openKey(msg.key);
}

/* ---------------------------------------------------------------- click to edit */
function resolveKey(key) {
  if (key.startsWith("t:")) key = homeKey(key.slice(2)) || "";
  else if (key.startsWith("img:")) key = HOME_IMAGES[key.slice(4)] || "";
  if (!key) return null;
  let [file, path] = key.split("|");
  if (file === "svcidx") { const id = serviceIds()[Number(path)]; return id ? { page: id, path: "name" } : null; }
  if (file === "settings" && path === "city") path = S.lang === "en" ? "city_en" : "city_es";
  if (file === "home") return { page: "home", path };
  if (file === "settings") return { page: "settings", path };
  return { page: file, path };
}
function openKey(rawKey) {
  const r = resolveKey(rawKey);
  if (!r) { toast("Ese texto es fijo del diseño."); return; }
  if (r.page !== S.page) { S.page = r.page; S.openItems = {}; store.set("v_editor_page", r.page); renderPreview(true); }
  const schema = pageSchema(r.page);
  if (!schema) return;
  // whole section clicked
  if (r.path.startsWith("@section:")) {
    const sec = findSection(r.path.slice(9));
    S.section = sec ? sec.id : null; renderSidebar(); return;
  }
  // find the section and field that own this path
  const ks = r.path.split(".");
  let section = null, field = null;
  if (ks[0] === "blocks") { section = findSection(ks[1]); }
  else section = schema.sections.find(s => s.fields.some(f => f.k === ks[0]));
  if (section) field = section.fields.find(f => r.path === f.k || r.path.startsWith(f.k + "."));
  if (!section || !field) { toast("Ese texto es fijo del diseño."); return; }
  const rest = r.path.slice(field.k.length + 1).split(".").filter(Boolean);
  if (field.t === "list" && rest[0] != null && /^\d+$/.test(rest[0])) S.openItems[field.k] = Number(rest[0]);
  S.section = section.id;
  renderSidebar();
  let target = $(`#sidebar [data-path="${CSS.escape(r.path)}"]`);
  if (!target && field.t === "list" && rest[0] != null) target = $$(`#sidebar [data-path="${CSS.escape(field.k)}"] .list-item`)[Number(rest[0])] || $$("#sidebar .list-item")[Number(rest[0])];
  if (!target) target = $(`#sidebar [data-path="${CSS.escape(field.k)}"]`);
  if (target) {
    target.scrollIntoView({ block: "center" });
    target.classList.add("flash"); setTimeout(() => target.classList.remove("flash"), 1300);
    $("input:not([type=file]),textarea,select", target)?.focus({ preventScroll: true });
  }
}

/* ---------------------------------------------------------------- changes & publish */
function changes() {
  const out = [];
  for (const [p, f] of Object.entries(S.files)) {
    if (f.original == null || serialize(f.data) !== f.original) out.push({ path: p, page: pageIdOf(p), kind: f.original == null ? "new" : "edit" });
  }
  for (const p of S.deleted) out.push({ path: p, page: pageIdOf(p), kind: "delete" });
  for (const p of Object.keys(S.uploads)) out.push({ path: p, page: null, kind: "upload" });
  return out;
}
const pageIdOf = p => p === "content/home.json" ? "home" : p === "content/settings.json" ? "settings" : p.replace(/^content\//, "").replace(/\.json$/, "");
function changed() { renderPreview(); updateStatus(); }
function updateStatus() {
  const n = changes().filter(c => c.kind !== "upload").length + (Object.keys(S.uploads).length ? 1 : 0);
  const st = $("#status");
  st.textContent = n ? (n === 1 ? "1 cambio sin publicar" : `${n} cambios sin publicar`) : "Todo publicado";
  st.classList.toggle("dirty", !!n);
  $("#publish-btn").disabled = !n;
  $("#discard-btn").hidden = !n;
}
function discard() {
  if (!window.confirm("¿Descartar todos los cambios sin publicar?")) return;
  for (const [p, f] of Object.entries(S.files)) {
    if (f.original == null) delete S.files[p];
    else f.data = JSON.parse(f.original);
  }
  S.deleted.clear(); S.uploads = {};
  if (!S.files[pageFile(S.page)]) S.page = "home";
  renderSidebar(); renderPreview(); updateStatus();
  toast("Cambios descartados.");
}

async function publish() {
  const list = changes();
  if (!list.length) return;
  const btn = $("#publish-btn");
  btn.disabled = true; btn.textContent = "Publicando…";
  try {
    if (DEV) { await new Promise(r => setTimeout(r, 600)); console.log("[dev] publish", list); }
    else {
      const ref = await gh("GET", `/repos/${REPO}/git/ref/heads/${BRANCH}`);
      const baseCommit = await gh("GET", `/repos/${REPO}/git/commits/${ref.object.sha}`);
      const tree = [];
      for (const c of list) {
        if (c.kind === "delete") { tree.push({ path: c.path, mode: "100644", type: "blob", sha: null }); continue; }
        const blob = c.kind === "upload"
          ? await gh("POST", `/repos/${REPO}/git/blobs`, { content: S.uploads[c.path].base64, encoding: "base64" })
          : await gh("POST", `/repos/${REPO}/git/blobs`, { content: serialize(S.files[c.path].data), encoding: "utf-8" });
        tree.push({ path: c.path, mode: "100644", type: "blob", sha: blob.sha });
      }
      const newTree = await gh("POST", `/repos/${REPO}/git/trees`, { base_tree: baseCommit.tree.sha, tree });
      const names = [...new Set(list.filter(c => c.page).map(c => pageName(c.page) || c.page))];
      const message = `Editor: ${names.length ? names.join(", ") : "imágenes"}`;
      const commit = await gh("POST", `/repos/${REPO}/git/commits`, { message, tree: newTree.sha, parents: [ref.object.sha] });
      await gh("PATCH", `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: commit.sha });
    }
    for (const c of list) {
      if (c.kind === "edit" || c.kind === "new") S.files[c.path].original = serialize(S.files[c.path].data);
    }
    S.deleted.clear(); S.uploads = {};
    toast("Publicado. Tu sitio se actualiza en 1 o 2 minutos.");
  } catch (e) {
    console.error(e);
    if (e.status === 401) toast("Tu sesión expiró. Cierra sesión y vuelve a entrar; tus cambios siguen aquí.", "error");
    else if (e.status === 409 || e.status === 422) toast("Alguien publicó al mismo tiempo. Inténtalo de nuevo.", "error");
    else toast("No se pudo publicar. Revisa tu conexión e inténtalo de nuevo.", "error");
  } finally {
    btn.textContent = "Publicar";
    updateStatus();
  }
}

boot();
