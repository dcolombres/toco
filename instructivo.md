# Instructivo de Implementación - TOCO Gestión

Este documento explica paso a paso cómo poner en marcha el sistema TOCO Emprende tanto en tu computadora local como en un servidor de producción.

---

## 💻 1. Implementación en Local

Sigue estos pasos para desarrollar o probar el sistema en tu PC.

### Requisitos Previos:
- Tener instalado **Node.js** (descárgalo en [nodejs.org](https://nodejs.org/)).

### Pasos:
1. **Descargar/Copiar el proyecto:** Asegúrate de tener todos los archivos en una carpeta (ej: `D:\Develop\TOCO`).
2. **Abrir la Terminal:** Entra a esa carpeta usando la terminal (o PowerShell).
3. **Instalar Dependencias:** Ejecuta el siguiente comando para descargar las librerías necesarias (Express, SQLite3, CORS):
   ```bash
   npm install
   ```
4. **Iniciar el Servidor:** Ejecuta el comando de arranque:
   ```bash
   npm start
   ```
5. **Acceder:** Abre tu navegador (Chrome, Edge, etc.) y escribe:
   `http://localhost:3000`

### Usuarios de Prueba:
- **Administrador:** `admin@toco.com` / `admin123`
- **Toker:** Puedes crear uno nuevo desde el Panel Admin o usar los que vienen por defecto en la base de datos una vez creados.

---

## 🌐 2. Implementación en Servidor (Hosting)

Para subir el sistema a internet, puedes usar servicios como **Render, Railway o un VPS (DigitalOcean/Linode)**.

### Pasos para un VPS o Servidor Linux:
1. **Subir los archivos:** Usa FileZilla o Git para subir toda la carpeta al servidor.
2. **Instalar Node.js en el servidor:** 
   ```bash
   sudo apt update
   ```
3. **Instalar dependencias:** Igual que en local, ejecuta `npm install` dentro de la carpeta del proyecto en el servidor.
4. **Configurar el puerto:** El servidor usa por defecto el puerto `3000`. Asegúrate de que el firewall del hosting permita tráfico por ese puerto.
5. **Mantenerlo siempre activo:** Se recomienda usar **PM2** para que el servidor no se apague si cierras la consola:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "toco-app"
   pm2 save
   ```

### Consideraciones de la Base de Datos:
El archivo `toco.db` es tu base de datos completa. 
- **Respaldo:** Para hacer un backup, simplemente descarga una copia de ese archivo.
- **Persistencia:** Si usas servicios como Heroku o Render (plan gratis), recuerda que los archivos pueden borrarse al reiniciar. Se recomienda usar un volumen persistente o una DB externa (PostgreSQL) para implementaciones a gran escala.

---

## 🛠️ 3. Tareas de Mantenimiento

### ¿Cómo ver los datos de la DB manualmente?
Puedes usar una herramienta gratuita llamada **DB Browser for SQLite**. Solo tienes que abrir el archivo `toco.db` con ese programa y podrás editar o ver todos los registros como si fuera un Excel.

### ¿Cómo cambiar el precio del TOCO o el costo?
Edita las primeras líneas del archivo `/js/app.js` en la constante `TOCO_CONFIG`.
