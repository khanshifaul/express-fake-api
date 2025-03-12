export const handleInsertMany = async (model, data, batchSize = 100) => {
  try {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      batches.push(await model.insertMany(batch, { ordered: false }));
    }
    return batches.flat();
  } catch (error) {
    if (error.code === 11000) {
      console.warn(`⚠️  Duplicates detected in ${model.modelName}, inserted ${error.result?.insertedCount || 0} items`);
      console.warn("Duplicate keys:", error.keyValue); // Log duplicate keys
      return error.result || [];
    }
    console.error("❌ Error in handleInsertMany:", error.message); // Log other errors
    throw error;
  }
};
  
  export const verifyReferences = (collections) => {
    const missing = Object.entries(collections)
      .filter(([_, arr]) => !arr?.length)
      .map(([name]) => name);
  
    if (missing.length) {
      throw new Error(`Missing required collections: ${missing.join(', ')}`);
    }
  };