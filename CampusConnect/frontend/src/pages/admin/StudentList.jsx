import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddEditStudentModal from './AddEditStudentModal';
import StudentDetailsModal from './StudentDetailsModal';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  GraduationCap,
  Users,
  Building,
  RotateCcw,
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Electrical Engineering',
];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsStudentId, setDetailsStudentId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedDept !== 'All') params.append('department', selectedDept);
      if (selectedSemester !== 'All') params.append('semester', selectedSemester);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);

      const res = await axiosClient.get(`/students?${params.toString()}`);
      if (res.success) {
        setStudents(res.students || []);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch students list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedDept, selectedSemester, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsAddEditOpen(true);
  };

  const handleOpenDetails = (studentId) => {
    setDetailsStudentId(studentId);
    setIsDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const res = await axiosClient.delete(`/students/${deleteTarget._id}`);
      if (res.success) {
        toast.success(res.message || 'Student record deleted successfully');
        setDeleteTarget(null);
        fetchStudents();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedSemester('All');
    setSelectedStatus('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, add, edit, search, filter and manage all student enrollment records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition duration-150"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll number, email..."
              className="w-full pl-10 pr-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Department filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester filter */}
          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>

            {(search || selectedDept !== 'All' || selectedSemester !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={handleResetFilters}
                title="Reset filters"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter stats pills */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{students.length}</strong> of{' '}
            <strong className="text-slate-800">{totalCount}</strong> total students
          </span>
          {selectedDept !== 'All' && (
            <span className="font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Department: {selectedDept}
            </span>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <Spinner text="Fetching student records..." />
        ) : students.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No students match criteria"
              description="Try adjusting your search keywords or filter dropdowns to find student records."
              action={
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Department & Sem</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const att = student.attendanceSummary || { percentage: 0, total: 0, present: 0 };
                  const attColor =
                    att.percentage >= 75
                      ? 'bg-emerald-500'
                      : att.percentage >= 60
                      ? 'bg-amber-500'
                      : 'bg-rose-500';

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/80 transition duration-150"
                    >
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden border border-blue-200">
                            {student.avatar ? (
                              <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              student.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="truncate max-w-[200px]">
                            <p className="font-bold text-slate-800 truncate">{student.name}</p>
                            <p className="text-xs text-slate-400 truncate">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="px-6 py-4 font-mono text-xs font-bold text-blue-700 whitespace-nowrap">
                        {student.rollNumber}
                      </td>

                      {/* Department & Sem */}
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">
                          {student.department}
                        </p>
                        <p className="text-[11px] text-slate-400">Semester {student.semester}</p>
                      </td>

                      {/* Attendance Percentage Progress */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">{att.percentage}%</span>
                            <span className="text-[11px] text-slate-400">
                              {att.present}/{att.total}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${attColor} transition-all duration-300`}
                              style={{ width: `${Math.min(100, att.percentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={student.status}>{student.status}</Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenDetails(student._id)}
                            title="View student profile & attendance"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(student)}
                            title="Edit student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(student)}
                            title="Delete student"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEditStudentModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        student={editingStudent}
        onSaved={fetchStudents}
      />

      <StudentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        studentId={detailsStudentId}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete ${deleteTarget?.name} (${deleteTarget?.rollNumber})? This will also remove their user credentials and attendance records.`}
        confirmText="Yes, Delete Student"
      />
    </div>
  );
};

export default StudentList;
