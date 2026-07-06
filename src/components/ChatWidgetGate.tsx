'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from '@/components/ChatWidget';

const hiddenPaths = new Set(['/austin', '/goffs', '/jordi', '/portal', '/admin/portal', '/boatman-garage']);

export default function ChatWidgetGate() {
  const pathname = usePathname();

  if (hiddenPaths.has(pathname)) {
    return null;
  }

  return <ChatWidget />;
}
