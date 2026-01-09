

export function LoginPattern() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-950">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
           <filter id="blur-md" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
           <filter id="blur-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--muted)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="g3" x1="50%" y1="0%" x2="50%" y2="100%">
             <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.3" />
             <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.3" />
          </linearGradient>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>

        {/* Dark background */}
        <rect width="100%" height="100%" fill="#09090b" />

        {/* Abstract shapes with varying blurs and sizes */}
        <g filter="url(#blur-lg)">
            <circle cx="200" cy="200" r="150" fill="url(#g1)">
                <animate
                    attributeName="cx"
                    values="200;220;200"
                    dur="20s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="cy"
                    values="200;180;200"
                    dur="25s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="800" cy="800" r="150" fill="url(#g2)">
                 <animate
                    attributeName="cx"
                    values="800;780;800"
                    dur="22s"
                    repeatCount="indefinite"
                />
                 <animate
                    attributeName="cy"
                    values="800;820;800"
                    dur="28s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
        
        <g filter="url(#blur-md)">
             <circle cx="850" cy="150" r="100" fill="var(--chart-3)" fillOpacity="0.3">
                <animate
                    attributeName="r"
                    values="100;110;100"
                    dur="15s"
                    repeatCount="indefinite"
                />
             </circle>
             <circle cx="150" cy="850" r="100" fill="var(--chart-4)" fillOpacity="0.3">
                 <animate
                    attributeName="cy"
                    values="850;830;850"
                    dur="18s"
                    repeatCount="indefinite"
                />
             </circle>
             <circle cx="500" cy="500" r="120" fill="url(#g3)">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 500 500"
                    to="360 500 500"
                    dur="60s"
                    repeatCount="indefinite"
                />
             </circle>
        </g>

        <g filter="url(#blur-sm)">
            <circle cx="400" cy="300" r="60" fill="var(--primary)" fillOpacity="0.2">
                 <animate
                    attributeName="cx"
                    values="400;420;400"
                    dur="12s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="600" cy="700" r="60" fill="var(--accent)" fillOpacity="0.2">
                 <animate
                    attributeName="cy"
                    values="700;720;700"
                    dur="14s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="300" cy="600" r="50" fill="var(--secondary)" fillOpacity="0.2">
                <animate
                    attributeName="r"
                    values="50;60;50"
                    dur="10s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx="700" cy="400" r="50" fill="var(--muted-foreground)" fillOpacity="0.2">
                 <animate
                    attributeName="cx"
                    values="700;680;700"
                    dur="16s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
        
        {/* Grid overlay */}
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4" />

        {/* Decorative Lines - reduced scale */}
         <path
            d="M 0 500 Q 500 200 1000 500 T 2000 500"
            fill="none"
            stroke="url(#g1)"
            strokeWidth="2"
            opacity="0.2"
            transform="scale(1.2) rotate(-15 500 500)"
         >
            <animateTransform
                attributeName="transform"
                type="translate"
                values="-50 0; 50 0; -50 0"
                dur="30s"
                repeatCount="indefinite"
                additive="sum"
            />
         </path>
         <path
            d="M 0 500 Q 500 800 1000 500 T 2000 500"
            fill="none"
            stroke="url(#g2)"
            strokeWidth="2"
            opacity="0.2"
            transform="scale(1.0) rotate(15 500 500)"
         >
             <animateTransform
                attributeName="transform"
                type="translate"
                values="50 0; -50 0; 50 0"
                dur="35s"
                repeatCount="indefinite"
                additive="sum"
            />
         </path>
         <path
            d="M -200 500 Q 500 1000 1200 500"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.1"
            transform="rotate(45 500 500)"
         >
              <animate
                    attributeName="stroke-opacity"
                    values="0.1;0.3;0.1"
                    dur="8s"
                    repeatCount="indefinite"
                />
         </path>

      </svg>
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
    </div>
  )
}
