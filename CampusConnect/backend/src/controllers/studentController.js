import {
  getStudentsList,
  getStudentById as fetchStudentById,
  createStudent as addStudent,
  updateStudent as editStudent,
  deleteStudent as removeStudent,
  findStudentByRoll,
  findStudentByEmail,
  createUser,
  updateUser,
  getDepartmentStats,
} from '../services/dataService.js';

// @desc    Get all students with search & filter
// @route   GET /api/students
// @access  Private (Admin or authorized)
export const getAllStudents = async (req, res, next) => {
  try {
    const { search, department, semester, status, page = 1, limit = 50 } = req.query;

    const result = await getStudentsList({
      search,
      department,
      semester,
      status,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      count: result.students.length,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      students: result.students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res, next) => {
  try {
    const data = await fetchStudentById(req.params.id);

    if (!data || !data.student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      student: data.student,
      attendanceStats: data.attendanceStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student (Admin)
// @route   POST /api/students
// @access  Private (Admin only)
export const createStudent = async (req, res, next) => {
  try {
    const {
      rollNumber,
      name,
      email,
      department,
      semester,
      phone,
      gender,
      dateOfBirth,
      address,
      status,
      password,
    } = req.body;

    if (!rollNumber || !name || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, roll number, email, and department are required',
      });
    }

    const rollExists = await findStudentByRoll(rollNumber);
    if (rollExists) {
      return res.status(400).json({
        success: false,
        message: `Roll number '${rollNumber.trim().toUpperCase()}' is already assigned.`,
      });
    }

    const emailExists = await findStudentByEmail(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: `Email '${email.toLowerCase()}' is already in use by another student.`,
      });
    }

    // Create user login account for the student
    const studentPassword = password || 'Student@12345';
    const user = await createUser({
      name,
      email: email.toLowerCase(),
      password: studentPassword,
      role: 'student',
    });

    const student = await addStudent({
      user: user._id,
      rollNumber: rollNumber.trim().toUpperCase(),
      name,
      email: email.toLowerCase(),
      department,
      semester: Number(semester) || 1,
      phone: phone || '',
      gender: gender || 'Male',
      dateOfBirth: dateOfBirth || null,
      address: address || '',
      status: status || 'Active',
    });

    await updateUser(user._id, { studentProfile: student._id });

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student record
// @route   PUT /api/students/:id
// @access  Private (Admin only)
export const updateStudent = async (req, res, next) => {
  try {
    const data = await fetchStudentById(req.params.id);
    if (!data || !data.student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const student = data.student;
    const {
      name,
      email,
      rollNumber,
      department,
      semester,
      phone,
      gender,
      dateOfBirth,
      address,
      status,
    } = req.body;

    if (rollNumber && rollNumber.trim().toUpperCase() !== student.rollNumber) {
      const exists = await findStudentByRoll(rollNumber);
      if (exists && exists._id.toString() !== student._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Another student already has this roll number',
        });
      }
    }

    if (email && email.toLowerCase() !== student.email) {
      const exists = await findStudentByEmail(email);
      if (exists && exists._id.toString() !== student._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Another student already has this email address',
        });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (rollNumber) updates.rollNumber = rollNumber.trim().toUpperCase();
    if (department) updates.department = department;
    if (semester !== undefined) updates.semester = Number(semester);
    if (phone !== undefined) updates.phone = phone;
    if (gender) updates.gender = gender;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (address !== undefined) updates.address = address;
    if (status) updates.status = status;

    const updated = await editStudent(req.params.id, updates);

    // Also update associated user account if exists
    if (student.user) {
      const userUpdates = {};
      if (name) userUpdates.name = name;
      if (email) userUpdates.email = email.toLowerCase();
      await updateUser(student.user, userUpdates);
    }

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      student: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record & related data
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
export const deleteStudent = async (req, res, next) => {
  try {
    const success = await removeStudent(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student and related records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get departments list and statistics
// @route   GET /api/students/departments
// @access  Private
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await getDepartmentStats();

    res.status(200).json({
      success: true,
      departments,
    });
  } catch (error) {
    next(error);
  }
};
