'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BODA } from '@/lib/config'
import { supabase, supabaseConfigurado } from '@/lib/supabase'

const EASE = [0.22, 1, 0.36, 1] as const
type Estado = 'idle' | 'enviando' | 'confirmado' | 'error'

/**
 * `conAcompanante` distingue las dos invitaciones que comparten esta tabla:
 * la de pareja (/) pide el nombre del acompañante y guarda 2 lugares; la
 * individual (/individual) es para un solo invitado y guarda 1.
 */
export default function Rsvp({ conAcompanante = true }: { conAcompanante?: boolean }) {
  const [estado, setEstado] = useState<Estado>('idle')
  const [asiste, setAsiste] = useState(true)
  const [nombre, setNombre] = useState('')
  const [acompanante, setAcompanante] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Cupo fijo por invitación: 2 personas (invitado + acompañante) o 1.
  const asistentes: number = conAcompanante ? 2 : 1

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) {
      setErrorMsg('Cuéntanos tu nombre para confirmar.')
      setEstado('error')
      return
    }
    if (conAcompanante && !acompanante.trim()) {
      setErrorMsg('Cuéntanos el nombre de tu acompañante.')
      setEstado('error')
      return
    }
    setEstado('enviando')
    setErrorMsg('')

    const payload = {
      nombre: nombre.trim(),
      acompanante: conAcompanante ? acompanante.trim() : null,
      asiste,
      asistentes: asiste ? asistentes : 0,
      mensaje: mensaje.trim() || null,
      origen: conAcompanante ? 'pareja' : 'solo',
    }

    try {
      if (!supabaseConfigurado || !supabase) {
        // Modo demo: no persiste en ningún lado, solo simula el envío exitoso.
        await new Promise((r) => setTimeout(r, 700))
        setEstado('confirmado')
        return
      }
      const { error } = await supabase.from('confirmaciones').insert(payload)
      if (error) throw error
      setEstado('confirmado')
    } catch (err: any) {
      setErrorMsg(err?.message || 'Algo salió mal. Intenta de nuevo.')
      setEstado('error')
    }
  }

  return (
    <section className="relative overflow-hidden pb-10 pt-14" id="rsvp">
      <div className="section relative">
        <p
          className="mx-auto max-w-sm text-center font-serif text-lg italic text-ink/70"
          data-reveal
        >
          Por favor confirma antes del {BODA.rsvpDeadline}.
        </p>

        {/* Formulario dentro de una tarjeta glassmorphism con sombra 3D
            (perspectiva en el wrapper; el glass + tilt viven en la tarjeta,
            así el data-reveal de GSAP no compite con el backdrop-filter). */}
        <div className="mx-auto mt-10 w-full max-w-md [perspective:1200px]" data-reveal>
          <div
            className="glass rounded-[1.6rem] px-6 py-9 [transform:rotateX(5deg)] sm:px-8"
            style={{
              boxShadow:
                '0 2px 4px rgba(45,45,22,0.06), 0 14px 26px -12px rgba(45,45,22,0.22), 0 44px 70px -30px rgba(45,45,22,0.32)',
            }}
          >
          <h3 className="mb-8 text-center font-serif text-2xl font-light text-olive-800">
            Confirmación de asistencia
          </h3>
          <AnimatePresence mode="wait">
              {estado === 'confirmado' ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                  className="py-2 text-center"
                >
                  <div className="rule-diamond mb-6" />
                  <p className="font-serif text-3xl font-light text-olive-800">
                    {asiste ? '¡Gracias, ' : 'Te vamos a extrañar, '}
                    {nombre.split(' ')[0]}!
                  </p>
                  <p className="mt-4 font-serif text-lg italic text-ink/70">
                    {asiste
                      ? `Nos vemos el ${BODA.diaCorto}. Guardamos ${asistentes} ${
                          asistentes === 1 ? 'lugar' : 'lugares'
                        } para ti.`
                      : 'Gracias por avisarnos. Te tendremos presente ese día.'}
                  </p>
                  <div className="rule-diamond mt-8" />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={enviar}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col gap-7 text-left"
                >
                {/* Nombre */}
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[0.65rem] uppercase tracking-overline text-olive-600">
                    Nombre
                  </span>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="border-b border-olive-300 bg-transparent pb-2 font-serif text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-olive-700"
                  />
                </label>

                {/* Nombre del acompañante — solo en la invitación de pareja */}
                {conAcompanante && (
                  <label className="flex flex-col gap-2">
                    <span className="font-sans text-[0.65rem] uppercase tracking-overline text-olive-600">
                      Nombre del acompañante
                    </span>
                    <input
                      type="text"
                      value={acompanante}
                      onChange={(e) => setAcompanante(e.target.value)}
                      placeholder="Nombre de tu acompañante"
                      className="border-b border-olive-300 bg-transparent pb-2 font-serif text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-olive-700"
                    />
                  </label>
                )}

                {/* Asiste / No asiste */}
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[0.65rem] uppercase tracking-overline text-olive-600">
                    ¿Nos acompañas?
                  </span>
                  <div className="flex gap-3">
                    {[
                      { v: true, l: 'Sí, ahí estaré' },
                      { v: false, l: 'No podré' },
                    ].map((o) => (
                      <button
                        key={String(o.v)}
                        type="button"
                        onClick={() => setAsiste(o.v)}
                        className={`flex-1 border px-4 py-3 font-sans text-xs uppercase tracking-overline transition-colors duration-300 ${
                          asiste === o.v
                            ? 'border-olive-700 bg-olive-700 text-cream'
                            : 'border-olive-300 text-olive-700 hover:border-olive-500'
                        }`}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mensaje */}
                <label className="flex flex-col gap-2">
                  <span className="font-sans text-[0.65rem] uppercase tracking-overline text-olive-600">
                    Un mensaje para los novios (opcional)
                  </span>
                  <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    rows={3}
                    placeholder="Escríbenos algo bonito…"
                    className="resize-none border-b border-olive-300 bg-transparent pb-2 font-serif text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-olive-700"
                  />
                </label>

                {estado === 'error' && (
                  <p className="font-sans text-sm text-red-800/80">{errorMsg}</p>
                )}

                {/* Botón: el ancho se anima solo con layout */}
                <motion.button
                  layout
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="mt-2 self-center border border-olive-700 bg-olive-700 px-10 py-4 font-sans text-xs uppercase tracking-overline text-cream transition-colors duration-300 hover:bg-olive-800 disabled:opacity-70"
                >
                  {estado === 'enviando' ? 'Enviando…' : 'Confirmar asistencia'}
                </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
