import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Course = Database['public']['Tables']['courses']['Row'];

export const getPublishedCourses = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getCourseBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('courses').select('*').eq('slug', slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

export const getAdminCourses = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug, is_published, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const createCourse = async (course: Pick<Course, 'title' | 'slug' | 'description' | 'price'>) => {
  const supabase = await createClient();
  const { error } = await supabase.from('courses').insert({ ...course, is_published: false });
  if (error) throw new Error(error.message);
};

export const getCourseCurriculum = async (courseId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('course_modules')
    .select('id, title, position, lessons(id, title, position, module_id)')
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    data?.map((module) => ({
      ...module,
      lessons: [...module.lessons].sort((a, b) => a.position - b.position),
    })) ?? []
  );
};

export const getLessonForCourse = async (lessonId: string, courseId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, description, video_url, content, position, module_id, course_modules!inner(course_id)')
    .eq('id', lessonId)
    .eq('course_modules.course_id', courseId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};
