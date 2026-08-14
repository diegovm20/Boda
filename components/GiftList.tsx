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
  guest_id: string | null;
  claimed_at: string | null;
};

type Guest = { id: string; nombre: string };

export default function GiftList({ initialGifts }: { initialGifts: Gift[] }) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trae la lista de invitados confirmados (para el dropdown) al cargar
  useEffect(() => {
    const loadGuests = async () => {
      if (!supabaseConfigurado || !supabase) return;
      const { data, error } = await supabase.rpc("list_confirmed_guests");
      if (!error && data) setGuests(data as Guest[]);
    };
    loadGuests();
  }, []);

  const openModal = (gift: Gift) => {
    setSelectedGift(gift);
    setSelectedGuestId("");
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

    const { data, error } = await supabase.rpc("claim_gift", {
      gift_id: selectedGift.id,
      p_guest_id: selectedGuestId,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(
        "Este regalo ya fue seleccionado por otra persona. Elige otro 💛"
      );
      const { data: freshGifts } = await supabase
        .from("gifts")
        .select("*")
        .order("created_at", { ascending: true });
      if (freshGifts) setGifts(freshGifts as Gift[]);
      return;
    }

    setGifts((prev) =>
      prev.map((g) => (g.id === selectedGift.id ? (data as Gift) : g))
    );
    closeModal();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {gifts.map((gift) => {
          const isTaken = !!gift.guest_id;
          return (
            <div
              key={gift.id}
              className="bg-white/90 border border-[#c9c2a3] rounded-lg shadow-sm p-5 flex flex-col justify-between text-center"
            >
              {gift.image_url && (
                <img
                  src={gift.image_url}
                  alt={gift.name}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              <h3 className="font-serif text-[#4d4a30] text-lg mb-1">
                {gift.name}
              </h3>
              {gift.description && (
                <p className="text-sm text-[#6b6850] mb-3">
                  {gift.description}
                </p>
              )}
              {gift.price && (
                <p className="text-sm text-[#8a8560] mb-4">S/ {gift.price}</p>
              )}

              {isTaken ? (
                <span className="mt-auto inline-block text-xs uppercase tracking-wide text-[#a09b7a] border border-[#c9c2a3] rounded-full px-4 py-2">
                  Ya fue elegido
                </span>
              ) : (
                <button
                  onClick={() => openModal(gift)}
                  className="mt-auto bg-[#4d4a30] text-[#f2ede1] text-xs uppercase tracking-wide rounded-full px-4 py-2 hover:bg-[#3a381f] transition"
                >
                  Elegir este regalo
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedGift && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-[#f2ede1] border border-[#c9c2a3] rounded-lg shadow-lg max-w-sm w-full p-8 text-center">
            <h3 className="font-serif text-[#4d4a30] text-xl mb-2">
              {selectedGift.name}
            </h3>
            <p className="text-sm text-[#6b6850] mb-5">
              Selecciona tu nombre para confirmar que tú nos darás este
              regalo.
            </p>

            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
              className="w-full border border-[#c9c2a3] rounded px-3 py-2 mb-3 bg-white text-[#4d4a30] font-serif text-center focus:outline-none focus:ring-2 focus:ring-[#4d4a30]"
            >
              <option value="">-- Selecciona tu nombre --</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre}
                </option>
              ))}
            </select>

            {guests.length === 0 && (
              <p className="text-xs text-[#a09b7a] mb-3">
                Si no ves tu nombre, primero confirma tu asistencia en el
                formulario RSVP.
              </p>
            )}

            {errorMsg && (
              <p className="text-red-700 text-sm mb-3">{errorMsg}</p>
            )}

            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={closeModal}
                disabled={loading}
                className="text-xs uppercase tracking-wide text-[#6b6850] border border-[#c9c2a3] rounded-full px-4 py-2 hover:bg-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClaim}
                disabled={loading}
                className="text-xs uppercase tracking-wide bg-[#4d4a30] text-[#f2ede1] rounded-full px-4 py-2 hover:bg-[#3a381f] transition disabled:opacity-50"
              >
                {loading ? "Confirmando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
