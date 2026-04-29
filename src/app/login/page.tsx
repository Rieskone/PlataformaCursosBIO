import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/lib/supabase/server';

export default function LoginPage() {
  const loginAction = async (_: { error?: string }, formData: FormData) => {
    'use server';

    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error: 'Credenciales inválidas. Verifica tus datos.' };

    redirect('/mis-cursos');
  };

  return <AuthForm title="Iniciar sesión" submitLabel="Entrar" action={loginAction} />;
}
