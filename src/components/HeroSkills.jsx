import { useCallback, useRef, useState, useEffect } from "react";

const skills = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python",
  "SQL", "Docker", "HTML", "CSS", "Tailwind", "Git", "Linux",
];

const skillDescriptions = {
  React: "Biblioteca JavaScript para construção de interfaces dinâmicas, reativas e orientadas a componentes.",
  JavaScript: "Linguagem de programação essencial para a web, permitindo dinamismo, interatividade e comportamento do lado do cliente.",
  TypeScript: "Superset do JavaScript que adiciona tipagem estática, trazendo muito mais segurança, autocompletes inteligentes e manutenibilidade.",
  "Node.js": "Ambiente de execução JavaScript server-side rápido e escalável, baseado no motor V8 do Chrome e arquitetura não-bloqueante.",
  Python: "Linguagem versátil usada para scripting, automação, backend robusto e inteligência artificial, conhecida pela legibilidade.",
  SQL: "Linguagem padrão para gerenciamento de bancos de dados relacionais, essencial para consultas eficientes, modelagem e integridade de dados.",
  Docker: "Plataforma de containerização que simplifica o empacotamento e a execução de aplicações em ambientes isolados.",
  HTML: "Linguagem de marcação padrão para criar a estrutura fundamental das páginas web modernas.",
  CSS: "Linguagem de estilização para definir o design visual, layouts e transições de páginas web.",
  Tailwind: "Framework CSS utilitário para estilização rápida e moderna direto no HTML, permitindo construir layouts sob medida.",
  Git: "Sistema de controle de versão distribuído para rastrear alterações no código-fonte e colaborar no desenvolvimento.",
  Linux: "Sistema operacional de código aberto amplamente utilizado em servidores e ambientes de desenvolvimento.",
};


function buildItems() {
  return skills.map((skill, i) => {
    const angle = (i / skills.length) * Math.PI * 2;
    const radius = 34 + Math.random() * 11;
    return {
      id: i,
      label: skill,
      baseX: 50 + Math.cos(angle) * radius,
      baseY: 50 + Math.sin(angle) * radius,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      floatSpeedX: 0.0001 + Math.random() * 0.0002,
      floatSpeedY: 0.0001 + Math.random() * 0.0002,
      floatAmpX: 2.5 + Math.random() * 3,
      floatAmpY: 2.5 + Math.random() * 3,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
    };
  });
}

