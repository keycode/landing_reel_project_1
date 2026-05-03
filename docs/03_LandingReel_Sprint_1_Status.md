# LandingReel - Status Report: Sprint 1 (Setup & Base UI)

**Fecha:** 22 de Febrero 2026.
**Por:** `@documenter` (Agent 6)

Acorde a la directriz operativa, este documento registra la traza técnica secuencial del Sprint 1, detallando la implementación inicial del ecosistema, los problemas encontrados en compilación y tiempo de ejecución, y las soluciones arquitectónicas definitivas. Archivos modificados y estructuración actual.

---

## 🏗️ Secuencia de Implementación Técnica y Troubleshoot

### 1. Configuración del Entorno y Next.js (App 1)
**Objetivo:** Establecer la base del Monorepo y purgar errores de configuración en Next.js.
- **Acción:** Revisión profunda del tipado de Next.js (`next.config.ts`) para la App base.
- **Error Encontrado:** `Object literal may only specify known properties, and 'allowedDevOrigins' does not exist in type 'ExperimentalConfig'`.
- **Causa Raíz:** A partir de las versiones recientes de Next.js, propiedades como `allowedDevOrigins` pasaron a ser propiedades de primer nivel (top-level config) del tipo `NextConfig`, en lugar de encontrarse anidadas dentro de `experimental`. Adicionalmente, `allowedOrigins` debía ubicarse dentro de `experimental.serverActions`.
- **Solución Aplicada:** Refactorización de `apps/web/next.config.ts`, aislando las directivas en sus nodos correctos según la interfaz estricta de Typescript, habilitando de paso el modelo de compilación `output: 'standalone'` para Docker.

### 2. Creación del Shared UI Package y Fix de Linter
**Objetivo:** Desarrollar los bloques base de Scrollytelling (`ReelContainer`, `ShotRenderer`, `Watermark`, `CampaignExpired`) dentro de `packages/ui` para ser consumidos globalmente.
- **Acción:** Creación de los componentes base con React, Embla Carousel (`embla-carousel-wheel-gestures`) y GSAP. Exportación mediante `index.tsx`.
- **Error Encontrado:** Al ejecutar el pre-commit/linter de Turborepo (`npm run lint`), el workspace `@landingreel/ui` rompió el build devolviendo código de error 2: `ESLint couldn't find an eslint.config.(js|mjs|cjs) file.`.
- **Causa Raíz:** ESLint v9 cambió obligatoriamente a Flat Config. El paquete de UI, al ser creado de cero, carecía de este archivo de definición obligatoria en turborepo.
- **Solución Aplicada:** Se inyectó el archivo `packages/ui/eslint.config.mjs` invocando `@eslint/js` y `typescript-eslint` en flat mode, desbloqueando instantáneamente el pipeline unificado del monorepo. Igualmente, detectados por el parser en tiempo récord, se actualizaron clases obsoletas de Tailwind (ej: `h-[100dvh]` a `h-dvh` y `bg-gradient-*` a `bg-linear-*` acordes a V4).

### 3. Setup de Astro y Error de Frontmatter (App 2)
**Objetivo:** Integrar el visor principal dinámico en `apps/viewer` para desplegar la UI creada pasándole las rutas como IDs.
- **Acción:** Creación de `apps/viewer/src/pages/[id].astro` con lógica dinámica del servidor simulando una carga de base de datos.
- **Error Encontrado:** La compilación estricta de Astro SSR falló crasheramente: `Expected ">" but found "className" en [id].astro`.
- **Causa Raíz:** El parser del frontend de Astro (.astro files) falló porque se intentó definir un array masivo puramente en formato JSX/React Node directamente *dentro* del context del Frontmatter de Astro, el cual solo compila TSX estándar en archivos con extensión `.tsx`.
- **Solución Aplicada:** Se externalizó limpiamente la data a `apps/viewer/src/lib/mockData.tsx` donde es compilada nativamente como un fichero de React.

