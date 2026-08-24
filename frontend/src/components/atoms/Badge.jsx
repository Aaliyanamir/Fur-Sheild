import React from 'react';
import { cn } from '../../lib/utils';

export default function Badge({ 
  children, 
  variant = 'neutral', 
  className 
}) {
  const variants = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-forest-50 text-forest-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    brand: "bg-blue-50 text-blue-700",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
