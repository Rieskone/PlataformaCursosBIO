import { notFound, redirect } from 'next/navigation';
import { isAdmin, requireUser } from '@/lib/auth';
import { createCourse } from '@/lib/courses';

export default async function NewCoursePage() {
  const user = await requireUser();
  const admin = await isAdmin(user.id);
  if (!admin) notFound();

  const createCourseAction = async (formData: FormData) => {
    'use server';

    const currentUser = await requireUser();
    if (!(await isAdmin(currentUser.id))) notFound();

    const title = String(formData.get('title') || '').trim();
    const slug = String(formData.get('slug') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const price = Number(formData.get('price') || 0);

    if (!title || !slug || Number.isNaN(price) || price < 0) notFound();

    await createCourse({ title, slug, description, price });
    redirect('/admin/cursos');
  };

  return (
    <section className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Nuevo curso</h1>
      <form action={createCourseAction} className="mt-6 space-y-4">
        <input name="title" placeholder="Título" required className="w-full rounded-lg border px-3 py-2" />
        <input name="slug" placeholder="slug-del-curso" required className="w-full rounded-lg border px-3 py-2" />
        <textarea name="description" placeholder="Descripción" className="w-full rounded-lg border px-3 py-2" />
        <input name="price" type="number" min={0} required className="w-full rounded-lg border px-3 py-2" />
        <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-white">
          Crear curso
        </button>
      </form>
    </section>
  );
}
