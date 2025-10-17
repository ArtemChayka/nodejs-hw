import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const userId = req.user._id;

    // Побудова запиту через ланцюжок методів Mongoose
    let notesQuery = Note.find({ userId });
    let countQuery = Note.find({ userId });

    // Додаємо фільтр по тегу якщо він є
    if (tag) {
      notesQuery = notesQuery.where('tag').equals(tag);
      countQuery = countQuery.where('tag').equals(tag);
    }

    // Додаємо текстовий пошук якщо він є
    if (search) {
      notesQuery = notesQuery.where({ $text: { $search: search } });
      countQuery = countQuery.where({ $text: { $search: search } });
    }

    // Додаємо пагінацію до запиту нотаток
    notesQuery = notesQuery.skip((page - 1) * perPage).limit(perPage);

    // Паралельне виконання запитів через Promise.all
    const [notes, totalNotes] = await Promise.all([
      notesQuery.exec(),
      countQuery.countDocuments(),
    ]);

    // Підрахунок загальної кількості сторінок
    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const note = await Note.create({
      ...req.body,
      userId,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      {
        new: true,
      },
    );

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
