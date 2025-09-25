import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Test circles to ensure animation is working */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 20 + 10, // 10-30px
            height: Math.random() * 20 + 10,
            backgroundColor: i % 3 === 0 ? '#f7c5d0' : i % 3 === 1 ? '#81a395' : '#b8d4e8',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.6,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.5, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 15 + 10, // 10-25 seconds
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Larger floating orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 100 + 80, // 80-180px
            height: Math.random() * 100 + 80,
            background: `radial-gradient(circle, ${
              i % 3 === 0 
                ? 'rgba(247, 197, 208, 0.4)' 
                : i % 3 === 1 
                ? 'rgba(129, 163, 149, 0.4)' 
                : 'rgba(184, 212, 232, 0.4)'
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
          }}
          animate={{
            x: [0, 40, -25, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.3, 0.6, 0.2, 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 15, // 15-35 seconds
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Rising particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 3, // 3-11px
            height: Math.random() * 8 + 3,
            backgroundColor: i % 3 === 0 ? '#f7c5d0' : i % 3 === 1 ? '#81a395' : '#b8d4e8',
            left: `${Math.random() * 100}%`,
            top: '100%',
            opacity: 0.7,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 8, // 8-18 seconds
            delay: Math.random() * 15,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        {[...Array(5)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = Math.random() * 100;
          const y2 = Math.random() * 100;
          
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#81a395"
              strokeWidth="1"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                strokeOpacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 15,
                delay: i * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}