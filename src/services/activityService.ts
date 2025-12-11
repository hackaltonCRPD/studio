
import type { ActivityLog } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/activity`);
        if (!response.ok) {
            console.error('Failed to fetch activity logs', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((log: any) => ({ ...log, id: log._id.toString() }));
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return [];
    }
}
