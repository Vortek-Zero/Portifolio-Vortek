import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { projects } from "../data/projects";
import * as LucideIcons from "lucide-react";

const Icon = ({ name, className }) => {
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} /> : null;
};

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const getSlideClass = (index) => {
    if (index === activeIndex) return "active";
    if (index === (activeIndex - 1 + projects.length) % projects.length) return "prev";
    return "next";
  };

  return (
    <section id="projects" className="projects">
      <Reveal>
        <h2 className="section-title">projetos_deploy.log</h2>

        <div className="projects-split-layout">
          {/* Left Column: Personal Projects (Carousel) */}
          <div className="projects-personal-section">
            <h3 className="projects-category-title">&gt; Projetos Pessoais</h3>
            <div className="projects-carousel-container">
          <button className="carousel-nav-btn prev-btn" onClick={prevSlide} aria-label="Anterior">
            <LucideIcons.ChevronLeft size={24} />
          </button>

          <div
            className="projects-carousel-viewport"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((project, index) => {
              const slideClass = getSlideClass(index);
              return (
                <div key={project.title} className={`project-slide-wrapper ${slideClass}`}>
                  <div className={`project-card-wrapper ${index === activeIndex ? 'active-slide' : 'inactive-slide'}`}>
                    <div className="project-card-secret">
                      <div className="secret-image-container">
                        {project.secret.type === "images" ? (
                          <>
                            {project.secret.files.length > 1 && (
                              <img
                                src={`${project.secret.folder}/${project.secret.files[0].name}`}
                                alt="Secret Left"
                                className={`secret-img img-left ${project.secret.files[0].isScreenshot ? 'is-screenshot' : ''}`}
                              />
                            )}
                            <img
                              src={`${project.secret.folder}/${project.secret.files[project.secret.files.length - 1].name}`}
                              alt="Secret Right"
                              className={`secret-img img-right ${project.secret.files[project.secret.files.length - 1].isScreenshot ? 'is-screenshot' : ''}`}
                            />
                            <img
                              src={project.secret.centerLogo || "/Logo.png"}
                              alt="Logo Center"
                              className="secret-img img-center"
                            />
                          </>
                        ) : (
                          <>
                            <Icon name={project.secret.left} className="secret-icon img-left" />
                            <Icon name={project.secret.right} className="secret-icon img-right" />
                            <Icon name={project.secret.extra} className="secret-icon img-center" />
                          </>
                        )}
                      </div>
                    </div>

                    <Link to={project.url} className="project-card vertical glow-target">
                      <CardContent project={project} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-nav-btn next-btn" onClick={nextSlide} aria-label="Próximo">
            <LucideIcons.ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-indicators">
          <span className="carousel-indicator-sys">PROJECT [0{activeIndex + 1}/0{projects.length}]</span>
            <div className="carousel-dots">
              {projects.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ir para projeto ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Client Projects Placeholder */}
        <div className="projects-client-section">
          <h3 className="projects-category-title">&gt; Projetos para Clientes</h3>
          <div className="client-projects-placeholder glow-target">
            <div className="placeholder-icon-wrap">
              <LucideIcons.Briefcase size={48} className="placeholder-icon" />
            </div>
            <p className="placeholder-text">
              Espaço reservado para projetos reais desenvolvidos sob demanda para clientes.
            </p>
            <div className="placeholder-status">
              <span className="status-dot blink"></span>
              Aguardando novos contratos...
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

function CardContent({ project }) {
  return (
    <>
      <div className="holo-overlay">
        <div className="holo-scanlines"></div>
        <div className="holo-corner holo-tl"></div>
        <div className="holo-corner holo-tr"></div>
        <div className="holo-corner holo-bl"></div>
        <div className="holo-corner holo-br"></div>
        <div className="holo-badge">{project.status}</div>
      </div>

      <div className="project-card-header">
        <span className="project-id">{project.id}</span>
        <span className="project-icon"><Icon name={project.icon} size={24} /></span>
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.desc}</p>

      <div className="project-tags">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

