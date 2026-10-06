# Verde Origen

The website of Verde Origen, specialty coffee roasters in Bogotá, and the
reference integration for [Eel Zap](https://zap.eel.software): every title,
text, price, photo and link on it comes from Zap, and Zap's editor previews it
live.

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. Spanish first.

## Pages

| Route                   | Content (Zap)                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `/`                     | document `inicio`; `cafes` (destacado), `origenes` grouped by region, `blog` (latest 3) |
| `/cafes`                | document `pagina-cafes`; `cafes` with filters (region, process, notes, price) and sort  |
| `/cafes/[slug]`         | a `cafes` entry, its `origenes` farm, 3 related coffees                                 |
| `/origenes`             | document `pagina-origenes`; `origenes`, `?region=huila` filters                         |
| `/origenes/[slug]`      | an `origenes` entry and the coffees whose `origen` is its slug                          |
| `/blog`                 | document `pagina-blog`; `blog` (featured, then pages of 6), `?categoria=` and `?autor=` |
| `/blog/[slug]`          | a `blog` entry, its `personas` author, its related coffee, 3 more articles              |
| `/nosotros`             | document `nosotros`; `personas` in the team                                             |
| `/contacto`             | document `contacto`; contact details from `configuracion`                               |
| `/preguntas-frecuentes` | document `pagina-preguntas`; `preguntas` grouped by topic                               |
| `/carrito`              | the cart (kept in the browser; orders close on WhatsApp)                                |

Every page renders the header and footer from the document `configuracion`.

## The Zap client

The site uses [`@8ux-co/eelzap`](https://www.npmjs.com/package/@8ux-co/eelzap)
`^0.10.0` and, as a dev dependency,
[`@8ux-co/eelzap-cli`](https://www.npmjs.com/package/@8ux-co/eelzap-cli)
`^0.10.0` (codegen only; it never ships with the site).

What the site uses, and where:

| Feature                                                                            | Where                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Typed reads (`createClient`, items, documents)                                     | `src/lib/zap.ts`, `src/lib/content.ts`                                                     |
| Generated types (`eelzap codegen`, committed)                                      | `src/generated/cms`, `eelzap.config.json`, `pnpm cms:types`                                |
| `fields()` on every rendered field (stega for text, `data-zap` for the rest)       | every page and component; numbered slots with `f.list('nav', 5)`                           |
| Draft-mode route and its exit (`./next`)                                           | `src/app/api/zap-preview/route.ts`, `src/app/api/zap-preview/exit/route.ts`                |
| Drafts read with a validated preview token (`getValidPreviewToken`)                | `src/lib/zap.ts`                                                                           |
| The boot (`<ZapPreview />` from `./next`), Shift Z suggestions                     | `src/app/layout.tsx`                                                                       |
| Live values the site computes (`useZapLiveUpdates`, `./react`)                     | `src/components/cafe-buy-box.tsx`                                                          |
| Webhook revalidation (`verifyWebhookSignature`, `webhookChanges`, `revalidateTag`) | `src/app/api/revalidate/route.ts`, `src/lib/revalidation.ts`                               |
| ISR                                                                                | `export const revalidate = 3600` on every page; fetches tagged per collection and document |
| Media upload and publish (public API)                                              | `scripts/seed.ts`                                                                          |

Published reads go through Next's data cache, tagged `zap:collection:<key>`
and `zap:document:<key>`. The webhook expires the tags of whatever changed:
an entry its collection, a document itself. Media, SEO, collection, schema and
site events expire everything, since they can touch any page, its metadata or
the sitemap. Draft, assignment and comment events are ignored: drafts never
reach the live site. Collections are read whole, one request
each, so a full build makes about a dozen requests: Zap allows a site key 100
a minute, and the client retries a 429 on its own.

### Tagging rule

Text fields need no tag (stega). For the rest, Zap's preview writes a tagged
element's **whole text** as the field's value, so a `data-zap` tag goes on an
element that shows exactly that value: the figure, not the figure and its unit
(`<span data-zap>1.850</span> msnm`), or a price. Images take the tag on the
`<img>`. URL and email fields are the exception: on a link, the preview
updates `href` (or `mailto:`) and keeps the label, so links carry their URL
field's tag.

### Content model

Five collections (`cafes`, `origenes`, `blog`, `personas`, `preguntas`) and
eight documents (`configuracion`, `inicio`, `nosotros`, `contacto`,
`pagina-cafes`, `pagina-origenes`, `pagina-blog`, `pagina-preguntas`), defined
in `scripts/seed/model.ts`. Zap has no relation field: relations are the
target's slug in a TEXT field (`cafes.origen`, `blog.autor`,
`blog.cafe_relacionado`). `next build` fails on a dangling one
(`assertRelations` in `src/lib/content.ts`). Short repeats are numbered slots
(`nav_1…5`, `dato_1…4`, `principio_1…3`).

Zap keeps no focal point per image slot, so the art direction (crop per slot,
desktop and mobile) is a constant in `src/lib/photos.ts`, keyed by file name.
The kraft bags in the product photos are plain; the lot label is printed over
them in CSS.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill it in
pnpm cms:types               # regenerate types after a schema change
pnpm dev                     # http://localhost:5070
pnpm test
pnpm build
```

Node 22, pnpm 9.

## Seeding Zap

`scripts/seed.ts` creates or converges the whole site in Zap through the
**public API**, with the site's secret key: collections, documents, sections,
fields, the 20 photos (uploaded, alt text set, published), every entry and
document value, the site's base URL and «Otros dominios», and each collection's
and document's «Ruta en tu sitio». It is idempotent: re-running publishes only
what changed and never deletes. Requests are paced under Zap's 100 a minute.

```bash
pnpm seed --dry-run        # validate content and relations, write nothing
pnpm seed                  # create or converge everything
pnpm seed --only=schema    # one stage: media, schema, content
pnpm seed --force          # re-save and re-publish every entry
```

The photos are not in the repository. Put the 20 PNGs in `./seed-photos`
(or set `SEED_PHOTOS_DIR`); a photo already in Zap is not uploaded again. The
originals go up as they are (Zap allows 10 MB per image).

The base URL is `SEED_SITE_URL` (default `NEXT_PUBLIC_SITE_URL`), the extra
origins `SEED_PREVIEW_ORIGINS` (comma-separated). The paths are in
`scripts/seed/model.ts`: `cafes` `/cafes/{slug}`, `origenes`
`/origenes/{slug}`, `blog` `/blog/{slug}`, `personas` `/nosotros`, `preguntas`
`/preguntas-frecuentes`; `inicio` and `configuracion` `/`, `nosotros`
`/nosotros`, `contacto` `/contacto`, `pagina-cafes` `/cafes`,
`pagina-origenes` `/origenes`, `pagina-blog` `/blog`, `pagina-preguntas`
`/preguntas-frecuentes`.

One setting stays by hand, once per environment:

- the webhook endpoint (Nest → workspace settings → Webhooks): URL
  `https://<site>/api/revalidate`, narrowed to this site, subscribed to
  `zap.item.*`, `zap.document.*`, `zap.media.*`, `zap.collection.*`,
  `zap.seo.updated`, `zap.schema.field_changed` and `zap.site.updated`. Its
  `whsec_` secret goes in `EELZAP_WEBHOOK_SECRET`.

## Local preview against a local Zap

Set `EELZAP_ORIGIN` to the local Zap (`http://localhost:5047`) and
`NEXT_PUBLIC_SITE_URL` to `http://localhost:5070`, run `pnpm seed --only=schema`
so the Zap site's base URL points here, and `pnpm dev`. The layout passes the
local origin to `<ZapPreview zapOrigin>`: framed by that Zap, the client loads
the overlay from it (same SRI hash) and trusts it; the SDK honours a local
origin only from a local page, so the setting is harmless in production.

`pnpm dev:https` serves https://localhost:5070 with a self-signed certificate
in `certificates/` (gitignored) when you need https locally.

## Environment variables

Names only. Values live in the local env file for development (gitignored)
and in the host's settings for production; `.env.example` lists the names
with a comment each.

| Name                        | Used by             | Required                                             |
| --------------------------- | ------------------- | ---------------------------------------------------- |
| `EELZAP_API_KEY`            | site, seed, codegen | yes: a secret key of the Zap site                    |
| `EELZAP_BASE_URL`           | site, seed, codegen | yes, unless Zap's API is the SDK default             |
| `EELZAP_PATH_PREFIX`        | site, seed          | no                                                   |
| `EELZAP_ORIGIN`             | site                | no: only when Zap's editor is not the production one |
| `EELZAP_SITE_KEY`           | site                | yes                                                  |
| `EELZAP_SITE_ID`            | site                | yes: turns on Shift Z suggestions                    |
| `EELZAP_WEBHOOK_SECRET`     | site                | yes: the webhook endpoint's signing secret           |
| `NEXT_PUBLIC_SITE_URL`      | site, seed          | yes: the site's public origin                        |
| `EELZAP_REVALIDATE_SECONDS` | site                | no (default 3600)                                    |
| `EELZAP_MEDIA_HOSTS`        | site (build)        | no: only for a custom media domain                   |
| `EELZAP_DEV_AUTH_ORIGIN`    | site                | development only                                     |
| `SEED_PHOTOS_DIR`           | seed                | no (default `./seed-photos`)                         |
| `SEED_SITE_URL`             | seed                | no (default `NEXT_PUBLIC_SITE_URL`)                  |
| `SEED_PREVIEW_ORIGINS`      | seed                | no                                                   |

## Deploying (Vercel)

1. Create the project from this repository: framework Next.js, install
   command `pnpm install`, build command `pnpm build`, Node 22.
2. Set the production environment variables from the table above. Leave out
   `EELZAP_DEV_AUTH_ORIGIN`, and `EELZAP_ORIGIN` unless Zap's editor is not the
   production one.
3. Seed production Zap (below), then create the webhook endpoint in Nest
   pointing at `/api/revalidate` on the production domain, and set its secret
   as `EELZAP_WEBHOOK_SECRET`.
4. Deploy, then point the domain at the deployment. `next build` reads Zap
   (about a dozen requests) and fails on a dangling relation.

### Seeding production

Run the seed from a machine that has the 20 photos, with the production
values exported in the shell rather than written to the local env file (shell
variables win over it): `EELZAP_API_KEY`, `EELZAP_BASE_URL`, `SEED_SITE_URL`
and `SEED_PHOTOS_DIR`. Then:

```bash
pnpm seed --dry-run   # validates content and relations, writes nothing
pnpm seed             # model, photos, content, base URL, «Ruta en tu sitio»
pnpm seed             # again: should report nothing to change
```

The seed never deletes, and leaves alone anything created in Zap by hand.

## Known gaps

- «Ruta en tu sitio» is not on the API's read answers, so the seed sends it on
  every run (a write that changes nothing).
- Legal pages (`/terminos-y-condiciones`, `/tratamiento-de-datos`,
  `/envios-y-devoluciones`) are linked from `configuracion` but are not part
  of these boards; they answer 404 until they exist.
- The contact form and the newsletter validate and acknowledge; delivery
  (Wrap, a mailing list) plugs into `src/app/api/contacto` and
  `src/app/api/boletin`.

## License

MIT. See [LICENSE](./LICENSE).
