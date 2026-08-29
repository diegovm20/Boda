// app/regalos/page.tsx
import Image from "next/image";
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import { BODA } from "@/lib/config";
import GiftList, { Gift } from "@/components/GiftList";

export const revalidate = 0; // siempre trae datos frescos (para saber qué ya fue tomado)

// Bandera para prender/apagar esta sección sin borrar el código.
const REGALOS_ACTIVO = true;

export default async function RegalosPage() {
  if (!REGALOS_ACTIVO) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-2xl text-olive-700 mb-4">
            Esta sección no está disponible
          </h1>
          <p className="font-serif text-ink/70 text-sm leading-relaxed">
            Por ahora encuentra nuestra lista de regalos en el botón
            "Regalos" de la invitación principal.
          </p>
        </div>
      </main>
    );
  }

  let gifts: Gift[] = [];
  let hubError = false;

  if (supabaseConfigurado && supabase) {
    const { data, error } = await supabase
      .from("gifts")
      .select("id, name, description, image_url, price, permite_multiple")
      .order("created_at", { ascending: true });

    if (error) hubError = true;
    gifts = (data as Gift[]) ?? [];
  } else {
    hubError = true;
  }

  return (
    // Sin bg propio a propósito: el fondo con textura ya lo pone layout.tsx
    // (el div fixed con /textura.jpeg) para toda la página.
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div className="mx-auto mb-6 w-24 [filter:drop-shadow(0_9px_11px_rgba(45,45,22,0.38))]">
          <Image
            src="/sello.png"
            alt={`Sello de cera con el monograma ${BODA.novios.monograma}`}
            width={1254}
            height={1254}
            className="h-auto w-full"
          />
        </div>
        <h1 className="font-serif uppercase tracking-[0.05em] text-3xl md:text-4xl text-olive-700 mb-4">
          Nuestra Mesa de Regalos
        </h1>
        <p className="font-serif text-ink/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Tu presencia es nuestro mejor regalo. Si además deseas obsequiarnos
          algo, elige una opción de la lista con mucho cariño.
        </p>
      </div>

      {hubError && (
        <p className="text-center text-red-700 font-serif">
          No se pudo cargar la lista de regalos. Intenta de nuevo más tarde.
        </p>
      )}

      <GiftList initialGifts={gifts} />
    </main>
  );
}
