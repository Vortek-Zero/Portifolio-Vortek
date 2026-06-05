import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { useEffect } from "react";
import PageTransition from "./PageTransition";

export default function AboutPage() {
  // Rolar para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition className="detail-page about-page">
      <div className="detail-bg-pulse" />

      <div className="detail-container">
        <Link to="/" className="detail-back">
          <LucideIcons.ArrowLeft size={16} />
          VOLTAR AO SISTEMA
        </Link>

        <div className="detail-header" style={{ marginBottom: "40px" }}>
          <div className="detail-icon-wrap">
            <span className="detail-icon"><LucideIcons.User size={32} /></span>
            <div className="detail-icon-ring" />
          </div>
          <div>
            <div className="detail-id">IDENT_0x4F8A</div>
            <h1 className="detail-title">Sobre Miguel Pereira Rocha (Vortek Zero)</h1>
          </div>
          <div className="detail-status" style={{ borderColor: "#27c93f", color: "#27c93f" }}>
            <span className="detail-status-dot" style={{ background: "#27c93f" }} />
            DEVELOPER_ACTIVE
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-main">
            {/* Janela 1: Biografia */}
            <div className="detail-window" style={{ marginBottom: "30px" }}>
              <div className="detail-window-header">
                <span className="detail-window-dot" style={{ background: "#ff5f56" }} />
                <span className="detail-window-dot" style={{ background: "#ffbd2e" }} />
                <span className="detail-window-dot" style={{ background: "#27c93f" }} />
                <span className="detail-window-title">BIOGRAFIA.md</span>
              </div>
              <div className="detail-window-body">
                <div className="detail-section-label">{'>'} A Jornada Técnica</div>
                
                <p className="detail-text" style={{ marginBottom: "16px" }}>
                  Minha história com a tecnologia começou há cerca de 4 anos. Durante esse período, estudei de forma prática, construindo projetos reais, resolvendo problemas de automação e explorando o desenvolvimento web e IoT.
                </p>

                <p className="detail-text" style={{ marginBottom: "16px" }}>
                  Inicialmente, eu não utilizava o GitHub como ferramenta central de versionamento, pois realizava experimentos e estudos focados estritamente na prática local. Por conta disso, acabei perdendo o código-fonte de diversos projetos de aprendizado quando fiz transições de sistemas e formatações de hardware.
                </p>

                <p className="detail-text" style={{ marginBottom: "16px" }}>
                  Essa experiência, embora difícil, me ensinou uma das lições mais importantes de um desenvolvedor profissional: a importância crítica do controle de versão, da redundância de backup e do uso contínuo do Git. 
                </p>

                <p className="detail-text">
                  Hoje, com 14 anos e uma mentalidade voltada para boas práticas e consistência, atuo de forma profissional como <strong>Miguel Pereira Rocha</strong> (sob o alias Vortek Zero). Meus projetos atuais (como a inteligência artificial Luna e este portfólio interativo) estão completamente versionados, documentados e hospedados no GitHub, representando a consolidação da minha evolução técnica.
                </p>
              </div>
            </div>

            {/* Janela 2: Filosofia de Trabalho */}
            <div className="detail-window">
              <div className="detail-window-header">
                <span className="detail-window-dot" style={{ background: "#ff5f56" }} />
                <span className="detail-window-dot" style={{ background: "#ffbd2e" }} />
                <span className="detail-window-dot" style={{ background: "#27c93f" }} />
                <span className="detail-window-title">FILOSOFIA.md</span>
              </div>
              <div className="detail-window-body">
                <div className="detail-section-label">{'>'} Princípios de Desenvolvimento</div>
                
                <ul className="detail-features" style={{ margin: 0 }}>
                  <li className="detail-feature-item">
                    <span className="detail-feature-bullet">▹</span>
                    <strong>Estrutura e Versionamento:</strong> Código sem controle de versão não existe. Cada mudança deve ser documentada, estruturada e limpa.
                  </li>
                  <li className="detail-feature-item">
                    <span className="detail-feature-bullet">▹</span>
                    <strong>Design & Experiência:</strong> A estética e a usabilidade não são secundárias. Um bom software deve parecer premium e ser intuitivo.
                  </li>
                  <li className="detail-feature-item">
                    <span className="detail-feature-bullet">▹</span>
                    <strong>Autonomia e Resolução:</strong> Entender o problema de ponta a ponta, seja na integração de APIs inteligentes (Gemini/Qwen) ou na comunicação com microcontroladores físicos (Arduino).
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            {/* Janela 3: Timeline */}
            <div className="detail-window" style={{ marginBottom: "30px" }}>
              <div className="detail-window-header">
                <span className="detail-window-dot" style={{ background: "#ff5f56" }} />
                <span className="detail-window-dot" style={{ background: "#ffbd2e" }} />
                <span className="detail-window-dot" style={{ background: "#27c93f" }} />
                <span className="detail-window-title">TIMELINE.md</span>
              </div>
              <div className="detail-window-body">
                <div className="detail-section-label">{'>'} Linha do Tempo</div>
                
                <div className="about-timeline">
                  <div className="about-timeline-item">
                    <div className="about-timeline-year">2022</div>
                    <div className="about-timeline-desc">
                      Estudos iniciais de lógica de programação e scripts utilitários em Python.
                    </div>
                  </div>

                  <div className="about-timeline-item">
                    <div className="about-timeline-year">2023</div>
                    <div className="about-timeline-desc">
                      Primeiros contatos com front-end (HTML/CSS) e IoT, programando microcontroladores Arduino em C++ (ex: Luzes com Palmas).
                    </div>
                  </div>

                  <div className="about-timeline-item">
                    <div className="about-timeline-year">2024</div>
                    <div className="about-timeline-desc">
                      Transição para desenvolvimento fullstack, aprofundando em React, Node.js e bancos de dados relacionais.
                    </div>
                  </div>

                  <div className="about-timeline-item">
                    <div className="about-timeline-year">2025</div>
                    <div className="about-timeline-desc">
                      Desenvolvimento de agentes de IA (Luna AI Agent), navegação em terminal (TermBrowse TUI), automações com n8n, adoção de Docker e versionamento Git/GitHub integral.
                    </div>
                  </div>

                  <div className="about-timeline-item">
                    <div className="about-timeline-year">2026</div>
                    <div className="about-timeline-desc">
                      Consolidação profissional como freelancer fullstack e atuação com foco em interfaces imersivas e integrações robustas.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <Link to="/" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <LucideIcons.ArrowLeft size={16} />
                VOLTAR AO INÍCIO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
