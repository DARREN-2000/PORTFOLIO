import { useState, useMemo } from "react";

// ========== Regex Tester ==========
export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const re = new RegExp(pattern, flags);
      return [...testStr.matchAll(re)].map(m => ({ match: m[0], index: m.index ?? 0 }));
    } catch { return []; }
  }, [pattern, flags, testStr]);

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔎 Regex Tester</h4>
      <div className="tool-actions">
        <input className="tool-input-sm" placeholder="Pattern..." value={pattern} onChange={e => setPattern(e.target.value)} />
        <input className="tool-input-xs" placeholder="Flags" value={flags} onChange={e => setFlags(e.target.value)} style={{ width: 50 }} />
      </div>
      <textarea className="tool-textarea" placeholder="Test string..." value={testStr} onChange={e => setTestStr(e.target.value)} rows={3} />
      <div className="regex-matches">
        {matches.length > 0 ? matches.map((m, i) => (
          <span key={i} className="regex-match">"{m.match}" <span className="regex-idx">@{m.index}</span></span>
        )) : pattern && <span className="tool-label">No matches</span>}
        {matches.length > 0 && <span className="tool-label">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>}
      </div>
    </div>
  );
}

// ========== Markdown Previewer ==========
export function MarkdownPreviewer() {
  const [md, setMd] = useState("# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n`code snippet`\n\n> Blockquote here");

  const renderMd = (text: string) => {
    return text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:var(--bg-alt);padding:2px 6px;border-radius:4px;font-size:0.85em">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--primary);padding-left:12px;color:var(--fg-secondary);font-style:italic">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">📝 Markdown Previewer</h4>
      <textarea className="tool-textarea" value={md} onChange={e => setMd(e.target.value)} rows={5} />
      <div className="md-preview" dangerouslySetInnerHTML={{ __html: renderMd(md) }} />
    </div>
  );
}

