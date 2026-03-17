import { useState, useMemo } from "react";

// ========== Character & Word Counter ==========
export function CharWordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const lines = text ? text.split('\n').length : 0;
    const readTime = Math.ceil(words / 200);
    const speakTime = Math.ceil(words / 130);
    // Most common word
    const wordFreq: Record<string, number> = {};
    if (text.trim()) {
      text.trim().toLowerCase().split(/\s+/).forEach(w => {
        const clean = w.replace(/[^a-zA-Z0-9]/g, '');
        if (clean) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      });
    }
    const topWord = Object.entries(wordFreq).sort((a, b) => b[1] - a[1])[0];
    return { chars, charsNoSpace, words, sentences, lines, readTime, speakTime, topWord };
  }, [text]);

  return (
    <div className="tool-card">
      <h4 className="tool-title">📝 Character & Word Counter</h4>
      <textarea className="tool-textarea" placeholder="Start typing or paste text..." value={text} onChange={e => setText(e.target.value)} rows={4} />
      <div className="counter-grid">
        <div className="counter-item"><span className="counter-val">{stats.chars}</span><span className="counter-lbl">Characters</span></div>
        <div className="counter-item"><span className="counter-val">{stats.charsNoSpace}</span><span className="counter-lbl">No Spaces</span></div>
        <div className="counter-item"><span className="counter-val">{stats.words}</span><span className="counter-lbl">Words</span></div>
        <div className="counter-item"><span className="counter-val">{stats.sentences}</span><span className="counter-lbl">Sentences</span></div>
        <div className="counter-item"><span className="counter-val">{stats.lines}</span><span className="counter-lbl">Lines</span></div>
        <div className="counter-item"><span className="counter-val">{stats.readTime}m</span><span className="counter-lbl">Read Time</span></div>
        <div className="counter-item"><span className="counter-val">{stats.speakTime}m</span><span className="counter-lbl">Speak Time</span></div>
        <div className="counter-item"><span className="counter-val">{stats.topWord ? stats.topWord[0] : '—'}</span><span className="counter-lbl">Top Word</span></div>
      </div>
    </div>
  );
}

// ========== JWT Decoder ==========
export function JWTDecoder() {
  const [jwt, setJwt] = useState("");
  const decoded = useMemo(() => {
    if (!jwt.trim()) return null;
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return { error: "Invalid JWT: expected 3 parts" };
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const exp = payload.exp ? new Date(payload.exp * 1000).toISOString() : null;
      const iat = payload.iat ? new Date(payload.iat * 1000).toISOString() : null;
      return { header, payload, exp, iat, isExpired: payload.exp ? Date.now() / 1000 > payload.exp : null };
    } catch {
      return { error: "Failed to decode JWT" };
    }
  }, [jwt]);

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔓 JWT Decoder</h4>
      <textarea className="tool-textarea" placeholder="Paste JWT token..." value={jwt} onChange={e => setJwt(e.target.value)} rows={3} />
      {decoded && 'error' in decoded && <span className="tool-error">{decoded.error}</span>}
      {decoded && !('error' in decoded) && (
        <div className="jwt-results">
          {decoded.isExpired !== null && (
            <span className={`jwt-expiry ${decoded.isExpired ? 'jwt-expiry--expired' : 'jwt-expiry--valid'}`}>
              {decoded.isExpired ? '⚠️ Token Expired' : '✅ Token Valid'}
            </span>
          )}
          <div className="jwt-section">
            <span className="jwt-label">Header</span>
            <pre className="tool-output">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div className="jwt-section">
            <span className="jwt-label">Payload</span>
            <pre className="tool-output">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
          {decoded.exp && <span className="jwt-date">Expires: {decoded.exp}</span>}
          {decoded.iat && <span className="jwt-date">Issued: {decoded.iat}</span>}
        </div>
      )}
    </div>
  );
}

