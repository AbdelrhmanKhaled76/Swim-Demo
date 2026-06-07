
interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, label, checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0">
      <label
        htmlFor={id}
        className={`regular text-[11px] md:text-[12px] tracking-widest uppercase font-bold cursor-pointer select-none ${
          disabled ? 'text-neutral-400' : 'text-neutral-700'
        }`}
      >
        {label}
      </label>

      {/* Square checkbox */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center border transition-colors duration-150 cursor-pointer focus:outline-none ${
          checked
            ? 'bg-primary-700 border-primary-700'
            : 'bg-white border-neutral-400'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {checked && (
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="2 6 5 9 10 3"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default ToggleSwitch;
