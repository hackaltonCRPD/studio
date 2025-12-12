
import type { Notification } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    try {
        const response = await fetch(`${API_URL}/notifications/user/${userId}`);
        if (!response.ok) {
            console.error('Failed to fetch notifications', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((n: any) => ({ ...n, id: n._id.toString() }));
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark notification as read');
    }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/notifications/user/${userId}/read-all`, {
        method: 'PUT',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark all notifications as read');
    }
}
