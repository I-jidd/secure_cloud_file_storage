import { Inbox } from "lucide-react";

function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message = "Items will appear here once available.",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <Icon className="mx-auto text-slate-400" size={32} />

      <p className="mt-4 text-sm font-medium text-slate-700">{title}</p>

      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default EmptyState;
