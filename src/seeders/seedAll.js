import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Subcategory from '../models/Subcategory.js';
import Tag from '../models/Tags.js';
import User from '../models/User.js';
import {
  generateBrand,
  generateCategory,
  generateProduct,
  generateSubcategory,
  generateTag,
  generateUser
} from '../utils/fakerGenerators.js';

// Helper function to insert data in batches
const handleInsertMany = async (model, data, batchSize = 100) => {
  try {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      batches.push(await model.insertMany(batch, { ordered: false }));
    }
    return batches.flat();
  } catch (error) {
    if (error.code === 11000) {
      console.warn(`⚠️  Duplicates detected in ${model.modelName}, inserted ${error.result?.insertedCount || 0} items`);
      return error.result;
    }
    throw error;
  }
};

// Verify required collections exist
const verifyReferences = (collections) => {
  const missing = Object.entries(collections)
    .filter(([_, arr]) => !arr?.length)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing required collections: ${missing.join(', ')}`);
  }
};

// Validate input counts
const validateCounts = (counts) => {
  const errors = [];
  for (const [key, value] of Object.entries(counts)) {
    if (typeof value !== 'number' || value <= 0) {
      errors.push(`${key} must be a positive number`);
    }
  }
  if (errors.length) {
    throw new Error(`Invalid counts: ${errors.join(', ')}`);
  }
};

// Seed Users
const seedUsers = async (count) => {
  console.log(`🌱 Seeding ${count} users...`);
  const users = await handleInsertMany(User, Array.from({ length: count }, generateUser));
  console.log(`✅ Seeded ${users.length} users`);
  return users;
};

// Seed Categories
const seedCategories = async (count) => {
  console.log(`🌱 Seeding ${count} categories...`);
  const categories = await handleInsertMany(Category, Array.from({ length: count }, generateCategory));
  console.log(`✅ Seeded ${categories.length} categories`);
  return categories;
};

// Seed Subcategories
const seedSubcategories = async (categories, countPerCategory) => {
  console.log(`🌱 Seeding subcategories (${countPerCategory} per category)...`);
  const subcategories = await handleInsertMany(Subcategory,
    categories.flatMap(category =>
      Array.from({ length: countPerCategory }, () => generateSubcategory(category._id))
    )
  );
  console.log(`✅ Seeded ${subcategories.length} subcategories`);
  return subcategories;
};

// Seed Brands
const seedBrands = async (count) => {
  console.log(`🌱 Seeding ${count} brands...`);
  const brands = await handleInsertMany(Brand, Array.from({ length: count }, generateBrand));
  console.log(`✅ Seeded ${brands.length} brands`);
  return brands;
};

// Seed Tags
const seedTags = async (count) => {
  console.log(`🌱 Seeding ${count} tags...`);
  const tags = await handleInsertMany(Tag, Array.from({ length: count }, generateTag));
  console.log(`✅ Seeded ${tags.length} tags`);
  return tags;
};

// Seed Products
const seedProducts = async (count, categories, subcategories, brands, tags) => {
  console.log(`🌱 Seeding ${count} products...`);
  const products = await handleInsertMany(Product,
    Array.from({ length: count }, () =>
      generateProduct(categories, subcategories, brands, tags)
    )
  );
  console.log(`✅ Seeded ${products.length} products`);
  return products;
};

// Main seeding function
export const seedAll = async (counts) => {
  try {
    // Validate input counts
    validateCounts(counts);

    // Connect to the database
    await connectDB();
    console.log("🔌 Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Subcategory.deleteMany(),
      Brand.deleteMany(),
      Tag.deleteMany(),
      Product.deleteMany(),
    ]);
    console.log("✅ Existing data cleared");

    // Seed Users
    const users = await seedUsers(counts.users);

    // Seed Categories
    const categories = await seedCategories(counts.categories);

    // Seed Subcategories
    const subcategories = await seedSubcategories(categories, counts.subcategoriesPerCategory);

    // Seed Brands
    const brands = await seedBrands(counts.brands);

    // Seed Tags
    const tags = await seedTags(counts.tags);

    // Verify all references exist
    const existingData = {
      categories: await Category.find().lean(),
      brands: await Brand.find().lean(),
      tags: await Tag.find().lean(),
      subcategories: await Subcategory.find().lean()
    };
    verifyReferences(existingData);

    // Seed Products
    const products = await seedProducts(counts.products, existingData.categories, existingData.subcategories, existingData.brands, existingData.tags);

    console.log("✅ Database seeded successfully!");
    console.log(`📦 Created: 
- Users: ${users.length}
- Categories: ${categories.length}
- Subcategories: ${subcategories.length}
- Brands: ${brands.length}
- Tags: ${tags.length}
- Products: ${products.length}`);

  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
};

export default seedAll;