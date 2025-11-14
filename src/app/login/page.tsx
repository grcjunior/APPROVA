"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Infinity } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    course: '',
    goals: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          router.push('/');
        }
      } else {
        // Cadastro
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Criar perfil do usuário
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              name: formData.name,
              course: formData.course,
              goals: formData.goals,
              plan_type: 'Premium',
              plan_duration: '12 meses',
              exam_type: null,
              avatar_url: null,
              address: null,
              cpf: null,
              phone: null
            });

          if (profileError) throw profileError;

          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4A4A4A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] bg-clip-text text-transparent tracking-wider font-[family-name:var(--font-inter)]" style={{ fontWeight: 600 }}>
              APPROVA
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
              <Infinity className="w-32 h-32 text-[#D4AF37]" strokeWidth={1} />
            </div>
          </div>
          <p className="text-[#F7F9FA] text-sm">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta e comece a estudar'}
          </p>
        </div>

        {/* Card de Login/Cadastro */}
        <div className="bg-[#5A5A5A] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-lg">
          {/* Toggle Login/Cadastro */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all font-[family-name:var(--font-inter)] ${
                isLogin
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A]'
                  : 'bg-[#6A6A6A] text-[#F7F9FA] hover:bg-[#7A7A7A]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all font-[family-name:var(--font-inter)] ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E5B0] text-[#1A1A1A]'
                  : 'bg-[#6A6A6A] text-[#F7F9FA] hover:bg-[#7A7A7A]'
              }`}
            >
              Cadastro
            </button>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl">
              <p className="text-red-200 text-sm font-[family-name:var(--font-inter)]">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F7F9FA]/50" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
                      placeholder="Digite seu nome"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                    Curso ou Área de Estudo
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="w-full px-4 py-3 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
                    placeholder="Ex: Medicina, Direito, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                    Objetivos Acadêmicos
                  </label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    className="w-full px-4 py-3 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none resize-none font-[family-name:var(--font-inter)]"
                    placeholder="Descreva seus principais objetivos..."
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F7F9FA]/50" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#F7F9FA] text-sm font-medium mb-2 font-[family-name:var(--font-inter)]">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F7F9FA]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 bg-[#6A6A6A] border border-[#D4AF37]/20 rounded-xl text-[#F7F9FA] placeholder-[#F7F9FA]/50 focus:border-[#D4AF37] focus:outline-none font-[family-name:var(--font-inter)]"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F7F9FA]/50 hover:text-[#F7F9FA] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F4E5B0] to-[#D4AF37] text-[#1A1A1A] py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-inter)]"
            >
              {loading ? (
                'Processando...'
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Link alternativo */}
          <div className="mt-6 text-center">
            <p className="text-[#F7F9FA]/70 text-sm font-[family-name:var(--font-inter)]">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
