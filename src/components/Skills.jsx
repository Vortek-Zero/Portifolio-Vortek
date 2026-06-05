import { useState, useEffect, useRef, useCallback } from "react";
import Reveal from "./Reveal";

const specDetails = [
  { key: "Modo", val: "Freelancer Web Developer", isActive: true },
  { key: "Stack Principal", val: "React · Node · TS · Python" },
  { key: "Especialidade", val: "Aplicações Web Fullstack" },
  { key: "Infraestrutura", val: "Docker · Linux · Git" },
  { key: "Banco de Dados", val: "SQL · PostgreSQL" },
  { key: "Disponibilidade", val: "Aberto para projetos", isActive: true },
];

const statBoxes = [
  { label: "Foco Atual", num: "Web" },
  { label: "Projetos Entregues", num: "4+" },
  { label: "Tempo de Resposta", num: "<24h" },
  { label: "Satisfação", num: "100%" },
];

const services = [
  { name: "Landing Pages", desc: "Sites institucionais modernos com foco em conversão" },
  { name: "Web Apps", desc: "Aplicações completas React + Node/Python" },
  { name: "APIs & Backend", desc: "APIs RESTful, autenticação, integrações" },
  { name: "Dashboards", desc: "Painéis com gráficos em tempo real" },
];

const initialLogs = [
  "Freelancer mode: ACTIVATED",
  "React engine: READY | Next.js: STANDBY",
  "Node.js runtime connected — port 3000",
  "TypeScript compiler: strict mode ON",
  "PostgreSQL cluster: ONLINE [3 databases active]",
  "[AVISO] Todas as janelas do site podem ser arrastadas!",
  "Freelance pipeline: scanning for new projects...",
  "System health: OPTIMAL",
];

const mockLogs = [
  "Deploying latest build to production... SUCCESS",
  "API response time avg: 47ms — within SLA",
  "Running automated test suite: 142/142 passed ✓",
  "Git push: 3 commits merged to main branch",
  "Database migration completed — 0 errors",
  "Performance audit: Lighthouse score 98/100",
  "Docker container health check: ALL HEALTHY",
  "Client project milestone delivered ahead of schedule",
  "CDN cache purged — assets refreshed globally",
  "SSL certificate renewal: valid until 2027",
  "New lead detected: analyzing requirements...",
  "Optimization: tree-shaking removed 124kb of dead code",
  "Security scan: 0 vulnerabilities found",
  "Backup: system snapshot created successfully",
  "Latency check: 12ms to nearest edge node",
];

const workflowNodes = [
  { id: "client",   label: "Demand", x: 20, y: 20 },
  { id: "design",   label: "Design", x: 50, y: 20 },
  { id: "frontend", label: "Frontend", x: 80, y: 20 },
  { id: "api",      label: "API Gateway", x: 50, y: 50 },
  { id: "backend",  label: "Backend", x: 80, y: 50 },
  { id: "db",       label: "Database", x: 20, y: 50 },
  { id: "deploy",   label: "Cloud", x: 50, y: 80 },
];

const workflowEdges = [
  ["client", "design"],
  ["design", "frontend"],
  ["frontend", "api"],
  ["api", "backend"],
  ["backend", "db"],
  ["db", "deploy"],
  ["api", "deploy"],
];

