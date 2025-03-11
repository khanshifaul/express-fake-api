#!/usr/bin/env node
import seedAll from './seeders/seedAll.js';

const parseArgs = () => ({
  users: 20,
  categories: 5,
  subcategoriesPerCategory: 3,
  brands: 10,
  tags: 20,
  products: 50
});

(async () => {
  try {
    const counts = parseArgs();
    console.log('🚀 Starting seeder with configuration:');
    console.table(counts);
    await seedAll(counts);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
})();