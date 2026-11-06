import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Electrical Engineering',
];

const AddEditStudentModal = ({ isOpen, onClose, student = null, onSaved }) => {
  const isEdit = !!student;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    semester: 1,
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    status: 'Active',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        rollNumber: student.rollNumber || '',
        department: student.department || 'Computer Science & Engineering',
        semester: student.semester || 1,
        phone: student.phone || '',
        gender: student.gender || 'Male',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.substring(0, 10) : '',
        address: student.address || '',
        status: student.status || 'Active',
        password: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        department: 'Computer Science & Engineering',
        semester: 1,
        phone: '',
        gender: 'Male',
        dateOfBirth: '',
        address: '',
        status: 'Active',
        password: '',
      });
    }
  }, [student, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        const res = await axiosClient.put(`/students/${student._id}`, payload);
        if (res.success) {
          toast.success(res.message || 'Student updated successfully!');
          onSaved();
          onClose();
        }
      } else {
        const res = await axiosClient.post('/students', formData);
        if (res.success) {
          toast.success(res.message || 'Student created successfully!');
          onSaved();
          onClose();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Student Details' : 'Add New Student'}
      subtitle={
        isEdit
          ? `Updating records for roll number ${student.rollNumber}`
          : 'Enroll a new student into the college portal database'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Roll Number *
            </label>
            <input
              type="text"
              name="rollNumber"
              required
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g. CS2024001"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@campusconnect.edu"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Semester *
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {!isEdit && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Portal Account Password (Optional)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Default: Student@12345"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              If left blank, default password will be <span className="font-mono font-semibold">Student@12345</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Residential Address
          </label>
          <textarea
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address, City, State"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isEdit ? 'Save Changes' : 'Create Student'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditStudentModal;
