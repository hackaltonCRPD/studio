
import { getAuthenticatedUser } from '@/lib/auth';
import type { Notification, User } from '@/lib/types';
import { notFound } from 'next/navigation';
import { NotificationsClient } from './notifications-client';

const API_URL = process.env.API_URL_INTERNAL;

async function getNotificationsForUser(userId: string): Promise<Notification[]> {
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

export default async function NotificationsPage() {
    const authUser = await getAuthenticatedUser();
    
    if (!authUser) {
        notFound();
    }
    
    const userNotifications = await getNotificationsForUser(authUser.id);
    const sorted = userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const unreadCount = sorted.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">
            <NotificationsClient initialNotifications={sorted} user={authUser} unreadCount={unreadCount} />
        </div>
    );
}

    