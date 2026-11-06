import mongoose from 'mongoose';

export let isConnectedToMongo = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('localhost')) {
    console.log('[MongoDB] Notice: Valid MongoDB Atlas URI not detected in .env.');
    console.log('[MongoDB] Running in high-performance In-Memory Database mode for instant evaluation.');
    console.log('[MongoDB] To connect to your MongoDB Atlas cluster: update MONGO_URI in backend/.env');
    isConnectedToMongo = false;
    return false;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedToMongo = true;
    console.log(`[MongoDB Atlas] Successfully connected to host: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`[MongoDB Atlas] Connection failed (${err.message}).`);
    console.log('[MongoDB] Switching to built-in In-Memory Database store so all portal features continue seamlessly.');
    isConnectedToMongo = false;
    return false;
  }
};

export const closeDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  } catch (err) {
    console.error(`[MongoDB] Error closing connection: ${err.message}`);
  }
};

export default connectDB;
