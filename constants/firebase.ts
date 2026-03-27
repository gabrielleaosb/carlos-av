// Credenciais do projeto Firebase
// Não é necessário instalar nenhum SDK — usamos a REST API do Firebase Auth
export const FIREBASE_API_KEY = "AIzaSyAb9RO9mh2l3kPkrmNg9PSqH8j3dagBqfs";

const BASE = "https://identitytoolkit.googleapis.com/v1/accounts";

export interface FirebaseAuthResult {
  idToken: string;
  refreshToken: string;
  localId: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
}

function parseError(code: string): string {
  const map: Record<string, string> = {
    EMAIL_NOT_FOUND:       "auth/user-not-found",
    INVALID_PASSWORD:      "auth/wrong-password",
    INVALID_LOGIN_CREDENTIALS: "auth/invalid-credential",
    EMAIL_EXISTS:          "auth/email-already-in-use",
    WEAK_PASSWORD:         "auth/weak-password",
    TOO_MANY_ATTEMPTS_TRY_LATER: "auth/too-many-requests",
    USER_DISABLED:         "auth/user-disabled",
  };
  return map[code] ?? code;
}

async function post<T>(endpoint: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}:${endpoint}?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const code = data?.error?.message ?? "UNKNOWN";
    throw { code: parseError(code) };
  }
  return data as T;
}

export interface FirebaseUserInfo {
  localId: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  emailVerified: boolean;
}

export const firebaseAuth = {
  signIn: (email: string, password: string) =>
    post<FirebaseAuthResult>("signInWithPassword", {
      email,
      password,
      returnSecureToken: true,
    }),

  signUp: (email: string, password: string) =>
    post<FirebaseAuthResult>("signUp", {
      email,
      password,
      returnSecureToken: true,
    }),

  updateProfile: (idToken: string, displayName: string) =>
    post<FirebaseAuthResult>("update", {
      idToken,
      displayName,
      returnSecureToken: true,
    }),

  signInWithGoogle: (idToken: string) =>
    post<FirebaseAuthResult>("signInWithIdp", {
      requestUri: "http://localhost",
      postBody: `id_token=${idToken}&providerId=google.com`,
      returnSecureToken: true,
      returnIdpCredential: true,
    }),

  sendVerificationEmail: (idToken: string) =>
    post<object>("sendOobCode", {
      requestType: "VERIFY_EMAIL",
      idToken,
    }),

  getUserInfo: (idToken: string) =>
    post<{ users: FirebaseUserInfo[] }>("lookup", { idToken }).then(
      (r) => r.users[0]
    ),
};
