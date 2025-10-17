import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  const app = express();

  // Підключення до MongoDB перед запуском сервера
  await connectMongoDB();

  // Middleware
  app.use(logger);
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Роути
  app.use(authRoutes);
  app.use(notesRoutes);

  // Обробка неіснуючих маршрутів (404)
  app.use('*', notFoundHandler);

  // Middleware для обробки помилок валідації від celebrate
  app.use(errors());

  // Глобальна обробка помилок
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
