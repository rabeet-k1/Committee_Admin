import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<div className="login-wrap"><div className="card login-card"><p className="muted">Loading...</p></div></div>}>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1>Committee Admin</h1>
        <LoginForm initialError={error === 'forbidden' ? 'This account is not an admin' : undefined} />
      </div>
    </div>
  );
}
