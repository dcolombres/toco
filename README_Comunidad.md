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

## 🚀 Cómo agregar contenido
Actualmente, las nuevas fotos se reciben vía WhatsApp y un administrador las carga en la base de datos a través del endpoint `/api/community/post` (o directamente en la DB para esta fase MVP).

---
*TOCO - Lo real se toca.*
