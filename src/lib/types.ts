export type UserRole = "reporter" | "finder" | "rc_staff" | "police" | "admin";

export type UserStatus = "active" | "suspended" | "archived";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  status: UserStatus;
  credibilityScore: number;
  phoneNumber?: string;
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
};

export type ActivityLog = {
    id: string;
    userId: string;
    activity: string;
    timestamp: string;
    details?: string;
    ipAddress: string;
};
