import apiClient from "./apiClient";

export async function getActivityLogs(limit = 50) {
  const response = await apiClient.get("/activity-logs", {
    params: {
      limit,
    },
  });

  return response.data;
}
