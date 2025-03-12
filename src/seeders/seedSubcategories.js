import { faker } from "@faker-js/faker";
import Subcategory from "../models/Subcategory.js";
import { handleInsertMany } from "./seedUtils.js";

// Define the generateSubcategory function
const generateSubcategory = (categoryId) => {
  return {
    name: faker.commerce.productName(), // Generate a random subcategory name
    category: categoryId, // Assign the provided category ID
    description: faker.lorem.sentence(), // Generate a random description
    isActive: faker.datatype.boolean(), // Randomly set isActive
  };
};

export const seedSubcategories = async (count, dependencyData) => {
  try {
    const { categories } = dependencyData; // Now using lowercase key

    if (!categories || categories.length === 0) {
      throw new Error("No categories found. Please seed categories first.");
    }

    console.log(`🌱 Seeding ${count} subcategories per category...`);

    const subcategories = await handleInsertMany(
      Subcategory,
      categories.flatMap((category) =>
        Array.from({ length: count }, () => ({
          name: faker.commerce.department(),
          category: category._id,
          description: faker.lorem.sentence(),
          isActive: true,
        }))
      )
    );

    console.log(`✅ Seeded ${subcategories.length} subcategories`);
    return subcategories;
  } catch (error) {
    console.error("❌ Error seeding subcategories:", error.message);
    throw error;
  }
};
