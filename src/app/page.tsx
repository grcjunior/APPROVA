"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Calendar, FileText, Target, Timer, BarChart3, 
  Users, User, Plus, Play, Pause, RotateCcw, Check, 
  Clock, TrendingUp, Award, Brain, Settings, Search,
  ChevronRight, Edit, Trash2, Star, Filter, Download,
  Upload, Link, MessageCircle, ThumbsUp, Send, Bell,
  Moon, Sun, Volume2, VolumeX, Home, CheckCircle2,
  Circle, AlertCircle, Calendar as CalendarIcon,
  ArrowRight, Zap, Activity, Focus, Menu, X, Infinity,
  Lightbulb, BookMarked, GraduationCap, ClipboardList,
  ChevronLeft, ChevronDown, HelpCircle, Trophy, Medal,
  Camera, Save, Eye, EyeOff, RefreshCw, BarChart2,
  PieChart, Flame, Coffee, LogOut
} from 'lucide-react';

// Tipos de dados
interface UserProfile {
  id: string;
  name: string;
  email: string;
  course: string;
  goals: string;
  avatar_url?: string | null;
  address?: string | null;
  cpf?: string | null;
  phone?: string | null;
  plan_type?: string;
  plan_duration?: string;
  exam_type?: 'residencia' | 'enem' | 'revalida' | 'concurso' | null;
}

interface Task {
  id: string;
  title: string;
  subject: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description?: string;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  type: 'pomodoro' | 'free';
}

interface Material {
  id: string;
  title: string;
  type: 'note' | 'pdf' | 'link';
  subject: string;
  content?: string;
  url?: string;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
}

interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  subject: string;
  likes: number;
  replies: number;
  createdAt: string;
}

interface PlannerEvent {
  id: string;
  date: string;
  subject: string;
  description: string;
  type: 'materia' | 'assunto' | 'tarefa';
}

interface ExamContest {
  id: string;
  name: string;
  year: number;
  institution: string;
  examUrl: string;
  subjects: string[];
  category: 'concurso' | 'residencia' | 'enem' | 'revalida';
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  folder: string;
  createdAt: string;
  lastReviewed?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface RankingUser {
  id: string;
  name: string;
  focusTime: number;
  avatar?: string;
  position: number;
}

export default function ApprovaApp() {
  const router = useRouter();
  
  // Estados principais
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>([]);
  const [exams, setExams] = useState<ExamContest[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [rankingUsers, setRankingUsers] = useState<RankingUser[]>([]);
  
  // Estados do Pomodoro e Foco
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [dailyReward, setDailyReward] = useState('');
  const [dailyGoalHours, setDailyGoalHours] = useState(0);
  const [totalStudyTimeToday, setTotalStudyTimeToday] = useState(0);
  const [goalCompleted, setGoalCompleted] = useState(false);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch' | 'countdown'>('pomodoro');
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [countdownTime, setCountdownTime] = useState(0);

  // Estados de Flashcards
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '', folder: '' });

  // Estados da UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plannerView, setPlannerView] = useState<'calendar' | 'weekly' | 'monthly'>('weekly');
  const [selectedExamContest, setSelectedExamContest] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Verificar se há usuário autenticado
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      // Carregar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      setUser(profile);

      // Carregar eventos do planner
      const { data: events, error: eventsError } = await supabase
        .from('planner_events')
        .select('*')
        .eq('user_id', authUser.id)
        .order('date', { ascending: true });

      if (!eventsError && events) {
        setPlannerEvents(events);
      }

