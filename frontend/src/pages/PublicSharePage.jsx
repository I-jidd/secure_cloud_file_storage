import { useParams } from "react-router-dom";

function PublicSharePage() {
  const { token } = useParams();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Public Share</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Shared File
      </h1>
      <p className="mt-3 break-all text-sm text-slate-600">Token: {token}</p>
    </div>
  );
}

export default PublicSharePage;
