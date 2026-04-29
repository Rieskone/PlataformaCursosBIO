# Campus Yerthy

Base inicial de plataforma de cursos online con:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase + `@supabase/ssr`
- Placeholders API para Mercado Pago (sin cobros reales aún)

## Requisitos

- Node.js 20+
- Proyecto Supabase activo

## 1) Instalar dependencias

```bash
npm install
```

## 2) Crear `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `SUPABASE_SERVICE_ROLE_KEY` es privada: no la uses ni expongas en componentes cliente.

## 3) Ejecutar SQL en Supabase

1. Abre Supabase Dashboard.
2. Ve a **SQL Editor**.
3. Copia/pega `supabase/schema.sql`.
4. Ejecuta el script completo.

Incluye:

- Tablas y relaciones: `profiles`, `courses`, `course_modules`, `lessons`, `orders`, `enrollments`, `lesson_progress`.
- Índices de lectura frecuentes.
- Trigger para crear `profiles` al registrarse.
- RLS habilitado en todas las tablas.
- Políticas para alumnos y administración (`profiles.role = 'admin'`).

## 4) Levantar proyecto local

```bash
npm run dev
```

Abrir en: `http://localhost:3000`

## 5) Crear usuario admin manualmente

Después de registrar un usuario en `/registro`, actualiza su rol en SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'tu-email-admin@dominio.com';
```

## 6) Probar flujo básico

1. Entrar a `/` y luego `/cursos`.
2. Abrir `/cursos/[slug]` de un curso publicado.
3. Sin sesión, validar botón: **Iniciar sesión para comprar**.
4. Registrarse o iniciar sesión en `/registro` o `/login`.
5. Con sesión y sin enrollment, validar botón: **Comprar curso**.
6. Crear enrollment desde SQL para test:

```sql
insert into public.enrollments (user_id, course_id)
values ('<auth_user_uuid>', '<course_uuid>')
on conflict (user_id, course_id) do nothing;
```

7. Volver al detalle: botón debe cambiar a **Entrar al aula**.
8. Entrar a `/mis-cursos` y luego `/aula/[courseSlug]`.
9. Abrir `/aula/[courseSlug]/[lessonId]` y verificar acceso restringido si no hay enrollment.

## Rutas disponibles

- `/`
- `/cursos`
- `/cursos/[slug]`
- `/login`
- `/registro`
- `/mis-cursos`
- `/aula/[courseSlug]`
- `/aula/[courseSlug]/[lessonId]`
- `/admin`
- `/admin/cursos`
- `/admin/cursos/nuevo`
- `POST /api/mercado-pago/create-preference` (placeholder)
- `POST /api/mercado-pago/webhook` (placeholder)

## Notas de arquitectura

- No se usa Pages Router (`pages/`).
- Auth y páginas protegidas se validan en servidor.
- Queries principales centralizadas en `src/lib/auth.ts`, `src/lib/courses.ts` y `src/lib/enrollments.ts`.
- Mercado Pago queda en modo placeholder por decisión de alcance.
