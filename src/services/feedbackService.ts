
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

export async function createFeedback(feedbackData: Omit<Feedback, 'id' | 'date' | 'status'>): Promise<Feedback> {
    const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create feedback');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function updateFeedbackStatus(id: string, status: 'open' | 'resolved'): Promise<Feedback> {
    const response = await fetch(`${API_URL}/feedback/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update feedback status');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}
