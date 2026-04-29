import Link from 'next/link';
import type { Database } from '@/types/database';

type Course = Database['public']['Tables']['courses']['Row'];

const CourseCard = ({ course }: { course: Course }) => (
  <article className="flex flex-col rounded-xl border bg-white p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
    <p className="mt-2 line-clamp-3 text-sm text-slate-600">{course.description || 'Curso sin descripción aún.'}</p>
    <p className="mt-4 text-sm font-semibold text-brand-700">
      {new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: course.currency,
      }).format(course.price)}
    </p>
    <Link href={`/cursos/${course.slug}`} className="mt-4 text-sm font-semibold text-brand-700 hover:underline">
      Ver detalle →
    </Link>
  </article>
);

export default CourseCard;
