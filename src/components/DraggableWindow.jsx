import { useRef, useCallback, useEffect } from "react";

const DEFAULT_LIMITS = { minX: -800, maxX: 800, minY: -600, maxY: 600 };

export default function DraggableWindow({ children, className, style, position, onPositionChange, limits, hint = "↕ arraste para mover" }) {
  const elRef = useRef(null);
  const dragRef = useRef(null);
  const posRef = useRef({ x: position?.x || 0, y: position?.y || 0 });
  const targetRef = useRef({ x: position?.x || 0, y: position?.y || 0 });
  const rafRef = useRef(null);
  const LIMITS = limits || DEFAULT_LIMITS;

  const animate = useCallback(() => {
    const p = posRef.current;
    const t = targetRef.current;
    const dx = (t.x - p.x) * 0.1;
    const dy = (t.y - p.y) * 0.1;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      p.x = t.x;
      p.y = t.y;
      rafRef.current = null;
      return;
    }
    p.x += dx;
    p.y += dy;
    const el = elRef.current;
    if (el) {
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (position) {
      targetRef.current = { x: position.x, y: position.y };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }
  }, [position, animate]);

  const handlePointerDown = useCallback((e) => {
    if (!elRef.current) return;
    elRef.current.setPointerCapture(e.pointerId);
    const p = posRef.current;
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: p.x, oy: p.y };
    targetRef.current = { x: p.x, y: p.y };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) * 0.25;
    const dy = (e.clientY - dragRef.current.startY) * 0.25;
    const nx = Math.max(LIMITS.minX, Math.min(LIMITS.maxX, dragRef.current.ox + dx));
    const ny = Math.max(LIMITS.minY, Math.min(LIMITS.maxY, dragRef.current.oy + dy));
    targetRef.current = { x: nx, y: ny };
    if (onPositionChange) onPositionChange({ x: nx, y: ny });
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate, onPositionChange, LIMITS]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div
      ref={elRef}
      className={className}
      style={{ ...style, cursor: "grab", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="drag-hint">{hint}</div>
      {children}
    </div>
  );
}
