# Avatares de Pipe y Pili — estado y pipeline (ACTUALIZADO 2026-06-11)

Documento para que cualquier sesión de Claude Code retome el trabajo sin contexto
previo. El dueño (José) dirige; este es el estado real del proyecto.

## Decisiones tomadas (no re-preguntar)

- **Estilo nuevo: dibujo 3D tipo Pixar** (NO fotorrealista). Los PNG fotorrealistas
  que están en la raíz del repo (`pipe_normal.png`, `pili_frio.png`, etc.) son de una
  tanda anterior DESCARTADA. Los `.webp` actuales (fotos reales) se reemplazan.
- **Generación MANUAL por el dueño** en la app de Gemini (gemini.google.com), gratis.
  NO usar la API de imágenes con `GEMINI_API_KEY`: el free tier tiene la generación
  de imágenes en `limit: 0` (error 429) y el dueño decidió NO activar facturación.
- **Pili rota 3 looks de finde**: unicornio, Minnie, princesa (la calza rosa quedó
  afuera). Pipe: Boca, Argentina, Real Madrid.
- `pipe_futbol`: equipo de la Selección Argentina + botines (el dueño guardó esa
  imagen como "pipe_argentina" → renombrar a `pipe_futbol.webp` al integrar).
- `pili_argentina`: imagen extra generada; DÓNDE usarla está pendiente de decisión
  del dueño (opciones: mismos días de fútbol que Pipe / 4to look de finde / guardar).

## Flujo de archivos (IMPORTANTE)

Los adjuntos del chat NO llegan al disco de este entorno. El intercambio es por la
carpeta **"FamiliApp" de Google Drive** del dueño (MCP Google_Drive conectado;
carpeta id `14tX8nXznFmZwyoQiXtYKY8NvbMF4Mq9J`). El dueño sube ahí; Claude baja con
`mcp__Google_Drive__download_file_content` (base64 → decodificar con python; los
resultados grandes se persisten a .txt — decodificar desde ese archivo, NUNCA
transcribir base64 a mano; para respuestas inline usar un subagente que parsea su
propio transcript .jsonl).

## Estado de las imágenes finales (estilo Pixar)

Generadas por el dueño (al 11/6 a la noche; las marcadas ☁️ ya están en Drive):
- [ ] `pipe_normal` (base, uniforme verano) — hecha, falta subir a Drive
- [ ] `pili_normal` (base, uniforme verano) — hecha, falta subir a Drive
- [ ] `pipe_frio` — hecha, falta subir
- [ ] `pipe_mucho_frio` — hecha, falta subir
- [ ] `pili_frio` — hecha, falta subir
- [ ] `pili_mucho_frio` — hecha, falta subir
- [ ] `pipe_futbol` (guardada como "pipe_argentina") — hecha, falta subir
- [ ] `pili_argentina` (destino a definir) — hecha, falta subir
- [ ] `pipe_finde3` (Real Madrid) — hecha, falta subir
- [ ] `pipe_finde1` (Boca) — PENDIENTE de generar
- [ ] `pipe_finde2` (Argentina, ropa de finde) — PENDIENTE
- [ ] `pili_lluvia` (piloto + botas + paraguas) — PENDIENTE
- [ ] `pili_finde1` (unicornio) — PENDIENTE
- [ ] `pili_finde2` (Minnie) — PENDIENTE
- [ ] `pili_finde3` (princesa) — PENDIENTE

Los prompts que usa el dueño están en el historial del chat (sesión
session_01BnWCytJdJyNnuoW9UsT4fW); patrón: imagen base del chico + foto de la
prenda + "mantené cara/pose/estilo 3D, cambiá SOLO la ropa, vertical 3:4".

## Prendas de referencia (ya descargadas en /tmp/avatares/ de la sesión del 11/6;
re-descargar de Drive si la sesión es nueva)

buzo_nieves.jpg, pantalon_nieves.jpg, campera_nieves.jpg (uniforme invierno NSLN),
camiseta_boca.avif, camiseta_argentina (JM5897...webp), botines (adid9045...webp),
vestido_unicornio (2bb5844d...webp), calza rosa (17710727...webp, DESCARTADA),
minnie_remera.webp, piloto_pili.webp, botas_pili.webp, vestido_princesa_pili.webp.

## Pipeline de integración (cuando el dueño avise que subió a Drive)

1. Listar la carpeta de Drive y bajar las imágenes nuevas (ver "Flujo de archivos").
2. Revisarlas (Read) y mandárselas al dueño (SendUserFile) si hace falta confirmar.
3. Convertir a `.webp` con los nombres EXACTOS de la lista (Pillow, calidad ~80,
   alto máx ~1000 px, mantener 3:4). `pipe_argentina` → `pipe_futbol.webp`.
4. Reemplazar en la raíz del repo. NO borrar los png viejos salvo pedido.
5. Subir versión de caché en `sw.js` (`const CACHE = 'familiapp-vNN'`).
6. Commit en la rama de trabajo, push, y push a `main` (flujo de `CLAUDE.md`).
7. Avisar al dueño que recargue la PWA (~2-3 min).

Si el dueño quiere cablear `pili_argentina`: tocar `avatarCandidates()` en
`index.html` según la opción que elija.
