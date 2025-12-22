
import type { User, DocumentReport, Feedback, Enquiry, ActivityLog, Notification, UserRole, UserStatus } from './types';
import { getUsers, getUserById, updateUser, updateUserStatus, deleteUser } from '@/services/userService';
import { getDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, claimDocument } from '@/services/documentService';
import { getFeedbacks, createFeedback, updateFeedbackStatus } from '@/services/feedbackService';
import { getEnquiries, createEnquiry, updateEnquiryStatus } from '@/services/enquiryService';
import { getActivityLogsForUser } from '@/services/activityService';
import { getNotificationsForUser, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notificationService';

// This file serves as the public API for the data layer.
// It re-exports functions from the service modules.

export {
    getUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser,
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    claimDocument,
    getFeedbacks,
    createFeedback,
    updateFeedbackStatus,
    getEnquiries,
    createEnquiry,
    updateEnquiryStatus,
    getActivityLogsForUser,
    getNotificationsForUser,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
