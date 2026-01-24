'use client';

import { PasswordGuard } from '@/components/guards/PasswordGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PasswordGuard>
      {children}
    </PasswordGuard>
  );
}