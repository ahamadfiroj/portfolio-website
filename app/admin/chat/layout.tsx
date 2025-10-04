'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      {/* Logout Button - Icon only on mobile, text on desktop */}
      <button
        onClick={handleLogout}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg transition-colors"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Logout</span>
      </button>
      {children}
    </div>
  );
}

