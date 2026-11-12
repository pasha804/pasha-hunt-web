"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  depth?: number;
}

export default function ThreeDCard({
  children,
  className = "",
  glowColor = "#FF6B00",
  depth = 25,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [depth * 0.45, -depth * 0.45]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-depth * 0.45, depth * 0.45]);

  const glareX = useTransform(mouseXSpring, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / rect.width;
    const clientY = (e.clientY - rect.top) / rect.height;
    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className={`relative rounded-2xl transition-shadow duration-300 ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full rounded-2xl border border-[#1E252D] bg-[#0E1318]/85 p-6 backdrop-blur-xl shadow-2xl transition-colors duration-300 hover:border-[#FF6B00]/40"
      >
        {/* Dynamic 3D Glare effect */}
        {isHovered && (
          <motion.div
            style={{
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-none absolute h-64 w-64 rounded-full opacity-15 blur-2xl transition-opacity duration-300"
            style-glow={{ backgroundColor: glowColor }}
          />
        )}

        {/* Floating Inner Content Layer */}
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

