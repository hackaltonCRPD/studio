
import type { Feedback } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getFeedbacks(): Promise<Feedback[]> {
    try {
        const response = await fetch(`${API_URL}/feedback`);
        if (!response.ok) {
            console.error('Failed to fetch feedback', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((item: any) => ({ ...item, id: item._id.toString() }));
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return [];
    }
}
