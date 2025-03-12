import { faker } from "@faker-js/faker";
import Discount from "../models/Discount.js";
import { handleInsertMany } from "./seedUtils.js";

// Function to generate unique discount names
const generateUniqueDiscountNames = (count) => {
  const names = new Set(); // Use a Set to ensure uniqueness
  while (names.size < count) {
    names.add(faker.commerce.productName());
  }
  return Array.from(names); // Convert Set to an array
};

export const seedDiscounts = async (count) => {
  try {
    console.log(`🌱 Seeding ${count} discounts...`);

    // Generate unique discount names
    const discountNames = generateUniqueDiscountNames(count);

    // Generate discount data
    const discountData = discountNames.map((name) => ({
      name,
      type: faker.helpers.arrayElement(["percentage", "fixed"]),
      value: faker.number.float({ min: 0, max: 50, precision: 0.01 }),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
    }));

    // Insert discounts into the database
    const discounts = await handleInsertMany(Discount, discountData);

    console.log(`✅ Seeded ${discounts.length} discounts`);
    return discounts;
  } catch (error) {
    console.error("❌ Error seeding discounts:", error.message);
    throw error;
  }
};