import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

// Helper function to generate a unique slug
const generateUniqueSlug = (base) => {
  return `${faker.helpers.slugify(base)}-${faker.string.alphanumeric(4)}`;
};

// Generate a user object
export const generateUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: bcrypt.hashSync("Password123!", 10),
  role: faker.helpers.arrayElement(["user", "admin"]),
  createdAt: faker.date.past(),
});

// Generate a category object
export const generateCategory = () => ({
  name: faker.commerce.department(),
  description: faker.lorem.sentence(),
});

// Generate a subcategory object
export const generateSubcategory = (categoryId) => ({
  name: faker.commerce.productAdjective(),
  category: categoryId,
  description: faker.lorem.sentence(),
});

// Generate a brand object
export const generateBrand = () => ({
  name: faker.company.name(),
  logo: faker.image.urlLoremFlickr({ category: "business" }),
  description: faker.lorem.paragraph(),
  website: faker.internet.url(),
});

// Generate a tag object
export const generateTag = () => ({
  name: faker.commerce.productAdjective(),
  slug: generateUniqueSlug(faker.commerce.productMaterial()),
  description: faker.lorem.sentence(),
});

// Generate a product object
export const generateProduct = (categories, subcategories, brands, tags) => {
  // Validate required references
  const missing = [];
  if (!categories?.length) missing.push("categories");
  if (!subcategories?.length) missing.push("subcategories");
  if (!brands?.length) missing.push("brands");
  if (!tags?.length) missing.push("tags");

  if (missing.length) {
    throw new Error(`Missing required references: ${missing.join(", ")}`);
  }

  // Generate product data
  return {
    name: faker.commerce.productName(),
    image: faker.image.urlLoremFlickr({ category: "product" }),
    itemCode: `ITEM-${faker.string.alphanumeric(10)}-${Date.now()}`.toUpperCase(),
    itemName: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories)._id,
    subcategory: faker.helpers.arrayElement(subcategories)._id,
    brand: faker.helpers.arrayElement(brands)._id,
    variants: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      sku: `SKU-${faker.string.alphanumeric(10)}-${Date.now()}`.toUpperCase(),
      size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
      color: faker.color.human(),
      price: faker.commerce.price({ min: 10, max: 200, dec: 2 }),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: Array.from({ length: 3 }, () =>
        faker.image.urlLoremFlickr({ category: "product" })
      ),
    })),
    unit: faker.helpers.arrayElement(["pcs", "kg", "box", "litre"]),
    stock: faker.number.int({ min: 0, max: 1000 }),
    alertQuantity: faker.number.int({ min: 10, max: 50 }),
    salesPrice: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
    tax: `${faker.number.int({ min: 5, max: 20 })}%`,
    status: faker.helpers.arrayElement(["Active", "Inactive"]),
    tags: faker.helpers.arrayElements(tags, 3).map((t) => t._id),
    createdAt: faker.date.past(),
  };
};