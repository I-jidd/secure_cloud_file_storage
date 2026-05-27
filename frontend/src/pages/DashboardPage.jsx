import { useEffect, useState } from "react";

import apiClient from "../api/apiClient";

function DashboardPage() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    apiClient
      .get("/health/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setMessage("Backend connection failed");
      });
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Overview</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 text-slate-600">{message}</p>
    </div>
  );
}

export default DashboardPage;
