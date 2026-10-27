import Link from 'next/link';
import { qs } from '@/lib/format';

interface Props {
  basePath: string;
  page: number;
  limit: number;
  total: number;
  /** Other query params to keep while paging (search text, filters). */
  params?: Record<string, string | undefined>;
}

export function Pagination({ basePath, page, limit, total, params = {} }: Props) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const href = (p: number) => `${basePath}${qs({ ...params, page: p })}`;

  return (
    <div className="pager">
      <span className="muted">
        {total} result{total === 1 ? '' : 's'} · page {page} of {pages}
      </span>
      <span className="pager-links">
        {page > 1 ? <Link href={href(page - 1)}>← Previous</Link> : <span className="disabled">← Previous</span>}
        {page < pages ? <Link href={href(page + 1)}>Next →</Link> : <span className="disabled">Next →</span>}
      </span>
    </div>
  );
}
