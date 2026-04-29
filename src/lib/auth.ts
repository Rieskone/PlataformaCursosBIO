import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const requireUser = async () => {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
};

export const getUserRole = async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role ?? 'student';
};

export const isAdmin = async (userId: string) => (await getUserRole(userId)) === 'admin';
