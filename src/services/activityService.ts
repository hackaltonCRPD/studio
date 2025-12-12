
import type { ActivityLog } from '@/lib/types';

const activityLogs: ActivityLog[] = [
    { id: 'log1', userId: 'user1', activity: 'Logged in', timestamp: new Date('2023-11-12T10:00:00Z').toISOString(), ipAddress: '192.168.1.1' },
    { id: 'log2', userId: 'user2', activity: 'Reported lost document', details: 'doc1', timestamp: new Date('2023-10-27T14:30:00Z').toISOString(), ipAddress: '203.0.113.25' },
    { id: 'log3', userId: 'user3', activity: 'Claimed document', details: 'doc3', timestamp: new Date('2023-09-20T11:00:00Z').toISOString(), ipAddress: '198.51.100.12' },
    { id: 'log4', userId: 'user1', activity: 'Updated user profile', details: 'user5', timestamp: new Date('2023-11-10T09:00:00Z').toISOString(), ipAddress: '192.168.1.1' },
    { id: 'log5', userId: 'user2', activity: 'Failed login attempt', timestamp: new Date('2023-11-11T18:00:00Z').toISOString(), ipAddress: '203.0.113.25' },
];

export async function getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const userLogs = activityLogs.filter(log => log.userId === userId);
    return Promise.resolve(userLogs);
}
