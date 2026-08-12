// Todos los datos de la boda viven acá. Nada hardcodeado en componentes.

export const BODA = {
  novios: {
    ella: 'Michelle',
    el: 'Santiago',
    monograma: 'M&S',
  },

  // Fecha objetivo del countdown y del gran día (hora local del dispositivo).
  fechaISO: '2027-01-16T16:30:00',
  fechaDisplay: '16 · ENERO · 2027',
  fechaLarga: '16 de enero de 2027',
  diaCorto: '16 de enero',
  ciudad: 'Lima, Perú',

  // Fecha límite para confirmar asistencia.
  rsvpDeadline: '16 de noviembre de 2026',

  hashtag: '#MichelleYSantiago',

  historia:
    'Después de años caminando juntos, decidimos dar el siguiente paso. ' +
    'Nos encantaría que estés ahí el día que decidamos quedarnos para siempre.',

  eventos: [
    {
      nombre: 'Ceremonia',
      hora: '3:00 PM',
      lugar: 'Nueva Toledo 143',
      direccion: '',
      nota: 'Te pedimos llegar 20 minutos antes.',
    },
    {
      nombre: 'Recepción',
      hora: '4:00 PM',
      lugar: 'Mismo lugar de la ceremonia',
      direccion: '',
      nota: 'Cena, brindis y baile hasta el final.',
    },
  ],

  // Un solo lugar de referencia para el mapa (ceremonia y recepción son en el mismo lugar).
  ubicacion: {
    nombre: 'Lima, Perú',
    lat: -12.0464,
    lng: -77.0428,
    // URL que abre el botón "Ubicación" en Google Maps.
    mapsUrl: 'https://maps.app.goo.gl/9Xf4va63qxU9pzpx7?g_st=ic',
  },

  dressCode: {
    titulo: 'Formal',
    detalle: 'Terno para caballeros · Vestido largo para damas',
    // Paleta sugerida para invitados (swatches reales).
    swatches: [
      { nombre: 'Olivo', hex: '#524f27' },
      { nombre: 'Salvia', hex: '#9c9958' },
      { nombre: 'Arena', hex: '#c9b79c' },
      { nombre: 'Marfil', hex: '#f0e9da' },
    ],
    evitar: 'Evita el blanco y el verde olivo (reservados para la novia y el cortejo).',
  },

  galeria: [
    // Reemplaza por tus fotos en /public/galeria. Placeholders elegantes por ahora.
    { src: '/galeria/1.jpg', alt: 'Michelle y Santiago' },
    { src: '/galeria/2.jpg', alt: 'Un momento juntos' },
    { src: '/galeria/3.jpg', alt: 'Risas' },
    { src: '/galeria/4.jpg', alt: 'De viaje' },
    { src: '/galeria/5.jpg', alt: 'La propuesta' },
    { src: '/galeria/6.jpg', alt: 'Atardecer' },
  ],

  regalos: {
    titulo: 'Mesa de regalos',
    mensaje:
      'Tu presencia es nuestro mejor regalo. Si además deseas obsequiarnos algo, ' +
      'dejamos aquí nuestra lista con mucho cariño.',
    url: 'https://example.com/lista-de-regalos',
    ctaLabel: 'Ver lista de regalos',
  },
} as const

// Opciones del stepper de asistentes en el RSVP.
export const MAX_ASISTENTES = 6
