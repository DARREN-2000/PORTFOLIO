import { useState, useCallback } from "react";

// ========== COLOR PICKER ==========
export const ColorPicker = () => {
  const [color, setColor] = useState("#E20074");
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  const hexToHsl = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };
  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  return (
    <div className="tool-widget">
      <h3 className="widget-title">🎨 Color Picker</h3>
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="color-picker-input" />
      <div className="color-values">
        <span className="color-val">HEX: {color}</span>
        <span className="color-val">RGB: {rgb.r}, {rgb.g}, {rgb.b}</span>
        <span className="color-val">HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%</span>
      </div>
      <div className="color-preview" style={{ background: color }} />
    </div>
  );
};

// ========== JSON PATH FINDER ==========
export const JsonPathFinder = () => {
  const [json, setJson] = useState('{"user": {"name": "Darren", "skills": ["Python", "PyTorch"]}}');
  const [paths, setPaths] = useState<string[]>([]);

  const findPaths = useCallback((obj: any, prefix = "$"): string[] => {
    const result: string[] = [];
    if (typeof obj === "object" && obj !== null) {
      for (const key of Object.keys(obj)) {
        const path = Array.isArray(obj) ? `${prefix}[${key}]` : `${prefix}.${key}`;
        result.push(`${path} → ${JSON.stringify(obj[key]).slice(0, 50)}`);
        result.push(...findPaths(obj[key], path));
      }
    }
    return result;
  }, []);

  const analyze = () => {
    try {
      const parsed = JSON.parse(json);
      setPaths(findPaths(parsed));
    } catch { setPaths(["❌ Invalid JSON"]); }
  };

  return (
    <div className="tool-widget">
      <h3 className="widget-title">🗺️ JSON Path Finder</h3>
      <textarea className="tool-textarea" value={json} onChange={e => setJson(e.target.value)} rows={3} />
      <button className="tool-btn" onClick={analyze}>Find Paths</button>
      {paths.length > 0 && (
        <pre className="tool-output">{paths.join("\n")}</pre>
      )}
    </div>
  );
};

// ========== TIMESTAMP CONVERTER ==========
export const TimestampConverter = () => {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [date, setDate] = useState("");

  const toDate = () => {
    const num = parseInt(ts);
    if (isNaN(num)) return;
    const d = num > 1e12 ? new Date(num) : new Date(num * 1000);
    setDate(d.toLocaleString() + "\n" + d.toISOString() + "\n" + d.toUTCString());
  };

  const now = () => setTs(String(Math.floor(Date.now() / 1000)));

  return (
    <div className="tool-widget">
      <h3 className="widget-title">⏱️ Timestamp Converter</h3>
      <div className="tool-row">
        <input className="tool-input" value={ts} onChange={e => setTs(e.target.value)} placeholder="Unix timestamp" />
        <button className="tool-btn" onClick={toDate}>Convert</button>
        <button className="tool-btn tool-btn--secondary" onClick={now}>Now</button>
      </div>
      {date && <pre className="tool-output">{date}</pre>}
    </div>
  );
};

// ========== ASPECT RATIO CALCULATOR ==========
export const AspectRatioCalc = () => {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const width = parseInt(w) || 0;
  const height = parseInt(h) || 0;
  const g = gcd(width, height);
  const ratio = g ? `${width / g}:${height / g}` : "—";

  return (
    <div className="tool-widget">
      <h3 className="widget-title">📐 Aspect Ratio</h3>
      <div className="tool-row">
        <input className="tool-input" value={w} onChange={e => setW(e.target.value)} placeholder="Width" />
        <span className="tool-sep">×</span>
        <input className="tool-input" value={h} onChange={e => setH(e.target.value)} placeholder="Height" />
      </div>
      <span className="tool-result">Ratio: <strong>{ratio}</strong></span>
    </div>
  );
};

// ========== STRING CASE CONVERTER ==========
export const CaseConverter = () => {
  const [text, setText] = useState("hello world example");
  const cases = [
    { label: "camelCase", val: text.replace(/(?:^\w|[A-Z]|\b\w)/g, (l, i) => i === 0 ? l.toLowerCase() : l.toUpperCase()).replace(/\s+/g, "") },
    { label: "PascalCase", val: text.replace(/(?:^\w|[A-Z]|\b\w)/g, l => l.toUpperCase()).replace(/\s+/g, "") },
    { label: "snake_case", val: text.toLowerCase().replace(/\s+/g, "_") },
    { label: "kebab-case", val: text.toLowerCase().replace(/\s+/g, "-") },
    { label: "CONSTANT_CASE", val: text.toUpperCase().replace(/\s+/g, "_") },
    { label: "Title Case", val: text.replace(/\b\w/g, l => l.toUpperCase()) },
  ];

  return (
    <div className="tool-widget">
      <h3 className="widget-title">🔤 Case Converter</h3>
      <input className="tool-input" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." />
      <div className="case-results">
        {cases.map(c => (
          <div key={c.label} className="case-item" onClick={() => navigator.clipboard.writeText(c.val)}>
            <span className="case-label">{c.label}</span>
            <code className="case-val">{c.val}</code>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== CHMOD CALCULATOR ==========
export const ChmodCalc = () => {
  const [perms, setPerms] = useState([true, true, false, true, false, false, true, false, false]);
  const labels = ["Owner R", "Owner W", "Owner X", "Group R", "Group W", "Group X", "Other R", "Other W", "Other X"];

  const toggle = (i: number) => { const n = [...perms]; n[i] = !n[i]; setPerms(n); };
  const numeric = [0, 1, 2].map(g => perms.slice(g * 3, g * 3 + 3).reduce((s, v, i) => s + (v ? [4, 2, 1][i] : 0), 0)).join("");
  const symbolic = "rwx".repeat(3).split("").map((c, i) => perms[i] ? c : "-").join("");

  return (
    <div className="tool-widget">
      <h3 className="widget-title">🔒 Chmod Calculator</h3>
      <div className="chmod-grid">
        {labels.map((l, i) => (
          <label key={i} className="chmod-item">
            <input type="checkbox" checked={perms[i]} onChange={() => toggle(i)} />
            <span>{l}</span>
          </label>
        ))}
      </div>
      <div className="chmod-result">
        <span>Numeric: <strong>{numeric}</strong></span>
        <span>Symbolic: <code>{symbolic}</code></span>
      </div>
    </div>
  );
};
