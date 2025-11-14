import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          course: string;
          goals: string;
          avatar_url: string | null;
          address: string | null;
          cpf: string | null;
          phone: string | null;
          plan_type: string;
          plan_duration: string;
          exam_type: 'residencia' | 'enem' | 'revalida' | 'concurso' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      planner_events: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          subject: string;
          description: string;
          type: 'materia' | 'assunto' | 'tarefa';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['planner_events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['planner_events']['Insert']>;
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          answer: string;
          difficulty: 'easy' | 'medium' | 'hard' | null;
          folder: string;
          last_reviewed: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['flashcards']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['flashcards']['Insert']>;
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          duration: number;
          date: string;
          type: 'pomodoro' | 'stopwatch' | 'countdown';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['study_sessions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['study_sessions']['Insert']>;
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>;
      };
    };
  };
}
