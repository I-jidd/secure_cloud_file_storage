import apiClient from "./apiClient";

export async function getDashboardSummary() {
  const reponse = await apiClient.get("/dashboard/summary");
  return reponse.data;
}
