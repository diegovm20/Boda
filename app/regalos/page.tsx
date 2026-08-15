// app/regalos/page.tsx
import { supabase, supabaseConfigurado } from "@/lib/supabase";
import GiftList, { Gift } from "@/components/GiftList";

export const revalidate = 0; // siempre trae datos frescos (para saber qué ya fue tomado)

// Bandera para prender/apagar esta sección sin borrar el código.
// Cámbiala a "true" el día que quieras volver a usar la lista de regalos propia.
const REGALOS_ACTIVO = false;

export default async function RegalosPage() {
  if (!REGALOS_ACTIVO) {
    return (
      <main className="min-h-screen bg-[#f2ede1] flex items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[#4d4a30] text-[#f2ede1] flex items-center justify-center font-serif text-xl shadow-md">
            M&S
          </div>
          <h1 className="font-serif text-2xl text-[#4d4a30] mb-4">
            Esta sección no está disponible
          </h1>
          <p className="font-serif text-[#6b6850] text-sm leading-relaxed">
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
      .select("*")
      .order("created_at", { ascending: true });

    if (error) hubError = true;
    gifts = (data as Gift[]) ?? [];
  } else {
    hubError = true;
  }

  return (
    <main className="min-h-screen bg-[#f2ede1] bg-[url('/paper-texture.png')] bg-repeat px-6 py-16">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[#4d4a30] text-[#f2ede1] flex items-center justify-center font-serif text-xl shadow-md">
          M&S
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#4d4a30] tracking-wide mb-4">
          Nuestra Mesa de Regalos
        </h1>
        <p className="font-serif text-[#6b6850] text-sm md:text-base leading-relaxed max-w-xl mx-auto">
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
