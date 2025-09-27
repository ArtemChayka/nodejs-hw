import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// Middleware для логирования
const logger = pinoHttp({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Подключение middleware
app.use(logger);
app.use(cors());
app.use(express.json());

// Маршруты для работы с заметками

// GET /notes - получить все заметки
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// GET /notes/:noteId - получить заметку по ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Тестовый маршрут для имитации ошибки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware для обработки несуществующих маршрутов (404)
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
