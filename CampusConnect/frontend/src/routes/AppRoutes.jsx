import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentList from '../pages/admin/StudentList';
import AttendanceManagement from '../pages/admin/AttendanceManagement';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentAttendance from '../pages/student/StudentAttendance';
import StudentProfile from '../pages/student/StudentProfile';

// Not Found
import NotFound from '../pages/NotFound';

// Guard for Protected Admin Routes
const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Spinner fullScreen text="Verifying admin credentials..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/student/dashboard" replace />;

  return children;
};

// Guard for Protected Student Routes
const StudentRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Spinner fullScreen text="Verifying student session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'student') return <Navigate to="/admin/dashboard" replace />;

  return children;
};

// Guard for Public Only Routes (Login/Register)
const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Spinner fullScreen text="Loading session..." />;
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner fullScreen text="Connecting to CampusConnect Portal..." />;
  }

  return (
    <Routes>
      {/* Root redirection */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="attendance" element={<AttendanceManagement />} />
      </Route>

      {/* Protected Student Routes */}
      <Route
        path="/student"
        element={
          <StudentRoute>
            <DashboardLayout />
          </StudentRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
