
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User, UserStatus, UserRole } from "@/lib/types";
import { UserTable } from "./user-table-client";

const API_URL = process.env.API_URL_INTERNAL;

async function getUsers(filters?: { status?: UserStatus | 'all', role?: UserRole | 'all' }): Promise<User[]> {
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

export default async function AdminPage({ searchParams }: { searchParams?: { status?: UserStatus | 'all', role?: UserRole | 'all' } }) {
    const status = searchParams?.status || 'all';
    const role = searchParams?.role || 'all';

    const initialUsers = await getUsers({
      status: status,
      role: role,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                View, manage, and edit all users in the system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <UserTable initialUsers={initialUsers} />
            </CardContent>
        </Card>
    )
}

    