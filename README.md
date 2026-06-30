# Dashboard Postulantes — Migración Circular Australia

App web que lee una hoja de **Google Sheets** en vivo y presenta los postulantes en tarjetas visuales, con búsqueda, filtro por ciudad/país y enlaces clicables (URLs, correos `mailto:`, teléfonos `tel:`).

## Stack
- Node.js + Express (servidor + API `/api/data`)
- Frontend estático (HTML/CSS/JS, sin build)
- Lee la hoja como CSV vía `gviz/tq?tqx=out:csv` (no requiere API key si la hoja es pública)

## Requisito de la hoja
Google Sheets debe estar en **"Cualquiera con el enlace puede ver"**.

## Correr local
```bash
npm install
npm start
# http://localhost:3000
```

## Variables de entorno (opcionales)
| Var | Default | Descripción |
|-----|---------|-------------|
| `SHEET_ID` | `1i13nE…Pjk0` | ID de la hoja de Google Sheets |
| `SHEET_NAME` | *(vacío)* | Nombre de la pestaña (opcional) |
| `PORT` | `3000` | Puerto del servidor |

## Deploy en Railway
1. Crear proyecto en [railway.app](https://railway.app) → **Deploy from GitHub repo**.
2. Seleccionar este repo. Railway detecta Node (Nixpacks) y usa `npm start`.
3. (Opcional) Setear `SHEET_ID` en *Variables*.
4. Railway asigna una URL pública.
