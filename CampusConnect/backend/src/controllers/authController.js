import {
  findUserByEmail,
  findUserById,
  createUser,
  createStudent,
  updateUser,
  updateStudent,
  findStudentByRoll,
  findStudentByUserId,
} from '../services/dataService.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new student account
// @route   POST /api/auth/register
// @access  Public
export const registerStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      department,
      semester,
      phone,
      gender,
      dateOfBirth,
      address,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email address already exists',
      });
    }

    // Check if roll number already exists
    const generatedRoll = rollNumber ? rollNumber.trim().toUpperCase() : `CC${Date.now().toString().slice(-6)}`;
    const rollExists = await findStudentByRoll(generatedRoll);
    if (rollExists) {
      return res.status(400).json({
        success: false,
        message: 'A student with this Roll Number is already registered',
      });
    }

    // 1. Create User
    const user = await createUser({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
    });

    // 2. Create Student Profile
    const student = await createStudent({
      user: user._id,
      rollNumber: generatedRoll,
      name,
      email: email.toLowerCase(),
      department: department || 'Computer Science & Engineering',
      semester: Number(semester) || 1,
      phone: phone || '',
      gender: gender || 'Male',
      dateOfBirth: dateOfBirth || null,
      address: address || '',
      status: 'Active',
    });

    // 3. Link student profile to user
    await updateUser(user._id, { studentProfile: student._id });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CampusConnect.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        studentProfile: student,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate User (Admin or Student) & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await findUserByEmail(email, true);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // If student, attach studentProfile
    let studentProfile = user.studentProfile;
    if (user.role === 'student' && (!studentProfile || !studentProfile.rollNumber)) {
      studentProfile = await findStudentByUserId(user._id);
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        studentProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let studentProfile = user.studentProfile;
    if (user.role === 'student' && (!studentProfile || !studentProfile.rollNumber)) {
      studentProfile = await findStudentByUserId(user._id);
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        studentProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, phone, address, gender, dateOfBirth } = req.body;

    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (avatar) userUpdates.avatar = avatar;

    await updateUser(req.user._id, userUpdates);

    let studentProfile = null;
    if (req.user.role === 'student') {
      const student = await findStudentByUserId(req.user._id);
      if (student) {
        const studentUpdates = {};
        if (name) studentUpdates.name = name;
        if (phone !== undefined) studentUpdates.phone = phone;
        if (address !== undefined) studentUpdates.address = address;
        if (gender) studentUpdates.gender = gender;
        if (dateOfBirth) studentUpdates.dateOfBirth = dateOfBirth;
        if (avatar) studentUpdates.avatar = avatar;

        studentProfile = await updateStudent(student._id, studentUpdates);
      }
    }

    const updatedUser = await findUserById(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        ...updatedUser,
        studentProfile: studentProfile || updatedUser.studentProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await findUserByEmail(req.user.email, true);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match our records',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(req.user._id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully!',
    });
  } catch (error) {
    next(error);
  }
};
