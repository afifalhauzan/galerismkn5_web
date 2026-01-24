'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePasswordCheck } from '@/hooks/usePasswordCheck';

interface PasswordGuardProps {
  children: React.ReactNode;
}

export function PasswordGuard({ children }: PasswordGuardProps) {
  const { needsPasswordChange, isLoading, error } = usePasswordCheck();
  const router = useRouter();

  useEffect(() => {
    // Skip if still loading or has error (let proxy handle it)
    if (isLoading || error) return;

    // If password needs to be changed, redirect to change password page
    if (needsPasswordChange) {
      router.push('/change-password');
    }
  }, [needsPasswordChange, isLoading, error, router]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If there's an error, still render children (let other error boundaries handle it)
  // If password needs change, don't render children (will redirect)
  if (needsPasswordChange) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to password change page...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}