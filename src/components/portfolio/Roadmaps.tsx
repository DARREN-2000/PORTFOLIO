import { useState } from "react";

interface RoadmapStep {
  title: string;
  items: string[];
  duration: string;
  resources: string[];
}

interface Roadmap {
  id: string;
  title: string;
  icon: string;
  description: string;
  totalDuration: string;
  steps: RoadmapStep[];
}

const ROADMAPS: Roadmap[] = [
  {
    id: "ml-engineer",
    title: "ML Engineer Roadmap",
    icon: "🧠",
    description: "From Python basics to deploying production ML systems",
    totalDuration: "6-9 months",
    steps: [
      { title: "1. Python & Math Foundations", items: ["Python (OOP, decorators, generators)", "Linear Algebra (vectors, matrices, eigenvalues)", "Calculus (gradients, chain rule)", "Probability & Statistics"], duration: "6 weeks", resources: ["3Blue1Brown Linear Algebra", "Khan Academy Calculus", "Python docs"] },
      { title: "2. Data Science Essentials", items: ["NumPy & Pandas mastery", "Matplotlib & Seaborn visualization", "SQL for data analysis", "Exploratory Data Analysis (EDA)"], duration: "4 weeks", resources: ["Kaggle Learn", "Mode Analytics SQL", "Python Data Science Handbook"] },
      { title: "3. Classical ML", items: ["Scikit-learn: regression, classification, clustering", "Feature engineering & selection", "Cross-validation & hyperparameter tuning", "Ensemble methods (Random Forest, XGBoost)"], duration: "6 weeks", resources: ["Scikit-learn docs", "Hands-On ML (Géron)", "Kaggle competitions"] },
      { title: "4. Deep Learning", items: ["PyTorch fundamentals", "CNNs for computer vision", "RNNs/LSTMs for sequences", "Transformers & attention mechanism"], duration: "8 weeks", resources: ["fast.ai course", "PyTorch tutorials", "d2l.ai (Dive into DL)"] },
      { title: "5. MLOps & Deployment", items: ["Docker containerization", "FastAPI/Flask model serving", "CI/CD with GitHub Actions", "Model monitoring & drift detection"], duration: "4 weeks", resources: ["Made With ML", "Full Stack Deep Learning", "MLOps Zoomcamp"] },
      { title: "6. Specialization & Portfolio", items: ["Choose: NLP, CV, or RecSys focus", "Build 3-5 portfolio projects", "Contribute to open-source ML", "Write technical blog posts"], duration: "Ongoing", resources: ["Papers With Code", "Hugging Face", "GitHub"] },
    ]
  },
  {
    id: "llm-ai-engineer",
    title: "AI/LLM Engineer Roadmap",
    icon: "💬",
    description: "Master LLMs, RAG, agents, and production AI applications",
    totalDuration: "4-6 months",
    steps: [
      { title: "1. LLM Foundations", items: ["Transformer architecture deep dive", "Tokenization (BPE, WordPiece, SentencePiece)", "Pre-training vs fine-tuning", "Scaling laws & emergent abilities"], duration: "3 weeks", resources: ["Attention Is All You Need paper", "Andrej Karpathy's videos", "Hugging Face NLP Course"] },
      { title: "2. Prompt Engineering", items: ["Zero/few-shot prompting", "Chain-of-thought reasoning", "Self-consistency & majority voting", "Structured output (JSON mode, function calling)"], duration: "2 weeks", resources: ["OpenAI Cookbook", "Anthropic prompt guide", "PromptingGuide.ai"] },
      { title: "3. RAG Pipelines", items: ["Document loading & chunking strategies", "Embedding models (OpenAI, Cohere, open-source)", "Vector databases (Qdrant, Pinecone, ChromaDB)", "Hybrid search & reranking"], duration: "4 weeks", resources: ["LangChain docs", "LlamaIndex docs", "Qdrant tutorials"] },
      { title: "4. Fine-Tuning LLMs", items: ["LoRA & QLoRA techniques", "Dataset curation & quality", "Evaluation: perplexity, BLEU, human eval", "Merging & deploying fine-tuned models"], duration: "4 weeks", resources: ["Hugging Face PEFT", "Axolotl", "OpenAI fine-tuning guide"] },
      { title: "5. AI Agents & Tools", items: ["ReAct pattern implementation", "Tool use & function calling", "Multi-agent orchestration", "Memory systems (short & long term)"], duration: "3 weeks", resources: ["LangGraph docs", "AutoGen", "CrewAI"] },
      { title: "6. Production AI", items: ["Guardrails & content filtering", "Caching strategies (semantic cache)", "Cost optimization & token budgets", "Observability (LangSmith, Helicone)"], duration: "3 weeks", resources: ["Guardrails AI", "LangSmith docs", "Weights & Biases"] },
    ]
  },
  {
    id: "data-engineer",
    title: "Data Engineer Roadmap",
    icon: "🔄",
    description: "Build scalable data pipelines, warehouses, and streaming systems",
    totalDuration: "5-8 months",
    steps: [
      { title: "1. SQL & Python Mastery", items: ["Advanced SQL (window functions, CTEs, recursive)", "Python for data processing", "Regular expressions", "Shell scripting & CLI tools"], duration: "4 weeks", resources: ["SQLZoo", "LeetCode SQL", "Automate the Boring Stuff"] },
      { title: "2. Data Modeling", items: ["Star & snowflake schemas", "Data normalization (1NF-3NF)", "Slowly changing dimensions (SCD)", "Data vault modeling"], duration: "3 weeks", resources: ["Kimball's Data Warehouse Toolkit", "dbt docs", "Data Modeling Made Simple"] },
      { title: "3. Batch Processing", items: ["Apache Spark (PySpark)", "Distributed computing concepts", "Partitioning & bucketing", "Performance tuning"], duration: "5 weeks", resources: ["Spark: The Definitive Guide", "Databricks Academy", "PySpark docs"] },
      { title: "4. Streaming Systems", items: ["Apache Kafka fundamentals", "Stream processing (Flink/Spark Streaming)", "Exactly-once semantics", "Event-driven architectures"], duration: "4 weeks", resources: ["Kafka: The Definitive Guide", "Confluent tutorials", "Designing Data-Intensive Apps"] },
      { title: "5. Orchestration & Quality", items: ["Apache Airflow DAGs", "dbt for analytics engineering", "Great Expectations for data quality", "Data lineage & cataloging"], duration: "4 weeks", resources: ["Airflow docs", "dbt Learn", "DataHub"] },
      { title: "6. Cloud & Infrastructure", items: ["AWS (S3, Glue, Redshift, EMR)", "GCP (BigQuery, Dataflow, Pub/Sub)", "Terraform for data infra", "Cost management & FinOps"], duration: "4 weeks", resources: ["AWS docs", "GCP docs", "Terraform tutorials"] },
    ]
  },
  {
    id: "devops-sre",
    title: "DevOps / SRE Roadmap",
    icon: "🚀",
    description: "Master containers, orchestration, CI/CD, and infrastructure as code",
    totalDuration: "5-7 months",
    steps: [
      { title: "1. Linux & Networking", items: ["Linux administration & systemd", "Networking (TCP/IP, DNS, HTTP)", "Shell scripting (Bash)", "SSH, firewalls, load balancers"], duration: "4 weeks", resources: ["Linux Academy", "Networking Fundamentals", "TLDR pages"] },
      { title: "2. Containers & Docker", items: ["Dockerfile best practices", "Multi-stage builds", "Docker Compose", "Container security"], duration: "3 weeks", resources: ["Docker docs", "Play with Docker", "Container Security (Rice)"] },
      { title: "3. Kubernetes", items: ["Pods, Deployments, Services", "ConfigMaps & Secrets", "Helm charts", "RBAC & Network Policies"], duration: "5 weeks", resources: ["Kubernetes docs", "KodeKloud", "CKAD prep"] },
      { title: "4. CI/CD Pipelines", items: ["GitHub Actions & GitLab CI", "Testing strategies", "Deployment patterns (blue/green, canary)", "ArgoCD for GitOps"], duration: "3 weeks", resources: ["GitHub Actions docs", "ArgoCD docs", "Continuous Delivery (Humble)"] },
      { title: "5. Infrastructure as Code", items: ["Terraform modules & state", "Ansible for configuration", "Pulumi (if using TypeScript)", "Cloud-specific IaC (CDK, CloudFormation)"], duration: "4 weeks", resources: ["Terraform docs", "Terraform Up & Running", "Ansible docs"] },
      { title: "6. Observability & SRE", items: ["Prometheus & Grafana", "ELK Stack (logs)", "Distributed tracing (Jaeger)", "SLIs, SLOs, Error budgets"], duration: "4 weeks", resources: ["SRE Book (Google)", "Prometheus docs", "Grafana tutorials"] },
    ]
  },
];

