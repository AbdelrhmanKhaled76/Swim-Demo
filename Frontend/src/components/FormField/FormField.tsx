
interface BaseProps {
  id: string;
  label: string;
  className?: string;
}

interface InputFieldProps extends BaseProps {
  as?: 'input';
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseProps {
  as: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseProps {
  as: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const inputBase =
  'regular text-[12px] md:text-[13px] tracking-widest text-neutral-800 border border-neutral-300 bg-white px-4 py-3 w-full placeholder:text-neutral-400 outline-none focus:border-primary-500 transition-colors resize-none';

function FormField(props: FormFieldProps) {
  const { id, label, className = '' } = props;

  const labelEl = (
    <label
      htmlFor={id}
      className="regular text-[10px] md:text-[11px] tracking-widest uppercase text-neutral-500 font-bold"
    >
      {label}
    </label>
  );

  if (props.as === 'textarea') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {labelEl}
        <textarea
          id={id}
          rows={props.rows ?? 3}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className={inputBase}
        />
      </div>
    );
  }

  if (props.as === 'select') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {labelEl}
        <div className="relative w-full">
          <select
            id={id}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className={`${inputBase} appearance-none cursor-pointer pr-10 uppercase`}
          >
            {props.placeholder && (
              <option value="" disabled>
                {props.placeholder}
              </option>
            )}
            {props.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {labelEl}
      <input
        id={id}
        type={props.type ?? 'text'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className={inputBase}
      />
    </div>
  );
}

export default FormField;
