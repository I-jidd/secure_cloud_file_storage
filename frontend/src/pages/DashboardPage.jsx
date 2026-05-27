import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Overview</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <p>Loading: {String(isLoading)}</p>
        <p>Authenticated: {String(isAuthenticated)}</p>
        <p>User: {user ? user.email : "No user loaded"}</p>
      </div>
    </div>
  );
}

export default DashboardPage;
