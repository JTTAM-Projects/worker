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