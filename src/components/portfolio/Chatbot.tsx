import { useState, useRef, useEffect, useCallback } from "react";
import { portfolioData } from "../../data/portfolioData";

interface Message {
  role: "bot" | "user";
  text: string;
}

const KNOWLEDGE: { patterns: RegExp[]; answer: string }[] = [
  {
    patterns: [/who (are|is) (you|he|darren|morris)/i, /about (you|him|yourself)/i, /introduce/i, /tell me about/i],
    answer: `I'm Morris Darren Babu — an MLOps Engineer at Deutsche Telekom, currently finishing my Master's in Data Science at FAU Erlangen-Nürnberg. I build production-grade AI systems, from LLM benchmarking to automotive cybersecurity.`,
  },
  {
    patterns: [/experience|work(ed)?|career|job/i, /compan(y|ies)/i],
    answer: `I've worked at 6 companies: Deutsche Telekom (MLOps), CARIAD/Volkswagen (Master Thesis — LLM Fuzzing), BMW Group (Data Science/RAG), Crystal Consultancy (Data Analyst), Altascio Technologies (Data Engineering), and Jman Group (Python Developer). I also did a research project with the OSS Group at FAU.`,
  },
  {
    patterns: [/skill|tech|stack|tools|language.*program/i],
    answer: `My core stack: Python, PyTorch, TensorFlow, Scikit-learn, vLLM, RAG, LangChain, Computer Vision, GAN, VAEs, AI Agents, Docker, Kubernetes, AWS (EC2, S3, SageMaker, Aurora, CloudWatch), Azure (AI Foundry, Databricks, Spark, Data Factory, Private Link), MLflow, ClearML, Grafana, Keycloak, n8n, SQL, Snowflake, Power BI, Django, Flask. Languages: Python, R, C++, JavaScript.`,
  },
  {
    patterns: [/project/i],
    answer: `Key projects: IntentGraph (Agentic AI), LLM Fuzzing Monitor Dashboard (automotive cybersecurity), GNN Material Wear Prediction, Multilingual OCR System (-89% error rate), Hybrid Movie RecSys (83% precision). All on GitHub: github.com/DARREN-2000`,
  },
  {
    patterns: [/education|degree|university|study|studi/i],
    answer: `M.Sc. Data Science at FAU Erlangen-Nürnberg (Oct 2022 – Mar 2026), Nanodegree in Predictive Analytics from Udacity, and B.E. in Computer Science from Rajalakshmi Institute of Technology, India.`,
  },
  {
    patterns: [/certif/i],
    answer: `I hold certifications from Udacity (Predictive Analytics), DeepLearning.AI (TensorFlow Developer), Google (IT Automation with Python, Cloud Data Warehousing), Coursera/UMich (Applied Data Science), and AWS (ML Foundations).`,
  },
  {
    patterns: [/contact|email|phone|reach|hire|connect/i],
    answer: `📧 ${portfolioData.email}\n📱 ${portfolioData.phone}\n💼 LinkedIn: linkedin.com/in/morrisdarrenbabu\n🖥️ GitHub: github.com/DARREN-2000\n📍 Based in ${portfolioData.location}`,
  },
  {
    patterns: [/telekom|current|now|doing/i],
    answer: `At Deutsche Telekom, I built a microservices-based LLM benchmarking framework on vLLM, scaled automated benchmarking via GitLab CI/CD and Kubernetes, and secured enterprise MLflow deployments with Keycloak OIDC/OAuth. Benchmarked 16 LLMs!`,
  },
  {
    patterns: [/bmw/i],
    answer: `At BMW Group, I deployed a CRNN surface detection model on AWS SageMaker, architected a Django web app for STL mesh parsing, and engineered an LLM auto-suggestion model using RAG that elevated precision by 12%.`,
  },
  {
    patterns: [/cariad|volkswagen|vw|thesis/i],
    answer: `My Master Thesis at CARIAD (VW Group): Implemented AI-driven black-box fuzzing by benchmarking 16 LLM models in Azure AI Foundry, boosting code-flaw detection by 13%. Automated test-case generation cut test creation time by 33%.`,
  },
  {
    patterns: [/llm|large language|gpt|genai|generative/i],
    answer: `I specialize in LLMOps: benchmarking (GuideLLM, DeepEval), serving (vLLM), RAG pipelines, prompt engineering, LoRA/QLoRA fine-tuning, and LLM evaluation. I've benchmarked 16 models and deployed LLM systems at BMW, CARIAD, and Deutsche Telekom.`,
  },
  {
    patterns: [/language.*speak|speak|fluent|german|tamil|french/i],
    answer: `I speak Tamil (native), English (C1 — business fluent), German (A2, B1 in progress), and French (A1). 4 languages!`,
  },
  {
    patterns: [/resume|cv|download/i],
    answer: `You can download my resume here: ${portfolioData.resume}`,
  },
  {
    patterns: [/hobby|hobbi|free time|interest|fun/i],
    answer: `I'm passionate about AI research, contributing to open-source, and exploring new tech. I love discussing the future of AI and mobility — the best ideas come from unexpected conversations!`,
  },
  {
    patterns: [/soft\s?skill|teamwork|communication|leadership|creative/i],
    answer: `My soft skills: Analytical Thinking, Strategic Planning, Creative Problem Solving, Communication, Cross-functional Teamwork, Agile Methodology, Leadership & Mentoring, Adaptability, Attention to Detail, and Time Management.`,
  },
  {
    patterns: [/hi|hello|hey|greet|good (morning|evening|afternoon)/i],
    answer: `Hey there! 👋 I'm Darren's AI assistant. Ask me anything about his experience, skills, projects, or how to get in touch!`,
  },
  {
    patterns: [/help|what can (you|i) (do|ask)/i],
    answer: `Try asking:\n• "What's your experience?"\n• "What projects have you built?"\n• "Tell me about your skills"\n• "How can I contact you?"\n• "What certifications do you have?"\n• "Tell me about BMW/Telekom/CARIAD"`,
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const k of KNOWLEDGE) {
    if (k.patterns.some((p) => p.test(lower))) return k.answer;
  }
  return `I'm not sure about that! Try asking about my experience, skills, projects, education, or contact info. Type "help" to see what I can answer.`;
}

const QUICK_ASKS = ["Who are you?", "Skills & Tech", "Projects", "Experience", "Contact"];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hey! 👋 I'm Darren's portfolio assistant. Ask me anything about his work, skills, or projects!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: findAnswer(text) }]);
      setTyping(false);
    }, 600 + Math.random() * 600);
  }, []);

  return (
    <>
      <button
        className={`chatbot-fab ${open ? "chatbot-fab--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with portfolio assistant"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span className="chatbot-header-dot" />
            <span className="chatbot-header-title">Darren's AI Assistant</span>
            <span className="chatbot-header-badge">No API</span>
          </div>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                {m.role === "bot" && <span className="chat-avatar">🤖</span>}
                <div className={`chat-bubble chat-bubble--${m.role}`}>
                  {m.text.split("\n").map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg chat-msg--bot">
                <span className="chat-avatar">🤖</span>
                <div className="chat-bubble chat-bubble--bot chat-typing">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-quick">
            {QUICK_ASKS.map((q) => (
              <button key={q} className="quick-ask" onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <form className="chatbot-input-row" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              className="chatbot-input"
              placeholder="Ask about experience, skills, projects..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chatbot-send" disabled={!input.trim()}>→</button>
          </form>
        </div>
      )}
    </>
  );
}
