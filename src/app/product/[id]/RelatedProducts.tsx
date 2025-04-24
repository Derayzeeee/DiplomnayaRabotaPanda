'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import type { ProductWithId } from '@/types/product';

interface RelatedProductsProps {
  products: ProductWithId[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product._id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}