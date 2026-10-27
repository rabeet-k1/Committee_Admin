import { LoginForm } from './LoginForm';

export default async function LoginPage({
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
