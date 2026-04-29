import { notFound } from 'next/navigation';
import { getCourseBySlug, getLessonForCourse } from '@/lib/courses';
import { requireUser } from '@/lib/auth';
import { userHasCourseAccess } from '@/lib/enrollments';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
}) {
  const { courseSlug, lessonId } = await params;
  const user = await requireUser();
  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const hasAccess = await userHasCourseAccess(user.id, course.id);
  if (!hasAccess) notFound();

  const lesson = await getLessonForCourse(lessonId, course.id);
  if (!lesson) notFound();

  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-brand-700">Lección {lesson.position}</p>
      <h1 className="mt-1 text-3xl font-bold">{lesson.title}</h1>
      <p className="mt-3 text-slate-600">{lesson.description}</p>
      {lesson.video_url ? (
        <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg bg-slate-950">
          <iframe
            className="h-full w-full"
            src={lesson.video_url}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-slate-100 p-4 text-sm text-slate-600">Esta lección aún no tiene video.</p>
      )}
      {lesson.content && <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />}
    </article>
  );
}
