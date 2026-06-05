import { useState, useEffect } from "react";

export default function Header() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    const sections = ["hero", "about", "skills", "projects", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => scrollTo("hero")} style={{ cursor: "pointer" }} aria-label="Voltar ao início">
          <span className="logo-name">Vortek</span>
          <span className="logo-dot" />
        </div>
        <nav>
          <button className={activeSection === "hero" ? "active" : ""} onClick={() => scrollTo("hero")} aria-label="Ir para início">início</button>
          <button className={activeSection === "about" ? "active" : ""} onClick={() => scrollTo("about")} aria-label="Ir para sobre">sobre</button>
          <button className={activeSection === "skills" ? "active" : ""} onClick={() => scrollTo("skills")} aria-label="Ir para habilidades">habilidades</button>
          <button className={activeSection === "projects" ? "active" : ""} onClick={() => scrollTo("projects")} aria-label="Ir para projetos">projetos</button>
          <button className={activeSection === "contact" ? "active" : ""} onClick={() => scrollTo("contact")} aria-label="Ir para contato">contato</button>
        </nav>
      </div>
    </header>
  );
}
