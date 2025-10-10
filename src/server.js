import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  const app = express();

  await connectMongoDB();

  app.use(logger);
  app.use(cors());
  app.use(express.json());

  app.use(notesRoutes);

  app.use('*', notFoundHandler);

  app.use(errors());

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
