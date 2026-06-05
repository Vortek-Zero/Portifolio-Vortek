import useScrollReveal from "../hooks/useScrollReveal";

const stats = [
  { number: "3+", label: "Projetos" },
  { number: "5+", label: "Tecnologias" },
  { number: "100%", label: "Disponivel" },
  { number: "24h", label: "Resposta" },
];

function StatCard({ number, label }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div ref={ref} className={`stat-card ${visible ? "reveal-visible" : ""}`}>
      <div className="stat-number">{visible ? number : "0"}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="stats">
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
