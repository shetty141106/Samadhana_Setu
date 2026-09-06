import React from 'react';

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1 border-b border-jh-earth-200 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
              isActive
                ? 'border-jh-green-900 text-jh-green-900 bg-jh-green-50/60'
                : 'border-transparent text-jh-earth-700 hover:text-jh-green-900 hover:border-jh-earth-300'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-jh-green-900 text-white' : 'bg-jh-earth-200 text-jh-earth-800'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
