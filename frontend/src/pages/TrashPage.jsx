import { useEffect, useState } from "react";
import { FileText, Folder, RotateCcw, Trash2 } from "lucide-react";

import { getDeletedFiles, restoreFile } from "../api/fileApi";
import { getDeletedFolders, restoreFolder } from "../api/folderApi";
import { formatBytes } from "../utils/formatBytes";

function TrashPage() {
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [deletedFolders, setDeletedFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [restoringFileId, setRestoringFileId] = useState(null);
  const [restoringFolderId, setRestoringFolderId] = useState(null);

  async function loadTrash() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [fileData, folderData] = await Promise.all([
        getDeletedFiles(),
        getDeletedFolders(),
      ]);

      setDeletedFiles(fileData);
      setDeletedFolders(folderData);
    } catch (error) {
      setErrorMessage("Failed to load trash");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    loadTrash();
  }, []);

  async function handleRestoreFile(file) {
    try {
      setRestoringFileId(file.id);
      setErrorMessage("");

      await restoreFile(file.id);

      await loadTrash();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to restore file.");
      }
    } finally {
      setRestoringFileId(null);
    }
  }
  async function handleRestoreFolder(folder) {
    try {
      setRestoringFolderId(folder.id);
      setErrorMessage("");

      await restoreFolder(folder.id);

      await loadTrash();
    } catch (error) {
      console.log("RESTORE FOLDER ERROR STATUS:", error.response?.status);
      console.log("RESTORE FOLDER ERROR DATA:", error.response?.data);
      console.log("RESTORE FOLDER ERROR MESSAGE:", error.message);

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to restore folder.");
      }
    } finally {
      setRestoringFolderId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading Trash...</p>
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

  const isTrashEmpty = deletedFiles.length === 0 && deletedFolders === 0;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500">Deleted Items</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Trash</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Deleted files and folders appear here before permanent cleanup.
        </p>
      </section>

      {isTrashEmpty ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Trash2 className="mx-auto text-slate-400" size={32} />
            <p className="mt-4 text-sm font-medium text-slate-700">
              Trash is empty
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Deleted files and folders will appear here.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Deleted folders</h2>
              <p className="mt-1 text-sm text-slate-500">
                {deletedFolders.length} folder
                {deletedFolders.length === 1 ? "" : "s"} in Trash
              </p>
            </div>

            <div className="mt-5">
              {deletedFolders.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {deletedFolders.map((folder) => (
                    <DeletedFolderCard
                      key={folder.id}
                      folder={folder}
                      onRestore={handleRestoreFolder}
                      isRestoring={restoringFolderId === folder.id}
                    />
                  ))}
                </div>
              ) : (
                <MiniEmptyState message="No deleted folders." />
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold">Deleted files</h2>
              <p className="mt-1 text-sm text-slate-500">
                {deletedFiles.length} file
                {deletedFiles.length === 1 ? "" : "s"} in Trash
              </p>
            </div>

            <div className="mt-5">
              {deletedFiles.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {deletedFiles.map((file) => (
                    <DeletedFileRow
                      key={file.id}
                      file={file}
                      onRestore={handleRestoreFile}
                      isRestoring={restoringFileId === file.id}
                    />
                  ))}
                </div>
              ) : (
                <MiniEmptyState message="No deleted files." />
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function DeletedFolderCard({ folder, onRestore, isRestoring }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <Folder size={24} className="text-slate-500" />

      <p className="mt-4 truncate font-medium">{folder.name}</p>

      <p className="mt-1 text-xs text-slate-500">
        Deleted {formatDate(folder.deleted_at)}
      </p>

      <button
        type="button"
        onClick={() => onRestore(folder)}
        disabled={isRestoring}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCcw size={14} />
        {isRestoring ? "Restoring..." : "Restore"}
      </button>
    </div>
  );
}

function DeletedFileRow({ file, onRestore, isRestoring }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <FileText size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{file.original_name}</p>
        <p className="text-xs text-slate-500">
          {file.mime_type || "Unknown type"} · {formatBytes(file.size_bytes)} ·
          Deleted {formatDate(file.deleted_at)}
        </p>
      </div>

      <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">
        Deleted
      </span>

      <button
        type="button"
        onClick={() => onRestore(file)}
        disabled={isRestoring}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCcw size={16} />
        {isRestoring ? "Restoring..." : "Restore"}
      </button>
    </div>
  );
}

function MiniEmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "unknown date";
  }

  return new Date(dateString).toLocaleString();
}

export default TrashPage;
