import type { Metadata } from 'next'

import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'CarateHope - Finest Jewelry',
  description: 'Discover timeless jewelry pieces inspired by life. Rings, necklaces, bracelets, and earrings for every occasion.',
  generator: 'v0.app',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
