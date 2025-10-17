import jwt from 'jsonwebtoken';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export const createSession = async (userId) => {
  // Генерація токенів
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret-key',
    {
      expiresIn: '15m',
    },
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    {
      expiresIn: '1d',
    },
  );

  // Час закінчення токенів
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  // Створення сесії в базі
  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  // Access token (15 хвилин)
  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  // Refresh token (1 день)
  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  // Session ID (1 день)
  res.cookie('sessionId', session._id.toString(), {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
};
