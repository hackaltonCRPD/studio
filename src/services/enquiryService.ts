
import type { Enquiry } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getEnquiries(): Promise<Enquiry[]> {
    try {
        const response = await fetch(`${API_URL}/enquiries`);
        if (!response.ok) {
             console.error('Failed to fetch enquiries', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((item: any) => ({ ...item, id: item._id.toString() }));
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return [];
    }
}

export async function createEnquiry(enquiryData: Omit<Enquiry, 'id' | 'date' | 'status'>): Promise<Enquiry> {
    const response = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create enquiry');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function updateEnquiryStatus(id: string, status: 'open' | 'resolved'): Promise<Enquiry> {
    const response = await fetch(`${API_URL}/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update enquiry status');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}
