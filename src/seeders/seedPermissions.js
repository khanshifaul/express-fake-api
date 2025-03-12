import Permission from "../models/Permission.js";

// Define modules and their descriptions
const modules = [
  { module: "users", description: "Permissions for user management" },
  { module: "products", description: "Permissions for product management" },
  { module: "categories", description: "Permissions for category management" },
  { module: "orders", description: "Permissions for order management" },
];

export const seedPermissions = async () => {
  try {
    console.log("🌱 Seeding permissions...");

    // Insert permissions for each module
    const createdPermissions = await Permission.insertMany(modules);
    console.log("✅ Seeded permissions:", createdPermissions.map(p => p.module));

    return createdPermissions;
  } catch (error) {
    console.error("❌ Error seeding permissions:", error.message);
    throw error;
  }
};