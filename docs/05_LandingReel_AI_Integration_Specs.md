# Documentación de Arquitectura: Integración de IA y Nuevo Agente Copilot

**Fecha:** 26 de Febrero de 2026  
**Agente Redactor:** `@documenter`  
**Reporte de Tarea:** Actualización del Master Plan con la introducción del Agente 8 (`@aipilot`) y las especificaciones del Motor de IA.

---

## 🎯 Resumen de la Actualización
El CEO ha introducido un pivote estratégico en la arquitectura de LandingReel para dotar al editor de capacidades de Inteligencia Artificial generativa y analítica. Para ello, se ha ampliado el equipo fundacional con un nuevo especialista y se han actualizado las especificaciones (Specs) del proyecto.

## 🤖 Nuevo Integrante: Agent 8 (@aipilot)
Se ha incorporado al equipo **The AI Engineer & Copilot Builder** (`@aipilot`). 
Su misión principal es dotar al Editor Visual de un "cerebro" basado en LLMs Open Source, permitiendo que los usuarios construyan y optimicen sus LandingReels usando lenguaje natural.

**Responsabilidades Clave de `@aipilot`:**
1. **Copilot del Editor:** Creación de una interfaz de chat que actualice directamente el store (Zustand) mediante *Structured Outputs* o *Function Calling*.
2. **Importador Mágico:** Endpoint para parsear webs tradicionales (ej. WordPress) extrayendo su DOM y convirtiéndolo a la estructura vertical (`ShotData`) de LandingReel.
3. **Optimizador de Conversión:** Botón de un clic para analizar el JSON actual de la landing y proponer mejoras en copywriting (textos más cortos) y UX visual aplicando reglas en un pipeline de sistema.

*Referencia del agente: `.ai/agents/agent-8-aipilot.md`*

## 🧠 Motor de Inteligencia Artificial (LandingReel AI)
La actualización del archivo `.ai/spec.md` establece las bases técnicas para el ecosistema de IA del proyecto:

- **Modelo Base:** Motor LLM Open Source (ej. Deepseek o Llama 3) accesible vía API REST.
- **Conocimiento (RAG y Fine-Tuning):** Especialización explícita en reglas de alta conversión (Scrollytelling, jerarquía visual, brevedad).
- **Operaciones Core:** 
  1. *Generador UI:* Emisión estricta de objetos JSON validados contra la interfaz de Zustand.
  2. *Migración (Parser):* Digestión de contenido largo en fragmentos visuales orientados a scroll vertical.
  3. *Optimización:* Análisis proactivo de la tasa de conversión en base a parámetros del reel activo.

## 📋 Sumario de Archivos Modificados

| Archivo | Descripción del Cambio |
| :--- | :--- |
| `.ai/spec.md` | Inclusión del bloque "Motor de Inteligencia Artificial" detallando el stack LLM y sus 3 casos de uso. |
| `.ai/agents/agent-8-aipilot.md` | Creación del perfil del nuevo agente. Define la regla de oro: el modelo nunca devuelve React/HTML, sólo mutaciones JSON exactas. |
| `.ai/agents.md` | Actualizado el panel de control del equipo con la entrada unificada de `@aipilot`. |

---
## ✅ Impacto Cross-Agent (Notas para el resto del equipo)
- **Atención `@frontend`:** Debes extremar la modularidad del Editor Visual. El canvas y el estado en Zustand deben poder recibir hooks de mutación asíncrona lanzados por `@aipilot` y reflejar el cambio en tiempo real (Zero-latency UI) a través de `react-moveable`.
- **Atención `@integrator`:** Debes preparar el enrutamiento y posibles edge functions para las llamadas a la API REST interna del LLM sin bloquear el renderizado del dashboard de Next.js.

Documentación de specs validada, compilada y notificada a la memoria del proyecto.
