import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isAdmin, requireUser } from '@/lib/auth';

export default async function AdminPage() {
  const user = await requireUser();
  const admin = await isAdmin(user.id);

  if (!admin) notFound();

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Panel de administración</h1>
      <p className="mt-2 text-slate-600">Gestiona cursos, módulos y lecciones.</p>
      <Link href="/admin/cursos" className="mt-4 inline-block text-brand-700 hover:underline">
        Ir a gestión de cursos
      </Link>
    </section>
  );
}
