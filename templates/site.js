// Virtualiamn — shared behaviour for inner pages
import Lenis from "lenis";

const root = document.documentElement;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// rem scale-up above 1920px (same rule as the home page)
function fitFont() {
  const reduction = ((1920 - innerWidth) / 1920) * 100 * 0.6666;
  const size = 16 - (16 * reduction) / 100;
  if (size > 16) root.style.fontSize = size + "px"; else root.style.removeProperty("font-size");
}
fitFont();
addEventListener("resize", fitFont);

// smooth scroll + parallax
const lenis = new Lenis({ smoothWheel: true });
const plates = $$("[data-px]").map(el => {
  const [from, to] = el.dataset.px.split(",").map(Number);
  return { el, from, to, sec: el.closest("section") };
});
function raf(t) {
  lenis.raf(t);
  const vh = innerHeight;
  for (const p of plates) {
    const r = p.sec.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    p.el.style.transform = `translate3d(0,${p.from + (p.to - p.from) * k}%,0)`;
  }
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// reveal on scroll (once)
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { rootMargin: "0px 0px -8% 0px" });
$$(".rv, .rv-lines").forEach(el => io.observe(el));

// language toggle (shared with the home page through localStorage)
function setLang(l) {
  root.dataset.lang = l; root.lang = l;
  if (window.__titles) document.title = window.__titles[l];
  try { localStorage.setItem("vlang", l); } catch (e) {}
  // replay title reveals so the new language animates in
  $$(".rv-lines.in").forEach(el => { el.classList.remove("in"); void el.offsetWidth; el.classList.add("in"); });
}
document.addEventListener("click", e => {
  if (e.target.closest("[data-lang-toggle]")) setLang(root.dataset.lang === "es" ? "en" : "es");
});