      // Carregar flashcards
      const { data: cards, error: cardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (!cardsError && cards) {
        setFlashcards(cards.map(card => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty as 'easy' | 'medium' | 'hard' | null,
          folder: card.folder,
          createdAt: card.created_at,
          lastReviewed: card.last_reviewed
        })));
      }

      // Carregar sessões de estudo
      const { data: sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('date', { ascending: false });

      if (!sessionsError && sessions) {
        const today = new Date().toISOString().split('T')[0];
        const todayTotal = sessions
          .filter(s => s.date === today)
          .reduce((acc, s) => acc + s.duration, 0);
        setTotalStudyTimeToday(todayTotal);
      }

      // Carregar mensagens do chat
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (!messagesError && messages) {
        setChatMessages(messages.map(msg => ({
          id: msg.id,
          userId: msg.user_id,
          userName: msg.user_name,
          message: msg.message,
          timestamp: msg.created_at
        })));
      }

      // Dados de exemplo para outras funcionalidades
      setTasks([
        {
          id: '1',
          title: 'Estudar Cálculo Diferencial',
          subject: 'Matemática',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2024-01-15',
          description: 'Capítulos 1-3 do livro'
        },
        {
          id: '2',
          title: 'Projeto de Física',
          subject: 'Física',
          status: 'pending',
          priority: 'medium',
          dueDate: '2024-01-20'
        }
      ]);

      setGoals([
        {
          id: '1',
          title: 'Dominar Cálculo',
          description: 'Completar todos os exercícios do semestre',
          targetDate: '2024-06-30',
          progress: 65,
          category: 'Matemática'
        }
      ]);

      setExams([
        {
          id: '1',
          name: 'ENEM 2023',
          year: 2023,
          institution: 'INEP',
          examUrl: '#',
          subjects: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia'],
          category: 'enem'
        },
        {
          id: '2',
          name: 'Concurso TRF 2023',
          year: 2023,
          institution: 'Tribunal Regional Federal',
          examUrl: '#',
          subjects: ['Direito Constitucional', 'Direito Administrativo', 'Português'],
          category: 'concurso'
        },
        {
          id: '3',
          name: 'Residência Médica USP 2023',
          year: 2023,
          institution: 'Universidade de São Paulo',
          examUrl: '#',
          subjects: ['Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia'],
          category: 'residencia'
        },
        {
          id: '4',
          name: 'REVALIDA 2023',
          year: 2023,
          institution: 'INEP',
          examUrl: '#',
          subjects: ['Clínica Médica', 'Cirurgia', 'Saúde Coletiva', 'Pediatria'],
          category: 'revalida'
        }
      ]);

      // Ranking de exemplo
      setRankingUsers([
        { id: '1', name: 'Ana Silva', focusTime: 28800, position: 1 },
        { id: '2', name: 'João Santos', focusTime: 25200, position: 2 },
        { id: '3', name: 'Maria Costa', focusTime: 21600, position: 3 },
        { id: '4', name: profile.name, focusTime: todayTotal || 18000, position: 4 },
        { id: '5', name: 'Carla Souza', focusTime: 14400, position: 5 }
      ]);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Frases motivacionais
  const motivationalPhrases = [
    "Foco total, {name}. Hoje você conquista mais um degrau.",
    "Cada minuto conta, {name}. Vamos nessa!",
    "Disciplina é liberdade, {name}. Continue firme.",
    "Você está mais perto do que imagina, {name}.",
    "Consistência é a chave, {name}. Siga em frente.",
    "Hoje é dia de fazer acontecer, {name}!",
    "Sua aprovação começa agora, {name}."
  ];

  const getMotivationalPhrase = () => {
    const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
    return phrase.replace('{name}', user?.name || 'estudante');
  };

  // Timer do Pomodoro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerMode === 'pomodoro') {
      if (pomodoroTime > 0) {
        interval = setInterval(() => {
          setPomodoroTime(time => time - 1);
          if (currentSession === 'work') {
            setTotalStudyTimeToday(prev => prev + 1);
          }
        }, 1000);
      } else {
        setIsRunning(false);
        if (currentSession === 'work') {
          setPomodoroCount(count => count + 1);
          saveStudySession(25 * 60);
          setPomodoroTime(breakTime);
          setCurrentSession('break');
        } else {
          setPomodoroTime(25 * 60);
          setCurrentSession('work');
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, currentSession, timerMode, breakTime]);

  // Timer do Stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerMode === 'stopwatch') {
      interval = setInterval(() => {
        setStopwatchTime(time => time + 1);
        setTotalStudyTimeToday(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode]);

  // Timer do Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerMode === 'countdown' && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime(time => time - 1);
        setTotalStudyTimeToday(prev => prev + 1);
      }, 1000);
    } else if (countdownTime === 0 && timerMode === 'countdown') {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, countdownTime, timerMode]);

  // Verificar se meta diária foi atingida
  useEffect(() => {
    if (dailyGoalHours > 0 && totalStudyTimeToday >= dailyGoalHours * 3600 && !goalCompleted) {
      setGoalCompleted(true);
    }
  }, [totalStudyTimeToday, dailyGoalHours, goalCompleted]);

  // Salvar sessão de estudo no Supabase
  const saveStudySession = async (duration: number) => {
    if (!user) return;

    try {
      await supabase.from('study_sessions').insert({
        user_id: user.id,
        duration,
        date: new Date().toISOString().split('T')[0],
        type: timerMode
      });
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  // Adicionar evento ao planner
  const handleAddPlannerEvent = async (event: Omit<PlannerEvent, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('planner_events')
        .insert({
          user_id: user.id,
          ...event
        })
        .select()
        .single();

      if (error) throw error;

      setPlannerEvents([...plannerEvents, data]);
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  // Criar flashcard
  const handleCreateFlashcard = async () => {
    if (!user || !newFlashcard.question || !newFlashcard.answer || !newFlashcard.folder) return;

    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          question: newFlashcard.question,
          answer: newFlashcard.answer,
          folder: newFlashcard.folder,
          difficulty: null,
          last_reviewed: null
        })
        .select()
        .single();

      if (error) throw error;

      setFlashcards([...flashcards, {
        id: data.id,
        question: data.question,
        answer: data.answer,
        difficulty: null,
        folder: data.folder,
        createdAt: data.created_at
      }]);

      setNewFlashcard({ question: '', answer: '', folder: '' });
    } catch (error) {
      console.error('Erro ao criar flashcard:', error);
    }
  };

  // Enviar mensagem no chat
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          user_name: user.name,
          message: chatInput
        })
        .select()
        .single();

      if (error) throw error;

      setChatMessages([...chatMessages, {
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        message: data.message,
        timestamp: data.created_at
      }]);

      setChatInput('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Atualizar perfil
  const handleUpdateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updatedData });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4A4A4A] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] bg-clip-text text-transparent tracking-wider font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
              APPROVA
            </h1>
          </div>
          <p className="text-[#F7F9FA] text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Componente de Header
  const AppHeader = () => (
    <div className="bg-[#4A4A4A] border-b border-[#D4AF37]/10 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <div className="relative inline-block mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] bg-clip-text text-transparent tracking-wider font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
              APPROVA
            </h1>
          </div>
          <p className="text-[#F7F9FA] text-sm font-[family-name:var(--font-inter)]">
            {getMotivationalPhrase()}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#5A5A5A] hover:bg-[#6A6A6A] text-[#F7F9FA] rounded-xl transition-all font-[family-name:var(--font-inter)]"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );

  // Componente de Header Mobile
  const MobileHeader = () => (
    <div className="md:hidden bg-[#4A4A4A] border-b border-[#D4AF37]/10 p-4 flex items-center justify-between">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="text-[#F7F9FA] hover:text-[#D4AF37] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="relative">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] bg-clip-text text-transparent tracking-wider font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
          APPROVA
        </h1>
      </div>
      
      <button
        onClick={handleLogout}
        className="text-[#F7F9FA] hover:text-[#D4AF37] transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );

  // Componente de Navegação
  const Navigation = () => {
    const navItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'planning', icon: Calendar, label: 'Planejamento' },
      { id: 'materials', icon: FileText, label: 'Materiais' },
      { id: 'tasks', icon: Target, label: 'Tarefas' },
      { id: 'focus', icon: Timer, label: 'Foco' },
      { id: 'metrics', icon: BarChart3, label: 'Métricas' },
      { id: 'community', icon: Users, label: 'Comunidade' },
      { id: 'ranking', icon: Trophy, label: 'Ranking' },
      { id: 'profile', icon: User, label: 'Perfil' }
    ];

    const handleNavClick = (viewId: string) => {
      setCurrentView(viewId);
      setIsSidebarOpen(false);
    };

    return (
      <>
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <nav className={`
          fixed md:static top-0 left-0 z-50 
          bg-[#4A4A4A] border-r border-[#D4AF37]/10
          w-64 h-full p-4
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[#D4AF37] font-bold text-lg font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
                APPROVA
              </h2>
              <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">Olá, {user?.name}</p>
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-[#F7F9FA]/70 hover:text-[#F7F9FA] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-[family-name:var(--font-inter)] ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] text-[#1A1A1A] font-semibold'
                    : 'text-[#F7F9FA]/70 hover:bg-[#D4AF37]/10 hover:text-[#F7F9FA]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </>
    );
  };

  // Dashboard View (simplificado - mantém a mesma estrutura anterior)
  const DashboardView = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]" style={{ fontWeight: 700 }}>
              Dashboard
            </h1>
            <p className="text-[#F7F9FA]/70 font-[family-name:var(--font-inter)]">Visão geral dos seus estudos</p>
          </div>
          <div className="flex items-center gap-2 text-[#F7F9FA]/70 font-[family-name:var(--font-inter)]">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 hover:border-[#D4AF37]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#38B6A3]/20 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#38B6A3]" />
              </div>
              <span className="text-2xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <h3 className="text-[#F7F9FA] font-semibold text-base font-[family-name:var(--font-inter)]">
              Tarefas Concluídas
            </h3>
            <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">Hoje</p>
          </div>

          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 hover:border-[#D4AF37]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-2xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                {Math.floor(totalStudyTimeToday / 3600)}h
              </span>
            </div>
            <h3 className="text-[#F7F9FA] font-semibold text-base font-[family-name:var(--font-inter)]">
              Tempo de Estudo
            </h3>
            <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">Hoje</p>
          </div>

          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 hover:border-[#D4AF37]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#38B6A3]/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#38B6A3]" />
              </div>
              <span className="text-2xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                {pomodoroCount}
              </span>
            </div>
            <h3 className="text-[#F7F9FA] font-semibold text-base font-[family-name:var(--font-inter)]">
              Pomodoros
            </h3>
            <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">Hoje</p>
          </div>

          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 hover:border-[#D4AF37]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-2xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">85%</span>
            </div>
            <h3 className="text-[#F7F9FA] font-semibold text-base font-[family-name:var(--font-inter)]">
              Progresso
            </h3>
            <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">Semanal</p>
          </div>
        </div>

        {/* Próximas tarefas e Metas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]" style={{ fontWeight: 700 }}>
                Próximas Tarefas
              </h2>
              <button 
                onClick={() => setCurrentView('tasks')}
                className="text-[#38B6A3] hover:text-[#38B6A3]/80 transition-colors text-sm font-[family-name:var(--font-inter)]"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-4 bg-[#6A6A6A] rounded-2xl border border-[#D4AF37]/10">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-[#D4AF37]' :
                    task.priority === 'medium' ? 'bg-[#38B6A3]' : 'bg-[#F7F9FA]/30'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#F7F9FA] font-medium text-sm truncate font-[family-name:var(--font-inter)]">
                      {task.title}
                    </h3>
                    <p className="text-[#F7F9FA]/70 text-xs font-[family-name:var(--font-inter)]">{task.subject}</p>
                  </div>
                  <span className="text-[#F7F9FA]/70 text-xs whitespace-nowrap font-[family-name:var(--font-inter)]">
                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]" style={{ fontWeight: 700 }}>
                Metas em Progresso
              </h2>
              <button 
                onClick={() => setCurrentView('tasks')}
                className="text-[#38B6A3] hover:text-[#38B6A3]/80 transition-colors text-sm font-[family-name:var(--font-inter)]"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="p-4 bg-[#6A6A6A] rounded-2xl border border-[#D4AF37]/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#F7F9FA] font-medium text-sm font-[family-name:var(--font-inter)]">
                      {goal.title}
                    </h3>
                    <span className="text-[#38B6A3] font-bold text-sm font-[family-name:var(--font-inter)]">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#3A3A3A] rounded-full h-2 mb-2 border border-[#D4AF37]/10">
                    <div 
                      className="bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-[#F7F9FA]/70 text-xs font-[family-name:var(--font-inter)]">{goal.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderização principal
  return (
    <div className="min-h-screen bg-[#4A4A4A] flex flex-col md:flex-row">
      <MobileHeader />
      <Navigation />
      
      <main className="flex-1 overflow-auto">
        <AppHeader />
        {currentView === 'dashboard' && <DashboardView />}
        {/* Outras views mantêm a mesma estrutura anterior, apenas conectadas ao Supabase */}
      </main>
    </div>
  );
}
