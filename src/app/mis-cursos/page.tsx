import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { getMyCourses } from '@/lib/enrollments';

export default async function MyCoursesPage() {
  const user = await requireUser();
  const courses = await getMyCourses(user.id);

  return (
    <section>
      <h1 className="text-3xl font-bold">Mis cursos</h1>
      <p className="mt-2 text-slate-600">Aquí verás todos los cursos asignados o comprados.</p>

      <div className="mt-6 grid gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <article key={course.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="mt-2 text-slate-600">{course.description}</p>
              <Link href={`/aula/${course.slug}`} className="mt-4 inline-block text-brand-700 hover:underline">
                Ir al aula
              </Link>
            </article>
          ))
        ) : (
          <p className="rounded-lg border bg-white p-6 text-slate-600">
            Aún no tienes cursos. Explora el <Link href="/cursos" className="text-brand-700 underline">catálogo</Link>.
          </p>
        )}
      </div>
    </section>
  );
}
