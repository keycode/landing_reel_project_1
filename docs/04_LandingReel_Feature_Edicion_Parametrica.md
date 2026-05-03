# Documentación de Nueva Funcionalidad: Edición Paramétrica por ID

**Fecha:** 26 de Febrero de 2026  
**Agente Redactor:** `@documenter`  
**Reporte de Tarea:** Implementación de rutas dinámicas y carga de datos por ID en el Editor Visual y Web Pública.

---

## 🎯 Objetivo de la Tarea
Hasta la fecha, el editor visual de LandingReel (`apps/web`) estaba acoplado fuertemente (hardcoded) al ID `view-1`, provocando que al hacer clic en distintas campañas desde el Dashboard siempre se editara y sobrescribiera la misma campaña en la base de datos (Supabase).

El objetivo de esta integración, liderada por `@integrator` y apoyada por `@frontend`, fue desligar el editor para que fuera capaz de crear campañas nuevas o editar campañas existentes basándose en un parámetro de la URL (ruta dinámica).

---

## 🛠️ Resumen Técnico de Cambios Realizados

A continuación se detalla la tabla de tareas completadas y su impacto en la base de código.

| Archivo Modificado / Creado | Descripción del Cambio | Impacto / Solución |
| :--- | :--- | :--- |
| `apps/web/src/app/page.tsx` | Actualización de enlaces en el Dashboard. | Los botones **"Edit Reel"** inyectan ahora dinámicamente el ID del proyecto en el href (ej. `/editor/view-2`). El botón **"Create New Reel"** dirige a `/editor/new`. |
| `apps/web/src/app/editor/page.tsx` <br/> ➡️ `apps/web/src/app/editor/[id]/page.tsx` | Migración a directorio dinámico en el enrutador de Next.js. | Permite que el framework App Router de Next.js inyecte la variable `[id]` dentro de los parámetros de página y sea accesible vía Hooks. |
| `apps/web/src/app/editor/[id]/page.tsx` | Refactorización de la lógica de carga y guardado (Zustand + Supabase). | Se ha implementado el Hook `useParams()` de `next/navigation` para capturar el `id`. \n - **ID "new":** Genera un ID basado en timestamp e inyecta un estado inicial en blanco/default.\n - **ID existente:** Dispara una query a la colección `landing_reels` y rellena el Data Store.\n - **Sincronización:** El auto-guardado (`upsert`) se hace estrictamente contra la key correspondiente al `reelId` actual. |

---

## 🚀 Flujos de Identidad (Data Flow)

La información ahora viaja de manera predecible a través de toda la aplicación:

1. **Dashboard (Next.js):** El usuario pulsa editar en una reel específica (ej: `view-42`).
2. **Navegación:** La URL cambia a `/editor/view-42`.
3. **Editor (Next.js):** Carga, lee de Supabase todos los `shots` (slides) guardados bajo la PK `view-42` e inicializa el state global de Zustand.
4. **Iframe Preview (Astro):** Al arrancar el preview móvil (`http://localhost:4321/draft`), el editor le transfiere los shots vía `postMessage`.
5. **Guardado (Next.js):** Automáticamente, las modificaciones (como posicionamiento del free-form canvas) se persisten bajo el ID `view-42` en tiempo real (~1s debounced).
6. **Visor Producción (Astro):** El cliente navega a `http://localhost:4321/view-42`, su motor Astro dinámico (`[id].astro`) obtiene el reel directo desde Supabase SSR y es renderizado de forma inmediata.

---

## ⚠️ Posibles Fallos e Historial de QA

- **Aviso Lint / Imports:** Al mover de carpeta el componente del editor (`editor/page.tsx` a `editor/[id]/page.tsx`), las rutas relativas se rompieron temporalmente (`../../store...`). Fueron corregidas sumando un nivel de profundidad (`../../../store...`).
- **Comportamiento Fallback ID:** Si falla la lectura del parámetro o la URL queda mal definida, el sistema implementa una lógica de fallback para prevenir crasheos del backend.

## ✅ Estado: Completado y Funcional.
Reporte archivado para consulta de contexto B2C a futuro.
