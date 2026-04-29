import { notFound } from 'next/navigation';
import CourseAccessButton from '@/components/CourseAccessButton';
import { getCourseBySlug } from '@/lib/courses';
import { getUser, isAdmin } from '@/lib/auth';
import { userHasCourseAccess } from '@/lib/enrollments';

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, user] = await Promise.all([getCourseBySlug(slug), getUser()]);

  if (!course) notFound();

  const canViewUnpublished = user ? await isAdmin(user.id) : false;
  if (!course.is_published && !canViewUnpublished) notFound();

  const hasAccess = user ? await userHasCourseAccess(user.id, course.id) : false;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="mt-3 text-slate-600">{course.description}</p>
        <p className="mt-4 text-lg font-semibold text-brand-700">
          {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: course.currency,
          }).format(course.price)}
        </p>
        <div className="mt-6">
          <CourseAccessButton isLoggedIn={Boolean(user)} hasAccess={hasAccess} courseSlug={course.slug} />
        </div>
      </div>
    </section>
  );
}
