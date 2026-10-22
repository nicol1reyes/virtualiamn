# Virtualiamn: guía de puesta en marcha

El sitio se arma automáticamente a partir del contenido que editas en **virtualiamn.com/admin**. No necesitas tocar código.

```
Panel /admin → guarda en GitHub → Netlify publica → virtualiamn.com (1–2 min)
```

---

## Paso 0 · Tu usuario de GitHub

Abre `admin/config.yml` y cambia `GITHUB_USUARIO` por tu usuario de GitHub (si me lo pasas, lo dejo hecho yo).

## Paso 1 · Subir el proyecto a GitHub

1. En GitHub, haz clic en **New repository**.
2. Nombre: `virtualiamn`. Puede ser **Private**. No marques ninguna opción extra. **Create repository**.
3. En la página del repositorio vacío, haz clic en **uploading an existing file**.
4. Arrastra **todo el contenido** de esta carpeta (no la carpeta en sí): `admin`, `content`, `static`, `templates`, `build.mjs`, `package.json`, `netlify.toml`, `.gitignore`, `GUIA.md`.
5. **Commit changes**.

## Paso 2 · Conectar Netlify

1. En Netlify: **Add new project → Import an existing project → GitHub**.
2. Autoriza a Netlify y elige el repositorio `virtualiamn`.
3. La configuración se detecta sola (comando `npm run build`, carpeta `dist`). Haz clic en **Deploy**.
4. En uno o dos minutos tendrás el sitio en una dirección tipo `algo.netlify.app`.

## Paso 3 · Activar el inicio de sesión del panel

El panel usa tu cuenta de GitHub para entrar. Hay que darle permiso una sola vez:

1. En GitHub: foto de perfil → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Application name: `Virtualiamn panel`
   - Homepage URL: `https://virtualiamn.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. **Register application**. Copia el **Client ID** y genera un **Client secret** (cópialo también).
3. En Netlify, dentro del proyecto: **Project configuration → Access & security → OAuth → Install a provider → GitHub** y pega los dos valores.

## Paso 4 · Formulario de contacto

1. En Netlify: **Forms** → activa la detección de formularios (**Enable form detection**) si te lo pide.
2. Vuelve a publicar: **Deploys → Trigger deploy → Deploy project**.
3. En **Forms → Form notifications**, agrega una notificación por **Email** a tu correo.

Desde ahí, cada mensaje del formulario “Agenda una llamada” te llega al correo y también queda guardado en Netlify.

## Paso 5 · Tu dominio

1. En Netlify: **Domain management → Add a domain** → escribe `virtualiamn.com`.
2. Netlify te muestra los registros DNS exactos que debes poner donde compraste el dominio (normalmente un registro **A** para `virtualiamn.com` y un **CNAME** para `www`).
3. Al propagarse (de minutos a unas horas), Netlify activa HTTPS solo.

---

## Cómo editar el sitio

1. Entra a **virtualiamn.com/admin** → **Login with GitHub**.
2. Elige una sección: Inicio, Servicios, Páginas, Artículos del blog, Datos de contacto y redes.
3. Cada campo tiene su versión **ES** y **EN** lado a lado.
4. Haz clic en **Publicar**. En uno o dos minutos el cambio está en el sitio.

**Consejos**

- En los títulos grandes, cada renglón es una línea del título.
- En las listas (testimonios, cifras, casos), las imágenes y cifras se toman de la versión en español; en inglés solo traduces los textos.
- Un artículo del blog con **Publicado** apagado aparece como “Próximamente”. Al encenderlo, tiene su propia página.
- Las redes sociales que dejes vacías no se muestran.
- Para que otra persona pueda editar: en GitHub, repositorio → **Settings → Collaborators → Add people**. Esa persona entra al panel con su propia cuenta de GitHub.
- Todo cambio queda en el historial de GitHub y se puede recuperar.

## Estructura (por si alguien técnico lo necesita)

| Carpeta | Qué contiene |
|---|---|
| `content/` | Todo el contenido editable (JSON, ES y EN en cada archivo) |
| `static/assets/` | Estilos e imágenes (`uploads/` recibe las imágenes que subas desde el panel) |
| `templates/` | Diseño de la página de inicio, textos fijos de la interfaz y el script común |
| `build.mjs` | Arma el sitio en `dist/` a partir de `content/` |
| `admin/` | El panel (Decap CMS) y su configuración de campos |
