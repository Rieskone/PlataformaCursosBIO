import { Button } from '@/components/Button';

export default function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Campus Yerthy</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl">Aprende con cursos prácticos y una experiencia guiada.</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Explora cursos, accede a tus clases y sigue tu progreso en un aula privada enfocada en resultados.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/cursos">Ver catálogo</Button>
        <Button href="/registro" className="bg-slate-900 hover:bg-slate-800">
          Crear cuenta
        </Button>
      </div>
    </section>
  );
}
