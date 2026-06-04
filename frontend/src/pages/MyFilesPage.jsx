import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Folder,
  PencilLine,
  Search,
  Trash2,
  Upload,
  Link2,
} from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import {
  getFiles,
  uploadFile,
  downloadFile,
  deleteFile,
  renameFile,
} from "../api/fileApi";
import {
  getFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "../api/folderApi";
import { createFileShareLink } from "../api/shareLinkApi";

import { formatBytes } from "../utils/formatBytes";

function MyFilesPage() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);

  //Modals
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderNameError, setNewFolderNameError] = useState("");
  const [isRenameFileModalOpen, setIsRenameFileModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [renameFileName, setRenameFileName] = useState("");
  const [renameFileNameError, setRenameFileNameError] = useState("");
  const [isRenamingFile, setIsRenamingFile] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [renameFolderNameError, setRenameFolderNameError] = useState("");
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteTargetType, setDeleteTargetType] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [sharePassword, setSharePassword] = useState("");
  const [shareExpiration, setShareExpiration] = useState("");
  const [shareError, setShareError] = useState("");
  const [isCreatingShareLink, setIsCreatingShareLink] = useState(false);
  const [createdShareUrl, setCreatedShareUrl] = useState("");

  async function loadMyFiles() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const folderId = currentFolder?.id || null;

      const [folderData, fileData] = await Promise.all([
        getFolders(folderId),
        getFiles(folderId),
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
  }, [currentFolder]);

  async function handleCreateFolder() {
    const trimmedName = newFolderName.trim();

    if (!trimmedName) {
      setNewFolderNameError("Folder name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setNewFolderNameError("Folder name must be 100 characters or less.");
      return;
    }

    try {
      setIsCreatingFolder(true);
      setErrorMessage("");
      setNewFolderNameError("");

      await createFolder({
        name: trimmedName,
        parentFolderId: currentFolder?.id || null,
      });

      closeCreateFolderModal();
      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setNewFolderNameError(detail);
      } else {
        setNewFolderNameError("Failed to create folder.");
      }
    } finally {
      setIsCreatingFolder(false);
    }
  }

  async function handleDeleteFolder(folder) {
    try {
      setIsDeleting(true);
      setErrorMessage("");

      await deleteFolder(folder.id);

      if (currentFolder?.id === folder.id) {
        setCurrentFolder(null);
      }

      closeDeleteModal();
      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to delete folder.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRenameFolder() {
    if (!folderToRename) {
      return;
    }

    const trimmedName = renameFolderName.trim();

    if (!trimmedName) {
      setRenameFolderNameError("Folder name is required.");
      return;
    }

    if (trimmedName.length > 100) {
      setRenameFolderNameError("Folder name must be 100 characters or less.");
      return;
    }

    if (trimmedName === folderToRename.name) {
      closeRenameFolderModal();
      return;
    }

    try {
      setIsRenamingFolder(true);
      setErrorMessage("");
      setRenameFolderNameError("");

      await renameFolder(folderToRename.id, trimmedName);

      if (currentFolder?.id === folderToRename.id) {
        setCurrentFolder({
          ...folderToRename,
          name: trimmedName,
        });
      }

      closeRenameFolderModal();
      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setRenameFolderNameError(detail);
      } else {
        setRenameFolderNameError("Failed to rename folder.");
      }
    } finally {
      setIsRenamingFolder(false);
    }
  }

  async function handleUploadFile(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    try {
      setIsRenamingFile(true);
      setErrorMessage("");
      setRenameFileNameError("");

      await renameFile(fileToRename.id, trimmedName);

      closeRenameFileModal();
      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setRenameFileNameError(detail);
      } else {
        setRenameFileNameError("Failed to rename file.");
      }
    } finally {
      setIsRenamingFile(false);
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

  async function handleRenameFile() {
    if (!fileToRename) {
      return;
    }

    const trimmedName = renameFileName.trim();

    if (!trimmedName) {
      setRenameFileNameError("File name is required.");
      return;
    }

    if (trimmedName.length > 255) {
      setRenameFileNameError("File name must be 255 characters or less.");
      return;
    }

    if (trimmedName === fileToRename.original_name) {
      closeRenameFileModal();
      return;
    }

    try {
      setIsRenamingFile(true);
      setErrorMessage("");
      setRenameFileNameError("");

      await renameFile(fileToRename.id, trimmedName);

      closeRenameFileModal();
      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setRenameFileNameError(detail);
      } else {
        setRenameFileNameError("Failed to rename file.");
      }
    } finally {
      setIsRenamingFile(false);
    }
  }

  async function handleDeleteFile(file) {
    try {
      setIsDeleting(true);
      setErrorMessage("");

      await deleteFile(file.id);

      closeDeleteModal();
      await loadMyFiles();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Failed to delete file.");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCreateShareLink() {
    if (!fileToShare) {
      return;
    }

    const shareData = {};

    const trimmedPassword = sharePassword.trim();
    const trimmedExpiration = shareExpiration.trim();

    if (trimmedPassword) {
      if (trimmedPassword.length < 6) {
        setShareError("Share password must be at least 6 characters.");
        return;
      }

      shareData.password = trimmedPassword;
    }

    if (trimmedExpiration) {
      const expirationDate = parseExpirationInput(trimmedExpiration);

      if (!expirationDate) {
        setShareError("Invalid expiration format. Use YYYY-MM-DD HH:MM.");
        return;
      }

      if (expirationDate <= new Date()) {
        setShareError("Expiration date must be in the future.");
        return;
      }

      shareData.expires_at = expirationDate.toISOString();
    }

    try {
      setIsCreatingShareLink(true);
      setShareError("");
      setErrorMessage("");

      const shareLink = await createFileShareLink(fileToShare.id, shareData);
      const publicUrl = `${window.location.origin}/public/share/${shareLink.token}`;

      setCreatedShareUrl(publicUrl);

      try {
        await navigator.clipboard.writeText(publicUrl);
      } catch {}
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setShareError(detail);
      } else {
        setShareError("Failed to create share link.");
      }
    } finally {
      setIsCreatingShareLink(false);
    }
  }

  async function handleCopyCreatedShareUrl() {
    if (!createdShareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createdShareUrl);
    } catch {
      setShareError(
        "Could not copy automatically. Please copy the link manually.",
      );
    }
  }

  function openCreateFolderModal() {
    setNewFolderName("");
    setNewFolderNameError("");
    setIsCreateFolderModalOpen(true);
  }

  function closeCreateFolderModal() {
    if (isCreatingFolder) {
      return;
    }
    setIsCreateFolderModalOpen(false);
    setNewFolderName("");
    setNewFolderNameError("");
  }

  function openRenameFileModal(file) {
    setFileToRename(file);
    setRenameFileName(file.original_name);
    setRenameFileNameError("");
    setIsRenameFileModalOpen(true);
  }

  function closeRenameFileModal() {
    if (isRenamingFile) {
      return;
    }

    setIsRenameFileModalOpen(false);
    setFileToRename(null);
    setRenameFileName("");
    setRenameFileNameError("");
  }

  function openRenameFolderModal(folder) {
    setFolderToRename(folder);
    setRenameFolderName(folder.name);
    setRenameFolderNameError("");
    setIsRenameFolderModalOpen(true);
  }

  function closeRenameFolderModal() {
    if (isRenamingFolder) {
      return;
    }

    setIsRenameFolderModalOpen(false);
    setFolderToRename(null);
    setRenameFolderName("");
    setRenameFolderNameError("");
  }

  function openDeleteFileModal(file) {
    setDeleteTarget(file);
    setDeleteTargetType("file");
    setIsDeleteModalOpen(true);
  }

  function openDeleteFolderModal(folder) {
    setDeleteTarget(folder);
    setDeleteTargetType("folder");
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
    setDeleteTargetType("");
    setIsDeleteModalOpen(false);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }

    if (deleteTargetType === "file") {
      handleDeleteFile(deleteTarget);
      return;
    }

    if (deleteTargetType === "folder") {
      handleDeleteFolder(deleteTarget);
    }
  }

  function openShareModal(file) {
    setFileToShare(file);
    setSharePassword("");
    setShareExpiration("");
    setShareError("");
    setCreatedShareUrl("");
    setIsShareModalOpen(true);
  }

  function closeShareModal() {
    if (isCreatingShareLink) {
      return;
    }

    setIsShareModalOpen(false);
    setFileToShare(null);
    setSharePassword("");
    setShareExpiration("");
    setShareError("");
    setCreatedShareUrl("");
  }

  function handleOpenFolder(folder) {
    setSearchTerm("");
    setCurrentFolder(folder);
  }

  function handleBackToRoot() {
    setSearchTerm("");
    setCurrentFolder(null);
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

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={handleBackToRoot}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:bg-slate-100"
            >
              Root
            </button>

            {currentFolder && (
              <>
                <span className="text-slate-400">/</span>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-white">
                  {currentFolder.name}
                </span>
              </>
            )}
          </div>
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
            <h2 className="text-lg font-semibold">
              {currentFolder ? `Folders in ${currentFolder.name}` : "Folders"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredFolders.length} folder
              {filteredFolders.length === 1 ? "" : "s"} found
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={openCreateFolderModal}
            disabled={isCreatingFolder}
          >
            New folder
          </Button>
        </div>

        <div className="mt-5">
          {filteredFolders.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={handleOpenFolder}
                  onRename={openRenameFolderModal}
                  onDelete={openDeleteFolderModal}
                />
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
          <h2 className="text-lg font-semibold">
            {currentFolder ? `Files in ${currentFolder.name}` : "Files"}
          </h2>
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
                  onRename={openRenameFileModal}
                  onDownload={handleDownloadFile}
                  onDelete={openDeleteFileModal}
                  onShare={openShareModal}
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
      <Modal
        isOpen={isCreateFolderModalOpen}
        title="Create folder"
        description={
          currentFolder
            ? `Create a new folder inside "${currentFolder.name}".`
            : "Create a new folder at the root level."
        }
        confirmText="Create folder"
        onClose={closeCreateFolderModal}
        onConfirm={handleCreateFolder}
        isSubmitting={isCreatingFolder}
      >
        <Input
          label="Folder name"
          value={newFolderName}
          onChange={(event) => {
            setNewFolderName(event.target.value);
            setNewFolderNameError("");
          }}
          placeholder="Example: School Works"
          error={newFolderNameError}
          autoFocus
        />
      </Modal>
      <Modal
        isOpen={isRenameFileModalOpen}
        title="Rename file"
        description="Change the display name of this file. The stored backend filename will remain unchanged."
        confirmText="Save changes"
        onClose={closeRenameFileModal}
        onConfirm={handleRenameFile}
        isSubmitting={isRenamingFile}
      >
        <Input
          label="File name"
          value={renameFileName}
          onChange={(event) => {
            setRenameFileName(event.target.value);
            setRenameFileNameError("");
          }}
          placeholder="Example: report.pdf"
          error={renameFileNameError}
          autoFocus
        />
      </Modal>
      <Modal
        isOpen={isRenameFolderModalOpen}
        title="Rename folder"
        description="Change the folder name. Ownership and folder location will remain unchanged."
        confirmText="Save changes"
        onClose={closeRenameFolderModal}
        onConfirm={handleRenameFolder}
        isSubmitting={isRenamingFolder}
      >
        <Input
          label="Folder name"
          value={renameFolderName}
          onChange={(event) => {
            setRenameFolderName(event.target.value);
            setRenameFolderNameError("");
          }}
          placeholder="Example: School Works"
          error={renameFolderNameError}
          autoFocus
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        title={
          deleteTargetType === "folder"
            ? "Move folder to Trash?"
            : "Move file to Trash?"
        }
        description={
          deleteTargetType === "folder"
            ? `This will move "${deleteTarget?.name}" and its subfolders to Trash. You can restore it later.`
            : `This will move "${deleteTarget?.original_name}" to Trash. You can restore it later.`
        }
        confirmText={isDeleting ? "Deleting..." : "Move to Trash"}
        confirmVariant="danger"
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isSubmitting={isDeleting}
      />
      <Modal
        isOpen={isShareModalOpen}
        title="Create share link"
        description={
          fileToShare
            ? `Create a public share link for "${fileToShare.original_name}".`
            : "Create a public share link."
        }
        confirmText={createdShareUrl ? "Done" : "Create link"}
        onClose={closeShareModal}
        onConfirm={createdShareUrl ? closeShareModal : handleCreateShareLink}
        isSubmitting={isCreatingShareLink}
      >
        {!createdShareUrl ? (
          <div className="space-y-4">
            <Input
              label="Optional password"
              type="password"
              value={sharePassword}
              onChange={(event) => {
                setSharePassword(event.target.value);
                setShareError("");
              }}
              placeholder="Leave empty for no password"
            />

            <Input
              label="Optional expiration"
              value={shareExpiration}
              onChange={(event) => {
                setShareExpiration(event.target.value);
                setShareError("");
              }}
              placeholder="YYYY-MM-DD HH:MM"
            />

            <p className="text-xs leading-5 text-slate-500">
              Example expiration: 2027-01-01 18:30. Leave empty if the link
              should not expire.
            </p>

            {shareError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {shareError}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Share link created. The link was copied to your clipboard if your
              browser allowed it.
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Public URL</p>
              <div className="mt-2 break-all rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                {createdShareUrl}
              </div>
            </div>

            <Button variant="secondary" onClick={handleCopyCreatedShareUrl}>
              Copy link again
            </Button>

            {shareError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {shareError}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
function FolderCard({ folder, onOpen, onDelete, onRename }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpen(folder)}
          className="flex items-center gap-2 text-left text-slate-700 transition hover:text-slate-950"
          title="Open folder"
        >
          <Folder size={24} className="text-slate-500" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRename(folder)}
            className="rounded-xl border border-slate-200 px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
            title="Rename folder"
          >
            <PencilLine size={14} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(folder)}
            className="rounded-xl border border-red-200 px-2 py-1 text-xs text-red-700 transition hover:bg-red-50"
            title="Delete folder"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(folder)}
        className="mt-4 block w-full truncate text-left font-medium transition hover:text-slate-600"
      >
        {folder.name}
      </button>

      <p className="mt-1 text-xs text-slate-500">
        {folder.parent_folder_id ? "Subfolder" : "Root folder"}
      </p>
    </div>
  );
}

function FileRow({ file, onRename, onDownload, onDelete, onShare }) {
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onRename(file)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <PencilLine size={16} />
          Rename
        </button>

        <button
          type="button"
          onClick={() => onShare(file)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <Link2 size={16} />
          Share
        </button>

        <button
          type="button"
          onClick={() => onDownload(file)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <Download size={16} />
          Download
        </button>

        <button
          type="button"
          onClick={() => onDelete(file)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
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

function parseExpirationInput(value) {
  const trimmedValue = value.trim();
  const pattern = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/;
  const match = trimmedValue.match(pattern);

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export default MyFilesPage;
