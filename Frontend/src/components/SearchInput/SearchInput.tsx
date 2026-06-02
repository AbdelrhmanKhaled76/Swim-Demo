interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchInput({
  id = 'search-item',
  value,
  onChange,
  placeholder = 'Search With Item Name',
  className = '',
}: SearchInputProps) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`regular text-[12px] tracking-widest text-tertiary-500 border border-neutral-300 bg-[#FBF9FB] px-4 py-3 w-full placeholder:text-tertiary-500 outline-none focus:border-neutral-500 transition-colors ${className}`}
    />
  );
}

export default SearchInput;
