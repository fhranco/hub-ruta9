# 🚀 Guía de Despliegue en Vercel
## TuVitrinaDigital.cl • RUTA 9 Gourmet Showcase

Esta guía te explica cómo subir el proyecto a **Vercel** de manera gratuita y profesional, y detalla cómo funciona la arquitectura en la nube para garantizar la sincronización en tiempo real de tus pantallas sin depender de servidores locales.

---

## 1. Entendiendo la Arquitectura en la Nube (Vercel + PocketBase)

Vercel es una plataforma de alojamiento **Serverless** (sin servidor persistente) y con una red de distribución global (CDN) ultra-rápida. 

Cuando subes este proyecto a Vercel:
1. **El Frontend en la Red Global (Vercel)**: Los archivos de diseño (`index.html`, `pantalla2.html`, `admin.html`, `operator.html`, CSS, JS e imágenes) se alojarán en Vercel. Esto significa que las pantallas en tus televisores cargarán de forma instantánea desde cualquier parte del mundo.
2. **El Servidor Local de Relay (`relay-server.js`) NO corre en Vercel**: Vercel no permite ejecutar servidores Node.js permanentes que mantengan conexiones abiertas (como las necesarias para Server-Sent Events o WebSockets de forma nativa).
3. **Sincronización en Tiempo Real vía PocketBase (VPS)**:
   ¡No te preocupes! El código que diseñamos es **híbrido**. Cuando las pantallas se cargan desde Vercel, detectan que no están en local y se conectan automáticamente a tu servidor **PocketBase en Hetzner VPS** (`http://178.156.155.194:8090`).
   - El Administrador envía los cambios a PocketBase.
   - Las pantallas (abiertas en cualquier navegador de TV Stick o Roku) escuchan a PocketBase en tiempo real.
   - **Resultado**: Sincronización instantánea global.

---

## 2. Configuración Premium Realizada (`vercel.json`)

Hemos creado el archivo de configuración `vercel.json` en la raíz del proyecto para optimizar la experiencia en Smart TVs:

* **Clean URLs (URLs Limpias)**: Ya no es necesario escribir la extensión `.html` en el navegador del televisor.
  - Antes: `https://proyecto.vercel.app/index.html`
  - Ahora: `https://proyecto.vercel.app/`
  - Antes: `https://proyecto.vercel.app/admin.html`
  - Ahora: `https://proyecto.vercel.app/admin`
* **Control de Caché del Borde (Edge Caching)**: Forzamos a Vercel a enviar encabezados `no-cache` / `no-store` en los archivos HTML y los scripts de la app (`app.js` y `app2.js`). Esto asegura que cuando subas una actualización de diseño, los televisores descarguen la última versión al instante y no se queden con archivos viejos en caché.

---

## 3. Método A: Despliegue con GitHub (Recomendado)

Este método es el estándar de la industria. Cada vez que actualices tu código y hagas un `git push`, tu vitrina web en producción se actualizará sola en 10 segundos.

1. **Crear un Repositorio en GitHub**:
   - Entra a tu cuenta de GitHub y crea un nuevo repositorio público o privado (ej: `ruta9-vitrina`).
2. **Subir tu código local a GitHub**:
   - Abre la consola en la carpeta de tu proyecto y ejecuta:
     ```bash
     git init
     git add .
     git commit -m "feat: Vercel deployment support and screen wake lock"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/ruta9-vitrina.git
     git push -u origin main
     ```
3. **Conectar a Vercel**:
   - Entra a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
   - Haz clic en el botón **Add New...** y luego en **Project**.
   - Importa el repositorio `ruta9-vitrina` de la lista.
   - En la sección **Build and Development Settings**, déjalo todo por defecto (Vercel detecta automáticamente que es un proyecto HTML/CSS/JS estático).
   - Haz clic en **Deploy**. ¡Listo! En segundos tendrás tu URL pública (ej: `https://ruta9-vitrina.vercel.app`).

---

## 4. Método B: Despliegue Rápido vía Vercel CLI (Línea de Comandos)

Si deseas subir el proyecto a producción directamente desde tu computadora en 10 segundos sin pasar por GitHub:

1. **Instalar el CLI de Vercel** (Si no lo tienes instalado de forma global):
   ```bash
   npm install -g vercel
   ```
2. **Ejecutar el comando de despliegue**:
   Abre la consola en la carpeta del proyecto y ejecuta:
   ```bash
   vercel
   ```
3. **Responder a las preguntas en consola**:
   - *Set up and deploy?* `yes`
   - *Which scope?* (Selecciona tu cuenta personal)
   - *Link to existing project?* `no`
   - *What's your project's name?* `pantallas-vitrina` (o el nombre que gustes)
   - *In which directory is your code located?* `./` (presiona Enter)
   - *Want to modify these settings?* `no` (presiona Enter)
4. **Listo**: El CLI subirá tu código y te entregará una URL de desarrollo inmediata.
5. **Pasar a Producción**: Cuando estés conforme y quieras la URL definitiva de producción, ejecuta:
   ```bash
   vercel --prod
   ```

---

## 5. Tus URLs en Producción (Vercel)

Gracias al enrutamiento de nuestro `vercel.json`, tus URLs definitivas para configurar en los televisores del local y en tus dispositivos serán sumamente limpias y profesionales:

* **Vitrina 1 (Hamburguesas Showcase)**: 
  `https://tu-proyecto.vercel.app/`
* **Vitrina 2 (Acompañamientos & Bebidas)**: 
  `https://tu-proyecto.vercel.app/pantalla2`
* **Panel de Administración (Precios e Insumos)**: 
  `https://tu-proyecto.vercel.app/admin`
* **Panel del Operador (Disponibilidad de Stock)**: 
  `https://tu-proyecto.vercel.app/operator`

---
*Documento preparado con amor por Antigravity IDE para la marcha blanca y escalabilidad de Ruta 9 Gourmet en TuVitrinaDigital.cl*
