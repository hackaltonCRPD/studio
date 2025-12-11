
import type { Notification } from '@/lib/types';

// This remains a mocked service as there is no corresponding Express endpoint in the guide.
export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    console.log(`Fetching notifications for user ${userId} (mocked)`);
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
    // In a real app, you would filter this on the backend.
    return Promise.resolve(notifications.filter(n => n.userId === userId));
}
