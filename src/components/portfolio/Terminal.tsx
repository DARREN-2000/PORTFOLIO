import { useState, useRef, useEffect, useCallback } from "react";
import { portfolioData } from "../../data/portfolioData";

interface Line {
  type: "input" | "output";
  text: string;
}

const FORTUNES = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "A good developer is like a good wizard: they make it look easy.",
  "In the middle of difficulty lies opportunity. — Einstein",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
  "Premature optimization is the root of all evil. — Donald Knuth",
  "Simplicity is the ultimate sophistication. — Leonardo da Vinci",
];

const QUIZ_QUESTIONS = [
  { q: "How many LLM models did Darren benchmark at CARIAD?", a: "16", options: ["8", "12", "16", "24"] },
  { q: "Which company did Darren do his Master Thesis at?", a: "cariad", options: ["BMW", "CARIAD", "Telekom", "Google"] },
  { q: "What was the OCR system's error rate reduction?", a: "89%", options: ["45%", "67%", "89%", "95%"] },
  { q: "What framework does Darren use for LLM serving?", a: "vllm", options: ["vLLM", "TensorRT", "ONNX", "Triton"] },
  { q: "Where is Darren currently based?", a: "bonn", options: ["Munich", "Bonn", "Berlin", "Wolfsburg"] },
];

const getCommands = (): Record<string, () => string> => ({
  help: () =>
    `Available commands:
  about       — Who is Darren?
  skills      — Technical skills
  softskills  — Soft skills
  experience  — Work history
  projects    — Featured projects
  education   — Academic background
  oss         — OSS research project
  certs       — Certifications
  contact     — Get in touch
  languages   — Spoken languages
  resume      — Download resume
  github      — Open GitHub
  linkedin    — Open LinkedIn
  clear       — Clear terminal
  neofetch    — System info

  🎮 Fun commands:
  fortune     — Random wisdom
  quiz        — Test your knowledge
  matrix      — Enter the Matrix
  cowsay      — Moo!
  whoami      — Identity check
  date        — Current date
  ls          — List sections
  cat <topic> — Same as topic
  echo <text> — Echo your text
  history     — Command history
  tree        — Project structure
  ascii       — ASCII art`,
  about: () =>
    `Morris Darren Babu
MLOps Intern @ Deutsche Telekom
M.Sc. Data Science — FAU Erlangen-Nürnberg (in progress)
${portfolioData.tagline}`,
  skills: () =>
    portfolioData.skillCategories.map((c) => `${c.icon} ${c.title}: ${c.skills.join(", ")}`).join("\n"),
  softskills: () =>
    `💡 Soft Skills: ${portfolioData.softSkills.join(" · ")}`,
  experience: () =>
    portfolioData.experiences
      .map((e) => `${e.icon} ${e.role} @ ${e.company} (${e.period})`)
      .join("\n"),
  projects: () =>
    portfolioData.projects
      .map((p) => `→ ${p.title}: ${p.impact}`)
      .join("\n"),
  education: () =>
    portfolioData.education.map((e) => `🎓 ${e.degree} — ${e.school} (${e.period})`).join("\n"),
  oss: () =>
    `📂 ${portfolioData.ossProject.title}\n   ${portfolioData.ossProject.org} (${portfolioData.ossProject.period})\n   ${portfolioData.ossProject.description}`,
  certs: () =>
    portfolioData.certifications.map((c) => `🏅 ${c.name} — ${c.issuer}`).join("\n"),
  contact: () =>
    `📧 ${portfolioData.email}
📱 ${portfolioData.phone}
📍 ${portfolioData.location}
💼 LinkedIn: ${portfolioData.linkedin}
🖥️ GitHub: ${portfolioData.github}`,
  languages: () =>
    portfolioData.languages.map((l) => `${l.lang}: ${l.level} (${"█".repeat(Math.round(l.percent / 10))}${"░".repeat(10 - Math.round(l.percent / 10))} ${l.percent}%)`).join("\n"),
  resume: () => {
    window.open(portfolioData.resume, "_blank");
    return "📄 Opening resume in new tab...";
  },
  github: () => {
    window.open(portfolioData.github, "_blank");
    return "🖥️ Opening GitHub profile...";
  },
  linkedin: () => {
    window.open(portfolioData.linkedin, "_blank");
    return "💼 Opening LinkedIn profile...";
  },
  whoami: () => "darren — MLOps Intern | AI Specialist | M.Sc. Data Science",
  date: () => new Date().toLocaleString(),
  ls: () => "hero/  experience/  skills/  projects/  certifications/  education/  about/  terminal/  contact/",
  fortune: () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)],
  matrix: () => {
    const chars = "01";
    let lines = "";
    for (let i = 0; i < 6; i++) {
      let line = "";
      for (let j = 0; j < 50; j++) line += chars[Math.floor(Math.random() * chars.length)];
      lines += line + "\n";
    }
    return lines + "Wake up, Neo... The Matrix has you.";
  },
  cowsay: () => {
    const msgs = ["Moo! Hire Darren!", "Moo! Check out his GitHub!", "Moo! AI is the future!"];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    return ` ${"_".repeat(msg.length + 2)}
< ${msg} >
 ${"-".repeat(msg.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
  },
  ascii: () =>
    `
    ____                                 __         
   / __ \\____ ______________  ____     _/ /__  _   __
  / / / / __ \`/ ___/ ___/ _ \\/ __ \\   / __  / | / /
 / /_/ / /_/ / /  / /  /  __/ / / /  / /_/ /| |/ / 
/_____/\\__,_/_/  /_/   \\___/_/ /_/   \\__,_/ |___/  
                                                     
         MLOps · AI · Data Science`,
  tree: () =>
    `📦 darren-portfolio
├── 📂 experience (${portfolioData.experiences.length} roles)
├── 📂 skills (${portfolioData.skillCategories.length} categories)
├── 📂 projects (${portfolioData.projects.length} repos)
├── 📂 certifications (${portfolioData.certifications.length})
├── 📂 education (${portfolioData.education.length} degrees)
├── 📂 languages (${portfolioData.languages.length} spoken)
└── 📄 README.md`,
  quiz: () => {
    const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
    return `🧠 QUIZ: ${q.q}\n   Options: ${q.options.join(" | ")}\n   (Type "answer <your answer>" to check!)`;
  },
  neofetch: () =>
    `darren@portfolio
-----------------
OS:      Web Portfolio v2.0
Host:    ${portfolioData.location}
Shell:   TypeScript + React + Vite
Theme:   Editorial Warm
CPU:     Brain powered by ☕
GPU:     PyTorch + vLLM
Memory:  ${portfolioData.experiences.length} roles cached
Uptime:  ${portfolioData.stats[0].value}+ years in tech
Langs:   ${portfolioData.languages.map(l => l.lang).join(", ")}`,
});

