import { useState } from "react";

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  companyIcon: string;
  role: string;
  duration: string;
  problem: string;
  approach: string[];
  solution: string;
  techStack: string[];
  results: { metric: string; value: string; improvement: string }[];
  keyTakeaway: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "telekom-llm",
    title: "LLM Benchmarking Framework at Scale",
    company: "Deutsche Telekom",
    companyIcon: "🏢",
    role: "MLOps Intern",
    duration: "6 months",
    problem: "The AI team needed to evaluate 16+ LLMs for production deployment but had no standardized way to compare latency, throughput, and answer quality across models — each evaluation was manual and inconsistent.",
    approach: [
      "Designed a benchmarking pipeline using vLLM for inference, GuideLLM for latency/throughput metrics, and DeepEval for LLM-as-judge quality scoring",
      "Built containerized matrix jobs in GitLab CI/CD triggered by dataset changes, running automated benchmarks on Kubernetes runners",
      "Integrated ClearML for experiment tracking and Grafana dashboards for real-time SLO monitoring",
      "Implemented Keycloak OIDC + OAuth sidecars for secure MLflow access across teams",
    ],
    solution: "A fully automated, CI/CD-driven benchmarking platform that evaluates any LLM against standardized datasets, tracks experiments, and publishes results to Grafana — enabling data-driven model selection.",
    techStack: ["vLLM", "GuideLLM", "DeepEval", "ClearML", "MLflow", "Keycloak", "Kubernetes", "GitLab CI/CD", "Grafana"],
    results: [
      { metric: "Models Benchmarked", value: "16", improvement: "from 0 automated" },
      { metric: "Evaluation Time", value: "-70%", improvement: "vs manual testing" },
      { metric: "SSO Compliance", value: "100%", improvement: "Keycloak OIDC" },
    ],
    keyTakeaway: "Standardized LLM evaluation transforms model selection from gut-feeling to data-driven decisions, and CI/CD automation ensures every model update is benchmarked consistently.",
  },
  {
    id: "cariad-fuzzing",
    title: "AI-Driven Fuzz Testing for Automotive ECUs",
    company: "CARIAD (Volkswagen)",
    companyIcon: "🏎️",
    role: "Master Thesis Researcher",
    duration: "5 months",
    problem: "Automotive ECU software testing relied on manual test-case creation, which was slow, incomplete, and couldn't keep pace with increasing cybersecurity threats in connected vehicles.",
    approach: [
      "Benchmarked 16 LLM models in Azure AI Foundry to identify the best candidates for code-flaw detection in embedded C/C++ code",
      "Implemented AI-driven black-box fuzzing by generating adversarial test inputs using LLM inference",
      "Containerized the LLM inference services and integrated them into existing CI/CD/CT pipelines",
      "Designed Azure Private Link architecture for secure, air-gapped LLM access in the automotive security context",
    ],
    solution: "An automated LLM-powered fuzz-testing pipeline that generates intelligent test cases, integrates into existing CI/CD workflows, and significantly improves ECU software security coverage.",
    techStack: ["Azure AI Foundry", "LLMs (16 models)", "Docker", "CI/CD/CT", "Black-Box Fuzzing", "Azure Private Link"],
    results: [
      { metric: "Flaw Detection", value: "+13%", improvement: "code-flaw detection rate" },
      { metric: "Test Creation", value: "-33%", improvement: "time reduction" },
      { metric: "Code Coverage", value: "+7%", improvement: "additional coverage" },
    ],
    keyTakeaway: "LLMs can generate more diverse and intelligent test cases than traditional fuzzers, especially for complex embedded systems where manual test writing is a bottleneck.",
  },
  {
    id: "bmw-rag",
    title: "RAG-Powered Diagnostic Intelligence",
    company: "BMW Group",
    companyIcon: "🔵",
    role: "Data Science Intern",
    duration: "7 months",
    problem: "BMW's diagnostic teams struggled to quickly identify part issues from customer reports (text and images). The existing system required manual lookup across thousands of documents, leading to slow resolution times.",
    approach: [
      "Architected a RAG (Retrieval Augmented Generation) pipeline that processes both text and image inputs to identify part issues",
      "Implemented document chunking, embedding generation, and vector indexing for the knowledge base",
      "Deployed a surface detection model on AWS SageMaker using semantic segmentation with post-processing to reduce false positives",
      "Built API-served results with grounded citations back to source documents",
    ],
    solution: "A multimodal RAG system that takes text descriptions or images of vehicle issues, retrieves relevant diagnostic information, and suggests solutions with grounded references — deployed on AWS.",
    techStack: ["RAG", "AWS SageMaker", "EC2/S3", "Semantic Segmentation", "Vector Search", "Embeddings", "REST APIs"],
    results: [
      { metric: "Diagnostic Precision", value: "+12%", improvement: "over baseline" },
      { metric: "Processing Speed", value: "+8%", improvement: "faster pipeline" },
      { metric: "False Positives", value: "Reduced", improvement: "via post-processing" },
    ],
    keyTakeaway: "Grounded RAG with multimodal inputs (text + image) dramatically improves diagnostic accuracy in manufacturing — the key is proper document chunking and embedding quality.",
  },
];

