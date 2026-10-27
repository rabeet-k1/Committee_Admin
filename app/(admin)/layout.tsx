import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import type { Me } from '@/lib/types';
import { NavLink } from '@/components/NavLink';
import { logoutAction } from './actions';

// Everything inside (admin)/ is protected: no valid ADMIN session, no page.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const me = await apiFetch<Me>('/users/me');
  if (me.role !== 'ADMIN') redirect('/login?error=forbidden');

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Committee Admin</div>
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/committees">Committees</NavLink>
        <NavLink href="/users">Users</NavLink>
        <div className="sidebar-foot">
          <div>{me.name}</div>
          <form action={logoutAction}>
            <button type="submit" className="link">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
