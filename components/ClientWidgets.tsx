'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget';
import WhatsAppButton from './WhatsAppButton';

export default function ClientWidgets() {
  const pathname = usePathname();
  
  // Don't show on admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }
  
  return (
    <>
      <WhatsAppButton />
      <ChatWidget />
    </>
  );
}

