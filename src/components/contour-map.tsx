/**
 * The drawn contour map the boards use where no map image is set in Zap
 * (`pagina-origenes.mapa`, `origenes.mapa_imagen`, `contacto.mapa_imagen`):
 * concentric relief lines around a few summits, and labelled pins.
 * Deterministic, so server and client render the same SVG.
 */

export interface MapPin {
  label: string
  /** Percent of width and height. */
  x: number
  y: number
}

interface ContourMapProps {
  pins: MapPin[]
  seed?: number
  summits?: Array<{ x: number; y: number; scale: number }>
}

function random(seed: number) {
  let state = seed % 2147483647 || 1
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function ring(cx: number, cy: number, radius: number, waves: number[][], points = 72): string {
  const coords: string[] = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2
    const wobble = waves.reduce((sum, [k, amp, phase]) => sum + amp! * Math.sin(k! * t + phase!), 0)
    const r = radius * (1 + wobble)
    coords.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * 0.82 * Math.sin(t)).toFixed(1)}`)
  }
  return `M${coords.join(' L')}Z`
}

export function ContourMap({
  pins,
  seed = 7,
  summits = [
    { x: 300, y: 290, scale: 1 },
    { x: 560, y: 210, scale: 0.8 },
    { x: 470, y: 470, scale: 0.7 },
  ],
}: ContourMapProps) {
  const rand = random(seed)
  const paths: Array<{ d: string; opacity: number }> = []
  for (const summit of summits) {
    const waves = [2, 3, 5].map((k) => [k, 0.05 + rand() * 0.08, rand() * Math.PI * 2])
    for (let i = 1; i <= 9; i++) {
      paths.push({
        d: ring(summit.x, summit.y, i * 26 * summit.scale, waves),
        opacity: 0.1 + i * 0.012,
      })
    }
  }
  return (
    <>
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        {paths.map((path, i) => (
          <path
            key={i}
            d={path.d}
            fill="none"
            stroke="#1E3B2D"
            strokeOpacity={path.opacity}
            strokeWidth={1.2}
          />
        ))}
      </svg>
      {pins.map((pin) => (
        <span key={pin.label} aria-hidden="true">
          <span
            className="absolute h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-niebla bg-cereza"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          />
          <span
            className="absolute whitespace-nowrap bg-tinta px-2 py-1 font-display text-[12px] leading-none font-bold tracking-[0.12em] text-niebla uppercase"
            style={{ left: `calc(${pin.x}% + 14px)`, top: `calc(${pin.y}% - 11px)` }}
          >
            {pin.label}
          </span>
        </span>
      ))}
    </>
  )
}
