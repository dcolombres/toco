# TOCO Emprende - Sistema de Gestión Full-Stack

Este es el ecosistema digital de **TOCO Emprende**, diseñado para empoderar a jóvenes emprendedores argentinos. El sistema incluye una Web Institucional y un Panel de Gestión robusto para revendedores y administradores.

## 🚀 Arquitectura del Proyecto

El sistema está construido con una arquitectura moderna de tipo **SPA (Single Page Application)** comunicada con un servidor **Node.js**.

- **Frontend:** HTML5, Tailwind CSS, JavaScript Vanilla, Lucide Icons, Chart.js.
- **Backend:** Node.js + Express.js.
- **Base de Datos:** SQLite (Almacenamiento en archivo local `toco.db`).

### Módulos Principales:
1. **Web Institucional (`index.html`):** Landing page de alto impacto para captación de nuevos emprendedores.
2. **Sistema de Gestión (Revendedores):** 
   - Dashboard de Stock, Ganancias y Deudas.
   - CRM de Comercios (ABM de locales).
   - Analítica de ventas interactiva.
   - Centro de notificaciones y pedidos de stock.
3. **Panel de Control Master (Admin):**
   - Control global de métricas del ecosistema.
   - ABM de Usuarios (Gestionar emprendedores).
   - Sistema de aprobación de stock con un clic.

---

## 🛠️ Tecnologías y Requisitos

Para desarrolladores que deseen extender este sistema:

- **Node.js:** v16.x o superior.
- **SQLite3:** Motor de base de datos embebido.
- **NPM:** Gestor de paquetes.

### Estructura de Archivos Clave:
- `/server.js`: El cerebro del backend. Contiene los Endpoints de la API y la lógica de la DB.
- `/js/app.js`: El motor del frontend. Gestiona el estado y las llamadas `fetch`.
- `/css/styles.css`: Estilos compartidos y sistema de diseño "Vibrant Growth".
- `/toco.db`: Archivo de base de datos (se genera automáticamente).

---

## 🔒 Seguridad y Roles

El sistema maneja dos niveles de acceso:
- **Admin:** Acceso total, gestión de stock maestro y usuarios.
- **Reseller:** Acceso a métricas personales, CRM propio e historial de ventas privado.

*Nota: La autenticación actual es por sesión local. Para producción, se recomienda implementar JWT (JSON Web Tokens).*

---

## 📂 Repositorio Oficial
Puedes encontrar el código fuente y seguir el desarrollo en:
[https://github.com/dcolombres/toco](https://github.com/dcolombres/toco)

---

## 📧 Soporte y Contacto
Para consultas técnicas o implementación de nuevas funcionalidades, contactar al equipo de desarrollo de TOCO Emprende.
