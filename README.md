# ETF Sparplaner Frontend

Ein modernes Vue 3 Frontend für die ETF-Sparplan-Verwaltung mit TypeScript, Pinia State Management und umfassender Test-Abdeckung.

## 🎯 Features

- ✅ ETF-Sparplan-Verwaltung (Erstellen, Bearbeiten, Löschen)
- ✅ Szenario-Berechnungen (Best/Base/Worst Case)
- ✅ Authentication (Login, Register, Password Reset)
- ✅ FX-Rates Integration
- ✅ Responsive Design
- ✅ TypeScript & Type Safety
- ✅ 59 Unit-Tests
- ✅ Clean Architecture

## 📁 Projekt-Struktur

```
src/
├── components/      # Vue Komponenten (6 Komponenten, alle verwendet)
├── composables/     # Wiederverwendbare Vue Composables
├── router/          # Vue Router Konfiguration
├── services/        # API Services
├── stores/          # Pinia Stores (State Management)
├── types/           # TypeScript Type-Definitionen
├── utils/           # Utility-Funktionen
└── views/           # Page-Komponenten (5 Views)
```

**Hinweis:** Das Projekt wurde am 2025-01-16 bereinigt. Details siehe [CLEANUP_REPORT.md](./CLEANUP_REPORT.md)

## 🚀 Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
