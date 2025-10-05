import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    console.log('connectMongoDB: Starting...');

    const connectionString = process.env.MONGO_URL;

    if (!connectionString) {
      console.error('MONGO_URL is not defined');
      process.exit(1);
    }

    console.log('connectMongoDB: MONGO_URL found, length:', connectionString.length);
    console.log('connectMongoDB: Attempting connection...');

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('MongoDB connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    if (error.name === 'MongooseServerSelectionError') {
      console.error('💡 This usually means:');
      console.error('1. MongoDB Atlas Network Access not configured (add 0.0.0.0/0)');
      console.error('2. Wrong connection string');
      console.error('3. MongoDB cluster is paused or deleted');
    }

    process.exit(1);
  }
};
