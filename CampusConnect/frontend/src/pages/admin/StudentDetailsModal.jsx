import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import axiosClient from '../../api/axiosClient';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

const StudentDetailsModal = ({ isOpen, onClose, studentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const res = await axiosClient.get(`/students/${studentId}`);
          if (res.success) {
            setData(res);
          }
        } catch (err) {
          console.error('Failed to fetch student details:', err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  const student = data?.student;
  const stats = data?.attendanceStats;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Profile & Performance"
      subtitle={student ? `${student.name} • ${student.rollNumber}` : ''}
      maxWidth="max-w-3xl"
    >
      {loading || !student ? (
        <Spinner text="Loading student records..." />
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20 overflow-hidden">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  student.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
                <p className="text-xs font-mono font-bold text-blue-700">{student.rollNumber}</p>
                <p className="text-xs text-slate-500 mt-0.5">{student.department}</p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <Badge variant={student.status}>{student.status}</Badge>
              <span className="text-xs font-medium text-slate-500">
                Semester {student.semester}
              </span>
            </div>
          </div>

          {/* Attendance Stats Summary */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-semibold uppercase">Attendance %</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{stats.percentage}%</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Classes</p>
                <p className="text-2xl font-bold text-slate-700 mt-1">{stats.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-semibold uppercase">Present Days</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.present}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-semibold uppercase">Absent Days</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{stats.absent}</p>
              </div>
            </div>
          )}

          {/* Contact and Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                Contact Information
              </h4>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{student.phone || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">{student.address || 'Address not listed'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                Academic & Bio
              </h4>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Gender:</span>
                <span className="font-semibold text-slate-700">{student.gender || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Birth Date:</span>
                <span className="font-semibold text-slate-700">
                  {student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Enrollment Year:</span>
                <span className="font-semibold text-slate-700">{student.enrollmentYear || 2023}</span>
              </div>
            </div>
          </div>

          {/* Recent Attendance Log */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3">Recent Attendance History</h4>
            {stats?.recent && stats.recent.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recent.map((rec) => (
                      <tr key={rec._id || rec.date} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-semibold text-slate-700">{rec.date}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant={rec.status}>{rec.status}</Badge>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">{rec.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">No attendance records yet.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StudentDetailsModal;
