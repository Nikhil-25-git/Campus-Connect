import bcrypt from 'bcryptjs';
import { isConnectedToMongo } from '../config/db.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

// In-Memory storage collections when MongoDB Atlas is not yet connected
let memoryUsers = [];
let memoryStudents = [];
let memoryAttendance = [];
let idCounter = 1000;

const generateId = () => {
  idCounter += 1;
  return `66${idCounter.toString().padStart(22, '0')}`;
};

// Initial sample data definition
const initialStudentsSeed = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'CS2023001',
    department: 'Computer Science & Engineering',
    semester: 6,
    phone: '+91 98765 43210',
    gender: 'Male',
    dateOfBirth: '2003-05-14',
    address: 'B-12, Green Park Avenue, New Delhi',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'EC2023002',
    department: 'Electronics & Communication',
    semester: 6,
    phone: '+91 98765 43211',
    gender: 'Female',
    dateOfBirth: '2003-08-22',
    address: '45, Sunshine Heights, Ahmedabad, Gujarat',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Aman Verma',
    email: 'aman.verma@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'ME2023003',
    department: 'Mechanical Engineering',
    semester: 4,
    phone: '+91 98765 43212',
    gender: 'Male',
    dateOfBirth: '2004-01-10',
    address: 'Sector 14, Huda Colony, Gurgaon, Haryana',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'IT2023004',
    department: 'Information Technology',
    semester: 4,
    phone: '+91 98765 43213',
    gender: 'Female',
    dateOfBirth: '2004-03-30',
    address: 'Flat 302, Palm Grove, Pune, Maharashtra',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
  },
  {
    name: 'Arjun Das',
    email: 'arjun.das@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'CE2023005',
    department: 'Civil Engineering',
    semester: 6,
    phone: '+91 98765 43214',
    gender: 'Male',
    dateOfBirth: '2003-11-18',
    address: 'Lake View Residency, Kolkata, West Bengal',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'CS2023006',
    department: 'Computer Science & Engineering',
    semester: 4,
    phone: '+91 98765 43215',
    gender: 'Female',
    dateOfBirth: '2004-07-25',
    address: '24, Temple Bells Street, Chennai, Tamil Nadu',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'EE2023007',
    department: 'Electrical Engineering',
    semester: 6,
    phone: '+91 98765 43216',
    gender: 'Male',
    dateOfBirth: '2003-09-05',
    address: '104, Marina Bay, Mumbai, Maharashtra',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  },
  {
    name: 'Kavya Nair',
    email: 'kavya.nair@campusconnect.edu',
    password: 'Student@12345',
    rollNumber: 'IT2023008',
    department: 'Information Technology',
    semester: 2,
    phone: '+91 98765 43217',
    gender: 'Female',
    dateOfBirth: '2005-02-14',
    address: 'C-7, Hill View Estate, Bengaluru, Karnataka',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
];

// Seed in-memory database
export const initMemoryDatabase = async () => {
  if (memoryUsers.length > 0) return;

  const salt = await bcrypt.genSalt(10);

  // 1. Admin
  const adminHashedPassword = await bcrypt.hash('Admin@12345', salt);
  const adminId = generateId();
  const adminUser = {
    _id: adminId,
    name: 'System Administrator',
    email: 'admin@campusconnect.edu',
    password: adminHashedPassword,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: new Date().toISOString(),
  };
  memoryUsers.push(adminUser);

  // 2. Students
  for (const st of initialStudentsSeed) {
    const studentHashedPassword = await bcrypt.hash(st.password, salt);
    const uId = generateId();
    const sId = generateId();

    const u = {
      _id: uId,
      name: st.name,
      email: st.email.toLowerCase(),
      password: studentHashedPassword,
      role: 'student',
      studentProfile: sId,
      avatar: st.avatar,
      createdAt: new Date().toISOString(),
    };

    const s = {
      _id: sId,
      user: uId,
      rollNumber: st.rollNumber,
      name: st.name,
      email: st.email.toLowerCase(),
      department: st.department,
      semester: st.semester,
      phone: st.phone,
      gender: st.gender,
      dateOfBirth: st.dateOfBirth,
      address: st.address,
      status: st.status,
      avatar: st.avatar,
      enrollmentYear: 2023,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)).toISOString(),
    };

    memoryUsers.push(u);
    memoryStudents.push(s);
  }

  // 3. Past 7 working days Attendance
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() !== 0) {
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  for (const dStr of dates) {
    for (const st of memoryStudents) {
      const hash = (dStr.charCodeAt(dStr.length - 1) + st.rollNumber.charCodeAt(st.rollNumber.length - 1)) % 10;
      const status = hash === 1 || hash === 5 ? 'Absent' : 'Present';
      memoryAttendance.push({
        _id: generateId(),
        student: st._id,
        date: dStr,
        status,
        remarks: status === 'Absent' ? 'Sick leave / Absent' : 'Present in class',
        markedBy: adminId,
        createdAt: new Date().toISOString(),
      });
    }
  }

  console.log(`[MemoryStore] Initialized: ${memoryUsers.length} users, ${memoryStudents.length} students, ${memoryAttendance.length} attendance records.`);
};

