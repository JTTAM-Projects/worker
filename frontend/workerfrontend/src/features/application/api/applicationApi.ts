import type { ApplicationWithDetails, PaginatedResponse } from "../types";
import type { ApplicationPayload, FetchApplicationParams } from "./applicationApi.types";
import { mockApi, isMockMode } from "../../../mocks/mockApi";

const API_BASE_URL = 'http://localhost:8080/api'

export async function fetchApplication(
  getAccessToken: () => Promise<string>, 
  taskId: number
): Promise<ApplicationWithDetails | null>{
  if (isMockMode) {
    return mockApi.fetchApplication(taskId);
  }
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/task/${taskId}/application`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if ( response.status === 404 ) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response: ' + errorText);
    throw new Error(`Failed to fetch single application related to user: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function createApplication(
  getAccessToken: () => Promise<string>,
  taskId: number,
  payload: ApplicationPayload
): Promise<ApplicationWithDetails> {
  if (isMockMode) {
    return mockApi.createApplication(taskId, payload);
  }
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/task/${taskId}/application`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `Virhe: ${response.status}`;

    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
      }
    }

    if (response.status === 409) {
      errorMessage = "Olet jo hakenut tähän tehtävään";
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateApplication(
  getAccessToken: () => Promise<string>,
  taskId: number,
  payload: ApplicationPayload
): Promise<ApplicationWithDetails> {
  if (isMockMode) {
    return mockApi.updateApplication(taskId, payload);
  }
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/task/${taskId}/application`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Hakemuksen päivitys epäonnistui (${response.status})`);
  }

  return response.json();
}

export async function deleteApplication(
  getAccessToken: () => Promise<string>,
  taskId: number
): Promise<void> {
  if (isMockMode) {
    return mockApi.deleteApplication(taskId);
  }
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/task/${taskId}/application`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Hakemuksen poistaminen epäonnistui (${response.status})`);
  }
}

export async function fetchAllApplications(
  getAccessToken: () => Promise<string>,
  params: Partial<FetchApplicationParams> = {}
): Promise<PaginatedResponse<ApplicationWithDetails>> {
  if (isMockMode) {
    return mockApi.fetchAllApplications(params);
  }
  const { 
    page = 0, 
    size = 10, 
    applicationStatus,
    searchText,
    categories,
    minPrice,
    maxPrice,
  } = params;
  const token = await getAccessToken();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  })

  if (searchText && searchText.trim()){
    queryParams.append("searchText", searchText.trim());
  }
  if (categories && categories.length > 0) {
    categories.forEach(cat => queryParams.append("categories", cat));
  }

  if (minPrice !== undefined && minPrice !== null) {
    queryParams.append("applicationMinPrice", minPrice.toString());
  }

  if (maxPrice !== undefined && maxPrice !== null) {
    queryParams.append("applicationMaxPrice", maxPrice.toString());
  }
  
  if (applicationStatus) {
    queryParams.append("applicationStatus", applicationStatus);
  }
  const response = await fetch(`${API_BASE_URL}/user-applications?${queryParams.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }
  const data = await response.json();
  console.log('API response: ', data)
  return data;
}
