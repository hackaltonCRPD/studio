
import { getAuthenticatedUser } from '@/lib/auth';
import { getNotificationsForUser } from '@/lib/data';
import type { Notification, User } from '@/lib/types';
import { notFound } from 'next/navigation';
import { NotificationsClient } from './notifications-client';

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
