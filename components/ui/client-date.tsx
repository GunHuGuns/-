'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClientDateProps {
  date: Date | string;
  formatStr?: string;
  fallback?: string;
}

export function ClientDate({ 
  date, 
  formatStr = 'yyyy-MM-dd HH:mm',
  fallback = '-'
}: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{fallback}</span>;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return <span>{format(dateObj, formatStr)}</span>;
  } catch {
    return <span>{fallback}</span>;
  }
}
