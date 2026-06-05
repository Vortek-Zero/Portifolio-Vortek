import { useState, useEffect } from "react";
import Logo3D from "./Logo3D";
import HeroSkills from "./HeroSkills";

export default function Hero() {
  const terms = ["creative_coder", "problem_solver", "tech_innovator", "fullstack_dev"];
  const [termIndex, setTermIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullWord = terms[termIndex];

    const tick = () => {
      if (!isDeleting) {
        setCurrentText(fullWord.slice(0, currentText.length + 1));
        if (currentText === fullWord) {
          timer = setTimeout(() => setIsDeleting(true), 2200);
        } else {
          timer = setTimeout(tick, 100);
        }
      } else {
        setCurrentText(fullWord.slice(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setTermIndex((prev) => (prev + 1) % terms.length);
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };

    timer = setTimeout(tick, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, termIndex]);

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-logo-wrapper">
          <Logo3D />
          <HeroSkills />
        </div>

        <p className="hero-tagline">
          <span>Fullstack Developer</span>
        </p>

        <p className="hero-greeting">
          {"> "}
          <span className="typewriter-term">{currentText}</span>
          <span className="typewriter-cursor" />
        </p>

        <h1 className="hero-name">Vortek Zero</h1>

        <p className="hero-desc">
          Construo aplicações web modernas, escaláveis e com foco na experiência do usuário.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            ver projetos
          </a>
          <a href="#contact" className="btn btn-secondary">
            contato
          </a>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-indicator-text">role para explorar</span>
          <span className="scroll-indicator-chevron">⌄</span>
        </div>
      </div>
    </section>
  );
}
