
import type { Enquiry } from '@/lib/types';

let enquiries: Enquiry[] = [
    { id: 'enq1', subject: 'How do I claim an item?', question: 'I think I found my wallet, but I am not sure what the process is to claim it. Can you help?', userId: 'user3', date: new Date('2023-11-08').toISOString(), status: 'open', name: 'Jane Smith', email: 'jane.smith@example.com'},
    { id: 'enq2', subject: 'Password Reset', question: 'I forgot my password and the reset link is not working.', userId: 'user2', date: new Date('2023-11-11').toISOString(), status: 'resolved', name: 'John Doe', email: 'john.doe@example.com' },
];

export async function getEnquiries(): Promise<Enquiry[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return Promise.resolve(enquiries);
}

export async function createEnquiry(enquiryData: Omit<Enquiry, 'id' | 'date' | 'status'>): Promise<Enquiry> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newEnquiry: Enquiry = {
        ...enquiryData,
        id: `enq${enquiries.length + 1}`,
        date: new Date().toISOString(),
        status: 'open',
    };
    enquiries.push(newEnquiry);
    return Promise.resolve(newEnquiry);
}

export async function updateEnquiryStatus(id: string, status: 'open' | 'resolved'): Promise<Enquiry> {
    await new Promise(resolve => setTimeout(resolve, 100));
    enquiries = enquiries.map(e => e.id === id ? { ...e, status } : e);
    const updatedEnquiry = enquiries.find(e => e.id === id);
    if (!updatedEnquiry) throw new Error("Enquiry not found");
    return Promise.resolve(updatedEnquiry);
}
