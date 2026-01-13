import { motion } from 'framer-motion'

export function LoginPattern() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
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
            <stop
              offset="100%"
              stopColor="var(--secondary)"
              stopOpacity="0.4"
            />
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
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
        </defs>

        {/* Dynamic background background */}
        <rect width="100%" height="100%" className="fill-background" />

        {/* Abstract shapes with varying blurs and sizes */}
        <motion.g
          filter="url(#blur-lg)"
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <circle cx="200" cy="200" r="150" fill="url(#g1)" />
          <circle cx="800" cy="800" r="150" fill="url(#g2)" />
        </motion.g>

        <motion.g
          filter="url(#blur-md)"
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ originX: '500px', originY: '500px' }}
        >
          <circle cx="500" cy="500" r="120" fill="url(#g3)" />
        </motion.g>

        <motion.g
          filter="url(#blur-sm)"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <circle
            cx="400"
            cy="300"
            r="60"
            fill="var(--primary)"
            fillOpacity="0.2"
          />
          <circle
            cx="600"
            cy="700"
            r="60"
            fill="var(--accent)"
            fillOpacity="0.2"
          />
        </motion.g>

        {/* Grid overlay */}
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          opacity="0.6"
          className="text-foreground"
        />

        {/* Decorative Lines - reduced scale */}
        <motion.path
          d="M 0 500 Q 500 200 1000 500 T 2000 500"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="2"
          opacity="0.3"
          transform="scale(1.2) rotate(-15 500 500)"
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M 0 500 Q 500 800 1000 500 T 2000 500"
          fill="none"
          stroke="url(#g2)"
          strokeWidth="2"
          opacity="0.3"
          transform="scale(1.0) rotate(15 500 500)"
          animate={{ x: [50, -50, 50] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M -200 500 Q 500 1000 1200 500"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1"
          opacity="0.1"
          transform="rotate(45 500 500)"
          animate={{ strokeOpacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </svg>
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80" />
    </div>
  )
}
