"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function Typewriter({
  text,
  speed = 30,
  delay = 0,
  cursor = true,
  onComplete,
  style,
  className,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);

  if (!started) return null;

  return (
    <span className={className} style={style}>
      {displayed}
      {cursor && !done && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "#10b981",
            marginLeft: 2,
            animation: "cursor-blink 0.8s step-end infinite",
            verticalAlign: "text-bottom",
          }}
        />
      )}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
