import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { FloatingWhatsAppButton } from '@/components/bespoke/FloatingWhatsAppButton'

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <FloatingWhatsAppButton phoneNumber="919876543210" />
      <Footer />
    </>
  )
}
