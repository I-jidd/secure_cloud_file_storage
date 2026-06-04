import { useEffect, useState } from "react";
import {
  CalendarClock,
  Download,
  FileText,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useParams } from "react-router-dom";

import {
  downloadPublicSharedFile,
  downloadPublicSharedFileWithPassword,
  getPublicShareMetadata,
  verifyPublicSharePassword,
} from "../api/shareLinkApi";
import Button from "../components/Button";
import Input from "../components/Input";
import { formatBytes } from "../utils/formatBytes";

function PublicSharePage() {
  const { token } = useParams();

  const [sharedFile, setSharedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

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

  async function handleVerifyPassword(event) {
    event.preventDefault();

    if (!password.trim()) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      setIsVerifyingPassword(true);
      setErrorMessage("");

      const data = await verifyPublicSharePassword(token, password.trim());

      setSharedFile(data);
      setIsPasswordVerified(true);
      setVerifiedPassword(password.trim());
      setPassword("");
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Invalid or failed password verification.");
      }
    } finally {
      setIsVerifyingPassword(false);
    }
  }

  async function handleDownload() {
    try {
      setIsDownloading(true);
      setErrorMessage("");

      const blob =
        sharedFile.requires_password && isPasswordVerified
          ? await downloadPublicSharedFileWithPassword(token, verifiedPassword)
          : await downloadPublicSharedFile(token);

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
      <PublicShell>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading shared file...</p>
        </div>
      </PublicShell>
    );
  }

  if (errorMessage && !sharedFile) {
    return (
      <PublicShell>
        <section className="w-full max-w-md rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <ShieldAlert className="mx-auto text-red-500" size={40} />

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-red-700">
            Link unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-700">{errorMessage}</p>

          <p className="mt-5 text-xs leading-5 text-red-600">
            This link may be disabled, expired, deleted, or invalid.
          </p>
        </section>
      </PublicShell>
    );
  }

  const isLocked = sharedFile.requires_password && !isPasswordVerified;

  return (
    <PublicShell>
      <section className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-slate-100 text-slate-600">
            <FileText size={30} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-500">Public shared file</p>

            <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight">
              {sharedFile.original_name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                icon={ShieldCheck}
                label={sharedFile.requires_password ? "Protected" : "Public"}
                type={sharedFile.requires_password ? "protected" : "active"}
              />

              <StatusBadge
                icon={CalendarClock}
                label={
                  sharedFile.expires_at
                    ? `Expires ${formatDate(sharedFile.expires_at)}`
                    : "No expiration"
                }
                type="neutral"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              File type
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {sharedFile.mime_type || "Unknown type"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              File size
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {formatBytes(sharedFile.size_bytes)}
            </p>
          </div>
        </div>

        {isLocked && (
          <form
            onSubmit={handleVerifyPassword}
            className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-600 shadow-sm">
                <Lock size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-950">
                  Password required
                </p>
                <p className="text-xs text-slate-500">
                  Enter the share password to unlock this file.
                </p>
              </div>
            </div>

            <Input
              label="Share password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter password"
            />

            <Button
              type="submit"
              size="lg"
              className="mt-4 w-full"
              disabled={isVerifyingPassword}
            >
              {isVerifyingPassword ? "Verifying..." : "Verify password"}
            </Button>
          </form>
        )}

        {sharedFile.requires_password && isPasswordVerified && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Password verified. You can now download the file.
          </div>
        )}

        {errorMessage && sharedFile && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <Button
          size="lg"
          onClick={handleDownload}
          disabled={isDownloading || isLocked}
          className="mt-6 w-full"
        >
          <Download size={17} />
          {isLocked
            ? "Verify password first"
            : isDownloading
              ? "Downloading..."
              : "Download file"}
        </Button>

        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
          This file is delivered securely through the backend using a public
          share token.
        </p>
      </section>
    </PublicShell>
  );
}

function PublicShell({ children }) {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-6 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
              SC
            </div>

            <div>
              <p className="font-semibold tracking-tight">SecureCloud</p>
              <p className="text-xs text-slate-500">Public file sharing</p>
            </div>
          </div>

          <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm sm:inline-flex">
            Token-based access
          </span>
        </header>

        <div className="grid flex-1 place-items-center">{children}</div>
      </div>
    </main>
  );
}

function StatusBadge({ icon: Icon, label, type }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700",
    protected: "bg-blue-50 text-blue-700",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${styles[type]}`}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "unknown date";
  }

  return new Date(dateString).toLocaleString();
}

export default PublicSharePage;
