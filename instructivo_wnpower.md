# Guía de Despliegue en WNPower - TOCO Gestión

Este instructivo detalla cómo subir y configurar el sistema en el panel de **WNPower (Autogestión)** usando la herramienta **Setup Node.js App**.

---

## 🛠️ 1. Carga de Archivos
1. Ingresa a tu panel de **WNPower**.
2. Ve a **Administrador de Archivos**.
3. Te recomendamos crear una carpeta fuera de `public_html` para mayor seguridad (ej: `/home/usuario/toco_app`).
4. Sube el archivo `.zip` con el proyecto y descomprímelo ahí.

---

## 🚀 2. Configurar la App de Node.js
1. En el panel principal de WNPower, busca la sección **Software** y haz clic en **Setup Node.js App**.
2. Haz clic en el botón **Create Application**.
3. Completa los campos de la siguiente manera:
   - **Node.js version:** Elige la más reciente (ej: 18.x o 20.x).
   - **Application mode:** Development (luego cámbialo a Production).
   - **Application root:** La carpeta donde subiste los archivos (ej: `toco_app`).
   - **Application URL:** El dominio o subdominio donde quieres que funcione (ej: `gestion.tocomadera.com.ar`).
   - **Application startup file:** Escribe `server.js`.
4. Haz clic en **Create**.

---

## 📦 3. Instalar Dependencias
1. Una vez creada la app, verás una sección que dice **Detected package.json settings**.
2. Haz clic en el botón **Run JS install**. Esto descargará automáticamente `express`, `sqlite3` y demás librerías en el servidor de WNPower.
3. Espera a que termine (aparecerá un mensaje de éxito).

---

## 🗄️ 4. Base de Datos SQLite
**¡Buenas noticias!** Al usar SQLite, no necesitas configurar bases de datos MySQL en el panel de WNPower.
- El servidor de Node.js creará automáticamente el archivo `toco.db` dentro de la carpeta de la app la primera vez que alguien ingrese.
- Asegúrate de que la carpeta de la app tenga permisos de escritura (normalmente 755).

---

## 🌐 5. Archivos Estáticos (HTML/JS/CSS)
WNPower configurará un "Proxy" para que cuando alguien entre a tu URL, vea lo que sirve Node.js. 
- Nuestro archivo `server.js` ya tiene la línea `app.use(express.static(__dirname));`, por lo que servirá automáticamente el `index.html` y los paneles de gestión.

---

## 📝 6. Últimos Ajustes
1. **SSL (HTTPS):** Asegúrate de tener el certificado SSL activo en WNPower (Let's Encrypt gratuito) para que las notificaciones y el login sean seguros.
2. **Reiniciar App:** Si haces algún cambio en el código después de subirlo, siempre vuelve a **Setup Node.js App** y haz clic en **Restart**.

---

## 🚨 Solución de Problemas (WNPower)
- **Error 503 Service Unavailable:** Usualmente significa que la app no arrancó. Revisa que el **Application startup file** sea exactamente `server.js`.
- **Logs:** Puedes ver los errores haciendo clic en el botón **"Open stderr.log"** dentro de la configuración de la app de Node.js en el panel.
