import { useMemo, useState } from "react";
import Layout from "../components/portfolio/Layout";
import { portfolioCommands } from "../data/commands";
import "./Index.css";

const Commands = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => (
    (localStorage.getItem("portfolio-theme") as "light" | "dark") || "light"
  ));
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const filtered = useMemo(() => portfolioCommands.filter((item) => (
    `${item.category} ${item.title} ${item.command} ${item.note}`.toLowerCase().includes(query.toLowerCase().trim())
  )), [query]);

  const copy = async (command: string, title: string) => {
    await navigator.clipboard.writeText(command);
    setCopied(title);
    window.setTimeout(() => setCopied(""), 1600);
  };

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <section className="section commands-page">
        <div className="section-container">
          <div className="section-header">
            <span className="section-eyebrow">Developer Commands</span>
            <h1 className="section-title">Useful<br /><span className="accent-text">Commands</span></h1>
            <p className="section-sub">A small, practical reference for the tools behind my projects. Check prerequisites and active contexts before running commands.</p>
          </div>
          <label className="archive-search commands-search">
            <span>Search commands</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try wasm, docker, Kubernetes..." />
          </label>
          <p className="commands-summary">{filtered.length} of {portfolioCommands.length} practical command recipes</p>
          <div className="commands-grid">
            {filtered.map((item) => (
              <article className="command-card" key={item.title}>
                <div className="command-card-top"><span className="section-eyebrow">{item.category}</span><h2>{item.title}</h2></div>
                <pre><code>{item.command}</code></pre>
                <p>{item.note}</p>
                {item.project && <span className="command-project">Used in: {item.project}</span>}
                <button className="btn btn--outline command-copy" onClick={() => copy(item.command, item.title)}>
                  {copied === item.title ? "Copied ✓" : "Copy commands"}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Commands;
