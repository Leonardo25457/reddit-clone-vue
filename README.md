# Desafío Técnico - Cliente Reddit en Vue

## 📦 Descripción
Aplicación SPA que consume la API pública de Reddit para visualizar publicaciones, con funciones adicionales como búsqueda y autenticación; cumpliendo ademas con el diseño responsive tanto para desktop como para mobile.

## 🚀 Tecnologías
- Vue 2 + Vuex + Vue Router
- Tailwind CSS
- Sweetalert2
- Firebase (Autenticación)
- Axios
- Vercel para despliegue

## 🛠️ Decisiones Técnicas
- **Vue 2**: Cumple con los requisitos del desafío y permite rápida implementación.
- **Firebase Auth**: Elegido por simplicidad en autenticación sin servidor propio.
- **Vercel**: Para despliegue rápido y gratuito.
- Estructura modular con componentes separados para mantenibilidad.
- Uso de Vuex para control de sesión global.
- Router con guards para proteger rutas.

## 🕐 Tiempo Invertido
Aproximadamente 2 días totales distribuidos en:

- Día 1: Configuración base, autenticación, rutas, estructura.
- Día 2: Funcionalidades, mejoras visuales, búsqueda, validaciones.

## 📁 Instrucciones de Ejecución Local

```bash
npm install
npm run serve