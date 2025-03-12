import { faker } from "@faker-js/faker";
import Tax from "../models/Tax.js";
import { handleInsertMany } from "./seedUtils.js";

export const seedTaxes = async (count) => {
  try {
    console.log(`🌱 Seeding ${count} taxes...`);

    const taxes = await handleInsertMany(
      Tax,
      Array.from({ length: count }, () => ({
        name: faker.finance.transactionType(),
        type: faker.helpers.arrayElement(["inclusive", "exclusive"]),
        percentage: faker.number.float({ min: 0, max: 20, precision: 0.00 }),
      }))
    );

    console.log(`✅ Seeded ${taxes.length} taxes`);
    return taxes;
  } catch (error) {
    console.error("❌ Error seeding taxes:", error.message);
    throw error;
  }
};