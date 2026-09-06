import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-jh-green-900 text-jh-earth-50 hover:bg-jh-green-800 border border-jh-green-800 shadow-sm focus:ring-jh-green-700",
    secondary: "bg-jh-terracotta-700 text-white hover:bg-jh-terracotta-800 border border-jh-terracotta-600 shadow-sm focus:ring-jh-terracotta-500",
    accent: "bg-jh-terracotta-500 text-white hover:bg-jh-terracotta-600 shadow-sm focus:ring-jh-terracotta-400",
    outline: "bg-transparent text-jh-green-900 border border-jh-green-800 hover:bg-jh-green-50 focus:ring-jh-green-700",
    glass: "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md focus:ring-white/50",
    ghost: "bg-transparent text-jh-green-900 hover:bg-jh-green-100/60 focus:ring-jh-green-600",
    danger: "bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-500"
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5 font-semibold",
    xl: "text-lg px-6 py-3.5 gap-3 font-semibold"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
};
