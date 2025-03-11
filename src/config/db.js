import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Force IPv4
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📁 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('- Verify MongoDB service is running');
    console.log('- Check .env file exists in project root');
    console.log(`- Current connection URI: ${env.MONGO_URI || 'undefined'}`);
    process.exit(1);
  }
};

export default connectDB;