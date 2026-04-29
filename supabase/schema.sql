-- Campus Yerthy - Esquema inicial Supabase
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price integer not null check (price >= 0),
  currency text not null default 'CLP',
  cover_image text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null,
  created_at timestamptz not null default now(),
  unique (course_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  content text,
  position integer not null,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  unique (module_id, position)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  amount integer not null check (amount >= 0),
  currency text not null default 'CLP',
  payment_provider text,
  payment_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- Índices útiles
create index if not exists idx_courses_published on public.courses(is_published);
create index if not exists idx_courses_slug on public.courses(slug);
create index if not exists idx_modules_course on public.course_modules(course_id, position);
create index if not exists idx_lessons_module on public.lessons(module_id, position);
create index if not exists idx_orders_user on public.orders(user_id, created_at desc);
create index if not exists idx_enrollments_user on public.enrollments(user_id, created_at desc);
create index if not exists idx_progress_user on public.lesson_progress(user_id);

-- Trigger para crear profile automático
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Helper admin check
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.orders enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles policies
create policy "profiles_self_select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_self_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- courses public/admin policies
create policy "courses_public_read_published"
  on public.courses for select
  using (is_published = true or public.is_admin());

create policy "courses_admin_insert"
  on public.courses for insert
  with check (public.is_admin());

create policy "courses_admin_update"
  on public.courses for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "courses_admin_delete"
  on public.courses for delete
  using (public.is_admin());

-- modules public/admin policies
create policy "modules_read_published_courses"
  on public.course_modules for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_modules.course_id
        and (c.is_published = true or public.is_admin())
    )
  );

create policy "modules_admin_insert"
  on public.course_modules for insert
  with check (public.is_admin());

create policy "modules_admin_update"
  on public.course_modules for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "modules_admin_delete"
  on public.course_modules for delete
  using (public.is_admin());

-- lessons public/admin policies
create policy "lessons_read_published_courses"
  on public.lessons for select
  using (
    exists (
      select 1
      from public.course_modules cm
      join public.courses c on c.id = cm.course_id
      where cm.id = lessons.module_id
        and (c.is_published = true or public.is_admin())
    )
  );

create policy "lessons_admin_insert"
  on public.lessons for insert
  with check (public.is_admin());

create policy "lessons_admin_update"
  on public.lessons for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "lessons_admin_delete"
  on public.lessons for delete
  using (public.is_admin());

-- orders policies
create policy "orders_own_select"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders_own_insert"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- enrollments policies
create policy "enrollments_own_select"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "enrollments_own_insert"
  on public.enrollments for insert
  with check (auth.uid() = user_id or public.is_admin());

-- lesson_progress policies
create policy "lesson_progress_own_select"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "lesson_progress_own_insert"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "lesson_progress_own_update"
  on public.lesson_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
