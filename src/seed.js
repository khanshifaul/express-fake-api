import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { seedBrands } from "./seeders/seedBrands.js";
import { seedCategories } from "./seeders/seedCategories.js";
import { seedDiscounts } from "./seeders/seedDiscounts.js";
import { seedInventory } from "./seeders/seedInventory.js";
import { seedPermissions } from "./seeders/seedPermissions.js";
import { seedProducts } from "./seeders/seedProducts.js";
import { seedRoles } from "./seeders/seedRoles.js";
import { seedSubcategories } from "./seeders/seedSubcategories.js";
import { seedTags } from "./seeders/seedTags.js";
import { seedTaxes } from "./seeders/seedTaxes.js";
import { seedUnits } from "./seeders/seedUnits.js";
import { seedUsers } from "./seeders/seedUsers.js";
import { seedVariants } from "./seeders/seedVariants.js";

// Configuration for seeding
const seedConfig = {
  Permission: {
    seedFunction: seedPermissions, // Seed permissions
  },
  Role: {
    seedFunction: seedRoles,
    dependencies: ["Permission"], // Roles depend on permissions
  },
  User: {
    count: 10,
    seedFunction: seedUsers,
    dependencies: ["Role"], // Users depend on roles
  },
  Category: {
    count: 5,
    seedFunction: seedCategories,
  },
  Subcategory: {
    count: 3, // Per category
    seedFunction: seedSubcategories,
    dependencies: ["Category"], // Subcategories depend on categories
  },
  Brand: {
    count: 5,
    seedFunction: seedBrands,
  },
  Tag: {
    count: 10,
    seedFunction: seedTags,
  },
  Unit: {
    count: 4,
    seedFunction: seedUnits,
  },
  Tax: {
    count: 2,
    seedFunction: seedTaxes,
  },
  Discount: {
    count: 2,
    seedFunction: seedDiscounts,
  },
  Inventory: {
    count: 3, // Number of inventory items to seed
    seedFunction: seedInventory,
  },
  Product: {
    count: 50,
    seedFunction: seedProducts,
    dependencies: [
      "Category",
      "Subcategory",
      "Brand",
      "Tag",
      "Unit",
      "Tax",
      "Discount",
      "Inventory",
    ],
  },
  Variant: {
    count: 2,
    seedFunction: seedVariants,
    dependencies: ["Product"],
  },
};

// Store seeded data for dependencies
const seededData = {};

// Function to convert a string to PascalCase
const toPascalCase = (str) => {
  return str
    .toLowerCase() // Convert to lowercase
    .split(" ") // Split into words (if multiple)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(""); // Join words without spaces
};

// Function to fetch existing data for a dependency
const fetchExistingData = async (entity) => {
  try {
    const data = await mongoose.model(entity).find();
    if (!data.length) {
      throw new Error(`No existing data found for dependency: ${entity}`);
    }
    return data;
  } catch (error) {
    console.error(
      `❌ Error fetching existing data for ${entity}:`,
      error.message
    );
    throw error;
  }
};

// Function to seed a specific entity
const seedEntity = async (entity) => {
  const { count, seedFunction, dependencies } = seedConfig[entity];

  // Resolve dependencies using lowercase keys
  const dependencyData = {};
  if (dependencies) {
    for (const dep of dependencies) {
      const depKey = dep.toLowerCase(); // Convert to lowercase
      if (!seededData[depKey]) {
        console.log(
          `🔍 Dependency "${dep}" not found. Fetching existing data...`
        );
        seededData[depKey] = (await fetchExistingData(dep)).find().lean(); // Use original model name for query
      }
      dependencyData[depKey] = seededData[depKey];
    }
  }

  console.log(`🌱 Seeding ${entity}...`);
  const result = await seedFunction(count, dependencyData);
  seededData[entity.toLowerCase()] = result; // Store with lowercase key
  console.log(`✅ Seeded ${entity} successfully!`);
};

// Function to seed all entities
const seedAll = async () => {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
      mongoose.model("Permission").deleteMany(),
      mongoose.model("Role").deleteMany(),
      mongoose.model("User").deleteMany(),
      mongoose.model("Category").deleteMany(),
      mongoose.model("Subcategory").deleteMany(),
      mongoose.model("Brand").deleteMany(),
      mongoose.model("Tag").deleteMany(),
      mongoose.model("Unit").deleteMany(),
      mongoose.model("Tax").deleteMany(),
      mongoose.model("Discount").deleteMany(),
      mongoose.model("Inventory").deleteMany(), // Clear inventory data
      mongoose.model("Product").deleteMany(),
      mongoose.model("Variant").deleteMany(),
    ]);
    console.log("✅ Existing data cleared");

    // Seed entities in the order defined in the configuration
    for (const entity of Object.keys(seedConfig)) {
      await seedEntity(entity);
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
};

// Function to seed a specific entity
const seedSingleEntity = async (entity) => {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB");

    // Convert entity name to PascalCase
    const pascalCaseEntity = toPascalCase(entity);

    if (!seedConfig[pascalCaseEntity]) {
      throw new Error(
        `Invalid entity: ${entity}. Valid entities are: ${Object.keys(
          seedConfig
        ).join(", ")}`
      );
    }

    await seedEntity(pascalCaseEntity);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
};

// Parse command-line arguments
const entity = process.argv[2];

// Run the appropriate seeding function
if (entity === "all") {
  seedAll();
} else if (entity) {
  seedSingleEntity(entity);
} else {
  console.error("❌ No entity specified.");
  console.log(`Available entities: ${Object.keys(seedConfig).join(", ")}`);
  console.log("\nUsage: npm run seed <entity> or npm run seed all");
  process.exit(1);
}
