import React from 'react';

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function FormSection({ icon, title, children, className = '' }: FormSectionProps) {
  return (
    <div className={`border border-neutral-300 bg-white ${className}`}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-300">
        <span className="text-neutral-700 shrink-0">{icon}</span>
        <span className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-700 font-bold">
          {title}
        </span>
      </div>
      <div className="px-5 py-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

export default FormSection;
