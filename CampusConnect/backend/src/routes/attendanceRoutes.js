import express from 'express';
import {
  markAttendanceBulk,
  getAttendanceByDate,
  getStudentAttendance,
  getAttendanceDates,
} from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protected routes

// Student-specific attendance records
router.get('/student/:studentId', getStudentAttendance);

// Admin-specific attendance routes
router.get('/by-date', adminOnly, getAttendanceByDate);
router.get('/dates', adminOnly, getAttendanceDates);
router.post('/bulk', adminOnly, markAttendanceBulk);

export default router;
