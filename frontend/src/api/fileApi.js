import apiClient from "./apiClient";

export async function getFiles(folderId = null) {
  const response = await apiClient.get("/files", {
    params: folderId
      ? {
          folder_id: folderId,
        }
      : {},
  });

  return response.data;
}
