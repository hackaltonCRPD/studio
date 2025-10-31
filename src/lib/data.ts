
import type { DocumentReport, User, Feedback, Enquiry, ActivityLog, Notification, UserStatus, UserRole } from "@/lib/types";

const API_URL = "http://localhost:5000/api";


// --- USER FUNCTIONS ---
export async function getUsers(filters?: { status?: UserStatus | 'all', role?: UserRole | 'all' }): Promise<User[]> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  if (filters?.role && filters.role !== 'all') {
    params.append('role', filters.role);
  }

  try {
    const response = await fetch(`${API_URL}/users?${params.toString()}`);
    if (!response.ok) {
      console.error("Failed to fetch users:", response.statusText);
      return [];
    }
    const result = await response.json();
    // Backend sends { data: [User] }, and users have both id and _id.
    return result.data.map((user: any) => ({...user, id: user.id || user._id.toString()}));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) {
      if(response.status === 404) return null;
      console.error("Failed to fetch user:", response.statusText);
      return null;
    }
    const user = await response.json();
    return {...user, id: user.id || user._id.toString()};
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

// --- DOCUMENT FUNCTIONS ---
export async function getDocuments(filters?: { documentType?: string, location?: string, status?: string }): Promise<DocumentReport[]> {
  const params = new URLSearchParams();
  if (filters?.documentType && filters.documentType !== 'all') {
    params.append('documentType', filters.documentType);
  }
   if (filters?.location) {
    params.append('q', filters.location);
  }
  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }

  try {
    const response = await fetch(`${API_URL}/documents?${params.toString()}`);
    if (!response.ok) {
      console.error("Failed to fetch documents:", response.statusText);
      return [];
    }
    const result = await response.json();
    // Backend sends { data: [Document] }
    return result.data.map((doc: any) => ({
        ...doc, 
        id: doc.id || doc._id.toString(), 
        // Ensure reportedBy is a string ID
        reportedBy: doc.reportedBy?._id || doc.reportedBy?.id || doc.reportedBy 
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<DocumentReport | null> {
  try {
    const response = await fetch(`${API_URL}/documents/${id}`);
    if (!response.ok) {
        if(response.status === 404) return null;
        console.error("Failed to fetch document:", response.statusText);
        return null;
    }
    const doc = await response.json();
    return {
        ...doc, 
        id: doc.id || doc._id.toString(),
        // Ensure reportedBy is a string ID, from a potentially populated object
        reportedBy: doc.reportedBy?._id || doc.reportedBy?.id || doc.reportedBy
    };
  } catch (error) {
    console.error(`Error fetching document ${id}:`, error);
    return null;
  }
}


// --- FEEDBACK & ENQUIRY FUNCTIONS ---
export async function getFeedbacks(status?: "open" | "resolved" | "all"): Promise<Feedback[]> {
    const params = new URLSearchParams();
    if(status && status !== 'all') {
        params.append('status', status);
    }
    try {
        const response = await fetch(`${API_URL}/feedback?${params.toString()}`);
        if(!response.ok) {
            console.error("Failed to fetch feedback:", response.statusText);
            return [];
        }
        const result = await response.json();
        // Backend sends { data: [...] }
        return result.data.map((item: any) => ({...item, id: item.id || item._id.toString()}));
    } catch(error) {
        console.error("Error fetching feedback:", error);
        return [];
    }
}

export async function getEnquiries(status?: "open" | "resolved" | "all"): Promise<Enquiry[]> {
     const params = new URLSearchParams();
    if(status && status !== 'all') {
        params.append('status', status);
    }
    try {
        const response = await fetch(`${API_URL}/enquiries?${params.toString()}`);
        if(!response.ok) {
            console.error("Failed to fetch enquiries:", response.statusText);
            return [];
        }
        const result = await response.json();
        // Backend sends { data: [...] }
        return result.data.map((item: any) => ({...item, id: item.id || item._id.toString()}));
    } catch(error) {
        console.error("Error fetching enquiries:", error);
        return [];
    }
}


// --- ACTIVITY LOG FUNCTIONS ---
export async function getActivityLogsForUser(userId: string): Promise<ActivityLog[]> {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/activity`);
         if(!response.ok) {
            console.error("Failed to fetch activity logs:", response.statusText);
            return [];
        }
        const result = await response.json();
        // Backend sends a plain array
        return result.map((item: any) => ({...item, id: item.id || item._id.toString()}));
    } catch(error) {
        console.error(`Error fetching activity logs for user ${userId}:`, error);
        return [];
    }
}

// --- NOTIFICATION FUNCTIONS ---
export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    try {
        const response = await fetch(`${API_URL}/notifications/user/${userId}`);
         if(!response.ok) {
            console.error("Failed to fetch notifications:", response.statusText);
            return [];
        }
        const result = await response.json();
        // Backend sends a plain array
        return result.map((item: any) => ({...item, id: item.id || item._id.toString()}));
    } catch(error) {
        console.error(`Error fetching notifications for user ${userId}:`, error);
        return [];
    }
}
