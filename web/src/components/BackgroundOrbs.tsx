"use client";
import { motion } from "framer-motion";

const ORBS = [
  { size: 500, x: "10%", y: "10%", color: "rgba(99,102,241,0.07)", blur: 120, delay: 0 },
  { size: 400, x: "70%", y: "60%", color: "rgba(168,85,247,0.05)", blur: 100, delay: 1.5 },
  { size: 300, x: "40%", y: "80%", color: "rgba(59,130,246,0.04)", blur: 80, delay: 3 },
];

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* Animated orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 15, -10, 0],
            scale: [1, 1.05, 0.97, 1.02, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
