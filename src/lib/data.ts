import type { DocumentReport, User } from "@/lib/types";

export const users: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@docufind.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/1/40/40', status: 'active' },
  { id: 'user-2', name: 'RC Staff Member', email: 'staff@docufind.com', role: 'rc_staff', avatarUrl: 'https://picsum.photos/seed/2/40/40', status: 'active' },
  { id: 'user-3', name: 'Police Officer', email: 'police@docufind.com', role: 'police', avatarUrl: 'https://picsum.photos/seed/3/40/40', status: 'suspended' },
  { id: 'user-4', name: 'John Doe', email: 'john.d@email.com', role: 'reporter', avatarUrl: 'https://picsum.photos/seed/4/40/40', status: 'active' },
  { id: 'user-5', name: 'Jane Smith', email: 'jane.s@email.com', role: 'finder', avatarUrl: 'https://picsum.photos/seed/5/40/40', status: 'archived' },
];

export const documents: DocumentReport[] = [
    {
        id: 'doc-001',
        documentType: 'Passport',
        description: 'Blue passport with a slightly worn cover. Contains visas for several countries.',
        dateLost: '2024-07-15',
        location: 'Grand Central Station',
        status: 'lost',
        reportedBy: 'user-4',
        reportDate: '2024-07-16',
        imageUrl: 'https://picsum.photos/seed/doc1/64/64'
    },
    {
        id: 'doc-002',
        documentType: 'Driver\'s License',
        description: 'California driver\'s license. The photo is a bit faded.',
        dateLost: '2024-07-20',
        location: 'Central Park',
        status: 'found',
        reportedBy: 'user-5',
        reportDate: '2024-07-21',
        imageUrl: 'https://picsum.photos/seed/doc2/64/64'
    },
    {
        id: 'doc-003',
        documentType: 'National ID',
        description: 'ID card with a chip. Issued in 2022.',
        dateLost: '2024-06-10',
        location: 'JFK Airport, Terminal 4',
        status: 'lost',
        reportedBy: 'user-4',
        reportDate: '2024-06-11'
    },
    {
        id: 'doc-004',
        documentType: 'Student ID',
        description: 'NYU Student ID card. Belongs to a student named Alex Ray.',
        dateLost: '2024-07-22',
        location: 'NYU Library',
        status: 'found',
        reportedBy: 'user-2',
        reportDate: '2024-07-22',
        imageUrl: 'https://picsum.photos/seed/doc4/64/64'
    },
    {
        id: 'doc-005',
        documentType: 'Credit Card',
        description: 'Visa credit card. Last 4 digits are 1234.',
        dateLost: '2024-07-25',
        location: 'Subway, Line 6',
        status: 'claimed',
        reportedBy: 'user-4',
        reportDate: '2024-07-25'
    }
];
