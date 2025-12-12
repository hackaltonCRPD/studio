
import type { Notification } from '@/lib/types';

const API_URL = typeof window === 'undefined'
    ? process.env.API_URL_INTERNAL
    : process.env.NEXT_PUBLIC_API_URL;

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    try {
        const response = await fetch(`${API_URL}/notifications/user/${userId}`);
        if (!response.ok) {
            console.error(`Failed to fetch notifications for user ${userId}`, await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((n: any) => ({ ...n, id: n._id.toString() }));
    } catch (error) {
        console.error(`Error fetching notifications for user ${userId}:`, error);
        return [];
    }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
    });
    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }
    return;
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/user/${userId}/read-all`, {
        method: 'PUT',
    });
    if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
    }
    return;
}
