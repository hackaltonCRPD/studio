
import type { DocumentReport } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDocuments(filters?: { documentType?: string; location?: string; status?: string }): Promise<DocumentReport[]> {
    try {
        const query = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await fetch(`${API_URL}/documents?${query}`);
        if (!response.ok) {
            console.error('Failed to fetch documents', await response.text());
            return [];
        }
        const data = await response.json();
        return data.map((doc: any) => ({ ...doc, id: doc._id.toString() }));
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch failed')) {
            console.error('Error fetching documents: Could not connect to the backend at', API_URL, '. Please ensure the backend server is running and accessible.');
        } else {
            console.error('An unexpected error occurred while fetching documents:', error);
        }
        return [];
    }
}

export async function getDocumentById(id: string): Promise<DocumentReport | null> {
    const response = await fetch(`${API_URL}/documents/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function createDocument(documentData: Omit<DocumentReport, 'id' | 'reportDate'>): Promise<DocumentReport> {
    const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create document: ${errorText}`);
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function updateDocument(id: string, documentData: Partial<Omit<DocumentReport, 'id'>>): Promise<DocumentReport> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
    });
    if (!response.ok) throw new Error("Failed to update document");
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete document");
    return;
}

export async function claimDocument(documentId: string, claimantId: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${documentId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimantId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim document');
    }
    return;
}
