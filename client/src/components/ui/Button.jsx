import { forwardRef } from "react";

const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-indigo-500",
    danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50 focus:ring-red-500"
};

const Button = forwardRef(function Button({ variant = "primary", className = "", children, ...props }, ref) {
    return <button ref={ref} className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} {...props}>{children}</button>;
});

export default Button;
