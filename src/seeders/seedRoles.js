import Permission from "../models/Permission.js";
import Role from "../models/Role.js";

export const seedRoles = async () => {
  try {
    console.log("🌱 Seeding roles...");

    // Fetch all permissions
    const permissions = await Permission.find();

    // Define roles and their associated permissions
    const roles = [
      {
        name: "user",
        description: "Regular user with basic permissions",
        permissions: permissions
          .filter(p => p.module === "users") // Assign permissions for the 'users' module
          .map(p => p._id),
      },
      {
        name: "admin",
        description: "Administrator with full permissions",
        permissions: permissions.map(p => p._id), // Assign all permissions
      },
      {
        name: "moderator",
        description: "Moderator with limited permissions",
        permissions: permissions
          .filter(p => p.module === "products" || p.module === "categories") // Assign permissions for 'products' and 'categories'
          .map(p => p._id),
      },
    ];

    // Insert roles
    const createdRoles = await Role.insertMany(roles);
    console.log("✅ Seeded roles:", createdRoles.map(role => role.name));

    return createdRoles;
  } catch (error) {
    console.error("❌ Error seeding roles:", error.message);
    throw error;
  }
};