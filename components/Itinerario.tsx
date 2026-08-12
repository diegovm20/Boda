'use client'

import { BODA } from '@/lib/config'

// Íconos de línea fina (strokeWidth 1). Sin rellenos.
function IconoAnillo() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1}>
      <circle cx="24" cy="30" r="12" />
      <path d="M18 20l6-8 6 8" />
      <path d="M24 12l-3 4h6l-3-4z" />
    </svg>
  )
}

function IconoCopas() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1}>
      <path d="M14 10h8l-1 10a3 3 0 01-6 0l-1-10z" />
      <path d="M18 23v13M14 36h8" />
      <path d="M26 10h8l-1 10a3 3 0 01-6 0l-1-10z" />
      <path d="M30 23v13M26 36h8" />
    </svg>
  )
}

const ICONOS = [IconoAnillo, IconoCopas]

export default function Itinerario() {
  const { lat, lng, mapsUrl } = BODA.ubicacion
  // URL del botón "Ubicación": campo de config, con respaldo a coordenadas.
  const href = mapsUrl || `https://maps.google.com/?q=${lat},${lng}`

  return (
    <section
      className="relative overflow-hidden py-16 text-center"
      id="itinerario"
      data-section="eventos"
    >
      <div className="section relative">
        {/* Encabezado único: iniciales en Pinyon Script, resto en Cormorant */}
        <h2
          className="font-serif text-[clamp(1.9rem,7vw,3.25rem)] font-light leading-[1.1] text-olive-800"
          data-reveal
        >
          <span className="font-script align-baseline text-[1.35em] leading-[0] text-olive-700">
            C
          </span>
          eremonia
          <span className="mx-1 font-serif italic text-olive-500"> y </span>
          <span className="font-script align-baseline text-[1.35em] leading-[0] text-olive-700">
            R
          </span>
          ecepción
        </h2>

        <div className="divider my-10" data-reveal />

        {/* Panel de vidrio con los dos eventos agrupados */}
        <div
          className="glass relative mx-auto overflow-hidden rounded-[1.75rem] px-6 py-10 sm:px-10"
          data-reveal
        >
          {/* Highlight sutil superior (sensación de vidrio) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[1.75rem] bg-gradient-to-b from-white/40 to-transparent"
          />

          <div className="relative flex flex-col divide-y divide-olive-400/25 sm:flex-row sm:divide-x sm:divide-y-0">
            {BODA.eventos.map((ev, i) => {
              const Icono = ICONOS[i % ICONOS.length]
              return (
                <div
                  key={ev.nombre}
                  className="flex flex-1 flex-col items-center px-2 py-8 first:pt-0 last:pb-0 sm:px-6 sm:py-0"
                >
                  <span className="text-olive-700">
                    <Icono />
                  </span>
                  <h3 className="mt-4 font-sans text-[0.7rem] uppercase tracking-overline text-olive-700">
                    {ev.nombre}
                  </h3>
                  <p className="mt-3 font-sans text-xs uppercase tracking-[0.15em] text-olive-600">
                    {ev.hora}
                  </p>
                  <p className="mt-3 font-serif text-xl leading-snug text-ink">
                    {ev.lugar}
                  </p>
                  {ev.direccion ? (
                    <p className="mt-1 font-serif text-base italic text-olive-700">
                      {ev.direccion}
                    </p>
                  ) : null}
                  {ev.nota && (
                    <p className="mt-3 font-sans text-xs leading-relaxed text-ink/70">
                      {ev.nota}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Botón "Ubicación" → Google Maps */}
          <div className="relative mt-10 flex justify-center">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-olive-700 px-8 py-3 font-sans text-[0.7rem] uppercase tracking-overline text-cream shadow-sm transition-colors duration-300 hover:bg-olive-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                aria-hidden
              >
                <path d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Ubicación
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