// ========== UUID Generator ==========
export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🆔 UUID Generator</h4>
      <div className="tool-actions">
        <label className="tool-label">Count: {count}</label>
        <input type="range" min={1} max={10} value={count} onChange={e => setCount(+e.target.value)} className="tool-range" />
      </div>
      <button className="btn btn--primary btn--sm" onClick={generate}>Generate</button>
      {uuids.length > 0 && (
        <div className="uuid-list">
          {uuids.map((u, i) => (
            <div key={i} className="uuid-row">
              <code className="uuid-text">{u}</code>
              <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard.writeText(u)}>📋</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Hash Generator ==========
export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async () => {
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const results: Record<string, string> = {};
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) {
      const buf = await crypto.subtle.digest(algo, data);
      results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    setHashes(results);
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">#️⃣ Hash Generator</h4>
      <textarea className="tool-textarea" placeholder="Enter text to hash..." value={input} onChange={e => setInput(e.target.value)} rows={2} />
      <button className="btn btn--primary btn--sm" onClick={generate}>Generate Hashes</button>
      {Object.keys(hashes).length > 0 && (
        <div className="hash-results">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="hash-row">
              <span className="hash-algo">{algo}</span>
              <code className="hash-value">{hash.substring(0, 32)}...</code>
              <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard.writeText(hash)}>📋</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Unit Converter ==========
export function UnitConverter() {
  const [value, setValue] = useState("1");
  const [category, setCategory] = useState("length");

  const conversions: Record<string, { label: string; units: { name: string; factor: number }[] }> = {
    length: { label: "📏 Length", units: [{ name: "Meters", factor: 1 }, { name: "Feet", factor: 3.28084 }, { name: "Inches", factor: 39.3701 }, { name: "Km", factor: 0.001 }, { name: "Miles", factor: 0.000621371 }] },
    weight: { label: "⚖️ Weight", units: [{ name: "Grams", factor: 1 }, { name: "Kg", factor: 0.001 }, { name: "Pounds", factor: 0.00220462 }, { name: "Ounces", factor: 0.035274 }] },
    temperature: { label: "🌡️ Temperature", units: [{ name: "°C", factor: 1 }, { name: "°F", factor: 1 }, { name: "K", factor: 1 }] },
    data: { label: "💾 Data", units: [{ name: "Bytes", factor: 1 }, { name: "KB", factor: 0.001 }, { name: "MB", factor: 0.000001 }, { name: "GB", factor: 1e-9 }, { name: "TB", factor: 1e-12 }] },
  };

  const conv = conversions[category];
  const num = parseFloat(value) || 0;

  const getConverted = (unitName: string, factor: number) => {
    if (category === "temperature") {
      if (unitName === "°C") return num;
      if (unitName === "°F") return (num * 9 / 5) + 32;
      if (unitName === "K") return num + 273.15;
    }
    return num * factor;
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔄 Unit Converter</h4>
      <div className="tool-actions">
        {Object.entries(conversions).map(([key, { label }]) => (
          <button key={key} className={`filter-chip ${category === key ? 'filter-chip--active' : ''}`} onClick={() => setCategory(key)}>{label}</button>
        ))}
      </div>
      <input className="tool-input-sm" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value..." />
      <div className="unit-results">
        {conv.units.map(u => (
          <div key={u.name} className="unit-row">
            <span className="unit-name">{u.name}</span>
            <span className="unit-value">{getConverted(u.name, u.factor).toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== Epoch Converter ==========
export function EpochConverter() {
  const [epoch, setEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState("");

  const epochToDate = (e: string) => {
    const n = parseInt(e);
    if (isNaN(n)) return "Invalid";
    const ms = n < 1e12 ? n * 1000 : n;
    return new Date(ms).toISOString();
  };

  const dateToEpoch = (d: string) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? "Invalid" : String(Math.floor(date.getTime() / 1000));
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">⏱️ Epoch Converter</h4>
      <div className="epoch-section">
        <label className="tool-label">Epoch → Date</label>
        <input className="tool-input-sm" value={epoch} onChange={e => setEpoch(e.target.value)} placeholder="Unix timestamp" />
        <code className="epoch-result">{epochToDate(epoch)}</code>
      </div>
      <div className="epoch-section">
        <label className="tool-label">Date → Epoch</label>
        <input className="tool-input-sm" value={dateStr} onChange={e => setDateStr(e.target.value)} placeholder="2024-01-15T10:30:00" />
        <code className="epoch-result">{dateStr ? dateToEpoch(dateStr) : "Enter a date"}</code>
      </div>
      <button className="btn btn--ghost btn--sm" onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))}>Now</button>
    </div>
  );
}

// ========== CSS Gradient Generator ==========
export function GradientGenerator() {
  const [color1, setColor1] = useState("#e20074");
  const [color2, setColor2] = useState("#4ecdc4");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const gradient = type === "linear"
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const css = `background: ${gradient};`;

  return (
    <div className="tool-card">
      <h4 className="tool-title">🌈 CSS Gradient Generator</h4>
      <div className="gradient-preview" style={{ background: gradient }} />
      <div className="tool-actions">
        <button className={`filter-chip ${type === 'linear' ? 'filter-chip--active' : ''}`} onClick={() => setType('linear')}>Linear</button>
        <button className={`filter-chip ${type === 'radial' ? 'filter-chip--active' : ''}`} onClick={() => setType('radial')}>Radial</button>
      </div>
      <div className="tool-actions">
        <input type="color" value={color1} onChange={e => setColor1(e.target.value)} />
        <input type="color" value={color2} onChange={e => setColor2(e.target.value)} />
        {type === "linear" && (
          <>
            <label className="tool-label">{angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="tool-range" />
          </>
        )}
      </div>
      <pre className="tool-output">{css}</pre>
      <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</button>
    </div>
  );
}

// ========== Text Statistics ==========
export function TextStats() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(s => s.trim()).length;
    const readingTime = Math.ceil(words / 200);
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <div className="tool-card">
      <h4 className="tool-title">📊 Text Statistics</h4>
      <textarea className="tool-textarea" placeholder="Paste or type text..." value={text} onChange={e => setText(e.target.value)} rows={4} />
      <div className="text-stats-grid">
        <div className="text-stat"><span className="text-stat-val">{stats.words}</span><span className="text-stat-lbl">Words</span></div>
        <div className="text-stat"><span className="text-stat-val">{stats.chars}</span><span className="text-stat-lbl">Characters</span></div>
        <div className="text-stat"><span className="text-stat-val">{stats.sentences}</span><span className="text-stat-lbl">Sentences</span></div>
        <div className="text-stat"><span className="text-stat-val">{stats.paragraphs}</span><span className="text-stat-lbl">Paragraphs</span></div>
        <div className="text-stat"><span className="text-stat-val">{stats.charsNoSpace}</span><span className="text-stat-lbl">No Spaces</span></div>
        <div className="text-stat"><span className="text-stat-val">{stats.readingTime}m</span><span className="text-stat-lbl">Read Time</span></div>
      </div>
    </div>
  );
}
