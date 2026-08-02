export interface PendingValidation {
  id: string;
  type: 'STUDENT' | 'COMPANY';
  name: string;
  subtitle: string;
  avatar?: string;
  logo?: string;
  university?: string;
  field?: string;
  studentId?: string;
  compteContribuable?: string;
  submittedAt: string;
  studentCardUrl?: string;
  selfieUrl?: string;
  idCardRectoUrl?: string;
  idCardVersoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const MOCK_PENDING_VALIDATIONS: PendingValidation[] = [
  {
    id: 'val-1',
    type: 'STUDENT',
    name: 'Sophie Martin',
    subtitle: 'Étudiante - Master Marketing Digital',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    university: 'Université Félix Houphouët-Boigny (Abidjan - Cocody)',
    field: 'Marketing & Communication',
    studentId: 'CI88-77-AA-ZZ',
    submittedAt: 'Il y a 10 min',
    studentCardUrl: 'https://utfs.io/f/k0pujIK1HvzfwTiyANDPRtdkIB2crNm0w186s7XGVp3YnObK',
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    idCardRectoUrl: 'https://utfs.io/f/k0pujIK1Hvzf0bQ8ibuVfFeo7b0kqE48GmtAZsL5YB6MRQg9',
    idCardVersoUrl: 'https://utfs.io/f/k0pujIK1Hvzf0bQ8ibuVfFeo7b0kqE48GmtAZsL5YB6MRQg9',
    status: 'PENDING',
  },
  {
    id: 'val-2',
    type: 'COMPANY',
    name: 'TechSolutions SAS',
    subtitle: 'Entreprise - Numérique & IT',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    compteContribuable: 'CC-2024-998811-Z',
    submittedAt: 'Il y a 25 min',
    status: 'PENDING',
  },
  {
    id: 'val-3',
    type: 'STUDENT',
    name: 'Marc Gnahoré',
    subtitle: 'Étudiant - Licence 3 Informatique & Génie Logiciel',
    avatar: 'https://utfs.io/f/k0pujIK1HvzfCFs2TZVo3IH5SznALMVQYrcN2RKZUhuf781l',
    university: 'Université Félix Houphouët-Boigny (Abidjan - Cocody)',
    field: 'Informatique & Génie Logiciel',
    studentId: 'CI88-77-AA-ZZ',
    submittedAt: 'Il y a 1 heure',
    studentCardUrl: 'https://utfs.io/f/k0pujIK1HvzfwTiyANDPRtdkIB2crNm0w186s7XGVp3YnObK',
    selfieUrl: 'https://utfs.io/f/k0pujIK1HvzfCFs2TZVo3IH5SznALMVQYrcN2RKZUhuf781l',
    idCardRectoUrl: 'https://utfs.io/f/k0pujIK1Hvzf0bQ8ibuVfFeo7b0kqE48GmtAZsL5YB6MRQg9',
    idCardVersoUrl: 'https://utfs.io/f/k0pujIK1Hvzf0bQ8ibuVfFeo7b0kqE48GmtAZsL5YB6MRQg9',
    status: 'PENDING',
  },
  {
    id: 'val-4',
    type: 'COMPANY',
    name: 'SOTRA Côte d\'Ivoire',
    subtitle: 'Transport & Logistique',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=150&auto=format&fit=crop&q=80',
    compteContribuable: 'CC-1998-001234-A',
    submittedAt: 'Il y a 2 heures',
    status: 'PENDING',
  },
];

export const MOCK_USERS_LIST = [
  {
    id: 'u-1',
    name: 'Marc Gnahoré',
    email: 'cinq.spartacus@gmail.com',
    phone: '+225 0760484911',
    role: 'STUDENT',
    status: 'PENDING',
    verificationStatus: 'PENDING_REVIEW',
    university: 'UFHB Cocody',
    field: 'Génie Logiciel',
    registeredAt: '31 Juillet 2026',
    avatar: 'https://utfs.io/f/k0pujIK1HvzfCFs2TZVo3IH5SznALMVQYrcN2RKZUhuf781l',
  },
  {
    id: 'u-2',
    name: 'Awa Konaté',
    email: 'awa.konate@gmail.com',
    phone: '+225 0505123456',
    role: 'STUDENT',
    status: 'APPROVED',
    verificationStatus: 'APPROVED',
    university: 'INPHB Yamoussoukro',
    field: 'Finance & Comptabilité',
    registeredAt: '25 Juillet 2026',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'u-3',
    name: 'Kouassi Ibrahim',
    email: 'kouassi.ib@gmail.com',
    phone: '+225 0707889900',
    role: 'STUDENT',
    status: 'REJECTED',
    verificationStatus: 'REJECTED',
    university: 'Université Nangui Abrogoua',
    field: 'Sciences Naturelles',
    registeredAt: '28 Juillet 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

export const MOCK_COMPANIES_LIST = [
  {
    id: 'c-1',
    name: 'TechSolutions SAS',
    email: 'contact@techsolutions.ci',
    phone: '+225 2722001122',
    sector: 'Informatique & Tech',
    city: 'Abidjan (Marcory)',
    status: 'PENDING',
    activeJobs: 3,
    compteContribuable: 'CC-2024-998811-Z',
  },
  {
    id: 'c-2',
    name: 'Orange Côte d\'Ivoire',
    email: 'recrutement@orange.ci',
    phone: '+225 0707000000',
    sector: 'Télécoms & Digital',
    city: 'Abidjan (Plateau)',
    status: 'APPROVED',
    activeJobs: 12,
    compteContribuable: 'CC-1996-000001-O',
  },
];

export const MOCK_JOBS_LIST = [
  {
    id: 'j-1',
    title: 'Développeur React / Next.js Junior',
    company: 'TechSolutions SAS',
    type: 'Temps partiel',
    salary: '150 000 XOF / mois',
    location: 'Abidjan (Cocody)',
    applicants: 8,
    status: 'ACTIVE',
    createdAt: 'Hier',
  },
  {
    id: 'j-2',
    title: 'Assistant Community Manager',
    company: 'Orange Côte d\'Ivoire',
    type: 'Stage',
    salary: '120 000 XOF / mois',
    location: 'Abidjan (Plateau)',
    applicants: 15,
    status: 'ACTIVE',
    createdAt: 'Il y a 3 jours',
  },
];
