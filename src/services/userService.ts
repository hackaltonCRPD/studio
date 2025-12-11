
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
