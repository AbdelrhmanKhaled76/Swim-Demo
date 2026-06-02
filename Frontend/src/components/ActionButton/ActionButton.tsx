import React from 'react';

function ActionButton({
  variant,
  children,
}: {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}) {
  const base =
    'regular text-[9px] tracking-widest uppercase px-3 py-2 leading-tight text-center cursor-pointer transition-opacity hover:opacity-80 whitespace-pre-line';
  if (variant === 'primary') {
    return (
      <button className={`${base} bg-primary-500 text-white`}>
        {children}
      </button>
    );
  }
  return (
    <button className={`${base} bg-white border border-neutral-900 text-neutral-900`}>
      {children}
    </button>
  );
}

export default ActionButton;
