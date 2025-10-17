import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    // Перевіряємо наявність access token в кукі
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(createHttpError(401, 'Missing access token'));
    }

    // Шукаємо сесію за access token
    const session = await Session.findOne({ accessToken });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    // Перевіряємо чи не прострочений access token
    if (new Date() > session.accessTokenValidUntil) {
      return next(createHttpError(401, 'Access token expired'));
    }

    // Шукаємо користувача за session.userId
    const user = await User.findById(session.userId);

    if (!user) {
      return next(createHttpError(401));
    }

    // Додаємо користувача в req.user
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
