import { type NextRequest } from "next/server";
import { getFirebaseAdminAuth } from "@/libs/firebase-admin";

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
