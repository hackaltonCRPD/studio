
import type { Notification } from '@/lib/types';

let notifications: Notification[] = [
    { id: 'notif1', userId: 'user1', title: 'New Document Claimed', description: 'Document ID doc3 has been claimed by user3.', timestamp: new Date('2023-09-20T11:05:00Z').toISOString(), isRead: true, link: '/documents/doc3' },
    { id: 'notif2', userId: 'user2', title: 'Welcome to DocuFind!', description: 'Thank you for joining our community. Start by reporting or searching for documents.', timestamp: new Date('2023-05-20T10:00:00Z').toISOString(), isRead: true },
    { id: 'notif3', userId: 'user4', title: 'Claim requires approval', description: 'A user has claimed document ID doc4. Please review the claim.', timestamp: new Date('2023-11-12T13:00:00Z').toISOString(), isRead: false, link: '/rc-staff/dashboard' },
    { id: 'notif4', userId: 'user2', title: 'Your Document Matched!', description: 'A found document might match your report for doc1. An RC Staff member will review it.', timestamp: new Date('2023-11-03T10:00:00Z').toISOString(), isRead: false, link: '/documents/doc1' },
];

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const userNotifications = notifications.filter(n => n.userId === userId);
    return Promise.resolve(userNotifications);
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    notifications = notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
    return Promise.resolve();
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    notifications = notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n);
    return Promise.resolve();
}
