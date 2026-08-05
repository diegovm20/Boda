import { createClient } from '@supabase/supabase-js'

// Cliente de navegador. Usa la anon key — la escritura al RSVP se controla con
// una política RLS que solo permite INSERT en `confirmaciones` (ver schema.sql).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseConfigurado = Boolean(url && anonKey)

// Si faltan las envs (p. ej. en un preview sin configurar), devolvemos null y el
// formulario muestra un estado degradado en vez de romper el build.
export const supabase = supabaseConfigurado
  ? createClient(url as string, anonKey as string)
  : null

export type Confirmacion = {
  nombre: string
  acompanante?: string | null
  asiste: boolean
  asistentes: number
  restriccion?: string | null
  mensaje?: string | null
  // Qué invitación originó la confirmación (ver components/Rsvp.tsx).
  origen: 'pareja' | 'solo'
}
