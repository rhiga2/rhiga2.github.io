# Letter Theme Migration — Design Spec

**Date:** 2026-05-22  
**Status:** Approved

## Goal

Migrate rhiga2.github.io from its current custom-CSS Astro site to a full adoption of the [letter](https://github.com/riceball-tw/letter) portfolio theme aesthetic: clean, minimal, content-first. Add Projects and Resume sections that don't currently exist.

## What the user wants

- Cleaner/more minimal look — no gradients, no glassmorphic effects, less decoration
- Content-first layout — resume, work, and writing front and center
- New pages: `/resume/` and `/work/`
- Existing content can be overwritten

## Architecture

### Add
- **Tailwind CSS v4** via `@tailwindcss/vite` — replaces all custom CSS
- **`@astrojs/mdx`** — for project and blog MDX content
- **Content collections** — blog posts, projects, resume driven by files in `src/content/`
- **`astro-icon`** — for social/nav icons (needs install; used by letter)

### Keep
- Astro v6 framework (already compatible)
- GitHub Pages deployment via `withastro/action`
- RSS feed (`src/pages/rss.xml.js`, updated to use content collection)
- Preact island (`src/components/Greeting.jsx`) — kept on home page (project uses `@astrojs/preact`, not React)

### Remove
- `src/styles/global.css` — replaced by Tailwind
- All existing components: `Header`, `Footer`, `Navigation`, `Menu`, `Social`, `ThemeIcon`, `Welcome`
- `src/pages/posts/` — posts move to `src/content/blog/`
- i18n routing (letter's `[language]` dynamic routes — not needed for English-only site)
- `src/layouts/Layout.astro` (unused stub)

## Pages

| Route | Status | Notes |
|---|---|---|
| `/` | Rebuild | Letter-style hero ("Hi, I'm Ryley"), focus areas list, CTA buttons |
| `/about/` | Rebuild | Simple bio page |
| `/blog/` | Rebuild | Listing driven by `blog` content collection |
| `/blog/[slug]/` | New | Individual post pages from content collection |
| `/tags/` | Rebuild | Tag index page |
| `/tags/[tag]/` | Rebuild | Posts filtered by tag |
| `/resume/` | New | Driven by `src/content/resume/resume.yaml` |
| `/work/` | New | Project card grid driven by `project` content collection |
| `/work/[slug]/` | New | Individual project detail pages |
| `/rss.xml` | Update | Point at blog content collection |

## Content Model

### `src/content/blog/` (MDX)
Migrate from `src/pages/posts/*.md`. Fields:
```yaml
title: string
description: string
pubDate: date
tags: string[]
```
Note: existing posts also have `author` and `image` frontmatter fields — these are tutorial placeholders and will be dropped. Post URLs change from `/posts/[slug]/` to `/blog/[slug]/` (breaking change; no redirects needed since this is a personal site).

### `src/content/project/` (MDX)
New. Fields:
```yaml
title: string
description: string
tech: string[]      # e.g. ["Python", "PyTorch"]
pubDate: date
```
Body: project description / writeup in MDX.

### `src/content/resume/resume.yaml`
New YAML file with structure:
```yaml
name: string
title: string
location: string
email: string
summary: string
experience:
  - role, company, dates, bullets[]
education:
  - degree, school, dates
skills:
  - category, items[]
socials:
  - platform, url
```
Placeholder values provided; user fills in real content.

## Components

New components (all Tailwind, no custom CSS):

| Component | Purpose |
|---|---|
| `Navbar.astro` | Horizontal nav: logo left, links right. Sticky. Active link indicator. |
| `Footer.astro` | Name + tagline left, social links right. Border-top separator. |
| `BaseLayout.astro` | HTML shell: imports Tailwind, slots Navbar + Footer. |
| `MarkdownPostLayout.astro` | Layout for blog posts: title, date, tags, prose body. |
| `ProjectCard.astro` | Card for `/work/` listing: title, description, tech chips. |
| `ResumeSection.astro` | Reusable section block for resume page. |

`Greeting.jsx` is kept as-is (Preact island, no styling changes needed beyond Tailwind wrapper).

## Visual Design

Follows letter's aesthetic:
- **Background:** white (`#fff`) / near-white
- **Text:** near-black (`#111`) with muted grey (`#555`, `#888`) for secondary
- **Borders:** light grey (`#e5e5e5`)
- **Accent:** minimal — black buttons, grey chips
- **Typography:** system font stack (Inter / sans-serif)
- **Nav:** plain horizontal links, bold logo, no pill/glassmorphic styling
- **No gradients, no shadows beyond subtle card borders**
- Dark mode: not included in initial migration (can be added later)

## What's explicitly out of scope

- i18n / multilingual support
- FAQ page (no content — can add later)
- Docker / Cloudflare deployment (keeping GitHub Pages)
- Lighthouse CI pipeline
- letter's `StickyNote`, `Banner`, `Accorditions`, `Tabs` components (not needed for current content)
