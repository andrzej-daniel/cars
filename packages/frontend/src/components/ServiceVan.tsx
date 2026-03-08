interface ServiceVanProps {
  className?: string;
}

export function ServiceVan({ className = "" }: ServiceVanProps) {
  return (
    <svg
      viewBox="0 0 480 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Van body */}
      <rect x="20" y="60" width="320" height="120" rx="8" fill="#1B3564" />
      {/* Cargo area */}
      <rect x="20" y="60" width="220" height="120" rx="8" fill="#1B3564" />
      {/* Cabin */}
      <path
        d="M340 100 L340 180 L420 180 L420 130 L390 100 Z"
        fill="#1B3564"
        stroke="#243f73"
        strokeWidth="1"
      />
      {/* Windshield */}
      <path
        d="M345 105 L385 105 L410 130 L410 145 L345 145 Z"
        fill="#6B8EC2"
        opacity="0.7"
      />
      {/* Side window on cabin */}
      <rect x="345" y="110" width="35" height="30" rx="3" fill="#6B8EC2" opacity="0.5" />
      {/* Bumper */}
      <rect x="415" y="155" width="30" height="25" rx="4" fill="#142847" />
      {/* Headlight */}
      <rect x="420" y="158" width="12" height="8" rx="2" fill="#FFD966" />
      {/* Bottom trim */}
      <rect x="20" y="175" width="425" height="8" rx="2" fill="#142847" />

      {/* Wheel - rear */}
      <circle cx="100" cy="185" r="28" fill="#333" />
      <circle cx="100" cy="185" r="18" fill="#555" />
      <circle cx="100" cy="185" r="8" fill="#888" />

      {/* Wheel - front */}
      <circle cx="370" cy="185" r="28" fill="#333" />
      <circle cx="370" cy="185" r="18" fill="#555" />
      <circle cx="370" cy="185" r="8" fill="#888" />

      {/* Q logo on van side */}
      <circle cx="130" cy="115" r="30" fill="#5BBF21" />
      <text
        x="130"
        y="125"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="32"
        fill="#FFFFFF"
      >
        Q
      </text>
      {/* Q tail */}
      <rect x="148" y="130" width="14" height="6" rx="3" fill="#5BBF21" transform="rotate(-35 148 130)" />

      {/* SERVICE text */}
      <text
        x="195"
        y="110"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="#FFFFFF"
        letterSpacing="3"
      >
        SERVICE
      </text>

      {/* ALCAR text */}
      <text
        x="195"
        y="135"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="16"
        fill="#5BBF21"
        letterSpacing="4"
      >
        ALCAR
      </text>

      {/* Decorative stripe */}
      <rect x="20" y="155" width="320" height="3" fill="#5BBF21" opacity="0.6" />

      {/* Ground shadow */}
      <ellipse cx="230" cy="215" rx="200" ry="6" fill="#000" opacity="0.08" />
    </svg>
  );
}
