Actuá como un desarrollador full-stack especializado en paneles de control (dashboards) para emprendedores jóvenes. Necesito crear un sistema de gestión simple, mobile-first, seguro y funcional para los revendedores del proyecto TOCO Emprende.

Descripción del proyecto:
TOCO Emprende es un programa donde jóvenes de 18 a 25 años revenden cubos de madera (TOCOs). Cada emprendedor recibe un stock inicial en modalidad comodato (paga solo lo que vende). Cada TOCO tiene:

Costo para el emprendedor: $1.000 (lo que debe pagar cuando lo vende)

Precio de venta al comercio: $5.000

Ganancia del emprendedor: $4.000 por TOCO

Usuario del sistema:
Cada emprendedor registrado tendrá acceso a su propio panel con login personalizado (email + contraseña o acceso por código único).

Objetivo del panel:
Que el emprendedor pueda, desde su celular o computadora:

Ver su stock actual disponible

Registrar una venta (con datos del comercio)

Ver sus ganancias acumuladas

Ver cuánto debe pagar

Ver historial de ventas

Solicitar más stock

[ESTRUCTURA DEL SISTEMA]
El sistema debe tener 3 pantallas principales (tipo SPA o multi-page):

Pantalla	Función
Login	Acceso seguro para cada emprendedor
Dashboard (principal)	Resumen: stock, ganancias, deuda, últimos movimientos
Registro de venta	Formulario rápido para cargar una nueva venta
Historial	Listado de todas las ventas realizadas (filtrable por fecha)
[DISEÑO Y ESTÉTICA]
Paleta de colores (misma que la web institucional para consistencia):

Fondo principal: #F9F9F9 (gris muy claro)

Color primario (botones activos): #FFB703 (amarillo mostaza)

Color secundario: #2A9D8F (verde confianza)

Color de alerta (deuda): #E63946 (rojo suave)

Color de éxito (ganancia): #2A9D8F (verde)

Texto principal: #2B2D42 (gris oscuro)

Texto secundario: #6C757D (gris medio)

Tarjetas: #FFFFFF con sombra suave (box-shadow: 0 4px 12px rgba(0,0,0,0.05))

Tipografía:

Títulos: Montserrat o Inter (bold)

Números grandes: Monoespaciada o Inter (bold, tamaño grande)

Cuerpo: Inter o Poppins (regular, 14-16px)

Estilo visual:

Mobile FIRST (diseñar primero para celular, columnas de 1)

Tarjetas con bordes redondeados (12px)

Íconos grandes y claros (FontAwesome o emojis)

Barra de navegación inferior (tipo app) para móvil: Inicio | Registrar venta | Historial | Mi perfil

Versión escritorio: menú lateral o superior

Modo oscuro (opcional): Que se pueda activar, pero no obligatorio.

[FUNCIONALIDADES DETALLADAS]
PANTALLA 1: LOGIN
Elementos visuales:

Logo: "TOCO Emprende"

Título: "Panel de revendedor"

Campo: Email (requerido)

Campo: Contraseña (requerido)

Botón: "Ingresar"

Link: "¿Olvidaste tu contraseña?" (opcional, puede ser contacto por WhatsApp)

Validaciones:

Si el email o contraseña son incorrectos → mensaje de error

Si el login es exitoso → redirigir al Dashboard

Seguridad:

Las contraseñas deben estar hasheadas (bcrypt o similar)

El sistema debe usar sesiones (localStorage con token JWT o sessionStorage)

PANTALLA 2: DASHBOARD (PRINCIPAL)
Header:

Saludo: "¡Hola, [Nombre del emprendedor]!"

Fecha actual (ej: "Lunes, 15 de mayo")

Tarjeta de Stock (arriba, destacada):

text
📦 STOCK DISPONIBLE
[XX] unidades
[ Botón: Solicitar más stock → ]
Tarjeta de Ganancias:

text
💰 GANANCIAS TOTALES
$ [XX.XXX]
(Esto es lo que ya ganaste)
Tarjeta de Deuda:

text
💸 POR PAGAR (a TOCO Emprende)
$ [XX.XXX]
Corresponde a [X] TOCOs vendidos
[ Botón: Ver cómo pagar → ] (abre un modal con instrucciones)
Últimas ventas (últimas 5):

text
📋 ÚLTIMAS VENTAS
• Kiosco "El Chino" - 3 TOCOs - $12.000 ganancia - Hoy
• Librería "Página" - 2 TOCOs - $8.000 ganancia - Ayer
... [Ver todas →] (link a Historial)
Botón flotante de acción principal (FAB):

Ícono "+" (más) en la esquina inferior derecha

Al tocarlo → abre "Registrar venta"

PANTALLA 3: REGISTRAR VENTA
Título: "Registrar nueva venta"

Campos del formulario:

Campo	Tipo	Requerido	Ejemplo
Nombre del comercio	Texto	Sí	"Kiosco El Chino"
Cantidad de TOCOs	Número (mínimo 1, máximo = stock disponible)	Sí	3
Precio de venta por unidad	Número (prefijado en $5.000, editable solo si autorizado)	Sí	5000
Fecha de venta	Date (por defecto hoy)	Sí	15/05/2025
¿Recibiste el pago?	Checkbox (Sí/No)	Sí	Marcado
Cálculos automáticos:

Subtotal (cantidad × precio unitario)

Ganancia del emprendedor (cantidad × $4.000)

Deuda generada (cantidad × $1.000)

Botones:

[ Registrar venta → ] (guarda y vuelve al Dashboard)

