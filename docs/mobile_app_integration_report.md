# Reporte de Integración: Aplicación Móvil con Expo (LandingReel)

**Fecha:** 27/02/2026
**Autor:** `@documenter` ✍️
**Fase:** Integración y Consolidación de Arquitectura Móvil dentro del Monorepo.

---

## 🚀 Resumen del Hito
Se ha inicializado, integrado y configurado exitosamente la versión móvil nativa del proyecto **LandingReel** utilizando Expo, React Native y Expo Router. Todo ello integrado como un **Workspace** dentro de nuestro Monorepo (Turborepo), permitiendo rebotar una cantidad sustancial de lógica y componentes desde la contraparte Web (Next.js) hacia arquitecturas puramente nativas.

## 📋 Pasos Ejecutados y Decisiones Arquitectónicas

### 1. Inicialización en el Monorepo
- **Comando Ejecutado:** `npx create-expo-app apps/landingreelapp --template blank`
- **Integración con Turborepo:** La app de Expo fue inyectada bajo la carpeta `apps/landingreelapp`. Para prevenir colisiones con los comandos paralelos de Turborepo (`dev`, `build`), se preservó la nomenclatura original de Expo (`start`, `android`, `ios`, `web`) en su `package.json`. Esto permite aislar inteligentemente los entornos, dejando que TurboRepo construya la web y Expo emita al simulador según convenga de forma independiente.

### 2. Resolución de Versiones (React & Web)
- **Problema Encontrado:** Al intentar usar `npm run web` en Expo, apareció un error fatal de colisión de versiones entre `<React>` core (`19.2.0`) y `<React DOM>` del monorepo (`19.2.3`).
- **Solución Aplicada:** Se forzó el uso estricto en el paquete móvil a `"react": "19.2.3"` y `"react-dom": "19.2.3"`. Se añadió la librería `react-native-web` al workspace móvil permitiendo levantar la base nativa en entornos Web.

### 3. Abstracción del Motor de Estado Global (Zustand)
- **Desacoplamiento:** El motor core de edición, `useReelStore.ts`, se encontraba fuertemente atado a la carpeta `apps/web/src/store`.
- **Nuevo Paquete Compartido:** Se empaquetó dicha lógica conformando un nuevo *package* de área en `packages/store` publicado de forma local como `@landingreel/store`.
- **Beneficio Principal:** La lógica y negocio de cómo se estructuran, manipulan y ordenan los *shots* y *elementos* fluye bidireccionalmente entre el Editor Web de Next.js y la aplicación Nativa en Expo con un exacto y compartimentado código.

### 4. Supabase Auth y Conexión de Datos Segmentados
- Next.js se beneficia profundamente de las cookies y Supabase SSR. Replicar esto de manera idéntica en Móvil provocaría fallas nativas.
- **Implementación Separada para el Mismo Backend:**
  - `apps/web` mantendrá su modelo y cliente en `/utils/supabase`.
  - `apps/landingreelapp` incorporó el paquete `@react-native-async-storage/async-storage` para inicializar en un nuevo archivo su propio cliente con autogestión persistida para aplicaciones nativas (`lib/supabase.ts`).

### 5. Traducción Dinámica de UI y Sistema de Rutas
La réplica visual consistió en una translación directa de DOM (Next.js) a primitivas Nativas de Expo, pero apostando por el ecosistema más avanzado en DX.

- **Integración NativeWind v4 (TailwindCSS):** 
  - Archivos inyectados: `babel.config.js` (preset nativewind), `metro.config.js` (withNativewind y css module input), `tailwind.config.js` y `global.css`.
  - Motivo: Compartir estéticamente o "Copy-Paste" de código CSS Web a React Native NativeWind *className* minimizando los tiempos de iteración al 10%.
- **Expo Router (File-based Routing):**
  - Se deshizo el monolítico `App.tsx`.
  - Se inicializó una arquitectura de navegación moderna en el directorio `/app/`:
    - `app/_layout.tsx`: Root layout de las vistas.
    - `app/index.tsx`: Dashboard idéntico al Dashboard en Next.js con lista de proyectos "Mock", usando tarjetas de layout Flexbox idénticas al navegador usando `<View />`, `<Text />`. transicionando vía `.push()`.
    - `app/editor/[id].tsx`: Recreación del Editor nativo, capaz de acoplar el estado general (`@landingreel/store`), recibir el índice de las diapositivas y proveer de componentes en texto editable `<TextInput />`. 

## 🛠 Errores Mitigados y Gotchas
- **Colisión de Babel / React-Native-Reanimated**: La compilación previa fallaba al no definir explícitamente el plugin para Reanimated. Solucionado en la configuración compartida inyectándolo en el array de `plugins` dentro de Babel.
- **Cache Metro Tras Configurar Tailwind**: Puesto que migró el *main script* (`expo-router/entry`) se requerirá limpiar la caché (`npm run start -c`) al ser clonando el proyecto en nuevos equipos.

## 🏁 Estado Actual
El Monorepo ahora contiene una instancia de **Astro** ultra-rápida paralela, un editor robusto en **Next.js**, un paquete de **Componentes Core** compartido, el **Estado Zustand** abstraído e importable universalmente y por último, la **Aplicación Nativa (Expo)** transicionable entre pantallas. Todos los eslabones operativos dentro de una base turbocaché.