### 4. Arquitectura de Islas y React Hydration Error
**Objetivo:** Visualizar de forma dinámica la URL local `http://localhost:4322/premium-demo` instanciando la interactividad web vía JS puro usando directiva Astro `client:load` sobre `ReelPlayer`.
- **Error Encontrado (DevTools MCP Chrome):** Pantalla en blanco en el render final. React devolvía la excepción profunda de Fallo de Hidratación (React Hydration Error). Localizado a su vez un error 403 Forbidden proveniente de un script estático de video background.
- **Causa Raíz (Hydration):** Limitación arquitectónica conocida de *Astro Islands*. Astro no puede serializar (transformar a string JSON a través de la red) propiedades complejas de React como `ReactNode` pasándoselas del Servidor Astro al Cliente React (las interacciones pasadas en la prop `content` de `ShotRenderer`).
- **Solución Aplicada Técnica (La más crítica):** Remodelado completo del tipo TypeScript `ShotRendererProps`. Se eliminó el prop `content: ReactNode` y se introdujo la directiva abstracta `shotData` (un objeto puramente de texto JSON: títulos, subtítulos, cta). Ahora, `ShotRenderer` construye internamente el UI en cliente interpretando el `shotData`.
- **Solución Aplicada (Video 403):** Se sustituyó la fuente bloqueante por anti-botting (Pexels) hacia un bucket púbico transparente de Google Cloud Storage.

### 5. Propagación Fallida de Tailwind CSS v4
**Objetivo:** Que los estilos estandarizados base de UI pinten en Astro.
- **Error Encontrado:** Reglas Custom en warnings y UI sin estilos en Astro.
- **Causa Raíz:** Resoluciones de jerarquía incorrectas en Tailwind V4 respecto a Workspaces locales en la directiva global.
- **Solución Aplicada:** Se corrigió en `apps/viewer/src/styles/global.css` la directiva para alcanzar exitosamente el código fuente `../../../../packages/ui/src`, recargando las dependencias.

### 6. Implementación de Navegación Lateral por Puntos (Dots Navigation)
**Objetivo:** Permitir la navegación vertical visual por cada `Shot` mediante una barra indicadora anclada a la derecha.
- **Acción:** Integración de menú interactivo con animaciones CSS/Tailwind (Hover a texto indicativo) en `ReelPlayer.tsx`.
- **Análisis del Problema (Embla API):** Originalmente, `ReelContainer.tsx` era un componente que instanciaba y encapsulaba privadamente la propiedad `emblaApi` del hook central. Esto bloqueaba la capacidad del `ReelPlayer` contenedor para accionar clics de botones sobre el motor de scroll.
- **Solución Aplicada:** Refactorización con `React.forwardRef` y `useImperativeHandle` sobre `ReelContainer.tsx`. Se expuso externamente el método `scrollTo(index)` hacia su propio tipado `ReelContainerRef`. Se complementó inyectando `navLabel` en las directivas `ShotData` para habilitar el rutado escalable de texto.

### 7. Inicialización del Editor Visual Web (Zustand & DND-Kit)
**Objetivo:** Construir el lienzo principal `100dvh` (`apps/web/app/editor/page.tsx`) del dashboard, estableciendo el sistema de estado reactivo y habilitando su reordenación.
- **Acción (Estado):** Se optó por **Zustand** centralizando los datos (y mutadores) en `apps/web/src/store/useReelStore.ts` de forma atómica.
- **Acción (DND):** Se instaló `@dnd-kit` abstrayendo los sensores y estrategias de ordenamiento en componentes preempaquetados `DraggableList` y `SortableItem` publicados desde `@landingreel/ui`.
- **Acción (Refactorización Controlled Component):** `<ReelPlayer>` sufrió un segundo parche para soportar estado en modo "Controlled". Ahora detecta en un `useEffect` cuando la app en Next manda un `externalActiveIndex` superior u originado en el Click del sidebar, forzando un `scrollTo()` que el motor original obedece internamente, logrando el enlace bilateral.

