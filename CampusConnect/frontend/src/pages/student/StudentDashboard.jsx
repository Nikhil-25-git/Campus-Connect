import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Percent,
  Clock,
  ArrowRight,
  AlertTriangle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentDashboard = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/dashboard/student');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load student dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDashboard();
  }, []);

  if (loading) {
    return <Spinner text="Loading your academic profile..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <p className="text-red-700 font-semibold mb-2">Error Loading Dashboard</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={fetchStudentDashboard}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { student, attendance } = data;
  const isShortage = attendance.percentage < 75;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-inner border border-white/20 overflow-hidden">
              {student?.avatar ? (
                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                student?.name?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Academic Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{student?.name}</h1>
              <p className="text-blue-100 text-xs sm:text-sm font-mono font-bold">
                Roll No: {student?.rollNumber} • {student?.department} (Sem {student?.semester})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/attendance"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition shadow-sm flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Full Attendance</span>
            </Link>
            <Link
              to="/student/profile"
              className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs transition border border-white/20 flex items-center gap-2"
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Attendance Shortage Warning Alert */}
      {isShortage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-bold text-amber-900 text-sm">Attendance Shortage Warning</p>
            <p className="mt-0.5">
              Your overall attendance is currently{' '}
              <strong className="underline">{attendance.percentage}%</strong>, which is below the
              mandatory 75% university requirement. Please make sure to attend upcoming sessions to maintain eligibility.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Attendance Rate"
          value={`${attendance.percentage}%`}
          subtitle={isShortage ? 'Below required 75%' : 'Eligible for examinations'}
          icon={Percent}
          color={isShortage ? 'amber' : 'green'}
          trend={isShortage ? 'Low' : 'Good'}
        />
        <StatCard
          title="Total Classes"
          value={attendance.totalClasses}
          subtitle="Conducted sessions"
          icon={CalendarCheck}
          color="blue"
        />
        <StatCard
          title="Attended (Present)"
          value={attendance.presentCount}
          subtitle="Classes present"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Missed (Absent)"
          value={attendance.absentCount}
          subtitle="Classes missed"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Visual Attendance Progress & Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Gauge Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Attendance Standing</h3>
            <p className="text-xs text-slate-400">75% attendance threshold status</p>
          </div>

          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isShortage ? 'text-amber-500' : 'text-blue-600'}
                  strokeDasharray={`${Math.min(100, attendance.percentage)}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-800">
                  {attendance.percentage}%
                </span>
                <span className="text-[11px] font-semibold text-slate-400">Total Rate</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Badge variant={isShortage ? 'Late' : 'Active'}>
                {isShortage ? 'Low Attendance' : 'Satisfactory Attendance'}
              </Badge>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Required for Exam:</span>
              <strong className="text-slate-800">75%</strong>
            </div>
            <div className="flex justify-between">
              <span>Current Status:</span>
              <strong className={isShortage ? 'text-amber-600' : 'text-emerald-600'}>
                {isShortage ? 'Shortage Alert' : 'Eligible'}
              </strong>
            </div>
          </div>
        </div>

        {/* Recent Attendance Log (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Recent Attendance Sessions</h3>
                <p className="text-xs text-slate-400">Latest class sessions recorded for you</p>
              </div>
              <Link
                to="/student/attendance"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.recentAttendance && attendance.recentAttendance.length > 0 ? (
                    attendance.recentAttendance.map((rec) => (
                      <tr key={rec._id || rec.date} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5 font-bold text-slate-800">{rec.date}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant={rec.status}>{rec.status}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {rec.remarks || 'Regular session'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-slate-400 text-xs">
                        No recent attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Faculty updates attendance daily</span>
            <Link to="/student/attendance" className="font-semibold text-blue-600 hover:underline">
              Download Attendance Statement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
