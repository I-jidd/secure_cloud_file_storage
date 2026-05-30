import { FileText, Folder, Search, Upload } from "lucide-react";

function MyFilesPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-slate-500">Storage</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            My Files
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Browse your folders and files. Search, upload, rename, share,
            delete, and restore items securely.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
          <Upload size={17} />
          Upload file
        </button>
      </section>

      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search files and folders..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Folders</h2>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
            New folder
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "School Works",
            "Family Photos",
            "Encrypted PDFs",
            "Shared Projects",
          ].map((folder) => (
            <div
              key={folder}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
            >
              <Folder size={24} className="text-slate-500" />
              <p className="mt-4 font-medium">{folder}</p>
              <p className="mt-1 text-xs text-slate-500">Placeholder folder</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Files</h2>

        <div className="mt-5 divide-y divide-slate-100">
          {[
            "Capstone_Final_Report.pdf",
            "Emergency_Response_Map.png",
            "System_Backup_Notes.txt",
          ].map((file) => (
            <div key={file} className="flex items-center gap-4 py-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file}</p>
                <p className="text-xs text-slate-500">
                  Placeholder file · API data later
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                Active
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MyFilesPage;