// ========== URL Encoder/Decoder ==========
export function URLEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    try {
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      setOutput("Error: Invalid input");
    }
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔗 URL Encoder/Decoder</h4>
      <div className="tool-actions">
        <button className={`filter-chip ${mode === "encode" ? "filter-chip--active" : ""}`} onClick={() => setMode("encode")}>Encode</button>
        <button className={`filter-chip ${mode === "decode" ? "filter-chip--active" : ""}`} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <textarea className="tool-textarea" placeholder="Enter URL or text..." value={input} onChange={e => setInput(e.target.value)} rows={2} />
      <button className="btn btn--primary btn--sm" onClick={convert}>Convert</button>
      {output && <pre className="tool-output tool-output--wrap">{output}</pre>}
    </div>
  );
}

// ========== CSS Minifier ==========
export function CSSMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const minify = () => {
    const result = input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>~+])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    setOutput(result);
  };

  const beautify = () => {
    let depth = 0;
    let result = '';
    const chars = input.replace(/\s+/g, ' ').trim();
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (c === '{') {
        depth++;
        result += ' {\n' + '  '.repeat(depth);
      } else if (c === '}') {
        depth = Math.max(0, depth - 1);
        result += '\n' + '  '.repeat(depth) + '}\n' + '  '.repeat(depth);
      } else if (c === ';') {
        result += ';\n' + '  '.repeat(depth);
      } else {
        result += c;
      }
    }
    setOutput(result.trim());
  };

  const saved = input.length && output.length ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div className="tool-card">
      <h4 className="tool-title">🎨 CSS Minifier/Beautifier</h4>
      <textarea className="tool-textarea" placeholder="Paste CSS here..." value={input} onChange={e => setInput(e.target.value)} rows={4} />
      <div className="tool-actions">
        <button className="btn btn--primary btn--sm" onClick={minify}>Minify</button>
        <button className="btn btn--outline btn--sm" onClick={beautify}>Beautify</button>
        <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
      </div>
      {saved > 0 && <span className="tool-label" style={{ color: 'var(--success)' }}>💾 Saved {saved}%</span>}
      {output && <pre className="tool-output">{output}</pre>}
    </div>
  );
}

