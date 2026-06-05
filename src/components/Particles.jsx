import { useMemo } from "react";

const CHARS = ["✦", "⋆", "·", "*", "+", "."];

export default function Particles({ count = 35 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      return {
        id: i,
        char,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        floatDuration: `${Math.random() * 25 + 20}s`,
        floatDelay: `${Math.random() * -40}s`,
        driftX: `${(Math.random() - 0.5) * 30}px`,
        driftY: `${(Math.random() - 0.5) * 20}px`,
        baseOpacity: Math.random() * 0.25 + 0.08,
      };
    });
  }, [count]);

  return (
    <div className="particles">
      {particles.map((p) => (
        <span
          key={p.id}
          className="star-particle"
          style={{
            left: p.left,
            top: p.top,
            fontSize: "0.5rem",
            "--drift-x": p.driftX,
            "--drift-y": p.driftY,
            "--float-duration": p.floatDuration,
            "--float-delay": p.floatDelay,
            "--base-opacity": p.baseOpacity,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
