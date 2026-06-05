import { useState, useEffect } from "react";

const lines = [
  { label: "status", value: "building portfolio" },
  { label: "stack", value: "React · Three.js · Node" },
  { label: "focus", value: "fullstack dev" },
  { label: "projects", value: "6 active" },
  { label: "learning", value: "Docker · SQL" },
  { label: "os", value: "Linux / Debian" },
];

export default function Status() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible((v) => (v < lines.length ? v + 1 : v));
    }, 300);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="status-panel">
      <div className="status-header">
        <span className="status-title">status</span>
      </div>
      <div className="status-body">
        {lines.slice(0, visible).map((line, i) => (
          <div key={i} className="status-line">
            <span className="status-key">{line.label}</span>
            <span className="status-sep">:</span>
            <span className="status-val">{line.value}</span>
          </div>
        ))}
        {visible <= lines.length && (
          <span className="status-cursor" />
        )}
      </div>
    </div>
  );
}
