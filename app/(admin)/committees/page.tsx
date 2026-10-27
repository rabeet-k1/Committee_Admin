import Link from 'next/link';
import { Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { formatDate, formatPkr, qs } from '@/lib/format';
import { COMMITTEE_STATUSES, type AdminCommittee, type CommitteeStatus, type Paged } from '@/lib/types';
import { Pagination } from '@/components/Pagination';
import { StatusBadge } from '@/components/StatusBadge';

const LIMIT = 20;

export default function CommitteesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  return (
    <Suspense fallback={<p className="muted">Loading committees...</p>}>
      <CommitteeList searchParams={searchParams} />
    </Suspense>
  );
}

async function CommitteeList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  // only forward a status the API will accept
  const status = COMMITTEE_STATUSES.includes(sp.status as CommitteeStatus) ? sp.status : undefined;

  const data = await apiFetch<Paged<AdminCommittee>>(
    `/admin/committees${qs({ page, limit: LIMIT, search: sp.q, status })}`,
  );

  return (
    <>
      <h1>Committees</h1>

      <form className="filters">
        <input name="q" defaultValue={sp.q ?? ''} placeholder="Search name or invite code" />
        <select name="status" defaultValue={status ?? ''}>
          <option value="">All statuses</option>
          {COMMITTEE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit">Filter</button>
      </form>

      <div className="table-wrap">
        {data.items.length === 0 ? (
          <div className="empty">No committees found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Organizer</th>
                <th>Members</th>
                <th>Contribution</th>
                <th>Every</th>
                <th>Starts</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/committees/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{c.organizer?.name ?? '—'}</td>
                  <td>
                    {c.memberCount} / {c.totalMembers}
                  </td>
                  <td>{formatPkr(c.contributionPkr)}</td>
                  <td>{c.frequency} days</td>
                  <td>{formatDate(c.startDate)}</td>
                  <td>
                    <StatusBadge value={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        basePath="/committees"
        page={data.page}
        limit={data.limit}
        total={data.total}
        params={{ q: sp.q, status }}
      />
    </>
  );
}
