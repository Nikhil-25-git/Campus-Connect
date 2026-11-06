import {
  bulkUpsertAttendance,
  getAttendanceByDate as fetchAttendanceByDate,
  getStudentAttendanceHistory,
  getAttendanceDatesList,
  findStudentByUserId,
} from '../services/dataService.js';

// @desc    Mark attendance for multiple students for a specific date (Bulk upsert)
// @route   POST /api/attendance/bulk
// @access  Private (Admin only)
export const markAttendanceBulk = async (req, res, next) => {
  try {
    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid date (YYYY-MM-DD) and an array of records',
      });
    }

    await bulkUpsertAttendance(date, records, req.user._id);

    res.status(200).json({
      success: true,
      message: `Successfully saved attendance for ${records.length} students on ${date}.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance sheet for a specific date with all students
// @route   GET /api/attendance/by-date
// @access  Private (Admin only)
export const getAttendanceByDate = async (req, res, next) => {
  try {
    const { date, department } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "date" (YYYY-MM-DD) is required',
      });
    }

    const result = await fetchAttendanceByDate(date, department);

    res.status(200).json({
      success: true,
      date: result.date,
      totalStudents: result.totalStudents,
      markedCount: result.markedCount,
      presentCount: result.presentCount,
      absentCount: result.absentCount,
      attendanceSheet: result.sheet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for a specific student
// @route   GET /api/attendance/student/:studentId
// @access  Private (Admin or Student viewing own)
export const getStudentAttendance = async (req, res, next) => {
  try {
    let studentId = req.params.studentId;

    if (studentId === 'me') {
      if (req.user.role !== 'student') {
        return res.status(400).json({
          success: false,
          message: 'Only student accounts can access /me attendance directly.',
        });
      }

      const student = await findStudentByUserId(req.user._id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found for this user',
        });
      }
      studentId = student._id;
    }

    const { month, year } = req.query;
    const history = await getStudentAttendanceHistory(studentId, month, year);

    res.status(200).json({
      success: true,
      summary: history.summary,
      records: history.records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get high-level attendance history dates list
// @route   GET /api/attendance/dates
// @access  Private (Admin only)
export const getAttendanceDates = async (req, res, next) => {
  try {
    const dates = await getAttendanceDatesList();

    res.status(200).json({
      success: true,
      dates,
    });
  } catch (error) {
    next(error);
  }
};
