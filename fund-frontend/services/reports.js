import { api } from "@/lib/api";

// GET /funds/{fundId}/reports -> PDF file (admin only)
// Triggers a browser download rather than returning JSON.
export async function downloadFundReport(fundId) {
  const { blob, filename } = await api.getBlob(`/funds/${fundId}/reports`);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
