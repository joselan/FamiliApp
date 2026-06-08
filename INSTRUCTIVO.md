# 📋 Instructivo FamiliApp — Configuración (hacelo desde la MacBook)

Son **2 cosas** para activar:

- **A) Google Maps** → para que las direcciones se autocompleten y validen bien.
- **B) La IA (asistente)** → para que la barra de abajo converse como Claude.

Tomate 10–15 min. No necesitás saber programar: es copiar, pegar y tocar botones.
Lo que tengas que pasarme, **me lo pegás en el chat** y yo lo dejo andando.

---

## 🅰️ GOOGLE MAPS (direcciones)

### Paso 1 — Crear el proyecto
1. Entrá a 👉 https://console.cloud.google.com/
2. Iniciá sesión con tu cuenta de Google.
3. Arriba a la izquierda, donde dice **"Selecciona un proyecto"** → **"Proyecto nuevo"**.
4. Nombre: `FamiliApp` → **Crear**. Esperá unos segundos y seleccionalo.

### Paso 2 — Activar facturación
1. Menú ☰ (arriba izquierda) → **"Facturación"**.
2. Vinculá una tarjeta. ⚠️ **Google regala USD 200 por mes** → con esta app NO vas a pagar nada.

### Paso 3 — Habilitar 3 APIs
En el buscador de arriba escribí cada una, entrá y tocá **"Habilitar"**:
- [ ] **Maps JavaScript API**
- [ ] **Places API**
- [ ] **Geocoding API**

### Paso 4 — Crear la clave (API key)
1. Menú ☰ → **"APIs y servicios"** → **"Credenciales"**.
2. Arriba: **"+ Crear credenciales"** → **"Clave de API"**.
3. Te muestra la clave (empieza con `AIzaSy...`). **Copiala.**

### Paso 5 — Restringir la clave (importante por seguridad)
En la misma clave → **"Editar"**:
1. **Restricciones de aplicaciones** → elegí **"Sitios web (HTTP referrers)"** → **Agregar** y poné:
   ```
   https://joselan.github.io/*
   ```
2. **Restricciones de API** → **"Restringir clave"** → tildá las 3: Maps JavaScript, Places, Geocoding.
3. **Guardar.**

### ✅ Qué me pasás
👉 **La clave de Google Maps** (`AIzaSy...`). Es segura porque quedó restringida a tu dominio.

---

## 🅱️ LA IA DEL ASISTENTE (Gemini + Cloudflare)

> La idea: la **clave de la IA** se guarda en un "intermediario" (Cloudflare) para que nadie la robe. La app le habla al intermediario, y el intermediario le habla a la IA.

### Paso 1 — Clave gratis de Gemini (la IA)
1. Entrá a 👉 https://aistudio.google.com/apikey
2. Iniciá sesión con Google.
3. **"Create API key"** (Crear clave) → copiala (empieza con `AIza...`).
   - Es **gratis** y **no pide tarjeta**.
4. ⚠️ **Esta clave NO me la pegues en el chat.** La vas a pegar vos en Cloudflare (paso siguiente), así queda secreta.

### Paso 2 — Crear el "intermediario" en Cloudflare
1. Entrá a 👉 https://dash.cloudflare.com/sign-up y creá una cuenta gratis (solo email).
2. En el panel, menú izquierdo → **"Workers & Pages"** → **"Create application"** → **"Create Worker"**.
3. Ponele un nombre (ej: `familiapp-ia`) → **Deploy** (se crea uno de ejemplo).
4. Tocá **"Edit code"**. Borrá TODO lo que aparece y **pegá este código**:

```js
export default {
  async fetch(request, env) {
    const ORIGIN = 'https://joselan.github.io';
    const cors = {
      'Access-Control-Allow-Origin': ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('Solo POST', { status: 405, headers: cors });
    try {
      const { prompt } = await request.json();
      if (!prompt) {
        return new Response(JSON.stringify({ text: 'Decime algo 🙂' }), { headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      const sys = 'Sos el asistente de FamiliApp, una app familiar para organizar la comida, las actividades y los eventos de dos chicos (Pipe y Pili) en Argentina. Respondé en español rioplatense, en forma breve, clara y amable.';
      const r = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + env.GEMINI_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: sys }] },
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await r.json();
      const text = (((data.candidates || [])[0] || {}).content || {}).parts?.[0]?.text || 'No pude responder.';
      return new Response(JSON.stringify({ text }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    } catch (e) {
      return new Response(JSON.stringify({ text: 'Error en el asistente.' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
  },
};
```

5. Tocá **"Deploy"** (arriba a la derecha).

### Paso 3 — Pegar la clave de Gemini como secreto
1. En el Worker, andá a la pestaña **"Settings"** → **"Variables and Secrets"** (o "Variables").
2. **"Add variable"**:
   - Name (nombre): `GEMINI_KEY`
   - Value (valor): pegá tu **clave de Gemini** del paso 1.
   - Marcá **"Encrypt"** (para que quede secreta) y **Save / Deploy**.

### Paso 4 — Copiar la dirección del Worker
1. En la pestaña principal del Worker vas a ver su **URL**, algo como:
   ```
   https://familiapp-ia.TU-USUARIO.workers.dev
   ```
2. **Copiala.**

### ✅ Qué me pasás
👉 **La URL del Worker** (`https://...workers.dev`). Con eso yo enciendo la IA en la app. (La clave de Gemini queda guardada y secreta en Cloudflare, no me la pasás.)

---

## 📨 RESUMEN — lo que me mandás al final

1. **Clave de Google Maps** → `AIzaSy...`
2. **URL del Worker de Cloudflare** → `https://...workers.dev`

Con esas 2 cosas dejo todo funcionando:
- Direcciones con autocompletado y validación de Google. ✅
- Asistente de abajo conversando como Claude. ✅

> ¿Algo no te cierra en algún paso? Mandame captura de dónde estás y te destrabo al toque.
