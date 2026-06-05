import { useState, useRef, useEffect } from "react";
import Reveal from "./Reveal";

const PLACEHOLDERS = {
  name: ["NOME_COMPLETO", "SEU_NOME_AQUI", "IDENTIFICACAO"],
  email: ["EMAIL@DOMINIO.COM", "SEU_EMAIL", "SINAL_DESTINO"],
  message: ["DESCREVA_O_PROJETO...", "SUA_MENSAGEM", "PAYLOAD_DA_IDEIA"],
};

function useTypingPlaceholder(field, active) {
  const [text, setText] = useState(PLACEHOLDERS[field][0]);
  const [idx, setIdx] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (active) { setText(""); return; }
    let timer;
    const current = PLACEHOLDERS[field][idx];
    if (paused) {
      timer = setTimeout(() => setPaused(false), 2000);
      return () => clearTimeout(timer);
    }
    if (!deleting) {
      if (charPos < current.length) {
        timer = setTimeout(() => { setCharPos(p => p + 1); setText(current.slice(0, charPos + 1)); }, 60);
      } else {
        setPaused(true);
        setDeleting(true);
      }
    } else {
      if (charPos > 0) {
        timer = setTimeout(() => { setCharPos(p => p - 1); setText(current.slice(0, charPos - 1)); }, 30);
      } else {
        setDeleting(false);
        setIdx(i => (i + 1) % PLACEHOLDERS[field].length);
      }
    }
    return () => clearTimeout(timer);
  }, [field, idx, charPos, deleting, paused, active]);

  return active ? "" : text;
}

