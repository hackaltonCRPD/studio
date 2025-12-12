
import type { User, UserRole, UserStatus } from '@/lib/types';

const API_URL = typeof window === 'undefined'
    ? process.env.API_URL_INTERNAL
    : process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(filters?: { status?: UserStatus | 'all', role?: UserRole | 'all' }): Promise<User[]> {
    try {
        const query = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await fetch(`${API_URL}/users?${query}`);
        if (!response.ok) {
            console.error('Failed to fetch users', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((user: any) => ({ ...user, id: user._id.toString() }));
    } catch (error) {
        if (error instanceof TypeError && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED'))) {
            console.error('Error fetching users: Could not connect to the backend at', API_URL, '. Please ensure the backend server is running and accessible.');
        } else {
            console.error('An unexpected error occurred while fetching users:', error);
        }
        return [];
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) return null;
        const data = await response.json();
        return { ...data, id: data._id.toString() };
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
}

export async function updateUser(id: string, userData: Partial<Omit<User, 'id'>>): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}


export async function updateUserStatus(id: string, status: UserStatus): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
     if (!response.ok) throw new Error("Failed to update user status");
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return;
}
