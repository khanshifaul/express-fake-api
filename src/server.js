import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(env.PORT, () => {
      console.log('\n🚀 Server startup information:');
      console.log(`⏱  Environment: ${env.NODE_ENV}`);
      console.log(`🌐 HTTP server: http://localhost:${env.PORT}`);
      console.log(`📅 ${new Date().toISOString()}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n🔻 Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await mongoose.disconnect();
        console.log('🔌 All connections closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('\n❌ Critical startup failure:');
    console.error(error);
    process.exit(1);
  }
};

startServer();