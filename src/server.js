console.log('=== SERVER STARTING ===');
console.log('Step 1: Loading dotenv...');

import 'dotenv/config';

console.log('Step 2: Dotenv loaded');
console.log('Step 3: PORT =', process.env.PORT);
console.log('Step 4: MONGO_URL exists =', !!process.env.MONGO_URL);
console.log('Step 5: MONGO_URL length =', process.env.MONGO_URL?.length);

import express from 'express';
import cors from 'cors';

console.log('Step 6: Express imported');

import { connectMongoDB } from './db/connectMongoDB.js';

console.log('Step 7: connectMongoDB imported');

import notesRoutes from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

console.log('Step 8: All modules imported');

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  try {
    console.log('Step 9: Creating Express app...');
    const app = express();

    console.log('Step 10: Connecting to MongoDB...');
    console.log('MONGO_URL preview:', process.env.MONGO_URL?.substring(0, 50) + '...');

    await connectMongoDB();

    console.log('Step 11: MongoDB connected successfully!');

    app.use(logger);
    app.use(cors());
    app.use(express.json());

    app.use(notesRoutes);
    app.use('*', notFoundHandler);
    app.use(errorHandler);

    console.log('Step 12: Starting HTTP server...');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('FATAL ERROR in startServer');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

console.log('Step 13: Calling startServer()...');

startServer().catch((error) => {
  console.error('UNCAUGHT ERROR');
  console.error(error);
  process.exit(1);
});

console.log('Step 14: startServer() called');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
