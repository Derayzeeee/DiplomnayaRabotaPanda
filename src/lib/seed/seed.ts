import dbConnect from '../db/mongoose';
import Product from '../../models/Product';
import Category from '../../models/Category';
import { productsData, categoriesData } from './data';

async function seed() {
  try {
    // Подключаемся к базе данных
    await dbConnect();

    // Очищаем существующие данные
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Добавляем категории
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Successfully added ${categories.length} categories`);

    // Добавляем продукты
    const products = await Product.insertMany(productsData);
    console.log(`✅ Successfully added ${products.length} products`);

    console.log('🌱 Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();