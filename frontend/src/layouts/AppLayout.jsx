import {
  Activity,
  Cloud,
  Folder,
  LayoutDashboard,
  Link2,
  LogOut,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Files",
    to: "/files",
    icon: Folder,
  },
  {
    label: "Shared Links",
    to: "/shared",
    icon: Link2,
  },
  {
    label: "Trash",
    to: "/trash",
    icon: Trash2,
  },
  {
    label: "Activity",
    to: "/activity",
    icon: Activity,
  },
];

function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-[#fbfaf7] p-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
              SC
            </div>

            <div>
              <h1 className="font-semibold tracking-tight">SecureCloud</h1>
              <p className="text-xs text-slate-500">Storage & sharing</p>
            </div>
          </div>

          <nav className="mt-10 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
                      isActive
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Storage</p>
              <Cloud size={18} className="text-slate-400" />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Local disk storage for now
            </p>

            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-2 w-[68%] rounded-full bg-slate-950" />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Dashboard summary will replace this later.
            </p>
          </div>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-950">
                {user?.username || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "No email loaded"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-[#f6f4ef]/90 px-6 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Secure Cloud
                </p>
                <p className="text-sm text-slate-600">
                  Files, folders, sharing, and activity logs
                </p>
              </div>

              <button className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 md:flex">
                <Upload size={16} />
                Upload
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
