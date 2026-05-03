# Documentación de Nueva Funcionalidad: Sistema de Variantes Híbrido (Layouts)

**Fecha:** 26 de Febrero de 2026
**Agente Redactor:** `@documenter`
**Reporte de Tarea:** Implementación de variante por 'Roles' en el Editor Visual sobre un canvas libre ('react-moveable').

---

## 🎯 Objetivo de la Tarea
La evolución de la UX del Editor exigía un sistema híbrido: mantener la libertad total de movimiento (`react-moveable`) pero proveer a los creadores de plantillas predefinidas (Variantes o Layouts) que agilicen el diseño, inspirándose fuertemente en el sistema de Auto Layout y Nombres de Capa ('Layer Names') de Figma.

El objetivo, dictaminado a `@frontend` integrando a `@integrator`, fue construir este "Switch" mágico en el *Zustand store* donde elementos como textos e imágenes salten de posición dependiendo del layout visual, manteniendo su contenido inmutable.

---

## 🛠️ Resumen Técnico de Cambios Realizados

| Archivo Modificado / Creado | Descripción del Cambio | Impacto / Solución |
| :--- | :--- | :--- |
| **`@landingreel/ui`** (`ShotRenderer.tsx`) | Extension de Tipo | Adición de la propiedad `role?: string` al objeto `FreeFormElement`. Funciona como el 'Layer Name' que guía a la plantilla. |
| **`@landingreel/ui`** (`lib/variants.ts`) | Nuevo Archivo de Diccionario | Creación de consts `defaultVariants`. Define plantillas (`hero-centered`, `hero-bottom`, `title-only`) con roles estándar ('primary-text', 'button-cta'), coordinadas estáticas y de diseño en formato base. |
| **`apps/web`** (`useReelStore.ts`) | Motor Lógico de Mapeado | Configuración de la acción `applyVariantToSlide(shotId, variantId)`. El motor interseca los roles existentes en el *slide* contra el *template*. Si coincide, "teletransporta" las `x`, `y`, `width` y demás dimensiones sobreescribiendo el state, iterando sobre el array sin romper el contenido del usuario. |
| **`apps/web`** (`EditorPage`) | UI Update | Se han insertado botones en un grid responsivo sobre el array de "Elements" que inyectan el *variantId* deseado de la UI package directamente contra el store. Además, se habilitó un input de Solo-Lectura / Edición Rápida sobre el *Role* de cada elemento para usuarios avanzados. |

---

## 🚀 Flujos de Identidad (Data Flow) & Híbridación con Moveable

La parte fundamental de esta innovación arquitectónica reside en su interacción con el canvas Drag and Drop.

1. **El Usuario Crea:** Al entrar al editor, escribe su CTA "Comprar Ahora" sobre un elemento base asignado al rol `button-cta`.
2. **Preset Activation:** Al hacer clic en el layout "Hero Bottom", `applyVariantToSlide` es desencadenado en Zustand.
3. **El Salto (Zustand -> DOM):** La aplicación Next.js recalcula la coordenada `y` del botón inyectándole un `85%`. Esto es sincronizado en tiempo real a través del iFrame (`postMessage`) a Astro, desplazando físicamente el DOM sin destruir el texto "Comprar Ahora".
4. **La Libertad Moveable:** Cuando el usuario interactúa en la pantalla usando su ratón sobre el botón desplazado, `react-moveable` captura el arrastre y lanza el evento regular `updateElement`. El store sobrescribe el `85%` anterior con (por ejemplo) un `76%`.
5. **Resultado Final:** Interacción libre sostenida por una base lógica estandarizada.

---

## ✅ Estado: Completado y Funcional.
Reporte archivado para consulta general. Se asume listo para que @aipilot lo entienda y se apoye en él durante manipulaciones generativas (`structured output`) sobre el store.
