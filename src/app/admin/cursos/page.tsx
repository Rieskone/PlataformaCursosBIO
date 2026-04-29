import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isAdmin, requireUser } from '@/lib/auth';
import { getAdminCourses } from '@/lib/courses';

export default async function AdminCoursesPage() {
  const user = await requireUser();
  const admin = await isAdmin(user.id);
  if (!admin) notFound();

  const courses = await getAdminCourses();

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Administrar cursos</h1>
        <Link href="/admin/cursos/nuevo" className="rounded-lg bg-brand-600 px-4 py-2 text-white">
          Nuevo curso
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {courses.map((course) => (
          <article key={course.id} className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">{course.title}</h2>
            <p className="text-sm text-slate-600">/{course.slug}</p>
            <p className="text-xs text-slate-500">{course.is_published ? 'Publicado' : 'Borrador'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
