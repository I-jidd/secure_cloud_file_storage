function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

  const variantClasses = {
    primary: "bg-slate-950 text-white hover:bg-slate-800",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  };

  const sizeClasses = {
    sm: "rounded-xl px-3 py-2 text-xs",
    md: "rounded-xl px-4 py-2 text-sm",
    lg: "rounded-2xl px-4 py-3 text-sm",
  };

  const finalClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  return (
    <button
      type={type}
      disabled={disabled}
      className={finalClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
