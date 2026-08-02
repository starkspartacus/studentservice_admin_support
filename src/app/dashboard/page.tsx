'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Wallet,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Plus,
  Filter,
  FileText,
  UserCheck,
  AlertTriangle,
  X,
  Check,
  Download,
  Mail,
  Phone,
  School,
  ExternalLink,
  Maximize2,
  AlertCircle,
  Video,
} from 'lucide-react';
import { verificationApi, usersApi, authApi, companiesApi, jobsApi, adminApi } from '@/api';
import {
  MOCK_PENDING_VALIDATIONS,
  MOCK_USERS_LIST,
  MOCK_COMPANIES_LIST,
  MOCK_JOBS_LIST,
  PendingValidation,
} from '@/constants/adminMockData';

// Component: Candidate Avatar with automatic fallback to initials badge
function CandidateAvatar({ src, name, size = 'w-12 h-12' }: { src?: string; name: string; size?: string }) {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  const isInvalidUrl = !src || src === 'data:' || src.trim().length < 10;

  if (isInvalidUrl || hasError) {
    return (
      <div className={`${size} rounded-full bg-gradient-to-tr from-[#904D00] to-[#FF8C00] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[#FF8C00]/30`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`${size} rounded-full object-cover border border-[#E1E3E4] shrink-0 shadow-xs`}
    />
  );
}

// Component: Smart Document Card with direct PDF iframe & image previewer
function SmartDocCard({
  title,
  icon,
  url,
  onOpenZoom,
}: {
  title: string;
  icon: string;
  url?: string;
  onOpenZoom: (url: string, title: string) => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (!url) {
    return (
      <div className="p-3 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] space-y-2">
        <span className="font-bold text-[#564334] block text-xs">{icon} {title}</span>
        <div className="h-44 rounded-lg border border-dashed border-[#E1E3E4] bg-white flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-6 h-6 text-[#897362] mb-1" />
          <span className="text-[11px] text-[#897362] font-medium">Non transmis</span>
        </div>
      </div>
    );
  }

  const isDocFile =
    url.toLowerCase().includes('.pdf') ||
    url.toLowerCase().includes('/pdf') ||
    title.toLowerCase().includes('cv') ||
    title.toLowerCase().includes('curriculum') ||
    title.toLowerCase().includes('attestation');

  return (
    <div className="p-3 rounded-xl border border-[#E1E3E4] bg-white space-y-2 group hover:border-[#FF8C00] transition">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#564334] block text-xs">{icon} {title}</span>
        <button
          onClick={() => onOpenZoom(url, title)}
          className="text-[10px] text-[#904D00] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-[#FFF5EC] px-2 py-0.5 rounded border border-[#FF8C00]/30"
        >
          <Maximize2 className="w-3 h-3" /> Agrandir
        </button>
      </div>

      <div className="h-44 rounded-lg overflow-hidden border border-[#E1E3E4] bg-[#F8F9FA] relative flex items-center justify-center">
        {isDocFile ? (
          <div className="w-full h-full relative group/pdf">
            <iframe src={url} className="w-full h-full border-0 pointer-events-none" title={title} />
            <div
              onClick={() => onOpenZoom(url, title)}
              className="absolute inset-0 bg-[#191C1D]/60 text-white flex flex-col items-center justify-center gap-1 cursor-pointer opacity-80 group-hover/pdf:opacity-100 transition duration-200"
            >
              <Maximize2 className="w-6 h-6 text-[#FF8C00]" />
              <span className="font-bold text-xs">Cliquer pour Agrandir le Document</span>
              <span className="text-[10px] text-[#E1E3E4]">Format PDF / Document transmis</span>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
            <FileText className="w-8 h-8 text-[#FF8C00]" />
            <span className="text-[11px] font-semibold text-[#191C1D]">Fichier Document Transmis</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenZoom(url, title)}
                className="px-2.5 py-1 bg-[#FFF5EC] text-[#904D00] border border-[#FF8C00]/30 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-[#FFEADA]"
              >
                <Maximize2 className="w-3 h-3" /> Aperçu
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-white text-[#564334] border border-[#E1E3E4] rounded text-[10px] font-bold flex items-center gap-1 hover:bg-gray-100"
              >
                <ExternalLink className="w-3 h-3" /> Ouvrir dans un onglet
              </a>
            </div>
          </div>
        ) : (
          <img
            src={url}
            alt={title}
            onError={() => setHasError(true)}
            onClick={() => onOpenZoom(url, title)}
            className="w-full h-full object-contain cursor-pointer hover:scale-105 transition duration-200"
          />
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'companies' | 'jobs' | 'finances' | 'settings'>('dashboard');

  // Admin session state
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Validations & Entities State
  const [validations, setValidations] = useState<PendingValidation[]>(MOCK_PENDING_VALIDATIONS);
  const [usersList, setUsersList] = useState(MOCK_USERS_LIST);
  const [companiesList, setCompaniesList] = useState(MOCK_COMPANIES_LIST);
  const [jobsList, setJobsList] = useState(MOCK_JOBS_LIST);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Live Stats State
  const [statsData, setStatsData] = useState<{
    revenue: number;
    commissions: number;
    pendingVerificationsCount: number;
    activeMissionsCount: number;
  }>({
    revenue: 124500,
    commissions: 18200,
    pendingVerificationsCount: 1,
    activeMissionsCount: 856,
  });

  // Document Viewer Modal State
  const [selectedValidation, setSelectedValidation] = useState<PendingValidation | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Fullscreen Lightbox Modal State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  const openLightbox = (url: string, title: string) => {
    setLightboxUrl(url);
    setLightboxTitle(title);
  };

  // Success Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load live data from Backend API
  const loadLiveData = async () => {
    setIsLoadingData(true);
    
    // 1. Fetch Pending Student Profiles for Approval
    try {
      const pendingRes = await verificationApi.getPendingStudentProfiles();
      if (pendingRes?.data && Array.isArray(pendingRes.data) && pendingRes.data.length > 0) {
        const mappedValidations: PendingValidation[] = pendingRes.data.map((user: any) => {
          const sp = user.studentProfile || {};
          return {
            id: user._id,
            type: 'STUDENT',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Étudiant',
            subtitle: `Étudiant - ${sp.field || sp.level || 'Formation'}`,
            avatar: user.avatar || user.avatarUrl,
            university: sp.university || 'Établissement',
            field: sp.field || 'N/A',
            studentId: sp.studentId || 'N/A',
            submittedAt: sp.verificationSubmittedAt ? new Date(sp.verificationSubmittedAt).toLocaleDateString('fr-FR') : 'Récemment',
            studentCardUrl: sp.studentCardUrl,
            selfieUrl: sp.selfieUrl,
            idCardRectoUrl: sp.idCardRectoUrl,
            idCardVersoUrl: sp.idCardVersoUrl,
            videoPitchUrl: sp.videoPitch,
            cvUrl: sp.cvUrl,
            bio: sp.bio,
            skills: sp.skills,
            languages: sp.languages,
            socials: sp.socials,
            birthDate: sp.birthDate,
            gender: sp.gender,
            maritalStatus: sp.maritalStatus,
            hasDriverLicense: sp.hasDriverLicense,
            driverLicenseCategory: sp.driverLicenseCategory,
            whatsapp: sp.whatsapp,
            hobbies: sp.hobbies,
            desiredRate: sp.desiredRate,
            preferredJobTypes: sp.preferredJobTypes,
            status: sp.verificationStatus === 'APPROVED' ? 'APPROVED' : sp.verificationStatus === 'REJECTED' ? 'REJECTED' : 'PENDING',
          };
        });
        setValidations(mappedValidations);
      }
    } catch (e) {
      console.warn('Pending verifications load warning:', e);
    }

    // 2. Fetch Users List
    try {
      const usersRes = await usersApi.getUsers();
      if (usersRes?.data && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
        const mappedUsers = usersRes.data.map((u: any) => ({
          id: u._id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email || 'N/A',
          phone: u.fullPhone || u.phone || 'N/A',
          role: u.role,
          status: u.status,
          verificationStatus: u.studentProfile?.verificationStatus || 'N/A',
          university: u.studentProfile?.university || u.companyProfile?.companyName || 'N/A',
          field: u.studentProfile?.field || u.companyProfile?.sector || 'N/A',
          registeredAt: new Date(u.createdAt).toLocaleDateString('fr-FR'),
          avatar: u.avatar || u.avatarUrl || (u.studentProfile?.selfieUrl && u.studentProfile?.selfieUrl !== 'data:' ? u.studentProfile?.selfieUrl : undefined),
        }));
        setUsersList(mappedUsers);
      }
    } catch (e) {
      console.warn('Users list load warning:', e);
    }

    // 3. Fetch Dashboard & Financial Stats
    try {
      const [dashStats, finStats] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        adminApi.getFinancialStats().catch(() => null),
      ]);

      if (dashStats?.data || finStats?.data) {
        setStatsData((prev) => ({
          revenue: finStats?.data?.totalPayments || prev.revenue,
          commissions: finStats?.data?.totalCommissions || prev.commissions,
          pendingVerificationsCount: dashStats?.data?.users?.pendingVerifications ?? prev.pendingVerificationsCount,
          activeMissionsCount: dashStats?.data?.jobs?.activeJobs || dashStats?.data?.missions?.totalMissions || prev.activeMissionsCount,
        }));
      }
    } catch (e) {
      console.warn('Stats load warning:', e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    if (!token) {
      router.push('/');
      return;
    }
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        setAdminUser({ email: 'h.litie@haut-numerique.com', name: 'Henri Litié', role: 'SUPER_ADMIN' });
      }
    } else {
      setAdminUser({ email: 'h.litie@haut-numerique.com', name: 'Henri Litié', role: 'SUPER_ADMIN' });
    }

    loadLiveData();
  }, [router]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/');
  };

  const handleApprove = async (id: string) => {
    try {
      await verificationApi.approveStudentProfile(id);
      showToast('Profil approuvé avec succès dans le backend ✓ Accès débloqué !');
    } catch (err: any) {
      try {
        await usersApi.updateUserStatus(id, 'APPROVED');
        showToast('Statut mis à jour avec succès ✓');
      } catch (e) {
        showToast('Profil approuvé avec succès (Mode Démonstration) ✓');
      }
    }

    setValidations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'APPROVED' } : v)));
    setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'APPROVED', verificationStatus: 'APPROVED' } : u)));
    if (isDocModalOpen) setIsDocModalOpen(false);
  };

  const handleReject = async (id: string) => {
    try {
      await verificationApi.rejectStudentProfile(id, 'Dossier incomplet ou pièce non lisible');
      showToast('Profil rejeté dans le backend. Notification envoyée au candidat.');
    } catch (err: any) {
      try {
        await usersApi.updateUserStatus(id, 'REJECTED');
        showToast('Statut mis à jour à Rejeté.');
      } catch (e) {
        showToast('Profil rejeté (Mode Démonstration).');
      }
    }

    setValidations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'REJECTED' } : v)));
    setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'REJECTED', verificationStatus: 'REJECTED' } : u)));
    if (isDocModalOpen) setIsDocModalOpen(false);
  };

  const pendingCount = validations.filter((v) => v.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#191C1D] font-sans flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#126E0C] text-white px-5 py-3 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#9DF888]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SideNavBar */}
      <aside className="w-64 fixed left-0 top-0 h-screen bg-[#F3F4F5] border-r border-[#E1E3E4] shadow-sm flex flex-col p-4 z-30">
        {/* Brand Header */}
        <div className="flex items-center mb-6 pt-1">
          <div className="w-10 h-10 rounded-xl bg-[#FF8C00] text-white flex items-center justify-center font-bold text-lg mr-3 shadow-md shrink-0">
            SS
          </div>
          <div>
            <h2 className="text-base font-bold text-[#904D00] leading-tight">Student Service</h2>
            <p className="text-[11px] text-[#564334] font-medium">Administration SaaS</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => showToast('Génération du rapport d\'activité en cours...')}
          className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-xs py-3 rounded-lg mb-6 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Rapport</span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#9BF585] text-[#197211] shadow-sm'
                : 'text-[#564334] hover:bg-[#E1E3E4]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            <span>Tableau de bord</span>
            {pendingCount > 0 && (
              <span className="ml-auto bg-[#BA1A1A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#9BF585] text-[#197211] shadow-sm'
                : 'text-[#564334] hover:bg-[#E1E3E4]'
            }`}
          >
            <Users className="w-4 h-4 mr-3" />
            <span>Utilisateurs & Candidats</span>
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'companies'
                ? 'bg-[#9BF585] text-[#197211] shadow-sm'
                : 'text-[#564334] hover:bg-[#E1E3E4]'
            }`}
          >
            <Building2 className="w-4 h-4 mr-3" />
            <span>Entreprises Recruteurs</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-[#9BF585] text-[#197211] shadow-sm'
                : 'text-[#564334] hover:bg-[#E1E3E4]'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-3" />
            <span>Offres d'Emploi</span>
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'finances'
                ? 'bg-[#9BF585] text-[#197211] shadow-sm'
                : 'text-[#564334] hover:bg-[#E1E3E4]'
            }`}
          >
            <Wallet className="w-4 h-4 mr-3" />
            <span>Finances & Commissions</span>
          </button>
        </nav>

        {/* Footer Navigation */}
        <div className="mt-auto pt-4 border-t border-[#E1E3E4] space-y-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#9BF585] text-[#197211]'
                : 'text-[#564334] hover:bg-[#E1E3E4]'
            }`}
          >
            <Settings className="w-4 h-4 mr-3" />
            <span>Paramètres Système</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-xs font-semibold text-[#BA1A1A] hover:bg-[#FFDAD6] transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="h-16 bg-white border-b border-[#E1E3E4] px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#904D00]">
              {activeTab === 'dashboard' && 'Tableau de bord & Validation'}
              {activeTab === 'users' && 'Gestion des Utilisateurs Étudiants'}
              {activeTab === 'companies' && 'Gestion des Entreprises Partenaires'}
              {activeTab === 'jobs' && 'Modération des Offres d\'Emploi'}
              {activeTab === 'finances' && 'Suivi Financier & Commissions'}
              {activeTab === 'settings' && 'Paramètres & Configuration Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#564334]" />
              <input
                type="text"
                placeholder="Rechercher candidat, entreprise, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-9 pr-4 py-1.5 rounded-full border border-[#E1E3E4] bg-[#F8F9FA] text-xs text-[#191C1D] focus:outline-none focus:border-[#FF8C00] transition"
              />
            </div>

            <button
              onClick={() => showToast('Aucune nouvelle notification système.')}
              className="p-2 text-[#564334] hover:text-[#904D00] hover:bg-[#F3F4F5] rounded-full transition relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF8C00] rounded-full border-2 border-white" />
              )}
            </button>

            <button
              onClick={() => alert('Support Administrateur Student Service v1.0. En cas de problème, contactez support@studentservice.ci.')}
              className="p-2 text-[#564334] hover:text-[#904D00] hover:bg-[#F3F4F5] rounded-full transition cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#E1E3E4]">
              <div className="w-9 h-9 rounded-full bg-[#FF8C00] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                HL
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-bold text-[#191C1D] leading-tight">
                  {adminUser?.name || 'Henri Litié'}
                </span>
                <span className="block text-[10px] text-[#564334]">
                  {adminUser?.email || 'h.litie@haut-numerique.com'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 max-w-[1280px] w-full mx-auto space-y-8 flex-1">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Section 1: Statistiques globales (Bento Grid) */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CA */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E3E4] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-[#564334] font-medium mb-1">Chiffre d'affaires</p>
                      <h3 className="text-2xl font-bold text-[#191C1D]">
                        {statsData.revenue.toLocaleString('fr-FR')} €
                      </h3>
                    </div>
                    <div className="p-2 bg-[#9BF585]/30 rounded-lg text-[#126E0C]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-[#126E0C] font-semibold mr-1.5">+15%</span>
                    <span className="text-[#564334]">vs mois dernier</span>
                  </div>
                </div>

                {/* Commissions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E3E4] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-[#564334] font-medium mb-1">Commissions perçues</p>
                      <h3 className="text-2xl font-bold text-[#191C1D]">
                        {statsData.commissions.toLocaleString('fr-FR')} €
                      </h3>
                    </div>
                    <div className="p-2 bg-[#FF8C00]/20 rounded-lg text-[#FF8C00]">
                      <Wallet className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-[#126E0C] font-semibold mr-1.5">+8%</span>
                    <span className="text-[#564334]">vs mois dernier</span>
                  </div>
                </div>

                {/* Inscriptions en attente */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E1E3E4] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFDAD6]/40 rounded-bl-full pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-[#564334] font-medium mb-1">Inscriptions en attente</p>
                        <h3 className="text-2xl font-bold text-[#191C1D]">{pendingCount}</h3>
                      </div>
                      <div className="p-2 bg-[#FFDAD6] text-[#93000A] rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="text-[#BA1A1A] font-semibold mr-1.5">Action requise</span>
                      <span className="text-[#564334]">Vérification de sécurité</span>
                    </div>
                  </div>
                </div>

                {/* Missions actives */}
                <div className="bg-[#904D00] text-white rounded-xl p-6 shadow-md border border-[#FFB77D]/30 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-tl-full pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-[#FFB77D] font-medium mb-1">Missions actives</p>
                        <h3 className="text-2xl font-bold text-white">{statsData.activeMissionsCount}</h3>
                      </div>
                      <div className="p-2 bg-white/20 rounded-lg text-white">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="text-white font-semibold mr-1.5">+120</span>
                      <span className="text-[#FFB77D]">cette semaine</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Grid Layout for Validations & Growth Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Validations en attente (2/3 width) */}
                <section className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-[#E1E3E4] flex flex-col h-full">
                    <div className="p-6 border-b border-[#E1E3E4] flex justify-between items-center">
                      <div>
                        <h2 className="text-base font-bold text-[#191C1D]">Validations de Sécurité en Attente</h2>
                        <p className="text-xs text-[#564334]">Profils d'étudiants & entreprises à vérifier avant déblocage d'accès.</p>
                      </div>
                      <button onClick={() => setActiveTab('users')} className="text-xs text-[#FF8C00] font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Voir tout</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="divide-y divide-[#E1E3E4]">
                      {validations.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-[#F8F9FA] transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <CandidateAvatar name={item.name} src={item.avatar || item.logo} />

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#191C1D]">{item.name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  item.status === 'PENDING'
                                    ? 'bg-[#FFDAD6] text-[#93000A]'
                                    : item.status === 'APPROVED'
                                    ? 'bg-[#9BF585] text-[#197211]'
                                    : 'bg-[#F3F4F5] text-[#564334]'
                                }`}>
                                  {item.status === 'PENDING' ? 'En attente' : item.status === 'APPROVED' ? 'Approuvé ✓' : 'Rejeté'}
                                </span>
                              </div>
                              <p className="text-xs text-[#564334] mt-0.5">{item.subtitle}</p>
                              <span className="text-[10px] text-[#897362]">{item.submittedAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setSelectedValidation(item); setIsDocModalOpen(true); }}
                              className="px-3.5 py-2 bg-[#FBEADA] text-[#904D00] font-semibold text-xs rounded-lg border border-[#DDC1AE] hover:bg-[#F5E0CB] transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Docs</span>
                            </button>

                            {item.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleReject(item.id)}
                                  className="px-3.5 py-2 border-2 border-[#126E0C] text-[#126E0C] font-semibold text-xs rounded-lg hover:bg-[#F0F9F0] transition cursor-pointer"
                                >
                                  Rejeter
                                </button>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="px-4 py-2 bg-[#FF8C00] text-white font-semibold text-xs rounded-lg hover:bg-[#E67E00] shadow-sm transition cursor-pointer"
                                >
                                  Approuver
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Graphique de croissance (1/3 width) */}
                <section className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-[#E1E3E4] p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-base font-bold text-[#191C1D]">Croissance</h2>
                      <select className="bg-[#F3F4F5] border border-[#E1E3E4] text-xs font-semibold rounded-md py-1 px-2 focus:outline-none">
                        <option>Ce mois</option>
                        <option>Cette année</option>
                      </select>
                    </div>

                    {/* Bars chart visualization */}
                    <div className="flex-1 flex flex-col justify-end relative min-h-[180px] pb-6 pt-4 border-b border-[#E1E3E4]">
                      <div className="flex items-end justify-between gap-2 h-36">
                        <div className="w-1/6 bg-[#FF8C00]/40 rounded-t-sm h-[30%] hover:bg-[#FF8C00]/60 transition" />
                        <div className="w-1/6 bg-[#FF8C00]/50 rounded-t-sm h-[45%] hover:bg-[#FF8C00]/70 transition" />
                        <div className="w-1/6 bg-[#FF8C00]/60 rounded-t-sm h-[40%] hover:bg-[#FF8C00]/80 transition" />
                        <div className="w-1/6 bg-[#FF8C00]/70 rounded-t-sm h-[65%] hover:bg-[#FF8C00]/90 transition" />
                        <div className="w-1/6 bg-[#FF8C00]/80 rounded-t-sm h-[80%] hover:bg-[#FF8C00] transition" />
                        <div className="w-1/6 bg-[#FF8C00] rounded-t-sm h-[100%] transition" />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#564334] font-medium pt-2">
                        <span>Lun</span>
                        <span>Mar</span>
                        <span>Mer</span>
                        <span>Jeu</span>
                        <span>Ven</span>
                        <span>Sam</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[11px] text-[#564334]">Nouveaux</p>
                        <p className="font-bold text-[#191C1D] text-sm">+342</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#564334]">Actifs</p>
                        <p className="font-bold text-[#191C1D] text-sm">8.4k</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#564334]">Conversion</p>
                        <p className="font-bold text-[#126E0C] text-sm">64%</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* TAB 2: UTILISATEURS ÉTUDIANTS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-[#E1E3E4] p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E3E4] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#191C1D]">Base Candidats & Étudiants Inscrit(e)s</h2>
                  <p className="text-xs text-[#564334]">Gérez les profils, les vérifications d'identité et les autorisations d'accès.</p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#564334]" />
                  <div className="flex bg-[#F3F4F5] p-1 rounded-lg border border-[#E1E3E4]">
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setUserStatusFilter(st)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                          userStatusFilter === st
                            ? 'bg-white text-[#904D00] shadow-xs font-bold'
                            : 'text-[#564334] hover:text-[#191C1D]'
                        }`}
                      >
                        {st === 'ALL' ? 'Tous' : st === 'PENDING' ? 'En Attente' : st === 'APPROVED' ? 'Approuvés' : 'Rejetés'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E1E3E4] bg-[#F8F9FA] text-[#564334]">
                      <th className="p-3 font-semibold">Candidat / Étudiant</th>
                      <th className="p-3 font-semibold">Établissement & Filière</th>
                      <th className="p-3 font-semibold">Contact</th>
                      <th className="p-3 font-semibold">Statut Approbation</th>
                      <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E3E4]">
                    {usersList
                      .filter((u) => userStatusFilter === 'ALL' || u.status === userStatusFilter)
                      .filter((u) => !searchTerm || u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-[#F8F9FA] transition">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <CandidateAvatar name={u.name} src={u.avatar} size="w-9 h-9" />
                              <div>
                                <span className="font-bold text-[#191C1D] block">{u.name}</span>
                                <span className="text-[10px] text-[#897362]">Inscrit le {u.registeredAt}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-[#191C1D] block">{u.university}</span>
                            <span className="text-[11px] text-[#564334]">{u.field}</span>
                          </td>
                          <td className="p-3">
                            <span className="block text-[#191C1D]">{u.email}</span>
                            <span className="text-[11px] text-[#564334]">{u.phone}</span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              u.status === 'APPROVED'
                                ? 'bg-[#9BF585] text-[#197211]'
                                : u.status === 'PENDING'
                                ? 'bg-[#FFDAD6] text-[#93000A]'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {u.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span>{u.status === 'APPROVED' ? 'Approuvé' : u.status === 'PENDING' ? 'En approbation' : 'Rejeté'}</span>
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(u.id)}
                                    className="px-2.5 py-1 rounded bg-[#FF8C00] text-white font-semibold text-[11px] hover:bg-[#E67E00] transition cursor-pointer"
                                  >
                                    Approuver
                                  </button>
                                  <button
                                    onClick={() => handleReject(u.id)}
                                    className="px-2.5 py-1 rounded border border-[#126E0C] text-[#126E0C] font-semibold text-[11px] hover:bg-[#F0F9F0] transition cursor-pointer"
                                  >
                                    Rejeter
                                  </button>
                                </>
                              )}
                              {u.status === 'APPROVED' && (
                                <span className="text-[11px] text-[#126E0C] font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Accès Actif
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ENTREPRISES */}
          {activeTab === 'companies' && (
            <div className="bg-white rounded-xl shadow-sm border border-[#E1E3E4] p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[#E1E3E4] pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#191C1D]">Entreprises & Recruteurs Partenaires</h2>
                  <p className="text-xs text-[#564334]">Vérification du Compte Contribuable (CC) et KBIS des entreprises.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companiesList.map((c) => (
                  <div key={c.id} className="p-5 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#191C1D] text-sm">{c.name}</h3>
                        <p className="text-xs text-[#564334]">{c.sector} • {c.city}</p>
                        <span className="text-[11px] text-[#897362] font-medium block mt-1">CC : {c.compteContribuable}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        c.status === 'APPROVED' ? 'bg-[#9BF585] text-[#197211]' : 'bg-[#FFDAD6] text-[#93000A]'
                      }`}>
                        {c.status === 'APPROVED' ? 'Vérifiée ✓' : 'CC en révision'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-[#E1E3E4] pt-3">
                      <span className="text-[#564334]">{c.activeJobs} mission(s) publiée(s)</span>
                      <div className="flex gap-2">
                        <button onClick={() => showToast(`Consultation KBIS de ${c.name}`)} className="px-3 py-1.5 bg-[#FBEADA] text-[#904D00] font-semibold text-xs rounded-lg hover:bg-[#F5E0CB] transition cursor-pointer">
                          Voir KBIS
                        </button>
                        {c.status === 'PENDING' && (
                          <button onClick={() => showToast(`Entreprise ${c.name} validée !`)} className="px-3 py-1.5 bg-[#FF8C00] text-white font-semibold text-xs rounded-lg hover:bg-[#E67E00] transition cursor-pointer">
                            Valider CC
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFRES D'EMPLOI */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-xl shadow-sm border border-[#E1E3E4] p-6 space-y-6">
              <div className="border-b border-[#E1E3E4] pb-4">
                <h2 className="text-base font-bold text-[#191C1D]">Modération des Offres de Jobs Étudiants</h2>
                <p className="text-xs text-[#564334]">Supervisez les missions publiées par les recruteurs et les rémunérations proposées.</p>
              </div>

              <div className="space-y-4">
                {MOCK_JOBS_LIST.map((job) => (
                  <div key={job.id} className="p-5 rounded-xl border border-[#E1E3E4] bg-[#F8F9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#191C1D] text-sm">{job.title}</h3>
                      <p className="text-xs text-[#564334] font-medium">{job.company} • {job.location}</p>
                      <div className="flex gap-3 text-[11px] text-[#897362] mt-2">
                        <span>💰 {job.salary}</span>
                        <span>👥 {job.applicants} candidatures</span>
                        <span>📅 Publié {job.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#9BF585] text-[#197211]">
                        Offre Active
                      </span>
                      <button onClick={() => showToast(`Offre ${job.title} masquée.`)} className="px-3 py-1.5 border border-[#BA1A1A] text-[#BA1A1A] font-semibold text-xs rounded-lg hover:bg-[#FFDAD6] transition cursor-pointer">
                        Suspendre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCES */}
          {activeTab === 'finances' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-[#E1E3E4] shadow-sm">
                  <p className="text-xs text-[#564334]">Solde Total Plateforme</p>
                  <h3 className="text-2xl font-bold text-[#191C1D] mt-1">68,450 000 XOF</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E1E3E4] shadow-sm">
                  <p className="text-xs text-[#564334]">Commissions en Attente</p>
                  <h3 className="text-2xl font-bold text-[#FF8C00] mt-1">5,250 XOF / candidat</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#E1E3E4] shadow-sm">
                  <p className="text-xs text-[#564334]">Retraits Mobile Money du Jour</p>
                  <h3 className="text-2xl font-bold text-[#126E0C] mt-1">1,850 000 XOF</h3>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PARAMÈTRES */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-[#E1E3E4] p-6 space-y-6 max-w-2xl">
              <div className="border-b border-[#E1E3E4] pb-4">
                <h2 className="text-base font-bold text-[#191C1D]">Paramètres du Compte Administrateur</h2>
                <p className="text-xs text-[#564334]">Gestion de vos accès et des paramètres de sécurité de la plateforme.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E1E3E4] space-y-2">
                  <span className="font-semibold text-[#564334] block">Compte Actif :</span>
                  <p className="font-bold text-[#191C1D] text-sm">{adminUser?.name || 'Henri Litié'}</p>
                  <p className="text-[#564334]">{adminUser?.email || 'h.litie@haut-numerique.com'}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#FF8C00]/20 text-[#904D00] font-bold text-[10px]">
                    SUPER_ADMINISTRATOR
                  </span>
                </div>

                <div className="pt-2 space-y-3">
                  <h3 className="font-bold text-[#191C1D]">Règles de Sécurité Actives</h3>
                  <ul className="space-y-2 text-[#564334]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#126E0C]" />
                      <span>Vérification obligatoire des 2 faces de la pièce d'identité (Recto & Verso)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#126E0C]" />
                      <span>Validation manuelle par l'équipe admin avant accès au dashboard étudiant</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#126E0C]" />
                      <span>Vérification des cartes étudiantes et attestations d'inscription</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {isDocModalOpen && selectedValidation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E1E3E4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#E1E3E4] flex justify-between items-center bg-[#F8F9FA]">
              <div className="flex items-center gap-3">
                <CandidateAvatar name={selectedValidation.name} src={selectedValidation.avatar || selectedValidation.selfieUrl} size="w-10 h-10" />
                <div>
                  <h3 className="font-bold text-[#191C1D] text-sm">{selectedValidation.name}</h3>
                  <p className="text-xs text-[#564334]">{selectedValidation.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer">
                <X className="w-5 h-5 text-[#564334]" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Pitch Vidéo */}
              {selectedValidation.videoPitchUrl && (
                <div className="p-4 rounded-xl border border-[#FF8C00]/30 bg-[#FFF5EC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#904D00] flex items-center gap-2 text-xs">
                      <Video className="w-4 h-4 text-[#FF8C00]" />
                      🎥 Pitch Vidéo de Présentation Candidat
                    </span>
                    <a
                      href={selectedValidation.videoPitchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#904D00] font-bold hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#FF8C00]/20"
                    >
                      <ExternalLink className="w-3 h-3" /> Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[#E1E3E4] bg-black shadow-inner">
                    <video
                      src={selectedValidation.videoPitchUrl}
                      controls
                      className="w-full max-h-64 object-contain"
                      poster={selectedValidation.selfieUrl || selectedValidation.avatar}
                    />
                  </div>
                </div>
              )}

              {/* Profile Details */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E1E3E4] space-y-3">
                <span className="font-bold text-[#191C1D] block text-xs">👤 Profil & Informations Déclarées :</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#564334]">
                  <div>Établissement : <strong className="text-[#191C1D]">{selectedValidation.university || 'N/A'}</strong></div>
                  <div>Filière / Niveau : <strong className="text-[#191C1D]">{selectedValidation.field || 'N/A'}</strong></div>
                  <div>Matricule : <strong className="text-[#191C1D]">{selectedValidation.studentId || 'N/A'}</strong></div>
                  <div>Soumis le : <strong className="text-[#191C1D]">{selectedValidation.submittedAt}</strong></div>
                  {selectedValidation.birthDate && (
                    <div>Date de naissance : <strong className="text-[#191C1D]">{selectedValidation.birthDate}</strong></div>
                  )}
                  {selectedValidation.gender && (
                    <div>Genre : <strong className="text-[#191C1D]">{selectedValidation.gender}</strong></div>
                  )}
                  {selectedValidation.hasDriverLicense && (
                    <div>Permis de conduire : <strong className="text-[#126E0C]">Oui ({selectedValidation.driverLicenseCategory || 'Catégorie B'})</strong></div>
                  )}
                  {selectedValidation.desiredRate && (
                    <div>Tarif désiré : <strong className="text-[#904D00]">{selectedValidation.desiredRate.toLocaleString('fr-FR')} XOF / jour</strong></div>
                  )}
                </div>

                {selectedValidation.bio && (
                  <div className="pt-2 border-t border-[#E1E3E4]">
                    <span className="font-semibold text-[#564334] block mb-1">Présentation / Bio :</span>
                    <p className="text-[#191C1D] bg-white p-2.5 rounded-lg border border-[#E1E3E4] italic">"{selectedValidation.bio}"</p>
                  </div>
                )}

                {selectedValidation.skills && selectedValidation.skills.length > 0 && (
                  <div className="pt-2 border-t border-[#E1E3E4]">
                    <span className="font-semibold text-[#564334] block mb-1.5">Compétences :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedValidation.skills.map((sk, idx) => (
                        <span key={idx} className="bg-[#FF8C00]/10 text-[#904D00] border border-[#FF8C00]/20 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Documents Grid */}
              <div className="space-y-4">
                <h4 className="font-bold text-[#191C1D]">Pièces & Justificatifs Transmis pour Vérification :</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SmartDocCard title="Selfie Visage (Identité)" icon="📸" url={selectedValidation.selfieUrl} onOpenZoom={openLightbox} />
                  <SmartDocCard title="Photo de Profil (Avatar Public)" icon="👤" url={selectedValidation.avatar} onOpenZoom={openLightbox} />
                  <SmartDocCard title="Pièce d'Identité RECTO" icon="🪪" url={selectedValidation.idCardRectoUrl} onOpenZoom={openLightbox} />
                  <SmartDocCard title="Pièce d'Identité VERSO" icon="🪪" url={selectedValidation.idCardVersoUrl} onOpenZoom={openLightbox} />
                  <SmartDocCard title="Carte Étudiante / Attestation" icon="🎓" url={selectedValidation.studentCardUrl} onOpenZoom={openLightbox} />
                  {selectedValidation.cvUrl && (
                    <SmartDocCard title="Curriculum Vitae (CV)" icon="📄" url={selectedValidation.cvUrl} onOpenZoom={openLightbox} />
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E1E3E4] bg-[#F8F9FA] flex justify-end gap-3">
              <button
                onClick={() => handleReject(selectedValidation.id)}
                className="px-5 py-2.5 border-2 border-[#126E0C] text-[#126E0C] font-semibold text-xs rounded-lg hover:bg-[#F0F9F0] transition cursor-pointer"
              >
                Rejeter le Dossier
              </button>
              <button
                onClick={() => handleApprove(selectedValidation.id)}
                className="px-6 py-2.5 bg-[#FF8C00] text-white font-bold text-xs rounded-lg hover:bg-[#E67E00] shadow-sm transition cursor-pointer"
              >
                Approuver & Débloquer le Compte ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FULLSCREEN ZOOM MODAL */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-5xl w-full h-[90vh] bg-[#191C1D] rounded-2xl overflow-hidden flex flex-col border border-[#564334] shadow-2xl">
            <div className="p-4 bg-[#2E3132] border-b border-[#564334] flex justify-between items-center text-white">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF8C00]" />
                {lightboxTitle || 'Aperçu du Document'}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={lightboxUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#FF8C00] text-white rounded-lg text-xs font-semibold hover:bg-[#E67E00] flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Ouvrir dans un nouvel onglet
                </a>
                <button
                  onClick={() => setLightboxUrl(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 flex items-center justify-center overflow-auto bg-black/40">
              {lightboxUrl.toLowerCase().includes('.pdf') ||
              lightboxUrl.toLowerCase().includes('/pdf') ||
              lightboxTitle.toLowerCase().includes('cv') ||
              lightboxTitle.toLowerCase().includes('curriculum') ||
              lightboxTitle.toLowerCase().includes('attestation') ? (
                <iframe
                  src={lightboxUrl}
                  className="w-full h-full rounded-xl border-0 bg-white shadow-2xl"
                  title={lightboxTitle || 'Aperçu Document'}
                />
              ) : (
                <img
                  src={lightboxUrl}
                  alt={lightboxTitle || 'Document Zoom'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    if (parent) {
                      const iframe = document.createElement('iframe');
                      iframe.src = lightboxUrl;
                      iframe.className = 'w-full h-full rounded-xl border-0 bg-white shadow-2xl';
                      iframe.title = lightboxTitle || 'Aperçu Document';
                      parent.replaceChild(iframe, target);
                    }
                  }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
