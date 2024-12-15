import { ComponentChildren } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Button variants and sizes
type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "base" | "lg";

// Button props interface
interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ComponentChildren;
  class?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  variant = "primary",
  size = "base",
  children,
  class: className = "",
  disabled = false,
  onClick,
}: ButtonProps) {
  // Variant-specific classes
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
  };

  // Size-specific classes
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    base: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      class={`
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        rounded-md 
        transition-colors 
        duration-200 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;