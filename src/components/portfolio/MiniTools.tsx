import { useState } from "react";

// ========== JSON Formatter ==========
export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch {
      setError("Invalid JSON");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch {
      setError("Invalid JSON");
      setOutput("");
    }
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">📋 JSON Formatter</h4>
      <textarea className="tool-textarea" placeholder='Paste JSON here...' value={input} onChange={e => setInput(e.target.value)} rows={4} />
      <div className="tool-actions">
        <button className="btn btn--primary btn--sm" onClick={format}>Format</button>
        <button className="btn btn--outline btn--sm" onClick={minify}>Minify</button>
        <button className="btn btn--ghost btn--sm" onClick={() => { navigator.clipboard.writeText(output); }}>Copy</button>
      </div>
      {error && <span className="tool-error">{error}</span>}
      {output && <pre className="tool-output">{output}</pre>}
    </div>
  );
}

// ========== Base64 Encoder/Decoder ==========
export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    try {
      setOutput(mode === "encode" ? btoa(input) : atob(input));
    } catch {
      setOutput("Error: Invalid input");
    }
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔐 Base64 Encoder/Decoder</h4>
      <div className="tool-actions">
        <button className={`filter-chip ${mode === "encode" ? "filter-chip--active" : ""}`} onClick={() => setMode("encode")}>Encode</button>
        <button className={`filter-chip ${mode === "decode" ? "filter-chip--active" : ""}`} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <textarea className="tool-textarea" placeholder="Enter text..." value={input} onChange={e => setInput(e.target.value)} rows={3} />
      <button className="btn btn--primary btn--sm" onClick={convert}>Convert</button>
      {output && <pre className="tool-output">{output}</pre>}
    </div>
  );
}

// ========== Pomodoro Timer ==========
export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [sessions, setSessions] = useState(0);

  useState(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds(s => {
        if (s === 0) {
          setMinutes(m => {
            if (m === 0) {
              setRunning(false);
              if (mode === "work") {
                setSessions(s => s + 1);
                setMode("break");
                setMinutes(5);
              } else {
                setMode("work");
                setMinutes(25);
              }
              return 0;
            }
            return m - 1;
          });
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  });

  const reset = () => {
    setRunning(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🍅 Pomodoro Timer</h4>
      <div className="pomodoro-display">
        <span className={`pomodoro-mode ${mode}`}>{mode === "work" ? "🔥 Focus" : "☕ Break"}</span>
        <span className="pomodoro-time">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
        <span className="pomodoro-sessions">Sessions: {sessions}</span>
      </div>
      <div className="tool-actions">
        <button className="btn btn--primary btn--sm" onClick={() => setRunning(!running)}>
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button className="btn btn--outline btn--sm" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

// ========== Color Converter ==========
export function ColorConverter() {
  const [hex, setHex] = useState("#4ecdc4");

  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div className="tool-card">
      <h4 className="tool-title">🎨 Color Converter</h4>
      <div className="color-preview" style={{ background: hex }} />
      <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="color-input" />
      <div className="color-values">
        <span className="color-val">HEX: {hex}</span>
        <span className="color-val">RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
        <span className="color-val">HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
      </div>
    </div>
  );
}

// ========== Lorem Ipsum Generator ==========
export function LoremGenerator() {
  const [paragraphs, setParagraphs] = useState(1);
  const [output, setOutput] = useState("");

  const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const generate = () => {
    setOutput(Array(paragraphs).fill(LOREM).join("\n\n"));
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">📝 Lorem Ipsum Generator</h4>
      <div className="tool-actions">
        <label className="tool-label">Paragraphs: {paragraphs}</label>
        <input type="range" min={1} max={5} value={paragraphs} onChange={e => setParagraphs(+e.target.value)} className="tool-range" />
      </div>
      <button className="btn btn--primary btn--sm" onClick={generate}>Generate</button>
      {output && (
        <>
          <pre className="tool-output tool-output--wrap">{output}</pre>
          <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
        </>
      )}
    </div>
  );
}

// ========== Password Generator ==========
export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  const generate = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let p = "";
    for (let i = 0; i < length; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPassword(p);
    setStrength(length >= 20 ? "🟢 Very Strong" : length >= 14 ? "🟡 Strong" : length >= 10 ? "🟠 Medium" : "🔴 Weak");
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔑 Password Generator</h4>
      <div className="tool-actions">
        <label className="tool-label">Length: {length}</label>
        <input type="range" min={8} max={32} value={length} onChange={e => setLength(+e.target.value)} className="tool-range" />
      </div>
      <button className="btn btn--primary btn--sm" onClick={generate}>Generate</button>
      {password && (
        <div className="password-result">
          <code className="password-text">{password}</code>
          <span className="password-strength">{strength}</span>
          <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard.writeText(password)}>Copy</button>
        </div>
      )}
    </div>
  );
}
