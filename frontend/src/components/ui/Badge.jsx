import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}) => {
  const variantStyles = {
    default: 'bg-jh-earth-200 text-jh-earth-900 border-jh-earth-300',
    forest: 'bg-jh-green-100 text-jh-green-900 border-jh-green-300',
    terracotta: 'bg-jh-terracotta-100 text-jh-terracotta-800 border-jh-terracotta-300',
    gold: 'bg-amber-100 text-amber-900 border-amber-300',
    info: 'bg-blue-100 text-blue-900 border-blue-300',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    warning: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    danger: 'bg-rose-100 text-rose-900 border-rose-300'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};
