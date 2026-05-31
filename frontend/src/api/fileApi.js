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

export async function uploadFile({ file, folderId = null }) {
  const formData = new FormData();

  formData.append("upload_file", file);

  if (folderId) {
    formData.append("folder_id", folderId);
  }

  const response = await apiClient.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function downloadFile(fileId) {
  const response = await apiClient.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });

  return response.data;
}