// ================= USER OPERATIONS =================

export const findUserByEmail = async (email, includePassword = false) => {
  if (isConnectedToMongo) {
    const q = User.findOne({ email: email.toLowerCase() });
    if (includePassword) q.select('+password');
    return await q.populate('studentProfile');
  }

  const u = memoryUsers.find((user) => user.email === email.toLowerCase());
  if (!u) return null;

  const copy = { ...u };
  if (!includePassword) delete copy.password;

  if (copy.studentProfile) {
    copy.studentProfile = memoryStudents.find((s) => s._id === copy.studentProfile) || null;
  }
  return {
    ...copy,
    matchPassword: async (enteredPassword) => {
      return await bcrypt.compare(enteredPassword, u.password);
    },
  };
};

export const findUserById = async (id) => {
  if (isConnectedToMongo) {
    return await User.findById(id).select('-password').populate('studentProfile');
  }

  const u = memoryUsers.find((user) => user._id.toString() === id.toString());
  if (!u) return null;

  const copy = { ...u };
  delete copy.password;
  if (copy.studentProfile) {
    copy.studentProfile = memoryStudents.find((s) => s._id === copy.studentProfile) || null;
  }
  return copy;
};

export const createUser = async ({ name, email, password, role = 'student', avatar = '' }) => {
  if (isConnectedToMongo) {
    return await User.create({ name, email, password, role, avatar });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = {
    _id: generateId(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    avatar,
    studentProfile: null,
    createdAt: new Date().toISOString(),
  };
  memoryUsers.push(newUser);
  return newUser;
};

export const updateUser = async (id, updates) => {
  if (isConnectedToMongo) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  const idx = memoryUsers.findIndex((u) => u._id.toString() === id.toString());
  if (idx !== -1) {
    memoryUsers[idx] = { ...memoryUsers[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryUsers[idx];
  }
  return null;
};

// ================= STUDENT OPERATIONS =================

export const getStudentsList = async ({ search, department, semester, status, page = 1, limit = 50 }) => {
  if (isConnectedToMongo) {
    const query = {};
    if (department && department !== 'All') query.department = department;
    if (semester && semester !== 'All') query.semester = Number(semester);
    if (status && status !== 'All') query.status = status;
    if (search && search.trim()) {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ name: reg }, { rollNumber: reg }, { email: reg }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean();

    const studentIds = students.map((s) => s._id);
    const attendanceStats = await Attendance.aggregate([
      { $match: { student: { $in: studentIds } } },
      {
        $group: {
          _id: '$student',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        },
      },
    ]);

    const statsMap = {};
    attendanceStats.forEach((stat) => {
      const pct = stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
      statsMap[stat._id.toString()] = { total: stat.total, present: stat.present, percentage: pct };
    });

    return {
      total,
      students: students.map((st) => ({
        ...st,
        attendanceSummary: statsMap[st._id.toString()] || { total: 0, present: 0, percentage: 0 },
      })),
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    };
  }

  // Memory mode
  let filtered = [...memoryStudents];

  if (department && department !== 'All') {
    filtered = filtered.filter((s) => s.department === department);
  }
  if (semester && semester !== 'All') {
    filtered = filtered.filter((s) => s.semester === Number(semester));
  }
  if (status && status !== 'All') {
    filtered = filtered.filter((s) => s.status === status);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const start = (pageNum - 1) * limitNum;
  const paged = filtered.slice(start, start + limitNum);

  const studentsWithStats = paged.map((st) => {
    const studentRecords = memoryAttendance.filter((a) => a.student === st._id);
    const totalRec = studentRecords.length;
    const presRec = studentRecords.filter((a) => a.status === 'Present').length;
    const pct = totalRec > 0 ? Math.round((presRec / totalRec) * 100) : 0;
    return {
      ...st,
      attendanceSummary: { total: totalRec, present: presRec, percentage: pct },
    };
  });

  return {
    total,
    students: studentsWithStats,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
  };
};

export const getStudentById = async (id) => {
  if (isConnectedToMongo) {
    const student = await Student.findById(id).populate('user', 'email role avatar');
    if (!student) return null;

    const totalRecords = await Attendance.countDocuments({ student: student._id });
    const presentRecords = await Attendance.countDocuments({ student: student._id, status: 'Present' });
    const absentRecords = await Attendance.countDocuments({ student: student._id, status: 'Absent' });
    const percentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
    const recent = await Attendance.find({ student: student._id }).sort({ date: -1 }).limit(10);

    return {
      student,
      attendanceStats: {
        total: totalRecords,
        present: presentRecords,
        absent: absentRecords,
        percentage,
        recent,
      },
    };
  }

  const student = memoryStudents.find((s) => s._id.toString() === id.toString());
  if (!student) return null;

  const records = memoryAttendance.filter((a) => a.student === student._id);
  const total = records.length;
  const present = records.filter((a) => a.status === 'Present').length;
  const absent = records.filter((a) => a.status === 'Absent').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  const recent = records.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return {
    student,
    attendanceStats: {
      total,
      present,
      absent,
      percentage,
      recent,
    },
  };
};

export const getStudentByUserId = async (userId) => {
  if (isConnectedToMongo) {
    return await Student.findOne({ user: userId });
  }
  return memoryStudents.find((s) => s.user.toString() === userId.toString()) || null;
};

export const findStudentByUserId = getStudentByUserId;

export const findStudentByRoll = async (rollNumber) => {
  if (isConnectedToMongo) {
    return await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
  }
  return memoryStudents.find(
    (s) => s.rollNumber.toUpperCase() === rollNumber.trim().toUpperCase()
  ) || null;
};

export const findStudentByEmail = async (email) => {
  if (isConnectedToMongo) {
    return await Student.findOne({ email: email.toLowerCase() });
  }
  return memoryStudents.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
};

export const createStudent = async (data) => {
  if (isConnectedToMongo) {
    return await Student.create(data);
  }

  const newStudent = {
    _id: generateId(),
    ...data,
    rollNumber: data.rollNumber.trim().toUpperCase(),
    email: data.email.toLowerCase(),
    enrollmentYear: data.enrollmentYear || new Date().getFullYear(),
    status: data.status || 'Active',
    createdAt: new Date().toISOString(),
  };
  memoryStudents.unshift(newStudent);
  return newStudent;
};

export const updateStudent = async (id, updates) => {
  if (isConnectedToMongo) {
    return await Student.findByIdAndUpdate(id, updates, { new: true });
  }

  const idx = memoryStudents.findIndex((s) => s._id.toString() === id.toString());
  if (idx !== -1) {
    memoryStudents[idx] = { ...memoryStudents[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryStudents[idx];
  }
  return null;
};

export const deleteStudent = async (id) => {
  if (isConnectedToMongo) {
    const student = await Student.findById(id);
    if (!student) return false;
    await Attendance.deleteMany({ student: student._id });
    if (student.user) await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(student._id);
    return true;
  }

  const idx = memoryStudents.findIndex((s) => s._id.toString() === id.toString());
  if (idx === -1) return false;

  const student = memoryStudents[idx];
  memoryAttendance = memoryAttendance.filter((a) => a.student !== student._id);
  memoryUsers = memoryUsers.filter((u) => u._id !== student.user);
  memoryStudents.splice(idx, 1);
  return true;
};

export const getDepartmentStats = async () => {
  if (isConnectedToMongo) {
    const depts = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return depts.map((d) => ({ name: d._id, count: d.count, active: d.active }));
  }

  const map = {};
  for (const s of memoryStudents) {
    if (!map[s.department]) map[s.department] = { name: s.department, count: 0, active: 0 };
    map[s.department].count += 1;
    if (s.status === 'Active') map[s.department].active += 1;
  }
  return Object.values(map).sort((a, b) => b.count - a.count);
};

// ================= ATTENDANCE OPERATIONS =================

export const bulkUpsertAttendance = async (date, records, markedById) => {
  if (isConnectedToMongo) {
    const operations = records.map((rec) => ({
      updateOne: {
        filter: { student: rec.studentId, date },
        update: {
          $set: {
            student: rec.studentId,
            date,
            status: rec.status || 'Present',
            remarks: rec.remarks || '',
            markedBy: markedById,
          },
        },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(operations);
    return true;
  }

  for (const rec of records) {
    const existingIdx = memoryAttendance.findIndex(
      (a) => a.student === rec.studentId && a.date === date
    );
    if (existingIdx !== -1) {
      memoryAttendance[existingIdx] = {
        ...memoryAttendance[existingIdx],
        status: rec.status || 'Present',
        remarks: rec.remarks || '',
        markedBy: markedById,
        updatedAt: new Date().toISOString(),
      };
    } else {
      memoryAttendance.push({
        _id: generateId(),
        student: rec.studentId,
        date,
        status: rec.status || 'Present',
        remarks: rec.remarks || '',
        markedBy: markedById,
        createdAt: new Date().toISOString(),
      });
    }
  }
  return true;
};

export const getAttendanceByDate = async (date, department) => {
  if (isConnectedToMongo) {
    const studentFilter = { status: 'Active' };
    if (department && department !== 'All') studentFilter.department = department;

    const students = await Student.find(studentFilter).sort({ rollNumber: 1 }).lean();
    const attendanceRecords = await Attendance.find({ date }).lean();
    const map = {};
    attendanceRecords.forEach((a) => {
      map[a.student.toString()] = a;
    });

    const sheet = students.map((st) => {
      const existing = map[st._id.toString()];
      return {
        studentId: st._id,
        rollNumber: st.rollNumber,
        name: st.name,
        department: st.department,
        semester: st.semester,
        status: existing ? existing.status : 'Present',
        isMarked: !!existing,
        remarks: existing ? existing.remarks : '',
        recordId: existing ? existing._id : null,
      };
    });

    return {
      date,
      totalStudents: sheet.length,
      markedCount: attendanceRecords.length,
      presentCount: sheet.filter((s) => s.isMarked && s.status === 'Present').length,
      absentCount: sheet.filter((s) => s.isMarked && s.status === 'Absent').length,
      sheet,
    };
  }

  let students = memoryStudents.filter((s) => s.status === 'Active');
  if (department && department !== 'All') {
    students = students.filter((s) => s.department === department);
  }
  students.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

  const records = memoryAttendance.filter((a) => a.date === date);
  const map = {};
  records.forEach((a) => {
    map[a.student] = a;
  });

  const sheet = students.map((st) => {
    const existing = map[st._id];
    return {
      studentId: st._id,
      rollNumber: st.rollNumber,
      name: st.name,
      department: st.department,
      semester: st.semester,
      status: existing ? existing.status : 'Present',
      isMarked: !!existing,
      remarks: existing ? existing.remarks : '',
      recordId: existing ? existing._id : null,
    };
  });

  return {
    date,
    totalStudents: sheet.length,
    markedCount: records.length,
    presentCount: sheet.filter((s) => s.isMarked && s.status === 'Present').length,
    absentCount: sheet.filter((s) => s.isMarked && s.status === 'Absent').length,
    sheet,
  };
};

export const getStudentAttendanceHistory = async (studentId, month, year) => {
  if (isConnectedToMongo) {
    const query = { student: studentId };
    if (month && year) {
      const monthPadded = String(month).padStart(2, '0');
      query.date = { $regex: `^${year}-${monthPadded}` };
    } else if (year) {
      query.date = { $regex: `^${year}` };
    }

    const records = await Attendance.find(query).sort({ date: -1 });
    const totalClasses = records.length;
    const presentClasses = records.filter((r) => r.status === 'Present').length;
    const absentClasses = records.filter((r) => r.status === 'Absent').length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    return {
      summary: { totalClasses, presentClasses, absentClasses, percentage },
      records,
    };
  }

  let records = memoryAttendance.filter((a) => a.student.toString() === studentId.toString());
  if (month && year) {
    const mStr = `${year}-${String(month).padStart(2, '0')}`;
    records = records.filter((r) => r.date.startsWith(mStr));
  } else if (year) {
    records = records.filter((r) => r.date.startsWith(String(year)));
  }

  records.sort((a, b) => b.date.localeCompare(a.date));
  const totalClasses = records.length;
  const presentClasses = records.filter((r) => r.status === 'Present').length;
  const absentClasses = records.filter((r) => r.status === 'Absent').length;
  const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  return {
    summary: { totalClasses, presentClasses, absentClasses, percentage },
    records,
  };
};

export const getAttendanceDatesList = async () => {
  if (isConnectedToMongo) {
    const dates = await Attendance.aggregate([
      {
        $group: {
          _id: '$date',
          totalRecords: { $sum: 1 },
          presentCount: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);
    return dates.map((d) => ({
      date: d._id,
      total: d.totalRecords,
      present: d.presentCount,
      absent: d.absentCount,
      percentage: d.totalRecords > 0 ? Math.round((d.presentCount / d.totalRecords) * 100) : 0,
    }));
  }

  const map = {};
  for (const a of memoryAttendance) {
    if (!map[a.date]) map[a.date] = { date: a.date, total: 0, present: 0, absent: 0 };
    map[a.date].total += 1;
    if (a.status === 'Present') map[a.date].present += 1;
    if (a.status === 'Absent') map[a.date].absent += 1;
  }
  return Object.values(map)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)
    .map((d) => ({
      ...d,
      percentage: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
    }));
};

// ================= DASHBOARD STATS =================

export const getAdminStats = async () => {
  if (isConnectedToMongo) {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const distinctDepartments = await Student.distinct('department');
    const totalDepartments = distinctDepartments.length;

    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalAttendance = await Attendance.countDocuments();
    const totalPresent = await Attendance.countDocuments({ status: 'Present' });
    const overallAttendancePercentage = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = await Attendance.find({ date: todayStr });
    const todayPresent = todayRecords.filter((r) => r.status === 'Present').length;
    const todayAttendancePercentage = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 0;

    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(6).lean();

    const recentDateAggs = await Attendance.aggregate([
      {
        $group: {
          _id: '$date',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 10 },
    ]);

    return {
      stats: {
        totalStudents,
        activeStudents,
        totalDepartments,
        overallAttendancePercentage,
        todayAttendancePercentage,
        todayMarkedCount: todayRecords.length,
      },
      departmentDistribution: departmentStats.map((d) => ({ name: d._id, students: d.count })),
      attendanceTrend: recentDateAggs.map((item) => ({
        date: item._id,
        total: item.total,
        present: item.present,
        absent: item.absent,
        percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
      })),
      recentStudents,
    };
  }

  // Memory mode
  const totalStudents = memoryStudents.length;
  const activeStudents = memoryStudents.filter((s) => s.status === 'Active').length;
  const depts = [...new Set(memoryStudents.map((s) => s.department))];
  const totalDepartments = depts.length;

  const deptCounts = {};
  memoryStudents.forEach((s) => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
  });
  const departmentDistribution = Object.keys(deptCounts).map((k) => ({
    name: k,
    students: deptCounts[k],
  }));

  const totalAttendance = memoryAttendance.length;
  const totalPresent = memoryAttendance.filter((a) => a.status === 'Present').length;
  const overallAttendancePercentage = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = memoryAttendance.filter((a) => a.date === todayStr);
  const todayPresent = todayRecords.filter((a) => a.status === 'Present').length;
  const todayAttendancePercentage = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 0;

  const recentStudents = [...memoryStudents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const datesMap = {};
  memoryAttendance.forEach((a) => {
    if (!datesMap[a.date]) datesMap[a.date] = { date: a.date, total: 0, present: 0, absent: 0 };
    datesMap[a.date].total += 1;
    if (a.status === 'Present') datesMap[a.date].present += 1;
    if (a.status === 'Absent') datesMap[a.date].absent += 1;
  });

  const attendanceTrend = Object.values(datesMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-10)
    .map((item) => ({
      date: item.date,
      total: item.total,
      present: item.present,
      absent: item.absent,
      percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
    }));

  return {
    stats: {
      totalStudents,
      activeStudents,
      totalDepartments,
      overallAttendancePercentage,
      todayAttendancePercentage,
      todayMarkedCount: todayRecords.length,
    },
    departmentDistribution,
    attendanceTrend,
    recentStudents,
  };
};

export const getStudentStats = async (studentId) => {
  const studentData = await getStudentById(studentId);
  if (!studentData) return null;

  const { student, attendanceStats } = studentData;
  const records = attendanceStats.recent;

  const monthlyMap = {};
  (attendanceStats.recent || []).forEach((rec) => {
    const monthKey = rec.date.substring(0, 7);
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { total: 0, present: 0 };
    monthlyMap[monthKey].total += 1;
    if (rec.status === 'Present') monthlyMap[monthKey].present += 1;
  });

  const monthlyTrend = Object.keys(monthlyMap)
    .sort()
    .map((key) => ({
      month: key,
      total: monthlyMap[key].total,
      present: monthlyMap[key].present,
      percentage: Math.round((monthlyMap[key].present / monthlyMap[key].total) * 100),
    }));

  return {
    student,
    attendance: {
      totalClasses: attendanceStats.total,
      presentCount: attendanceStats.present,
      absentCount: attendanceStats.absent,
      percentage: attendanceStats.percentage,
      recentAttendance: records.slice(0, 5),
      monthlyTrend,
    },
  };
};
