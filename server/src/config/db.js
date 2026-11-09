const mongoose = require('mongoose');

const connectDB = async (retries = 3, delayMs = 3000) => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aspirantai';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[MongoDB] Connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        if (process.env.NODE_ENV === 'production') {
          console.error('[MongoDB] Critical: All Atlas connection retries failed. Shutting down.');
          process.exit(1);
        }
      } else {
        console.log(`[MongoDB] Retrying in ${delayMs / 1000}s...`);
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }
};

module.exports = connectDB;
