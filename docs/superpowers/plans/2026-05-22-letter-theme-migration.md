# Letter Theme Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate rhiga2.github.io to the letter theme aesthetic — minimal, white, content-first — with new `/resume/` and `/work/` pages backed by content collections.

**Architecture:** Add Tailwind CSS v4 and `@astrojs/mdx` to the existing Astro v6 project. Replace all custom CSS and components with Tailwind-based equivalents modelled on the letter theme. Move blog posts from `pages/posts/*.md` to a content collection; add `project` collection and a TypeScript resume data file.

**Tech Stack:** Astro v6, Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/mdx`, `@tailwindcss/typography`, Preact (existing), `@astrojs/rss` (existing)

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Modify | `package.json` | Add tailwind, mdx, typography deps |
| Modify | `astro.config.mjs` | Add mdx integration + tailwind vite plugin |
| Create | `src/content.config.ts` | Content collection schemas (blog, project) |
| Create | `src/content/blog/post-1.md` … `post-4.md` | Migrated blog posts |
| Create | `src/content/project/ml-eval.mdx` | Placeholder project 1 |
| Create | `src/content/project/this-site.mdx` | Placeholder project 2 |
| Create | `src/data/resume.ts` | Resume data (TypeScript, placeholder values) |
| Create | `src/styles/base.css` | Tailwind entry point + typography plugin |
| Create | `src/components/Navbar.astro` | New minimal navbar (replaces Header + Navigation + Menu) |
| Modify | `src/components/Footer.astro` | Rebuild footer with Tailwind |
| Modify | `src/layouts/BaseLayout.astro` | Switch to Tailwind, new `title` prop |
| Delete | `src/layouts/MarkdownPostLayout.astro` | Replaced by `pages/blog/[slug].astro` |
| Delete | `src/layouts/Layout.astro` | Unused stub |
| Delete | `src/styles/global.css` | Replaced by `base.css` + Tailwind |
| Delete | `src/components/Header.astro` | Replaced by Navbar |
| Delete | `src/components/Navigation.astro` | Replaced by Navbar |
| Delete | `src/components/Menu.astro` | Replaced by Navbar |
| Delete | `src/components/Social.astro` | Inline in Footer |
| Delete | `src/components/ThemeIcon.astro` | Dark mode out of scope |
| Delete | `src/components/Welcome.astro` | Unused |
| Delete | `src/pages/posts/` | Posts migrate to content collection |
| Modify | `src/pages/index.astro` | Rebuild home page |
| Modify | `src/pages/about.astro` | Rebuild about page |
| Modify | `src/pages/blog.astro` | Rebuild blog listing with content collection |
| Create | `src/pages/blog/[slug].astro` | Individual blog post pages |
| Modify | `src/pages/tags/index.astro` | Use content collection |
| Modify | `src/pages/tags/[tag].astro` | Use content collection |
| Create | `src/pages/resume.astro` | New resume page |
| Create | `src/components/ProjectCard.astro` | Card for work listing |
| Create | `src/pages/work/index.astro` | New work listing page |
| Create | `src/pages/work/[slug].astro` | Individual project pages |
| Modify | `src/pages/rss.xml.js` | Switch to content collection |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install new packages**

```bash
npm install @tailwindcss/vite tailwindcss @tailwindcss/typography @astrojs/mdx
```

- [ ] **Step 2: Verify package.json contains all four new deps**

```bash
grep -E "tailwind|mdx" package.json
```

Expected output includes `@tailwindcss/vite`, `tailwindcss`, `@tailwindcss/typography`, `@astrojs/mdx`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add tailwind v4 and mdx dependencies"
```

---

