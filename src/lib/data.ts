
import type { User, DocumentReport, Feedback, Enquiry, ActivityLog, Notification, UserRole, UserStatus } from './types';

// This is a mock implementation. In a real application, you would fetch this data from your API.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- USER FUNCTIONS ---
export async function getUsers(filters?: { status?: UserStatus | 'all', role?: UserRole | 'all' }): Promise<User[]> {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    console.log("Fetching users with query:", query);
    const response = await fetch(`${API_URL}/users?${query}`);
    if (!response.ok) {
        console.error('Failed to fetch users', await response.text());
        return [];
    }
    const data = await response.json();
    return data.map((user: any) => ({ ...user, id: user._id.toString() }));
}

export async function getUserById(id: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) {
        console.error('Failed to fetch user', await response.text());
        return null;
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

// --- DOCUMENT FUNCTIONS ---
export async function getDocuments(filters?: { documentType?: string, location?: string, status?: string }): Promise<DocumentReport[]> {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await fetch(`${API_URL}/documents?${query}`);
    if (!response.ok) {
        console.error('Failed to fetch documents', await response.text());
        return [];
    }
    const data = await response.json();
    return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
}

export async function getDocumentById(id: string): Promise<DocumentReport | null> {
    const response = await fetch(`${API_URL}/documents/${id}`);
    if (!response.ok) {
        console.error('Failed to fetch document', await response.text());
        return null;
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

// --- FEEDBACK & ENQUIRY FUNCTIONS ---
export async function getFeedbacks(): Promise<Feedback[]> {
    const response = await fetch(`${API_URL}/feedback`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((item: any) => ({ ...item, id: item._id.toString() }));
}

export async function getEnquiries(): Promise<Enquiry[]> {
    const response = await fetch(`${API_URL}/enquiries`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((item: any) => ({ ...item, id: item._id.toString() }));
}

// --- ACTIVITY LOG & NOTIFICATION FUNCTIONS ---
export async function getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    const response = await fetch(`${API_URL}/users/${userId}/activity`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((log: any) => ({ ...log, id: log._id.toString() }));
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    // This is mocked as there is no Express endpoint for it in the guide
    const notifications: Notification[] = [
        {
            id: '1',
            userId: userId,
            title: 'Welcome to DocuFind!',
            description: 'Start by reporting a lost document or searching for one.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            link: '/guide'
        },
        {
            id: '2',
            userId: userId,
            title: 'Your document has a new claim',
            description: 'Someone has claimed the passport you found. RC Staff will review it.',
            timestamp: new Date().toISOString(),
            isRead: true,
            link: '/documents/doc2'
        }
    ];
    return Promise.resolve(notifications.filter(n => n.userId === userId));
}
