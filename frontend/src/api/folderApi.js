import apiClient from "./apiClient";

export async function getFolders(parentFolderId = null) {
  const response = await apiClient.get("/folders", {
    params: parentFolderId
      ? {
          parent_folder_id: parentFolderId,
        }
      : {},
  });

  return response.data;
}

export async function createFolder({ name, parentFolderId = null }) {
  const response = await apiClient.post("/folders", {
    name,
    parent_folder_id: parentFolderId,
  });

  return response.data;
}

export async function getDeletedFolders() {
  const response = await apiClient.get("/folders/trash");
  return response.data;
}

export async function restoreFolder(folderId) {
  const response = await apiClient.patch(`/folders/${folderId}/restore`);
  return response.data;
}

export async function deleteFolder(folderId) {
  const response = await apiClient.delete(`/folders/${folderId}`);
  return response.data;
}

export async function renameFolder(folderId, name) {
  const response = await apiClient.patch(`/folders/${folderId}`, {
    name,
  });

  return response.data;
}
