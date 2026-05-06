"use client";

import { useRef, useEffect, useState } from "react";

interface Beam {
  id: number;
  x: number;
  delay: number;
  duration: number;
  height: number;
}

export default function GridBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDims({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.w === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dims.w;
    canvas.height = dims.h;

    const cols = Math.floor(dims.w / 64);
    const rows = Math.floor(dims.h / 64);
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, dims.w, dims.h);

      // Draw grid dots
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * 64;
          const y = j * 64;

          // Pulse effect on some dots
          const pulse = Math.sin((frame + i * 10 + j * 7) * 0.02) * 0.5 + 0.5;
          const isActive = (i + j) % 8 === Math.floor(frame / 30) % 8;

          ctx.beginPath();
          ctx.arc(x, y, isActive ? 1.5 : 0.8, 0, Math.PI * 2);
          ctx.fillStyle = isActive
            ? `rgba(16, 185, 129, ${0.15 + pulse * 0.2})`
            : `rgba(31, 41, 55, ${0.3 + pulse * 0.1})`;
          ctx.fill();
        }
      }

      // Draw vertical beams
      for (let i = 0; i < 3; i++) {
        const beamX = ((frame * 0.3 + i * dims.w / 3) % (dims.w + 200)) - 100;
        const beamGrad = ctx.createLinearGradient(beamX, 0, beamX, dims.h);
        beamGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
        beamGrad.addColorStop(0.4, "rgba(16, 185, 129, 0.03)");
        beamGrad.addColorStop(0.6, "rgba(16, 185, 129, 0.03)");
        beamGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = beamGrad;
        ctx.fillRect(beamX - 30, 0, 60, dims.h);
      }

      frame++;
      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [dims]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.6,
      }}
    />
  );
}
