import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getCourseCurriculum } from '@/lib/courses';
import { requireUser } from '@/lib/auth';
import { userHasCourseAccess } from '@/lib/enrollments';

export default async function CourseClassroomPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const user = await requireUser();
  const course = await getCourseBySlug(courseSlug);

  if (!course) notFound();

  const hasAccess = await userHasCourseAccess(user.id, course.id);
  if (!hasAccess) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Acceso restringido</h1>
        <p className="mt-2 text-slate-600">No tienes acceso a este curso todavía.</p>
      </section>
    );
  }

  const modules = await getCourseCurriculum(course.id);

  return (
    <section>
      <h1 className="text-3xl font-bold">Aula: {course.title}</h1>
      <p className="mt-2 text-slate-600">Revisa módulos y avanza clase por clase.</p>

      <div className="mt-6 space-y-4">
        {modules.map((module) => (
          <article key={module.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{module.position}. {module.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link href={`/aula/${course.slug}/${lesson.id}`} className="hover:text-brand-700 hover:underline">
                    {lesson.position}. {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
