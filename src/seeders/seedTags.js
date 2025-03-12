import Tag from '../models/Tags.js';
import { generateTag } from '../utils/fakerGenerators.js';
import { handleInsertMany } from './seedUtils.js';

export const seedTags = async (count) => {
  console.log(`🌱 Seeding ${count} tags...`);
  const tags = await handleInsertMany(Tag, Array.from({ length: count }, generateTag));
  console.log(`✅ Seeded ${tags.length} tags`);
  return tags;
};