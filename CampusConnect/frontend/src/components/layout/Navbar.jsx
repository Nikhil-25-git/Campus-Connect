import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, LogOut, User as UserIcon, GraduationCap, ChevronDown } from 'lucide-react';
import Badge from '../common/Badge';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setDropdownOpen(false);
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/profile');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                CampusConnect
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm overflow-hidden border border-blue-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-2">
                    <Badge variant={user?.role}>{user?.role?.toUpperCase()}</Badge>
                  </div>
                </div>

                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
