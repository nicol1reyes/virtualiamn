import { FONT_OPTIONS } from "./render.mjs";

// Fields shown in the visual editor, grouped in sections like a theme editor.
// t: text | textarea | image | select | number | toggle | markdown | list | group
// shared: same value in both languages (images, numbers, links)
// lines: each line of the textarea is one line of a big title

const SERVICE_OPTIONS = [
  { value: "redes-sociales", label: "Redes sociales" },
  { value: "publicidad", label: "Publicidad pagada" },
  { value: "seo-web", label: "SEO y sitios web" },
  { value: "branding", label: "Branding y contenido" },
];
const POSITION = { k: "imagePosition", t: "select", l: "Encuadre de la imagen", shared: true, options: [
  { value: "50% 50%", label: "Centro" }, { value: "50% 20%", label: "Arriba" }, { value: "50% 80%", label: "Abajo" },
] };
const pageHero = [
  { k: "title", t: "textarea", l: "Título", lines: true },
  { k: "lede", t: "textarea", l: "Introducción" },
  { k: "image", t: "image", l: "Imagen de portada", shared: true },
  POSITION,
];
const titleText = [{ k: "title", t: "text", l: "Título" }, { k: "text", t: "textarea", l: "Texto" }];

export const SCHEMAS = {
  home: {
    sections: [
      { id: "hero", icon: "image", label: "Portada", fields: [
        { k: "heroImage", t: "image", l: "Imagen de fondo", shared: true },
        { k: "heroTitle", t: "text", l: "Título grande", hint: "Corto, de 2 a 4 palabras." },
        { k: "tagline", t: "textarea", l: "Frase de abajo", lines: true },
      ] },
      { id: "coll", icon: "cards", label: "Tarjetas que rotan", fields: [
        { k: "coll", t: "list", l: "Tarjeta", itemTitle: "brand", fields: [
          { k: "brand", t: "text", l: "Marca" }, { k: "title", t: "text", l: "Título" }, { k: "cta", t: "text", l: "Texto del enlace" },
          { k: "link", t: "select", l: "Lleva a", shared: true, options: SERVICE_OPTIONS },
          { k: "image", t: "image", l: "Imagen", shared: true },
        ] },
      ] },
      { id: "member", icon: "badge", label: "Tarjeta de marcas", fields: [
        { k: "memberValue", t: "text", l: "Cifra", shared: true },
        { k: "memberCap", t: "text", l: "Texto" },
        { k: "memberImage", t: "image", l: "Imagen", shared: true },
      ] },
      { id: "trust", icon: "star", label: "Especialidades", fields: [
        { k: "pctValue", t: "text", l: "Círculo · cifra", shared: true },
        { k: "pctCap", t: "text", l: "Círculo · texto" },
        { k: "badgeTitle", t: "text", l: "Recuadro · título" },
        { k: "badgeBody", t: "textarea", l: "Recuadro · texto" },
        { k: "trust", t: "list", l: "Especialidad", itemTitle: "name", fields: [
          { k: "word1", t: "text", l: "Palabra grande 1 (arriba izquierda)" }, { k: "word2", t: "text", l: "Palabra grande 2 (arriba derecha)" },
          { k: "word3", t: "text", l: "Palabra grande 3 (abajo izquierda, en negro)" }, { k: "word4", t: "text", l: "Palabra grande 4 (abajo derecha)" },
          { k: "name", t: "text", l: "Nombre en la tarjeta" }, { k: "role", t: "text", l: "Descripción en la tarjeta" },
          { k: "image", t: "image", l: "Imagen", shared: true },
        ] },
      ] },
      { id: "services", icon: "list", label: "Servicios", hint: "La lista sale de cada página de servicio.", fields: [
        { k: "svcEyebrow", t: "text", l: "Etiqueta" },
        { k: "svcTitle", t: "textarea", l: "Título", lines: true },
      ] },
      { id: "studio", icon: "building", label: "Estudio", fields: [
        { k: "facIcon", t: "image", l: "Imagen pequeña", shared: true },
        { k: "facTitle", t: "textarea", l: "Título", lines: true },
        { k: "facBody", t: "textarea", l: "Texto" },
        { k: "tile1", t: "group", l: "Tarjeta 1", fields: [{ k: "name", t: "text", l: "Nombre" }, { k: "desc", t: "text", l: "Descripción" }, { k: "image", t: "image", l: "Imagen", shared: true }] },
        { k: "tile2", t: "group", l: "Tarjeta 2", fields: [{ k: "name", t: "text", l: "Nombre" }, { k: "desc", t: "text", l: "Descripción" }, { k: "image", t: "image", l: "Imagen", shared: true }] },
      ] },
      { id: "stats", icon: "chart", label: "Cifras", fields: [
        { k: "statsEyebrow", t: "text", l: "Etiqueta" },
        { k: "statsTitle", t: "textarea", l: "Título", lines: true },
        { k: "stats", t: "list", l: "Cifra", itemTitle: "value", fields: [{ k: "value", t: "text", l: "Cifra (ej. 120+)", shared: true }, { k: "label", t: "text", l: "Descripción" }] },
      ] },
      { id: "testimonials", icon: "quote", label: "Testimonios", fields: [
        { k: "testiEyebrow", t: "text", l: "Etiqueta" },
        { k: "testiTitle", t: "textarea", l: "Título", lines: true },
        { k: "testimonials", t: "list", l: "Testimonio", itemTitle: "name", fields: [{ k: "quote", t: "textarea", l: "Testimonio" }, { k: "name", t: "text", l: "Nombre" }, { k: "role", t: "text", l: "Empresa o servicio" }] },
      ] },
      { id: "closing", icon: "flag", label: "Cierre y pie de página", fields: [
        { k: "ctaEyebrow", t: "text", l: "Etiqueta" },
        { k: "ctaBig", t: "textarea", l: "Frase grande", lines: true },
        { k: "blurb", t: "textarea", l: "Descripción de la agencia" },
      ] },
    ],
  },
  service: {
    sections: [
      { id: "basics", icon: "tag", label: "Nombre y resumen", fields: [
        { k: "name", t: "text", l: "Nombre del servicio" },
        { k: "summary", t: "textarea", l: "Resumen (lista del inicio)" },
        { k: "order", t: "number", l: "Orden", shared: true, hint: "1 aparece primero." },
      ] },
      { id: "hero", icon: "image", label: "Portada", fields: pageHero },
      { id: "includes", icon: "cards", label: "Qué incluye", fields: [{ k: "includes", t: "list", l: "Elemento", itemTitle: "title", fields: titleText }] },
      { id: "process", icon: "list", label: "Proceso", fields: [{ k: "process", t: "list", l: "Paso", itemTitle: "title", fields: titleText }] },
      { id: "ideal", icon: "check", label: "Ideal para", fields: [{ k: "ideal", t: "list", l: "Elemento", itemTitle: "text", fields: [{ k: "text", t: "text", l: "Texto" }] }] },
      { id: "faq", icon: "quote", label: "Preguntas frecuentes", fields: [{ k: "faq", t: "list", l: "Pregunta", itemTitle: "question", fields: [{ k: "question", t: "text", l: "Pregunta" }, { k: "answer", t: "textarea", l: "Respuesta" }] }] },
    ],
  },
  nosotros: {
    sections: [
      { id: "hero", icon: "image", label: "Portada", fields: pageHero },
      { id: "mission", icon: "flag", label: "Misión", fields: [{ k: "mission", t: "textarea", l: "Misión" }] },
      { id: "values", icon: "star", label: "Valores", fields: [{ k: "values", t: "list", l: "Valor", itemTitle: "title", fields: titleText }] },
      { id: "steps", icon: "list", label: "Cómo trabajamos", fields: [{ k: "steps", t: "list", l: "Paso", itemTitle: "title", fields: titleText }] },
      { id: "team", icon: "people", label: "Equipo", fields: [{ k: "team", t: "list", l: "Persona", itemTitle: "name", fields: [
        { k: "name", t: "text", l: "Nombre", shared: true }, { k: "role", t: "text", l: "Rol" }, { k: "photo", t: "image", l: "Foto", shared: true },
      ] }] },
    ],
  },
  casos: {
    sections: [
      { id: "hero", icon: "image", label: "Portada", fields: pageHero },
      { id: "cases", icon: "cards", label: "Casos", fields: [{ k: "cases", t: "list", l: "Caso", itemTitle: "client", fields: [
        { k: "category", t: "text", l: "Categoría" }, { k: "client", t: "text", l: "Cliente" },
        { k: "challenge", t: "textarea", l: "Reto" }, { k: "solution", t: "textarea", l: "Solución" }, { k: "result", t: "textarea", l: "Resultado" },
        { k: "image", t: "image", l: "Imagen", shared: true },
      ] }] },
    ],
  },
  blog: { sections: [{ id: "hero", icon: "image", label: "Portada", fields: pageHero }] },
  empleos: {
    sections: [
      { id: "hero", icon: "image", label: "Portada", fields: pageHero },
      { id: "areas", icon: "tag", label: "Áreas", fields: [{ k: "areas", t: "list", l: "Área", itemTitle: "text", fields: [{ k: "text", t: "text", l: "Área" }] }] },
      { id: "values", icon: "star", label: "Lo que valoramos", fields: [{ k: "values", t: "list", l: "Valor", itemTitle: "title", fields: titleText }] },
      { id: "openings", icon: "flag", label: "Vacantes", fields: [{ k: "openings", t: "textarea", l: "Texto de vacantes" }] },
    ],
  },
  legal: {
    sections: [
      { id: "hero", icon: "image", label: "Portada", fields: pageHero },
      { id: "sections", icon: "list", label: "Secciones", fields: [{ k: "sections", t: "list", l: "Sección", itemTitle: "title", fields: titleText }] },
    ],
  },
  post: {
    sections: [
      { id: "basics", icon: "tag", label: "Artículo", fields: [
        { k: "title", t: "text", l: "Título" },
        { k: "category", t: "text", l: "Categoría" },
        { k: "excerpt", t: "textarea", l: "Resumen" },
        { k: "date", t: "date", l: "Fecha", shared: true },
        { k: "published", t: "toggle", l: "Publicado", shared: true, hint: "Si está apagado, aparece en el blog como “Próximamente”." },
        { k: "image", t: "image", l: "Imagen", shared: true },
      ] },
      { id: "body", icon: "text", label: "Contenido", fields: [{ k: "body", t: "markdown", l: "Contenido", hint: "## Subtítulo · **negrita** · - lista · [enlace](https://…)" }] },
    ],
  },
  theme: {
    single: true,
    sections: [
      { id: "colors", icon: "palette", label: "Colores", hint: "Los cambios se ven al instante en la vista previa.", fields: [
        { k: "colors.brandDeep", t: "color", l: "Color principal", hint: "Portada, cifras, pie de página y menú." },
        { k: "colors.brand", t: "color", l: "Color de acento", hint: "Puntos, números y detalles." },
        { k: "colors.brandLight", t: "color", l: "Acento claro", hint: "Botones al pasar el mouse y detalles sobre el color principal." },
        { k: "colors.accentTeal", t: "color", l: "Acento secundario", hint: "Etiqueta de algunas tarjetas de imagen." },
        { k: "colors.background", t: "color", l: "Fondo" },
        { k: "colors.surface", t: "color", l: "Fondo de tarjetas y bloques" },
        { k: "colors.ink", t: "color", l: "Texto" },
        { k: "colors.inkSoft", t: "color", l: "Texto secundario" },
      ] },
      { id: "fonts", icon: "text", label: "Tipografía", fields: [
        { k: "fonts.heading", t: "select", l: "Títulos", options: FONT_OPTIONS.map(f => ({ value: f.name, label: f.name })) },
        { k: "fonts.body", t: "select", l: "Texto", options: FONT_OPTIONS.map(f => ({ value: f.name, label: f.name })) },
      ] },
      { id: "logo", icon: "image", label: "Logo", hint: "Si subes una imagen, reemplaza el ícono y el nombre. Usa un PNG o SVG con fondo transparente, en blanco o en un color que se vea sobre el azul.", fields: [
        { k: "logo.text", t: "text", l: "Nombre de la marca" },
        { k: "logo.image", t: "image", l: "Imagen del logo" },
        { k: "logo.size", t: "select", l: "Tamaño del logo", options: [{ value: "s", label: "Pequeño" }, { value: "m", label: "Mediano" }, { value: "l", label: "Grande" }] },
      ] },
    ],
  },
  settings: {
    single: true,
    sections: [
      { id: "contact", icon: "mail", label: "Contacto", fields: [
        { k: "email", t: "text", l: "Correo" }, { k: "phone", t: "text", l: "Teléfono" },
        { k: "city_es", t: "text", l: "Ciudad (español)" }, { k: "city_en", t: "text", l: "Ciudad (inglés)" },
      ] },
      { id: "social", icon: "share", label: "Redes sociales", hint: "Deja vacío para ocultar el enlace.", fields: [
        { k: "instagram", t: "text", l: "Instagram (URL completa)" }, { k: "tiktok", t: "text", l: "TikTok (URL completa)" },
        { k: "facebook", t: "text", l: "Facebook (URL completa)" }, { k: "linkedin", t: "text", l: "LinkedIn (URL completa)" },
      ] },
    ],
  },
};

