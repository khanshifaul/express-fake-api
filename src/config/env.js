import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables first
config({ path: resolve(process.cwd(), '.env') });

const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
const validateEnv = () => {
  const required = ['MONGO_URI'];
  const missing = required.filter(field => !env[field]);
  
  if (missing.length) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.log(`- ${v}`));
    process.exit(1);
  }
};

validateEnv();

export default env;