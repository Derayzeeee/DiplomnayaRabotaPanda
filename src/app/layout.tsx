import type { Metadata } from 'next'
import { Raleway } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer'; // Изменён импорт Footer
import { AuthProvider } from '@/context/AuthContext';
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
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}