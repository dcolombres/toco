Actuá como un desarrollador full-stack especializado en paneles de control (dashboards) para jóvenes embajadores. Necesito crear un sistema de gestión simple, mobile-first, seguro y funcional para los Tokers del proyecto TOCO Emprende.

Descripción del proyecto:
TOCO Emprende es un programa donde jóvenes de 18 a 25 años actúan como embajadores (**Tokers**) de cubos de madera reciclada. Cada Toker recibe un stock inicial en modalidad consignación (paga solo lo que vende). Cada TOCO tiene:

Costo de rendición (fábrica): $2.500

Precio al público: $5.000

Ganancia del Toker: $2.500 por TOCO

Usuario del sistema:
Cada Toker registrado tendrá acceso a su propio panel con login personalizado (email + contraseña).

Objetivo del panel:
Que el Toker pueda, desde su celular o computadora:

Ver su stock físico actual disponible

Registrar una "Misión Cumplida" (venta con datos del comercio)

Ver sus ganancias acumuladas

Ver cuánto debe rendir a la fábrica

Ver historial de misiones

Solicitar más stock (Misión Stock)

[ESTRUCTURA DEL SISTEMA]
El sistema debe tener pantallas principales (tipo SPA o multi-page):

Pantalla	Función
Login	Acceso seguro para cada Toker
Dashboard (principal)	Resumen: misión stock, ganancias, rendición, últimos movimientos
Registro de misión	Formulario rápido para cargar una nueva misión cumplida
Historial	Listado de todas las misiones realizadas (filtrable por fecha)
[DISEÑO Y ESTÉTICA]
Paleta de colores (consistencia de marca):

Fondo principal: #F9F9F9 (gris muy claro)

Color primario: #FB8500 (naranja cálido)

Color secundario: #2A9D8F (verde bosque)

Color de alerta (por rendir): #E63946 (rojo suave)

Texto principal: #2B2D42 (gris oscuro)

Texto secundario: #6C757D (gris medio)

Tipografía: Plus Jakarta Sans e Inter.

[FUNCIONALIDADES DETALLADAS]
PANTALLA 1: LOGIN
Título: "Acceso Panel Toker"

PANTALLA 2: DASHBOARD (PRINCIPAL)
Header:

Saludo: "¡Hola, [Nombre del Toker]!"

Subtítulo: "Embajador de lo real"

Tarjeta de Misión Stock:

text
📦 MISIÓN STOCK
[XX] unidades
[ Botón: Gestionar → ]
Tarjeta de Ganancias:

text
💰 GANANCIA TOKER
$ [XX.XXX]
Tarjeta de Rendición:

text
💸 POR RENDIR (Fábrica)
$ [XX.XXX]
PANTALLA 3: REGISTRAR MISIÓN
Título: "Misión Cumplida"

Cálculos automáticos:

Subtotal (cantidad × precio unitario)

Ganancia del Toker (cantidad × $2.500)

Por rendir (cantidad × $2.500)

[BASE DE DATOS / ALMACENAMIENTO]
El sistema usa Node.js con SQLite para persistencia real.

[AUTENTICACIÓN]
Registro de nuevo Toker desde panel admin.

[EJEMPLO VISUAL DEL DASHBOARD]
text
┌─────────────────────────────────┐
│  ¡Hola, Juan!      Toker Activo │
│  Embajador de lo real           │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 📦 MISIÓN STOCK           │  │
│  │        23 unidades        │  │
│  │ [ Gestionar stock → ]     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌─────────────┐ ┌───────────┐ │
│  │ 💰 GANANCIA │ │ 💸 RENDID  │ │
│  │   $57.500   │ │  $57.500  │ │
│  └─────────────┘ └───────────┘ │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📋 ÚLTIMAS MISIONES        │  │
│  │ • Kiosco El Chino - 3 u   │  │
│  │ • Librería Página - 2 u   │  │
│  │ [ Ver todas → ]           │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  [ 🏠 ] [ 📝 ] [ 📋 ] [ 👤 ]    │
│   Inicio  Misión Historial Perfil│
└─────────────────────────────────┘
