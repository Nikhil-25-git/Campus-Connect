import dotenv from 'dotenv';
import connectDB, { closeDB } from '../config/db.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Checking existing data...');

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('[Seeder] Admin already exists. Skipping full seed.');
      return;
    }

    console.log('[Seeder] Seeding initial university demo data...');

    // 1. Create Default Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@campusconnect.edu',
      password: 'Admin@12345',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    console.log(`[Seeder] Admin created: admin@campusconnect.edu / Admin@12345`);

    // 2. Demo Students Definition
    const studentData = [
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
      },
    ];

    const createdStudents = [];

    for (const item of studentData) {
      const user = await User.create({
        name: item.name,
        email: item.email,
        password: item.password,
        role: 'student',
      });

      const student = await Student.create({
        user: user._id,
        rollNumber: item.rollNumber,
        name: item.name,
        email: item.email,
        department: item.department,
        semester: item.semester,
        phone: item.phone,
        gender: item.gender,
        dateOfBirth: item.dateOfBirth,
        address: item.address,
        status: item.status,
      });

      user.studentProfile = student._id;
      await user.save();
      createdStudents.push(student);
    }

    console.log(`[Seeder] Seeded ${createdStudents.length} student records.`);

    // 3. Seed Attendance Records for the past 7 working days
    const attendanceDates = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      // Skip Sundays (day 0)
      if (d.getDay() !== 0) {
        attendanceDates.push(d.toISOString().split('T')[0]);
      }
    }

    const attendanceRecords = [];
    for (const dStr of attendanceDates) {
      for (const st of createdStudents) {
        // Deterministic pseudo-random attendance pattern (approx 85% attendance)
        const hash = (dStr.charCodeAt(dStr.length - 1) + st.rollNumber.charCodeAt(st.rollNumber.length - 1)) % 10;
        const status = hash === 1 || hash === 5 ? 'Absent' : 'Present';

        attendanceRecords.push({
          student: st._id,
          date: dStr,
          status,
          remarks: status === 'Absent' ? 'Medical leave / absent' : 'Present in class',
          markedBy: admin._id,
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`[Seeder] Seeded ${attendanceRecords.length} attendance records across ${attendanceDates.length} days.`);
    console.log('[Seeder] Database seeding completed successfully!');
  } catch (err) {
    console.error(`[Seeder] Error during seeding: ${err.message}`);
  }
};

// If run directly via CLI (npm run seed)
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('[Seeder] Finished. Exiting.');
      await closeDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
