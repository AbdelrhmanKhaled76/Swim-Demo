interface QuantityStepperProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

function QuantityStepper({
  id = 'quantity-stepper',
  label = 'Enter Quantity',
  value,
  onChange,
  min = 0,
  max,
  className = '',
}: QuantityStepperProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (max === undefined || value < max) onChange(value + 1);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="regular text-[10px] md:text-[11px] tracking-widest uppercase text-neutral-500 font-bold"
        >
          {label}
        </label>
      )}
      <div className="flex items-center border border-neutral-300 bg-white w-full">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="regular text-[16px] text-neutral-600 px-4 py-3 border-r border-neutral-300 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          −
        </button>

        <span
          id={id}
          className="regular text-[13px] md:text-[14px] tracking-widest text-neutral-900 text-center flex-1 px-4 py-3 select-none"
        >
          {value}
        </span>

        <button
          type="button"
          onClick={increment}
          disabled={max !== undefined && value >= max}
          aria-label="Increase quantity"
          className="regular text-[16px] text-neutral-600 px-4 py-3 border-l border-neutral-300 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default QuantityStepper;
