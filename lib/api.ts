import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { ACCESS_COOKIE, API_URL } from './config';

/** GET a JSON endpoint from the Nest API with the admin's access token. Server components only. */
export async function apiFetch<T>(path: string): Promise<T> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  // Cookie expires with the 15 min token, so a missing cookie usually just means "refresh me".
  if (!token) redirect('/auth/refresh');

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  } catch {
    throw new Error('Cannot reach the API. Is the backend running and API_URL correct?');
  }

  if (res.status === 401) redirect('/auth/refresh');
  if (res.status === 403) redirect('/login?error=forbidden');
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);

  return (await res.json()) as T;
}
