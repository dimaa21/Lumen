# Lumen

Lumen is a marketing site for an AI assistant that joins online meetings. It connects to Zoom, Google Meet, and Microsoft Teams, transcribes the conversation, writes a short summary, and sends tasks with owners and deadlines to Slack, Notion, Jira, or Linear.

The page is a single dark landing page in Ukrainian. The visual language is a deep graphite background (`#07080c`) with a warm amber accent (`#ffb547`). Motion is handled with GSAP and Lenis, and it steps aside when the visitor prefers reduced motion.

## Stack

- [Vite](https://vite.dev/) with vanilla JavaScript (ES modules)
- [Tailwind CSS](https://tailwindcss.com/) v4, configured in CSS
- [GSAP](https://gsap.com/) and ScrollTrigger
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- Self-hosted variable fonts: Inter Tight and JetBrains Mono (`font-display: swap`, Cyrillic and Latin subsets)

There is no framework and no jQuery.

## Requirements

- Node.js 20 or newer
- npm

## Scripts

```bash
npm install
npm run dev
```

The dev server prints a local URL, usually `http://127.0.0.1:5173/`.

```bash
npm run build
npm run preview
```

`build` writes a static site to `dist/`. `preview` serves that folder so you can check the production bundle.

## Project structure

```
index.html          page markup, meta tags, Open Graph, JSON-LD
src/main.js         boots styles, fonts, and animations
src/animations.js   scroll, motion, menu, pricing, FAQ, dialog
src/styles.css      Tailwind theme, layout, and component styles
assets/             static files served from the site root
  favicon.svg
  og.svg
  noise.png
  site.webmanifest
vite.config.js      Tailwind plugin; assets/ is the public directory
```

Files in `assets/` are copied to the root of `dist/`, so `/favicon.svg` and `/og.svg` resolve without an `assets` prefix.

## Page

1. Sticky glass header. It hides while scrolling down and returns when scrolling up. On small screens the nav becomes a full-screen menu.
2. Hero with a word-by-word title and a product mock: a call, a transcript that types itself, and tasks that appear underneath. On desktop the mock starts tilted and flattens as you scroll.
3. Infinite marquee of integrations. It pauses on hover.
4. Bento grid. Each card has a small live UI: a waveform, speaker-colored transcript, a summary that collapses into three points, tasks moving toward Slack, search across meetings, and a private-meeting rule. A border highlight follows the pointer.
5. “How it works” in three steps. On a tall desktop the section pins and the visual on the right crossfades with the scroll.
6. Counters that run up from zero when they enter the viewport.
7. Horizontal testimonial rail. Cards can be dragged with a mouse or swiped, and moved with the arrow buttons. The quotes are labeled as layout placeholders.
8. Three prices with a month/year switch. The recommended plan has a gradient border.
9. Security notes: encryption, workspace isolation, deletion, and no training on customer conversations.
10. FAQ accordion.
11. Closing call to action.
12. Footer with link columns and a full-width Lumen wordmark.

“Try for free” opens a dialog. A valid work email is stored in `localStorage` under `lumen-pilot`. Nothing is sent to a server.

## Motion and input

Animations use `transform` and `opacity`, with the easing `cubic-bezier(0.22, 1, 0.36, 1)`. The FAQ is the exception: its height opens through `grid-template-rows`.

On a fine pointer and a viewport of at least 1024px:

- a small cursor ring scales up over links and buttons
- primary buttons ease toward the pointer
- bento cards light a border under the cursor
- the hero glow follows the mouse
- the product mock uses a 3D tilt

Those effects are off on touch and on narrow screens. `prefers-reduced-motion: reduce` disables smooth scroll, reveals, the marquee, the waveform, and the typing demo, and shows the finished states instead.

## Accessibility and SEO

- `lang="uk"` on the document
- one `h1`, labeled sections, and a skip link
- visible `:focus-visible` outlines
- dialog, accordion, and billing toggle expose state to assistive tech
- title, description, Open Graph, Twitter card, favicon, web manifest, and `SoftwareApplication` JSON-LD

Body text is warm off-white on graphite. Amber is used for labels, the primary button (with dark text), and small accents.

## Theme tokens

Colors, fonts, and the easing curve live in the Tailwind v4 `@theme` block in `src/styles.css`:

| Token | Value |
| --- | --- |
| `--color-ink` | `#07080c` |
| `--color-raise` | `#10131a` |
| `--color-amber` | `#ffb547` |
| `--color-foam` | `#f3f0e8` |
| `--color-mist` | `#a39e94` |
| `--font-sans` | Inter Tight Variable |
| `--font-mono` | JetBrains Mono Variable |

Layout width and page gutters are `--wrap` and `--gutter` on `:root`.
