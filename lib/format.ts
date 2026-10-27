export const formatPkr = (n: number) => `Rs ${n.toLocaleString('en-PK')}`;

export const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

/** Builds "?a=1&b=2", skipping empty values. */
export function qs(params: Record<string, string | number | null | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') sp.set(key, String(value));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}
