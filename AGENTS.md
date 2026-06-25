# AGENTS.md

Instructions for AI agents working on this Zine SSG codebase.

## Project Overview

Personal static blog/portfolio site for Toufiq Shishir, built with [Zine](https://zine-ssg.io) (a Zig-based SSG) and deployed to GitHub Pages.

- **Live site:** https://toufiqshishir.me
- **Deploy branch:** `remaster`
- **Zine version:** v0.11.2

## Build & Development Commands

```bash
# Development server (http://localhost:1990) with live reload
zine

# Production build (outputs to public/)
zine release

# Clean build (Zine does NOT clear public/ before building)
rm -rf public && zine release
```

There is no test suite. Build validation happens at build time — Zine will error on malformed templates, missing frontmatter, or invalid references.

## Directory Structure

```
├── zine.ziggy              # Site configuration (Ziggy format)
├── .gitignore              # Ignores public/
├── content/                # SuperMD content (.smd)
│   ├── index.smd           # Homepage (articles listing)
│   ├── about/
│   │   └── index.smd       # About page
│   ├── posts/
│   │   ├── index.smd       # Posts section
│   │   └── <slug>/
│   │       └── index.smd   # Individual blog post
│   └── devlog/
│       ├── index.smd       # Devlog section
│       └── <slug>/         # Devlog entries (subdirectory or flat .smd)
├── layouts/                # SuperHTML templates (.shtml)
│   ├── templates/
│   │   └── base.shtml      # Base layout (navbar, head, scripts, footer)
│   ├── index.shtml         # About/profile page layout
│   ├── post.shtml          # Single blog post layout
│   ├── posts.shtml         # Posts section index (empty main)
│   ├── page.shtml          # Generic page layout (used by devlog entries)
│   ├── devlog.shtml        # Devlog listing (date + title + content feed)
│   ├── articles.shtml      # Homepage/articles listing
│   └── articles.xml        # RSS feed
├── assets/                 # Static assets
│   ├── style.css           # Main stylesheet (Space Grotesk, dark mode)
│   ├── highlight.css       # Syntax highlighting (One Dark theme)
│   ├── Temml-Local.css     # Math rendering CSS
│   ├── Temml.woff2         # Math font
│   ├── temml.min.js        # Math rendering engine
│   ├── render-mathtex.js   # Math rendering script
│   └── events-handler.js   # Keyboard shortcuts
└── .github/workflows/
    └── gh-pages.yml        # CI/CD (GitHub Actions)
```

## File Formats

### Ziggy (`zine.ziggy`)

Configuration format. Zig-like syntax with `.field = value` pairs.

```ziggy
Site {
    .title = "Toufiq Shishir",
    .host_url = "https://toufiqshishir.me",
    .content_dir_path = "content",
    .layouts_dir_path = "layouts",
    .assets_dir_path = "assets",
    .static_assets = ["Temml.woff2"],
}
```

> **Note:** There is no `.description` field on `Site`. Use page-level `.description` in `.smd` frontmatter instead.

### SuperMD (`.smd`)

Content format. Markdown + Scripty expressions. No inline HTML allowed (use ```` ```=html ```` escape hatch).

**Frontmatter** (delimited by `---`):

```ziggy
---
.title = "Page Title",
.description = "Short description",
.author = "Toufiq Shishir",
.date = @date("2024-10-24T00:00:00"),
.tags = ["tag1", "tag2"],
.layout = "post.shtml",
.draft = false,
.aliases = ["/old-url/"],
---
```

**Key frontmatter fields:**
- `.title` — Required. Page title.
- `.layout` — Required. Which layout template to use.
- `.description` — Used in meta tags and RSS.
- `.date` — RFC 3339 format. Used for ordering (newest first).
- `.author` — Required. Author name.
- `.draft` — When true, excluded from `zine release` builds. Preview with `zine` dev server.
- `.aliases` — Redirect from old URLs.

### SuperHTML (`.shtml`)

Template format. HTML + Scripty logic attributes.

**Logic attributes:**
- `:text="$expr"` — Set text content (HTML-escaped)
- `:html="$expr"` — Set raw HTML content
- `:if="$expr"` — Conditional rendering
- `:loop="$page.subpages()"` — Iteration (`$loop.it`, `$loop.idx`, `$loop.first`, `$loop.last`)

**Template extension:**
```html
<extend template="base.shtml">
<head id="head">
  <style>.main-nav a[href="/about/"] { color: var(--accent); }</style>
</head>
<body id="body">
  <main>
    <!-- content goes here, inserted at <super> in base -->
  </main>
</body>
```

**Key variables:**
- `$site` — Site config and assets
- `$page` — Current page being rendered
- `$build` — Build info (date, git metadata)
- `$ctx` — Data from `<ctx>` elements
- `$loop` — Iterator (inside `:loop`)
- `$if` — Unwrapped optional (inside `:if`)

**Key page functions:**
- `$page.title`, `$page.description`, `$page.date`, `$page.author`
- `$page.content()` — Render full page HTML
- `$page.contentSection('id')` — Render specific section
- `$page.subpages()` — Pages in this section
- `$page.nextPage?()`, `$page.prevPage?()` — Navigation
- `$page.link()` — URL of the page
- `$page.asset('name')` — Page-level asset
- `$page.date.format('Jan 02, 2006')` — Format date

**Key site functions:**
- `$site.page('path')` — Find page by path
- `$site.asset('name')` — Site-level asset
- `$site.host_url` — Canonical URL

## Content-to-URL Mapping

| Content File | Generated URL |
|---|---|
| `content/index.smd` | `/` |
| `content/about/index.smd` | `/about/` |
| `content/posts/index.smd` | `/posts/` |
| `content/posts/<slug>/index.smd` | `/posts/<slug>/` |
| `content/devlog/index.smd` | `/devlog/` |
| `content/devlog/<slug>/index.smd` | `/devlog/<slug>/` |
| `content/devlog/<slug>.smd` | `/devlog/<slug>/` |

## Sections

Every `index.smd` defines a section. Sections group pages for listing. A section page is NOT included in its own `subpages()` list.

- **Homepage** (`content/index.smd`): Lists posts from `$site.page('posts').subpages()`
- **Devlog** (`content/devlog/index.smd`): Lists devlog entries from `$site.page('devlog').subpages()`

## Assets

Three types:
- **Site assets:** `$site.asset('foo.png')` — from `assets/` directory
- **Page assets:** `$page.asset('bar.jpg')` — alongside the `.smd` file
- **Build assets:** `$build.asset('data.json')` — generated by Zig build

Calling `.link()` on an asset installs it in the output directory.

## Styling

- **Font:** Space Grotesk (body), JetBrains Mono (code/dates)
- **Theme:** Dark mode only, CSS custom properties
- **Syntax highlighting:** `highlight.css` — One Dark theme, works with Zine's built-in code highlighting
- **Layout:** 48rem max-width, responsive at 640px breakpoint

## Draft System

Use `.draft = true` in frontmatter to hide pages from production builds:

```ziggy
---
.draft = true,   ← excluded from `zine release`
---
```

- `zine` (dev server) shows everything including drafts
- `zine release` excludes all `.draft = true` pages
- Toggle entire sections by setting `.draft = true` on the section's `index.smd`

## CI/CD

GitHub Actions workflow (`.github/workflows/gh-pages.yml`):
- Triggers on push to `remaster` branch
- Uses `kristoff-it/setup-zine@v1` with v0.10.0-preview
- Runs `zine release` → deploys `public/` to GitHub Pages
- Actions pinned to commit SHAs for supply-chain security

## Gotchas

1. **No `zine clean`** — `zine release` does NOT clear `public/` before building. Manually `rm -rf public` for clean builds.
2. **No inline HTML in .smd** — Use ```` ```=html ```` code blocks as an escape hatch.
3. **Spaces in Scripty expressions** break Markdown parsing. Use diamond brackets: `[](<$link.page('foo')>)`.
4. **Layout must be explicit** — Every `.smd` file needs `.layout` in frontmatter. No implicit convention.
5. **Section pages exclude themselves** — `$page.subpages()` does not include the `index.smd` itself.
6. **Assets require `.link()`** — Accessing an asset without `.link()` does NOT install it in output.
7. **No `$site.description`** — The `Site` config has no `.description` field. Page descriptions come from `.smd` frontmatter only.
8. **`author` is required** — All `.smd` files need `.author` in frontmatter or build will fail.

## Editor Setup

Install language servers for real-time diagnostics:
- **VSCode:** SuperMD and SuperHTML extensions by Loris Cro
- **Neovim/Helix/Flow Control:** Dedicated setup guides at zine-ssg.io
