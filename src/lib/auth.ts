
import type { User, UserRole } from "@/lib/types";

// In a real app, you'd get this from a session or cookie.
// We are hardcoding the user ID for demonstration purposes.
const MOCK_USER_ID = "66a3ff152538183187c5364b"; // This should match an ID in your DB
const API_URL = "http://localhost:5000/api";

// This function is being phased out in favor of a proper session-based authentication.
// For now, we return a mock user to avoid breaking components that still rely on it.
export async function getAuthenticatedUser(): Promise<User | null> {
  // In a real application, you would fetch this data based on a session token.
  // For now, we return the MOCK_USER to keep the UI functional during transition.
  try {
    const response = await fetch(`${API_URL}/users/${MOCK_USER_ID}`);
    if (!response.ok) {
      console.error("Authentication failed: Could not fetch user.", response.statusText);
      return MOCK_USER; // Fallback to mock user
    }
    const user = await response.json();
    return {...user, id: user._id.toString()};
  } catch (error) {
    console.error("Error during authentication:", error);
    // In case of a network error or if the backend is down, return the mock user.
    return MOCK_USER;
  }
}

export function hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole);
}

// Keep MOCK_USER for components that might still be using it temporarily or for offline testing
export const MOCK_USER: User = {
  id: "66a3ff152538183187c5364b",
  name: "Admin User",
  email: "admin@docufind.com",
  avatarUrl: "https://picsum.photos/seed/1/40/40",
  role: "admin",
  status: 'active',
  credibilityScore: 95,
};
