import React from "react";
import Reveal from "./Reveal";

const testimonials = [
  {
    id: 1,
    client: "Grupo Acadêmico (Netlify)",
    role: "Trabalho de Conclusão",
    text: "Site muito bom, fácil, organizado e com as informações que precisava.",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <Reveal>
        <div className="about-window glow-target testimonials-window">
          <div className="about-window-header">
            <span className="about-window-dot dot-red" />
            <span className="about-window-dot dot-yellow" />
            <span className="about-window-dot dot-green" />
            <span className="about-window-title">DEPOIMENTOS.md</span>
          </div>
          <div className="about-window-body">
            <div className="about-prompt">
              <span className="about-prompt-user">vortek</span>
              <span className="about-prompt-path">~/reviews</span>
              <span className="about-prompt-symbol">$</span>
            </div>
            
            <h2 className="section-title">cat reviews.log</h2>
            
            <div className="testimonials-grid">
              {testimonials.map(t => (
                <div key={t.id} className="testimonial-card">
                  <div className="testimonial-rating">
                    {"★".repeat(t.rating)}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <span className="testimonial-client">&gt; {t.client}</span>
                    <span className="testimonial-role">[{t.role}]</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonial-footer-log" style={{ marginTop: "24px", color: "var(--text-dim)", fontSize: "0.8rem" }}>
              <span className="highlight">$</span> aguardando_novas_conexoes...
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
