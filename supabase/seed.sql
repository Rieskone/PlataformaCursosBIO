-- Campus Yerthy - Seed de datos de prueba
-- Inserta cursos, módulos y clases para validar flujo completo.

begin;

with upsert_courses as (
  insert into public.courses (title, slug, description, price, currency, cover_image, is_published)
  values
    (
      'Proyecto Sentido',
      'proyecto-sentido',
      'Curso para comprender y trabajar el proyecto sentido desde una mirada biológica y sistémica.',
      49000,
      'CLP',
      'https://placehold.co/1200x630?text=Proyecto+Sentido',
      true
    ),
    (
      'BioTransgeneracional',
      'biotransgeneracional',
      'Curso para explorar patrones heredados y dinámicas transgeneracionales aplicadas al desarrollo personal.',
      79000,
      'CLP',
      'https://placehold.co/1200x630?text=BioTransgeneracional',
      true
    ),
    (
      'Bionumerología Base 22',
      'bionumerologia-base-22',
      'Curso introductorio y práctico para comprender la base 22 y su aplicación terapéutica.',
      69000,
      'CLP',
      'https://placehold.co/1200x630?text=Bionumerologia+Base+22',
      true
    ),
    (
      'Curso oculto admin',
      'curso-oculto-admin',
      'Curso privado para validaciones administrativas y QA.',
      99000,
      'CLP',
      'https://placehold.co/1200x630?text=Curso+Oculto+Admin',
      false
    )
  on conflict (slug)
  do update set
    title = excluded.title,
    description = excluded.description,
    price = excluded.price,
    currency = excluded.currency,
    cover_image = excluded.cover_image,
    is_published = excluded.is_published
  returning id, slug
),
published_courses as (
  select c.id, c.slug
  from public.courses c
  where c.slug in ('proyecto-sentido', 'biotransgeneracional', 'bionumerologia-base-22')
),
insert_modules as (
  insert into public.course_modules (course_id, title, position)
  select pc.id, m.title, m.position
  from published_courses pc
  cross join (
    values
      ('Módulo 1 · Fundamentos', 1),
      ('Módulo 2 · Aplicación práctica', 2)
  ) as m(title, position)
  on conflict (course_id, position)
  do update set title = excluded.title
  returning id, course_id, title, position
)
insert into public.lessons (module_id, title, description, video_url, content, position, is_preview)
select
  im.id,
  l.title,
  l.description,
  l.video_url,
  l.content,
  l.position,
  l.is_preview
from insert_modules im
cross join lateral (
  values
    (
      1,
      case when im.position = 1 then 'Clase 1 · Introducción' else 'Clase 1 · Caso guiado' end,
      case when im.position = 1 then 'Bienvenida y marco conceptual del curso.' else 'Aplicación guiada del contenido en contexto real.' end,
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      '<h2>Objetivo de la clase</h2><p>En esta clase revisaremos conceptos clave y primeros pasos de implementación.</p><ul><li>Contexto</li><li>Práctica inicial</li><li>Cierre</li></ul>',
      true
    ),
    (
      2,
      case when im.position = 1 then 'Clase 2 · Principios base' else 'Clase 2 · Herramientas de intervención' end,
      case when im.position = 1 then 'Profundización teórica para consolidar fundamentos.' else 'Técnicas y ejercicios para aplicar en sesiones.' end,
      'https://www.youtube.com/embed/ysz5S6PUM-U',
      '<h2>Contenido</h2><p>Desarrollamos principios y recursos prácticos con ejemplos concretos.</p><p>Recomendación: tomar notas y avanzar con tu propio caso.</p>',
      false
    ),
    (
      3,
      case when im.position = 1 then 'Clase 3 · Integración inicial' else 'Clase 3 · Plan de acción final' end,
      case when im.position = 1 then 'Síntesis y conexión de aprendizajes del módulo.' else 'Diseño de plan de continuidad y seguimiento.' end,
      'https://www.youtube.com/embed/jNQXAC9IVRw',
      '<h2>Cierre de módulo</h2><p>Integramos todo lo aprendido y definimos próximos pasos medibles.</p>',
      false
    )
) as l(position, title, description, video_url, content, is_preview)
on conflict (module_id, position)
do update set
  title = excluded.title,
  description = excluded.description,
  video_url = excluded.video_url,
  content = excluded.content,
  is_preview = excluded.is_preview;

commit;

-- ============================================================
-- Cómo ejecutar este seed
-- ============================================================
-- 1) Abre Supabase Dashboard > SQL Editor.
-- 2) Copia y ejecuta este archivo completo (supabase/seed.sql).
-- 3) Verifica cursos en la tabla public.courses.

-- ============================================================
-- Cómo crear un usuario admin manualmente
-- ============================================================
-- Requisito: el usuario debe haberse registrado antes en /registro.
-- update public.profiles
-- set role = 'admin'
-- where email = 'tu-admin@dominio.com';

-- ============================================================
-- Cómo asignar enrollment manual a un usuario real
-- ============================================================
-- 1) Obtén user_id desde auth.users o public.profiles.
-- 2) Obtén course_id desde public.courses (por slug).
-- insert into public.enrollments (user_id, course_id)
-- values ('<USER_UUID>', '<COURSE_UUID>')
-- on conflict (user_id, course_id) do nothing;
