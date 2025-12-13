import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
// 1. Tyylien määrittely
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      color: {
        primary: "bg-green-500 text-white hover:bg-white hover:text-green-500 ",
        secondary: "bg-gray-300 text-gray-900 hover:bg-gray-200/80",
        danger: "bg-red-600 text-white hover:bg-red-600/90",
        success: "bg-green-600 text-white hover:bg-green-600/90",
      },
      size: {
        small: "h-9 px-3",
        medium: "h-10 px-4 py-2",
        large: "h-11 px-8",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "medium",
    },
  },
);

// 2. Komponentin propsien määrittely
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "size">, VariantProps<typeof buttonVariants> {
  title: string;
}

// 3. Itse React-komponentin luonti
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, title, color, size, ...props }, ref) => {
  return (
    <button ref={ref} className={buttonVariants({ color, size, className })} {...props}>
      {title}
    </button>
  );
});
Button.displayName = "Button";

export default Button;
