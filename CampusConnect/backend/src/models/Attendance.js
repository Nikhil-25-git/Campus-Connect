import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    date: {
      type: String, // Stored as ISO YYYY-MM-DD for straightforward matching and grouping
      required: [true, 'Attendance date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      default: 'Present',
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student on the same date
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
