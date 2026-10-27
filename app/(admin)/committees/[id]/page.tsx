import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatDate, formatPkr } from '@/lib/format';
import type { CommitteeDetail } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';

export default async function CommitteeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await apiFetch<CommitteeDetail>(`/admin/committees/${id}`);

  const nameOf = new Map(c.members.map((m) => [m.id, m.user.name]));
  const activeMembers = c.members.filter((m) => m.status === 'ACTIVE');

  return (
    <>
      <Link href="/committees" className="back">
        ← Committees
      </Link>

      <div className="title-row">
        <h1>{c.name}</h1>
        <StatusBadge value={c.status} />
      </div>
      {c.description && <p className="muted">{c.description}</p>}

      <div className="card" style={{ marginTop: 16 }}>
        <dl className="meta">
          <div>
            <dt>Contribution</dt>
            <dd>{formatPkr(c.contributionPkr)}</dd>
          </div>
          <div>
            <dt>Pot per cycle</dt>
            <dd>{formatPkr(c.contributionPkr * c.totalMembers)}</dd>
          </div>
          <div>
            <dt>Members</dt>
            <dd>
              {activeMembers.length} / {c.totalMembers}
            </dd>
          </div>
          <div>
            <dt>Frequency</dt>
            <dd>Every {c.frequency} days</dd>
          </div>
          <div>
            <dt>Start date</dt>
            <dd>{formatDate(c.startDate)}</dd>
          </div>
          <div>
            <dt>Invite code</dt>
            <dd>{c.inviteCode}</dd>
          </div>
        </dl>
      </div>

      <h2>Members</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Payout #</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Trust</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {c.members.map((m) => (
              <tr key={m.id}>
                <td>{m.payoutOrder ?? '—'}</td>
                <td>{m.user.name}</td>
                <td>{m.user.phone}</td>
                <td>
                  <StatusBadge value={m.role} />
                </td>
                <td>
                  <StatusBadge value={m.status} />
                </td>
                <td>{m.user.trustScore}</td>
                <td>{formatDate(m.joinedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Cycles</h2>
      <div className="table-wrap">
        {c.cycles.length === 0 ? (
          <div className="empty">Cycles are created when the organizer starts the committee</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Due</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Late / defaulted</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              {c.cycles.map((cy) => {
                const paid = cy.contributions.filter((x) => x.status === 'PAID').length;
                const problems = cy.contributions.filter(
                  (x) => x.status === 'LATE' || x.status === 'DEFAULTED',
                ).length;
                return (
                  <tr key={cy.id}>
                    <td>{cy.number}</td>
                    <td>{formatDate(cy.dueDate)}</td>
                    <td>{nameOf.get(cy.recipientId) ?? '—'}</td>
                    <td>
                      <StatusBadge value={cy.status} />
                    </td>
                    <td>
                      {paid} / {cy.contributions.length}
                    </td>
                    <td>{problems > 0 ? problems : '—'}</td>
                    <td>{cy.payout ? `${formatPkr(cy.payout.amountPkr)} on ${formatDate(cy.payout.paidAt)}` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
