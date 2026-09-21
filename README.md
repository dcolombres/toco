# TOCO

Proyecto colaborativo de la plataforma TOCO (web + comunidad + paneles).

## Requisitos

- Node.js 16+
- npm

## Puesta en marcha (local)

```bash
cp .env.example .env
# Editá .env y, si hace falta, js/config.js (solo en local)
npm install
npm start
```

Abrí `http://localhost:3000`.

### Panel en GitHub Pages (modo demo)

En Pages no hay Node: el panel corre **emulado** (datos en el navegador).

1. Entrá a `…/login.html`
2. Usá:
   - Toker: `toker@demo.toco` / `demo`
   - Admin: `admin@demo.toco` / `demo`

Cuando el backend Node esté desplegado y `/api/health` responda, el panel usa la API real automáticamente.

## Colaboración

1. Creá una rama desde `main`.
2. Hacé cambios acotados y claros.
3. Abrí un Pull Request describiendo el *porqué* del cambio.
4. No subas secretos, credenciales, números personales, bases de datos ni material interno.

## Qué no va al repo

- Archivos `.env` con datos reales (y números reales en `js/config.js`)
- Bases SQLite (`*.db`)
- Prompts, instructivos de hosting, material interno o prototipos de diseño
- Credenciales, contactos o datos de usuarios reales

## Scripts

| Comando        | Descripción              |
|----------------|--------------------------|
| `npm start`    | Levanta el servidor      |
| `npm run build:css` | Compila Tailwind    |

## Licencia / uso

Uso interno del equipo TOCO. Coordiná con el equipo antes de publicar o desplegar.
