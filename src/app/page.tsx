'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PopularProducts from '@/components/product/PopularProducts';

// Определяем интерфейс для пропсов CategoryCard
interface CategoryCardProps {
  href: string;
  image: string;
  title: string;
  description: string;
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Minimalistic Approach */}
      <section className="relative h-[90vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-10 px-4 max-w-4xl">
            <motion.h1
              className="text-6xl md:text-7xl font-light tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Добро пожаловать в PandaStore
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                href="/catalog"
                className="inline-block bg-white/10 backdrop-blur-md text-white px-12 py-4 text-lg 
                          border border-white/30 hover:bg-white hover:text-black transition-all 
                          duration-500 rounded-full"
              >
                Смотреть каталог
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Grid */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* New Arrivals Card */}
            <CategoryCard
              href="/new"
              image="/images/new.jpg"
              title="Новинки"
              description="Ознакомьтесь с последними поступлениями"
            />

            {/* Sale Card */}
            <CategoryCard
              href="/sale"
              image="/images/sale.jpg"
              title="Распродажа"
              description="Специальные предложения и скидки"
            />
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <PopularProducts />
        </div>
      </section>
    </div>
  );
}

// Category Card Component
function CategoryCard({ href, image, title, description }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden shadow-lg"
    >
      <Link href={href}>
        <div className="aspect-[4/5] relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-medium mb-2">{title}</h3>
              <p className="text-white/80 text-lg font-light">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}