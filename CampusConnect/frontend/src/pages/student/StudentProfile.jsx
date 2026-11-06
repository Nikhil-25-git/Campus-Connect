import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import Badge from '../../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Save,
  KeyRound,
  GraduationCap,
  Hash,
  Shield,
} from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const student = user?.studentProfile || {};

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: student?.phone || '',
    address: student?.address || '',
    gender: student?.gender || 'Male',
    dateOfBirth: student?.dateOfBirth ? student.dateOfBirth.substring(0, 10) : '',
    avatar: user?.avatar || '',
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.studentProfile?.phone || '',
        address: user.studentProfile?.address || '',
        gender: user.studentProfile?.gender || 'Male',
        dateOfBirth: user.studentProfile?.dateOfBirth
          ? user.studentProfile.dateOfBirth.substring(0, 10)
          : '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateUserProfile(profileData);
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await axiosClient.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        toast.success(res.message || 'Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Profile & Account</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View your academic credentials, update your personal contact details, and manage password security
        </p>
      </div>

      {/* Academic Credentials Card (Read-Only) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Academic Registration</h3>
            <p className="text-xs text-slate-400">Institutional records assigned by administration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Roll Number</p>
            <p className="text-base font-mono font-bold text-blue-700 mt-1">
              {student.rollNumber || 'Not Assigned'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Department</p>
            <p className="text-sm font-bold text-slate-800 mt-1">
              {student.department || 'Not Assigned'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Current Semester</p>
            <p className="text-base font-bold text-slate-800 mt-1">
              Semester {student.semester || 1}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Student Status</p>
            <div className="mt-1">
              <Badge variant={student.status || 'Active'}>{student.status || 'Active'}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Form (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Personal Information</h3>
              <p className="text-xs text-slate-400">Update your profile information and contact details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleProfileChange}
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
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                name="avatar"
                value={profileData.avatar}
                onChange={handleProfileChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Residential Address
              </label>
              <textarea
                name="address"
                rows={3}
                value={profileData.address}
                onChange={handleProfileChange}
                placeholder="Enter complete residential address"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Update Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Change Password</h3>
                <p className="text-xs text-slate-400">Keep your account secure with regular updates</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {savingPassword ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Change Password</span>
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>256-bit bcrypt encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
