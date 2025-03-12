import { faker } from "@faker-js/faker";
import Product from "../models/Product.js";
import { handleInsertMany } from "./seedUtils.js";

// Function to generate a product
const generateProduct = (
  categoryId,
  subcategoryId,
  brandId,
  tagIds,
  unitId,
  taxId,
  discountId,
  inventoryIds
) => {
  const hasVariant = faker.datatype.boolean(); // Randomly decide if the product has variants

  const purchasePrice = faker.number.float({
    min: 10,
    max: 100,
    precision: 0.01,
  });
  const profitMargin = faker.number.float({ min: 5, max: 50, precision: 0.01 });
  const salesPrice = purchasePrice + purchasePrice * (profitMargin / 100);
  const mrp =
    salesPrice + faker.number.float({ min: 5, max: 20, precision: 0.01 });

  const product = {
    name: faker.commerce.productName(),
    image: faker.image.url(),
    sku: faker.string.alphanumeric(10).toUpperCase(), // Generate a unique SKU
    category: categoryId,
    subcategory: subcategoryId,
    brand: brandId,
    purchasePrice,
    profitMargin,
    salesPrice,
    mrp,
    hasVariant,
    unit: unitId,
    inventory: inventoryIds.map((inventoryId) => ({
      inventoryId,
      stock: faker.number.int({ min: 0, max: 100 }), // Random stock for each inventory
    })),
    totalStock: inventoryIds.reduce(
      (sum) => sum + faker.number.int({ min: 0, max: 100 }),
      0
    ), // Sum of all inventory stocks
    alertQuantity: faker.number.int({ min: 0, max: 100 }),
    tax: taxId,
    discount: discountId,
    status: faker.helpers.arrayElement(["Active", "Inactive"]),
    tags: tagIds,
  };

  return product;
};

export const seedProducts = async (count, dependencyData) => {
  try {
    // Destructure and validate dependencies
    const {
      categories,
      subcategories,
      brands,
      tags,
      units,
      taxes,
      discounts,
      inventory,
    } = dependencyData;

    // Enhanced dependency validation
    const validateDependency = (name, data) => {
      if (!data || data.length === 0) {
        console.error(`❌ Missing or empty dependency: ${name}`);
        return false;
      }
      return true;
    };

    const dependenciesValid = [
      validateDependency("categories", categories),
      validateDependency("subcategories", subcategories),
      validateDependency("brands", brands),
      validateDependency("tags", tags),
      validateDependency("units", units),
      validateDependency("taxes", taxes),
      validateDependency("discounts", discounts),
      validateDependency("inventory", inventory),
    ].every(Boolean);

    if (!dependenciesValid) {
      throw new Error("Missing or invalid dependencies for seeding products.");
    }

    console.log(`🌱 Seeding ${count} products...`);

    // Generate products with proper error handling
    const products = await handleInsertMany(
      Product,
      Array.from({ length: count }, () => {
        try {
          const category = faker.helpers.arrayElement(categories);
          const validSubcategories = subcategories.filter(
            (sc) => sc.category.toString() === category._id.toString()
          );

          if (validSubcategories.length === 0) {
            throw new Error(
              `No subcategories found for category ${category._id}`
            );
          }

          const subcategory = faker.helpers.arrayElement(validSubcategories);

          return {
            name: faker.commerce.productName(),
            image: faker.image.url(),
            sku: faker.string.alphanumeric(10).toUpperCase(),
            category: category._id,
            subcategory: subcategory._id,
            brand: faker.helpers.arrayElement(brands)._id,
            // ... rest of the product fields
          };
        } catch (error) {
          console.error("❌ Error generating product:", error.message);
          throw error;
        }
      })
    );

    console.log(`✅ Seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
    throw error;
  }
};
