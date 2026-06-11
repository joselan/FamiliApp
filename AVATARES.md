# Plan: regenerar avatares de Pipe y Pili con Gemini (opción A)

Este documento es para que una sesión de Claude Code pueda ejecutar el plan completo
sin contexto previo. El dueño (José) ya aprobó este flujo.

## Objetivo

Reemplazar las fotos de avatar de los chicos generando, con la API de imágenes de
Gemini, todas las variantes de ropa que usa `avatarCandidates()` en `index.html`,
a partir de una **foto base nueva** (los dos chicos juntos con uniforme de colegio
de verano: remera manga corta y pantalón corto) + fotos de las prendas reales.

## Qué necesita la sesión antes de arrancar

1. **`GEMINI_API_KEY`** como variable de entorno (configurada en el environment de
   Claude Code en la web). Verificar con `test -n "$GEMINI_API_KEY"`.
2. **Foto base** adjunta en el chat (los dos juntos, uniforme de verano).
3. **Fotos de las prendas** adjuntas (pueden venir de a tandas; generar lo que haya):
   - [ ] Uniforme de invierno de Pipe (buzo + pantalón largo)
   - [ ] Campera de abrigo de Pipe
   - [ ] Uniforme de invierno de Pili
   - [ ] Campera de abrigo de Pili
   - [ ] Equipo de fútbol + botines (Pipe)
   - [ ] Piloto + botas de lluvia (+ paraguas si hay) (Pili)
   - [ ] Camiseta de Boca (Pipe)
   - [ ] Camiseta de Argentina (Pipe)
   - [ ] Ropa de calle libre (Pipe)
   - [ ] Ropa de unicornio (Pili)
   - [ ] Ropa de Minnie (Pili)
   - [ ] Conjunto rosa (Pili)

## Archivos destino (14)

| Archivo | Contenido | Prompt |
|---|---|---|
| `pipe_normal.webp` | Uniforme verano (recorte de la foto base) | 1 |
| `pili_normal.webp` | Uniforme verano (recorte de la foto base) | 2 |
| `pipe_frio.webp` | Uniforme invierno | 3 |
| `pipe_mucho_frio.webp` | Uniforme invierno + campera | 4 |
| `pili_frio.webp` | Uniforme invierno | 5 |
| `pili_mucho_frio.webp` | Uniforme invierno + campera | 6 |
| `pipe_futbol.webp` | Equipo de fútbol + botines | 7 |
| `pili_lluvia.webp` | Piloto + paraguas + botas | 8 |
| `pipe_finde1.webp` | Camiseta de Boca | 9 |
| `pipe_finde2.webp` | Camiseta de Argentina | 10 |
| `pipe_finde3.webp` | Ropa de calle libre | 11 |
| `pili_finde1.webp` | Unicornio | 12 |
| `pili_finde2.webp` | Minnie | 13 |
| `pili_finde3.webp` | Conjunto rosa | 14 |

Las variantes por clima de fútbol/lluvia/finde (`pipe_futbol_frio.webp`, etc.) son
**opcionales** (la app cae a la versión sin sufijo). Ronda 2, solo si José la pide:
repetir el prompt agregando "Agregale encima un buzo o campera liviana, como para un
día fresco (12–17 °C)" (`_frio`) o "Agregale encima una campera bien abrigada, como
para un día de mucho frío (menos de 12 °C)" (`_mucho_frio`).

## Pipeline

1. Verificar `GEMINI_API_KEY` y guardar las imágenes adjuntas del chat en una carpeta
   de trabajo (p. ej. `/tmp/avatares/`).
2. Listar modelos disponibles (`GET /v1beta/models`) y usar el **mejor modelo de
   imagen** disponible (p. ej. `gemini-3-pro-image-preview` o, si no está,
   `gemini-2.5-flash-image`). SDK `google-genai` (pip) o REST con `curl`.
3. Generar **de a una** imagen por prompt (abajo), adjuntando la foto base (imagen A)
   y la foto de la prenda (imagen B) donde corresponda. Pedir salida vertical 3:4.
   Para los prompts 3 en adelante usar como imagen A el resultado individual de los
   prompts 1 y 2 (no la foto de los dos juntos).
4. **Mostrar cada resultado a José** (SendUserFile) y esperar su OK antes de
   publicar; regenerar las que pida (la cara tiene que ser fiel).
5. Convertir las aprobadas a `.webp` (Pillow o `cwebp`, calidad ~80, tamaño máx.
   ~800 px de alto) con los nombres exactos de la tabla, en la raíz del repo.
6. Subir la versión del caché en `sw.js` (`const CACHE = 'familiapp-vNN'`).
7. Commit en la rama de trabajo, push, y push a `main` (fast-forward) según el flujo
   de publicación de `CLAUDE.md`. Las fotos `.png` viejas de la raíz pueden quedar.

## Prompts

Reglas comunes: mantener exactamente cara, peinado y proporciones del nene/a de la
imagen A; de pie, cuerpo entero de la cabeza a los pies, mirando al frente; fondo
liso claro; formato vertical 3:4; cambiar ÚNICAMENTE la ropa; reproducir fiel
colores, escudos y estampados de la prenda de la imagen B.

1. **pipe_normal** (A = foto de los dos): "Generá una imagen SOLO del nene (el varón),
   recortándolo y completando la escena. Mantené su ropa actual (uniforme del colegio:
   remera manga corta y pantalón corto)." + reglas comunes.
2. **pili_normal** (A = foto de los dos): ídem 1 pero "SOLO de la nena".
3. **pipe_frio** (B = uniforme invierno Pipe): "Cambiá la ropa: uniforme de invierno
   del colegio de la imagen B (buzo manga larga y pantalón largo)."
4. **pipe_mucho_frio** (B = campera Pipe): "Uniforme de invierno del colegio y encima
   la campera abrigada de la imagen B, cerrada, como para un día de mucho frío."
5. **pili_frio** (B = uniforme invierno Pili): igual que 3.
6. **pili_mucho_frio** (B = campera Pili): igual que 4.
7. **pipe_futbol** (B = equipo fútbol): "Equipo de fútbol completo como el de la
   imagen B: camiseta, short, medias de fútbol largas y botines."
8. **pili_lluvia** (B = piloto/botas): "Piloto de la imagen B sobre el uniforme del
   colegio, botas de lluvia, y sostiene un paraguas abierto con una mano."
9. **pipe_finde1** (B = camiseta Boca): "Ropa cómoda de finde: camiseta de Boca
   Juniors de la imagen B, short o pantalón deportivo, zapatillas."
10. **pipe_finde2** (B = camiseta Argentina): ídem 9 con la camiseta de la Selección.
11. **pipe_finde3** (B = ropa libre): "La ropa de calle de la imagen B, zapatillas."
12. **pili_finde1** (B = unicornio): "El conjunto con unicornio de la imagen B
    (remera o vestido), calzado cómodo."
13. **pili_finde2** (B = Minnie): "El conjunto de Minnie Mouse de la imagen B."
14. **pili_finde3** (B = conjunto rosa): "El conjunto rosa de la imagen B."
