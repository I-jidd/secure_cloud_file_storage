import { useEffect, useState } from "react";
import { Download, FileText, Folder, Search, Upload } from "lucide-react";

import { getFiles, uploadFile, downloadFile } from "../api/fileApi";
import { getFolders, createFolder } from "../api/folderApi";
import { formatBytes } from "../utils/formatBytes";

function MyFilesPage() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function loadMyFiles() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [folderData, fileData] = await Promise.all([
        getFolders(),
        getFiles(),
      ]);

      setFolders(folderData);
      setFiles(fileData);
    } catch (error) {
      setErrorMessage("Failed to load files and folders.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMyFiles();
  }, []);

  async function handleCreateFolder() {
    const folderName = window.prompt("Enter folder name");

    if (!folderName) {
      return;
    }

    const trimmedName = folderName.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setIsCreatingFolder(true);
      setErrorMessage("");

      await createFolder({
        name: trimmedName,
        parentFolderId: null,
      });

      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to create folder.");
      }
    } finally {
      setIsCreatingFolder(false);
    }
  }

  async function handleUploadFile() {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");

      await uploadFile({
        file: selectedFile,
        folderId: null,
      });

      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to upload file.");
      }
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleDownloadFile(file) {
    try {
      setErrorMessage("");

      const blob = await downloadFile(file.id);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.original_name;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to download file.");
      }
    }
  }
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredFiles = files.filter((file) =>
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading files and folders...</p>
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

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
          <Upload size={17} />
          {isUploading ? "Uploading..." : "Upload file"}

          <input
            type="file"
            className="hidden"
            onChange={handleUploadFile}
            disabled={isUploading}
          />
        </label>
      </section>

      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search files and folders..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Folders</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredFolders.length} folder
              {filteredFolders.length === 1 ? "" : "s"} found
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateFolder}
            disabled={isCreatingFolder}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingFolder ? "Creating..." : "New folder"}
          </button>
        </div>

        <div className="mt-5">
          {filteredFolders.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredFolders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No folders found"
              message="Create a folder to organize your files."
            />
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Files</h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredFiles.length} file{filteredFiles.length === 1 ? "" : "s"}{" "}
            found
          </p>
        </div>

        <div className="mt-5">
          {filteredFiles.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredFiles.map((file) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onDownload={handleDownloadFile}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No files found"
              message="Uploaded files will appear here."
            />
          )}
        </div>
      </section>
    </div>
  );
}
function FolderCard({ folder }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
      <Folder size={24} className="text-slate-500" />

      <p className="mt-4 truncate font-medium">{folder.name}</p>

      <p className="mt-1 text-xs text-slate-500">
        {folder.parent_folder_id ? "Subfolder" : "Root folder"}
      </p>
    </div>
  );
}

function FileRow({ file, onDownload }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <FileText size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{file.original_name}</p>
        <p className="text-xs text-slate-500">
          {file.mime_type || "Unknown type"} · {formatBytes(file.size_bytes)}
        </p>
      </div>

      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
        Active
      </span>

      <button
        type="button"
        onClick={() => onDownload(file)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
      >
        <Download size={16} />
        Download
      </button>
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default MyFilesPage;
