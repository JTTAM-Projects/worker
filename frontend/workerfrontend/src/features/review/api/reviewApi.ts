import type { ReviewRequest } from "../types";

export async function createReview(getAccessTokenSilently: () => Promise<string>, payload:ReviewRequest) {

const API_BASE_URL = "http://localhost:8080/api";

  const token = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

    if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to create review: ${response.status} ${text}`);
  }
  
  return response.json();
}