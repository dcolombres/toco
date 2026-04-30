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
   - Centro de notificaciones y pedidos de stock (incluye **Devoluciones**).
3. **Panel de Control Master (Admin):**
   - **Analítica Avanzada:** Grilla de 4 gráficos (Tendencia Anual, Ranking Emprendedores, Ranking Comercios y Deuda Global).
   - **Gestión de Costos:** Módulo para controlar Costos Fijos, Variables e **Inversión Inicial** (Gasto Único).
   - **Gestión de Usuarios:** ABM completo con edición de perfiles y contraseñas.
   - **Logística Inversa:** Aprobación de devoluciones de mercadería que reintegran stock al Master.

---

## 🚀 Despliegue en Producción (cPanel)

El repositorio incluye una configuración lista para despliegue en cPanel:

1. **`.cpanel.yml`**: Configuración automática para mover archivos desde el repositorio Git hacia la carpeta pública (ej: `public_html/toco`).
2. **Sincronización de DB**: El archivo `toco.db` está incluido en el control de versiones para asegurar que las tablas y costos base se desplieguen correctamente.

### Pasos para Actualizar:
- Realizar `git push origin main`.
- En cPanel Git Version Control: `Update from Remote` -> `Deploy Head Revision`.
- **Importante**: Reiniciar la aplicación Node.js en cPanel para aplicar cambios en `server.js`.

---

## 🛠️ Tecnologías y Requisitos

- **Node.js:** v16.x o superior.
- **SQLite3:** Motor de base de datos embebido (archivo local `toco.db`).
- **NPM:** Gestor de paquetes.

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