export default function HeroSkills() {
  const [items] = useState(buildItems);
  const dataRef = useRef(items.map((p) => ({ ...p })));
  const tagRefs = useRef({});
  const lineRefs = useRef({});
  const connectionPathRef = useRef(null);
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const winDragRef = useRef(null);
  const rafRef = useRef(null);

  const [activeId, setActiveId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [winPos, setWinPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!selectedSkill) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSkill]);

  // Constant loop for float / space drift and lines tracking
  useEffect(() => {
    let active = true;
    function run() {
      if (!active) return;
      animate();
      rafRef.current = requestAnimationFrame(run);
    }
    rafRef.current = requestAnimationFrame(run);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [selectedSkillId, winPos]);

  const handlePointerDown = useCallback((e, id) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = dataRef.current.find((p) => p.id === id);
    if (p) {
      p.vx = 0;
      p.vy = 0;
    }
    dragRef.current = { id, prevX: e.clientX, prevY: e.clientY, hasMoved: false, released: false };
    setActiveId(id);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const dr = dragRef.current;
    if (!dr || dr.released) return;

    const dx = e.clientX - dr.prevX;
    const dy = e.clientY - dr.prevY;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dr.hasMoved = true;
    }

    if (dr.hasMoved) {
      const p = dataRef.current.find((p) => p.id === dr.id);
      if (p) {
        const scaleFactor = 80 / (window.innerWidth || 1000);
        const ax = dx * scaleFactor;
        const ay = dy * scaleFactor;
        p.vx += ax * 0.45;
        p.vy += ay * 0.45;
      }
    }

    dr.prevX = e.clientX;
    dr.prevY = e.clientY;
  }, []);

  const handlePointerUp = useCallback(() => {
    const dr = dragRef.current;
    if (!dr) return;
    dr.released = true;
    const { hasMoved, id } = dr;

    if (!hasMoved) {
      const item = items.find((p) => p.id === id);
      if (item) {
        const p = dataRef.current.find((d) => d.id === id);
        if (p) {
          // Calculate opening position next to the clicked skill, clamped inside bounds
          const initX = Math.min(80, Math.max(20, p.x + 16));
          const initY = Math.min(80, Math.max(20, p.y - 10));
          setWinPos({ x: initX, y: initY });
          setSelectedSkillId(id);
          setSelectedSkill(item);
        }
      }
      const p = dataRef.current.find((p) => p.id === id);
      if (p) {
        p.vx = 0;
        p.vy = 0;
      }
    }

    dragRef.current = null;
    setActiveId(null);
  }, [items]);

  const handleClose = useCallback((e) => {
    if (e) e.stopPropagation();
    setSelectedSkill(null);
    setSelectedSkillId(null);
  }, []);

  const handleWinHeaderDown = (e) => {
    if (e.target.closest(".dot-red")) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    winDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: winPos.x,
      oy: winPos.y
    };
  };

  const handleWinHeaderMove = (e) => {
    if (!winDragRef.current) return;
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - winDragRef.current.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - winDragRef.current.startY) / rect.height) * 100;
    setWinPos({
      x: Math.max(5, Math.min(95, winDragRef.current.ox + dxPct)),
      y: Math.max(5, Math.min(95, winDragRef.current.oy + dyPct))
    });
  };

  const handleWinHeaderUp = (e) => {
    e.stopPropagation();
    winDragRef.current = null;
  };

  function animate() {
    const time = performance.now();

    for (const p of dataRef.current) {
      const isDragging = activeId === p.id;
      const isSelected = selectedSkillId === p.id;

      if (isDragging) {
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x = Math.min(96, Math.max(4, p.x + p.vx));
        p.y = Math.min(96, Math.max(4, p.y + p.vy));
        p.baseX = p.x;
        p.baseY = p.y;
      } else if (isSelected) {
        // Freeze! No drifting or drifting offsets for the active skill
        p.vx = 0;
        p.vy = 0;
      } else {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.baseX = Math.min(96, Math.max(4, p.baseX + p.vx));
        p.baseY = Math.min(96, Math.max(4, p.baseY + p.vy));

        const offsetX = Math.sin(time * p.floatSpeedX + p.phaseX) * p.floatAmpX;
        const offsetY = Math.cos(time * p.floatSpeedY + p.phaseY) * p.floatAmpY;

        p.x = Math.min(97, Math.max(3, p.baseX + offsetX));
        p.y = Math.min(97, Math.max(3, p.baseY + offsetY));
      }

      // Update positions direct in DOM for max performance
      const el = tagRefs.current[p.id];
      if (el) {
        el.style.left = `${p.x}%`;
        el.style.top = `${p.y}%`;
      }
      const line = lineRefs.current[p.id];
      if (line) {
        line.setAttribute("x2", String(p.x));
        line.setAttribute("y2", String(p.y));
      }
    }

    // Direct DOM update of the bending dynamic line
    if (selectedSkillId !== null && connectionPathRef.current) {
      const p = dataRef.current.find((d) => d.id === selectedSkillId);
      if (p) {
        const mx = (p.x + winPos.x) / 2;
        const my = (p.y + winPos.y) / 2 - 10;
        connectionPathRef.current.setAttribute("d", `M ${p.x} ${p.y} Q ${mx} ${my} ${winPos.x} ${winPos.y}`);
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="hero-skills"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg className="hero-skills-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {items.map((p) => (
          <line
            key={p.id}
            ref={(el) => { if (el) lineRefs.current[p.id] = el; }}
            x1="50" y1="50"
            x2={p.x} y2={p.y}
            stroke="var(--border-light)"
            strokeWidth="0.18"
            opacity="0.38"
          />
        ))}

        {selectedSkillId !== null && (() => {
          const p = dataRef.current.find((d) => d.id === selectedSkillId);
          if (!p) return null;
          const mx = (p.x + winPos.x) / 2;
          const my = (p.y + winPos.y) / 2 - 10;
          return (
            <path
              ref={connectionPathRef}
              d={`M ${p.x} ${p.y} Q ${mx} ${my} ${winPos.x} ${winPos.y}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.25"
              strokeDasharray="1, 1"
              opacity="0.85"
            />
          );
        })()}
      </svg>

      {items.map((p) => {
        const isDragging = activeId === p.id;
        return (
          <span
            key={p.id}
            ref={(el) => { if (el) tagRefs.current[p.id] = el; }}
            className="hero-skill-tag"
            style={{
              transform: isDragging ? "translate(-50%, -50%) scale(1.08)" : "translate(-50%, -50%)",
              zIndex: isDragging ? 50 : 1,
              opacity: isDragging ? 1 : undefined,
              color: isDragging ? "#ffffff" : undefined,
              textShadow: isDragging ? "0 0 8px rgba(255, 255, 255, 0.4)" : undefined,
            }}
            onPointerDown={(e) => handlePointerDown(e, p.id)}
          >
            {p.label}
          </span>
        );
      })}

      {selectedSkill && (
        <div
          key={selectedSkill.id}
          className="skill-floating-window"
          style={{
            left: `${winPos.x}%`,
            top: `${winPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="skill-floating-header"
            onPointerDown={handleWinHeaderDown}
            onPointerMove={handleWinHeaderMove}
            onPointerUp={handleWinHeaderUp}
          >
            <span
              className="skill-floating-dot dot-red"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleClose(e);
              }}
            />
            <span className="skill-floating-dot dot-yellow" />
            <span className="skill-floating-dot dot-green" />
            <span className="skill-floating-title">{selectedSkill.label.toLowerCase()}.info</span>
          </div>
          <div className="skill-floating-body">
            <h3>{selectedSkill.label}</h3>
            <p>{skillDescriptions[selectedSkill.label] || "Informações detalhadas sobre a tecnologia."}</p>
            <div className="skill-floating-meta">
              <span>Vortek OS v1.0.0</span>
              <span>status: loaded</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
