import {
  Activity,
  ArrowRight,
  Download,
  ExternalLink,
  FileText,
  Folder,
  Link2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
            SC
          </div>

          <div>
            <p className="font-semibold tracking-tight">SecureCloud</p>
            <p className="text-xs text-slate-500">Storage & sharing</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-950">
            Features
          </a>
          <a href="#security" className="transition hover:text-slate-950">
            Security
          </a>
          <a href="#workflow" className="transition hover:text-slate-950">
            Workflow
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="hidden rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 sm:inline-flex"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pt-20">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <ShieldCheck size={16} />
            JWT-secured file storage platform
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Secure file storage built for private sharing.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            Upload, organize, recover, and share files safely with protected
            routes, soft delete, activity logs, password-protected links, and
            expiring public access.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Start storing securely
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Open dashboard
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <MiniStat label="Files secured" value="284" />
            <MiniStat label="Shared links" value="26" />
            <MiniStat label="Audit logs" value="1.2k" />
          </div>
        </div>

        <ProductPreview />
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            icon={Upload}
            title="Secure uploads"
            description="Files are uploaded through the backend with type, size, ownership, and storage checks."
          />
          <FeatureCard
            icon={Folder}
            title="Nested folders"
            description="Organize files with folder hierarchy, breadcrumbs, rename, delete, and restore actions."
          />
          <FeatureCard
            icon={Link2}
            title="Protected sharing"
            description="Create token-based links with optional password protection and expiration dates."
          />
          <FeatureCard
            icon={Activity}
            title="Activity logs"
            description="Every important user action is recorded by the backend for audit visibility."
          />
        </div>
      </section>

      <section
        id="security"
        className="mx-auto grid max-w-7xl gap-6 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"
      >
        <div>
          <p className="text-sm text-slate-500">Security design</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight">
            Private by default. Shared only through secure tokens.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            SecureCloud avoids exposing storage paths. Files are downloaded
            through API routes where ownership, deletion state, and public link
            validity are checked first.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SecurityCard
            icon={Lock}
            title="Password hashing"
            text="User passwords and share-link passwords are stored as hashes, never plain text."
          />
          <SecurityCard
            icon={ShieldCheck}
            title="Ownership checks"
            text="Private files and folders are filtered by the logged-in user's JWT identity."
          />
          <SecurityCard
            icon={RotateCcw}
            title="Soft delete"
            text="Deleted files and folders are moved to Trash and can be restored safely."
          />
          <SecurityCard
            icon={Download}
            title="Backend downloads"
            text="Downloads go through FastAPI instead of direct disk access."
          />
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="grid gap-6 lg:grid-cols-4">
            <WorkflowStep
              number="01"
              title="Upload"
              text="Store files safely through protected backend routes."
            />
            <WorkflowStep
              number="02"
              title="Organize"
              text="Create folders, rename items, and browse nested paths."
            />
            <WorkflowStep
              number="03"
              title="Recover"
              text="Restore deleted files and folders from Trash."
            />
            <WorkflowStep
              number="04"
              title="Share"
              text="Generate public links with passwords and expiration."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm lg:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Ready to manage files securely?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Sign in to access your secure dashboard, upload files, create
                folders, and manage public share links.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
            >
              Create account
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
      <div className="rounded-[1.5rem] border border-slate-200 bg-[#fbfaf7] p-4">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              My Files
            </p>
            <h3 className="mt-1 text-xl font-semibold">School Works</h3>
          </div>

          <button className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-medium text-white">
            Upload
          </button>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-slate-950 bg-slate-950 px-3 py-1 text-white">
            Root
          </span>
          <span className="text-slate-400">/</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
            School Works
          </span>
          <span className="text-slate-400">/</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">
            Capstone
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FolderPreview name="Reports" />
          <FolderPreview name="Images" />
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium">Recent files</p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              Active
            </span>
          </div>

          <FilePreview name="capstone-report.pdf" size="2.4 MB" />
          <FilePreview name="system-diagram.png" size="840 KB" />
          <FilePreview name="security-notes.txt" size="18 KB" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <PreviewAction icon={ExternalLink} label="Open" />
          <PreviewAction icon={Link2} label="Share" />
          <PreviewAction icon={Download} label="Download" />
        </div>
      </div>
    </div>
  );
}

function FolderPreview({ name }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Folder size={22} className="text-slate-500" />
      <p className="mt-3 text-sm font-medium">{name}</p>
      <p className="mt-1 text-xs text-slate-500">Folder</p>
    </div>
  );
}

function FilePreview({ name, size }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 py-3 first:border-t-0">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <FileText size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-slate-500">{size}</p>
      </div>
    </div>
  );
}

function PreviewAction({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
      <Icon size={14} />
      {label}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
        <Icon size={20} />
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function SecurityCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon size={22} className="text-slate-500" />

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function WorkflowStep({ number, title, text }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-400">{number}</p>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

export default LandingPage;
