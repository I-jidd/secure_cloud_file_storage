import { Activity, FileText, HardDrive, Link2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
  const { user } = useAuth();

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
          value="18.7 GB"
          subtext="Dashboard API will replace this"
        />
        <MetricCard
          icon={FileText}
          label="Total files"
          value="284"
          subtext="Active and deleted metadata"
        />
        <MetricCard
          icon={Link2}
          label="Shared links"
          value="26"
          subtext="Public access tokens"
        />
        <MetricCard
          icon={Activity}
          label="Activity logs"
          value="1,204"
          subtext="Backend audit trail"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent uploads</h2>
              <p className="mt-1 text-sm text-slate-500">
                Files uploaded recently will appear here.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No live data connected yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              We will connect this to /api/dashboard/summary later.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Uploads, downloads, shares, deletes, and restores.
          </p>

          <div className="mt-6 space-y-4">
            <ActivityItem action="Uploaded" target="capstone_report.pdf" />
            <ActivityItem action="Shared" target="family_archive.zip" />
            <ActivityItem action="Restored" target="school_works folder" />
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

function ActivityItem({ action, target }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-950" />
      <div>
        <p className="text-sm text-slate-700">
          <span className="font-medium text-slate-950">{action}</span> {target}
        </p>
        <p className="text-xs text-slate-400">Placeholder activity</p>
      </div>
    </div>
  );
}

export default DashboardPage;
