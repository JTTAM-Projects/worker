import type { Application, ApplicationStatus, ApplicationWithDetails, PaginatedResponse } from "../types";

const API_BASE_URL = 'http://localhost:8080/api'

export interface FetchApplicationParams {
  page: number;
  size: number;
  applicationStatus: ApplicationStatus;
}

export async function fetchApplication(
  getAccessToken: () => Promise<string>, 
  taskId: number
): Promise<ApplicationWithDetails | null>{
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

export async function fetchAllApplications(
  getAccessToken: () => Promise<string>,
   params: FetchApplicationParams
  ): Promise<PaginatedResponse<Application>> {
  const { page = 0, size = 10, applicationStatus } = params;
  const token = await getAccessToken();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  })

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