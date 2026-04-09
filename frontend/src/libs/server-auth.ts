import { type NextRequest } from "next/server";
import { getFirebaseAdminAuth } from "@/libs/firebase-admin";
import { getSessionUserFromRequest } from "@/libs/local-auth";

export type VerifiedUser = {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  provider: string | null;
};

export class AuthRequestError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function getBearerToken(req: NextRequest): string {
  const authHeader = req.headers.get("authorization") ?? "";

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new AuthRequestError("Missing Authorization bearer token", 401);
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    throw new AuthRequestError("Empty authorization token", 401);
  }

  return token;
}

function getOptionalBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  return token || null;
}

export async function requireVerifiedUser(req: NextRequest): Promise<VerifiedUser> {
  const token = getBearerToken(req);
  const decoded = await getFirebaseAdminAuth().verifyIdToken(token, true);

  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    name: decoded.name ?? null,
    picture: decoded.picture ?? null,
    provider: decoded.firebase?.sign_in_provider ?? null,
  };
}

export async function requireAuthenticatedUser(req: NextRequest): Promise<VerifiedUser> {
  const bearerToken = getOptionalBearerToken(req);

  if (bearerToken) {
    try {
      const decoded = await getFirebaseAdminAuth().verifyIdToken(bearerToken, true);
      return {
        uid: decoded.uid,
        email: decoded.email ?? null,
        name: decoded.name ?? null,
        picture: decoded.picture ?? null,
        provider: decoded.firebase?.sign_in_provider ?? null,
      };
    } catch {
      throw new AuthRequestError("Invalid authorization token", 401);
    }
  }

  const sessionUser = await getSessionUserFromRequest(req);
  if (sessionUser) {
    return sessionUser;
  }

  throw new AuthRequestError("Authentication required", 401);
}
