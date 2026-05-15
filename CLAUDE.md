# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npx astro check   # TypeScript/Astro type checking
```

No test suite is configured.

## Architecture

This is a personal website built with [Astro](https://astro.build) (v6), deployed to GitHub Pages via the `withastro/action` GitHub Actions workflow on every push to `main`.

- `src/pages/` — file-based routing; each `.astro` file becomes a page
- `src/layouts/` — shared HTML shell (`Layout.astro`) with `<slot />` for page content
- `src/components/` — reusable Astro components
- `src/assets/` — images and SVGs imported by components (processed by Astro)
- `public/` — static assets served as-is (favicon, etc.)

TypeScript is enabled in strict mode (`tsconfig.json` extends `astro/tsconfigs/strict`).

The site has used MathJax for rendering math; if adding pages with mathematical notation, configure MathJax delimiters in the layout or page head.
