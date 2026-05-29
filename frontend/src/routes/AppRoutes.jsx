import { Navigate, Route, Routes } from "react-router-dom";

import ActivityLogsPage from "../pages/ActivityLogsPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import MyFilesPage from "../pages/MyFilesPage";
import PublicSharePage from "../pages/PublicSharePage";
import RegisterPage from "../pages/RegisterPage";
import SharedLinksPage from "../pages/SharedLinksPage";
import TrashPage from "../pages/TrashPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <MyFilesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <TrashPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shared"
        element={
          <ProtectedRoute>
            <SharedLinksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityLogsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/public/share/:token" element={<PublicSharePage />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
