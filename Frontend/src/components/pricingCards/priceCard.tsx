import React from 'react';
import Button from '../button/button';

interface PriceCardProps {
  title: string;
  price: string;
  period: string;
  subtitle: string;
  buttonVariant: 'primary' | 'outline';
  isRecommended?: boolean;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, price, period, subtitle, buttonVariant, isRecommended }) => {
  return (
    <div className={`relative w-full max-w-[340px] bg-white border-[2px] p-8 flex flex-col justify-between h-[280px] shadow-sm ${isRecommended ? 'border-[#0a2342]' : 'border-gray-300'}`}>
      {isRecommended && (
        <div className="absolute -top-4 right-8 bg-[#ff6b35] text-white text-[0.65rem] font-bold px-3 py-1 uppercase tracking-widest shadow-md">
          RECOMMENDED
        </div>
      )}
      
      <div className="flex flex-col">
        <span className="text-gray-500 text-[0.7rem] font-bold tracking-widest uppercase mb-2 inter">{title}</span>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[3.5rem] leading-none font-black text-black tracking-tighter">{price}</span>
          <span className="text-gray-400 text-[0.75rem] font-bold uppercase tracking-widest">/ {period}</span>
        </div>
        <span className="text-gray-500 text-[0.7rem] font-bold tracking-widest uppercase mt-2 inter">{subtitle}</span>
      </div>

      <Button 
        variant={buttonVariant} 
        className={`w-full mt-6 py-3 font-bold tracking-widest text-[0.75rem] ${!isRecommended ? '!border-gray-300 !text-gray-700 hover:!bg-gray-100' : ''}`}
      >
        CREATE SHIPMENT
      </Button>
    </div>
  );
};

export default PriceCard;
