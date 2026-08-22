import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import CertificateVerifyPage from "../pages/CertificateVerifyPage";

import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ProtectedRoute from "./ProtectedRoute";

// ================= Layouts =================
import CitizenLayout from "../layouts/CitizenLayout";
import OfficerLayout from "../layouts/OfficerLayout";
import AdminLayout from "../layouts/AdminLayout";

// ================= Citizen =================
import CitizenDashboardPage from "../pages/citizen/CitizenDashboardPage";
import ProfilePage from "../pages/citizen/ProfilePage";
import ServicesPage from "../pages/citizen/ServicesPage";
import ServiceDetailsPage from "../pages/citizen/ServiceDetailsPage";
import ApplicationPage from "../pages/citizen/ApplicationPage";
import ApplicationDetailsPage from "../pages/citizen/ApplicationDetailsPage";
import MyApplicationsPage from "../pages/citizen/MyApplicationsPage";
import CertificatesPage from "../pages/citizen/CertificatesPage";

// ================= Officer =================
import OfficerDashboardPage from "../pages/officer/OfficerDashboardPage";
import PendingApplicationsPage from "../pages/officer/PendingApplicationsPage";
import ApplicationReviewPage from "../pages/officer/ApplicationReviewPage";
import OfficerHistoryListPage from "../pages/officer/OfficerHistoryListPage";
import HistoryPage from "../pages/officer/HistoryPage";

// ================= Admin =================
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import OfficersPage from "../pages/admin/OfficersPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import GrievancesPage from "../pages/admin/GrievancesPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= Public ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify/:certificateNumber" element={<CertificateVerifyPage />} />

      {/* Redirect old routes to the unified pages */}
      <Route path="/citizen/login" element={<Navigate to="/login" replace />} />
      <Route path="/citizen/register" element={<Navigate to="/register" replace />} />
      <Route path="/officer/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* ================= Citizen Protected Routes ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["CITIZEN"]}>
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CitizenDashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:code" element={<ServiceDetailsPage />} />
        <Route path="/apply/:code" element={<ApplicationPage />} />
        <Route path="/applications" element={<MyApplicationsPage />} />
        <Route path="/citizen/my-applications" element={<Navigate to="/applications" replace />} />
        <Route path="/citizen/upload-documents" element={<Navigate to="/applications" replace />} />
        <Route path="/citizen/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/citizen/certificates" element={<Navigate to="/certificates" replace />} />
      </Route>

      {/* ================= Officer Protected Routes ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["DA", "PATWARI", "TEHSILDAR"]}>
            <OfficerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
        <Route path="/officer/pending" element={<PendingApplicationsPage />} />
        <Route path="/officer/applications/:id" element={<ApplicationReviewPage />} />
        <Route path="/officer/history" element={<OfficerHistoryListPage />} />
        <Route path="/officer/history/:id" element={<HistoryPage />} />
      </Route>

      {/* ================= Admin Protected Routes ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/officers" element={<OfficersPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/grievances" element={<GrievancesPage />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}