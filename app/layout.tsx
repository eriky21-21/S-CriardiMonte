import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Criador de Vídeos Virais com IA',
  description: 'Crie vídeos virais para YouTube, Instagram e TikTok usando IA',
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