### 8. Arquitectura de Preview Aislada Automática (iFrame + PostMessage)
**Objetivo:** Garantizar que la previsualización del editor en el dashboard (`apps/web`) y el visualizador público (`apps/viewer` en Astro) se rendericen de forma idéntica, pixel-perfect, eludiendo problemas de herencia CSS y sandboxing.
- **Problema de Herencia CSS:** El motor Embla y sus estilos Flex/Height chocaban con las reglas contenedoras y la grid compleja del Editor de Next.js, encogiendo/apilando (squishy) el carrusel en el simulador móvil, pese a ser el mismo componente `<ReelPlayer>`.
- **Solución Principal (Aislamiento):** En `apps/web/app/editor/page.tsx` se reemplazó el uso directo de `<ReelPlayer>` embebido por un elemento `<iframe src="http://localhost:4321/draft" />` nativo. 
- **Solución Dúplex (PostMessage Syncer):** Se programó un puente de comunicación serializada `window.postMessage` bidireccional:
  1. El *Dashboard* (Padre) transmite la matriz entera de Zustand `UPDATE_SHOTS` para Hot-Reloading, y manda directivas de navegación `SET_SLIDE`.
  2. El *ReelPlayer* interno (Hijo iFrame) recibe estos comandos montando escuchadores en `useEffect`. Si el usuario hace *scroll/swipe* físicamente en el móvil virtual, el iFrame devuelve un `SLIDE_CHANGED` notificando la nueva posición, sincronizando inversamente la barrra lateral de edición de React (Zustand).

### 9. Transición a "Liquid Design" (Free-form Canvas)
**Objetivo:** Evolucionar el editor visual desde un modelo de formularios estáticos (título, subtítulo, cuerpo fijos) a un lienzo libre interactivo tipo Figma/Canva, donde los elementos puedan arrastrarse y redimensionarse.
- **Refactorización de Datos (Zustand):** Se eliminó la estructura rígida de `ShotData` (`title`, `subtitle`, etc.) en favor de un array genérico `elements: FreeFormElement[]`. Cada elemento define su identificador, tipo (`text`, `image`, `button`), contenido y, de manera crítica, sus coordenadas espaciales relativas (`x`, `y`, `width`, `height` en porcentajes). Se añadió la función `updateElement` al store.
- **Renderizado Absoluto:** El motor `<ShotRenderer>` abandonó Flexbox en favor de posicionamiento absoluto (`position: absolute`) incrustando estilos en línea basados en los porcentajes inyectados.
- **Interactividad Táctil (Moveable):** En `apps/web/app/editor/page.tsx` se instaló la librería `react-moveable`. Debido a la arquitectura de IFrame implementada en el paso anterior, se creó una capa de superposición transparente (Overlay Canvas) exactamente encima del iFrame. 
- **Cálculo de Coordenadas "Liquid":** Cuando el usuario arrastra las cajas proxy transparentes (que hacen *binding* con cada elemento reactivo), se interceptan los eventos `onDrag` y `onResize`. En tiempo de ejecución, el editor capta el deltay de los píxeles (px) arrastrados y los convierte matemáticamente a porcentajes relativos (`%`) antes de mutar el estado en Zustand, asegurando que el diseño final sea 100% responsive independientemente de la resolución de pantalla del visor web.
- **Auto-Height Proxy (Espejismo Tipográfico):** Para evitar complicados cálculos cruzados de DOM entre el iFrame y React para determinar la altura de textos multilinea (`height: auto`), se inyectó el texto real de forma invisible (`opacity-0`) dentro de las cajas proxy de Moveable clonando matemáticamente atributos como `fontSize`, `fontWeight`, `textAlign` y *line-height* (`leading-tight`). Esto fuerza al navegador padre a colapsar y expandir la caja interactiva rellenando visualmente al 100% el mismo tamaño y saltos de línea que tiene el texto proyectado debajo en el motor Astro.

### 10. Persistencia Real con Supabase (Editor & Viewer)
**Objetivo:** Eliminar los datos mockeados para que ambas aplicaciones lean la información del mismo origen de verdad y permitir al Editor guardar el estado en tiempo real.
- **Acción (Base de Datos):** Se ha creado la tabla `landing_reels` en la base de datos de Supabase, activando sus correspondientes políticas RLS para permitir su lectura y actualización.
- **Acción (Astro Viewer):** Refactorizado `apps/viewer/src/pages/[id].astro` para instanciar el cliente de Supabase (con variables de entorno `.env`) e intentar cargar el registro `id` desde la tabla, retornándose el pre-formato en caliente. Se han preservado los mock data estrictamente integrados a modo de "fallback" robusto ante caídas o IDs de demo temporales (`"free-expired"`, `"free-active"`).
- **Acción (Next.js Editor):** Implementación de la carga asíncrona dentro del hook `useEffect` al montar `apps/web/app/editor/page.tsx`. Adicionalmente, se configuró un segundo efecto reactivo que vigila las alteraciones en la variante `shots` (cuando el usuario arrastra o edita campos) procediendo a ejecutar un _upsert_ directo silencioso hacia Supabase garantizando el guardado automático de los diseños con Auto-Save y `setTimeout`.

