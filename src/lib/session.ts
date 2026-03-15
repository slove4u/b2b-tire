import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "super-secret-key-for-b2b-tires"; // Move to .env for production
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  id: string;
  loginId: string;
  role: string;
  tier: string;
  name: string;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: SessionPayload) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt(user);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!payload?.id) {
    return null; // Invalid session
  }

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
