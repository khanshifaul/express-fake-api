import { faker } from '@faker-js/faker';
import Variant from '../models/Variant.js';
import { handleInsertMany } from './seedUtils.js';

// Define the generateVariant function
const generateVariant = (productId) => {
  const variantTypes = ['color', 'size', 'material']; // Example variant types
  const key = faker.helpers.arrayElement(variantTypes); // Randomly select a variant type

  // Generate random values for the variant
  const values = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => {
    switch (key) {
      case 'color':
        return faker.color.human();
      case 'size':
        return faker.helpers.arrayElement(['S', 'M', 'L', 'XL']);
      case 'material':
        return faker.helpers.arrayElement(['Cotton', 'Polyester', 'Wool', 'Silk']);
      default:
        return faker.lorem.word();
    }
  });

  return {
    key,
    values,
    product: productId,
  };
};

export const seedVariants = async (count, dependencyData) => {
  try {
    const { products } = dependencyData; // Get products from dependencies

    if (!products || !products.length) {
      throw new Error('No products found. Please seed products first.');
    }

    console.log(`🌱 Seeding ${count} variants per product...`);

    // Generate variants for each product
    const variants = await handleInsertMany(
      Variant,
      products.flatMap((product) =>
        Array.from({ length: count }, () => generateVariant(product._id))
      )
    );

    console.log(`✅ Seeded ${variants.length} variants`);
    return variants;
  } catch (error) {
    console.error('❌ Error seeding variants:', error.message);
    throw error;
  }
};