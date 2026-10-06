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

The site uses `@8ux-co/eelzap` 0.10.0 and, as a dev dependency,
`@8ux-co/eelzap-cli`. Until they are on npm they are vendored as tarballs in
`vendor/` (packed from the Zap repository) and installed as `file:`
dependencies. **When 0.10.0 is published, switch both to `^0.10.0` from npm,
remove the `pnpm.overrides` entry and delete `vendor/`.**

What the site uses, and where:

| Feature                                                                            | Where                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Typed reads (`createClient`, items, documents)                                     | `src/lib/zap.ts`, `src/lib/content.ts`                                                     |
| Generated types (`eelzap codegen`, committed)                                      | `src/generated/cms`, `eelzap.config.json`, `pnpm cms:types`                                |
| `fields()` on every rendered field (stega for text, `data-zap` for the rest)       | every page and component; numbered slots in `src/lib/fields-extra.ts`                      |
| Draft-mode route and its exit (`./next`)                                           | `src/app/api/zap-preview/route.ts`, `src/app/api/zap-preview/exit/route.ts`                |
| Drafts read with a validated preview token (`getValidPreviewToken`)                | `src/lib/zap.ts`                                                                           |
| The boot (`<ZapPreview />` from `./next`), Shift Z suggestions                     | `src/app/layout.tsx`                                                                       |
| Live values the site computes (`useZapLiveUpdates`, `./react`)                     | `src/components/cafe-buy-box.tsx`                                                          |
| Webhook revalidation (`verifyWebhookSignature`, `webhookChanges`, `revalidateTag`) | `src/app/api/revalidate/route.ts`, `src/lib/revalidation.ts`                               |
| ISR                                                                                | `export const revalidate = 3600` on every page; fetches tagged per collection and document |
| Media upload and publish (public API)                                              | `scripts/seed.ts`                                                                          |

Published reads go through Next's data cache, tagged `zap:collection:<key>`
and `zap:document:<key>`. The webhook expires the tags of whatever changed
(media changes expire everything). Collections are read whole, one request
each, so a full build makes about a dozen requests: Zap allows a site key 100
a minute, and `src/lib/zap-fetch.ts` waits out a 429 if it ever happens.

### Tagging rule

Zap's preview writes a tagged element's **whole text** as the field's value.
So a `data-zap` tag goes on an element that shows exactly that value: the
figure, not the figure and its unit (`<span data-zap>1.850</span> msnm`); an
image; a price. Text fields need no tag (stega). Links whose text is not the
URL are left untagged, because the preview would replace their label with the
URL (see "Known gaps").

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
fields, the 20 photos (uploaded, alt text set, published), and every entry and
document value. It is idempotent: re-running publishes only what changed and
never deletes.

```bash
pnpm seed --dry-run        # validate content and relations, write nothing
pnpm seed                  # create or converge everything
pnpm seed --only=schema    # one stage: media, schema, content
pnpm seed --force          # re-save and re-publish every entry
```

The photos are not in the repository. Put the 20 PNGs in `./seed-photos`
(or set `SEED_PHOTOS_DIR`); a photo already in Zap is not uploaded again.
Zap refuses images over 2 MB, so the seed uploads each PNG at its native size
as a JPEG (quality 88).

Three settings are not on the public API and are set in Zap (site settings),
once per environment:

- the site's base URL (https), and «Otros dominios» for any extra origin;
- «Ruta en tu sitio» of each collection and document (the seed prints them):
  `cafes` `/cafes/{slug}`, `origenes` `/origenes/{slug}`, `blog` `/blog/{slug}`,
  `personas` `/nosotros`, `preguntas` `/preguntas-frecuentes`; `inicio` and
  `configuracion` `/`, `nosotros` `/nosotros`, `contacto` `/contacto`,
  `pagina-cafes` `/cafes`, `pagina-origenes` `/origenes`, `pagina-blog` `/blog`,
  `pagina-preguntas` `/preguntas-frecuentes`;
- the webhook endpoint (Nest → workspace settings → Webhooks): URL
  `https://<site>/api/revalidate`, events `zap.item.*`, `zap.document.*`,
  `zap.media.*`, narrowed to this site; its `whsec_` secret goes in
  `EELZAP_WEBHOOK_SECRET`.

## Local preview against a local Zap

Zap frames a site only at an **https** base URL, so locally the site runs on
https with a self-signed certificate:

```bash
mkdir -p certificates && openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certificates/localhost-key.pem -out certificates/localhost.pem \
  -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
pnpm dev:https             # https://localhost:5070
```

Open https://localhost:5070 once and accept the certificate, set the Zap
site's base URL to `https://localhost:5070`, and set `EELZAP_ORIGIN` to the
local Zap. In development the layout adds `DevPreviewBridge`
(`src/components/dev-preview-bridge.tsx`), which loads the preview client from
the local Zap instead of the production CDN (same file, same SRI hash) and
boots it for an https page framed by a local Zap. Production never renders it.

## Deploying (Vercel)

1. Publish `@8ux-co/eelzap` and `@8ux-co/eelzap-cli` 0.10.0, switch the
   dependencies to npm and remove `vendor/`.
2. Create the project from this repository (framework: Next.js; install
   `pnpm install`; build `pnpm build`).
3. Set the environment variables of `.env.example` (production values; no
   `EELZAP_DEV_AUTH_ORIGIN`, and `EELZAP_ORIGIN` only if Zap is not
   `https://zap.eel.software`).
4. Seed production Zap (`pnpm seed` with the production key and base URL),
   then set the base URL, «Ruta en tu sitio» and the webhook as above.
5. Point `verdeorigen.co` at the deployment.

## Known gaps

- The Zap toolbar, the WhatsApp button and the bottom-centre clear zone:
  before sign-in, Shift Z shows Zap's launcher at the bottom right, over the
  WhatsApp button.
- URL fields cannot be tagged safely (the preview writes the URL as the link's
  text), so editors find them in the form, not by clicking the page.
- Legal pages (`/terminos-y-condiciones`, `/tratamiento-de-datos`,
  `/envios-y-devoluciones`) are linked from `configuracion` but are not part
  of these boards; they answer 404 until they exist.
- The contact form and the newsletter validate and acknowledge; delivery
  (Wrap, a mailing list) plugs into `src/app/api/contacto` and
  `src/app/api/boletin`.

## License

MIT. See [LICENSE](./LICENSE).
