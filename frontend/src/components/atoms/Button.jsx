import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-camel-500 text-white hover:bg-camel-600 shadow-soft hover:shadow-floating hover:-translate-y-0.5",
    secondary: "bg-camel-50 text-camel-800 hover:bg-camel-100 text-camel-900",
    outline: "border-2 border-camel-200 bg-transparent text-espresso-800 hover:border-camel-400 hover:bg-camel-50",
    ghost: "text-espresso-500 hover:text-camel-600 hover:bg-camel-50/50",
  };

  const sizes = { sm: "h-9 px-4 text-xs", md: "h-11 px-6 text-sm", lg: "h-14 px-8 text-base" };

  return (
    <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
