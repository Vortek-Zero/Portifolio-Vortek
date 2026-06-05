const telemetryData = [
  "REACT", "JAVASCRIPT", "TYPESCRIPT", "NODE.JS", "PYTHON",
  "SQL", "POSTGRESQL", "DOCKER", "HTML5", "CSS3",
  "TAILWIND CSS", "GIT", "LINUX", "VITE", "FASTAPI",
  "N8N", "ARDUINO", "INTEGRATION", "AUTOMATION",
  "REACT", "JAVASCRIPT", "TYPESCRIPT", "NODE.JS", "PYTHON",
  "SQL", "POSTGRESQL", "DOCKER", "HTML5", "CSS3",
  "TAILWIND CSS", "GIT", "LINUX", "VITE", "FASTAPI",
  "N8N", "ARDUINO", "INTEGRATION", "AUTOMATION"
];

export default function TechMarquee() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        <div className="marquee-content">
          {telemetryData.map((item, i) => (
            <span key={i} className="marquee-item" style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem" }}>
              <span className="marquee-dot" style={{ color: "#27c93f", textShadow: "0 0 6px #27c93f" }}>◆</span>
              {item}
            </span>
          ))}
        </div>
        <div className="marquee-content">
          {telemetryData.map((item, i) => (
            <span key={`dup-${i}`} className="marquee-item" style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem" }}>
              <span className="marquee-dot" style={{ color: "#27c93f", textShadow: "0 0 6px #27c93f" }}>◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
