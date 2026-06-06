import { useState, useEffect, useRef } from 'react';

interface SortDropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

function SortDropdown({
  id = 'sort-by',
  value,
  onChange,
  options,
  className = '',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full md:w-55 shrink-0 ${className}`}>
      <button
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center regular text-[12px] tracking-widest text-tertiary-500 border border-neutral-300 bg-[#FBF9FB] px-4 py-3 cursor-pointer uppercase w-full outline-none focus:border-neutral-500 hover:border-primary-500 transition-all duration-200"
      >
        <span>{value}</span>
        <svg 
          className={`w-4 h-4 text-neutral-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-full mt-1 bg-white border border-neutral-300 shadow-lg animate-slide-down">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-left regular text-[11px] tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                  isSelected 
                    ? 'bg-neutral-100 text-primary-700 font-bold' 
                    : 'text-tertiary-500 hover:bg-neutral-50 hover:text-primary-700'
                }`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
