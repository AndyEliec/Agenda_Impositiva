# Agenda Impositiva Automatizada - Estudio Contable

## 🎯 ¿Qué es y para qué sirve?
Este proyecto es un sistema de gestión operativa y alertas tributarias en tiempo real diseñado para optimizar el seguimiento de obligaciones fiscales en un estudio contable. 

A través de un panel web (Single Page Application) y una base de datos centralizada en Google Sheets, el sistema calcula de forma automática los vencimientos mensuales de los clientes según su CUIT, evalúa feriados nacionales mediante una API externa y despacha notificaciones interactivas por Telegram a los operadores, permitiéndoles actualizar el estado de las tareas mediante botones directamente desde el celular.

---

## 🛠️ Stack Tecnológico Utilizado
*   **Frontend (SPA):** HTML5, CSS3 adaptable (Modo Claro/Oscuro y Responsive), Bootstrap 5 y JavaScript nativo.
*   **Backend (Serverless):** Google Apps Script (JavaScript V8) expuesto como Web App.
*   **Base de Datos / Logs:** Google Sheets (Estructura relacional de 11 tablas).
*   **Canal de Alertas:** Telegram Bot API con soporte para Webhooks bidireccionales.
*   **APIs Externas:** API de Argentina Datos (Feriados nacionales en tiempo real).

---

## 🚀 Guía de Uso Rápido

### 1. Panel de Control (Dashboard)
*   **Filtro Mensual:** Permite visualizar la carga de trabajo de cualquier período fiscal.
*   **KPIs en Tiempo Real:** Muestra el total de tareas, progreso porcentual, presentados y pendientes.
*   **Modificación Rápida:** Al hacer clic en el botón de edición de cualquier vencimiento, se abre un modal interactivo para cambiar el estado de la obligación ("Pendiente", "En Proceso", "Para Control", "Para Presentar", "Presentado") y dejar notas internas.

### 2. Estructura Tributaria
*   **Maestro de Impuestos:** Configuración de las obligaciones fiscales liquidables por el estudio.
*   **Matriz de Vencimientos:** Carga de las reglas impositivas basadas en los últimos dígitos del CUIT.
*   **Asignación de Clientes:** Vinculación directa de impuestos a los legajos de contribuyentes activos con control de duplicados y opción para eliminar asignaciones.

### 3. Automatización de Telegram
*   El sistema escanea de manera horaria las obligaciones pendientes.
*   Envía alertas con botones interactivos al chat del operador.
*   **Botón [Hecho]:** Actualiza el estado a "Presentado" en el Sheets y en la web al instante.
*   **Botón [Posponer 2h]:** Desplaza el horario de aviso para evitar spam durante la jornada laboral.
