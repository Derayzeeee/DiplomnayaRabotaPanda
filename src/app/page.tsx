'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PopularProducts from '@/components/product/PopularProducts';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero секция */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/hero-bg.jpg" // Используем ваше существующее изображение
          alt="Hero banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-6 px-4">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Добро пожаловать в PandaStore
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="/catalog"
                className="inline-block bg-white text-black px-8 py-3 text-lg font-medium
                         hover:bg-black hover:text-white transition-colors duration-300"
              >
                Смотреть каталог
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Акции и новинки */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Каталог */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <Link href="/catalog">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/catalog.jpg"
                    alt="Каталог"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Каталог</h3>
                      <p className="text-gray-200">Просмотрите нашу коллекцию одежды</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Новинки */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <Link href="/new">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/new.jpg"
                    alt="Новинки"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Новинки</h3>
                      <p className="text-gray-200">Ознакомьтесь с последними поступлениями</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Распродажа */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <Link href="/sale">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/sale.jpg"
                    alt="Распродажа"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">Распродажа</h3>
                      <p className="text-gray-200">Специальные предложения и скидки</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Популярные товары */}
      <section className="py-16 px-4 bg-gray-50">
        <PopularProducts />
      </section>
    </div>
  );
}