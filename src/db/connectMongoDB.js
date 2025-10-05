import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const connectionString = process.env.MONGO_URL;

    if (!connectionString) {
      console.error('MONGO_URL is not defined in environment variables');
      process.exit(1);
    }

    await mongoose.connect(connectionString);

    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('Error while setting up mongo connection:', error);
    process.exit(1);
  }
};
