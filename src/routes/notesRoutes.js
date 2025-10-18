import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  validateGetAllNotes,
  validateNoteId,
  validateCreateNote,
  validateUpdateNote,
} from '../validations/notesValidation.js';

const router = Router();

router.use(authenticate);

router.get('/notes', validateGetAllNotes, getAllNotes);
router.get('/notes/:noteId', validateNoteId, getNoteById);
router.post('/notes', validateCreateNote, createNote);
router.patch('/notes/:noteId', validateUpdateNote, updateNote);
router.delete('/notes/:noteId', validateNoteId, deleteNote);

export default router;