export default function Roadmaps() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="roadmaps-container">
      {ROADMAPS.map(roadmap => {
        const isExpanded = expandedId === roadmap.id;
        return (
          <div key={roadmap.id} className={`roadmap-card ${isExpanded ? 'roadmap-card--expanded' : ''}`}>
            <div className="roadmap-header" onClick={() => setExpandedId(isExpanded ? null : roadmap.id)}>
              <span className="roadmap-icon">{roadmap.icon}</span>
              <div className="roadmap-info">
                <h3 className="roadmap-title">{roadmap.title}</h3>
                <p className="roadmap-desc">{roadmap.description}</p>
                <span className="roadmap-duration">📅 {roadmap.totalDuration}</span>
              </div>
              <span className={`blog-chevron ${isExpanded ? 'blog-chevron--open' : ''}`}>↓</span>
            </div>

            {isExpanded && (
              <div className="roadmap-body">
                <div className="roadmap-timeline">
                  {roadmap.steps.map((step, i) => (
                    <div key={i} className="roadmap-step">
                      <div className="step-marker">
                        <div className="step-dot" />
                        {i < roadmap.steps.length - 1 && <div className="step-line" />}
                      </div>
                      <div className="step-content">
                        <div className="step-header">
                          <h4 className="step-title">{step.title}</h4>
                          <span className="step-dur">{step.duration}</span>
                        </div>
                        <div className="step-items">
                          {step.items.map((item, j) => (
                            <span key={j} className="step-item">▸ {item}</span>
                          ))}
                        </div>
                        <div className="step-resources">
                          <span className="step-res-label">📖 Resources:</span>
                          {step.resources.map((r, j) => (
                            <span key={j} className="step-resource">{r}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
