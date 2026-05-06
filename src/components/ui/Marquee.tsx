"use client";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Edge fades */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #0a0e17, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #0a0e17, transparent)", zIndex: 2, pointerEvents: "none" }} />

      <div
        style={{
          display: "flex",
          width: "fit-content",
          animation: `marquee-${direction} ${speed}s linear infinite`,
          ...(pauseOnHover ? {} : {}),
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = "running";
        }}
      >
        {children}
        {children}
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
