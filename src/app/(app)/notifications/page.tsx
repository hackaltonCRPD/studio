
'use client';
import { getAuthenticatedUser } from '@/lib/auth';
import { getNotificationsForUser } from '@/lib/data';
import type { Notification, User } from '@/lib/types';
import { notFound } from 'next/navigation';
import { NotificationsClient } from './notifications-client';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getAuthenticatedUser().then(user => {
            if (!user) {
                notFound();
                return;
            }
            setAuthUser(user);
            getNotificationsForUser(user.id).then(userNotifications => {
                const sorted = userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setNotifications(sorted);
                setUnreadCount(sorted.filter(n => !n.isRead).length);
                setLoading(false);
            });
        });
    }, []);

    if(loading || !authUser) {
        return <div>Loading notifications...</div>;
    }

    return (
        <div className="space-y-6">
            <NotificationsClient initialNotifications={notifications} user={authUser} unreadCount={unreadCount} />
        </div>
    );
}
