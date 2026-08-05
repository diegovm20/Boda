'use client'

import { useScrollFx } from '@/components/useScrollFx'
import Hero from '@/components/Hero'
import Countdown from '@/components/Countdown'
import Itinerario from '@/components/Itinerario'
import DressCode from '@/components/DressCode'
import Rsvp from '@/components/Rsvp'
import Regalos from '@/components/Regalos'
import Footer from '@/components/Footer'

/**
 * La invitación completa. Las dos rutas (/ y /individual) renderizan esto
 * mismo; lo único que cambia es si el RSVP pide acompañante.
 */
export default function Invitacion({ conAcompanante = true }: { conAcompanante?: boolean }) {
  const root = useScrollFx()

  return (
    <main ref={root as React.RefObject<HTMLElement>} className="overflow-hidden">
      <Hero />
      <Countdown />
      <Itinerario />
      <DressCode />
      <Rsvp conAcompanante={conAcompanante} />
      <Regalos />
      <Footer />
    </main>
  )
}
