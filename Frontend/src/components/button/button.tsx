import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  click?: () => void;
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 text-[0.85rem] tracking-[1px] cursor-pointer uppercase regular transition-all font-semibold rounded-sm";

  const variants: Record<"primary" | "secondary" | "outline", string> = {
    primary: "bg-primary-500 text-white border-none hover:bg-primary-600",
    secondary: "bg-secondary-500 text-white border-none hover:bg-secondary-600",
    outline:
      "bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
      onClick={props.onClick}
    >
      {props.icon && (
        <img
          src={props.icon}
          alt="Button Icon"
          className="w-4 h-4 me-2 inline"
        />
      )}
      {children}
    </button>
  );
};

export default Button;
