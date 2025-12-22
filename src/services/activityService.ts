
import type { ActivityLog } from '@/lib/types';

const API_URL = typeof window === 'undefined'
    ? process.env.API_URL_INTERNAL
    : process.env.NEXT_PUBLIC_API_URL;

export async function getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/activity`);
        if (!response.ok) {
            console.error(`Failed to fetch activity logs for user ${userId}`, await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((log: any) => ({ ...log, id: log._id.toString() }));
    } catch (error) {
        console.error(`Error fetching activity logs for user ${userId}:`, error);
        return [];
    }
}
