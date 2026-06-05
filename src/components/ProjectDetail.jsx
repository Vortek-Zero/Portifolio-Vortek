import { useParams, Link } from "react-router-dom";
import { projects } from "../data/projects";
import * as LucideIcons from "lucide-react";
import PageTransition from "./PageTransition";

const Icon = ({ name, className, size = 24 }) => {
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const statusColors = {
  STABLE: "#27c93f",
  IN_PROCESS: "#ffbd2e",
  FINISHED: "#00d4ff",
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <PageTransition className="detail-not-found">
        <div className="not-found-content">
          <div className="not-found-code">ERROR 404</div>
          <h1 className="not-found-title">PROJETO_NAO_ENCONTRADO</h1>
          <p className="not-found-desc">O registro solicitado não existe no diretório atual.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 24 }}>
            <LucideIcons.ArrowLeft size={16} />
            VOLTAR_AO_SISTEMA
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="detail-page">
      <div className="detail-bg-pulse" />

      <div className="detail-container">
        <Link to="/" className="detail-back">
          <LucideIcons.ArrowLeft size={16} />
          VOLTAR
        </Link>

        <div className="detail-header">
          <div className="detail-icon-wrap">
            <span className="detail-icon"><Icon name={project.icon} size={32} /></span>
            <div className="detail-icon-ring" />
          </div>
          <div>
            <div className="detail-id">{project.id}</div>
            <h1 className="detail-title">{project.title}</h1>
          </div>
          <div className="detail-status" style={{ borderColor: statusColors[project.status], color: statusColors[project.status] }}>
            <span className="detail-status-dot" style={{ background: statusColors[project.status] }} />
            {project.status}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-main">
            <div className="detail-window">
              <div className="detail-window-header">
                <span className="detail-window-dot" style={{ background: "#ff5f56" }} />
                <span className="detail-window-dot" style={{ background: "#ffbd2e" }} />
                <span className="detail-window-dot" style={{ background: "#27c93f" }} />
                <span className="detail-window-title">README.md</span>
              </div>
              <div className="detail-window-body">
                <div className="detail-section-label">{'>'} Sobre o Projeto</div>
                <p className="detail-text">{project.longDesc}</p>

                <div className="detail-divider" />

                <div className="detail-section-label">{'>'} Funcionalidades</div>
                <ul className="detail-features">
                  {project.features.map((f, i) => (
                    <li key={i} className="detail-feature-item">
                      <span className="detail-feature-bullet">▹</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {project.secret && project.secret.type === "images" && (
                  <>
                    <div className="detail-divider" />
                    <div className="detail-section-label">{'>'} Imagens do Projeto</div>
                    <div className="detail-screenshots-grid">
                      {project.secret.files.map((file, i) => (
                        <div key={i} className="detail-screenshot-wrapper">
                          <img 
                            src={`${project.secret.folder}/${file.name}`} 
                            alt={`Screenshot ${i + 1}`} 
                            className="detail-screenshot-img" 
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <div className="detail-window">
              <div className="detail-window-header">
                <span className="detail-window-dot" style={{ background: "#ff5f56" }} />
                <span className="detail-window-dot" style={{ background: "#ffbd2e" }} />
                <span className="detail-window-dot" style={{ background: "#27c93f" }} />
                <span className="detail-window-title">STACK</span>
              </div>
              <div className="detail-window-body">
                <div className="detail-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="detail-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-actions" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <LucideIcons.ArrowLeft size={16} />
                VOLTAR
              </Link>
              {project.externalUrl && (
                <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                  <LucideIcons.ExternalLink size={16} style={{ marginRight: "8px" }} />
                  VISITAR PROJETO
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="detail-footer-log">
          <span className="detail-log-dot" />
          <span>SYSTEM_READY</span>
          <span className="detail-log-sep">|</span>
          <span>PAGE: {project.slug}</span>
          <span className="detail-log-sep">|</span>
          <span>STATUS: {project.status}</span>
        </div>
      </div>
    </PageTransition>
  );
}