export default function CaseStudies() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="case-studies-container">
      {CASE_STUDIES.map((cs, idx) => {
        const isExpanded = expandedId === cs.id;
        return (
          <div key={cs.id} className={`case-study-card ${isExpanded ? 'case-study-card--expanded' : ''}`}>
            <div className="case-study-header" onClick={() => setExpandedId(isExpanded ? null : cs.id)}>
              <div className="case-study-num">{String(idx + 1).padStart(2, '0')}</div>
              <div className="case-study-intro">
                <div className="case-study-meta">
                  <span className="case-study-company">{cs.companyIcon} {cs.company}</span>
                  <span className="case-study-role">{cs.role}</span>
                  <span className="case-study-duration">{cs.duration}</span>
                </div>
                <h3 className="case-study-title">{cs.title}</h3>
              </div>
              <span className={`blog-chevron ${isExpanded ? 'blog-chevron--open' : ''}`}>↓</span>
            </div>

            {isExpanded && (
              <div className="case-study-body">
                {/* Problem */}
                <div className="cs-block">
                  <div className="cs-block-label">
                    <span className="cs-block-icon">🔍</span>
                    <span>The Problem</span>
                  </div>
                  <p className="cs-block-text">{cs.problem}</p>
                </div>

                {/* Approach */}
                <div className="cs-block">
                  <div className="cs-block-label">
                    <span className="cs-block-icon">🧠</span>
                    <span>Approach</span>
                  </div>
                  <ol className="cs-approach-list">
                    {cs.approach.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Solution */}
                <div className="cs-block">
                  <div className="cs-block-label">
                    <span className="cs-block-icon">⚡</span>
                    <span>Solution</span>
                  </div>
                  <p className="cs-block-text">{cs.solution}</p>
                </div>

                {/* Results */}
                <div className="cs-block">
                  <div className="cs-block-label">
                    <span className="cs-block-icon">📊</span>
                    <span>Results</span>
                  </div>
                  <div className="cs-results-grid">
                    {cs.results.map((r, i) => (
                      <div key={i} className="cs-result-card">
                        <span className="cs-result-value">{r.value}</span>
                        <span className="cs-result-metric">{r.metric}</span>
                        <span className="cs-result-improvement">{r.improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="cs-block">
                  <div className="cs-block-label">
                    <span className="cs-block-icon">🛠️</span>
                    <span>Tech Stack</span>
                  </div>
                  <div className="cs-tech-tags">
                    {cs.techStack.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="cs-takeaway">
                  <span className="cs-takeaway-icon">💡</span>
                  <p className="cs-takeaway-text">{cs.keyTakeaway}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
