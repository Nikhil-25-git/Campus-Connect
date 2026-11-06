import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserCircle,
  LogOut,
  X,
  BookOpen,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Student Records', icon: Users },
    { to: '/admin/attendance', label: 'Attendance Manager', icon: CalendarCheck },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/student/attendance', label: 'My Attendance', icon: CalendarCheck },
    { to: '/student/profile', label: 'My Profile', icon: UserCircle },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">CampusConnect</h2>
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                {isAdmin ? 'Admin Console' : 'Student Portal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>

          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs border border-blue-100/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-2xl border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
