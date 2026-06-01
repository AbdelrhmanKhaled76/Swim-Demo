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
  return (
    <div className={`relative w-full md:w-auto shrink-0 ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="regular text-[12px] tracking-widest text-tertiary-500 border border-neutral-300 bg-[#FBF9FB] px-4 py-3 pr-10 appearance-none cursor-pointer uppercase w-full md:w-55 outline-none focus:border-neutral-500 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default SortDropdown;
