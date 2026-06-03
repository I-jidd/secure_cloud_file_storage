import apiClient from "./apiClient";

export async function createFileShareLink(fileId, shareData = {}) {
  const response = await apiClient.post(
    `share-links/files/${fileId}`,
    shareData,
  );
  return response.data;
}
