import { useEffect, useState } from "react";
import { Copy, Link2, Lock, ShieldCheck, ToggleLeft } from "lucide-react";

import { getShareLinks } from "../api/shareLinkApi";

function SharedLinksPage() {
  const [shareLinks, setShareLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadShareLinks() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getShareLinks();
        setShareLinks(data);
      } catch (error) {
        setErrorMessage("Failed to load shared links.");
      } finally {
        setIsLoading(false);
      }
    }

    loadShareLinks();
  }, []);

  const activeLinks = shareLinks.filter((link) => link.is_active);
  const protectedLinks = shareLinks.filter((link) => link.has_password);
  const disabledLinks = shareLinks.filter((link) => !link.is_active);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading shared links...</p>
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
        <InfoCard
          icon={Link2}
          title="Active links"
          value={activeLinks.length}
        />
        <InfoCard
          icon={Lock}
          title="Password protected"
          value={protectedLinks.length}
        />
        <InfoCard
          icon={ShieldCheck}
          title="Disabled links"
          value={disabledLinks.length}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Shared link list</h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing {shareLinks.length} share link
              {shareLinks.length === 1 ? "" : "s"}.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            Live data
          </span>
        </div>

        <div className="mt-6">
          {shareLinks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {shareLinks.map((shareLink) => (
                <ShareLinkRow key={shareLink.id} shareLink={shareLink} />
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

function ShareLinkRow({ shareLink }) {
  const publicUrl = `${window.location.origin}/public/share/${shareLink.token}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      window.alert("Share link copied to clipboard.");
    } catch {
      window.prompt("Copy this share link:", publicUrl);
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <Link2 size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-950">
          File ID: {shareLink.file_id}
        </p>

        <p className="mt-1 break-all text-xs text-slate-500">{publicUrl}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge
            label={shareLink.is_active ? "Active" : "Disabled"}
            type={shareLink.is_active ? "active" : "disabled"}
          />

          <StatusBadge
            label={
              shareLink.has_password ? "Password protected" : "No password"
            }
            type={shareLink.has_password ? "protected" : "neutral"}
          />

          <StatusBadge
            label={
              shareLink.expires_at
                ? `Expires ${formatDate(shareLink.expires_at)}`
                : "No expiration"
            }
            type="neutral"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
      >
        <Copy size={16} />
        Copy
      </button>
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

function StatusBadge({ label, type }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700",
    disabled: "bg-red-50 text-red-700",
    protected: "bg-blue-50 text-blue-700",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs ${styles[type]}`}>
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <ToggleLeft className="mx-auto text-slate-400" size={32} />
      <p className="mt-4 text-sm font-medium text-slate-700">
        No shared links yet
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Create a share link from My Files and it will appear here.
      </p>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "unknown date";
  }

  return new Date(dateString).toLocaleString();
}

export default SharedLinksPage;
