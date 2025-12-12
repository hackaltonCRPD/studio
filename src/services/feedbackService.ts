
import type { Feedback } from '@/lib/types';

let feedbacks: Feedback[] = [
    { id: 'fb1', subject: 'Great platform!', message: 'Found my passport in 2 days. Amazing!', userId: 'user2', date: new Date('2023-11-01').toISOString(), status: 'resolved' },
    { id: 'fb2', subject: 'Suggestion for improvement', message: 'Could you add a map view for locations?', userId: 'user3', date: new Date('2023-11-05').toISOString(), status: 'open' },
];

export async function getFeedbacks(): Promise<Feedback[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return Promise.resolve(feedbacks);
}

export async function createFeedback(feedbackData: Omit<Feedback, 'id' | 'date' | 'status'>): Promise<Feedback> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newFeedback: Feedback = {
        ...feedbackData,
        id: `fb${feedbacks.length + 1}`,
        date: new Date().toISOString(),
        status: 'open',
    };
    feedbacks.push(newFeedback);
    return Promise.resolve(newFeedback);
}

export async function updateFeedbackStatus(id: string, status: 'open' | 'resolved'): Promise<Feedback> {
    await new Promise(resolve => setTimeout(resolve, 100));
    feedbacks = feedbacks.map(f => f.id === id ? { ...f, status } : f);
    const updatedFeedback = feedbacks.find(f => f.id === id);
    if (!updatedFeedback) throw new Error("Feedback not found");
    return Promise.resolve(updatedFeedback);
}
