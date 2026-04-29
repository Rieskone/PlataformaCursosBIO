import CourseCard from '@/components/CourseCard';
import { getPublishedCourses } from '@/lib/courses';

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <section>
      <h1 className="text-3xl font-bold">Catálogo de cursos</h1>
      <p className="mt-2 text-slate-600">Cursos disponibles públicamente en Campus Yerthy.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.length > 0 ? (
          courses.map((course) => <CourseCard key={course.id} course={course} />)
        ) : (
          <p className="rounded-lg border bg-white p-6 text-slate-600">Aún no hay cursos publicados.</p>
        )}
      </div>
    </section>
  );
}
