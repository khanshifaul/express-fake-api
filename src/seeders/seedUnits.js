import { faker } from "@faker-js/faker";
import Unit from "../models/Unit.js";
import { handleInsertMany } from "./seedUtils.js";

export const seedUnits = async (count) => {
  try {
    console.log(`🌱 Seeding ${count} units...`);

    const units = await handleInsertMany(
      Unit,
      Array.from({ length: count }, () => ({
        name: faker.helpers.arrayElement(["piece", "kg", "liter", "meter"]),
        description: faker.lorem.sentence(),
      }))
    );

    console.log(`✅ Seeded ${units.length} units`);
    return units;
  } catch (error) {
    console.error("❌ Error seeding units:", error.message);
    throw error;
  }
};