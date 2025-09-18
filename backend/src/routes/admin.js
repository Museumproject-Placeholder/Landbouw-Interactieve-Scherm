import express from 'express';
import { adminController } from '../controllers/adminController.js';

const router = express.Router();

// Middleware to add request start time for health checks
const addRequestTime = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

// Routes
router.get('/stats', adminController.getStats);
router.get('/health', addRequestTime, adminController.getHealth);
router.get('/content-overview', adminController.getContentOverview);
router.get('/timeline-overview', adminController.getTimelineOverview);
router.get('/activity-logs', adminController.getActivityLogs);
router.get('/export', adminController.exportData);

export default router;