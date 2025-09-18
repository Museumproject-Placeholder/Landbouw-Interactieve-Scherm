import express from 'express';
import { body } from 'express-validator';
import { contentController } from '../controllers/contentController.js';

const router = express.Router();

// Validation rules
const contentValidation = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('era').notEmpty().trim().withMessage('Era is required'),
  body('dateRange').notEmpty().trim().withMessage('Date range is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('subtitle').optional().trim(),
  body('timelineId').optional().isNumeric().withMessage('Timeline ID must be a number'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('blocks').optional().isArray().withMessage('Blocks must be an array'),
  body('gallery').optional().isArray().withMessage('Gallery must be an array'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
];

// Routes
router.get('/', contentController.getAll);
router.get('/search', contentController.search);
router.get('/featured', contentController.getFeatured);
router.get('/stats', contentController.getStats);
router.get('/era/:era', contentController.getByEra);
router.get('/:id', contentController.getById);

router.post('/', contentValidation, contentController.create);
router.put('/:id', contentValidation, contentController.update);
router.delete('/:id', contentController.delete);

router.post('/bulk-delete', contentController.bulkDelete);

export default router;