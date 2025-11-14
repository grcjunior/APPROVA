"use client";

import React, { useState, useEffect } from 'react';
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
  ChevronLeft, ChevronDown, HelpCircle
} from 'lucide-react';

// Tipos de dados
interface User {
  name: string;
  course: string;
  goals: string;
  avatar?: string;
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
}

export default function ApprovaApp() {
  // Estados principais
  const [currentView, setCurrentView] = useState('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>([]);
  const [exams, setExams] = useState<ExamContest[]>([]);
  
  // Estados do Pomodoro
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Estados da UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [plannerView, setPlannerView] = useState<'calendar' | 'weekly' | 'monthly'>('weekly');
  const [selectedExamContest, setSelectedExamContest] = useState<string | null>(null);

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
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
      if (currentSession === 'work') {
        setPomodoroCount(count => count + 1);
        setPomodoroTime(5 * 60);
        setCurrentSession('break');
      } else {
        setPomodoroTime(25 * 60);
        setCurrentSession('work');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, currentSession]);

  // Dados iniciais
  useEffect(() => {
    if (user) {
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
        },
        {
          id: '3',
          title: 'Ensaio de História',
          subject: 'História',
          status: 'completed',
          priority: 'low',
          dueDate: '2024-01-10'
        }
      ]);

      setStudySessions([
        { id: '1', subject: 'Matemática', duration: 120, date: '2024-01-12', type: 'pomodoro' },
        { id: '2', subject: 'Física', duration: 90, date: '2024-01-12', type: 'free' },
        { id: '3', subject: 'História', duration: 60, date: '2024-01-11', type: 'pomodoro' }
      ]);

      setMaterials([
        {
          id: '1',
          title: 'Anotações de Cálculo',
          type: 'note',
          subject: 'Matemática',
          content: 'Derivadas e integrais...',
          createdAt: '2024-01-12'
        },
        {
          id: '2',
          title: 'Livro de Física Quântica',
          type: 'pdf',
          subject: 'Física',
          createdAt: '2024-01-11'
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
        },
        {
          id: '2',
          title: 'Projeto Final',
          description: 'Desenvolver projeto de conclusão',
          targetDate: '2024-12-15',
          progress: 25,
          category: 'Geral'
        }
      ]);

      setForumPosts([
        {
          id: '1',
          author: 'Ana Silva',
          title: 'Dicas para estudar Cálculo',
          content: 'Compartilho algumas técnicas que me ajudaram...',
          subject: 'Matemática',
          likes: 15,
          replies: 8,
          createdAt: '2024-01-12'
        }
      ]);

      // Dados de exemplo para provas anteriores
      setExams([
        {
          id: '1',
          name: 'ENEM 2023',
          year: 2023,
          institution: 'INEP',
          examUrl: '#',
          subjects: ['Matemática', 'Português', 'Ciências', 'História', 'Geografia']
        },
        {
          id: '2',
          name: 'Concurso TRF 2023',
          year: 2023,
          institution: 'Tribunal Regional Federal',
          examUrl: '#',
          subjects: ['Direito Constitucional', 'Direito Administrativo', 'Português']
        },
        {
          id: '3',
          name: 'OAB XXXVII',
          year: 2023,
          institution: 'Ordem dos Advogados do Brasil',
          examUrl: '#',
          subjects: ['Direito Civil', 'Direito Penal', 'Ética Profissional']
        }
      ]);
    }
  }, [user]);

  // Componente de Onboarding
  const OnboardingView = () => {
    const [formData, setFormData] = useState({
      name: '',
      course: '',
      goals: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.course && formData.goals) {
        setUser(formData);
        setCurrentView('dashboard');
        setShowOnboarding(false);
      }
    };

    return (
      <div className="min-h-screen bg-[#4A4A4A] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            {/* Logo APPROVA com gradiente dourado metalizado */}
            <div className="relative mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] bg-clip-text text-transparent tracking-wider font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
                APPROVA
              </h1>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                <Infinity className="w-32 h-32 text-[#D4AF37]" strokeWidth={1} />
              </div>
            </div>
            <p className="text-[#F7F9FA] text-sm">Aqui é foco. Aqui você passa.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                Qual é o seu nome?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-2xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none transition-colors font-[family-name:var(--font-inter)]"
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                Curso ou área de estudo
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full px-4 py-3 bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-2xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none transition-colors font-[family-name:var(--font-inter)]"
                placeholder="Ex: Engenharia, Medicina, etc."
                required
              />
            </div>

            <div>
              <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                Objetivos acadêmicos
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                className="w-full px-4 py-3 bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-2xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none font-[family-name:var(--font-inter)]"
                placeholder="Descreva seus principais objetivos..."
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] text-[#1A1A1A] py-3 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 font-[family-name:var(--font-inter)]"
            >
              Começar jornada
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Componente de Header
  const AppHeader = () => (
    <div className="bg-[#4A4A4A] border-b border-[#D4AF37]/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Logo APPROVA com gradiente dourado metalizado */}
        <div className="relative inline-block mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] bg-clip-text text-transparent tracking-wider font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
            APPROVA
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
            <Infinity className="w-24 h-24 text-[#D4AF37]" strokeWidth={1} />
          </div>
        </div>
        
        {/* Saudação motivacional */}
        <p className="text-[#F7F9FA] text-sm font-[family-name:var(--font-inter)]">
          {getMotivationalPhrase()}
        </p>
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
      
      <div className="w-6" />
    </div>
  );

  // Componente de Navegação
  const Navigation = () => {
    const navItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'planning', icon: Calendar, label: 'Planejamento' },
      { id: 'materials', icon: FileText, label: 'Materiais' },
      { id: 'tasks', icon: Target, label: 'Tarefas' },
      { id: 'pomodoro', icon: Timer, label: 'Foco' },
      { id: 'metrics', icon: BarChart3, label: 'Métricas' },
      { id: 'community', icon: Users, label: 'Comunidade' },
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

  // Dashboard View
  const DashboardView = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const todayStudyTime = studySessions
      .filter(s => s.date === new Date().toISOString().split('T')[0])
      .reduce((acc, s) => acc + s.duration, 0);

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[family-name:var(--font-inter)]" style={{ fontWeight: 700 }}>
              Dashboard
            </h1>
            <p className="text-[#1A1A1A]/70 font-[family-name:var(--font-inter)]">Visão geral dos seus estudos</p>
          </div>
          <div className="flex items-center gap-2 text-[#1A1A1A]/70 font-[family-name:var(--font-inter)]">
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
                {Math.floor(todayStudyTime / 60)}h
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

  // Planning View - Planner com Calendário
  const PlanningView = () => {
    const [newEvent, setNewEvent] = useState({
      date: '',
      subject: '',
      description: '',
      type: 'materia' as 'materia' | 'assunto' | 'tarefa'
    });

    const handleAddEvent = () => {
      if (newEvent.date && newEvent.subject) {
        setPlannerEvents([...plannerEvents, {
          id: Date.now().toString(),
          ...newEvent
        }]);
        setNewEvent({ date: '', subject: '', description: '', type: 'materia' });
      }
    };

    const getEventsForDate = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      return plannerEvents.filter(e => e.date === dateStr);
    };

    // Gerar dias do mês atual
    const generateCalendarDays = () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Dias vazios antes do primeiro dia
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Dias do mês
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };

    // Gerar semana atual
    const generateWeekDays = () => {
      const curr = new Date(selectedDate);
      const week = [];
      
      curr.setDate(curr.getDate() - curr.getDay());
      
      for (let i = 0; i < 7; i++) {
        week.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }
      
      return week;
    };

    const calendarDays = generateCalendarDays();
    const weekDays = generateWeekDays();
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[family-name:var(--font-inter)]" style={{ fontWeight: 700 }}>
              Planejamento
            </h1>
            <p className="text-[#1A1A1A]/70 font-[family-name:var(--font-inter)]">
              Organize suas matérias, assuntos e tarefas
            </p>
          </div>

          {/* Seletor de visualização */}
          <div className="flex gap-2">
            <button
              onClick={() => setPlannerView('calendar')}
              className={`px-4 py-2 rounded-xl font-[family-name:var(--font-inter)] transition-all ${
                plannerView === 'calendar'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A] font-semibold'
                  : 'bg-[#5A5A5A] text-[#F7F9FA] hover:bg-[#6A6A6A]'
              }`}
            >
              Calendário
            </button>
            <button
              onClick={() => setPlannerView('weekly')}
              className={`px-4 py-2 rounded-xl font-[family-name:var(--font-inter)] transition-all ${
                plannerView === 'weekly'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A] font-semibold'
                  : 'bg-[#5A5A5A] text-[#F7F9FA] hover:bg-[#6A6A6A]'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setPlannerView('monthly')}
              className={`px-4 py-2 rounded-xl font-[family-name:var(--font-inter)] transition-all ${
                plannerView === 'monthly'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A] font-semibold'
                  : 'bg-[#5A5A5A] text-[#F7F9FA] hover:bg-[#6A6A6A]'
              }`}
            >
              Mensal
            </button>
          </div>
        </div>

        {/* Formulário de adicionar evento */}
        <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#F7F9FA] mb-4 font-[family-name:var(--font-inter)]">
            Adicionar ao Planner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              className="px-4 py-2 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
            />
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
              className="px-4 py-2 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
            >
              <option value="materia">Matéria</option>
              <option value="assunto">Assunto</option>
              <option value="tarefa">Tarefa</option>
            </select>
            <input
              type="text"
              value={newEvent.subject}
              onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
              placeholder="Nome da matéria/assunto"
              className="px-4 py-2 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
            />
            <input
              type="text"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Descrição (opcional)"
              className="px-4 py-2 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
            />
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A] rounded-xl font-semibold hover:opacity-90 transition-all font-[family-name:var(--font-inter)]"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Visualização do Planner */}
        {plannerView === 'calendar' && (
          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-sm">
            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-[#6A6A6A] rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#F7F9FA]" />
              </button>
              <h3 className="text-xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-[#6A6A6A] rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#F7F9FA]" />
              </button>
            </div>

            {/* Grade do calendário */}
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-[#F7F9FA]/70 text-sm font-semibold py-2 font-[family-name:var(--font-inter)]">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const events = day ? getEventsForDate(day) : [];
                const isToday = day && day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 rounded-xl border transition-all ${
                      day
                        ? isToday
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37]'
                          : 'bg-[#6A6A6A] border-[#D4AF37]/10 hover:border-[#D4AF37]/30'
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="text-[#F7F9FA] text-sm font-semibold mb-1 font-[family-name:var(--font-inter)]">
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {events.map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate font-[family-name:var(--font-inter)] ${
                                event.type === 'materia' ? 'bg-[#38B6A3]/20 text-[#38B6A3]' :
                                event.type === 'assunto' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                                'bg-[#F7F9FA]/20 text-[#F7F9FA]'
                              }`}
                            >
                              {event.subject}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {plannerView === 'weekly' && (
          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 7);
                  setSelectedDate(newDate);
                }}
                className="p-2 hover:bg-[#6A6A6A] rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#F7F9FA]" />
              </button>
              <h3 className="text-xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                Semana de {weekDays[0].toLocaleDateString('pt-BR')}
              </h3>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 7);
                  setSelectedDate(newDate);
                }}
                className="p-2 hover:bg-[#6A6A6A] rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#F7F9FA]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map((day, index) => {
                const events = getEventsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border transition-all ${
                      isToday
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37]'
                        : 'bg-[#6A6A6A] border-[#D4AF37]/10'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-[#F7F9FA]/70 text-xs font-[family-name:var(--font-inter)]">
                        {dayNames[day.getDay()]}
                      </div>
                      <div className="text-[#F7F9FA] text-lg font-bold font-[family-name:var(--font-inter)]">
                        {day.getDate()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {events.map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-2 rounded-xl font-[family-name:var(--font-inter)] ${
                            event.type === 'materia' ? 'bg-[#38B6A3]/20 text-[#38B6A3]' :
                            event.type === 'assunto' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                            'bg-[#F7F9FA]/20 text-[#F7F9FA]'
                          }`}
                        >
                          <div className="font-semibold">{event.subject}</div>
                          {event.description && (
                            <div className="text-[10px] opacity-70 mt-1">{event.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {plannerView === 'monthly' && (
          <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-[#6A6A6A] rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#F7F9FA]" />
              </button>
              <h3 className="text-xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h3>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-[#6A6A6A] rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#F7F9FA]" />
              </button>
            </div>

            <div className="space-y-4">
              {plannerEvents
                .filter(e => {
                  const eventDate = new Date(e.date);
                  return eventDate.getMonth() === selectedDate.getMonth() &&
                         eventDate.getFullYear() === selectedDate.getFullYear();
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-4 bg-[#6A6A6A] rounded-2xl border border-[#D4AF37]/10"
                  >
                    <div className="text-center min-w-[60px]">
                      <div className="text-[#D4AF37] text-2xl font-bold font-[family-name:var(--font-inter)]">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-[#F7F9FA]/70 text-xs font-[family-name:var(--font-inter)]">
                        {dayNames[new Date(event.date).getDay()]}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 font-[family-name:var(--font-inter)] ${
                        event.type === 'materia' ? 'bg-[#38B6A3]/20 text-[#38B6A3]' :
                        event.type === 'assunto' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                        'bg-[#F7F9FA]/20 text-[#F7F9FA]'
                      }`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </div>
                      <h4 className="text-[#F7F9FA] font-semibold font-[family-name:var(--font-inter)]">
                        {event.subject}
                      </h4>
                      {event.description && (
                        <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Materials View - Provas Anteriores
  const MaterialsView = () => {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[family-name:var(--font-inter)]" style={{ fontWeight: 700 }}>
              Materiais de Estudo
            </h1>
            <p className="text-[#1A1A1A]/70 font-[family-name:var(--font-inter)]">
              Provas anteriores de concursos para prática
            </p>
          </div>
        </div>

        {/* Lista de Concursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 hover:border-[#D4AF37]/40 transition-all shadow-sm cursor-pointer"
              onClick={() => setSelectedExamContest(exam.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <span className="text-[#38B6A3] text-sm font-semibold font-[family-name:var(--font-inter)]">
                  {exam.year}
                </span>
              </div>
              
              <h3 className="text-[#F7F9FA] font-bold text-lg mb-2 font-[family-name:var(--font-inter)]">
                {exam.name}
              </h3>
              
              <p className="text-[#F7F9FA]/70 text-sm mb-4 font-[family-name:var(--font-inter)]">
                {exam.institution}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {exam.subjects.slice(0, 3).map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#6A6A6A] text-[#F7F9FA] text-xs rounded-full font-[family-name:var(--font-inter)]"
                  >
                    {subject}
                  </span>
                ))}
                {exam.subjects.length > 3 && (
                  <span className="px-3 py-1 bg-[#6A6A6A] text-[#F7F9FA] text-xs rounded-full font-[family-name:var(--font-inter)]">
                    +{exam.subjects.length - 3}
                  </span>
                )}
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A] py-2 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 font-[family-name:var(--font-inter)]"
              >
                <Download className="w-4 h-4" />
                Baixar Prova Completa
              </button>
            </div>
          ))}
        </div>

        {/* Modal de detalhes do exame */}
        {selectedExamContest && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#5A5A5A] rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {(() => {
                const exam = exams.find(e => e.id === selectedExamContest);
                if (!exam) return null;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                        {exam.name}
                      </h2>
                      <button
                        onClick={() => setSelectedExamContest(null)}
                        className="text-[#F7F9FA]/70 hover:text-[#F7F9FA] transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                          Ano: {exam.year}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#F7F9FA] font-[family-name:var(--font-inter)]">
                          {exam.institution}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-[#F7F9FA] font-semibold mb-3 font-[family-name:var(--font-inter)]">
                        Matérias Abordadas:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {exam.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-[#6A6A6A] text-[#F7F9FA] rounded-xl font-[family-name:var(--font-inter)]"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A] py-3 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 font-[family-name:var(--font-inter)]"
                    >
                      <Download className="w-5 h-5" />
                      Baixar Prova Completa em PDF
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderização principal
  if (showOnboarding && !user) {
    return <OnboardingView />;
  }

  return (
    <div className="min-h-screen bg-[#4A4A4A] flex flex-col md:flex-row">
      <MobileHeader />
      <Navigation />
      
      <main className="flex-1 overflow-auto">
        <AppHeader />
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'planning' && <PlanningView />}
        {currentView === 'materials' && <MaterialsView />}
        {/* Outras views serão implementadas posteriormente */}
      </main>
    </div>
  );
}
