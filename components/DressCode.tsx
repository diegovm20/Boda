'use client'

import Image from 'next/image'

/**
 * Dress Code — collage de dos capas superpuestas (tarjeta de nota + cartela).
 *
 * Las posiciones van en % dentro de un contenedor con aspect-ratio fijo, así el
 * arreglo se mantiene proporcional a cualquier tamaño (mobile se ve igual que
 * desktop, solo cambia la caja: ~5/4 en mobile, ~3/2 en desktop).
 *
 * Motion — se integra con el sistema del sitio (useScrollFx, GSAP + ScrollTrigger,
 * que es la capa correcta para reveals ligados al scroll según wedding-invite-motion;
 * Framer Motion queda reservado para hover/estado). El contenedor lleva
 * [data-reveal-stagger]: escalona sus hijos directos en orden de DOM
 * (cartela → tarjeta) con fade + y. Cada capa aísla su transform de posición
 * (rotación / centrado) en un wrapper interno para no competir con el transform
 * que anima GSAP. prefers-reduced-motion: solo opacidad, sin desplazamiento.
 */
export default function DressCode() {
  return (
    <section className="section pb-6 pt-16" id="dress-code">
      {/* La composición es visual; damos un título real a lectores de pantalla. */}
      <h2 className="sr-only">Código de vestimenta</h2>

      <div
        className="relative mx-auto aspect-[8/5] w-full max-w-md md:aspect-[3/2] md:max-w-lg"
        data-reveal-stagger
      >
        {/* CAPA 2 — Cartela "Dress Code" (pieza central, encima de la tarjeta).
            Posicionada por left/top (no translateX) para dejar libre el
            transform que anima GSAP. */}
        <div className="absolute left-[30%] top-[38%] z-30 w-[56%] md:top-[40%]">
          <Image
            src="/dres.png"
            alt="Dress Code"
            width={959}
            height={671}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        {/* CAPA 1 — Tarjeta de nota (arriba-izquierda). La rotación vive en el
            wrapper interno; el externo lo anima GSAP sin romper el giro. */}
        <div className="absolute left-[3%] top-[3%] z-20 w-[54%] [perspective:900px]">
          <div
            className="rounded-sm border border-olive-700/15 bg-cream px-5 py-6 text-center [transform:rotate(-4deg)_rotateX(7deg)] sm:px-6 sm:py-7"
            style={{
              boxShadow:
                '0 1px 2px rgba(45,45,22,0.05), 0 10px 20px -10px rgba(45,45,22,0.22), 0 26px 44px -22px rgba(45,45,22,0.30)',
            }}
          >
            <p className="font-serif text-[clamp(0.72rem,2.7vw,0.98rem)] font-semibold uppercase leading-snug tracking-wide text-ink">
              Formal
            </p>
            <p className="mt-1.5 font-serif text-[clamp(0.7rem,2.6vw,0.95rem)] leading-snug text-ink/85">
              Caballeros con terno, damas con vestido largo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
