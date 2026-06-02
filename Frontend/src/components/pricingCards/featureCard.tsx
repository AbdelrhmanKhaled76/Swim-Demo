import React from 'react';

interface FeatureCardProps {
  label: string;
  title: string;
  subtitle: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ label, title, subtitle }) => {
  return (
    <div className="w-full bg-white border-2 border-gray-300 p-8 flex flex-col justify-center h-[180px] shadow-sm">
      <span className="text-gray-500 text-[0.7rem] font-bold tracking-widest uppercase mb-3 inter">{label}</span>
      <h3 className="text-[3rem] font-black text-black uppercase tracking-tighter leading-none mb-4">{title}</h3>
      <span className="text-gray-500 text-[0.75rem] font-bold tracking-widest uppercase inter">{subtitle}</span>
    </div>
  );
};

export default FeatureCard;
