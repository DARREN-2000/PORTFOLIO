import { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeProvider";

export function SchemeSelector() {
  const { scheme, setScheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const schemes = [
    { value: "neutral", label: "Neutral" },
    { value: "inverted", label: "Inverted" },
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
    { value: "magenta", label: "Magenta" }
  ] as const;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        className="scheme-selector-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        🎨 {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
      </button>
      {open && (
        <ul className="scheme-selector-menu" role="listbox">
          {schemes.map((s) => (
            <li
              key={s.value}
              role="option"
              aria-selected={scheme === s.value}
              className={`scheme-selector-item${scheme === s.value ? " scheme-selector-item--selected" : ""}`}
              onClick={() => { setScheme(s.value); setOpen(false); }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}