// ========== Diff Checker ==========
export function DiffChecker() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<{ type: 'same' | 'add' | 'remove'; line: string }[]>([]);

  const compare = () => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const result: { type: 'same' | 'add' | 'remove'; line: string }[] = [];
    const maxLen = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i] ?? '';
      const b = linesB[i] ?? '';
      if (a === b) {
        result.push({ type: 'same', line: a });
      } else {
        if (a) result.push({ type: 'remove', line: a });
        if (b) result.push({ type: 'add', line: b });
      }
    }
    setDiff(result);
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔍 Diff Checker</h4>
      <div className="diff-inputs">
        <textarea className="tool-textarea" placeholder="Original text..." value={textA} onChange={e => setTextA(e.target.value)} rows={4} />
        <textarea className="tool-textarea" placeholder="Modified text..." value={textB} onChange={e => setTextB(e.target.value)} rows={4} />
      </div>
      <button className="btn btn--primary btn--sm" onClick={compare}>Compare</button>
      {diff.length > 0 && (
        <div className="diff-output">
          {diff.map((d, i) => (
            <div key={i} className={`diff-line diff-line--${d.type}`}>
              <span className="diff-marker">{d.type === 'add' ? '+' : d.type === 'remove' ? '-' : ' '}</span>
              <span>{d.line || '\u00A0'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Number Base Converter ==========
export function BaseConverter() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);

  const conversions = useMemo(() => {
    try {
      const num = parseInt(input, fromBase);
      if (isNaN(num)) return null;
      return {
        decimal: num.toString(10),
        binary: num.toString(2),
        octal: num.toString(8),
        hex: num.toString(16).toUpperCase(),
      };
    } catch {
      return null;
    }
  }, [input, fromBase]);

  return (
    <div className="tool-card">
      <h4 className="tool-title">🔢 Number Base Converter</h4>
      <div className="tool-actions">
        {[{ label: "DEC", base: 10 }, { label: "BIN", base: 2 }, { label: "OCT", base: 8 }, { label: "HEX", base: 16 }].map(b => (
          <button key={b.base} className={`filter-chip ${fromBase === b.base ? 'filter-chip--active' : ''}`} onClick={() => setFromBase(b.base)}>{b.label}</button>
        ))}
      </div>
      <input className="tool-input-sm" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number..." />
      {conversions && (
        <div className="unit-results">
          <div className="unit-row"><span className="unit-name">Decimal</span><span className="unit-value">{conversions.decimal}</span></div>
          <div className="unit-row"><span className="unit-name">Binary</span><span className="unit-value">{conversions.binary}</span></div>
          <div className="unit-row"><span className="unit-name">Octal</span><span className="unit-value">{conversions.octal}</span></div>
          <div className="unit-row"><span className="unit-name">Hex</span><span className="unit-value">{conversions.hex}</span></div>
        </div>
      )}
    </div>
  );
}

// ========== Cron Expression Parser ==========
export function CronParser() {
  const [cron, setCron] = useState("0 9 * * 1-5");

  const parse = (expr: string) => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) return "Need 5 fields: min hour dom month dow";
    const [min, hour, dom, month, dow] = parts;
    
    const descParts: string[] = [];
    
    if (min === '*') descParts.push('Every minute');
    else if (min.includes('/')) descParts.push(`Every ${min.split('/')[1]} minutes`);
    else descParts.push(`At minute ${min}`);
    
    if (hour === '*') descParts.push('of every hour');
    else if (hour.includes('/')) descParts.push(`every ${hour.split('/')[1]} hours`);
    else descParts.push(`past hour ${hour}`);
    
    if (dom !== '*') descParts.push(`on day ${dom}`);
    if (month !== '*') {
      const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      descParts.push(`in ${months[parseInt(month)] || month}`);
    }
    if (dow !== '*') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dowDesc = dow.replace(/\d/g, d => days[parseInt(d)] || d);
      descParts.push(`on ${dowDesc}`);
    }
    
    return descParts.join(' ');
  };

  const presets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Hourly", value: "0 * * * *" },
    { label: "Daily 9 AM", value: "0 9 * * *" },
    { label: "Weekdays 9 AM", value: "0 9 * * 1-5" },
    { label: "Weekly Mon", value: "0 0 * * 1" },
    { label: "Monthly", value: "0 0 1 * *" },
  ];

  return (
    <div className="tool-card">
      <h4 className="tool-title">⏰ Cron Expression Parser</h4>
      <input className="tool-input-sm" value={cron} onChange={e => setCron(e.target.value)} placeholder="* * * * *" style={{ fontFamily: 'monospace' }} />
      <div className="cron-desc">
        <span className="cron-label">📖 </span>
        <span className="cron-text">{parse(cron)}</span>
      </div>
      <div className="cron-fields">
        <span className="cron-field">MIN</span>
        <span className="cron-field">HOUR</span>
        <span className="cron-field">DOM</span>
        <span className="cron-field">MON</span>
        <span className="cron-field">DOW</span>
      </div>
      <div className="tool-actions" style={{ flexWrap: 'wrap' }}>
        {presets.map(p => (
          <button key={p.value} className="filter-chip" onClick={() => setCron(p.value)} style={{ fontSize: '11px' }}>{p.label}</button>
        ))}
      </div>
    </div>
  );
}

// ========== HTML Entity Encoder ==========
export function HTMLEntityEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    if (mode === "encode") {
      const el = document.createElement('div');
      el.textContent = input;
      setOutput(el.innerHTML);
    } else {
      const el = document.createElement('div');
      el.innerHTML = input;
      setOutput(el.textContent || '');
    }
  };

  return (
    <div className="tool-card">
      <h4 className="tool-title">🏷️ HTML Entity Encoder</h4>
      <div className="tool-actions">
        <button className={`filter-chip ${mode === "encode" ? "filter-chip--active" : ""}`} onClick={() => setMode("encode")}>Encode</button>
        <button className={`filter-chip ${mode === "decode" ? "filter-chip--active" : ""}`} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <textarea className="tool-textarea" placeholder="Enter HTML or text..." value={input} onChange={e => setInput(e.target.value)} rows={2} />
      <button className="btn btn--primary btn--sm" onClick={convert}>Convert</button>
      {output && <pre className="tool-output tool-output--wrap">{output}</pre>}
    </div>
  );
}
