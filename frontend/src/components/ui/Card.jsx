import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  bordered = true,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl ${bordered ? 'border border-jh-earth-200/80' : ''} shadow-jh-soft p-5 md:p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-jh-card hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'forest',
  className = ''
}) => {
  const colorMap = {
    forest: 'bg-jh-green-50 text-jh-green-900 border-jh-green-200',
    terracotta: 'bg-jh-terracotta-50 text-jh-terracotta-800 border-jh-terracotta-200',
    gold: 'bg-amber-50 text-amber-900 border-amber-200',
    blue: 'bg-blue-50 text-blue-900 border-blue-200'
  };

  const iconBgMap = {
    forest: 'bg-jh-green-900 text-white',
    terracotta: 'bg-jh-terracotta-700 text-white',
    gold: 'bg-amber-600 text-white',
    blue: 'bg-blue-600 text-white'
  };

  return (
    <div className={`bg-white rounded-xl border border-jh-earth-200 shadow-jh-soft p-5 transition-all duration-200 hover:shadow-jh-card ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-jh-earth-700 mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-jh-green-950">{value}</h3>
          {subtitle && <p className="text-xs text-jh-earth-600 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-xs ${iconBgMap[color] || iconBgMap.forest}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-2.5 border-t border-jh-earth-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <span>↑ {trend}</span>
          <span className="text-jh-earth-500 font-normal">vs last month</span>
        </div>
      )}
    </div>
  );
};
