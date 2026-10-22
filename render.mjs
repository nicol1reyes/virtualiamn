// Virtualiamn — turns the content (JSON) into the site's HTML pages.
// Used by build.mjs (Netlify) and by the visual editor in /admin (live preview).
import { marked } from "marked";

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const splitLines = s => String(s ?? "").split(/\n|\|/).map(x => x.trim()).filter(Boolean);
const arrow = () => '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const MARK = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 3v3.5M21 12h-3.5"/></svg>';
const CTA = "/index.html#book";
const SOCIALS = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"], ["linkedin", "LinkedIn"]];
const telHref = p => "tel:" + String(p ?? "").replace(/[^\d+]/g, "");
const pad = n => String(n).padStart(2, "0");

/**
 * @param {object} c  { settings, home, ui, services:[{slug,es,en}], pages:{slug:{es,en}}, posts:[{slug,es,en}], templates:{ index, siteJs } }
 * @param {object} opts { preview?: boolean, lang?: "es"|"en" }
 * @returns {Record<string,string>} map of output path → HTML
 */
export function render(c, opts = {}) {
  const { settings = {}, home, ui, templates } = c;
  const preview = !!opts.preview;
  const services = [...(c.services || [])].sort((a, b) => (a.es?.order ?? 99) - (b.es?.order ?? 99));
  const pages = c.pages || {};
  const posts = [...(c.posts || [])].sort((a, b) => String(b.es?.date).localeCompare(String(a.es?.date)));

  // data-edit markers only in the editor preview (keeps the live site clean)
  const ED = key => (preview ? ` data-edit="${esc(key)}"` : "");
  const pick = (obj, lang, key) => obj?.[lang]?.[key] ?? obj?.es?.[key] ?? "";
  const L = (es, en, tag = "span") => `<${tag} data-l="es">${esc(es)}</${tag}><${tag} data-l="en">${esc(en ?? es)}</${tag}>`;
  const Lo = (obj, key) => L(pick(obj, "es", key), pick(obj, "en", key));
  const item = (obj, key, i, field) => [obj.es?.[key]?.[i]?.[field] ?? "", obj.en?.[key]?.[i]?.[field] ?? obj.es?.[key]?.[i]?.[field] ?? ""];
  const list = (obj, key) => obj.es?.[key] ?? [];
  const lines = (es, en) => [["es", es], ["en", en ?? es]].map(([lang, txt]) => {
    const parts = splitLines(txt);
    const spans = parts.map((x, i) => `<span class="cl"><span class="ri" style="--dl:${i * 120}ms">${esc(x)}</span></span>`).join("");
    return `<span data-l="${lang}"><span class="sr-only">${esc(parts.join(" "))}</span><span aria-hidden="true">${spans}</span></span>`;
  }).join("");
  const socialLinks = () => SOCIALS.filter(([k]) => settings[k]).map(([k, n]) => `<a href="${esc(settings[k])}" target="_blank" rel="noopener"${ED("settings|" + k)}>${n}</a>`).join("");

  function header() {
    return `<header class="hdr">
  <nav class="hdr-nav" aria-label="Principal">
    <a href="/index.html#programs">${L("Servicios", "Services")}</a>
    <a href="/nosotros.html">${L("Nosotros", "About")}</a>
    <a href="/casos.html">${L("Casos", "Work")}</a>
  </nav>
  <div class="hdr-brand"><a href="/index.html" class="brand" aria-label="Virtualiamn">${MARK}Virtualiamn</a></div>
  <div class="hdr-r">
    <button class="lang-btn" type="button" data-lang-toggle><span data-l="es" aria-label="Switch to English">EN</span><span data-l="en" aria-label="Cambiar a español">ES</span></button>
    <a class="hdr-book" href="${CTA}">${L("Agenda una llamada", "Book a call")}</a>
  </div>
</header>`;
  }
  function footer() {
    const svc = services.map(s => `<li><a href="/${s.slug}.html"${ED(`services/${s.slug}|name`)}>${L(s.es.name, s.en?.name)}</a></li>`).join("");
    return `<footer class="foot" id="contact">
  <div class="f-cta">
    <div><span class="eyebrow light"${ED("home|ctaEyebrow")}>${Lo(home, "ctaEyebrow")}</span>
      <p class="f-big rv-lines"${ED("home|ctaBig")}>${lines(home.es.ctaBig, home.en?.ctaBig)}</p></div>
    <a class="pill light rv" href="${CTA}">${L("Agenda una llamada", "Book a call")}<span class="ar">${arrow()}</span></a>
  </div>
  <div class="f-cols">
    <div class="f-brand">
      <a href="/index.html" class="brand">${MARK}Virtualiamn</a>
      <p class="f-blurb"${ED("home|blurb")}>${Lo(home, "blurb")}</p>
      <address><a href="mailto:${esc(settings.email)}"${ED("settings|email")}>${esc(settings.email)}</a><a href="${telHref(settings.phone)}"${ED("settings|phone")}>${esc(settings.phone)}</a><span${ED("settings|city")}>${L(settings.city_es, settings.city_en)}</span></address>
    </div>
    <nav class="f-nav"><h3>${L("Servicios", "Services")}</h3><ul>${svc}</ul></nav>
    <nav class="f-nav"><h3>${L("Agencia", "Agency")}</h3><ul>
      <li><a href="/index.html#facilities">${L("Estudio", "Studio")}</a></li><li><a href="/casos.html">${L("Casos de éxito", "Case studies")}</a></li>
      <li><a href="/index.html#testimonials">${L("Testimonios", "Testimonials")}</a></li><li><a href="/blog.html">Blog</a></li></ul></nav>
    <nav class="f-nav"><h3>${L("Empresa", "Company")}</h3><ul>
      <li><a href="/nosotros.html">${L("Nosotros", "About")}</a></li><li><a href="/index.html#programs">${L("Equipo", "Team")}</a></li>
      <li><a href="/empleos.html">${L("Empleos", "Careers")}</a></li><li><a href="${CTA}">${L("Contacto", "Contact")}</a></li></ul></nav>
  </div>
  <div class="f-bar">
    <p>© ${new Date().getFullYear()} Virtualiamn. ${L("Todos los derechos reservados.", "All rights reserved.")}</p>
    <nav>${socialLinks()}</nav>
    <nav><a href="/privacidad.html">${L("Privacidad", "Privacy")}</a><a href="/terminos.html">${L("Términos", "Terms")}</a></nav>
  </div>
</footer>`;
  }

  function layout({ file, titleEs, titleEn, descEs, image, position, eyebrow, title, lede, ctas = true, body }) {
    const t = { es: `${titleEs} — Virtualiamn`, en: `${titleEn} — Virtualiamn` };
    const ctaRow = ctas ? `<div class="ph-ctas rv" style="--dl:500ms"><a class="pill light" href="${CTA}">${L("Agenda una llamada", "Book a call")}<span class="ar">${arrow()}</span></a>
      <a class="pill ghost" href="/index.html#programs">${L("Ver servicios", "See services")}</a></div>` : "";
    return `<!doctype html>
<html lang="es" data-lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.es)}</title>
<meta name="description" content="${esc(descEs)}">
<script>(function(){var l=window.__LANG__;try{l=l||localStorage.getItem("vlang")}catch(e){}if(l!=="es"&&l!=="en")l=(navigator.language||"es").toLowerCase().indexOf("en")===0?"en":"es";var h=document.documentElement;h.className+=" js";h.lang=l;h.dataset.lang=l;window.__titles=${JSON.stringify(t)};document.title=window.__titles[l];})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<script type="importmap">{ "imports": { "lenis": "https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm" } }</script>
</head>
<body>
<main>
  <section class="phero">
    <div class="hero-bg"><div class="hero-plate" data-px="0,12"><img src="${esc(image)}" alt="" style="object-position:${esc(position || "50% 50%")}"${ED(file + "|image")}></div><div class="hero-ov"></div></div>
    ${header()}
    <div class="ph-body">
      <span class="eyebrow light rv">${eyebrow}</span>
      <h1 class="ph-title rv-lines"${ED(file + "|title")}>${title}</h1>
      <p class="ph-lede rv" style="--dl:300ms"${ED(file + "|lede")}>${lede}</p>
      ${ctaRow}
    </div>
  </section>
  <div class="content">${body}</div>
  ${footer()}
</main>
<script type="module">
${templates.siteJs}
</script>
</body>
</html>
`;
  }

  /* ---------- section blocks ---------- */
  const secHead = (eyebrow, title) => `<span class="eyebrow">${eyebrow}</span><h2 class="h2 rv-lines">${title}</h2>`;
  const grid = (file, obj, key, eyebrow, title) => {
    const cards = list(obj, key).map((_, i) => `<li class="card rv" style="--dl:${i * 90}ms"${ED(`${file}|${key}.${i}`)}><span class="card-n">${pad(i + 1)}</span><h3${ED(`${file}|${key}.${i}.title`)}>${L(...item(obj, key, i, "title"))}</h3><p${ED(`${file}|${key}.${i}.text`)}>${L(...item(obj, key, i, "text"))}</p></li>`).join("");
    return cards ? `<section class="sec">${secHead(eyebrow, title)}<ul class="grid">${cards}</ul></section>` : "";
  };
  const steps = (file, obj, key, eyebrow, title) => {
    const rows = list(obj, key).map((_, i) => `<li class="step rv" style="--dl:${i * 90}ms"><span class="pidx">${pad(i + 1)}</span><div class="pbody"><h3 class="pname"${ED(`${file}|${key}.${i}.title`)}>${L(...item(obj, key, i, "title"))}</h3><p class="pdesc"${ED(`${file}|${key}.${i}.text`)}>${L(...item(obj, key, i, "text"))}</p></div></li>`).join("");
    return rows ? `<section class="sec surface">${secHead(eyebrow, title)}<ol class="steps">${rows}</ol></section>` : "";
  };
  const chips = (file, obj, key, eyebrow, title) => {
    const cc = list(obj, key).map((_, i) => `<li class="chip-i rv" style="--dl:${i * 70}ms"${ED(`${file}|${key}.${i}.text`)}><span class="dotm"></span>${L(...item(obj, key, i, "text"))}</li>`).join("");
    return cc ? `<section class="sec">${secHead(eyebrow, title)}<ul class="chips">${cc}</ul></section>` : "";
  };
  const faq = (file, obj, eyebrow, title) => {
    const q = list(obj, "faq").map((_, i) => `<details class="qa rv" style="--dl:${i * 80}ms"${preview ? " open" : ""}><summary${ED(`${file}|faq.${i}.question`)}>${L(...item(obj, "faq", i, "question"))}<span class="plus" aria-hidden="true"></span></summary><p${ED(`${file}|faq.${i}.answer`)}>${L(...item(obj, "faq", i, "answer"))}</p></details>`).join("");
    return q ? `<section class="sec surface">${secHead(eyebrow, title)}<div class="faq">${q}</div></section>` : "";
  };
  const heroOf = (file, obj, eyebrowHtml, extra = {}) => ({
    file,
    titleEs: splitLines(obj.es.title).join(" "), titleEn: splitLines(obj.en?.title ?? obj.es.title).join(" "),
    descEs: obj.es.lede, image: obj.es.image, position: obj.es.imagePosition,
    eyebrow: eyebrowHtml, title: lines(obj.es.title, obj.en?.title), lede: Lo(obj, "lede"), ...extra,
  });

  const files = {};

  services.forEach((s, n) => {
    const f = `services/${s.slug}`;
    const others = services.filter(o => o.slug !== s.slug).map(o => `<li><a class="other rv" href="/${o.slug}.html"><span>${L(o.es.name, o.en?.name)}</span><span class="parr"><span class="ag">${arrow()}</span></span></a></li>`).join("");
    const body = [
      grid(f, s, "includes", L("Qué incluye", "What's included"), lines("Todo lo que\ntu marca necesita", "Everything\nyour brand needs")),
      steps(f, s, "process", L("Proceso", "Process"), lines("Cómo\ntrabajamos", "How we\nwork")),
      chips(f, s, "ideal", L("Ideal para", "Ideal for"), lines("¿Es para\ntu marca?", "Is it right\nfor you?")),
      faq(f, s, L("Preguntas frecuentes", "FAQ"), lines("Lo que nos\npreguntan", "What people\nask us")),
      others ? `<section class="sec">${secHead(L("Otros servicios", "Other services"), lines("Sigue\nexplorando", "Keep\nexploring"))}<ul class="others">${others}</ul></section>` : "",
    ].join("");
    files[`${s.slug}.html`] = layout({ ...heroOf(f, s, L(`Servicio ${pad(n + 1)}`, `Service ${pad(n + 1)}`)), body });
  });

  if (pages.nosotros) {
    const p = pages.nosotros, f = "pages/nosotros";
    const team = list(p, "team");
    const teamHtml = team.length
      ? `<ul class="team">${team.map((m, i) => `<li class="member-c rv" style="--dl:${i * 90}ms"${ED(`${f}|team.${i}`)}>${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">` : ""}<h3>${esc(m.name)}</h3><p>${L(...item(p, "team", i, "role"))}</p></li>`).join("")}</ul>`
      : `<div class="ph rv"${ED(`${f}|team`)}>${L("[Agrega a tu equipo desde el editor: foto, nombre y rol.]", "[Add your team from the editor: photo, name and role.]")}</div>`;
    files["nosotros.html"] = layout({ ...heroOf(f, p, L("Nosotros", "About")), body: [
      `<section class="sec"><span class="eyebrow">${L("Nuestra misión", "Our mission")}</span><p class="statement rv"${ED(f + "|mission")}>${Lo(p, "mission")}</p></section>`,
      grid(f, p, "values", L("Lo que creemos", "What we believe"), lines("Nuestros\nvalores", "Our\nvalues")),
      steps(f, p, "steps", L("Cómo trabajamos", "How we work"), lines("Del brief\na los resultados", "From brief\nto results")),
      `<section class="sec surface"><span class="eyebrow">${L("Equipo", "Team")}</span>${teamHtml}</section>`,
    ].join("") });
  }

  if (pages.casos) {
    const p = pages.casos, f = "pages/casos";
    const cards = list(p, "cases").map((cs, i) => `<li class="case rv" style="--dl:${i * 120}ms">
  <div class="case-img"${ED(`${f}|cases.${i}.image`)}>${cs.image ? `<img src="${esc(cs.image)}" alt="" loading="lazy">` : ""}</div>
  <div class="case-body"><span class="tag"${ED(`${f}|cases.${i}.category`)}>${L(...item(p, "cases", i, "category"))}</span><h3${ED(`${f}|cases.${i}.client`)}>${L(...item(p, "cases", i, "client"))}</h3>
  <dl><div><dt>${L("Reto", "Challenge")}</dt><dd${ED(`${f}|cases.${i}.challenge`)}>${L(...item(p, "cases", i, "challenge"))}</dd></div>
  <div><dt>${L("Solución", "Solution")}</dt><dd${ED(`${f}|cases.${i}.solution`)}>${L(...item(p, "cases", i, "solution"))}</dd></div>
  <div><dt>${L("Resultado", "Result")}</dt><dd${ED(`${f}|cases.${i}.result`)}>${L(...item(p, "cases", i, "result"))}</dd></div></dl></div></li>`).join("");
    files["casos.html"] = layout({ ...heroOf(f, p, L("Casos de éxito", "Case studies")), body: `<section class="sec"><ul class="cases">${cards}</ul></section>` });
  }

  if (pages.empleos) {
    const p = pages.empleos, f = "pages/empleos";
    files["empleos.html"] = layout({ ...heroOf(f, p, L("Empleos", "Careers")), body: [
      chips(f, p, "areas", L("Áreas", "Areas"), lines("Donde solemos\nsumar talento", "Where we usually\nhire")),
      grid(f, p, "values", L("Lo que valoramos", "What we value"), lines("Cómo es\ntrabajar aquí", "What it's like\nto work here")),
      `<section class="sec"><span class="eyebrow">${L("Vacantes", "Openings")}</span><p class="statement rv"${ED(f + "|openings")}>${Lo(p, "openings")}</p></section>`,
    ].join("") });
  }

  for (const slug of ["privacidad", "terminos"]) {
    const p = pages[slug]; if (!p) continue;
    const f = `pages/${slug}`;
    const secs = list(p, "sections").map((_, i) => `<section class="lg rv"><h2${ED(`${f}|sections.${i}.title`)}>${L(...item(p, "sections", i, "title"))}</h2><p${ED(`${f}|sections.${i}.text`)}>${L(...item(p, "sections", i, "text"))}</p></section>`).join("");
    files[`${slug}.html`] = layout({ ...heroOf(f, p, L("Legal", "Legal"), { ctas: false }), body: `<section class="sec"><div class="legal">${secs}</div></section>` });
  }

  const fmtDate = (d, lang) => { try { return new Date(d + "T12:00:00").toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; } };
  if (pages.blog) {
    const p = pages.blog;
    const cards = posts.map((post, i) => {
      const live = !!post.es.published, f = `posts/${post.slug}`;
      const inner = `<div class="post-img">${post.es.image ? `<img src="${esc(post.es.image)}" alt="" loading="lazy">` : ""}</div>
  <div class="post-meta"><span class="tag">${Lo(post, "category")}</span><span class="soon">${live ? L(fmtDate(post.es.date, "es"), fmtDate(post.es.date, "en")) : L("Próximamente", "Coming soon")}</span></div>
  <h3>${Lo(post, "title")}</h3><p>${Lo(post, "excerpt")}</p>`;
      return `<li class="post rv" style="--dl:${i * 120}ms"${ED(f + "|title")}>${live || preview ? `<a href="/blog/${post.slug}.html" class="post-link">${inner}</a>` : inner}</li>`;
    }).join("");
    files["blog.html"] = layout({ ...heroOf("pages/blog", p, L("Blog", "Blog")), body: `<section class="sec"><ul class="posts">${cards}</ul></section>` });
    for (const post of posts.filter(x => x.es.published || preview)) {
      const f = `posts/${post.slug}`;
      const body = `<section class="sec"><article class="article rv"${ED(f + "|body")}><div data-l="es">${marked.parse(post.es.body || "")}</div><div data-l="en">${marked.parse(post.en?.body || post.es.body || "")}</div>
      <p class="back"><a href="/blog.html">← ${L("Volver al blog", "Back to the blog")}</a></p></article></section>`;
      files[`blog/${post.slug}.html`] = layout({
        file: f, titleEs: post.es.title, titleEn: post.en?.title ?? post.es.title, descEs: post.es.excerpt,
        image: post.es.image, position: "50% 50%", ctas: false,
        eyebrow: `${Lo(post, "category")} · ${L(fmtDate(post.es.date, "es"), fmtDate(post.es.date, "en"))}`,
        title: lines(post.es.title, post.en?.title), lede: Lo(post, "excerpt"), body,
      });
    }
  }

  /* ---------- home ---------- */
  {
    let s = templates.index;
    const T = {};
    for (const lang of ["es", "en"]) {
      const h = { ...home.es, ...(home[lang] || {}) };
      const g = (key, i, f) => home[lang]?.[key]?.[i]?.[f] ?? home.es[key]?.[i]?.[f] ?? "";
      const t = { ...ui[lang] };
      Object.assign(t, {
        heroTitle: splitLines(h.heroTitle).join(" "), tagline: splitLines(h.tagline).join("|"),
        heroAlt: "", memberAlt: "", facIconAlt: "", tile1Alt: "", tile2Alt: "",
        memberValue: home.es.memberValue, memberCap: h.memberCap, pctValue: home.es.pctValue, pctCap: h.pctCap,
        badgeTitle: h.badgeTitle, badgeBody: h.badgeBody,
        coll: (home.es.coll || []).map((cc, i) => ({ brand: g("coll", i, "brand"), title: g("coll", i, "title"), cta: g("coll", i, "cta"), href: `/${cc.link || services[0]?.slug}.html`, alt: "" })),
        trust: (home.es.trust || []).map((_, i) => ({ words: [1, 2, 3, 4].map(k => g("trust", i, "word" + k)), name: g("trust", i, "name"), role: g("trust", i, "role"), alt: "" })),
        svcEyebrow: h.svcEyebrow, svcTitle: splitLines(h.svcTitle).join("|"),
        svc: services.map(sv => ({ name: sv[lang]?.name ?? sv.es.name, desc: sv[lang]?.summary ?? sv.es.summary, href: `/${sv.slug}.html` })),
        facTitle: splitLines(h.facTitle).join("|"), facBody: h.facBody,
        tile1Name: h.tile1?.name, tile1Desc: h.tile1?.desc, tile2Name: h.tile2?.name, tile2Desc: h.tile2?.desc,
        statsEyebrow: h.statsEyebrow, statsTitle: splitLines(h.statsTitle).join("|"),
        testiEyebrow: h.testiEyebrow, testiTitle: splitLines(h.testiTitle).join("|"),
        ctaEyebrow: h.ctaEyebrow, ctaBig: splitLines(h.ctaBig).join("|"), blurb: h.blurb,
        city: lang === "es" ? settings.city_es : settings.city_en,
      });
      (home.es.stats || []).forEach((_, i) => { t[`statL${i}`] = g("stats", i, "label"); });
      (home.es.testimonials || []).forEach((_, i) => { t[`tq${i}`] = g("testimonials", i, "quote"); t[`tn${i}`] = g("testimonials", i, "name"); t[`tr${i}`] = g("testimonials", i, "role"); });
      services.forEach((sv, i) => { t[`fsvc${i}`] = sv[lang]?.name ?? sv.es.name; });
      T[lang] = t;
    }
    const IMG = {
      hero: home.es.heroImage, member: home.es.memberImage, facIcon: home.es.facIcon,
      tile1: home.es.tile1?.image, tile2: home.es.tile2?.image,
      coll: (home.es.coll || []).map(x => x.image), trust: (home.es.trust || []).map(x => x.image),
    };
    const stats = (home.es.stats || []).map((st, i) => `<div class="stat" data-inview='{"from":{"opacity":0,"y":30},"d":${i * 110},"t":180,"f":24}'><dt class="sr-only" data-t="statL${i}"></dt><dd><span class="stat-v"${ED(`home|stats.${i}.value`)}>${esc(st.value)}</span><span class="stat-l" aria-hidden="true" data-t="statL${i}"></span></dd></div>`).join("\n      ");
    const testi = (home.es.testimonials || []).map((_, i) => `
      <li data-inview='{"from":{"opacity":0,"y":40},"d":${i * 120},"t":180,"f":26}'>
        <figure class="tcard" data-hover='{"from":{"y":0},"to":{"y":-8},"t":300,"f":22}'>
          <div><div class="tq" aria-hidden="true">“</div><blockquote data-t="tq${i}"></blockquote></div>
          <figcaption><div class="tn" data-t="tn${i}"></div><div class="tr" data-t="tr${i}"></div></figcaption>
        </figure>
      </li>`).join("");
    const fsvc = services.map((sv, i) => `<li><a href="/${sv.slug}.html" data-t="fsvc${i}"></a></li>`).join("");
    const address = `<a href="mailto:${esc(settings.email)}"${ED("settings|email")}>${esc(settings.email)}</a>
          <a href="${telHref(settings.phone)}"${ED("settings|phone")}>${esc(settings.phone)}</a>
          <span data-t="city"></span>`;
    const json = v => JSON.stringify(v).replace(/</g, "\\u003c");
    s = s.replace("{{heroImage}}", esc(IMG.hero))
      .replace("<!--@@STATS@@-->", stats).replace("<!--@@TESTI@@-->", testi)
      .replace("<!--@@FSVC@@-->", fsvc).replace("<!--@@ADDRESS@@-->", address)
      .split("<!--@@SOCIAL@@-->").join(socialLinks())
      .replace("/*@@IMG@@*/", `const IMG = ${json(IMG)};`)
      .replace("/*@@T@@*/", `const T = ${json(T)};`);
    files["index.html"] = s;
  }

  return files;
}
