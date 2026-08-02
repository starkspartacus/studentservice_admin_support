'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const isAuth = localStorage.getItem('admin_token');
    if (isAuth) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authApi.adminLogin({ email, password });

      if (!data.success) {
        throw new Error(data.message || 'Adresse email ou mot de passe administrateur incorrect.');
      }

      localStorage.setItem('admin_token', data.accessToken || 'admin_session_valid');
      localStorage.setItem('admin_user', JSON.stringify(data.user || { email, name: 'Henri Litié', role: 'ADMIN' }));
      document.cookie = `admin_token=${data.accessToken || 'true'}; path=/; max-age=86400`;
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Impossible de se connecter au serveur backend.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans text-[#191C1D] bg-[#F8F9FA] p-4 md:p-12">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-[#E1E3E4] overflow-hidden">
        {/* Header / Branding */}
        <div className="p-6 border-b border-[#E1E3E4] text-center bg-gradient-to-b from-[#FFF5EC] to-white">
          <div className="w-12 h-12 rounded-xl bg-[#FF8C00] text-white flex items-center justify-center mx-auto mb-3 shadow-md font-bold text-xl">
            SS
          </div>
          <h1 className="text-2xl font-bold text-[#904D00]">Student Service</h1>
          <p className="text-xs text-[#564334] font-medium mt-1">Administration SaaS & Support</p>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 text-center text-[#191C1D]">Connexion Administrateur</h2>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FFDAD6] border border-[#BA1A1A]/30 text-[#93000A] text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#191C1D] mb-1.5" htmlFor="email">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#564334]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="h.litie@haut-numerique.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-[#E1E3E4] rounded-lg bg-[#FFFFFF] text-xs text-[#191C1D] placeholder:text-[#897362]/60 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#191C1D] mb-1.5" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#564334]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 border border-[#E1E3E4] rounded-lg bg-[#FFFFFF] text-xs text-[#191C1D] placeholder:text-[#897362]/60 focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#FF8C00] focus:ring-[#FF8C00] border-[#E1E3E4] rounded accent-[#FF8C00] cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-[#564334] cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Veuillez contacter le super-administrateur pour réinitialiser vos accès."); }} className="text-xs text-[#5F5E5F] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#FF8C00] text-white font-semibold text-xs hover:bg-[#E67E00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8C00] shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <span>Se connecter au tableau de bord</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="bg-[#F3F4F5] px-6 py-4 text-center border-t border-[#E1E3E4]">
          <p className="text-xs text-[#564334] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#126E0C]" />
            Accès sécurisé réservé au personnel autorisé
          </p>
        </div>
      </div>
    </div>
  );
}
