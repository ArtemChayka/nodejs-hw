import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо чи користувач з таким email уже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, 'Email in use'));
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Створюємо сесію
    const session = await createSession(user._id);

    // Додаємо кукі
    setSessionCookies(res, session);

    // Повертаємо користувача без пароля
    res.status(201).json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Шукаємо користувача за email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    // Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    // Видаляємо старі сесії цього користувача
    await Session.deleteMany({ userId: user._id });

    // Створюємо нову сесію
    const session = await createSession(user._id);

    // Додаємо кукі
    setSessionCookies(res, session);

    // Повертаємо користувача без пароля
    res.status(200).json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    // Шукаємо сесію за ID та refresh token
    const session = await Session.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    // Перевіряємо чи не прострочений refresh token
    if (new Date() > session.refreshTokenValidUntil) {
      return next(createHttpError(401, 'Session token expired'));
    }

    // Видаляємо стару сесію
    await Session.deleteOne({ _id: sessionId });

    // Створюємо нову сесію
    const newSession = await createSession(session.userId);

    // Додаємо нові кукі
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    // Видаляємо сесію якщо вона існує
    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    // Очищуємо кукі
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
