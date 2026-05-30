import { Activity } from "lucide-react";

const placeholderLogs = [
  "Uploaded Capstone_Final_Report.pdf",
  "Downloaded Emergency_Response_Map.png",
  "Created share link for Family_Archive_2026.zip",
  "Disabled share link",
  "Restored School Works folder",
];

function ActivityLogsPage() {
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
        <h2 className="text-lg font-semibold">Recent activity</h2>

        <div className="mt-6 space-y-3">
          {placeholderLogs.map((log) => (
            <div
              key={log}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <Activity size={18} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">{log}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Placeholder timestamp
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ActivityLogsPage;
