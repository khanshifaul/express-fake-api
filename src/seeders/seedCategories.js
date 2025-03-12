// seeders/seedCategories.js
import { faker } from '@faker-js/faker';
import Category from '../models/Category.js';
import { handleInsertMany } from './seedUtils.js';

const generateCategory = (existingNames) => {
  let name;
  do {
    name = faker.commerce.department();
  } while (existingNames.has(name));
  
  return {
    name,
    logo: faker.image.url()
  };
};

export const seedCategories = async (count) => {
  try {
    console.log(`🌱 Seeding ${count} categories...`);
    const existingNames = new Set();
    
    const categories = await handleInsertMany(
      Category,
      Array.from({ length: count }, () => {
        const category = generateCategory(existingNames);
        existingNames.add(category.name);
        return category;
      })
    );

    console.log(`✅ Seeded ${categories?.length || 0} categories`);
    return categories || [];
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    return [];
  }
};