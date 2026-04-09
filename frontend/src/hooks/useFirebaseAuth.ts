"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  ensureFirebaseLocalPersistence,
  getFirebaseAuthInstance,
  isFirebaseClientConfigured,
} from "@/libs/firebase-client";

type SocialProvider = "google" | "github" | "facebook" | "twitter" | "microsoft" | "apple";

type AuthActionResult = {
  ok: boolean;
  error?: string;
};

function providerName(method: string) {
  switch (method) {
    case "google.com":
      return "Google";
    case "github.com":
      return "GitHub";
    case "facebook.com":
      return "Facebook";
    case "twitter.com":
      return "Twitter";
    case "microsoft.com":
      return "Microsoft";
    case "apple.com":
      return "Apple";
    case "password":
      return "email/password";
    default:
      return method;
  }
}

function buildProviderConflictMessage(email: string, methods: string[]): string {
  const nonPassword = methods.filter((method) => method !== "password");

  if (!nonPassword.length) {
    return "This email is already registered. Please use your password to sign in.";
  }

  const provider = providerName(nonPassword[0]);
  return `This email (${email}) is linked to ${provider} sign-in. Please continue with ${provider} instead of email/password.`;
}

function getProvider(provider: SocialProvider) {
  switch (provider) {
    case "google":
      return new GoogleAuthProvider();
    case "github":
      return new GithubAuthProvider();
    case "facebook":
      return new FacebookAuthProvider();
    case "twitter":
      return new TwitterAuthProvider();
    case "microsoft":
      return new OAuthProvider("microsoft.com");
    case "apple":
      return new OAuthProvider("apple.com");
  }
}

function normalizeAuthError(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: string }).code)
      : "";

  const rawMessage =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: string }).message)
      : "Authentication failed";

  const email =
    typeof error === "object" && error !== null && "customData" in error
      ? String(((error as { customData?: { email?: string } }).customData?.email ?? ""))
      : "";

  return { code, rawMessage, email };
}

export function useFirebaseAuth() {
  const [isReady, setIsReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  const missingConfigMessage = "Firebase client env vars are missing. Configure NEXT_PUBLIC_FIREBASE_* in Vercel.";

  useEffect(() => {
    if (!isFirebaseClientConfigured()) {
      setIsReady(true);
      return;
    }

    const firebaseAuth = getFirebaseAuthInstance();
    if (!firebaseAuth) {
      setIsReady(true);
      return;
    }

    let unsubscribe = () => {};

    void ensureFirebaseLocalPersistence().finally(() => {
      unsubscribe = onIdTokenChanged(firebaseAuth, async (nextUser) => {
        setUser(nextUser);
        if (nextUser) {
          setIdToken(await nextUser.getIdToken());
        } else {
          setIdToken(null);
        }
        setIsReady(true);
      });
    });

    return () => unsubscribe();
  }, []);

  const checkSignInMethods = useCallback(async (email: string): Promise<string[]> => {
    const firebaseAuth = getFirebaseAuthInstance();
    const trimmed = email.trim();

    if (!firebaseAuth || !trimmed) {
      return [];
    }

    try {
      return await fetchSignInMethodsForEmail(firebaseAuth, trimmed);
    } catch {
      return [];
    }
  }, []);

  const signInWithSocial = useCallback(async (providerNameValue: SocialProvider): Promise<AuthActionResult> => {
    const firebaseAuth = getFirebaseAuthInstance();
    if (!firebaseAuth) {
      return { ok: false, error: missingConfigMessage };
    }

    setIsBusy(true);

    try {
      const provider = getProvider(providerNameValue);
      if (providerNameValue === "google") {
        provider.setCustomParameters({ prompt: "select_account" });
      }

      await signInWithPopup(firebaseAuth, provider);
      return { ok: true };
    } catch (error) {
      const details = normalizeAuthError(error);

      if (details.code === "auth/account-exists-with-different-credential" && details.email) {
        const methods = await checkSignInMethods(details.email);
        return { ok: false, error: buildProviderConflictMessage(details.email, methods) };
      }

      return { ok: false, error: details.rawMessage };
    } finally {
      setIsBusy(false);
    }
  }, [checkSignInMethods, missingConfigMessage]);

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string): Promise<AuthActionResult> => {
    const firebaseAuth = getFirebaseAuthInstance();
    if (!firebaseAuth) {
      return { ok: false, error: missingConfigMessage };
    }

    setIsBusy(true);

    try {
      const methods = await checkSignInMethods(email);
      if (methods.includes("google.com") && !methods.includes("password")) {
        return { ok: false, error: buildProviderConflictMessage(email, methods) };
      }

      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      if (name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }

      return { ok: true };
    } catch (error) {
      const details = normalizeAuthError(error);
      if (details.code === "auth/email-already-in-use") {
        const methods = await checkSignInMethods(email);
        if (methods.length) {
          return { ok: false, error: buildProviderConflictMessage(email, methods) };
        }
      }

      return { ok: false, error: details.rawMessage };
    } finally {
      setIsBusy(false);
    }
  }, [checkSignInMethods, missingConfigMessage]);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    const firebaseAuth = getFirebaseAuthInstance();
    if (!firebaseAuth) {
      return { ok: false, error: missingConfigMessage };
    }

    setIsBusy(true);

    try {
      const methods = await checkSignInMethods(email);
      if (methods.includes("google.com") && !methods.includes("password")) {
        return { ok: false, error: buildProviderConflictMessage(email, methods) };
      }

      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      return { ok: true };
    } catch (error) {
      const details = normalizeAuthError(error);
      return { ok: false, error: details.rawMessage };
    } finally {
      setIsBusy(false);
    }
  }, [checkSignInMethods, missingConfigMessage]);

  const logOut = useCallback(async () => {
    const firebaseAuth = getFirebaseAuthInstance();
    if (!firebaseAuth) {
      return;
    }

    await signOut(firebaseAuth);
  }, []);

  const profile = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email ?? "",
      name: user.displayName ?? user.email?.split("@")[0] ?? "Researcher",
      photoUrl: user.photoURL ?? "",
      providerId: user.providerData[0]?.providerId ?? null,
    };
  }, [user]);

  return {
    isReady,
    isBusy,
    user,
    profile,
    idToken,
    checkSignInMethods,
    signInWithSocial,
    signUpWithEmail,
    signInWithEmail,
    logOut,
  };
}

export type { SocialProvider, AuthActionResult };
