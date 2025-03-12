import { faker } from "@faker-js/faker"; // Import faker for generating fake data
import Role from "../models/Role.js";
import User from "../models/User.js";
import { handleInsertMany } from "./seedUtils.js";

// Define the generateUser function
const generateUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: "Password@123", // Use a default password for consistency
    isActive: faker.datatype.boolean(),
    lastLogin: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

export const seedUsers = async (count, dependencyData) => {
  try {
    // Fetch the default role (e.g., 'user')
    const defaultRole = await Role.findOne({ name: "user" });
    if (!defaultRole) throw new Error("Default role not found");

    console.log(`🌱 Seeding ${count} users...`);

    // Generate users with the default role
    const users = await handleInsertMany(
      User,
      Array.from({ length: count }, () => ({
        ...generateUser(),
        role: defaultRole._id, // Assign the default role
      }))
    );

    console.log(`✅ Seeded ${users.length} users`);
    return users;
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    throw error;
  }
};