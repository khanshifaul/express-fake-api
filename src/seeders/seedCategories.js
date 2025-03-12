import { faker } from "@faker-js/faker";
import Category from "../models/Category.js";
import { handleInsertMany } from "./seedUtils.js";

// Define the generateCategory function
const generateCategory = () => {
  return {
    name: faker.commerce.department(),
    logo: faker.image.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

export const seedCategories = async (count) => {
  try {
    console.log(`🌱 Seeding ${count} categories...`);

    // Generate unique categories
    const categories = await handleInsertMany(
      Category,
      Array.from({ length: count }, () => generateCategory())
    );

    console.log(`✅ Seeded ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
    throw error;
  }
};
