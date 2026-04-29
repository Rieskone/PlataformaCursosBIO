import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { Button } from '@/components/Button';
import { createClient } from '@/lib/supabase/server';

const Header = async () => {
  const user = await getUser();

  const logout = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand-700">
          Campus Yerthy
        </Link>

        <div className="flex items-center gap-2">
          <Button href="/cursos" className="bg-transparent text-slate-700 hover:bg-slate-100">
            Cursos
          </Button>
          {user && (
            <Button href="/mis-cursos" className="bg-transparent text-slate-700 hover:bg-slate-100">
              Mis cursos
            </Button>
          )}
          {!user ? (
            <>
              <Button href="/login">Iniciar sesión</Button>
              <Button href="/registro" className="bg-slate-900 hover:bg-slate-800">
                Crear cuenta
              </Button>
            </>
          ) : (
            <form action={logout}>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                Cerrar sesión
              </Button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
