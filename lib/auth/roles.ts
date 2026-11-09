export type UserRole = "user" | "moderator" | "admin";

/**
 * The original admin gate was a single env-var email compare. Keeping it as
 * a fallback here means the existing admin never loses access mid-rollout,
 * even before their profile row is manually promoted to role = "admin".
 */
export function isAdmin(role: UserRole | null | undefined, email?: string | null): boolean {
  return role === "admin" || (!!email && email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
}
