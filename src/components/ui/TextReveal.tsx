"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  highlight?: string;
  highlightColor?: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function TextReveal({
  text,
  highlight,
  highlightColor = "#10b981",
  style,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const words = text.split(" ");

  return (
    <span ref={ref} style={{ display: "inline", ...style }}>
      {words.map((word, i) => {
        const isHighlight = highlight && word.toLowerCase().includes(highlight.toLowerCase());
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: delay + i * 0.04,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              style={{
                display: "inline-block",
                color: isHighlight ? highlightColor : "inherit",
                marginRight: "0.3em",
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
