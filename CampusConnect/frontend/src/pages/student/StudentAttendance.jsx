import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import {
  CalendarDays,
  Percent,
  CheckCircle2,
  XCircle,
  Filter,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';

const StudentAttendance = () => {
  const { user } = useAuth();
  const student = user?.studentProfile || {};

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    totalClasses: 0,
    presentClasses: 0,
    absentClasses: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchDate, setSearchDate] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/attendance/student/me');
      if (res.success) {
        setRecords(res.records || []);
        setSummary(res.summary || {});
      }
    } catch (err) {
      console.error('Failed to load student attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredRecords = records.filter((rec) => {
    if (selectedStatus !== 'All' && rec.status !== selectedStatus) return false;
    if (searchDate && !rec.date.includes(searchDate)) return false;
    return true;
  });

  const isShortage = summary.percentage < 75;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            My Attendance History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full record of all classes, dates, presence status and attendance percentage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isShortage ? 'Late' : 'Active'} size="md">
            Overall Rate: {summary.percentage}%
          </Badge>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
          <p className={`text-3xl font-black mt-1 ${isShortage ? 'text-amber-600' : 'text-blue-600'}`}>
            {summary.percentage}%
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Classes</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{summary.totalClasses}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Days</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{summary.presentClasses}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent Days</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">{summary.absentClasses}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            >
              <option value="All">All Records</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>

          {/* Date Search */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase">Search Date:</label>
            <input
              type="text"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="e.g. 2026-11"
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredRecords.length}</strong> recorded sessions
        </span>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <Spinner text="Loading attendance history..." />
        ) : filteredRecords.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No attendance records found"
              description="No attendance records match your current date or status filter."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Session Date</th>
                  <th className="px-6 py-4">Day</th>
                  <th className="px-6 py-4">Attendance Status</th>
                  <th className="px-6 py-4">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => {
                  const dateObj = new Date(rec.date);
                  const dayName = isNaN(dateObj.getTime())
                    ? 'Session'
                    : dateObj.toLocaleDateString(undefined, { weekday: 'long' });

                  return (
                    <tr key={rec._id || rec.date} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                        <span>{rec.date}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{dayName}</td>
                      <td className="px-6 py-4">
                        <Badge variant={rec.status}>{rec.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {rec.remarks || 'Regular class attendance'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
