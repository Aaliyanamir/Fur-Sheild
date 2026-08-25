import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({ 
  className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-glow focus:ring-brand-500 hover:-translate-y-0.5",
    secondary: "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 hover:border-brand-300 focus:ring-brand-500",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "text-slate-600 hover:text-brand-600 hover:bg-brand-50 focus:ring-brand-500",
  };

  const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 py-2 text-sm", lg: "h-12 px-8 text-base" };

  return (
    <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
