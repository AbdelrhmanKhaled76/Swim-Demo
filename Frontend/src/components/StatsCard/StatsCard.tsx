import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtext: React.ReactNode;
  variant?: 'dark' | 'light';
  icon?: React.ReactNode;
}

function StatsCard({
  title,
  value,
  subtext,
  variant = 'light',
  icon,
}: StatsCardProps) {
  const isDark = variant === 'dark';
  return (
    <div
      className={`w-full p-6 flex flex-col justify-between border rounded-sm transition-all hover:shadow-sm ${isDark
          ? 'bg-[#2B2B2C] border-neutral-800 text-white'
          : 'bg-white border-neutral-300 text-neutral-900'
        }`}
    >
      <div className={`flex ${icon ? 'justify-between' : 'justify-center md:justify-between'} items-start mb-4`}>
        <span
          className={`regular text-[10px] md:text-[11px] tracking-widest uppercase ${icon ? 'text-left' : 'text-center md:text-left w-full'
            } ${isDark ? 'text-light-100' : 'text-neutral-500 font-bold'
            }`}
        >
          {title}
        </span>
        {icon && <div className="shrink-0 ml-2">{icon}</div>}
      </div>

      <div className="flex flex-col gap-1 text-center md:text-left w-full">
        <span
          className={`header text-[28px] md:text-[36px] font-bold tracking-tight uppercase leading-tight ${isDark ? 'text-[#FFE6B3]' : 'text-neutral-900'
            }`}
        >
          {value}
        </span>
        <span
          className={`regular text-[9px] md:text-[10px] tracking-widest uppercase leading-snug ${isDark ? 'text-light-100' : 'text-neutral-400 font-bold'
            }`}
        >
          {subtext}
        </span>
      </div>
    </div>
  );
}

export default StatsCard;
