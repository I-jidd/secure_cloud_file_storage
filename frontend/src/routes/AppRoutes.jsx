import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import ActivityLogsPage from "../pages/ActivityLogsPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import MyFilesPage from "../pages/MyFilesPage";
import PublicSharePage from "../pages/PublicSharePage";
import RegisterPage from "../pages/RegisterPage";
import SharedLinksPage from "../pages/SharedLinksPage";
import TrashPage from "../pages/TrashPage";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/files" element={<MyFilesPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/shared" element={<SharedLinksPage />} />
        <Route path="/activity" element={<ActivityLogsPage />} />
      </Route>

      <Route path="/public/share/:token" element={<PublicSharePage />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
