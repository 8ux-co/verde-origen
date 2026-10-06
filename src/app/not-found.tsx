import Link from 'next/link'

/**
 * Also the first load of an entry not yet published: the layout still runs
 * Zap's preview client here, so the editor's hello arrives and the frame
 * reloads through the draft-mode route, showing the draft.
 */
export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-6 pt-14 pb-24 lg:pt-24 lg:pb-32">
      <span className="eyebrow">Error 404</span>
      <h1 className="h1">Este lote no está en la bodega</h1>
      <p className="lead max-w-[560px]">La página que buscas no existe o cambió de dirección.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/cafes" className="btn btn--buy">
          Ver los cafés
        </Link>
        <Link href="/" className="btn">
          Ir al inicio
        </Link>
      </div>
    </section>
  )
}
