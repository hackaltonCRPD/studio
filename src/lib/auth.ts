import type { User, UserRole } from "@/lib/types";

// In a real app, you'd get this from a session or cookie.
// We are hardcoding to "admin" for demonstration purposes.
export const MOCK_USER: User = {
  id: "user-1",
  name: "Admin User",
  email: "admin@docufind.com",
  avatarUrl: "https://picsum.photos/seed/1/40/40",
  role: "admin",
  status: 'active',
  credibilityScore: 95,
};

export async function getAuthenticatedUser(): Promise<User> {
  // Simulate an API call latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USER);
    }, 200);
  });
}

export function hasPermission(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole);
}
