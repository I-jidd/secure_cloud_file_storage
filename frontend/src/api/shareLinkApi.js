import apiClient from "./apiClient";

export async function createFileShareLink(fileId, shareData = {}) {
  const response = await apiClient.post(
    `/share-links/files/${fileId}`,
    shareData,
  );

  return response.data;
}

export async function getShareLinks() {
  const response = await apiClient.get("/share-links");
  return response.data;
}

export async function disableShareLink(shareLinkId) {
  const response = await apiClient.patch(`/share-links/${shareLinkId}/disable`);
  return response.data;
}

export async function getPublicShareMetadata(token) {
  const response = await apiClient.get(`/share-links/public/${token}`);
  return response.data;
}

export async function downloadPublicSharedFile(token) {
  const response = await apiClient.get(
    `/share-links/public/${token}/download`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}

export async function verifyPublicSharePassword(token, password) {
  const response = await apiClient.post(
    `share-links/public/${token}/verify-password`,
    {
      password,
    },
  );
  return response.data;
}

export async function downloadPublicSharedFileWithPassword(token, password) {
  const response = await apiClient.post(
    `/share-links/public/${token}/download-with-password`,
    {
      password,
    },
    {
      responseType: "blob",
    },
  );

  return response.data;
}
