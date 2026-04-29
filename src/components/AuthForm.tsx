'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/Button';

type AuthState = { error?: string };

type AuthFormProps = {
  title: string;
  submitLabel: string;
  action: (prevState: AuthState, formData: FormData) => Promise<AuthState>;
};

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
    >
      {pending ? 'Procesando...' : label}
    </button>
  );
};

const AuthForm = ({ title, submitLabel, action }: AuthFormProps) => {
  const [state, formAction] = useActionState(action, {});

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">{title}</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton label={submitLabel} />
      </form>
      <div className="mt-4 text-sm text-slate-500">
        <Button href="/cursos" className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300">
          Volver al catálogo
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
