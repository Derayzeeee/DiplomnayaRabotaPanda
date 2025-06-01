'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PopularProducts from '@/components/product/PopularProducts';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero секция - убираем затемнение */}
      <section className="relative h-[100vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-8 px-4">
            <motion.h1
              className="text-5xl md:text-6xl font-bold tracking-tight"
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
                className="inline-block bg-white text-black px-8 py-3 text-lg font-medium border-2 border-white hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Смотреть каталог
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Акции и новинки - убираем затемнение */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Каталог */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden border-2 border-black"
            >
              <Link href="/catalog">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/catalog.jpg"
                    alt="Каталог"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transform transition-transform group-hover:scale-105 bg-black/80 p-4">
                      <h3 className="text-2xl font-bold text-white mb-3">Каталог</h3>
                      <p className="text-white text-lg">Просмотрите нашу коллекцию одежды</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Новинки */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden border-2 border-black"
            >
              <Link href="/new">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/new.jpg"
                    alt="Новинки"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transform transition-transform group-hover:scale-105 bg-black/80 p-4">
                      <h3 className="text-2xl font-bold text-white mb-3">Новинки</h3>
                      <p className="text-white text-lg">Ознакомьтесь с последними поступлениями</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Распродажа */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden border-2 border-black"
            >
              <Link href="/sale">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/images/sale.jpg"
                    alt="Распродажа"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center transform transition-transform group-hover:scale-105 bg-black/80 p-4">
                      <h3 className="text-2xl font-bold text-white mb-3">Распродажа</h3>
                      <p className="text-white text-lg">Специальные предложения и скидки</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Популярные товары */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <PopularProducts />
        </div>
      </section>
    </div>
  );
}