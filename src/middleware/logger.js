import pinoHttp from 'pino-http';

export const logger = pinoHttp({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
