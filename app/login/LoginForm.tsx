'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {
    error: initialError,
  });

  return (
    <form action={action}>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" placeholder="+923001234567" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
