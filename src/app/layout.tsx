import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Service - Administration SaaS',
  description: 'Plateforme d\'administration et support pour Student Service',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full light">
      <body className="min-h-screen bg-[#F8F9FA] text-[#191C1D] antialiased">
        {children}
      </body>
    </html>
  );
}