export default function TerminalWidget() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: `Welcome to Darren's Portfolio Terminal v2.0\nType "help" for available commands.\nTry "quiz", "cowsay", "fortune", or "ascii" for some fun! 🎮\n` },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [lastQuiz, setLastQuiz] = useState<typeof QUIZ_QUESTIONS[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const exec = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);

      if (trimmed === "clear") {
        setLines([]);
        return;
      }

      const commands = getCommands();

      // Handle quiz answer
      if (trimmed.startsWith("answer ") && lastQuiz) {
        const userAnswer = trimmed.slice(7).trim();
        const correct = lastQuiz.a.toLowerCase();
        const isCorrect = userAnswer === correct || lastQuiz.options.some(o => o.toLowerCase() === userAnswer && o.toLowerCase() === correct);
        const output = isCorrect
          ? `✅ Correct! The answer is "${lastQuiz.a}". Well done!`
          : `❌ Not quite! The correct answer was "${lastQuiz.a}". Try another quiz!`;
        setLines((l) => [...l, { type: "input", text: cmd }, { type: "output", text: output }]);
        setLastQuiz(null);
        return;
      }

      // Handle quiz command — track the question
      if (trimmed === "quiz") {
        const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
        setLastQuiz(q);
        const output = `🧠 QUIZ: ${q.q}\n   Options: ${q.options.join(" | ")}\n   (Type "answer <your answer>" to check!)`;
        setLines((l) => [...l, { type: "input", text: cmd }, { type: "output", text: output }]);
        return;
      }

      // Handle "cat <topic>"
      if (trimmed.startsWith("cat ")) {
        const topic = trimmed.slice(4).trim();
        const handler = commands[topic];
        const output = handler ? handler() : `cat: ${topic}: No such file or directory`;
        setLines((l) => [...l, { type: "input", text: cmd }, { type: "output", text: output }]);
        return;
      }

      // Handle "echo <text>"
      if (trimmed.startsWith("echo ")) {
        const text = cmd.trim().slice(5);
        setLines((l) => [...l, { type: "input", text: cmd }, { type: "output", text: text || "" }]);
        return;
      }

      // Handle "history"
      if (trimmed === "history") {
        const hist = history.slice(0, 15).map((h, i) => `  ${i + 1}  ${h}`).join("\n") || "  (empty)";
        setLines((l) => [...l, { type: "input", text: cmd }, { type: "output", text: hist }]);
        return;
      }

      const handler = commands[trimmed];
      const output = handler
        ? handler()
        : `Command not found: ${trimmed}\nType "help" for available commands.`;

      setLines((l) => [...l, { type: "input", text: cmd }, { type: "output", text: output }]);
    },
    [lastQuiz, history]
  );

  return (
    <div className="cli-terminal" onClick={() => inputRef.current?.focus()}>
      <div className="cli-header">
        <div className="cli-dots">
          <span className="cli-dot cli-dot--r" />
          <span className="cli-dot cli-dot--y" />
          <span className="cli-dot cli-dot--g" />
        </div>
        <span className="cli-title">darren@portfolio: ~</span>
      </div>
      <div className="cli-body" ref={scrollRef}>
        {lines.map((l, i) => (
          <div key={i} className={`cli-line cli-line--${l.type}`}>
            {l.type === "input" && <span className="cli-prompt">❯ </span>}
            {l.text.split("\n").map((t, j) => (
              <span key={j}>
                {t}
                {j < l.text.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
        ))}
        <form
          className="cli-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) exec(input);
            setInput("");
          }}
        >
          <span className="cli-prompt">❯ </span>
          <input
            ref={inputRef}
            className="cli-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const idx = Math.min(histIdx + 1, history.length - 1);
                setHistIdx(idx);
                setInput(history[idx]);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const idx = histIdx - 1;
                if (idx < 0) { setHistIdx(-1); setInput(""); }
                else { setHistIdx(idx); setInput(history[idx]); }
              }
            }}
            spellCheck={false}
            autoComplete="off"
            placeholder="Type a command..."
          />
        </form>
      </div>
    </div>
  );
}
