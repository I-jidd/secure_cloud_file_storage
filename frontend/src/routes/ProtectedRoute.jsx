import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6f4ef] text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
