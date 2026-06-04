import { useEffect, useState } from "react";
import { Download, FileText, ShieldAlert } from "lucide-react";
import { useParams } from "react-router-dom";

import {
  downloadPublicSharedFile,
  getPublicShareMetadata,
} from "../api/shareLinkApi";
import { formatBytes } from "../utils/formatBytes";

function PublicSharePage() {
  const { token } = useParams();

  const [sharedFile, setSharedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSharedFile() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getPublicShareMetadata(token);
        setSharedFile(data);
      } catch (error) {
        const detail = error.response?.data?.detail;

        if (typeof detail === "string") {
          setErrorMessage(detail);
        } else {
          setErrorMessage("Shared file is not available.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadSharedFile();
  }, [token]);

  async function handleDownload() {
    try {
      setIsDownloading(true);
      setErrorMessage("");

      const blob = await downloadPublicSharedFile(token);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = sharedFile.original_name;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to download shared file.");
      }
    } finally {
      setIsDownloading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f4ef] px-6 text-slate-950">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading shared file...</p>
        </div>
      </main>
    );
  }

  if (errorMessage && !sharedFile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f4ef] px-6 text-slate-950">
        <section className="w-full max-w-md rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <ShieldAlert className="mx-auto text-red-500" size={36} />

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-red-700">
            Link unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-700">{errorMessage}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f4ef] px-6 py-10 text-slate-950">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-600">
          <FileText size={26} />
        </div>

        <p className="mt-6 text-sm text-slate-500">Public Share</p>

        <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight">
          {sharedFile.original_name}
        </h1>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>Type: {sharedFile.mime_type || "Unknown type"}</p>
          <p>Size: {formatBytes(sharedFile.size_bytes)}</p>
          <p>
            Expiration:{" "}
            {sharedFile.expires_at
              ? new Date(sharedFile.expires_at).toLocaleString()
              : "No expiration"}
          </p>
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || sharedFile.requires_password}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Download size={17} />
          {sharedFile.requires_password
            ? "Password required"
            : isDownloading
              ? "Downloading..."
              : "Download file"}
        </button>

        {sharedFile.requires_password && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Password-protected public download will be connected in the next
            step.
          </p>
        )}
      </section>
    </main>
  );
}

export default PublicSharePage;
