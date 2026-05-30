import { RotateCcw, Trash2 } from "lucide-react";

function TrashPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500">Deleted Items</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Trash</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Deleted files and folders appear here before permanent cleanup.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Trash2 className="mx-auto text-slate-400" size={32} />
          <p className="mt-4 text-sm font-medium text-slate-700">
            Trash page placeholder
          </p>
          <p className="mt-1 text-sm text-slate-500">
            We will connect this to file and folder trash endpoints later.
          </p>
          <button className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100">
            <RotateCcw size={16} />
            Restore selected
          </button>
        </div>
      </section>
    </div>
  );
}

export default TrashPage;
