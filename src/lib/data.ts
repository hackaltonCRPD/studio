
import type { DocumentReport, User, Feedback, Enquiry, ActivityLog, Notification } from "@/lib/types";

export const users: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@docufind.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/1/40/40', status: 'active', credibilityScore: 95, phoneNumber: '111-222-3333' },
  { id: 'user-2', name: 'RC Staff Member', email: 'staff@docufind.com', role: 'rc_staff', avatarUrl: 'https://picsum.photos/seed/2/40/40', status: 'active', credibilityScore: 92, phoneNumber: '222-333-4444' },
  { id: 'user-3', name: 'Police Officer', email: 'police@docufind.com', role: 'police', avatarUrl: 'https://picsum.photos/seed/3/40/40', status: 'suspended', credibilityScore: 75, phoneNumber: '911-911-9111' },
  { id: 'user-4', name: 'John Doe', email: 'john.d@email.com', role: 'reporter', avatarUrl: 'https://picsum.photos/seed/4/40/40', status: 'active', credibilityScore: 88, phoneNumber: '444-555-6666' },
  { id: 'user-5', name: 'Jane Smith', email: 'jane.s@email.com', role: 'finder', avatarUrl: 'https://picsum.photos/seed/5/40/40', status: 'archived', credibilityScore: 40, phoneNumber: '555-666-7777' },
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

export const feedback: Feedback[] = [
    {
        id: 'fb-001',
        subject: 'Great platform!',
        message: 'This is a really helpful service. Found my lost ID in just two days. The interface is clean and easy to use. Keep up the great work!',
        userId: 'user-4',
        date: '2024-07-28',
        status: 'open'
    },
    {
        id: 'fb-002',
        subject: 'Suggestion for search filters',
        message: 'It would be great if we could filter search results by a date range instead of just a single date. Would make it easier to narrow down.',
        userId: 'user-5',
        date: '2024-07-27',
        status: 'open'
    },
    {
        id: 'fb-003',
        subject: 'Mobile App?',
        message: 'Love the website. Are there any plans to release a mobile app for iOS and Android? That would be super convenient.',
        userId: 'user-2',
        date: '2024-07-25',
        status: 'resolved'
    }
];

export const enquiries: Enquiry[] = [
    {
        id: 'enq-001',
        subject: 'How do I claim a document?',
        question: 'I think I found my lost wallet on the site. What is the process for claiming it and verifying my identity?',
        userId: 'user-4',
        date: '2024-07-29',
        status: 'open'
    },
    {
        id: 'enq-002',
        subject: 'Problem with uploading a photo',
        question: 'I\'m trying to submit a found document report, but the photo upload keeps failing. It\'s a standard JPG file under 1MB. Can you help?',
        userId: 'user-5',
        date: '2024-07-28',
        status: 'open'
    },
     {
        id: 'enq-003',
        subject: 'Account suspension',
        question: 'My account was suspended, but I\'m not sure why. Can you provide more information on why this action was taken?',
        userId: 'user-3',
        date: '2024-07-26',
        status: 'resolved'
    }
];

export const activityLogs: ActivityLog[] = [
    { id: 'log-001', userId: 'user-4', activity: 'User Login', timestamp: '2024-07-29 10:00:00', ipAddress: '192.168.1.1' },
    { id: 'log-002', userId: 'user-4', activity: 'Reported Document', timestamp: '2024-07-29 10:05:00', details: 'Document ID: doc-001', ipAddress: '192.168.1.1' },
    { id: 'log-003', userId: 'user-4', activity: 'Submitted Enquiry', timestamp: '2024-07-29 10:15:00', details: 'Enquiry ID: enq-001', ipAddress: '192.168.1.1' },
    { id: 'log-004', userId: 'user-1', activity: 'User Login', timestamp: '2024-07-29 09:00:00', ipAddress: '10.0.0.1' },
    { id: 'log-005', userId: 'user-1', activity: 'Changed User Status', timestamp: '2024-07-29 09:05:00', details: 'User ID: user-3, Status: suspended', ipAddress: '10.0.0.1' },
    { id: 'log-006', userId: 'user-3', activity: 'Login Failed', timestamp: '2024-07-29 09:30:00', details: 'Reason: Account suspended', ipAddress: '203.0.113.5' },
];


export const notifications: Notification[] = [
    {
        id: 'notif-001',
        userId: 'user-1',
        title: 'New Feedback Submitted',
        description: 'A user submitted new feedback with the subject "Great platform!"',
        timestamp: '2024-07-28 14:00:00',
        isRead: false,
        link: '/admin/feedback'
    },
    {
        id: 'notif-002',
        userId: 'user-1',
        title: 'Account Suspension',
        description: 'You have suspended the account for user Police Officer.',
        timestamp: '2024-07-29 09:05:00',
        isRead: false,
        link: '/admin/users/user-3'
    },
     {
        id: 'notif-003',
        userId: 'user-1',
        title: 'Claim Escalated',
        description: 'A claim for document doc-002 has been escalated for your review.',
        timestamp: '2024-07-30 11:00:00',
        isRead: true,
        link: '/police/dashboard'
    },
    {
        id: 'notif-004',
        userId: 'user-4',
        title: 'Welcome to DocuFind!',
        description: 'Thank you for creating an account. Get started by reporting or searching for a document.',
        timestamp: '2024-07-28 10:00:00',
        isRead: true
    }
];
