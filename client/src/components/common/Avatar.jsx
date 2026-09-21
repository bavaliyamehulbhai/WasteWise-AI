export default function Avatar({ src, name, size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  if (src && !src.includes("default_avatar")) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={`rounded-full object-cover border border-border-default ${sizeClasses[size] || sizeClasses.md} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center border border-border-default ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {initials}
    </div>
  );
}
