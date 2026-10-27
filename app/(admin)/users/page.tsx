import { apiFetch } from '@/lib/api';
import { formatDate, qs } from '@/lib/format';
import type { AdminUser, Paged } from '@/lib/types';
import { Pagination } from '@/components/Pagination';
import { StatusBadge } from '@/components/StatusBadge';

const LIMIT = 20;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const data = await apiFetch<Paged<AdminUser>>(
    `/admin/users${qs({ page, limit: LIMIT, search: sp.q })}`,
  );

  return (
    <>
      <h1>Users</h1>

      <form className="filters">
        <input name="q" defaultValue={sp.q ?? ''} placeholder="Search name, phone or email" />
        <button type="submit">Search</button>
      </form>

      <div className="table-wrap">
        {data.items.length === 0 ? (
          <div className="empty">No users found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Trust</th>
                <th>Committees</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td>{u.email ?? '—'}</td>
                  <td>
                    <StatusBadge value={u.role} />
                  </td>
                  <td>{u.trustScore}</td>
                  <td>{u._count.memberships}</td>
                  <td>{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination basePath="/users" page={data.page} limit={data.limit} total={data.total} params={{ q: sp.q }} />
    </>
  );
}
