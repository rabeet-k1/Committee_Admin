import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL, REFRESHED_FLAG, REFRESH_COOKIE } from '@/lib/config';
import { clearSession, setSession } from '@/lib/session';

// Server components can't set cookies, so expired access tokens are renewed here:
// apiFetch() redirects to /auth/refresh, this swaps in a fresh token pair, then sends you home.
export async function GET(req: NextRequest) {
  const store = await cookies();
  const toLogin = () => NextResponse.redirect(new URL('/login', req.url));

  // We just refreshed and the API still said 401: stop here instead of looping forever.
  if (store.get(REFRESHED_FLAG)) {
    await clearSession();
    return toLogin();
  }

  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return toLogin();

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  }).catch(() => null);

  if (!res?.ok) {
    await clearSession();
    return toLogin();
  }

  const data = await res.json();
  if (data.user?.role !== 'ADMIN') {
    await clearSession();
    return toLogin();
  }

  await setSession(data.accessToken, data.refreshToken);
  store.set(REFRESHED_FLAG, '1', { maxAge: 10, path: '/', httpOnly: true });
  return NextResponse.redirect(new URL('/', req.url));
}
