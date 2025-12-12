
import type { DocumentReport } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getDocuments(filters?: { documentType?: string, location?: string, status?: string }): Promise<DocumentReport[]> {
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
        console.error('Error fetching documents:', error);
        return [];
    }
}

export async function getDocumentById(id: string): Promise<DocumentReport | null> {
    try {
        const response = await fetch(`${API_URL}/documents/${id}`);
        if (!response.ok) {
            console.error('Failed to fetch document', await response.text());
            return null;
        }
        const data = await response.json();
        return { ...data, id: data._id.toString() };
    } catch (error) {
        console.error('Error fetching document:', error);
        return null;
    }
}

export async function createDocument(documentData: Omit<DocumentReport, 'id' | 'reportDate'>): Promise<DocumentReport> {
    const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create document report');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function updateDocument(id: string, documentData: Partial<DocumentReport>): Promise<DocumentReport> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update document report');
    }
    const data = await response.json();
    return { ...data, id: data._id.toString() };
}

export async function deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete document report');
    }
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
}
