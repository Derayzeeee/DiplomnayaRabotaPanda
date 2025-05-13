'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, MotionProps } from 'framer-motion';
import Footer from '@/components/layout/Footer';

const MotionP = motion.p;
const MotionDiv = motion.div;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero section */}
      <main className="flex-grow">
        <div className="relative h-screen">
          {/* Фоновое изображение */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            {/* Затемнение */}
           
          </div>

          {/* Контент */}
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center space-y-8 px-4">
              <MotionDiv 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
              </MotionDiv>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Каталог */}
              <MotionDiv
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
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Каталог</h3>
                        <p className="text-gray-200">Просмотрите нашу коллекцию одежды</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionDiv>

              {/* Новинки */}
              <MotionDiv
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
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Новинки</h3>
                        <p className="text-gray-200">Ознакомьтесь с последними поступлениями</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionDiv>

              {/* Распродажа */}
              <MotionDiv
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
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Распродажа</h3>
                        <p className="text-gray-200">Специальные предложения и скидки</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionDiv>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}