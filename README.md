# IZI Storage — Landing page

Sitio web de presentación de **IZI Storage**, plataforma de control operativo logístico para inventario, pedidos, picking, despacho y trazabilidad.

Tecnología: HTML5 / CSS3 / JavaScript puro. Sin frameworks, sin npm, sin build. Se abre con doble clic.

---

## Estructura de archivos

```
izistorage-landing/
├── index.html              # Página principal (único archivo HTML)
├── CNAME                   # Dominio personalizado para GitHub Pages
├── assets/
│   └── favicon.svg         # Ícono de la pestaña del browser
├── css/
│   ├── reset.css           # Variables CSS globales y reset
│   ├── layout.css          # Grillas, secciones y responsive
│   ├── components.css      # Componentes: cards, botones, formulario, footer
│   └── animations.css      # Keyframes y animaciones de scroll
└── js/
    ├── visual.js           # Canvas animado (partículas/red de fondo)
    ├── interactions.js     # Scroll reveal, FAQ accordion, nav scroll, back-to-top
    └── forms.js            # Validación de formulario, toasts, botón WhatsApp
```

---

## Cómo editar el número de WhatsApp y el mensaje

Abrir `js/forms.js` y editar las dos variables al inicio del archivo:

```js
var WHATSAPP_PHONE = '56912345678'; // Sin + ni espacios. Ej: 56912345678
var WHATSAPP_MSG   = 'Hola, me interesa conocer más sobre IZI Storage...';
```

El formato del número es: código de país + número sin espacios (`56` para Chile).

---

## Cómo editar el email y redes sociales

El **email de contacto** está en `index.html`, dentro de la sección del footer:

```html
<span class="footer-link footer-link-static" aria-label="Email de contacto">
  hola@izistorage.cl
</span>
```

Los **links de redes sociales** están en el footer, buscar los comentarios `TODO`:

```html
<!-- TODO: reemplazar # por URLs reales de redes sociales -->
<a href="#" class="footer-social-link" aria-label="LinkedIn de IZI Storage">in</a>
<a href="#" class="footer-social-link" aria-label="Instagram de IZI Storage">ig</a>
<a href="#" class="footer-social-link" aria-label="Facebook de IZI Storage">fb</a>
```

Reemplazar cada `href="#"` por la URL real de cada red.

Los **links de política de privacidad y términos de uso** están al final del footer:

```html
<!-- TODO: reemplazar # por URLs reales de política y términos -->
<a href="#" class="footer-link">Política de privacidad</a>
<a href="#" class="footer-link">Términos de uso</a>
```

---

## Cómo abrir el proyecto localmente

No requiere servidor ni instalación:

1. Descargar o clonar este repositorio
2. Hacer doble clic en `index.html`
3. El sitio abre en el browser con todas las funcionalidades activas

Para desarrollo con recarga automática (opcional):

```bash
# Con Python (incluido en macOS y Linux)
python3 -m http.server 8080

# Con Node.js (si está instalado)
npx serve .
```

Luego abrir `http://localhost:8080` en el browser.

---

## Cómo publicar en GitHub Pages

### Primera vez

1. Crear repositorio en GitHub (público o privado)
2. Subir todos los archivos manteniendo la estructura de carpetas
3. Ir a **Settings → Pages**
4. Source: `Deploy from a branch` → branch `main` → carpeta `/ (root)`
5. Click **Save**
6. Esperar ~2 minutos → el sitio estará disponible en `https://usuario.github.io/izistorage-landing`

### Con dominio personalizado (IZIStorage.cl)

1. El archivo `CNAME` ya está incluido con el contenido `izistorage.cl`
2. En tu registrador de dominio, agregar estos registros DNS:

```
Tipo A    @    185.199.108.153
Tipo A    @    185.199.109.153
Tipo A    @    185.199.110.153
Tipo A    @    185.199.111.153
Tipo CNAME    www    usuario.github.io
```

3. En GitHub Pages, ingresar `izistorage.cl` en el campo **Custom domain**
4. Activar **Enforce HTTPS**
5. Propagación DNS: entre 15 min y 48 horas

### Actualizaciones futuras

Cada vez que edites archivos, subir los cambios al repositorio y GitHub Pages se actualiza automáticamente en ~1 minuto.

Con Git instalado:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

---

## Pendientes futuros

### Conectar formulario a Google Sheets

El formulario actual valida campos y muestra un toast de confirmación, pero no envía datos a ningún backend. Para conectarlo a Google Sheets:

1. Crear una Google Spreadsheet para recibir los datos
2. En Google Apps Script (`Extensions → Apps Script`), crear un Web App que reciba `POST` con los campos del formulario y los escriba en la hoja
3. Publicar el script como Web App con acceso "Anyone"
4. En `js/forms.js`, dentro de `initDemoForm`, reemplazar el `setTimeout` de simulación por:

```js
fetch('https://script.google.com/macros/s/TU_SCRIPT_ID/exec', {
  method: 'POST',
  body: new FormData(form)
})
.then(function(res) { return res.json(); })
.then(function(data) {
  resetForm(form);
  showToast('Solicitud recibida. Te contactaremos pronto.', 'success');
})
.catch(function() {
  showToast('Error al enviar. Intenta por WhatsApp.', 'error');
});
```

### Conectar formulario a correo electrónico

Alternativas sin backend propio:

- **Formspree** ([formspree.io](https://formspree.io)): agregar `action="https://formspree.io/f/TU_ID"` al `<form>` y cambiar `method="POST"` — plan gratis disponible
- **Web3Forms** ([web3forms.com](https://web3forms.com)): similar a Formspree, sin costo para volúmenes bajos
- **EmailJS** ([emailjs.com](https://emailjs.com)): envío directo desde JS sin servidor

### Conectar formulario a CRM

Para HubSpot, Pipedrive u otros CRM, la vía más simple es:

1. Usar **Make** (ex Integromat) o **Zapier** como middleware
2. El formulario envía a un Google Sheet (paso anterior)
3. Make/Zapier escucha la hoja y crea el contacto en el CRM automáticamente

---

## Tecnologías utilizadas

- HTML5 semántico con atributos ARIA
- CSS3 con custom properties (`--variables`), glassmorphism y `backdrop-filter`
- JavaScript ES5 (compatible con todos los browsers modernos), patrón IIFE
- Canvas 2D API para el fondo animado
- IntersectionObserver API para scroll reveal
- Google Fonts: Space Grotesk (cargado desde CDN de Google)
- Sin frameworks, sin librerías externas, sin npm, sin build

---

## Notas de mantenimiento

- Todos los colores están definidos como variables CSS en `css/reset.css` — editar ahí para cambiar la paleta global
- El número de WhatsApp y el mensaje están en `js/forms.js` líneas 5–6
- El año del copyright está en `index.html` — buscar `© 2026` para actualizarlo
- Los textos de copy están directamente en `index.html` sin sistema de templates
