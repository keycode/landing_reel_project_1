# LandingReel - Master Plan & Arquitectura B2C

## 1. Visión del Producto
LandingReel es una plataforma SaaS diseñada específicamente para el entorno móvil B2C y Prosumer. Su premisa principal es ofrecer la creación de "landing pages móviles interactivas" utilizando la dinámica de **"Scrollytelling"** (navegación fluida vertical tipo historias o Reels, mediante *swipe*).
El formato vertical es nativo, y el motor base para animaciones/interacciones combina GSAP y Embla Carousel.

## 2. Modelo de Negocio (Product-Led Growth - PLG)
La estrategia de crecimiento recae sobre un modelo **Freemium / Premium**.

### Tier Free (Crecimiento Viral)
- **Costo:** 0€.
- **Condición:** Todos los Reels publicados incluirán de forma inamovible una marca de agua (ej. *"⚡ Member of LandingReel family"*). Esta marca está enlazada hacia `landingreel.com` para captar tráfico orgánico de los visitantes.
- **Caducidad Estricta:** Las landing libres caducan y dejan de ser accesibles exactamente a los **30 días** desde su creación. Expirados estos 30 días, el servidor devuelve un componente genérico de *"Campaña Expirada"* (con un botón de registro).

### Tier Premium (Monetización)
- **Costo:** 9,95€ (suscripción o tarifa plana única a determinar en Stripe).
- **Ventajas:**
  - Sin marcas de agua publicitarias.
  - La landing permanece activa de manera **indefinida**, saltando las reglas de expiración.

### Dogfooding Integral
Para demostrar la eficacia técnica, la propia página de venta y embudo en `landingreel.com` estará construida íntegramente utilizando los componentes internos del propio SaaS y la dinámica "Scrollytelling".

---

## 3. Stack Tecnológico Desacoplado 
El proyecto opera sobre una arquitectura robusta de **Monorepo**. Para asegurar resiliencia absoluta, el editor creador está totalmente *aislado* del motor de renderizado público que recibe el tráfico de los visitantes.

### App 1: El SaaS y Editor (`landingreel.com`)
- **Directorio:** `apps/web/`
- **Tecnología:** Next.js (App Router, Turbopack). React Server Components.
- **Alcance Operativo:** Landing publicitaria, sistema de autenticación, Dashboard de gestión, facturación vía Stripe, y el pesado **Editor Visual** desde donde el creador interactivamente arma su Reel.

### App 2: Motor de Entrega (`io.landingreel.com`)
- **Directorio:** `apps/viewer/`
- **Tecnología:** Astro con adaptador backend para Node.js (SSR - Server Side Rendering).
- **Alcance Operativo:** Este componente es exclusivo para la visualización extremadamente rápida del contenido generado por los clientes. Consume variables de URL dinámicas (`[id].astro`).
- Renderiza inicial y condicionalmente rutas en base a datos servidos por Supabase. Transfiere interactividad pesada a React (vía directiva `client:load`) de componentes compartidos.

### Shared Core (`packages/`)
- Módulos consumidos de manera uniforme por *editor* (Next.js) y *visor* (Astro).
- **UI:** Componentes React nativamente responsivos (`@landingreel/ui`), integrando *Tailwind CSS v4*, *Embla Carousel* (y `embla-carousel-wheel-gestures`), además de *GSAP* e integraciones nativas como `@gsap/react`.
- **Estandarización de Interfaz:** Componentes clave de negocio como `ReelPlayer`, `ShotRenderer`, `Watermark`, y `CampaignExpired`.

---

## 4. Arquitectura de Base de Datos y Automatización (Growth Stack)
Toda infraestructura crítica está enfocada a optimización de base de datos directa y sincronización de CRM en tiempo asíncrono, protegiendo a los frameworks frontend.

### Supabase (Backend/Database - Single Source of Truth V1)
Gestión completa de Auth (Auth.js / Supabase Auth), Relational Database (PostgreSQL) y Object/Blob Storage.
Campos obligatorios detectados a nivel tabla (Entity: `projects`/`reels`):
- `is_premium` (Booleano - Control de Pago)
- `published_at` (Timestamp - Control de Caducidad Libre)
- `phone_number` (String opcional - WhatsApp Onboarding)

*Toda validación de negocio (caducidad)* debe hacerse consultando directamente a Supabase al momento de carga del Motor Astro SSR (Server Payload), ahorrando costos antes de inyectar interactividad.

### n8n (Middleware Routing Automático)
Alojado en servidor privado VPS a través de DockPloy. Actúa como capa de Middleware "Zero-Code/Custom-Code".
**El Pipeline Obligatorio V1:**
 `Supabase (PostgreSQL Database Webhooks)` -> `POST a webhook n8n` -> `n8n Formatea` -> `Peticiones 3d-party API (Attio, MailerSend, WhatsApp)`.

### Attio (CRM Central del CEO)
Attio será el panel de control ejecutivo V1, y gestionará enteramente:
- El pipeline por *Stages* (`Sign Up` -> `First Reel` -> `30-Day Warning` -> `Premium Converted` -> `Churned`).
- Suscripciones, perfiles extendidos (user events).
*Bajo ninguna circunstancia Next.js o Astro operan directamente sobre el API de Attio o MailerSend. n8n sirve como orquestador asíncrono.*
