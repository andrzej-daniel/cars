interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "#FFFFFF" : "#1B3564";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Q circle mark */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="22" r="20" fill="#5BBF21" />
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="28"
          fill="#FFFFFF"
        >
          Q
        </text>
        {/* Q tail */}
        <rect x="30" y="34" width="10" height="5" rx="2" fill="#5BBF21" transform="rotate(-35 30 34)" />
      </svg>

      {/* Text part */}
      <div className="flex flex-col leading-tight">
        <span
          className="text-lg font-bold tracking-widest"
          style={{ color: textColor }}
        >
          SERVICE
        </span>
        <span
          className="text-sm font-bold tracking-[0.3em] text-q-green"
        >
          ALCAR
        </span>
      </div>
    </div>
  );
}
