"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SpotlightCard({ children, className, style }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Spotlight gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s",
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.06), transparent 60%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* Spotlight border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s",
          borderRadius: "inherit",
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.15), transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: 1,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div style={{ position: "relative", zIndex: 3 }}>{children}</div>
    </motion.div>
  );
}
