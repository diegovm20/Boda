// components/GiftList.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseConfigurado } from "@/lib/supabase";

export type Gift = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  permite_multiple: boolean;
};

type Guest = { id: string; nombre: string };
type ClaimCounts = Record<string, number>;

// AJUSTA estos datos con la información bancaria real.
const DATOS_BANCARIOS = {
  banco: "BCP",
  titular: "Nombre Completo",
  cuenta: "191-XXXXXXX-X-XX",
  cci: "002-191-XXXXXXXXXXXX-XX",
  yape: "999 999 999 (Nombre)",
};

// Mismo boxShadow que usa la tarjeta de papelería en Regalos.tsx,
// para que el modal se sienta parte del mismo sistema visual.
const SOMBRA_TARJETA = {
  boxShadow:
    "0 2px 4px rgba(45,45,22,0.06), 0 14px 26px -12px rgba(45,45,22,0.22), 0 44px 70px -30px rgba(45,45,22,0.32)",
};

export default function GiftList({ initialGifts }: { initialGifts: Gift[] }) {
  const [gifts] = useState<Gift[]>(initialGifts);
  const [claimCounts, setClaimCounts] = useState<ClaimCounts>({});
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [step, setStep] = useState<"elegir" | "pago">("elegir");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCounts = async () => {
    if (!supabaseConfigurado || !supabase) return;
    const { data, error } = await supabase.rpc("gift_claim_counts");
    if (!error && data) {
      const map: ClaimCounts = {};
      (data as { gift_id: string; veces_elegido: number }[]).forEach((row) => {
        map[row.gift_id] = row.veces_elegido;
      });
      setClaimCounts(map);
    }
  };

  useEffect(() => {
    const loadGuests = async () => {
      if (!supabaseConfigurado || !supabase) return;
      const { data, error } = await supabase.rpc("list_confirmed_guests");
      if (!error && data) setGuests(data as Guest[]);
    };
    loadGuests();
    loadCounts();
  }, []);

  const openModal = (gift: Gift) => {
    setSelectedGift(gift);
    setSelectedGuestId("");
    setStep("elegir");
    setErrorMsg(null);
  };

  const closeModal = () => {
    setSelectedGift(null);
    setErrorMsg(null);
  };

  const confirmClaim = async () => {
    if (!selectedGift) return;
    if (!supabaseConfigurado || !supabase) {
      setErrorMsg("El sitio no está conectado a la base de datos ahora mismo.");
      return;
    }
    if (!selectedGuestId) {
      setErrorMsg("Por favor selecciona tu nombre de la lista.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.rpc("claim_gift", {
      gift_id: selectedGift.id,
      p_guest_id: selectedGuestId,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(
        error.message.includes("ya fue seleccionado") ||
          error.message.includes("Ya habías")
          ? error.message
          : "No se pudo confirmar. Intenta de nuevo."
      );
      await loadCounts();
      return;
    }

    await loadCounts();
    setStep("pago"); // pasamos a mostrar los datos bancarios
  };

  return (
    <>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gifts.map((gift) => {
          const count = claimCounts[gift.id] || 0;
          const agotado = !gift.permite_multiple && count > 0;

          return (
            <div
              key={gift.id}
              className="bg-cream border border-olive-700/10 rounded-sm shadow-sm p-5 flex flex-col justify-between text-center"
            >
              {gift.image_url && (
                <img
                  src={gift.image_url}
                  alt={gift.name}
                  className="w-full h-32 object-cover rounded-sm mb-4"
                />
              )}
              <h3 className="font-serif text-olive-700 text-lg mb-1">
                {gift.name}
              </h3>
              {gift.description && (
                <p className="font-sans text-sm text-ink/70 mb-2">
                  {gift.description}
                </p>
              )}
              {gift.price && (
                <p className="font-sans text-sm text-olive-600 mb-2">
                  S/ {gift.price}
                </p>
              )}
              {gift.permite_multiple && count > 0 && (
                <p className="font-sans text-xs text-olive-500 mb-3">
                  Elegido {count} {count === 1 ? "vez" : "veces"}
                </p>
              )}

              {agotado ? (
                <span className="mt-auto inline-block font-sans text-xs uppercase tracking-wide text-olive-500 border border-olive-700/20 rounded-full px-4 py-2">
                  Ya fue elegido
                </span>
              ) : (
                <button
                  onClick={() => openModal(gift)}
                  className="mt-auto bg-olive-700 text-cream font-sans text-xs uppercase tracking-wide rounded-full px-4 py-2 hover:bg-olive-800 transition"
                >
                  {gift.permite_multiple && count > 0
                    ? "Aportar también"
                    : "Elegir este regalo"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedGift && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50">
          <div
            className="relative rounded-sm border border-olive-700/10 bg-cream px-8 py-10 max-w-sm w-full text-center"
            style={SOMBRA_TARJETA}
          >
            {step === "elegir" && (
              <>
                <h3 className="font-serif text-olive-700 text-xl mb-2">
                  {selectedGift.name}
                </h3>
                <p className="font-serif text-sm text-ink/80 mb-5">
                  Selecciona tu nombre para confirmar que tú nos darás este
                  regalo.
                </p>

                <select
                  value={selectedGuestId}
                  onChange={(e) => setSelectedGuestId(e.target.value)}
                  className="w-full border border-olive-700/20 rounded px-3 py-2 mb-3 bg-white text-olive-800 font-serif text-center focus:outline-none focus:ring-2 focus:ring-olive-700"
                >
                  <option value="">-- Selecciona tu nombre --</option>
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>

                {guests.length === 0 && (
                  <p className="font-sans text-xs text-olive-500 mb-3">
                    Si no ves tu nombre, primero confirma tu asistencia en el
                    formulario RSVP.
                  </p>
                )}

                {errorMsg && (
                  <p className="font-sans text-red-700 text-sm mb-3">
                    {errorMsg}
                  </p>
                )}

                <div className="flex gap-3 justify-center mt-4">
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="font-sans text-xs uppercase tracking-wide text-ink/70 border border-olive-700/20 rounded-full px-4 py-2 hover:bg-olive-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmClaim}
                    disabled={loading}
                    className="font-sans text-xs uppercase tracking-wide bg-olive-700 text-cream rounded-full px-4 py-2 hover:bg-olive-800 transition disabled:opacity-50"
                  >
                    {loading ? "Confirmando..." : "Confirmar"}
                  </button>
                </div>
              </>
            )}

            {step === "pago" && (
              <>
                <h3 className="font-script text-3xl text-olive-700 mb-1">
                  ¡Gracias!
                </h3>
                <p className="font-serif text-sm text-ink/80 mb-4">
                  Elegiste: <strong>{selectedGift.name}</strong>
                  {selectedGift.price && <> — S/ {selectedGift.price}</>}
                </p>

                <div className="bg-white border border-olive-700/10 rounded-sm p-4 text-left font-sans text-sm text-ink space-y-1 mb-4">
                  <p>
                    <span className="text-olive-500">Banco:</span>{" "}
                    {DATOS_BANCARIOS.banco}
                  </p>
                  <p>
                    <span className="text-olive-500">Titular:</span>{" "}
                    {DATOS_BANCARIOS.titular}
                  </p>
                  <p>
                    <span className="text-olive-500">Cuenta:</span>{" "}
                    {DATOS_BANCARIOS.cuenta}
                  </p>
                  <p>
                    <span className="text-olive-500">CCI:</span>{" "}
                    {DATOS_BANCARIOS.cci}
                  </p>
                  <p>
                    <span className="text-olive-500">Yape/Plin:</span>{" "}
                    {DATOS_BANCARIOS.yape}
                  </p>
                </div>

                <p className="font-sans text-xs text-olive-500 mb-4">
                  Puedes depositar el monto equivalente cuando gustes, no hay
                  apuro.
                </p>

                <button
                  onClick={closeModal}
                  className="font-sans text-xs uppercase tracking-wide bg-olive-700 text-cream rounded-full px-4 py-2 hover:bg-olive-800 transition"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
