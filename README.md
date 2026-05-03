# LandingReel

**LandingReel** es una plataforma SaaS monorepo para crear landing pages móviles verticales con animaciones de scrollytelling. Permite a los creadores diseñar reels interactivos (formato 9:16) desde un editor web o app nativa, y publicarlos como landing pages de alta velocidad.

---

## Estructura del Monorepo

```
landing_reel_project_1/
├── apps/
│   ├── web/              # Editor SaaS — Next.js 16 (App Router)
│   └── viewer/           # Viewer público — Astro 5 (SSR)
├── packages/
│   ├── ui/               # Biblioteca de componentes compartida — React 19
│   ├── store/            # Estado global compartido — Zustand 5
│   └── config/           # Configuración compartida (placeholder)
├── mobile_app/           # App nativa iOS/Android — Expo 55 / React Native
├── docs/                 # Documentación de arquitectura y sprints
├── examples/             # Plantillas de referencia HTML/CSS/JS
├── supabase/             # Schema de base de datos PostgreSQL
├── turbo.json            # Configuración de Turborepo
└── package.json          # Raíz del monorepo (npm workspaces)
```

**Gestor de paquetes:** npm v11.5.1 con workspaces (`apps/*`, `packages/*`)  
**Orquestación de builds:** Turborepo (builds en paralelo con caché)

---

## Apps

### `apps/web` — Editor SaaS (Next.js)

Editor visual principal para crear y gestionar LandingReels desde el navegador.

| Campo | Valor |
|-------|-------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Estilos | Tailwind CSS v4 |
| Estado | `@landingreel/store` (Zustand) |
| Backend | Supabase Auth + PostgreSQL |
| Routing | `/` dashboard · `/editor/[id]` editor |

**Características clave:**
- **Dashboard** (`/`): tarjetas de gestión de reels con CRUD.
- **Editor** (`/editor/[id]`): interfaz dividida en tres zonas:
  - **Sidebar izquierdo:** gestión de shots, edición de elementos y variantes de layout.
  - **Canvas central:** simulador móvil 9:16 con iframe de preview en tiempo real (Astro viewer).
  - **Overlay Moveable:** drag & resize de elementos con posicionamiento absoluto en porcentajes.
- **Comunicación iFrame via PostMessage:** sincronización bidireccional (`UPDATE_SHOTS`, `SET_SLIDE`, `SLIDE_CHANGED`, `SET_EDITING_ELEMENT`).
- **Autoguardado** en Supabase con debounce.

```bash
cd apps/web
npm run dev   # http://localhost:3000
```

---

### `apps/viewer` — Viewer público (Astro)

Renderer público de alta velocidad para servir los reels como landing pages.

| Campo | Valor |
|-------|-------|
| Framework | Astro 5 (SSR con Node.js adapter) |
| Runtime | React 19 (islands) |
| Estilos | Tailwind CSS v4 |
| Backend | Supabase |
| Routing | `/` home · `/[id]` viewer del reel |

**Características clave:**
- Renderizado SSR: carga datos del reel desde Supabase en el servidor.
- Hidratación con `client:load` para el componente React `ReelPlayer`.
- **Control de expiración** server-side: tier gratuito caduca a los 30 días desde `published_at`.
- Muestra `CampaignExpired` si el reel ha expirado; de lo contrario renderiza el player completo.
- Endpoint `/api/health` para health checks.

```bash
cd apps/viewer
npm run dev   # http://localhost:4321
```

---

## Packages

### `packages/ui` — Biblioteca de componentes (`@landingreel/ui`)

Componentes React compartidos entre el editor web y el viewer.

**Componentes exportados:**

| Componente | Descripción |
|-----------|-------------|
| `ReelPlayer` | Player con dots de navegación, watermark y comunicación iFrame |
| `ReelContainer` | Wrapper de Embla Carousel vertical con gestos de rueda |
| `ShotRenderer` | Renderer de slide individual con animaciones GSAP y elementos absolutos |
| `Button` | Botón polimórfico con variantes (primary, outline, ghost, link…) |
| `CampaignExpired` | UI de fallback cuando el reel ha expirado |
| `Watermark` | Marca de agua para usuarios del tier gratuito |
| `DraggableList` / `SortableItem` | Wrapper de dnd-kit para reordenación de slides |
| `Input`, `ColorPicker` | Controles de formulario |
| `Typography`, `Image`, `Divider`, `Icon` | Utilidades de layout |

