export type Role = 'USER' | 'ADMIN';
export type CommitteeStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type CycleStatus = 'PENDING' | 'COLLECTING' | 'READY_FOR_PAYOUT' | 'PAID_OUT';
export type ContributionStatus = 'PENDING' | 'PAID' | 'LATE' | 'DEFAULTED';
export type MemberRole = 'ORGANIZER' | 'MEMBER';
export type MemberStatus = 'INVITED' | 'ACTIVE' | 'REMOVED';

export const COMMITTEE_STATUSES: CommitteeStatus[] = ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Me {
  id: string;
  name: string;
  phone: string;
  role: Role;
}

export interface AdminStats {
  users: number;
  committees: { total: number } & Record<CommitteeStatus, number>;
  contributions: Record<ContributionStatus, number>;
  openDisputes: number;
}

export interface AdminUser {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: Role;
  trustScore: number;
  createdAt: string;
  _count: { memberships: number };
}

export interface AdminCommittee {
  id: string;
  name: string;
  contributionPkr: number;
  frequency: number;
  totalMembers: number;
  startDate: string;
  status: CommitteeStatus;
  inviteCode: string;
  createdAt: string;
  memberCount: number;
  organizer: { id: string; name: string; phone: string } | null;
}

export interface CommitteeDetail {
  id: string;
  name: string;
  description: string | null;
  contributionPkr: number;
  frequency: number;
  totalMembers: number;
  startDate: string;
  status: CommitteeStatus;
  inviteCode: string;
  createdAt: string;
  members: {
    id: string;
    role: MemberRole;
    status: MemberStatus;
    payoutOrder: number | null;
    joinedAt: string | null;
    user: { id: string; name: string; phone: string; trustScore: number };
  }[];
  cycles: {
    id: string;
    number: number;
    dueDate: string;
    status: CycleStatus;
    recipientId: string;
    payout: { id: string; amountPkr: number; paidAt: string } | null;
    contributions: {
      id: string;
      memberId: string;
      amountPkr: number;
      status: ContributionStatus;
      paidAt: string | null;
      confirmedByOrganizer: boolean;
    }[];
  }[];
}
