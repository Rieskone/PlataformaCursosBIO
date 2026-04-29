export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: 'student' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'student' | 'admin';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          currency: string;
          cover_image: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          currency?: string;
          cover_image?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      course_modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          position: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['course_modules']['Insert']>;
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          content: string | null;
          position: number;
          is_preview: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          video_url?: string | null;
          content?: string | null;
          position: number;
          is_preview?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          amount: number;
          currency: string;
          payment_provider: string | null;
          payment_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          amount: number;
          currency?: string;
          payment_provider?: string | null;
          payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          order_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          order_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>;
      };
    };
  };
};
