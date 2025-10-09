import { celebrate, Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна валідація для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Схема валідації для GET /notes (з пагінацією, фільтрацією, пошуком)
export const getAllNotesSchema = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(''),
  }),
});

// Схема валідації для параметра noteId
export const noteIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.invalid': 'Invalid note ID format',
      'any.required': 'Note ID is required',
    }),
  }),
});

// Схема валідації для POST /notes
export const createNoteSchema = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.min': 'Title must be at least 1 character long',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').default(''),
    tag: Joi.string()
      .valid(...TAGS)
      .default('Todo'),
  }),
});

// Схема валідації для PATCH /notes/:noteId
export const updateNoteSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.invalid': 'Invalid note ID format',
      'any.required': 'Note ID is required',
    }),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1), // Хоча б одне поле має бути передано
});