## Task 2: Update astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Replace astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rhiga2.github.io',
  integrations: [preact(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 2: Verify config loads without errors**

```bash
npx astro check
```

Expected: no errors (existing pages still compile).

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: add mdx integration and tailwind vite plugin to astro config"
```

---

## Task 3: Create content collection schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create src/content.config.ts**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const project = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/project' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog, project };
```

- [ ] **Step 2: Create empty content directories**

```bash
mkdir -p src/content/blog src/content/project
```

- [ ] **Step 3: Verify schema compiles**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add blog and project content collection schemas"
```

---

## Task 4: Migrate blog posts to content collection

**Files:**
- Create: `src/content/blog/post-1.md`, `post-2.md`, `post-3.md`, `post-4.md`

The existing posts live in `src/pages/posts/`. They use a `layout:` frontmatter field and have `author` and `image` fields. The new content collection does not use `layout:` (that is handled by `pages/blog/[slug].astro` in Task 10). Drop `layout:`, `author`, and `image`.

- [ ] **Step 1: Create src/content/blog/post-1.md**

```markdown
---
title: 'My First Blog Post'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
tags: ["astro", "blogging", "learning in public"]
---
Welcome to my _new blog_ about learning Astro! Here, I will share my learning journey as I build a new website.

## What I've accomplished

1. **Installing Astro**: First, I created a new Astro project and set up my online accounts.

2. **Making Pages**: I then learned how to make pages by creating new `.astro` files and placing them in the `src/pages/` folder.

3. **Making Blog Posts**: This is my first blog post! I now have Astro pages and Markdown posts!

## What's next

I will finish the Astro tutorial, and then keep adding more posts. Watch this space for more to come.
```

- [ ] **Step 2: Create src/content/blog/post-2.md**

```markdown
---
title: 'My Second Blog Post'
pubDate: 2022-07-08
description: "After learning some Astro, I couldn't stop!"
tags: ["astro", "blogging", "learning in public"]
---
After a successful first week learning Astro, I decided to try some more. I wrote and imported a small component from memory!
```

- [ ] **Step 3: Create src/content/blog/post-3.md**

```markdown
---
title: 'My Third Blog Post'
pubDate: 2022-07-15
description: 'I had some challenges, but asking in the community really helped!'
tags: ["astro", "learning in public", "setbacks", "community"]
---
It wasn't always smooth sailing, but I'm enjoying building with Astro. And, the [Discord community](https://astro.build/chat) is really friendly and helpful!
```

- [ ] **Step 4: Create src/content/blog/post-4.md**

```markdown
---
title: 'My Fourth Blog Post'
pubDate: 2022-08-08
description: "This post will show up on its own!"
tags: ["astro", "successes"]
---
This post should show up with my other blog posts, because `import.meta.glob()` is returning a list of all my posts in order to create my list.
```

- [ ] **Step 5: Verify collection loads**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/content/blog/
git commit -m "feat: migrate blog posts to content collection"
```

---

## Task 5: Create placeholder project content

**Files:**
- Create: `src/content/project/ml-eval.mdx`
- Create: `src/content/project/this-site.mdx`

- [ ] **Step 1: Create src/content/project/ml-eval.mdx**

```mdx
---
title: 'ML Eval Framework'
description: 'A lightweight harness for running offline LLM evaluations.'
tech: ['Python', 'PyTorch', 'HuggingFace']
pubDate: 2024-01-01
---

A lightweight evaluation harness for running offline assessments of large language model outputs. Supports custom metrics, batch evaluation, and structured output logging.

Replace this content with your actual project description.
```

- [ ] **Step 2: Create src/content/project/this-site.mdx**

```mdx
---
title: 'rhiga2.github.io'
description: 'Personal portfolio and blog built with Astro and the letter theme.'
tech: ['Astro', 'TypeScript', 'Tailwind CSS']
pubDate: 2026-05-22
---

This site. Built with Astro v6, styled after the [letter](https://github.com/riceball-tw/letter) portfolio theme. Hosted on GitHub Pages.

Replace this content with your actual project description.
```

- [ ] **Step 3: Verify collection loads**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/project/
git commit -m "feat: add placeholder project content entries"
```

---

## Task 6: Create resume data file

**Files:**
- Create: `src/data/resume.ts`

- [ ] **Step 1: Create src/data/resume.ts**

```ts
export const resume = {
  name: 'Ryley Higa',
  title: 'Senior ML Engineer',
  location: 'Honolulu, HI',
  email: 'ryley@example.com',
  summary:
    'Senior machine learning engineer building reliable systems from unreliable AI.',
  experience: [
    {
      role: 'Senior ML Engineer',
      company: 'Company Name',
      start: '2022',
      end: 'present',
      bullets: [
        'Built production ML systems and evaluation loops.',
        'Designed data pipelines and model serving infrastructure.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University Name',
      year: '2020',
    },
  ],
  skills: [
    { category: 'Languages', items: ['Python', 'TypeScript', 'SQL'] },
    { category: 'ML', items: ['PyTorch', 'scikit-learn', 'HuggingFace'] },
    { category: 'Web', items: ['Astro', 'Preact', 'Tailwind CSS'] },
  ],
  socials: [
    { platform: 'GitHub', url: 'https://github.com/rhiga2' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ryleyhiga' },
    { platform: 'Instagram', url: 'https://instagram.com/helloimhiga' },
  ],
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/resume.ts
git commit -m "feat: add placeholder resume data file"
```

---

## Task 7: Create Tailwind CSS entry point

**Files:**
- Create: `src/styles/base.css`

- [ ] **Step 1: Create src/styles/base.css**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

That is the entire file. Tailwind v4 needs no configuration file — all utilities are generated automatically. The typography plugin enables the `prose` class used in blog posts and project pages.

- [ ] **Step 2: Commit**

```bash
git add src/styles/base.css
git commit -m "feat: add tailwind v4 css entry point with typography plugin"
```

---

## Task 8: Build Navbar component

**Files:**
- Create: `src/components/Navbar.astro`

- [ ] **Step 1: Create src/components/Navbar.astro**

```astro
---
const currentPath = Astro.url.pathname;

const links = [
  { href: '/about/', label: 'About' },
  { href: '/blog/', label: 'Blog' },
  { href: '/work/', label: 'Work' },
  { href: '/resume/', label: 'Resume' },
];
---

<nav class="sticky top-0 z-10 bg-white border-b border-gray-200">
  <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="font-bold text-gray-900 hover:text-gray-600 transition-colors">
      Ryley
    </a>
    <div class="flex gap-6">
      {links.map(({ href, label }) => (
        <a
          href={href}
          class={`text-sm transition-colors ${
            currentPath.startsWith(href)
              ? 'font-bold text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {label}
        </a>
      ))}
    </div>
  </div>
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.astro
git commit -m "feat: add minimal Navbar component"
```

---

## Task 9: Rebuild Footer component

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Overwrite src/components/Footer.astro**

```astro
---
---

<footer class="max-w-4xl mx-auto px-4 py-8 mt-16 border-t border-gray-200">
  <div class="flex flex-col sm:flex-row justify-between gap-4">
    <div>
      <a href="/" class="font-bold text-gray-900">Ryley</a>
      <p class="text-sm text-gray-500 mt-1">
        Creating useful systems, learning in public.
      </p>
    </div>
    <div class="flex gap-4 text-sm text-gray-500">
      <a href="https://github.com/rhiga2" class="hover:text-gray-900 transition-colors">
        GitHub
      </a>
      <a href="https://linkedin.com/in/ryleyhiga" class="hover:text-gray-900 transition-colors">
        LinkedIn
      </a>
      <a href="https://instagram.com/helloimhiga" class="hover:text-gray-900 transition-colors">
        Instagram
      </a>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: rebuild Footer with Tailwind"
```

---

## Task 10: Rebuild BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

The existing layout uses `pageTitle` and `hideTitle` props and imports `global.css`. The new layout uses `title`, drops `hideTitle` (page headings are now each page's responsibility), and imports `base.css`.

- [ ] **Step 1: Overwrite src/layouts/BaseLayout.astro**

```astro
---
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/base.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body class="bg-white text-gray-900 min-h-screen">
    <Navbar />
    <main class="max-w-4xl mx-auto px-4 py-8">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: rebuild BaseLayout with Tailwind, drop global.css"
```

---

## Task 11: Rebuild home page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Overwrite src/pages/index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Greeting from '../components/Greeting';

const services = [
  {
    title: 'Machine Learning',
    href: '/work/',
    desc: 'Production-minded model work, experiments, and evaluation loops.',
  },
  {
    title: 'Data Products',
    href: '/work/',
    desc: 'Interfaces and workflows that make complex systems easier to reason about.',
  },
  {
    title: 'Astro Notes',
    href: '/blog/',
    desc: 'A small learning archive for web experiments and technical writing.',
  },
];
---

<BaseLayout title="Ryley Higa" description="Senior machine learning engineer.">
  <section class="py-16">
    <h1 class="text-4xl font-bold mb-4">Hi, I'm Ryley 👋</h1>
    <p class="text-lg text-gray-500 mb-8 max-w-xl">
      Senior machine learning engineer in Honolulu, HI. I build reliable
      systems from unreliable AI.
    </p>
    <div class="flex gap-3 mb-8">
      <a
        href="/resume/"
        class="bg-gray-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-700 transition-colors"
      >
        View Resume →
      </a>
      <a
        href="/work/"
        class="border border-gray-300 px-4 py-2 rounded text-sm text-gray-700 hover:border-gray-500 transition-colors"
      >
        See Work
      </a>
    </div>
    <Greeting client:load messages={["Hej", "Hallo", "Hola", "Habari"]} />
  </section>

  <section class="py-8 border-t border-gray-200">
    <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
      Focus areas
    </h2>
    <div class="flex flex-col divide-y divide-gray-100">
      {
        services.map(({ title, href, desc }) => (
          <a href={href} class="flex justify-between items-center py-4 group">
            <div>
              <span class="font-bold text-gray-900">{title}</span>
              <p class="text-sm text-gray-500 mt-0.5">{desc}</p>
            </div>
            <span class="text-gray-400 group-hover:text-gray-900 transition-colors">
              →
            </span>
          </a>
        ))
      }
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Start dev server and verify home page renders**

```bash
npm run dev
```

Open http://localhost:4321. Check: navbar shows, hero text renders, focus area links display, Greeting island loads.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rebuild home page with letter theme layout"
```

---

## Task 12: Rebuild about page

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Overwrite src/pages/about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About — Ryley Higa" description="Senior ML engineer in Honolulu.">
  <h1 class="text-3xl font-bold mb-6">About</h1>
  <div class="max-w-2xl space-y-4 text-gray-700">
    <p>
      I'm Ryley, a senior machine learning engineer living in Honolulu, HI. I
      spend most of my time building production ML systems, evaluation loops,
      and the data pipelines that feed them.
    </p>
    <p>
      Outside of work I play volleyball, do CrossFit, and tinker with Astro.
      This site is part notebook, part portfolio — a place to write up things I
      learn and share projects I've shipped.
    </p>
    <p>
      Find me on{' '}
      <a href="https://github.com/rhiga2" class="underline hover:text-gray-900">
        GitHub
      </a>{' '}
      or{' '}
      <a
        href="https://linkedin.com/in/ryleyhiga"
        class="underline hover:text-gray-900"
      >
        LinkedIn
      </a>.
    </p>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify page renders**

With dev server running, visit http://localhost:4321/about/. Check: heading displays, text renders.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: rebuild about page"
```

---

## Task 13: Build blog/[slug].astro

**Files:**
- Create: `src/pages/blog/[slug].astro`

Blog posts are now served from this dynamic route rather than from `pages/posts/` markdown files.

- [ ] **Step 1: Create src/pages/blog/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={`${post.data.title} — Ryley Higa`} description={post.data.description}>
  <article class="max-w-2xl">
    <h1 class="text-3xl font-bold mb-2">{post.data.title}</h1>
    <p class="text-sm text-gray-500 mb-2">
      <time datetime={post.data.pubDate.toISOString()}>
        {
          post.data.pubDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }
      </time>
    </p>
    <div class="flex flex-wrap gap-2 mb-8">
      {
        post.data.tags.map((tag) => (
          <a
            href={`/tags/${tag}/`}
            class="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 hover:bg-gray-200"
          >
            {tag}
          </a>
        ))
      }
    </div>
    <div class="prose max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Verify post pages render**

With dev server running, visit http://localhost:4321/blog/post-1/. Check: title, date, tags, and post body display.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add blog/[slug].astro for content collection posts"
```

---

## Task 14: Rebuild blog listing page

**Files:**
- Modify: `src/pages/blog.astro`

- [ ] **Step 1: Overwrite src/pages/blog.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
---

<BaseLayout title="Blog — Ryley Higa" description="Writing about ML, web dev, and learning in public.">
  <h1 class="text-3xl font-bold mb-2">Blog</h1>
  <p class="text-gray-500 mb-8">
    Writing about ML, web dev, and learning in public.
  </p>
  <ul class="flex flex-col gap-6">
    {
      posts.map((post) => (
        <li>
          <a href={`/blog/${post.id}/`} class="block group">
            <h2 class="font-bold text-gray-900 group-hover:underline">
              {post.data.title}
            </h2>
            <p class="text-sm text-gray-500 mt-1">{post.data.description}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              {post.data.tags.map((tag) => (
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        </li>
      ))
    }
  </ul>
</BaseLayout>
```

- [ ] **Step 2: Verify blog listing renders**

Visit http://localhost:4321/blog/. Check: all four posts appear, sorted by date descending.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog.astro
git commit -m "feat: rebuild blog listing page with content collection"
```

---

## Task 15: Rebuild tags pages

**Files:**
- Modify: `src/pages/tags/index.astro`
- Modify: `src/pages/tags/[tag].astro`

- [ ] **Step 1: Overwrite src/pages/tags/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = await getCollection('blog');
const allTags = [...new Set(posts.flatMap((post) => post.data.tags))].sort();
---

<BaseLayout title="Tags — Ryley Higa">
  <h1 class="text-3xl font-bold mb-6">Tags</h1>
  <div class="flex flex-wrap gap-3">
    {
      allTags.map((tag) => (
        <a
          href={`/tags/${tag}/`}
          class="border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 transition-colors"
        >
          {tag}
        </a>
      ))
    }
  </div>
</BaseLayout>
```

- [ ] **Step 2: Overwrite src/pages/tags/[tag].astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const allTags = [...new Set(posts.flatMap((post) => post.data.tags))];
  return allTags.map((tag) => ({
    params: { tag },
    props: {
      posts: posts.filter((p) => p.data.tags.includes(tag)),
    },
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<BaseLayout title={`#${tag} — Ryley Higa`}>
  <h1 class="text-3xl font-bold mb-2">#{tag}</h1>
  <p class="text-gray-500 mb-8">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
  <ul class="flex flex-col gap-6">
    {
      posts.map((post) => (
        <li>
          <a href={`/blog/${post.id}/`} class="block group">
            <h2 class="font-bold text-gray-900 group-hover:underline">
              {post.data.title}
            </h2>
            <p class="text-sm text-gray-500 mt-1">{post.data.description}</p>
          </a>
        </li>
      ))
    }
  </ul>
</BaseLayout>
```

- [ ] **Step 3: Verify both pages render**

Visit http://localhost:4321/tags/ and http://localhost:4321/tags/astro/. Check: tag list displays, filtered posts list displays.

- [ ] **Step 4: Commit**

```bash
git add src/pages/tags/
git commit -m "feat: rebuild tags pages with content collection"
```

---

## Task 16: Build resume page

**Files:**
- Create: `src/pages/resume.astro`

- [ ] **Step 1: Create src/pages/resume.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { resume } from '../data/resume';
---

<BaseLayout title="Resume — Ryley Higa">
  <div class="max-w-2xl">
    <h1 class="text-3xl font-bold">{resume.name}</h1>
    <p class="text-gray-500 mt-1">{resume.title} · {resume.location}</p>
    <p class="text-sm text-gray-500">{resume.email}</p>
    <p class="mt-4 text-gray-700">{resume.summary}</p>

    <section class="mt-10">
      <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        Experience
      </h2>
      {
        resume.experience.map((job) => (
          <div class="mb-6">
            <div class="flex justify-between items-baseline">
              <h3 class="font-bold">{job.role}</h3>
              <span class="text-sm text-gray-500">
                {job.start}–{job.end}
              </span>
            </div>
            <p class="text-gray-500 text-sm">{job.company}</p>
            <ul class="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
              {job.bullets.map((b) => (
                <li>{b}</li>
              ))}
            </ul>
          </div>
        ))
      }
    </section>

    <section class="mt-8 border-t border-gray-200 pt-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        Education
      </h2>
      {
        resume.education.map((edu) => (
          <div class="flex justify-between items-baseline">
            <div>
              <h3 class="font-bold">{edu.degree}</h3>
              <p class="text-gray-500 text-sm">{edu.school}</p>
            </div>
            <span class="text-sm text-gray-500">{edu.year}</span>
          </div>
        ))
      }
    </section>

    <section class="mt-8 border-t border-gray-200 pt-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        Skills
      </h2>
      {
        resume.skills.map(({ category, items }) => (
          <div class="mb-4">
            <span class="text-sm font-semibold text-gray-700">{category}</span>
            <div class="flex flex-wrap gap-2 mt-1">
              {items.map((item) => (
                <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))
      }
    </section>

    <section class="mt-8 border-t border-gray-200 pt-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        Links
      </h2>
      <div class="flex gap-4">
        {
          resume.socials.map(({ platform, url }) => (
            <a
              href={url}
              class="text-sm text-gray-500 hover:text-gray-900 underline transition-colors"
            >
              {platform}
            </a>
          ))
        }
      </div>
    </section>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Verify page renders**

Visit http://localhost:4321/resume/. Check: all sections display with placeholder data.

- [ ] **Step 3: Commit**

```bash
git add src/pages/resume.astro
git commit -m "feat: add resume page"
```

---

## Task 17: Build work pages

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[slug].astro`

- [ ] **Step 1: Create src/components/ProjectCard.astro**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  project: CollectionEntry<'project'>;
}

const { project } = Astro.props;
---

<a
  href={`/work/${project.id}/`}
  class="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
>
  <h2 class="font-bold text-gray-900">{project.data.title}</h2>
  <p class="text-sm text-gray-500 mt-1">{project.data.description}</p>
  <div class="flex flex-wrap gap-2 mt-3">
    {
      project.data.tech.map((t) => (
        <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
          {t}
        </span>
      ))
    }
  </div>
</a>
```

- [ ] **Step 2: Create src/pages/work/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('project')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
---

<BaseLayout title="Work — Ryley Higa" description="Selected projects and experiments.">
  <h1 class="text-3xl font-bold mb-2">Work</h1>
  <p class="text-gray-500 mb-8">Selected projects and experiments.</p>
  <div class="grid sm:grid-cols-2 gap-4">
    {projects.map((project) => <ProjectCard project={project} />)}
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create src/pages/work/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('project');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---

<BaseLayout title={`${project.data.title} — Ryley Higa`} description={project.data.description}>
  <article class="max-w-2xl">
    <h1 class="text-3xl font-bold mb-2">{project.data.title}</h1>
    <p class="text-sm text-gray-500 mb-4">{project.data.description}</p>
    <div class="flex flex-wrap gap-2 mb-8">
      {
        project.data.tech.map((t) => (
          <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
            {t}
          </span>
        ))
      }
    </div>
    <div class="prose max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Verify work pages render**

Visit http://localhost:4321/work/ and http://localhost:4321/work/ml-eval/. Check: project cards display on index, project content renders on detail page.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/work/
git commit -m "feat: add work pages and ProjectCard component"
```

---

## Task 18: Update RSS feed

**Files:**
- Modify: `src/pages/rss.xml.js`

The existing RSS feed uses `pagesGlobToRssItems` which scans `pages/**/*.md`. Blog posts now live in a content collection, so this must be updated.

- [ ] **Step 1: Overwrite src/pages/rss.xml.js**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'Ryley Higa | Blog',
    description: 'Writing about ML, web dev, and learning in public.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
```

- [ ] **Step 2: Verify RSS builds**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with no errors. Check that `dist/rss.xml` is present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.js
git commit -m "feat: update RSS feed to use blog content collection"
```

---

## Task 19: Delete old files

**Files:**
- Delete: `src/styles/global.css`
- Delete: `src/layouts/MarkdownPostLayout.astro`
- Delete: `src/layouts/Layout.astro`
- Delete: `src/components/Header.astro`
- Delete: `src/components/Navigation.astro`
- Delete: `src/components/Menu.astro`
- Delete: `src/components/Social.astro`
- Delete: `src/components/ThemeIcon.astro`
- Delete: `src/components/Welcome.astro`
- Delete: `src/pages/posts/` (entire directory)
- Delete: `src/scripts/menu.js`

- [ ] **Step 1: Delete old files**

```bash
rm src/styles/global.css
rm src/layouts/MarkdownPostLayout.astro
rm src/layouts/Layout.astro
rm src/components/Header.astro
rm src/components/Navigation.astro
rm src/components/Menu.astro
rm src/components/Social.astro
rm src/components/ThemeIcon.astro
rm src/components/Welcome.astro
rm src/scripts/menu.js
rm -r src/pages/posts
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with no errors. Fix any "module not found" errors by tracing which file still imports the deleted module.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old components, layouts, styles, and posts"
```

---

## Task 20: Final verification and cleanup

- [ ] **Step 1: Run full type check**

```bash
npx astro check
```

Expected: no errors or warnings.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes, output in `dist/`. Verify these routes exist in `dist/`:
- `index.html`
- `about/index.html`
- `blog/index.html`
- `blog/post-1/index.html`
- `tags/index.html`
- `tags/astro/index.html`
- `resume/index.html`
- `work/index.html`
- `work/ml-eval/index.html`
- `rss.xml`

```bash
find dist -name "index.html" | sort
```

- [ ] **Step 3: Smoke-test with preview**

```bash
npm run preview
```

Visit http://localhost:4321 and click through all nav links. Verify every page loads without a white screen or 404.

- [ ] **Step 4: Add .superpowers/ to .gitignore**

```bash
echo ".superpowers/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm directory"
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete letter theme migration"
```
