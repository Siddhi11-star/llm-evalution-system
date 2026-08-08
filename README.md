# JudgeLens — LLM Evaluation Suite

AI-powered platform for objective, multi-agent scoring of LLM outputs.

## Project Structure

```
frontend/
  public/assets/      ← Screen preview images (design reference)
  src/
    pages/            ← One HTML file per screen (Stitch exports, reorganised)
    components/       ← Shared HTML partials extracted from pages
backend/              ← Python / FastAPI app (coming soon)
docs/                 ← Design system notes and token references
```

## Pages

| File | Screen |
|------|--------|
| `pages/landing.html` | Marketing / landing page |
| `pages/login.html` | Login / auth |
| `pages/dashboard.html` | Dashboard overview |
| `pages/judge-agents.html` | Judge agents status |
| `pages/advisor-agent.html` | Advisor agent (free plan locked) |
| `pages/evaluation-run-detail.html` | Evaluation run detail |
| `pages/billing.html` | Billing & usage settings |
| `pages/model-providers.html` | Model providers settings |

## Shared Components

| File | Used on |
|------|---------|
| `components/sidebar-nav.html` | All app pages (dashboard → billing) |
| `components/top-nav.html` | Landing page, evaluation-run-detail |
| `components/chatbot-widget.html` | All pages (two variants — see file comments) |
| `components/footer.html` | Landing page only |

## Design System

See `docs/design-system-judgelens.md` and `docs/design-system-auralis.md` for
full color palettes, typography scales, spacing tokens, and component specs.

## Frontend Compilation

The frontend pages use a template-include system so that modifications to shared components (like the sidebar, top navigation, and chatbot widget) update dynamically across all screens.

To compile the `src/` files into final browser-ready static HTML files in the `dist/` directory:

1. Navigate to the `frontend/` directory.
2. Run the build script:
   ```bash
   npm run build:html
   ```
3. Open any compiled page from the `frontend/dist/` directory in your browser.

