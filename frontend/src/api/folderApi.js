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
