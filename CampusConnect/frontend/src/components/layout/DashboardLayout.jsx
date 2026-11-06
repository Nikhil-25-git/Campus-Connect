import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all">
        {/* Top Navigation Bar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white/50 py-4 px-6 text-center text-xs text-slate-400">
          CampusConnect – College Student Management Portal &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
