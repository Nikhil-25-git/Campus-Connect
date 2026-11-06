import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const homePath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-xs border border-blue-100">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-slate-800 tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The requested page URL does not exist or has been relocated within the portal.
      </p>
      <Link
        to={user ? homePath : '/login'}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
