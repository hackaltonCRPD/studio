export type UserRole = "reporter" | "finder" | "rc_staff" | "police" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
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
