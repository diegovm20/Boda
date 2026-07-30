import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Pinyon_Script } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import { BODA } from '@/lib/config'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
})

// Script solo para iniciales / nombres — nunca para cuerpo.
const script = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const titulo = `${BODA.novios.ella} & ${BODA.novios.el} · ${BODA.fechaLarga}`
const descripcion = `Nos casamos el ${BODA.fechaLarga} en ${BODA.ciudad}. Acompáñanos.`

export const metadata: Metadata = {
  metadataBase: new URL('https://michelle-y-santiago.vercel.app'),
  title: titulo,
  description: descripcion,
  openGraph: {
    title: titulo,
    description: descripcion,
    type: 'website',
    locale: 'es_PE',
    images: [{ url: '/envelope.png', width: 1200, height: 630, alt: titulo }],
  },
  twitter: {
    card: 'summary_large_image',
    title: titulo,
    description: descripcion,
    images: ['/envelope.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#524f27',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body className="font-sans antialiased">
        {/* Fondo de toda la página: textura de papel (textura.jpeg) en mosaico.
            La repetimos a tamaño reducido (repeat + background-size) en vez de
            estirarla a "cover": así el grano nunca se agranda ni se pixela, y en
            pantallas retina se ve nítido. El color base queda debajo por si acaso. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10"
          style={{
            backgroundColor: 'var(--cream)',
            backgroundImage: 'url(/textura.jpeg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '420px auto',
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