function ConnectionNodes({ progress }) {
  const nodes = [
    { label: "ID", pct: 33 },
    { label: "SINAL", pct: 66 },
    { label: "PAYLOAD", pct: 100 },
  ];
  return (
    <div className="conn-nodes">
      {nodes.map((n, i) => {
        const active = progress >= n.pct;
        return (
          <div key={n.label} className="conn-node-group">
            <div className={`conn-node ${active ? "active" : ""}`}>
              <span className="conn-label">{n.label}</span>
              <div className="conn-pulse" />
            </div>
            {i < nodes.length - 1 && (
              <div className={`conn-connector ${progress >= n.pct + 16 ? "active" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SignalBars({ active, progress }) {
  const bars = 8;
  return (
    <div className="signal-wrap">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="signal-bar"
          style={{
            height: `${4 + Math.sin((i / bars) * Math.PI) * 16}px`,
            animationDelay: `${i * 0.08}s`,
            opacity: active ? 0.6 + (i / bars) * 0.4 : 0.15,
            background: progress >= ((i + 1) / bars) * 100
              ? "var(--accent)" : "var(--text-dim)",
          }}
        />
      ))}
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [progress, setProgress] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [glitching, setGlitching] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [dataLines, setDataLines] = useState([]);

  const holdIntervalRef = useRef(null);
  const dataCountRef = useRef(0);
  const glitchTimerRef = useRef(null);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchIntensity(Math.random());
      setGlitching(true);
      const duration = 100 + Math.random() * 400;
      setTimeout(() => {
        setGlitching(false);
        setGlitchIntensity(0);
      }, duration);
      const next = 3000 + Math.random() * 8000;
      glitchTimerRef.current = setTimeout(triggerGlitch, next);
    };
    const timeout = setTimeout(triggerGlitch, 2000);
    return () => { clearTimeout(timeout); clearTimeout(glitchTimerRef.current); };
  }, []);

  useEffect(() => {
    const fields = Object.values(formData);
    const completed = fields.filter(v => v.length > 0).length;
    setProgress((completed / fields.length) * 100);
  }, [formData]);

  useEffect(() => {
    if (status !== "sending") return;
    const interval = setInterval(() => {
      dataCountRef.current += 1;
      const hex = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setDataLines(prev => [...prev.slice(-5), `0x${hex.toUpperCase()}`]);
    }, 120);
    return () => { clearInterval(interval); setDataLines([]); dataCountRef.current = 0; };
  }, [status]);

  useEffect(() => {
    if (status !== "success") return;
    setDataLines([]);
  }, [status]);

  const handleInputChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const startHolding = () => {
    if (progress < 100 || status === "success") return;
    setStatus("holding");
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          handleSend();
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const stopHolding = () => {
    if (status === "success") return;
    clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
      setStatus("idle");
    }
  };

  const handleSend = () => setStatus("sending");

  const resetForm = () => {
    setStatus("idle");
    setFormData({ name: "", email: "", message: "" });
    setHoldProgress(0);
    setDataLines([]);
  };

  return (
    <section id="contact" className="contact-uplink">
      <Reveal>
        <div className="uplink-container">
          {status === "success" && (
            <div className="success-overlay">
              <div className="success-glitch" data-text="UPLINK_SUCCESS">
                <h2 className="success-message-huge">UPLINK_SUCCESS</h2>
              </div>
              <p className="success-subtext">TRANSMISSION RECEIVED BY VORTEK SYSTEMS</p>
              <div className="success-lines">
                {["ACK", "SEQ: 0x4F1A", "CHECKSUM: OK", "LATENCY: 12ms"].map(l => (
                  <span key={l} className="success-log">{"> "}{l}</span>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: "40px", background: "white", color: "black" }}
                onClick={resetForm}
              >
                NEW_TRANSMISSION
              </button>
            </div>
          )}

          <div className="uplink-info">
            <div className="glitch-wrap" style={{ position: "relative" }}>
              <h2
                className={`uplink-title ${glitching ? "glitch-active" : ""}`}
                onMouseEnter={() => { setGlitchIntensity(1); setGlitching(true); setTimeout(() => { setGlitching(false); setGlitchIntensity(0); }, 300); }}
                data-text="PRONTO PARA SEU DEPLOY?"
              >
                PRONTO PARA SEU <span>DEPLOY?</span>
              </h2>
              {glitching && (
                <div className="glitch-lines" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="glitch-line"
                      style={{
                        top: `${20 + i * 25 + (glitchIntensity * 15)}%`,
                        animationDuration: `${0.05 + Math.random() * 0.1}s`,
                        opacity: 0.3 + glitchIntensity * 0.4,
                      }}
                    />
                  ))}
                </div>
              )}
              {glitching && (
                <div className="glitch-screen-shake" style={{ animation: "screenShake 0.1s ease infinite" }} />
              )}
            </div>

            <p className="uplink-desc">
              Inicie uma conexão segura ou escolha uma plataforma para começarmos seu projeto.
            </p>

            <ConnectionNodes progress={progress} />

            <div className="uplink-methods">
              <a href="https://github.com/Vortek-Zero" target="_blank" rel="noopener noreferrer" className="method-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
              <a href="https://www.99freelas.com.br/user/Vortek.Zero" target="_blank" rel="noopener noreferrer" className="method-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"></path><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                99Freelas
              </a>
              <a href="https://instagram.com/vortek.zero" target="_blank" rel="noopener noreferrer" className="method-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Instagram
              </a>
            </div>

            <div className="uplink-status-box">
              <span className="status-label">
                INTEGRIDADE
                <SignalBars active={progress > 0} progress={progress} />
              </span>
              <div className="status-bar-bg">
                <div className="status-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <form className="uplink-form" onSubmit={e => e.preventDefault()}>
            <div className={`uplink-field ${formData.name ? "filled" : ""}`}>
              <label>Identification</label>
              <input
                type="text"
                className="uplink-input"
                placeholder={useTypingPlaceholder("name", formData.name.length > 0)}
                value={formData.name}
                onChange={e => handleInputChange(e, "name")}
                required
              />
              <span className="field-char-count">{formData.name.length}</span>
            </div>

            <div className={`uplink-field ${formData.email ? "filled" : ""}`}>
              <label>Signal_Destination</label>
              <input
                type="email"
                className="uplink-input"
                placeholder={useTypingPlaceholder("email", formData.email.length > 0)}
                value={formData.email}
                onChange={e => handleInputChange(e, "email")}
                required
              />
              <span className="field-char-count">{formData.email.length}</span>
            </div>

            <div className={`uplink-field ${formData.message ? "filled" : ""}`}>
              <label>Message_Payload</label>
              <textarea
                className="uplink-input"
                placeholder={useTypingPlaceholder("message", formData.message.length > 0)}
                rows={1}
                value={formData.message}
                onChange={e => handleInputChange(e, "message")}
                style={{ resize: "none" }}
                required
              />
              <span className="field-char-count">{formData.message.length}</span>
            </div>

            <div className="hold-to-send-wrap">
              <div
                className={`hold-btn ${holdProgress >= 100 ? "complete" : ""} ${status === "sending" ? "sending" : ""}`}
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                style={{ opacity: progress < 100 ? 0.3 : 1, cursor: progress < 100 ? "not-allowed" : "pointer" }}
              >
                <div className="hold-btn-fill" style={{ transform: `scale(${holdProgress / 100 * 2})`, opacity: holdProgress / 100 }} />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
              <div className="hold-info">
                <div className="hold-hint" style={{ opacity: progress < 100 ? 0.3 : 1 }}>
                  {status === "sending" ? "TRANSMITTING..." : (
                    <>
                      {progress < 100 ? "AWAITING_DATA" : "> SEGURE O BOTAO PARA ENVIAR"}
                      <span>{progress < 100 ? "prencha todos os campos primeiro" : "SECURE_UPLINK_PROTOCOL"}</span>
                    </>
                  )}
                </div>
                {status === "sending" && (
                  <div className="sending-data">
                    {dataLines.map((line, i) => (
                      <span key={i} className="sending-hex">{line}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
