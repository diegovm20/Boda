import Invitacion from '@/components/Invitacion'

// Invitación individual: el RSVP es solo para el invitado y guarda 1 lugar.
export default function PageIndividual() {
  return <Invitacion conAcompanante={false} />
}
