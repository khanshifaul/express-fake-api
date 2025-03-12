import Brand from '../models/Brand.js';
import { generateBrand } from '../utils/fakerGenerators.js';
import { handleInsertMany } from './seedUtils.js';

export const seedBrands = async (count) => {
  console.log(`🌱 Seeding ${count} brands...`);
  const brands = await handleInsertMany(Brand, Array.from({ length: count }, generateBrand));
  console.log(`✅ Seeded ${brands.length} brands`);
  return brands;
};