/* ── Drag hook: optimized movement ── */
function useDrag(initialPos = { x: 0, y: 0 }) {
  const elRef = useRef(null);
  const dragRef = useRef(null);
  const posRef = useRef({ ...initialPos });
  const requestRef = useRef(null);

  const applyTransform = useCallback((x, y) => {
    if (elRef.current) {
      elRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const moveTo = useCallback((newPos) => {
    posRef.current = { x: newPos.x, y: newPos.y };
    applyTransform(newPos.x, newPos.y);
  }, [applyTransform]);

  useEffect(() => {
    moveTo(initialPos);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlers = {
    onPointerDown: (e) => {
      if (!elRef.current) return;
      elRef.current.setPointerCapture(e.pointerId);
      const p = posRef.current;
      dragRef.current = { startX: e.clientX, startY: e.clientY, ox: p.x, oy: p.y };
    },
    onPointerMove: (e) => {
      if (!dragRef.current) return;
      
      const update = () => {
        if (!dragRef.current) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        moveTo({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy });
        requestRef.current = null;
      };

      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(update);
      }
    },
    onPointerUp: () => { 
      dragRef.current = null;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    },
  };

  return { elRef, handlers };
}

export default function Skills() {
  const [logs, setLogs] = useState(initialLogs);
  const [activeNode, setActiveNode] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const consoleBodyRef = useRef(null);

  const dash = useDrag({ x: -100, y: 68 });
  const term = useDrag({ x: 540, y: 15 });
  const arch = useDrag({ x: 500, y: 285 });

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setLogs((prev) => [...prev, `[${timeStr}] ${randomMsg}`].slice(-20));
      
      // Randomly flicker live status
      if (Math.random() > 0.95) {
        setIsLive(false);
        setTimeout(() => setIsLive(true), 200);
      }
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setActiveNode(workflowNodes[i % workflowNodes.length].id);
      i++;
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const nodeMap = Object.fromEntries(workflowNodes.map((n) => [n.id, n]));

  return (
    <section id="skills" className="skills">
      <Reveal>
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: "32px" }}>
          status & telemetria
        </h2>

        <div className="skills-workspace">
          {/* Dashboard */}

          <div ref={dash.elRef} className="status-dashboard-window workspace-window" {...dash.handlers} style={{ cursor: "grab", touchAction: "none" }}>
            <div className="drag-hint">↕ arraste para mover</div>
            <div className="status-dashboard-header">
              <span className="status-dashboard-dot dot-red" />
              <span className="status-dashboard-dot dot-yellow" />
              <span className="status-dashboard-dot dot-green" />
              <span className="status-dashboard-title">freelancer_dashboard.sh</span>
            </div>
            <div className="status-dashboard-body-horizontal">
              <div className="stats-card-grid-horizontal">
                {statBoxes.map((stat, i) => (
                  <div key={i} className="stats-card-item">
                    <div className="stats-card-number">{stat.num}</div>
                    <div className="stats-card-label">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="dashboard-horizontal-panels">
                <div className="specs-panel">
                  <div className="specs-title">Serviços</div>
                  {services.map((svc, i) => (
                    <div key={i} className="service-item">
                      <span className="service-name">{svc.name}</span>
                      <span className="service-desc">{svc.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="specs-panel">
                  <div className="specs-title">System Specs</div>
                  {specDetails.map((spec, i) => (
                    <div key={i} className="spec-line">
                      <span className="spec-key">{spec.key.toLowerCase()}</span>
                      <span className={`spec-val ${spec.isActive ? "active-status" : ""}`}>
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div ref={term.elRef} className="terminal-window-standalone workspace-window terminal-compact" {...term.handlers} style={{ cursor: "grab", touchAction: "none" }}>
            <div className="drag-hint">↕ arraste para mover</div>
            <div className="status-dashboard-header">
              <span className="status-dashboard-dot dot-red" />
              <span className="status-dashboard-dot dot-yellow" />
              <span className="status-dashboard-dot dot-green" />
              <span className="status-dashboard-title">live_console.sh</span>
            </div>
            <div className="terminal-console-header">
              <span>Vortek Console v1.0</span>
              <span style={{ color: isLive ? "#27c93f" : "#ff5f56", transition: 'color 0.2s' }}>
                {isLive ? "● streaming" : "○ connecting..."}
              </span>
            </div>
            <div ref={consoleBodyRef} className="terminal-console-body">
              <div className="terminal-console-notice">
                <span className="notice-icon">ℹ️</span>
                <span>DICA: Todas as janelas virtuais deste site (Dashboard, Console, Arquitetura, Sobre) são interativas e podem ser arrastadas pelo cabeçalho.</span>
              </div>
              {logs.map((log, i) => (
                <div key={i} className="terminal-log-line">
                  <span style={{ color: "var(--text-dim)", marginRight: "8px" }}>$</span>
                  {log}
                </div>
              ))}
            </div>
          </div>


          {/* Architecture */}
          <div ref={arch.elRef} className="arch-window workspace-window" {...arch.handlers} style={{ cursor: "grab", touchAction: "none" }}>
            <div className="drag-hint">↕ arraste para mover</div>
            <div className="status-dashboard-header">
              <span className="status-dashboard-dot dot-red" />
              <span className="status-dashboard-dot dot-yellow" />
              <span className="status-dashboard-dot dot-green" />
              <span className="status-dashboard-title">workflow_arch.svg</span>
            </div>
            <div className="arch-body">
              <svg viewBox="0 0 100 95" className="arch-svg">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {workflowEdges.map(([fromId, toId], i) => {
                  const from = nodeMap[fromId];
                  const to = nodeMap[toId];
                  const isActive = activeNode === fromId || activeNode === toId;
                  return (
                    <g key={i}>
                      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                        stroke={isActive ? "rgba(39, 201, 63, 0.6)" : "rgba(255,255,255,0.08)"}
                        strokeWidth={isActive ? "0.4" : "0.2"}
                        style={{ transition: "stroke 0.6s, stroke-width 0.6s" }}
                      />
                      {isActive && (
                        <circle r="0.6" fill="#27c93f" filter="url(#glow)">
                          <animateMotion dur="2s" repeatCount="indefinite"
                            path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`} />
                        </circle>
                      )}
                    </g>
                  );
                })}
                {workflowNodes.map((node) => {
                  const isActive = activeNode === node.id;
                  return (
                    <g key={node.id}>
                      <circle cx={node.x} cy={node.y} r={isActive ? "3.5" : "2.8"}
                        fill={isActive ? "rgba(39, 201, 63, 0.25)" : "rgba(255,255,255,0.04)"}
                        stroke={isActive ? "#27c93f" : "rgba(255,255,255,0.15)"}
                        strokeWidth="0.3" style={{ transition: "all 0.5s" }}
                      />
                      {isActive && (
                        <circle cx={node.x} cy={node.y} r="5.5" fill="none"
                          stroke="rgba(39, 201, 63, 0.2)" strokeWidth="0.15" className="arch-pulse"
                        />
                      )}
                      <text x={node.x} y={node.y + 6.5} textAnchor="middle"
                        fill={isActive ? "#ffffff" : "var(--text-muted)"}
                        fontSize="2.8" fontFamily="var(--font-mono)"
                        style={{ transition: "fill 0.5s" }}
                      >{node.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
