import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import DepartmentPieChart from '../../components/charts/DepartmentPieChart';
import {
  Users,
  Building2,
  CalendarCheck2,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/dashboard/admin');
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner text="Loading campus intelligence metrics..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <p className="text-red-700 font-semibold mb-2">Error Loading Dashboard</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, departmentDistribution, attendanceTrend, recentStudents } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Management & Academic Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Administrator Overview
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Live statistics, department distribution, attendance monitoring and recent student registrations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/attendance"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition shadow-sm flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Mark Attendance</span>
            </Link>
            <Link
              to="/admin/students"
              className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs transition border border-white/20 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Manage Students</span>
            </Link>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtitle={`${stats?.activeStudents || 0} currently active`}
          icon={Users}
          color="blue"
          trend="Enrolled"
        />
        <StatCard
          title="Departments"
          value={stats?.totalDepartments || 0}
          subtitle="Engineering & Tech faculties"
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Average Attendance"
          value={`${stats?.overallAttendancePercentage || 0}%`}
          subtitle="Overall college attendance"
          icon={TrendingUp}
          color="green"
          trend="Campus Avg"
        />
        <StatCard
          title="Today's Marked"
          value={`${stats?.todayAttendancePercentage || 0}%`}
          subtitle={`${stats?.todayMarkedCount || 0} students recorded today`}
          icon={CalendarCheck2}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Attendance Trends</h3>
              <p className="text-xs text-slate-400">Past sessions percentage rate</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
              Daily %
            </span>
          </div>
          <AttendanceTrendChart data={attendanceTrend} />
        </div>

        {/* Department Distribution Pie Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Department Breakdown</h3>
              <p className="text-xs text-slate-400">Student enrollment distribution</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
              {stats?.totalDepartments} Faculties
            </span>
          </div>
          <DepartmentPieChart data={departmentDistribution} />
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Student Registrations</h3>
            <p className="text-xs text-slate-400">Newly added student profiles in the portal</p>
          </div>
          <Link
            to="/admin/students"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Semester</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentStudents && recentStudents.length > 0 ? (
                recentStudents.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">
                      {st.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">
                      {st.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {st.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      Semester {st.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={st.status}>{st.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    No students registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
