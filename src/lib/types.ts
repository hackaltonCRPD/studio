
export type UserRole = "reporter" | "finder" | "rc_staff" | "police" | "admin";

export type UserStatus = "active" | "suspended" | "archived";

export type User = {
  id: string;
  _id: string; // Keep _id for backend consistency
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  credibilityScore: number;
  phoneNumber?: string;
  createdAt: string;
  preferredContactMethod?: "email" | "phone";
};

export type DocumentReport = {
  id: string;
  documentType: string;
  description: string;
  dateLost: string;
  location: string;
  status: "lost" | "found" | "claimed";
  reportedBy: string; // User ID
  imageUrl?: string;
  reportDate: string;
  claims: Claim[];
};

export type Claim = {
    _id: string;
    claimant: User;
    status: "pending" | "approved" | "rejected";
    claimDate: string;
    notes?: string;
};

export type Feedback = {
  id: string;
  subject: string;
  message: string;
  userId: string;
  date: string;
  status: "open" | "resolved";
};

export type Enquiry = {
  id: string;
  subject: string;
  question: string;
  userId: string;
  date: string;
  status: "open" | "resolved";
  name?: string;
  email?: string;
};

export type ActivityLog = {
    id: string;
    userId: string;
    activity: string;
    timestamp: string;
    details?: string;
    ipAddress: string;
};

export type Notification = {
    id: string;
    userId: string;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    link?: string;
};
