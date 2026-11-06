import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { toast } from 'react-toastify';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Save,
  Filter,
  History,
  CheckCheck,
  UserX,
  CalendarDays,
  Sparkles,
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

const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'history'

  // Mark Attendance State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedDept, setSelectedDept] = useState('All');
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dateStats, setDateStats] = useState({ markedCount: 0, presentCount: 0, absentCount: 0 });

  // History State
  const [historyDates, setHistoryDates] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch Attendance Sheet for selected date and department
  const fetchAttendanceSheet = async () => {
    try {
      setLoadingSheet(true);
      const params = new URLSearchParams();
      params.append('date', selectedDate);
      if (selectedDept !== 'All') {
        params.append('department', selectedDept);
      }

      const res = await axiosClient.get(`/attendance/by-date?${params.toString()}`);
      if (res.success) {
        setAttendanceSheet(res.attendanceSheet || []);
        setDateStats({
          markedCount: res.markedCount,
          presentCount: res.presentCount,
          absentCount: res.absentCount,
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load attendance sheet');
    } finally {
      setLoadingSheet(false);
    }
  };

  // Fetch dates history
  const fetchHistoryDates = async () => {
    try {
      setLoadingHistory(true);
      const res = await axiosClient.get('/attendance/dates');
      if (res.success) {
        setHistoryDates(res.dates || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load attendance history');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mark') {
      fetchAttendanceSheet();
    } else {
      fetchHistoryDates();
    }
  }, [activeTab, selectedDate, selectedDept]);

  // Toggle student status
  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Update remarks
  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceSheet((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  };

  // Mark all present
  const handleMarkAll = (status) => {
    setAttendanceSheet((prev) =>
      prev.map((item) => ({ ...item, status }))
    );
    toast.info(`Marked all listed students as ${status}`);
  };

  // Save attendance to backend
  const handleSaveAttendance = async () => {
    if (!attendanceSheet.length) return;

    try {
      setSaving(true);
      const records = attendanceSheet.map((item) => ({
        studentId: item.studentId,
        status: item.status,
        remarks: item.remarks || '',
      }));

      const res = await axiosClient.post('/attendance/bulk', {
        date: selectedDate,
        records,
      });

      if (res.success) {
        toast.success(res.message || 'Attendance saved successfully!');
        fetchAttendanceSheet();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const currentPresentCount = attendanceSheet.filter((s) => s.status === 'Present').length;
  const currentAbsentCount = attendanceSheet.filter((s) => s.status === 'Absent').length;
  const currentPercentage =
    attendanceSheet.length > 0
      ? Math.round((currentPresentCount / attendanceSheet.length) * 100)
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Attendance Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record daily attendance, review historical logs and monitor class attendance percentages
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-200/80 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('mark')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'mark'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mark Daily Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Attendance History Log</span>
          </button>
        </div>
      </div>

      {activeTab === 'mark' ? (
        <>
          {/* Controls Bar: Date, Dept, Quick Action Buttons */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Picker */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>

                {/* Dept Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Dept:</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-xs"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-xs"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Mark All Absent</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  disabled={saving || attendanceSheet.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {saving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Attendance</span>
                </button>
              </div>
            </div>

            {/* Quick Stat Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-500">
                  Total Students: <strong className="text-slate-800">{attendanceSheet.length}</strong>
                </span>
                <span className="text-emerald-700 font-semibold">
                  Present: <strong>{currentPresentCount}</strong>
                </span>
                <span className="text-rose-700 font-semibold">
                  Absent: <strong>{currentAbsentCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Session Rate:</span>
                <span className="font-extrabold text-blue-600 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100">
                  {currentPercentage}% Present
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Sheet Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            {loadingSheet ? (
              <Spinner text="Loading class roster..." />
            ) : attendanceSheet.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No active students found"
                  description="There are no registered active students matching this department selection."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Roll Number</th>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Attendance Status</th>
                      <th className="px-6 py-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceSheet.map((st) => {
                      const isPresent = st.status === 'Present';
                      const isAbsent = st.status === 'Absent';

                      return (
                        <tr key={st.studentId} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-blue-700 whitespace-nowrap">
                            {st.rollNumber}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                            {st.name}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">
                            {st.department} (Sem {st.semester})
                          </td>

                          {/* Present / Absent Radio Buttons */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.studentId, 'Present')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                  isPresent
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Present</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.studentId, 'Absent')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                  isAbsent
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Absent</span>
                              </button>
                            </div>
                          </td>

                          {/* Remarks */}
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={st.remarks || ''}
                              onChange={(e) =>
                                handleRemarksChange(st.studentId, e.target.value)
                              }
                              placeholder="Optional remarks (e.g. sick leave)"
                              className="w-full max-w-xs px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Attendance History View */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              Recorded Attendance Sessions
            </h3>
            <p className="text-xs text-slate-400">
              Chronological log of marked dates with attendance percentages and headcounts
            </p>
          </div>

          {loadingHistory ? (
            <Spinner text="Loading attendance history..." />
          ) : historyDates.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No attendance records logged"
                description="Use the 'Mark Daily Attendance' tab to start recording attendance."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total Students</th>
                    <th className="px-6 py-4">Present</th>
                    <th className="px-6 py-4">Absent</th>
                    <th className="px-6 py-4">Attendance Rate</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyDates.map((d) => (
                    <tr key={d.date} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                        <span>{d.date}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{d.total}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-600">
                        {d.present}
                      </td>
                      <td className="px-6 py-4 font-semibold text-rose-600">{d.absent}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{d.percentage}%</span>
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                d.percentage >= 75
                                  ? 'bg-emerald-500'
                                  : d.percentage >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${d.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedDate(d.date);
                            setActiveTab('mark');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition"
                        >
                          Review / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
