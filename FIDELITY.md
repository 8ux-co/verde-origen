# Fidelity review: site vs design boards

Reviewed build: `62fecdf`. Every route was captured at board width (desktop
1440, mobile 390) and compared segment by segment with the 17 boards.

**Verdict: not ready.** 15 must-fix, 16 nice-to-have. Tokens, type roles,
section order, photo crops and focal points all match. Nosotros, Orígenes and
the FAQ are near-exact.

Accepted deviations, not flagged:

- `origenes.foto_region` for the Inicio region cards.
- The wordmark set as text, with the SVG used as the favicon.
- The «Próxima cosecha» card reusing the newsletter copy.
- Legal links that 404.
- The variable Big Shoulders pinned to the display cut. Its side effects are
  items 3 and 15.

## Blocking, outside the site: prices render «$ NaN»

Prices were correct at first capture. About 20 minutes later every price on
`/`, `/cafes` and `/cafes/[slug]` rendered `$ NaN`, and the price-filter
counts dropped to 0. The site code did not change.

**Cause:** the delivery API now sends money as `{ amountMinor, currency }`,
while `src/lib/format.ts` and the 0.10.0 client types read `amount`.

**Fixes:**

- The real fix is on the Zap side. Either keep `amount` for 0.10.0 clients, or
  ship a client release with `amountMinor` and bump the site.
- **Stopgap:** in `pesos()` and `formatMoney()`, read
  `'amountMinor' in v ? v.amountMinor : v.amount`, and widen `MoneyLike`.

## Must-fix

### Global

1. **The WhatsApp float covers «Envíos y devoluciones» at the end of every
   desktop page.** In `src/components/whatsapp-float.tsx`, hide the button
   while the `<footer>` is in view: use an IntersectionObserver to set
   `opacity-0 pointer-events-none`.
2. **The mobile footer is one long column, about 250px too tall.** The board
   has the brand, then **Explora | Síguenos** in two columns, then «Taller y
   tienda» at full width. Changes in `src/components/site-footer.tsx`:
   - Grid: `grid grid-cols-2 gap-x-5 gap-y-9 md:gap-12 lg:grid-cols-[1.6fr_1fr_1.3fr_0.8fr]`.
   - Brand block: `col-span-2 md:col-span-1`.
   - «Taller y tienda»: `col-span-2 order-last md:order-none md:col-span-1`.
   - The prices note under the copyright shows from `lg:` only.
3. **The mobile announcement bar wraps to two lines; the board has one (34px).**
   The variable font sets about 7% wider at small sizes. On the aviso in
   `src/components/site-header.tsx`, add `max-lg:tracking-[0.08em]`.

### Inicio (mobile)

4. **«Ver los seis cafés» should be full width.** Set it to
   `className="btn w-full lg:w-auto"`.
5. **The «Ir al diario» full-width button is missing after the two posts.** In
   `src/app/page.tsx`, add
   `<div className="mt-8 lg:hidden"><Link href="/blog" className="btn w-full">Ir al diario</Link></div>`.

### Cafés

6. **The Mañanera eyebrow wraps to two lines and pushes its card out of line
   with its row.** The board reads «LOTE 21 · HUILA Y TOLIMA, PITALITO Y
   PLANADAS».
   - In `regionLabel()`, map `varias` to the regions actually named, not
     «Varias regiones».
   - Add `whitespace-nowrap overflow-hidden text-ellipsis` to the eyebrow as a
     guard.
7. **The mobile help band's «Escríbenos» button should be full width.** In
   `src/app/cafes/page.tsx`, use `btn btn--dark w-full lg:w-auto`.

### Café detail

8. **Grind options should be square toggles, not pills.** The board spec is
   42px tall, 14px side padding, 2px radius. When selected: 2px Tinta border on
   Papel. Otherwise: 1.5px Línea border. In `src/components/cafe-buy-box.tsx`,
   change `h-10 rounded-full` to `h-[42px] rounded-[2px]`.
9. **Inline links are not underlined.** Tailwind preflight removes the
   underline. This affects «Finca La Esperanza» in the ficha and the
   data-policy link in the Contacto consent. Add
   `underline underline-offset-[3px]` in both places:
   `src/app/cafes/[slug]/page.tsx` and `src/components/contact-form.tsx`.
10. **The mobile H1 is 64px; the board has 72px on two lines.** In
    `globals.css`:
    `--fl-cafe: clamp(72px, calc(72px + 32 * ((100vw - 390px) / 1050)), 104px);`
11. **Mobile «También te puede gustar»:**
    - The heading wraps to two lines. Add
      `max-lg:text-[36px] max-lg:tracking-[-0.01em]`.
    - The board shows two cards and the site shows three. Hide the third
      below `lg`, using the same pattern as the Inicio diario.

### Diario

12. **The disabled «Anteriores» button is faded instead of the system's solid
    disabled state.** In `globals.css`:
    `.btn[disabled] { background: var(--color-linea); border-color: var(--color-linea); color: var(--color-tinta-2); opacity: 1; cursor: not-allowed; }`
13. **Article lists have no bullets.** In `globals.css`:
    `.prose--article ul { list-style: disc } .prose--article ol { list-style: decimal }`.
    Apply the same to `.prose--answer`.
14. **The related-coffee box button should be Cereza.** In
    `src/app/blog/[slug]/page.tsx`, change it to `btn btn--sm btn--buy`.
15. **Mobile «Sigue leyendo» shows three cards; the board has two.** Hide the
    third below `lg`.

## Nice-to-have

16. **Footer link rhythm is 39px; the board's is 35px.** On both footer lists,
    use `text-[17px] leading-[1.35]`.
17. **An extra hairline sits between the stats and «Cafés destacados» on
    desktop.** Add `lg:border-t-0`.
18. **The Los Andes card crop reads as a canyon.** The spec says cherries in
    the foreground. Try `80% 75%`.
19. **Mobile copy is shorter on the boards** (hero eyebrow, stats, Orígenes
    intro). This is a content question. Either accept the site's copy or add
    optional mobile fields; don't fix it in CSS.
20. **The mobile filter button uses a three-line icon; the board uses a
    sliders icon.** Swap it in `cafes-browser.tsx`.
21. **Buy box details:**
    - The selected size card is missing its ✓.
    - The shipping note uses a truck icon; the board uses a box.
    - On mobile, drop «envío gratis desde…» from the note.
22. **Related coffees use a different set from the board:** same region _or_
    process, in order. Decide on a rule, e.g. region first, then `orden`.
23. **The mobile origin band eyebrow says «El origen de este café»; the board
    says «El origen».**
24. **The drawn maps have contours only.** The boards add a river or road
    line, and label the frame with its ratio («MAPA · 4:3»). Add a `river`
    path to `contour-map.tsx`.
25. **Article breadcrumb:** end at the category, «DIARIO / PROCESO», instead
    of a truncated title.
26. **«Sigue leyendo» picks different posts from the board.** This is a rule
    decision, same as item 22.
27. **Contacto adds «Abrir en Google Maps».** Keep it; it is useful. The board
    will add it.
28. **The mobile café detail keeps «Cómo lo preparamos».** The board omits it.
    Keep it on the site; the board will be updated.
29. **Image hints:** fix `sizes` on the gallery images, which are not 100vw,
    and set `priority` on the Diario featured image (the LCP image).
30. **The board's mobile article body is abridged.** The full body on the site
    is correct.
31. **Shift Z:** the boot passes `siteId`, so suggestions are wired. Confirm
    the env value is set in production.

No console errors and no 4xx or 5xx responses on the 11 routes, apart from
the accepted legal-link 404s.
