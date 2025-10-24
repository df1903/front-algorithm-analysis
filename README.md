# Algorithms Analysis – Frontend

Interfaz web en React que permite enviar texto a un analizador (backend) y visualizar la respuesta estructurada (p. ej., un AST) en un flujo tipo chat. Incluye UI oscura, sidebar de sesiones con renombrado, header fijo y estilos con Tailwind CSS v4.

Estado del proyecto: activo y en desarrollo.

## Tabla de contenido

- Visión general
- Características
- Requisitos
- Instalación y ejecución
- Configuración (Backend, Tailwind)
- Estructura del proyecto
- Scripts disponibles
- Flujo de uso
- Personalización
- Solución de problemas
- Licencia

## Visión general

Este frontend consume un endpoint HTTP que analiza texto y devuelve una estructura JSON. El resultado se muestra como bloque de código dentro de un chat, con historial por sesión. El foco está en rapidez de desarrollo (Vite), estilos utilitarios (Tailwind v4) y una UX simple y clara.

## Características

- Tema oscuro por defecto y diseño responsive.
- Sidebar de sesiones: crear, seleccionar y renombrar conversaciones.
- Renombrado: clic en el título del header o doble clic en el título del sidebar.
- Header y sidebar fijos (sticky); solo el área central hace scroll.
- Render de respuestas como bloque de código JSON.
- Tailwind CSS v4 con `@source` para tree‑shaking de utilidades.

## Requisitos

- Node.js 18 o superior (recomendado LTS 18/20).
- npm 9+ (o el que acompaña a tu Node LTS).

## Instalación y ejecución

Clona el repositorio y ejecuta:

```
npm install

# Desarrollo (HMR)
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

Vite usa por defecto el puerto 5173. Si está ocupado, mostrará el siguiente puerto disponible.

## Configuración

### Backend

La URL base del backend está en `src/services/chatApi.ts:7` como `BASE_URL`.

- Por defecto: `http://127.0.0.1:8000`.
- Endpoint usado: `/api/analyzer/ast` (POST JSON `{ text: string }`).
- Si tu backend usa otra URL/puerto, cambia `BASE_URL` en ese archivo o adapta la lógica para leer una variable (p. ej., `import.meta.env.VITE_API_BASE_URL`).

Ejemplo de petición:

```http
POST http://127.0.0.1:8000/api/analyzer/ast
Content-Type: application/json

{ "text": "begin for i := 1 to n do ..." }
```

### Tailwind CSS v4

Tailwind se configura vía PostCSS y directivas en el CSS.

- PostCSS: `postcss.config.js:1` usa `@tailwindcss/postcss` y `autoprefixer`.
- Entrada principal: `src/index.css:1` incluye:
  - `@import "tailwindcss/theme";`
  - `@source "../index.html" "./**/*.{js,ts,jsx,tsx}";`
  - `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`

Si agregas archivos fuera de `src/`, añade sus rutas a `@source` para que las clases se incluyan en el build.

## Estructura del proyecto

```
src/
  apps/chat/
    components/
      ChatHeader.tsx        # Título; clic para renombrar
      ChatInput.tsx         # Entrada y envío
      ChatSidebar.tsx       # Sesiones; doble clic para renombrar
      MessageItem.tsx       # Burbujas de mensajes
      MessageList.tsx       # Listado + autoscroll
    pages/ChatPage.tsx      # Layout principal (sidebar + chat)
  services/chatApi.ts       # Cliente HTTP al analizador
  store/chat.tsx            # Estado global (sesiones, envío, renombrado)
  index.css                 # Tailwind v4 y estilos globales
  main.tsx, App.tsx         # Bootstrap de React
```

Archivos de configuración relevantes: `postcss.config.js`, `tailwind.config.js`, `vite.config.ts`, `tsconfig.*`.

## Scripts disponibles

- `npm run dev`: desarrollo con HMR.
- `npm run build`: compila TypeScript y genera `dist/`.
- `npm run preview`: sirve `dist/` para verificación local.
- `npm run lint`: ejecuta ESLint.

## Flujo de uso

1) Crea una sesión con “+ Nuevo chat”.
2) Escribe tu pregunta/comando y presiona Enter (Shift+Enter para salto de línea).
3) El backend responde; se muestra en un bloque de código.
4) Renombra la sesión con clic en el título del header o doble clic en el item del sidebar.

## Personalización

- Colores/acentos: busca clases `ring-indigo-`/`bg-indigo-` en los componentes.
- Scrollbar: estilos definidos en `src/index.css` (oscuro/fino). Puedes ajustarlos o quitarlos.
- Sticky: el header/side usan `sticky top-0`; puedes retirarlo si no lo necesitas.

## Solución de problemas

- Tailwind sin estilos: confirma que `src/index.css` se importe en `src/main.tsx:3` y que `@source` apunte a tus rutas.
- CORS o 4xx/5xx: revisa la consola y que `BASE_URL` apunte al backend correcto. Valida que acepte `POST /api/analyzer/ast` con JSON.
- Doble scroll: el proyecto define `body { overflow: hidden }` y el scroll vive en el área central; si cambias layout, respeta `min-h-0` y `overflow-y-auto` en el contenedor de mensajes.

## Licencia

Uso interno/educativo. Ajusta a tu contexto o agrega tu propia licencia.
