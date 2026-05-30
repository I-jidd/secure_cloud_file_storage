import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  Download,
  FileText,
  Link2,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";

import { getActivityLogs } from "../api/activityLogApi";

function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadActivityLogs() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getActivityLogs(50);
        setLogs(data);
      } catch (error) {
        setErrorMessage("Failed to load activity logs.");
      } finally {
        setIsLoading(false);
      }
    }

    loadActivityLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading activity logs...</p>
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
      <section>
        <p className="text-sm text-slate-500">Audit Trail</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Activity Logs
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Review backend-recorded actions such as uploads, downloads, renames,
          deletes, restores, and shares.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing latest {logs.length} backend activity records.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            Live data
          </span>
        </div>

        <div className="mt-6">
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <ActivityLogItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </div>
  );
}

function ActivityLogItem({ log }) {
  const Icon = getActivityIcon(log.action);

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-600 shadow-sm">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-950">
            {formatAction(log.action)}
          </p>

          <p className="text-xs text-slate-400">{formatDate(log.created_at)}</p>
        </div>

        <p className="mt-1 text-sm text-slate-600">
          {log.details || "No details provided"}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            {log.entity_type}
          </span>

          {log.entity_id && (
            <span className="max-w-full truncate rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
              ID: {log.entity_id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <Activity className="mx-auto text-slate-400" size={32} />
      <p className="mt-4 text-sm font-medium text-slate-700">
        No activity logs yet
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Actions like upload, download, delete, restore, and share will appear
        here.
      </p>
    </div>
  );
}

function getActivityIcon(action) {
  const iconMap = {
    upload: Upload,
    download: Download,
    rename: FileText,
    delete: Trash2,
    restore: RotateCcw,
    share: Link2,
    disable_share: AlertCircle,
    create: FileText,
  };

  return iconMap[action] || Activity;
}

function formatAction(action) {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateString) {
  if (!dateString) {
    return "Unknown date";
  }

  return new Date(dateString).toLocaleString();
}

export default ActivityLogsPage;
