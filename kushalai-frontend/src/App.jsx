import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import AuthLayout from './layouts/AuthLayout';
import OfficerLayout from './layouts/OfficerLayout';
import AdminLayout from './layouts/AdminLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import RoadmapPage from './pages/RoadmapPage';
import Quiz from './pages/Quiz';
import SkillPassport from './pages/SkillPassport';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminColleagueDetail from './pages/AdminColleagueDetail';
import NotFound from './pages/NotFound';

function RequireRole({ role, children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Route>

      <Route
        element={
          <RequireRole role="officer">
            <OfficerLayout />
          </RequireRole>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/skills" element={<SkillPassport />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Quiz is a full-page experience without the standard chrome, but still requires an officer session */}
      <Route
        path="/quiz/:id"
        element={
          <RequireRole role="officer">
            <Quiz />
          </RequireRole>
        }
      />

      <Route
        element={
          <RequireRole role="admin">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/colleagues/:id" element={<AdminColleagueDetail />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
