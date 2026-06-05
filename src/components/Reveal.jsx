import useScrollReveal from "../hooks/useScrollReveal";

export default function Reveal({ children, className = "", style = {}, once = true, threshold = 0.1 }) {
  const [ref, isVisible] = useScrollReveal({ once, threshold });

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
