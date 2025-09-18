import express from 'express';
import { body } from 'express-validator';
import { timelineController } from '../controllers/timelineController.js';

const router = express.Router();

// Validation rules
const timelineValidation = [
  body('era').notEmpty().trim().withMessage('Era is required'),
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('dateRange').notEmpty().trim().withMessage('Date range is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('order').optional().isNumeric().withMessage('Order must be a number'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
];

// Routes
router.get('/', timelineController.getAll);
router.get('/search', timelineController.search);
router.get('/era/:era', timelineController.getByEra);
router.get('/:id', timelineController.getById);

router.post('/', timelineValidation, timelineController.create);
router.put('/:id', timelineValidation, timelineController.update);
router.delete('/:id', timelineController.delete);

router.patch('/order', timelineController.updateOrder);

export default router;