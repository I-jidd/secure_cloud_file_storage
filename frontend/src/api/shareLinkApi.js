import apiClient from "./apiClient";

export async function createFileShareLink(fileId, shareData = {}) {
  const response = await apiClient.post(
    `share-links/files/${fileId}`,
    shareData,
  );
  return response.data;
}

export async function getShareLinks() {
  const response = await apiClient.get("/share-links");
  return response.data;
}
