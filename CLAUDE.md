# FamiliApp — guía para Claude

PWA familiar (una sola página) para organizar comida, clima, actividades del cole
y eventos de Pipe y Pili (chicos) y José y Flor (adultos). Sin build ni framework:
HTML + Tailwind (CDN) + JS vanilla en `index.html`, con Firebase (Auth + Firestore)
y un service worker (`sw.js`).

## Usuario / Cliente

- **Nombre**: José
- **Email**: joselanglois@gmail.com
- **Celular**: Google Pixel 9 Pro (Android)
- **Computadora**: MacBook Pro 16″ (2019)
  - Procesador: 2,3 GHz Intel Core i9 de 8 núcleos
  - Gráficos: Intel UHD Graphics 630 (1536 MB)
  - Memoria: 16 GB 2667 MHz DDR4
  - macOS: Tahoe 26.1
- **Navegador**: Google Chrome en ambos dispositivos (celular y MacBook)

## Reglas de trabajo

- **Siempre hacer push directo a `main`**, nunca abrir PRs salvo que lo pida
  explícitamente (ver el flujo detallado en "Publicación").
- **Idioma**: español rioplatense (Argentina), en la app y en la comunicación.

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
  (hay un listener de `controllerchange` que recarga una vez). Versión actual: ver `sw.js`.

## Datos clave

- Acceso restringido a 2 emails (`ALLOWED` en `index.html`): florenciabressan@gmail.com
  y joselanglois@gmail.com. Mismas restricciones en `firestore.rules`.
- Colecciones Firestore: `menus_diarios`, `eventos`, `config`.
  - `config/horario` (horario del cole) y `config/comedor` (links del comedor).
  - `config/vault` + docs con auto-id y `vkind:'entry'` → **caja fuerte cifrada**
    (ver abajo). Conviven en `config` para no tener que tocar las reglas de Firestore.
- **Google Maps**: `GMAPS_KEY` (en `index.html`) ya configurada y restringida al dominio
  → autocompletado y validación de direcciones funcionando.
- **IA conversacional ENCENDIDA**: `AI_ENDPOINT` apunta al Worker de Cloudflare
  `https://familiapp-ia.joselanglois.workers.dev` (Gemini; la clave queda secreta en
  Cloudflare, no en la app). El asistente de texto funciona.
  - **PENDIENTE (cuando el dueño esté en la compu)**: actualizar el código del Worker en
    Cloudflare a la versión que **acepta imágenes** (visión). El código nuevo está en
    `INSTRUCTIVO.md`. Hasta hacerlo, el **botón de cámara de la lista de compras** (y la
    visión por IA en general) no reconoce productos; la lista escrita a mano sí anda.

## Funcionalidades clave (estado actual)

- **Encabezado**: fecha grande (tocar = calendario), franja de clima a todo el ancho
  con "📍 Liniers" y botón **Opciones** como hamburguesa (☰). Debajo, fila de **adultos**.
- **Chicos (Pipe y Pili)**: foto/avatar por clima+día, menú y actividades, y sus eventos
  en la misma columna.
- **Adultos (José y Flor)**: fila propia full-width debajo del clima, dos columnas.
  Colores de identidad: **José = verde (`#16a34a`)**, **Flor = rojo (`#dc2626`)**.
- **Eventos**: el destinatario (`nino`) puede ser de chicos (`pipe`/`pili`/`ambos`) o de
  adultos (`jose`/`flor`/`adultos`). `eventAudience()` decide en qué columna aparece;
  un evento de adulto solo se ve en su perfil salvo que sea compartido (`adultos`).
  - Tarjeta con **calendario grande** y **countdown de colores** la última semana
    (amarillo casi blanco a 7 días → verde llamativo el día del evento, `calColors()`).
  - Popup con toda la info + botones **Google Maps** y **Waze** si hay dirección.
- **Asistente IA**: **botón flotante "✨ IA"** (abajo a la derecha) que abre un panel
  con chat, micrófono (dictado por voz) y "+" (agregar evento a mano / subir flyer).
  Se cierra con la ✕ o tocando afuera. Crea eventos desde texto/voz; con `AI_ENDPOINT`
  conectado, además conversa (Gemini). Letra grande.
- **Lista de compras (compartida)**: en `config/compras` (un doc con `items[]`),
  sincronizada en vivo (`onSnapshot`) entre los dos celulares. Se abre desde Opciones.
  Botón de **cámara**: saca/sube foto de un producto → la IA lo reconoce y pregunta antes
  de agregarlo (requiere el Worker con visión, ver pendiente arriba).
- **Recordatorios**: los eventos que se sincronizan a Google Calendar llevan avisos
  automáticos (con hora: 1 día y 2 hs antes; todo el día: el día anterior) → el celu
  notifica vía Google Calendar (no hay push propio de la PWA).
- **Caja fuerte (documentos y datos)**: cifrado de extremo a extremo en el navegador
  (Web Crypto: PBKDF2 + AES-GCM) con **contraseña maestra**. En Firestore solo queda
  texto ilegible. Guarda **notas** y **archivos** (fotos/PDF, ~700 KB máx). Sin la
  contraseña no se puede recuperar nada. Se abre desde Opciones.
- **OCR de flyer** (Tesseract.js en el navegador, `parseFlyer`): autocompleta fecha,
  hora (con AM/PM), lugar (prioriza calle real, evita confundir horarios con
  direcciones). El **título** no se autocompleta (poco confiable en flyers) → a mano.
- **Ícono / PWA**: ícono oficial de FamiliApp = **tres casitas** (azul/verde/rojo) con
  fútbol, árbol, libro del cole y estrella. Generados `icon-192.png`, `icon-512.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png` y `favicon-32.png` desde la imagen del
  dueño y enganchados al `manifest` y al `<head>`. (Para verlo en el celu hay que
  reinstalar la PWA.)

## Pendiente — Fotos de avatares (RECORDARLE al dueño cuando diga que está en la compu)

La lógica de avatares ya elige la ropa por clima/día (`AVATAR_STYLE = 'foto'`,
`updateAvatars`/`avatarCandidates` en `index.html`). Ya están las fotos **base**
(`pipe`/`pili` × `_normal`/`_frio`/`_mucho_frio`). Faltan las **versiones especiales**
(el dueño las arma). Formato: vertical 3:4, cuerpo entero, fondo claro, mismo encuadre.
Puede mandar PNG/JPG y se convierten a `.webp`. Mientras falten, cae a la foto base
(no se rompe nada).

- **Finde/feriados (rotan, `FINDE_VARIANTS = 3`):**
  - Pipe (Boca/Argentina): `pipe_finde1_{clima}` (Boca), `pipe_finde2_{clima}` (Argentina), `pipe_finde3_{clima}`.
  - Pili (unicornio/Minnie/rosa): `pili_finde1_{clima}`, `pili_finde2_{clima}`, `pili_finde3_{clima}`.
- **Lluvia (solo Pili):** `pili_lluvia_{clima}` (piloto + paraguas + botas).
- **Fútbol (solo Pipe):** `pipe_futbol_{clima}` (ropa de fútbol + botines).

(Probar findes deslizando a un sábado/domingo; fútbol = días con "fútbol/botines" en el
horario de Pipe; lluvia = automático según el pronóstico.)
