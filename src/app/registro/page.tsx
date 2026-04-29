import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/lib/supabase/server';

export default function RegisterPage() {
  const registerAction = async (_: { error?: string }, formData: FormData) => {
    'use server';

    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
      },
    });

    if (error) return { error: 'No se pudo crear tu cuenta. Intenta nuevamente.' };

    redirect('/login');
  };

  return <AuthForm title="Crear cuenta" submitLabel="Registrarme" action={registerAction} />;
}
