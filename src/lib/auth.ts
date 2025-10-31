
import type { User } from "@/lib/types";

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
      if (response.status === 401) {
        return null;
      }
      console.error("Authentication check failed:", response.statusText);
      return null;
    }

    const user = await response.json();
    // The backend should return an object with both `_id` and `id`.
    return { ...user, id: user.id || user._id.toString() };
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return null;
  }
}

export async function logoutUser(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        return response.ok;
    } catch (error) {
        console.error("Error logging out:", error);
        return false;
    }
}
