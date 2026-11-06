import {
  getAdminStats,
  getStudentStats,
  findStudentByUserId,
} from '../services/dataService.js';

// @desc    Get Admin Dashboard Overview Stats & Chart Data
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const data = await getAdminStats();

    res.status(200).json({
      success: true,
      stats: data.stats,
      departmentDistribution: data.departmentDistribution,
      attendanceTrend: data.attendanceTrend,
      recentStudents: data.recentStudents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Dashboard Stats
// @route   GET /api/dashboard/student
// @access  Private (Student only)
export const getStudentDashboardStats = async (req, res, next) => {
  try {
    const student = await findStudentByUserId(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found for this account',
      });
    }

    const data = await getStudentStats(student._id);

    res.status(200).json({
      success: true,
      student: data.student,
      attendance: data.attendance,
    });
  } catch (error) {
    next(error);
  }
};
