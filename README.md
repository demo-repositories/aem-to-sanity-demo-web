# aem-to-sanity-demo-web

Demo frontends for content migrated by [**aem-to-sanity**](https://github.com/demo-repositories/aem-to-sanity) — the AEM → Sanity content migration toolkit.

This repo is **downstream of the migration**: it consumes pages, blocks, and assets that the migration pipeline has already written into a Sanity dataset. The migration toolkit itself (schema generator, content CLIs, Sanity Studio) lives in the source repo.

---

## What's here

| App | Stack | Purpose |
|---|---|---|
| [`apps/web`](apps/web/README.md) | Vite + React 19 | Lightweight preview that reads the migrated home doc from Sanity and renders its `pageBuilder` through block primitives. Styled per [`docs/DESIGN.md`](docs/DESIGN.md). |
| [`apps/storefront`](apps/storefront/README.md) | Hydrogen (Shopify + Remix) | Skeleton for the eventual commerce storefront — same block renderers, swappable data shell. |

Both apps share the React 19 / `@portabletext/react` / `@sanity/client` stack and render the same migrated content; `apps/web` is the iteration surface, `apps/storefront` is the production target.

---

## Quickstart

```bash
# 0. Install (pnpm ≥ 10, Node ≥ 20)
pnpm install

# 1. Configure Sanity credentials
cp apps/web/.env.example apps/web/.env
$EDITOR apps/web/.env            # set SANITY_PROJECT_ID + SANITY_DATASET

# 2. Run the preview
pnpm dev                          # → http://localhost:4321
# or
pnpm dev:storefront               # Hydrogen storefront
```

Use the same Sanity project that [`aem-to-sanity`](https://github.com/demo-repositories/aem-to-sanity) writes to — once a migration run completes, the home doc renders in this preview.

---

## Repo layout

```
aem-to-sanity-demo-web/
├── apps/
│   ├── web/          Vite + React 19 preview
│   └── storefront/   Hydrogen (Shopify + Remix) skeleton
├── docs/
│   └── DESIGN.md     Design system ("Ethereal Atelier")
├── package.json      pnpm workspace root (React 19 overrides pinned here)
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── LICENSE
```

---

## Relationship to `aem-to-sanity`

The source repo defines the schemas this preview consumes — when its schema emitter (`migrate:schema`) gains a new block type, the preview needs a matching block primitive in [`apps/web/src/blocks/`](apps/web/src/blocks/) (and eventually `apps/storefront/app/blocks/`). The dispatcher in `apps/web/src/blocks/index.tsx` falls through to an `UnknownBlock` placeholder so missing primitives surface as visible gaps instead of blank space.

Workflow:

1. Migration runs in [`aem-to-sanity`](https://github.com/demo-repositories/aem-to-sanity) → writes docs to Sanity.
2. This repo renders those docs in `apps/web` for visual verification.
3. New block primitives added here as new schemas land.

---

## License

[MIT](LICENSE) © 2026 Sanity.io
