import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ClothingStore',
  description: 'Магазин одежды',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={raleway.className}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}