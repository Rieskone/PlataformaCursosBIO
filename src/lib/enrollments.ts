import { createClient } from '@/lib/supabase/server';

export const userHasCourseAccess = async (userId: string, courseId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  return Boolean(data);
};

export const getMyCourses = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enrollments')
    .select('created_at, courses(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data?.map((row) => row.courses).filter(Boolean) ?? [];
};
