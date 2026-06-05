import { useState } from "react";

export default function DevControls({ onUpdate, style, label }) {
  const [vals, setVals] = useState({ scale: 1, x: 0, y: 0 });

  const update = (key, value) => {
    const next = { ...vals, [key]: value };
    setVals(next);
    if (onUpdate) onUpdate(next);
  };

  return (
    <div className="pdc" style={style} onClick={(e) => e.stopPropagation()}>
      <span className="pdc-label">{label || 'python'}</span>
      <div className="pdc-group">
        <span>S</span>
        <input type="range" min="0.3" max="2.5" step="0.05" value={vals.scale}
          onChange={(e) => update("scale", parseFloat(e.target.value))} />
        <span className="pdc-v">{vals.scale.toFixed(2)}</span>
      </div>
      <div className="pdc-group">
        <span>X</span>
        <input type="range" min="-600" max="600" step="5" value={vals.x}
          onChange={(e) => update("x", parseInt(e.target.value))} />
        <span className="pdc-v">{vals.x}</span>
      </div>
      <div className="pdc-group">
        <span>Y</span>
        <input type="range" min="-600" max="600" step="5" value={vals.y}
          onChange={(e) => update("y", parseInt(e.target.value))} />
        <span className="pdc-v">{vals.y}</span>
      </div>
    </div>
  );
}