**Librerías clave:**
- [Embla Carousel](https://www.embla-carousel.com/) — scroll vertical de reels
- [GSAP](https://gsap.com/) — animaciones de entrada en slides (staggered fade-in)
- [dnd-kit](https://dndkit.com/) — drag & drop para reordenar shots
- [Lucide React](https://lucide.dev/) — iconografía

**Modelos de datos principales:**

```typescript
interface FreeFormElement {
  id: string;
  role?: string;          // 'primary-text' | 'button-cta' | …
  type: 'text' | 'button' | 'image';
  content: string;
  x: string;              // posición en porcentaje, ej. "10%"
  y: string;
  width: string;
  height?: string;
  fontSize?: string;
  color?: string;
}

interface ShotData {
  navLabel?: string;
  elements?: FreeFormElement[];
}
```

---

### `packages/store` — Estado global (`@landingreel/store`)

Store centralizado Zustand consumido por la app web y la app móvil.

```typescript
interface ReelState {
  shots: ShotRendererProps[];
  activeIndex: number;

  setShots(shots): void;
  updateShot(id, updates): void;
  updateElement(shotId, elementId, updates): void;
  reorderShots(activeId, overId): void;   // integración con dnd-kit
  setActiveIndex(index): void;
  applyVariantToSlide(shotId, variantId): void;  // sistema de layouts
}
```

**Sistema de variantes basado en roles:**  
Cada elemento tiene un campo `role` (`primary-text`, `button-cta`, etc.) que permite a `applyVariantToSlide` reposicionar automáticamente los elementos según plantillas predefinidas (ej. `hero-centered`, `hero-bottom`, `title-only`).

---

### `packages/config` — Configuración compartida (`@landingreel/config`)

Paquete placeholder para configuración compartida de ESLint, Prettier, etc. Actualmente sin implementar.

---

## Mobile App (`mobile_app`)

App nativa iOS/Android que replica las funcionalidades del editor web.

| Campo | Valor |
|-------|-------|
| Framework | Expo 55 |
| Runtime | React Native 0.83 + React 19 |
| Routing | Expo Router (file-based) |
| Estilos | NativeWind v4 (Tailwind para React Native) |
| Estado | `@landingreel/store` (monorepo local via `file:../packages/store`) |
| Animaciones | React Native Reanimated 4 |

**Arquitectura:**
```
mobile_app/app/
├── _layout.tsx         # Layout raíz (Expo Router)
├── index.tsx           # Dashboard de reels
└── editor/[id].tsx     # Editor de reel
```

> **Nota:** La `mobile_app` usa una referencia local (`file:../`) al store compartido pero **no forma parte** de los workspaces de npm del monorepo. Requiere instalación de dependencias independiente.

```bash
cd mobile_app
npm install
npx expo start
```

---

## Backend — Supabase

Toda la persistencia y autenticación se gestiona en Supabase.

**Tabla principal (`public.projects`):**

```sql
CREATE TABLE public.projects (
  id           uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid      REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text      NOT NULL,
  slug         text      UNIQUE,
  is_premium   boolean   DEFAULT false,
  published_at timestamp,
  phone_number text,
  content      jsonb     DEFAULT '{}',   -- shots y elementos del reel
  created_at   timestamp DEFAULT now(),
  updated_at   timestamp DEFAULT now()
);
```

- **Row Level Security (RLS):** políticas para acceso de usuario autenticado y consulta pública.
- **Trigger auto-update:** `updated_at` se actualiza automáticamente en cada modificación.
- **Lógica de expiración:** `published_at + 30 días` para tier gratuito, validada en el viewer Astro.

**Variables de entorno necesarias:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

---

## Docs

Documentación arquitectural completa en `docs/`:

| Archivo | Contenido |
|---------|-----------|
| `01_LandingReel_Master_Plan_Arquitectura_B2C.md` | Visión del producto, modelo freemium, stack completo, growth stack (n8n, Attio CRM, MailerSend) |
| `02_LandingReel_Agentes_Flujos.md` | Equipo de agentes IA y flujos de trabajo (@architect, @frontend, @integrator…) |
| `03_LandingReel_Sprint_1_Status.md` | Estado detallado del Sprint 1 con troubleshooting (TypeScript, Astro, Tailwind v4, PostMessage, Supabase) |
| `04_LandingReel_Feature_Edicion_Parametrica.md` | Sistema de edición paramétrica |
| `05_LandingReel_AI_Integration_Specs.md` | Especificaciones de integración con agentes IA |
| `06_LandingReel_Variant_System.md` | Sistema de variantes de layout basado en roles |
| `07_LandingReel_Inline_Editing.md` | Especificaciones de edición inline |
| `mobile_app_integration_report.md` | Informe de integración Expo: versiones React, NativeWind, Expo Router |

---

## Examples

`examples/template1/` contiene una landing page de referencia en HTML/CSS/JS puro que sirvió como punto de partida visual del proyecto:
- Embla Carousel + GSAP + jQuery
- Fuentes LEGO Typewell
- Bootstrap 4.4.1
- Vídeo de fondo y assets de marca

---

## Desarrollo

### Requisitos previos

- Node.js ≥ 20
- npm ≥ 11.5.1
- Cuenta en [Supabase](https://supabase.com)

### Arrancar todo el monorepo

```bash
npm install           # instala todas las dependencias (workspaces)
npm run dev           # lanza apps/web y apps/viewer en paralelo (Turborepo)
```

### Arrancar una app individual

```bash
# Solo el editor web
cd apps/web && npm run dev

# Solo el viewer
cd apps/viewer && npm run dev

# App móvil (independiente)
cd mobile_app && npm install && npx expo start
```

### Build de producción

```bash
npm run build         # build de todos los paquetes y apps (Turborepo)
```

### Lint

```bash
npm run lint          # ESLint en todos los workspaces
```

---

## Modelo de Negocio

| Tier | Características |
|------|----------------|
| **Gratuito** | Reels con marca de agua · Expiración a 30 días |
| **Premium** | Sin marca de agua · Sin expiración · Features avanzadas |

La expiración y el watermark se controlan en el servidor (Astro viewer) consultando `is_premium` y `published_at` desde Supabase, evitando cualquier bypass en cliente.

---

## Stack Tecnológico — Resumen

| Capa | Tecnología |
|------|-----------|
| Monorepo | Turborepo + npm workspaces |
| Editor web | Next.js 16 · React 19 · TypeScript · Tailwind v4 |
| Viewer público | Astro 5 SSR · React 19 · TypeScript · Tailwind v4 |
| App móvil | Expo 55 · React Native 0.83 · NativeWind v4 |
| UI compartida | Embla Carousel · GSAP · dnd-kit · Lucide |
| Estado | Zustand 5 (compartido web + mobile) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Animaciones | GSAP 3 · React Native Reanimated 4 |
| Canvas web | react-moveable (drag/resize) |
