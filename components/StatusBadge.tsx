const TONES: Record<string, string> = {
  ACTIVE: 'ok',
  COLLECTING: 'ok',
  PAID: 'ok',
  PAID_OUT: 'ok',
  COMPLETED: 'ok',
  ADMIN: 'info',
  ORGANIZER: 'info',
  READY_FOR_PAYOUT: 'info',
  DRAFT: 'muted',
  PENDING: 'muted',
  INVITED: 'muted',
  USER: 'muted',
  MEMBER: 'muted',
  LATE: 'warn',
  DEFAULTED: 'bad',
  CANCELLED: 'bad',
  REMOVED: 'bad',
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge ${TONES[value] ?? 'muted'}`}>{value.replaceAll('_', ' ')}</span>;
}
