
import type { User, UserRole, UserStatus } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

let users: User[] = [
    { id: 'user1', name: 'Admin User', email: 'admin@docufind.com', avatarUrl: PlaceHolderImages.find(p=>p.id === 'avatar1')?.imageUrl, role: 'admin', status: 'active', credibilityScore: 95, createdAt: new Date('2023-01-15').toISOString(), phoneNumber: '111-222-3333', preferredContactMethod: 'email' },
    { id: 'user2', name: 'John Doe', email: 'john.doe@example.com', avatarUrl: PlaceHolderImages.find(p=>p.id === 'avatar2')?.imageUrl, role: 'reporter', status: 'active', credibilityScore: 88, createdAt: new Date('2023-05-20').toISOString(), phoneNumber: '222-333-4444', preferredContactMethod: 'phone' },
    { id: 'user3', name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: PlaceHolderImages.find(p=>p.id === 'avatar3')?.imageUrl, role: 'finder', status: 'active', credibilityScore: 92, createdAt: new Date('2023-08-10').toISOString() },
    { id: 'user4', name: 'RC Staff Member', email: 'rc.staff@docufind.com', avatarUrl: PlaceHolderImages.find(p=>p.id === 'avatar4')?.imageUrl, role: 'rc_staff', status: 'active', credibilityScore: 100, createdAt: new Date('2023-02-01').toISOString() },
    { id: 'user5', name: 'Police Officer', email: 'police@docufind.com', avatarUrl: PlaceHolderImages.find(p=>p.id === 'avatar5')?.imageUrl, role: 'police', status: 'suspended', credibilityScore: 100, createdAt: new Date('2023-03-01').toISOString() },
    { id: 'user6', name: 'Archived User', email: 'archived@example.com', role: 'reporter', status: 'archived', credibilityScore: 50, createdAt: new Date('2022-11-01').toISOString() },
];


export async function getUsers(filters?: { status?: UserStatus | 'all', role?: UserRole | 'all' }): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    let filteredUsers = users;

    if (filters?.status && filters.status !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.status === filters.status);
    }
    if (filters?.role && filters.role !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }

    return Promise.resolve(filteredUsers);
}

export async function getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const user = users.find(u => u.id === id) || null;
    return Promise.resolve(user);
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100));
    users = users.map(u => u.id === id ? { ...u, ...userData } : u);
    const updatedUser = users.find(u => u.id === id);
    if (!updatedUser) throw new Error("User not found");
    return Promise.resolve(updatedUser);
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return updateUser(id, { status });
}

export async function deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    users = users.filter(u => u.id !== id);
    return Promise.resolve();
}
