"use client";

export default function AuroraBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Base grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 70%)",
        }}
      />

      {/* Aurora Orb 1 - Large emerald */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora-1 8s ease-in-out infinite",
        }}
      />

      {/* Aurora Orb 2 - Blue accent */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "aurora-2 10s ease-in-out infinite",
        }}
      />

      {/* Aurora Orb 3 - Purple hint */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "40%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
          animation: "aurora-3 12s ease-in-out infinite",
        }}
      />

      {/* Horizontal light streak */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "-10%",
          width: "120%",
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.2) 30%, rgba(59,130,246,0.15) 50%, rgba(16,185,129,0.2) 70%, transparent 100%)",
          animation: "streak-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Scattered bright dots */}
      {[
        { top: "20%", left: "25%", delay: "0s", size: 3 },
        { top: "35%", left: "70%", delay: "1s", size: 2 },
        { top: "60%", left: "15%", delay: "2s", size: 2 },
        { top: "45%", left: "55%", delay: "0.5s", size: 3 },
        { top: "75%", left: "80%", delay: "1.5s", size: 2 },
        { top: "15%", left: "85%", delay: "3s", size: 2 },
        { top: "80%", left: "35%", delay: "2.5s", size: 3 },
      ].map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px 2px rgba(16,185,129,0.3)",
            animation: `dot-pulse 3s ease-in-out ${dot.delay} infinite`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 20%, #0a0e17 80%)",
        }}
      />

      <style>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 20px) scale(1.08); }
          66% { transform: translate(15px, -25px) scale(0.92); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -15px) scale(1.1); }
        }
        @keyframes streak-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
