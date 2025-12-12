
import type { User, UserRole, UserStatus } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) {
            console.error('Failed to fetch user', await response.text());
            return null;
        }
        const data = await response.json();
        return { ...data, id: data._id.toString() };
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return updateUser(id, { status });
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
    }
}
