'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BODA } from '@/lib/config'

const EASE = [0.22, 1, 0.36, 1] as const

type Restante = { dias: number; horas: number; minutos: number; segundos: number }

function calcular(target: number): Restante {
  const diff = Math.max(0, target - Date.now())
  return {
    dias: Math.floor(diff / 86400000),
    horas: Math.floor((diff / 3600000) % 24),
    minutos: Math.floor((diff / 60000) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  }
}

function Digito({ valor }: { valor: string }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valor}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute inset-0 block text-center"
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Bloque({ valor, label }: { valor: number; label: string }) {
  // Pad mínimo a 2 dígitos, pero permite 3 (los días pueden ser >99).
  const s = String(valor).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <span className="flex font-serif text-[clamp(2.75rem,16vw,5rem)] font-extralight leading-none text-olive-800">
        {s.split('').map((d, i) => (
          <Digito key={i} valor={d} />
        ))}
      </span>
      <span className="mt-4 font-serif text-[0.62rem] uppercase tracking-[0.2em] text-olive-600 sm:text-[0.7rem]">
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const [mounted, setMounted] = useState(false)
  const target = new Date(BODA.fechaISO).getTime()
  const [r, setR] = useState<Restante>(() => calcular(target))

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setR(calcular(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const llego = r.dias === 0 && r.horas === 0 && r.minutos === 0 && r.segundos === 0

  // Guardia de hidratación: reserva el espacio, evita layout shift.
  if (!mounted) return <div className="h-40" />

  return (
    <section className="section py-16 text-center" id="countdown">
      <p
        className="mb-4 font-sans text-[0.8rem] uppercase tracking-overline text-olive-600"
        data-reveal
      >
        {BODA.fechaDisplay}
      </p>

      <p
        className="font-script text-[clamp(2.1rem,9vw,2.9rem)] leading-none text-olive-700"
        data-reveal
      >
        Faltan
      </p>

      {llego ? (
        <p
          className="mt-6 font-serif text-4xl font-light italic text-olive-700"
          data-reveal
        >
          ¡Hoy nos casamos!
        </p>
      ) : (
        <div
          className="mx-auto mt-5 flex max-w-sm items-start justify-center gap-6 sm:gap-10"
          data-reveal
        >
          <Bloque valor={r.dias} label="Días" />
          <Bloque valor={r.horas} label="Horas" />
          <Bloque valor={r.minutos} label="Minutos" />
        </div>
      )}

      <p
        className="mt-8 font-serif text-[0.8rem] uppercase tracking-[0.22em] text-ink/60"
        data-reveal
      >
        Para nuestro gran día
      </p>
    </section>
  )
}
