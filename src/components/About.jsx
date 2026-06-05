import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

const LIMITS = { minX: -600, maxX: 600, minY: -400, maxY: 400 };

export default function About() {
  const elRef = useRef(null);
  const dragRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

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
    boxRafRef();
  }, []);

  const boxRafRef = () => {
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (!elRef.current) return;
    elRef.current.setPointerCapture(e.pointerId);
    const p = posRef.current;
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: p.x, oy: p.y };
    targetRef.current = { x: p.x, y: p.y };
    elRef.current.style.zIndex = "999";
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) * 0.25;
    const dy = (e.clientY - dragRef.current.startY) * 0.25;
    targetRef.current = {
      x: Math.max(LIMITS.minX, Math.min(LIMITS.maxX, dragRef.current.ox + dx)),
      y: Math.max(LIMITS.minY, Math.min(LIMITS.maxY, dragRef.current.oy + dy)),
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    if (elRef.current) elRef.current.style.zIndex = "";
  }, []);

  return (
    <section id="about" className="about">
      <Reveal>
        <div
          ref={elRef}
          className="about-window glow-target"
        >
          <div 
            className="about-window-header"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ cursor: "grab" }}
          >
            <span className="about-window-dot dot-red" />
            <span className="about-window-dot dot-yellow" />
            <span className="about-window-dot dot-green" />
            <span className="about-window-title">about.sh</span>
          </div>
          <div className="about-window-body">
            <div className="about-prompt">
              <span className="about-prompt-user">vortek</span>
              <span className="about-prompt-path">~/about</span>
              <span className="about-prompt-symbol">$</span>
            </div>

            <h2 className="section-title">cat sobre.md</h2>

            <div className="about-content">
              <div className="about-text">
                <p>
                  <span className="highlight">$</span> Desenvolvedor fullstack
                  focado em construir aplicações web modernas e escaláveis.
                  Trabalho com React, Node.js, Python e TypeScript para criar
                  soluções completas — do protótipo ao deploy.
                </p>
                <p>
                  <span className="highlight">$</span> Meu processo combina
                  arquitetura limpa com experiência de usuário refinada. Cada
                  projeto é tratado como um sistema: planejamento, execução,
                  iteração. Acredito que bom software nasce da disciplina
                  técnica e da atenção aos detalhes.
                </p>
                <p>
                  <span className="highlight">$</span> Atualmente disponível
                  para freelances e colaborações em projetos web fullstack.
                </p>
                <div style={{ marginTop: "24px" }}>
                  <Link to="/about" className="btn btn-secondary about-more-btn">
                    {">"} executar mais_sobre_mim.sh
                  </Link>
                </div>
              </div>
              <div className="about-info">
                <div className="info-item">
                  <span className="info-label">location</span>
                  <span>Brasil</span>
                </div>
                <div className="info-item">
                  <span className="info-label">age</span>
                  <span>14 anos</span>
                </div>
                <div className="info-item">
                  <span className="info-label">role</span>
                  <span>Fullstack Developer</span>
                </div>
                <div className="info-item">
                  <span className="info-label">stack</span>
                  <span>React · Node · Python</span>
                </div>
                <div className="info-item">
                  <span className="info-label">status</span>
                  <span>Disponível</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
