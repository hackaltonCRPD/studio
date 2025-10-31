
import type { User, UserRole } from "@/lib/types";

// The backend handles sessions via HTTP-only cookies.
// This function checks if a user is authenticated by making a request to a profile endpoint.
const API_URL = "http://localhost:5000/api";

export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    // The browser will automatically send the session cookie.
    const response = await fetch(`${API_URL}/auth/profile`, {
        // 'include' is necessary to send cookies to a different origin
        credentials: 'include', 
    });

    if (!response.ok) {
      // This happens if the cookie is invalid, expired, or not present.
      // It's an expected case for non-authenticated users.
      if (response.status === 401) {
        return null;
      }
      // For other errors (like 500), we log it but still treat as unauthenticated.
      console.error("Authentication check failed:", response.statusText);
      return null;
    }

    const user = await response.json();
    // The backend might return _id, so we map it to id.
    return { ...user, id: user._id.toString(), createdAt: user.createdAt };
  } catch (error) {
    // This could be a network error or if the backend is down.
    console.error("Error checking authentication status:", error);
    return null;
  }
}


export function hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole);
}

// MOCK_USER is no longer needed for authentication but can be kept for testing if required.
export const MOCK_USER: User = {
  id: "66a3ff152538183187c5364b",
  name: "Admin User",
  email: "admin@docufind.com",
  avatarUrl: "https://picsum.photos/seed/1/40/40",
  role: "admin",
  status: 'active',
  credibilityScore: 95,
  phoneNumber: "111-222-3333",
  createdAt: new Date().toISOString(),
};
