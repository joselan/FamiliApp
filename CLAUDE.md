# FamiliApp — guía para Claude

PWA familiar (una sola página) para organizar comida, clima, actividades del cole
y eventos de Pipe y Pili. Sin build ni framework: HTML + Tailwind (CDN) + JS vanilla
en `index.html`, con Firebase (Auth + Firestore) y un service worker (`sw.js`).

## Publicación (IMPORTANTE)

- **El sitio en vivo se publica desde la rama `main`** (GitHub Pages →
  https://joselan.github.io/FamiliApp/). Lo que no está en `main`, NO se ve en la app.
- Se desarrolla en la rama de trabajo `claude/eloquent-turing-c2dptp`.
- **Autorización permanente del dueño**: al terminar un cambio, publicar directo a `main`
  SIN volver a preguntar. Flujo:
  1. Commit en la rama de trabajo.
  2. `git push -u origin <rama-de-trabajo>`
  3. `git push origin <rama-de-trabajo>:main` (es fast-forward; si falla por no-FF,
     ahí sí avisar antes de forzar nada).
- GitHub Pages republica solo en ~1-3 min tras el push a `main`.

## Caché / PWA

- Al cambiar `index.html`, `sw.js` o assets, **subir la versión** del caché en `sw.js`
  (`const CACHE = 'familiapp-vNN'`). Así el service worker se actualiza y recarga solo
  (hay un listener de `controllerchange` que recarga una vez).

## Datos clave

- Acceso restringido a 2 emails (`ALLOWED` en `index.html`): florenciabressan@gmail.com
  y joselanglois@gmail.com. Mismas restricciones en `firestore.rules`.
- Colecciones Firestore: `menus_diarios`, `eventos`, `config` (doc `horario`).
- Idioma: español rioplatense.
- Pendiente: `AI_ENDPOINT` (en `index.html`) está vacío → falta la URL del Worker de
  Cloudflare para encender la IA conversacional (ver `INSTRUCTIVO.md`).

## Pendiente — Fotos de avatares (RECORDARLE al dueño cuando diga que está en la compu)

La lógica de avatares ya elige la ropa por clima/día (`AVATAR_STYLE = 'foto'`,
`updateAvatars`/`avatarCandidates` en `index.html`). Faltan **las fotos** (el dueño las
arma). Formato: vertical 3:4, cuerpo entero, fondo claro, mismo encuadre que las actuales.
Puede mandar PNG/JPG y se convierten a `.webp`. Sufijos de clima: `_normal`, `_frio`,
`_mucho_frio`. Mientras falten, cae a la foto base (no se rompe nada).

- **Finde/feriados (rotan, `FINDE_VARIANTS = 3`):**
  - Pipe (Boca/Argentina): `pipe_finde1_{clima}` (Boca), `pipe_finde2_{clima}` (Argentina), `pipe_finde3_{clima}`.
  - Pili (unicornio/Minnie/rosa): `pili_finde1_{clima}`, `pili_finde2_{clima}`, `pili_finde3_{clima}`.
- **Lluvia (solo Pili):** `pili_lluvia_{clima}` (piloto + paraguas + botas).
- **Fútbol (solo Pipe):** `pipe_futbol_{clima}` (ropa de fútbol + botines).

(Probar findes deslizando a un sábado/domingo; fútbol = días con "fútbol/botines" en el
horario de Pipe; lluvia = automático según el pronóstico.)
