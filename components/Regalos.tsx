'use client'
import Image from 'next/image'
import { BODA } from '@/lib/config'
export default function Regalos() {
  const { mensaje } = BODA.regalos
  return (
    <section className="section pb-32 pt-4 text-center" id="regalos">
      {/* Tarjeta de papelería sellada + insignia circular "Regalos" (como la
          referencia). El wrapper lleva la perspectiva y el data-reveal (GSAP
          anima su transform sin chocar con el tilt 3D de la tarjeta interna). */}
      <div className="relative mx-auto mt-4 max-w-md [perspective:1200px]" data-reveal>
        <div
          className="relative rounded-sm border border-olive-700/10 bg-cream px-8 pb-11 pt-16 [transform:rotateX(6deg)] sm:px-10"
          style={{
            boxShadow:
              '0 2px 4px rgba(45,45,22,0.06), 0 14px 26px -12px rgba(45,45,22,0.22), 0 44px 70px -30px rgba(45,45,22,0.32)',
          }}
        >
          {/* Sello de cera M&S, montado sobre el borde superior con su propia
              sombra proyectada para dar profundidad (se ve levantado). */}
          <div className="absolute left-1/2 top-0 w-24 -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_9px_11px_rgba(45,45,22,0.38))] sm:w-28">
            <Image
              src="/sello.png"
              alt={`Sello de cera con el monograma ${BODA.novios.monograma}`}
              width={1254}
              height={1254}
              className="h-auto w-full"
            />
          </div>
          {/* Mensaje con capital decorativa, versalitas y texto justificado. */}
          <p className="text-justify font-serif text-[clamp(0.95rem,2.6vw,1.15rem)] uppercase leading-relaxed tracking-[0.02em] text-ink/85 first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-[3.4rem] first-letter:font-light first-letter:leading-[0.8] first-letter:text-olive-700">
            {mensaje}
          </p>
        </div>
        {/* Insignia circular "Regalos" en script — clickeable, lleva a la
            lista de regalos externa (sinenvolturas.com). Baja y sobresale del
            borde inferior de la tarjeta. */}
        <a
          href="https://sinenvolturas.com/santiagovaldiviesomichellesueros/regalos"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver nuestra lista de regalos"
          className="absolute -bottom-24 right-2 z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-olive-800 shadow-[0_16px_34px_-8px_rgba(45,45,22,0.5)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive-700 sm:right-6 sm:h-32 sm:w-32"
        >
          <span className="font-script text-2xl leading-none text-cream sm:text-3xl">
            Regalos
          </span>
          <span className="mt-1.5 font-sans text-[0.5rem] uppercase tracking-[0.15em] text-cream/60 sm:text-[0.55rem]">
            dar click aquí
          </span>
        </a>
      </div>
    </section>
  )
}