[ Cancelar ] (vuelve sin guardar)

Validaciones:

No se puede vender más TOCOs que el stock disponible

Mensaje de error si stock insuficiente

Confirmación antes de guardar: "¿Registrar venta de X TOCOs a [Comercio]?"

Al guardar:

Resta automáticamente del stock disponible

Suma a ganancias totales

Suma a deuda

Guarda en el historial

PANTALLA 4: HISTORIAL DE VENTAS
Título: "Mi historial de ventas"

Filtros (arriba):

Filtro por fecha: "Últimos 7 días" | "Este mes" | "Personalizado"

Buscador: "Buscar por comercio..."

Tabla/lista de ventas (formato mobile amigable):

Cada venta se muestra como tarjeta:

text
🏪 Kiosco El Chino
📅 15/05/2025
📦 3 TOCOs | $15.000 total
💰 Ganancia: $12.000
💸 Deuda generada: $3.000
Pie de página de la lista:

Total de TOCOs vendidos: [XX]

Ganancias totales: $[XX.XXX]

Deuda total: $[XX.XXX]

Botón de exportación:

[ 📤 Exportar a CSV ] → descarga el historial completo

BOTÓN/SECCIÓN: SOLICITAR MÁS STOCK
Modal o pantalla aparte:

Título: "Solicitar más stock"

Texto informativo:

"Recordá que el nuevo stock se entrega en modalidad comodato. Pagás solo lo que vendés."

Selector:

Kit de 10 TOCOs

Kit de 25 TOCOs

Kit de 50 TOCOs

Personalizado: ______ unidades

Botón:

[ Enviar solicitud → ]

Al enviar:

Se envía un mensaje automático al WhatsApp del administrador (vos) con los datos del emprendedor y la cantidad solicitada

Mensaje al emprendedor: "¡Listo! En 24 horas coordinamos la entrega de tu nuevo stock."

[BASE DE DATOS / ALMACENAMIENTO]
El sistema necesita persistir los datos. Usá una de estas opciones (por orden de preferencia):

Opción 1 (recomendada para empezar):
Google Sheets como base de datos usando Google Apps Script para exponer APIs REST.

Ventajas: gratis, fácil de administrar desde el celular, el emprendedor no necesita instalar nada.

Estructura de sheets:

Hoja 1: Usuarios (email, nombre, contraseña_hash, stock_actual, ganancias_totales, deuda_total)

Hoja 2: Ventas (id, email_emprendedor, comercio, cantidad, precio_unitario, ganancia, deuda_generada, fecha)

Opción 2 (más robusta):
Supabase (base de datos PostgreSQL gratuita hasta 500MB).

Ventajas: más rápida, autenticación incluida, APIs automáticas.

Opción 3 (local para prueba):
localStorage + IndexedDB (solo para demostración, los datos se pierden al limpiar el navegador).

Recomiendo Opción 1 (Google Sheets) por simplicidad y costo cero.

[AUTENTICACIÓN]
Flujo de registro de nuevo emprendedor (desde el panel de administración, no desde esta app):

Vos (admin) das de alta al emprendedor en la hoja "Usuarios"

Le asignás un email y una contraseña temporal (ej: "toco123")

El emprendedor ingresa al panel y puede cambiar su contraseña (opcional)

Flujo de login (en la app):

Emprendedor ingresa email y contraseña

El sistema verifica contra la hoja "Usuarios"

Si es correcto, genera un token (JWT o sessionStorage) que dura 7 días

Si es incorrecto, muestra error

[INSTRUCCIONES ADICIONALES PARA EL AGENTE]
Generá el código completo en un solo proyecto con:

index.html (login)

dashboard.html (panel principal)

registro-venta.html (formulario)

historial.html (listado)

styles.css (todos los estilos)

app.js (toda la lógica, incluyendo conexión a Google Sheets vía fetch)

Usá localStorage o sessionStorage para mantener la sesión del emprendedor (guardar su email y token).

Simulá la conexión a Google Sheets con funciones comentadas que muestren cómo conectarlo (porque el agente no puede desplegar un backend real, pero puede dejar la estructura lista).

El código debe ser responsive (mobile-first) y funcionar sin errores en consola.

Incluí un archivo README.md que explique:

Cómo configurar las hojas de Google Sheets

Cómo desplegar el panel (Netlify, Vercel, o GitHub Pages)

Cómo personalizar colores y textos

Cómo hacer el deploy del Google Apps Script para las APIs

[EJEMPLO VISUAL DEL DASHBOARD (para que el agente lo interprete)]
text
┌─────────────────────────────────┐
│  ¡Hola, Juan!          🟢 Activo │
│  Lunes, 15 de mayo de 2025      │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 📦 STOCK DISPONIBLE       │  │
│  │        23 unidades        │  │
│  │ [ Solicitar más stock → ] │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌─────────────┐ ┌───────────┐ │
│  │ 💰 GANANCIAS│ │ 💸 DEUDA  │ │
│  │  $184.000   │ │ $23.000   │ │
│  └─────────────┘ └───────────┘ │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📋 ÚLTIMAS VENTAS          │  │
│  │ • Kiosco El Chino - 3 u   │  │
│  │ • Librería Página - 2 u   │  │
│  │ • Café Martínez - 5 u     │  │
│  │ [ Ver todas → ]           │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  [ 🏠 ] [ 📝 ] [ 📋 ] [ 👤 ]    │
│   Inicio  Venta  Historial Perfil│
└─────────────────────────────────┘