### 11. Estabilización de UI en Montaje Temprano (Loading Spinner)
**Objetivo:** Erradicar el efecto visual "flicker" o "parpadeo" donde el visualizador interior mostraba temporalmente datos de relleno (Mock Data locales del iFrame de Astro) antes de ser aplastados por los datos asíncronos reales inyectados vía red (Zustand -> Supabase).
- **Acción:** Creación de un estado local `isLoading` nativo en el Editor de Next.js el cual detiene de inmediato el renderizado del iFrame subyacente hasta resolver el fetch a la DB de Supabase.
- **Implementación Visual:** Se construyó sobreescribiendo el fondo mediante un componente neutro de indicador giratorio CSS (Spinner SVG tailwind `animate-spin`), impidiendo la colisión de variables que alteran el flujo de trabajo del CEO.

### 12. Expansión de Librería UI y System Design Base
**Objetivo:** Completar los prismas fundamentales del Design System para conformar una librería gráfica sólida que pueda ser renderizada de manera declarativa desde JSON dentro del Free-form Canvas de LandingReel.
- **Acción (Tipos Creados):** Se estructuraron los componentes escalables `@landingreel/ui`:
  - `<Typography />`: Acepta variantes `h1-h6`, `p`, `span`. Incorpora lógica **DTR (Dynamic Text Replacement)**: analiza los `URLSearchParams` para inyectar contenido publicitario hiper-personalizado en tiempo de render.
  - `<Image />`: Implementación genérica que encapsula las propiedades HTML nativas de carga diferida (`loading="lazy"`, `decoding="async"`) y autoajuste (`objectFit`).
  - `<Button />`: Refactorizado sobre la base existente con directivas variantes robustas (`primary`, `outline`, `ghost`). Se implementó un estado reactivo booleano `isLoading` y asimilación dinámica semántica como tag `<a>` en caso de recibir la destructurada `href`.
  - `<Divider />`: Líneas unificadas en componentes permitiendo alteraciones de dirección geométrica, grosor procedural y variantes de dibujado (`dashed`, `solid`).
  - `<Icon />`: Se centralizó la dependencia gráfica `lucide-react` en el workspace de librería. El componente parsea identificadores String a elementos SVG vivos con autotraducción de nombres para mayor compatibilidad con API Responses en string de Snake Case/Kebab Case.

---

## 📁 Archivos Clave Modificados y/o Creados en Sprint 1
* `apps/web/next.config.ts`
* `packages/ui/eslint.config.mjs`
* `packages/ui/src/index.tsx`
* `packages/ui/src/components/ReelContainer.tsx`
* `packages/ui/src/components/Typography.tsx`
* `packages/ui/src/components/Image.tsx`
* `packages/ui/src/components/Divider.tsx`
* `packages/ui/src/components/Icon.tsx`
* `packages/ui/src/components/ReelPlayer.tsx`
* `packages/ui/src/components/ShotRenderer.tsx`
* `packages/ui/src/components/Input.tsx`
* `packages/ui/src/components/ColorPicker.tsx`
* `packages/ui/src/components/DraggableList.tsx`
* `packages/ui/src/components/Watermark.tsx`
* `packages/ui/src/components/CampaignExpired.tsx`
* `apps/web/src/app/page.tsx`
* `apps/web/src/app/editor/page.tsx`
* `apps/web/src/store/useReelStore.ts`
* `apps/web/.env.local`
* `apps/viewer/src/pages/[id].astro`
* `apps/viewer/src/lib/mockData.tsx`
* `apps/viewer/src/styles/global.css`
* `apps/viewer/.env`

## 🔜 Próximos Eventos Estructurales (Backlog)
- [x] Mapeo de Database. Consolidar el Schema PostgreSQl vía el cliente Supabase.
- [x] Reemplazar `mockData` en cliente Astro por validación SSR real.
- [ ] Empezar Integración del Auth en la NextApp de LandingReel Editor.
- [ ] Implementar la aplicación móvil con Expo consumiendo el Store y DB actuales.
