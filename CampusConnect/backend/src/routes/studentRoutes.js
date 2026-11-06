import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDepartments,
} from '../controllers/studentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All student routes require authentication

router.get('/departments', getDepartments);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);

// Admin-only actions
router.post('/', adminOnly, createStudent);
router.put('/:id', adminOnly, updateStudent);
router.delete('/:id', adminOnly, deleteStudent);

export default router;
