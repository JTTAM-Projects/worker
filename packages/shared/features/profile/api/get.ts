import { TaskerProfile } from "../types";

const API_BASE_URL = "http://192.168.3.17:8080/api";

export async function fetchTaskerProfile(token : string): Promise<TaskerProfile | null> {

    const response = await fetch(`${API_BASE_URL}/tasker-profiles/me`, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response: ' + errorText)
        throw new Error(`Failed to fetch tasker profile: ${response.statusText}`);
    }

    return response.json();
}

export async function createTaskerProfile(
    token : string,
    taskerData: Partial<TaskerProfile>
): Promise<TaskerProfile>{

    const formattedData = {
        ...taskerData,
        websiteLink: taskerData.websiteLink 
            ? taskerData.websiteLink.startsWith('http') 
                ? taskerData.websiteLink 
                : `https://${taskerData.websiteLink}`
            : '',
        profileImageUrl: taskerData.profileImageUrl
            ? taskerData.profileImageUrl.startsWith('http')
                ? taskerData.profileImageUrl
                : `https://${taskerData.profileImageUrl}`
            : ''
    };
    const response = await fetch(`${API_BASE_URL}/tasker-profiles`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('createEmployer error response: ' + errorText)
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return response.json();
}