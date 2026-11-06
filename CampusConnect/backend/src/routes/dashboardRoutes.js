import express from 'express';
import {
  getAdminDashboardStats,
  getStudentDashboardStats,
} from '../controllers/dashboardController.js';
import { protect, adminOnly, studentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/admin', adminOnly, getAdminDashboardStats);
router.get('/student', studentOnly, getStudentDashboardStats);

export default router;
