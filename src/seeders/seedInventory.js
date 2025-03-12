import { faker } from '@faker-js/faker';
import Inventory from '../models/Inventory.js';
import { handleInsertMany } from './seedUtils.js';

// Define the generateInventory function
const generateInventory = () => {
  const type = faker.helpers.arrayElement(['warehouse', 'branch']); // Randomly assign type
  return {
    name: faker.company.name(), // Generate a random name
    type,
    location: faker.location.city(), // Generate a random location
    contact: type === 'branch' ? faker.phone.number() : undefined, // Add contact only for branches
    capacity: type === 'warehouse' ? faker.number.int({ min: 100, max: 1000 }) : undefined, // Add capacity only for warehouses
    isActive: faker.datatype.boolean(), // Randomly set isActive
  };
};

export const seedInventory = async (count) => {
  try {
    console.log(`🌱 Seeding ${count} inventory items...`);

    // Generate inventory items
    const inventory = await handleInsertMany(
      Inventory,
      Array.from({ length: count }, generateInventory)
    );

    console.log(`✅ Seeded ${inventory.length} inventory items`);
    return inventory;
  } catch (error) {
    console.error('❌ Error seeding inventory:', error.message);
    throw error;
  }
};