// Home page texts that the page shows through its own dictionary (data-t keys) → field path
export function homeKey(k) {
  const direct = ["heroTitle", "tagline", "memberValue", "memberCap", "pctValue", "pctCap", "badgeTitle", "badgeBody", "svcEyebrow", "svcTitle",
    "facTitle", "facBody", "statsEyebrow", "statsTitle", "testiEyebrow", "testiTitle", "ctaEyebrow", "ctaBig", "blurb"];
  if (direct.includes(k)) return "home|" + k;
  let m;
  if ((m = k.match(/^tile([12])(Name|Desc)$/))) return `home|tile${m[1]}.${m[2] === "Name" ? "name" : "desc"}`;
  if ((m = k.match(/^statL(\d+)$/))) return `home|stats.${m[1]}.label`;
  if ((m = k.match(/^t([qnr])(\d+)$/))) return `home|testimonials.${m[2]}.${{ q: "quote", n: "name", r: "role" }[m[1]]}`;
  if ((m = k.match(/^fsvc(\d+)$/))) return `svcidx|${m[1]}`;
  if (k === "city") return "settings|city";
  return null;
}
export const HOME_IMAGES = { "hero-img": "home|heroImage", "mem-img": "home|memberImage", "fac-icon": "home|facIcon", tile1: "home|tile1.image", tile2: "home|tile2.image" };
