import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rollNumber: {
      type: String,
      required: [true, 'Please provide a roll number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide student full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide student email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    department: {
      type: String,
      required: [true, 'Please select a department'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Please specify semester'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
      default: 1,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    enrollmentYear: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
      default: 'Active',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for rapid search by rollNumber and name
studentSchema.index({ rollNumber: 1, department: 1 });
studentSchema.index({ name: 'text', rollNumber: 'text', email: 'text' });

const Student = mongoose.model('Student', studentSchema);
export default Student;
