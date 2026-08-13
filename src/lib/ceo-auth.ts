import { cookies } from "next/headers";
import crypto from "crypto";

const CEO_SESSION_COOKIE_NAME = "ceo_portal_session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * Verify CEO credentials and create a session
 */
export async function createCEOSession(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUsername = process.env.CEO_PORTAL_USERNAME || "geniuslabs";
  const expectedPassword = process.env.CEO_PORTAL_PASSWORD || "123456";

  // Check credentials
  if (username !== expectedUsername || password !== expectedPassword) {
    return false;
  }

  // Create session token (random hash)
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  // Set secure HTTP-only cookie
  cookieStore.set(CEO_SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return true;
}

/**
 * Verify if user has valid CEO session
 */
export async function verifyCEOSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CEO_SESSION_COOKIE_NAME)?.value;
  return !!sessionToken;
}

/**
 * Clear CEO session
 */
export async function clearCEOSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CEO_SESSION_COOKIE_NAME);
}

/**
 * Middleware helper to protect routes
 */
export async function requireCEOAuth(): Promise<void> {
  const hasSession = await verifyCEOSession();
  if (!hasSession) {
    throw new Error("Unauthorized: CEO session required");
  }
}
