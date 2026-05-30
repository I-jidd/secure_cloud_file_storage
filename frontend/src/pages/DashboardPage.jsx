import { useEffect, useState } from "react";
import {
  Activity,
  FileText,
  Folder,
  HardDrive,
  Link2,
  Trash2,
} from "lucide-react";

import { getDashboardSummary } from "../api/dashboardApi";
import { useAuth } from "../hooks/useAuth";
import { formatBytes } from "../utils/formatBytes";

function DashboardPage() {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboardSummary() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        setErrorMessage("Failed to load dashboard summary.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Welcome back, {user?.username || "User"}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            View your storage usage, recent uploads, shared links, and activity
            logs in one place.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={HardDrive}
          label="Storage used"
          value={formatBytes(summary.storage_used_bytes)}
          subtext="Active files only"
        />
        <MetricCard
          icon={FileText}
          label="Active files"
          value={summary.active_files}
          subtext={`${summary.total_files} total file records`}
        />
        <MetricCard
          icon={Trash2}
          label="Deleted files"
          value={summary.deleted_files}
          subtext="Recoverable from Trash"
        />
        <MetricCard
          icon={Folder}
          label="Folders"
          value={summary.total_folders}
          subtext={`${summary.deleted_folders} deleted folders`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent uploads</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest active files from your storage.
              </p>
            </div>
            <Link2 size={20} className="text-slate-400" />
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            {summary.recent_uploads.length > 0 ? (
              summary.recent_uploads.map((file) => (
                <div key={file.id} className="flex items-center gap-4 py-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-950">
                      {file.original_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {file.mime_type || "Unknown type"} ·{" "}
                      {formatBytes(file.size_bytes)}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                    Active
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                title="No recent uploads"
                message="Uploaded files will appear here."
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Backend-recorded audit trail.
          </p>

          <div className="mt-6 space-y-4">
            {summary.recent_activity.length > 0 ? (
              summary.recent_activity.map((log) => (
                <ActivityItem key={log.id} log={log} />
              ))
            ) : (
              <EmptyState
                title="No activity yet"
                message="Actions like upload, download, delete, restore, and share will appear here."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon size={20} className="text-slate-400" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{subtext}</p>
    </div>
  );
}

function ActivityItem({ log }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-950" />
      <div>
        <p className="text-sm text-slate-700">
          <span className="font-medium text-slate-950">{log.action}</span>{" "}
          {log.details || log.entity_type}
        </p>
        <p className="text-xs text-slate-400">
          {new Date(log.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default DashboardPage;
