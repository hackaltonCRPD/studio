
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth';
import { getNotificationsForUser } from '@/lib/data';
import type { Notification, User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { NotificationsClient } from './notifications-client';

export default async function NotificationsPage() {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
        notFound();
    }
    const userNotifications = await getNotificationsForUser(authUser.id);
    const sortedNotifications = userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const unreadCount = sortedNotifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">
            <NotificationsClient initialNotifications={sortedNotifications} user={authUser} unreadCount={unreadCount} />
        </div>
    );
}
