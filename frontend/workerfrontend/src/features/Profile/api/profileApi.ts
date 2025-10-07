import type { User, TaskerProfile, EmployerProfile, Auth0User } from '../types';


const API_BASE_URL = 'http://localhost:8080/api';

//GET METHODS
export async function getUser(getAccessToken: () => Promise<string>, userName : string | undefined): Promise<User> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}/user/${userName}`, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
}

export async function getTaskerProfile(getAccessToken: () => Promise<string>): Promise<TaskerProfile> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}/tasker-profiles/me`, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response: ' + errorText)
        throw new Error(`Failed to fetch tasker profile: ${response.statusText}`);
    }

    return response.json();
}

export async function getEmployerProfile(getAccessToken: () => Promise<string>): Promise<EmployerProfile | null> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}/employer-profiles/me`, {
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
        throw new Error(`Failed to fetch employer profile: ${response.statusText}`);
    }

    return response.json();
}

//POST METHODS
export async function createUser(
    getAccessToken: () => Promise<string>,
    userData: User
): Promise<User>{
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response: ' + errorText)
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return response.json();
}

export async function createEmployerProfile(
    getAccessToken: () => Promise<string>,
    employerData: Partial<EmployerProfile>
): Promise<EmployerProfile>{
    const token = await getAccessToken();

    const formattedData = {
        ...employerData,
        websiteLink: employerData.websiteLink 
            ? employerData.websiteLink.startsWith('http') 
                ? employerData.websiteLink 
                : `https://${employerData.websiteLink}`
            : '',
        profileImageUrl: employerData.profileImageUrl
            ? employerData.profileImageUrl.startsWith('http')
                ? employerData.profileImageUrl
                : `https://${employerData.profileImageUrl}`
            : ''
    };
    const response = await fetch(`${API_BASE_URL}/employer-profiles`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response: ' + errorText)
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return response.json();
}

//PUT METHODS
export async function updateUser(
    getAccessToken: () => Promise<string>,
    userData: Partial<User>
): Promise<User> {
    const token = await getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response: ' + errorText)
        throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
}

export async function updateEmployer(
    getAccessToken: () => Promise<string>,
    employerData: Partial<EmployerProfile>
): Promise<EmployerProfile> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}/employer-profiles/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employerData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response: ' + errorText)
        throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
}

//Auth0 user data update
export async function updateAuth0UserData(
    getAccessToken: () => Promise<string>,
    userId: string,
    userData: Auth0User
): Promise<void> {
    const token = await getAccessToken();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;

    const response = await fetch(`https://${domain}/api/v2/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`Failed to update Auth0 metadata: ${response.statusText}`);
    }
}