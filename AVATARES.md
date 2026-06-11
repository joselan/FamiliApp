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
- **Lógica semanal de ropa (regla del dueño, 12/6/26)**:
  - Lun a jue: los dos de uniforme según clima.
  - Viernes: Pili de uniforme; Pipe de particular pero NUNCA con ropa de Boca
    (regla del colegio) → rota pipe_finde2 (Argentina) y pipe_finde3 (Real
    Madrid), con pipe_futbol (equipo de Argentina) como fallback.
  - Findes y feriados: los dos con ropa libre (ahí Boca sí está permitido).
- `pipe_futbol`: equipo de la Selección Argentina + botines (subida como
  "pipe_argentina"). Se usa SOLO como fallback del viernes de Pipe; la regla
  vieja "día con fútbol en el horario → ropa de fútbol" se eliminó: NO reactivarla.
- `pili_argentina`: imagen extra generada; DÓNDE usarla está pendiente de decisión
  del dueño (opciones: 4to look de finde / días de partido / guardar).

## Flujo de archivos (IMPORTANTE)

Los adjuntos del chat NO llegan al disco de este entorno. El intercambio es por la
carpeta **"FamiliApp" de Google Drive** del dueño (MCP Google_Drive conectado;
carpeta id `14tX8nXznFmZwyoQiXtYKY8NvbMF4Mq9J`). El dueño sube ahí; Claude baja con
`mcp__Google_Drive__download_file_content` (base64 → decodificar con python; los
resultados grandes se persisten a .txt — decodificar desde ese archivo, NUNCA
transcribir base64 a mano; para respuestas inline usar un subagente que parsea su
propio transcript .jsonl).

## Estado de las imágenes finales (estilo Pixar)

El dueño sube a Drive → carpeta "Avatares" dentro de "FamiliApp"
(id `1O53k8otJ4f6mBLJYpANpbOincdjRV0le`). Integradas = ya convertidas a .webp,
en el repo y publicadas en main.

- [x] `pipe_normal` (base, "Pipe calor.png") — INTEGRADA 12/6
- [x] `pili_normal` (base, "Pili calor.png") — INTEGRADA 12/6
- [x] `pipe_frio` — INTEGRADA 12/6
- [x] `pipe_mucho_frio` — INTEGRADA 12/6
- [x] `pili_frio` — INTEGRADA 12/6
- [ ] `pili_mucho_frio` — el dueño dijo que la hizo pero NO estaba en Drive;
      mientras tanto `pili_mucho_frio.webp` = copia provisoria de la de frío.
      Cuando aparezca en Drive, reemplazar.
- [x] `pipe_futbol` (subida como "pipe_argentina.png") — en el repo; se usa como
      fallback del viernes de Pipe (ver "Lógica semanal" arriba).
- [x] `pili_argentina.webp` — convertida y en el repo, SIN cablear (decisión
      pendiente del dueño: días de fútbol de Pipe / 4to finde / guardar)
- [x] `pipe_finde3` (Real Madrid, "Pipe Real.png") — INTEGRADA 12/6
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
