import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@campusconnect.edu');
      setPassword('Admin@12345');
    } else {
      setEmail('rahul.sharma@campusconnect.edu');
      setPassword('Student@12345');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          CampusConnect
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Student Management & Attendance Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
          {/* Quick Demo Credentials Buttons */}
          <div className="mb-6 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 text-center">
              Quick Demo 1-Click Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Student Login</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@campusconnect.edu"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md shadow-blue-500/25 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New student?{' '}
              <Link
                to="/register"
                className="font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Register your account here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
