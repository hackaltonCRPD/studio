
import type { User, DocumentReport, Feedback, Enquiry, ActivityLog, Notification, UserRole, UserStatus } from './types';
import { getUsers, getUserById } from '@/services/userService';
import { getDocuments, getDocumentById } from '@/services/documentService';
import { getFeedbacks } from '@/services/feedbackService';
import { getEnquiries } from '@/services/enquiryService';
import { getActivityLogsForUser } from '@/services/activityService';
import { getNotificationsForUser } from '@/services/notificationService';

// This file serves as the public API for the data layer.
// It re-exports functions from the service modules.

export {
    getUsers,
    getUserById,
    getDocuments,
    getDocumentById,
    getFeedbacks,
    getEnquiries,
    getActivityLogsForUser,
    getNotificationsForUser
};
