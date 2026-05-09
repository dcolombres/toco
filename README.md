# TOCO - Sistema de Gestión y Comunidad

Este es el ecosistema digital de **TOCO**, diseñado para empoderar a jóvenes argentinos como embajadores de lo real (**Tokers**). El sistema integra una Web Institucional, una sección de Comunidad participativa y un Panel de Gestión robusto.

## 🚀 Arquitectura del Proyecto

El sistema utiliza una arquitectura **Full-Stack** ligera y eficiente, optimizada para servidores tipo cPanel.

- **Frontend:** HTML5, Tailwind CSS, JavaScript Vanilla, Lucide Icons, Chart.js.
- **Backend:** Node.js + Express.js.
- **Base de Datos:** SQLite (Persistencia en archivo local `toco.db`).

### Módulos Principales:
1. **Web Institucional (`index.html`):** Landing page con el Manifiesto TOCO y captación de embajadores.
2. **Comunidad TOCO (`comunidad.html`):** Galería participativa con sistema de votación (0-5 estrellas) y rankings de ideas de uso.
3. **Panel Toker (Reseller):** Dashboard de ventas, CRM de locales y gestión de stock/pedidos.
4. **Panel Admin (Master):** Analítica global, gestión de costos, usuarios y logística inversa.

---

## 📸 Sección Comunidad TOCO
Para más detalles sobre la implementación técnica de la galería y el sistema de votos, consulta el archivo específico:
👉 **[README_Comunidad.md](./README_Comunidad.md)**

---

## 🚀 Despliegue en Producción (cPanel)
El repositorio incluye una configuración lista para despliegue:
1. **`.cpanel.yml`**: Automatización de copia de archivos.
2. **Sincronización de DB**: `toco.db` incluido para asegurar tablas base.

### Pasos para Actualizar:
- `git push origin main`.
- En cPanel Git: `Update from Remote` -> `Deploy Head Revision`.
- **Reiniciar App Node.js** en cPanel para aplicar cambios en `server.js`.

---

## 🛠️ Tecnologías y Requisitos
- **Node.js:** v16.x+.
- **SQLite3:** Base de datos local.
- **NPM:** `express`, `sqlite3`, `cors`.

---

## 📂 Repositorio Oficial
[https://github.com/dcolombres/toco](https://github.com/dcolombres/toco)

---

## 📧 Soporte
Contactar al equipo de desarrollo de TOCO para nuevas funcionalidades.
