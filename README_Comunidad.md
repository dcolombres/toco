# Comunidad TOCO - Documentación Técnica

Esta sección es el corazón creativo del proyecto, donde los usuarios comparten cómo integran su **TOCO** en su vida cotidiana.

## 🌟 Funcionalidades
- **Galería de Inspiración:** Visualización dinámica de fotos enviadas por la comunidad.
- **Sistema de Puntuación:** Los usuarios pueden calificar cada idea de 0 a 5 estrellas.
- **Rankings Dinámicos:** Filtros por "Más Votadas", "Más Originales" y "Las más Aesthetic".
*   **Integración con WhatsApp:** Botón directo para que los usuarios envíen sus propias fotos.

## 🛠️ Implementación Técnica

### 1. Base de Datos (SQLite)
Se agregaron dos tablas fundamentales en `server.js`:
- `community_posts`: Almacena la URL de la imagen, nombre del usuario, descripción, puntaje promedio y tags (Original/Aesthetic).
- `community_votes`: Registro de cada voto individual para calcular promedios de forma precisa.

### 2. API Endpoints
- `GET /api/community`: Obtiene todos los posts ordenados por fecha.
- `POST /api/community/vote`: Registra un nuevo voto y actualiza automáticamente el promedio del post.
- `POST /api/community/post`: Endpoint (Admin/Moderado) para subir nuevas historias a la galería.

### 3. Frontend (`comunidad.html`)
- **Grid Responsivo:** Utiliza CSS Grid y Tailwind para adaptarse a móviles y desktop.
- **Modals:** Ventana emergente para la votación sin salir de la galería.
- **Lucide Icons:** Uso de iconos para feedback visual de estrellas y categorías.

## 🚀 Cómo agregar contenido (Panel de Administrador)

El sistema ahora cuenta con un módulo de subida directa de imágenes para el administrador. El flujo es el siguiente:

1. **Recepción:** Los usuarios envían sus fotos y testimonios a través del botón de WhatsApp en la página de Comunidad.
2. **Subida:** El administrador ingresa al panel en `admin.html` (credenciales por defecto: `admin@toco.com` / `admin123`).
3. **Gestión:** En la pestaña **Gestión Comunidad**, el administrador hace clic en "Nueva Publicación".
4. **Carga:** Se abre un formulario donde puede:
   - Seleccionar el **archivo de imagen** directamente desde su computadora o celular (esto es procesado por el servidor usando la librería `multer` y guardado en `public/uploads/comunidad`).
   - Ingresar el **nombre del Toker** (usuario).
   - Escribir una breve **descripción** o testimonio.
   - Marcar etiquetas de clasificación (**Idea Original** y/o **Muy Aesthetic**).
5. **Publicación:** Al guardar, la imagen se sube automáticamente al servidor, se registra en la base de datos `toco.db` y queda visible instantáneamente en la galería pública de `comunidad.html`.
6. **Eliminación:** Desde la misma pestaña "Gestión Comunidad", el administrador puede eliminar publicaciones si lo desea.

---
*TOCO - Lo real se toca.*
