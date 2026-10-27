import { cookies } from 'next/headers';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './config';

const base = {
  httpOnly: true, // JavaScript in the browser can't read the tokens
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

// Call only from a Server Action or Route Handler (server components can't set cookies).
export async function setSession(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, { ...base, maxAge: 15 * 60 }); // matches the API's 15m token
  store.set(REFRESH_COOKIE, refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
