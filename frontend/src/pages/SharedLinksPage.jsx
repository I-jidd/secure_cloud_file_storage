import { Link2, Lock, ShieldCheck } from "lucide-react";

function SharedLinksPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500">Sharing</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Shared Links
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Manage public file links, password protection, expiration, and
          disabled states.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={Link2} title="Public links" value="26" />
        <InfoCard icon={Lock} title="Password protected" value="4" />
        <InfoCard icon={ShieldCheck} title="Disabled links" value="3" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Shared link list</h2>
        <p className="mt-1 text-sm text-slate-500">
          This will connect to GET /api/share-links later.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No live shared-link data connected yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Generated tokens, active state, expiration, and password status will
            appear here.
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon size={20} className="text-slate-400" />
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{title}</p>
    </div>
  );
}

export default SharedLinksPage;
