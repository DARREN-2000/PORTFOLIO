import { useState } from "react";

interface Chapter {
  title: string;
  sections: string[];
  summary: string;
  readTime: string;
}

interface Book {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  totalChapters: number;
  estimatedTime: string;
  description: string;
  audience: string[];
  chapters: Chapter[];
}

const BOOKS: Book[] = [
  {
    id: "ai-complete-guide",
    title: "The Complete AI & LLM Engineering Handbook",
    subtitle: "From Neural Networks to Production AI Agents",
    icon: "🤖",
    color: "#E20074",
    totalChapters: 16,
    estimatedTime: "~12 hours read",
    description: "A practitioner's guide covering everything from ML fundamentals to building production agentic AI systems. Written for engineers who want to understand and build modern AI — not just use APIs.",
    audience: ["Software Engineers moving to AI", "ML Engineers going to production", "Tech Leads evaluating AI architecture"],
    chapters: [
      {
        title: "Chapter 1: The AI Landscape in 2025",
        readTime: "20 min",
        summary: "Understanding where we are: from classical ML to foundation models, the shift from training to prompting, and why engineering skills matter more than ever in AI.",
        sections: [
          "1.1 Classical ML → Deep Learning → Foundation Models — the three eras",
          "1.2 The prompt engineering revolution: why fine-tuning isn't always the answer",
          "1.3 Open-source vs closed-source models: trade-offs (cost, privacy, customization)",
          "1.4 AI infrastructure stack: GPU clouds, inference engines, orchestration frameworks",
          "1.5 Career paths: ML Engineer, AI Engineer, MLOps Engineer — what's different?",
        ]
      },
      {
        title: "Chapter 2: Neural Network Foundations",
        readTime: "45 min",
        summary: "The building blocks: how neurons compute, how networks learn through backpropagation, and why depth and architecture matter.",
        sections: [
          "2.1 Neurons, weights, biases — the fundamental computation unit",
          "2.2 Activation functions: ReLU, GELU, SiLU — why non-linearity is everything",
          "2.3 Backpropagation: how gradients flow and why vanishing/exploding gradients break training",
          "2.4 Optimization: SGD → Adam → AdamW — what the optimizer actually does",
          "2.5 Regularization: Dropout, weight decay, batch normalization — preventing memorization",
          "2.6 Loss functions: cross-entropy, MSE, contrastive — choosing the right objective",
          "2.7 Hands-on: build a 3-layer neural network from scratch in NumPy",
        ]
      },
      {
        title: "Chapter 3: The Transformer Architecture",
        readTime: "50 min",
        summary: "The architecture behind GPT, BERT, and every modern LLM. Self-attention, multi-head attention, positional encoding — explained so you truly understand why it works.",
        sections: [
          "3.1 From RNNs to Attention: the sequential bottleneck problem",
          "3.2 Self-Attention: Query, Key, Value — the core mechanism with worked examples",
          "3.3 Multi-Head Attention: learning multiple relationship types in parallel",
          "3.4 Positional Encoding: how transformers know word order without recurrence",
          "3.5 Feed-Forward Networks, LayerNorm, Residual Connections — the full block",
          "3.6 Encoder-only (BERT) vs Decoder-only (GPT) vs Encoder-Decoder (T5)",
          "3.7 Scaling laws: why bigger models are predictably better (Chinchilla, Kaplan)",
          "3.8 Hands-on: implement a minimal GPT (150 lines of PyTorch)",
        ]
      },
      {
        title: "Chapter 4: Large Language Models Deep Dive",
        readTime: "45 min",
        summary: "How LLMs are trained (pre-training → SFT → RLHF), what emerges at scale, context windows, tokenization, and the practical implications.",
        sections: [
          "4.1 Pre-training: next-token prediction on trillions of tokens",
          "4.2 Tokenization: BPE, SentencePiece — why 'tokenization' ≠ 'words'",
          "4.3 Supervised Fine-Tuning (SFT): teaching models to follow instructions",
          "4.4 RLHF & DPO: aligning models with human preferences",
          "4.5 Emergent abilities: chain-of-thought, in-context learning, tool use",
          "4.6 Context windows: 4K → 128K → 1M tokens — implications for architecture",
          "4.7 Model comparison: GPT-4o vs Claude 3.5 vs Llama 3.1 vs Gemini",
          "4.8 Multimodal models: vision, audio, and the convergence trend",
        ]
      },
      {
        title: "Chapter 5: Prompt Engineering Mastery",
        readTime: "40 min",
        summary: "Beyond basic prompting: systematic techniques that reliably improve output quality, with real examples and failure modes.",
        sections: [
          "5.1 The Role-Context-Task-Format framework for any prompt",
          "5.2 Few-shot prompting: selecting good examples and ordering effects",
          "5.3 Chain-of-Thought: when it helps and when it hurts",
          "5.4 Self-Consistency: sample multiple CoT paths, majority vote",
          "5.5 Tree-of-Thought: exploring multiple reasoning branches",
          "5.6 Prompt chaining: breaking complex tasks into reliable sub-prompts",
          "5.7 System prompts: setting persistent behavior and constraints",
          "5.8 Common failure modes: sycophancy, hallucination, instruction gaps",
          "5.9 Evaluation: how to measure prompt quality systematically",
        ]
      },
      {
        title: "Chapter 6: Embeddings & Vector Search",
        readTime: "35 min",
        summary: "How text becomes numbers, why cosine similarity works, and practical vector database selection.",
        sections: [
          "6.1 Word embeddings: Word2Vec → GloVe → contextual (BERT)",
          "6.2 Sentence embeddings: why averaging word vectors fails",
          "6.3 Embedding models: text-embedding-3-small, BGE, E5, Cohere Embed",
          "6.4 Similarity metrics: cosine vs dot product vs Euclidean",
          "6.5 Vector databases: Pinecone, ChromaDB, Qdrant, pgvector — comparison",
          "6.6 Indexing algorithms: HNSW, IVF, PQ — speed vs recall trade-offs",
          "6.7 Hands-on: build a semantic search engine in 50 lines",
        ]
      },
      {
        title: "Chapter 7: RAG — Retrieval-Augmented Generation",
        readTime: "50 min",
        summary: "The complete RAG pipeline from document ingestion to answer generation with production patterns.",
        sections: [
          "7.1 Why RAG: hallucination reduction, knowledge grounding",
          "7.2 Document loading: PDF, HTML, Markdown, databases",
          "7.3 Chunking strategies: fixed-size, recursive, semantic, structure-aware",
          "7.4 The chunk size dilemma: too small = no context, too big = noise",
          "7.5 Retrieval: similarity search, MMR, hybrid (BM25 + vector)",
          "7.6 Re-ranking: cross-encoder re-rankers for precision",
          "7.7 Generation: grounded prompts, source attribution, handling unknowns",
          "7.8 Advanced: multi-query retrieval, HyDE, parent-child chunks",
          "7.9 Evaluation: RAGAS framework",
          "7.10 Hands-on: production RAG pipeline with LangChain + ChromaDB",
        ]
      },
      {
        title: "Chapter 8: AI Agents — Autonomous Systems",
        readTime: "50 min",
        summary: "Building AI systems that can reason, plan, and act. From ReAct to multi-agent orchestration.",
        sections: [
          "8.1 Perception → reasoning → action → observation loop",
          "8.2 ReAct pattern: interleaving reasoning and action",
          "8.3 Function calling: OpenAI tools, Anthropic tool_use",
          "8.4 Tool design: effective tool descriptions and schemas",
          "8.5 Agent memory: conversation, summary, vector store long-term",
          "8.6 Planning: task decomposition, plan-and-execute, replanning",
          "8.7 Error recovery: retry logic, fallbacks, graceful degradation",
          "8.8 LangGraph: building stateful agent graphs",
          "8.9 Hands-on: build a research agent",
        ]
      },
      {
        title: "Chapter 9: Multi-Agent Systems",
        readTime: "40 min",
        summary: "Designing teams of specialized agents that collaborate and produce better results than any single agent.",
        sections: [
          "9.1 Why multi-agent: specialization, divide-and-conquer, quality through debate",
          "9.2 Supervisor pattern: orchestrator routes tasks to specialists",
          "9.3 Peer-to-peer: agents communicate directly",
          "9.4 Debate pattern: agents argue, synthesize the best answer",
          "9.5 Shared state: agents communicate through common state",
          "9.6 LangGraph multi-agent: StateGraph with conditional edges",
          "9.7 CrewAI: role-based agents with goals and backstories",
          "9.8 AutoGen: conversational multi-agent with code execution",
          "9.9 Evaluation: measuring multi-agent quality and cost",
        ]
      },
      {
        title: "Chapter 10: Model Context Protocol (MCP) & Tool Standards",
        readTime: "30 min",
        summary: "The emerging standard for connecting AI to the real world.",
        sections: [
          "10.1 The integration problem: N models × M tools = N×M integrations",
          "10.2 MCP architecture: Host → Client → Server (the USB-C analogy)",
          "10.3 Resources: exposing data sources",
          "10.4 Tools: exposing actions",
          "10.5 Prompts: reusable templates with dynamic arguments",
          "10.6 Building an MCP server: Python SDK walkthrough",
          "10.7 A2A: Google's agent-to-agent protocol",
          "10.8 The future: composable AI systems",
        ]
      },
      {
        title: "Chapter 11: Fine-Tuning LLMs",
        readTime: "45 min",
        summary: "When prompting isn't enough: LoRA, QLoRA, full fine-tuning — when to use each.",
        sections: [
          "11.1 When to fine-tune vs when to use RAG",
          "11.2 Data preparation: quality over quantity",
          "11.3 LoRA: low-rank adaptation — train 0.1% of parameters",
          "11.4 QLoRA: 4-bit quantized base + LoRA",
          "11.5 Hyperparameters: rank, alpha, learning rate, epochs",
          "11.6 Training infrastructure: TRL, Axolotl, OpenAI fine-tuning API",
          "11.7 Evaluation: perplexity, task-specific metrics, LLM-as-judge",
          "11.8 Deployment: merge weights, quantize, serve with vLLM or TGI",
        ]
      },
      {
        title: "Chapter 12: AI Safety & Guardrails",
        readTime: "35 min",
        summary: "Building AI that's safe, reliable, and trustworthy in production.",
        sections: [
          "12.1 Threat model: prompt injection, jailbreaks, data extraction",
          "12.2 Input guardrails: content moderation, injection detection",
          "12.3 Output guardrails: PII detection, hallucination checks",
          "12.4 Constitutional AI: teaching models to self-critique",
          "12.5 Red-teaming: systematic adversarial testing",
          "12.6 Cost controls: token budgets, rate limits, monitoring per user",
          "12.7 Observability: logging prompts/responses, latency tracking",
          "12.8 Compliance: GDPR, data retention, audit trails",
        ]
      },
      {
        title: "Chapter 13: MLOps — Production ML Systems",
        readTime: "40 min",
        summary: "Taking models from notebooks to production: experiment tracking, CI/CD for ML, model serving.",
        sections: [
          "13.1 MLOps maturity model: level 0 → level 3",
          "13.2 Experiment tracking: MLflow, Weights & Biases",
          "13.3 Data versioning: DVC, LakeFS",
          "13.4 Feature stores: Feast, Tecton",
          "13.5 Model serving: FastAPI, TorchServe, TGI, vLLM",
          "13.6 CI/CD for ML: testing data, models, and code",
          "13.7 Monitoring: data drift, performance degradation, alerting",
          "13.8 A/B testing: canary deployments, shadow mode",
        ]
      },
      {
        title: "Chapter 14: Inference Optimization",
        readTime: "35 min",
        summary: "Making models fast and cheap: quantization, batching, caching, speculative decoding.",
        sections: [
          "14.1 Quantization: INT8, INT4, GPTQ, AWQ, GGUF",
          "14.2 KV-cache: what it is and how to manage memory",
          "14.3 Batching: continuous batching in vLLM",
          "14.4 Speculative decoding: draft model for 2-3x speedup",
          "14.5 Flash Attention: IO-aware exact attention, 2-4x faster",
          "14.6 Prompt caching: reusing prefixes",
          "14.7 Distillation: training smaller models",
          "14.8 Cost optimization: model selection by task complexity",
        ]
      },
      {
        title: "Chapter 15: Building Production AI Applications",
        readTime: "40 min",
        summary: "Architecture patterns for real-world AI apps: streaming, error recovery, and user experience.",
        sections: [
          "15.1 Architecture: monolith vs microservices for AI apps",
          "15.2 Streaming: SSE, WebSockets — tokens as they generate",
          "15.3 Error handling: retry with backoff, fallback models",
          "15.4 Caching: semantic caching (similar queries → cached response)",
          "15.5 Rate limiting: per-user, per-model, cost-aware throttling",
          "15.6 Feedback loops: thumbs up/down → improve prompts",
          "15.7 Testing: unit tests for prompts, eval benchmarks",
          "15.8 Full-stack example: Next.js + FastAPI + LangGraph + PostgreSQL",
        ]
      },
      {
        title: "Chapter 16: The Future — What's Coming Next",
        readTime: "20 min",
        summary: "Emerging trends: reasoning models, multimodal agents, open-source, edge AI, and AI regulation.",
        sections: [
          "16.1 Reasoning models: o1, o3, DeepSeek-R1",
          "16.2 Multimodal agents: vision + speech + action",
          "16.3 Open-source trajectory: Llama, Mistral, DeepSeek",
          "16.4 AI coding assistants: Copilot, Cursor, Devin",
          "16.5 Edge AI: running models on phones and IoT devices",
          "16.6 AI regulation: EU AI Act, responsible AI frameworks",
        ]
      },
    ]
  },
  {
    id: "cicd-handbook",
    title: "The CI/CD & DevOps Engineering Handbook",
    subtitle: "From Git Push to Production — Automated, Reliable, Fast",
    icon: "⚡",
    color: "#FF9800",
    totalChapters: 12,
    estimatedTime: "~8 hours read",
    description: "A complete guide to building robust CI/CD pipelines, automating deployments, and managing infrastructure. From simple GitHub Actions to Kubernetes-based GitOps with zero-downtime deploys.",
    audience: ["Backend Engineers setting up CI/CD", "DevOps Engineers standardizing pipelines", "Team Leads improving deployment speed"],
    chapters: [
      {
        title: "Chapter 1: CI/CD Foundations",
        readTime: "25 min",
        summary: "Why CI/CD matters, the core concepts, and how modern teams ship 50+ deploys per day reliably.",
        sections: [
          "1.1 The problem: 'It works on my machine' → 'It works everywhere'",
          "1.2 Continuous Integration: merge often, test automatically, catch bugs early",
          "1.3 Continuous Delivery vs Deployment: the manual gate difference",
          "1.4 The CI/CD pipeline: code → build → test → stage → deploy → monitor",
          "1.5 Key metrics: lead time, deployment frequency, failure rate, recovery time (DORA)",
          "1.6 Tool landscape: GitHub Actions, GitLab CI, Jenkins, CircleCI, ArgoCD",
        ]
      },
      {
        title: "Chapter 2: Git Workflows for Teams",
        readTime: "30 min",
        summary: "Branching strategies: trunk-based development, GitFlow, and how to write commits that help your future self.",
        sections: [
          "2.1 Trunk-based development: short-lived branches, merge to main daily",
          "2.2 GitFlow: develop → feature → release → hotfix",
          "2.3 GitHub Flow: simple branch → PR → merge",
          "2.4 Conventional Commits: feat:, fix:, chore: — automated changelogs",
          "2.5 Pull Request best practices: small PRs, descriptive titles",
          "2.6 Branch protection: required reviews, status checks",
          "2.7 Monorepo strategies: Nx, Turborepo, path-based CI triggers",
        ]
      },
      {
        title: "Chapter 3: GitHub Actions Deep Dive",
        readTime: "45 min",
        summary: "Workflow syntax, reusable actions, matrix builds, caching, secrets, and real-world templates.",
        sections: [
          "3.1 Workflow anatomy: triggers, jobs, steps, runners",
          "3.2 Triggers: push, PR, schedule, workflow_dispatch",
          "3.3 Actions marketplace: checkout, setup-python, cache",
          "3.4 Matrix strategy: test across Python 3.10-3.12 × Ubuntu/macOS",
          "3.5 Caching: pip, npm, Docker layers — cut build times by 50-80%",
          "3.6 Secrets and OIDC: secure credential management",
          "3.7 Reusable workflows: DRY pipelines shared across repositories",
          "3.8 Self-hosted runners: when GitHub's runners aren't enough",
          "3.9 Hands-on: complete CI workflow for a Python + React project",
        ]
      },
      {
        title: "Chapter 4: Testing Strategies for CI",
        readTime: "35 min",
        summary: "What to test, when to test, and how to keep your test suite fast.",
        sections: [
          "4.1 The testing pyramid: many unit, some integration, few E2E",
          "4.2 Unit tests: fast, isolated, mock external dependencies",
          "4.3 Integration tests: real database, real API calls",
          "4.4 E2E tests: Playwright, Cypress — simulate real user flows",
          "4.5 Test parallelization: split tests across CI runners",
          "4.6 Code coverage: 80% is usually enough, 100% is a trap",
          "4.7 Snapshot testing: catch unintended UI changes",
          "4.8 ML model testing: data validation, performance thresholds",
        ]
      },
      {
        title: "Chapter 5: Docker for CI/CD",
        readTime: "40 min",
        summary: "Containerization for reproducible builds: multi-stage builds, layer caching, and security scanning.",
        sections: [
          "5.1 Why Docker for CI/CD: reproducible environments",
          "5.2 Multi-stage builds: separate build deps from runtime",
          "5.3 Layer caching: order your Dockerfile for maximum cache hits",
          "5.4 .dockerignore: exclude unnecessary files",
          "5.5 Security scanning: Trivy, Snyk",
          "5.6 Docker Compose for integration tests",
          "5.7 Container registries: ECR, GCR, GHCR, Docker Hub",
          "5.8 Hands-on: Dockerfile for a FastAPI ML model serving app",
        ]
      },
      {
        title: "Chapter 6: Infrastructure as Code",
        readTime: "40 min",
        summary: "Terraform for provisioning, Ansible for configuration, and how to structure IaC for teams.",
        sections: [
          "6.1 Why IaC: reproducibility, audit trail, peer review",
          "6.2 Terraform basics: providers, resources, variables, outputs",
          "6.3 Terraform state: remote backends, locking, workspaces",
          "6.4 Modules: reusable infrastructure components",
          "6.5 Terraform in CI: plan on PR, apply on merge",
          "6.6 AWS CDK / Pulumi: infrastructure in real languages",
          "6.7 Ansible: configuration management for servers",
          "6.8 Secrets management: AWS Secrets Manager, Vault, SOPS",
        ]
      },
      {
        title: "Chapter 7: Kubernetes for Deployment",
        readTime: "45 min",
        summary: "Container orchestration: deployments, services, scaling, and how to not get overwhelmed by K8s.",
        sections: [
          "7.1 Kubernetes concepts: pods, deployments, services, ingress",
          "7.2 Deployment strategies: rolling update, blue-green, canary",
          "7.3 Helm charts: templated Kubernetes manifests",
          "7.4 Health checks: liveness, readiness, startup probes",
          "7.5 Horizontal Pod Autoscaler: scale based on metrics",
          "7.6 Resource management: requests, limits, QoS classes",
          "7.7 Ingress controllers: nginx, Traefik",
          "7.8 When NOT to use Kubernetes: simpler alternatives",
        ]
      },
      {
        title: "Chapter 8: GitOps — Git as Single Source of Truth",
        readTime: "30 min",
        summary: "The GitOps paradigm: declare desired state in Git, let controllers reconcile.",
        sections: [
          "8.1 GitOps principles: declarative, versioned, automated, self-healing",
          "8.2 ArgoCD: install, configure, and sync",
          "8.3 Flux: lightweight alternative with HelmRelease",
          "8.4 Application sets: manage hundreds of microservices",
          "8.5 Environment promotion: dev → staging → prod with Git PRs",
          "8.6 Rollback: git revert → ArgoCD auto-syncs",
          "8.7 Secret management in GitOps: Sealed Secrets, SOPS",
        ]
      },
      {
        title: "Chapter 9: Monitoring & Observability",
        readTime: "35 min",
        summary: "Metrics, logs, traces — the three pillars of observability.",
        sections: [
          "9.1 Three pillars: metrics (Prometheus), logs (Loki/ELK), traces (Jaeger)",
          "9.2 Prometheus + Grafana: collect metrics, build dashboards",
          "9.3 Structured logging: JSON logs with correlation IDs",
          "9.4 Distributed tracing: follow a request across microservices",
          "9.5 Alerting: actionable alerts, on-call rotations, runbooks",
          "9.6 SLOs and error budgets: 99.9% = 8.7 hours downtime/year",
          "9.7 Synthetic monitoring: proactive health checks",
          "9.8 Cost monitoring: cloud spend dashboards, right-sizing",
        ]
      },
      {
        title: "Chapter 10: Security in CI/CD",
        readTime: "30 min",
        summary: "Shift-left security: scan code, dependencies, containers, and infrastructure.",
        sections: [
          "10.1 SAST: static code analysis (Semgrep, SonarQube)",
          "10.2 SCA: dependency scanning (Dependabot, Snyk)",
          "10.3 Container scanning: Trivy, Grype",
          "10.4 DAST: dynamic testing (OWASP ZAP)",
          "10.5 Secret scanning: GitLeaks, TruffleHog",
          "10.6 Supply chain security: SLSA, Sigstore",
          "10.7 OIDC authentication: no more long-lived keys",
          "10.8 Policy as code: OPA/Rego",
        ]
      },
      {
        title: "Chapter 11: Database Migrations & Stateful Deploys",
        readTime: "30 min",
        summary: "Deploying database changes safely: zero-downtime migrations, rollback strategies.",
        sections: [
          "11.1 Why DB migrations are hard: you can't just rollback data",
          "11.2 Migration tools: Alembic, Flyway, Prisma, Liquibase",
          "11.3 Zero-downtime migrations: expand-and-contract pattern",
          "11.4 Adding columns safely: nullable first → backfill → constraint",
          "11.5 Renaming columns: add new → copy → update app → drop old",
          "11.6 Large table migrations: online DDL, gh-ost",
          "11.7 Data seeding and fixtures in CI",
        ]
      },
      {
        title: "Chapter 12: Putting It All Together",
        readTime: "30 min",
        summary: "A complete reference pipeline: from code push to production, fully automated.",
        sections: [
          "12.1 Reference architecture: GitHub → Actions → Docker → ECR → ECS/K8s",
          "12.2 Pipeline stages: lint → test → build → scan → stage → deploy → monitor",
          "12.3 Environment management with Terraform workspaces",
          "12.4 Feature flags: LaunchDarkly, Unleash",
          "12.5 Incident response: detect → alert → mitigate → postmortem",
          "12.6 Measuring success: DORA metrics dashboard",
          "12.7 The cultural shift: blameless postmortems, deploy confidence",
        ]
      },
    ]
  },
  // ===== NEW BOOKS =====
  {
    id: "data-science-handbook",
    title: "The Data Science & Analytics Handbook",
    subtitle: "From Raw Data to Business Insights — A Practical Guide",
    icon: "📊",
    color: "#4CAF50",
    totalChapters: 14,
    estimatedTime: "~10 hours read",
    description: "Master the full data science workflow: from data wrangling and statistical analysis to machine learning and communicating results to stakeholders. Focused on practical skills with Python, SQL, and real datasets.",
    audience: ["Aspiring Data Scientists", "Analysts transitioning to DS", "Business stakeholders learning data literacy"],
    chapters: [
      {
        title: "Chapter 1: The Data Science Mindset",
        readTime: "20 min",
        summary: "What data science really is, how it differs from analytics and ML engineering, and the CRISP-DM process that structures every project.",
        sections: [
          "1.1 Data Science vs Analytics vs ML Engineering — role clarity",
          "1.2 CRISP-DM: Business Understanding → Data → Modeling → Deployment",
          "1.3 The data science toolkit: Python, SQL, Jupyter, Git",
          "1.4 Thinking statistically: correlation ≠ causation, Simpson's paradox",
          "1.5 Asking the right questions: framing business problems as data problems",
        ]
      },
      {
        title: "Chapter 2: Python for Data Science",
        readTime: "40 min",
        summary: "The essential Python skills for data work: NumPy arrays, Pandas DataFrames, and writing clean, reproducible analysis code.",
        sections: [
          "2.1 NumPy: arrays, broadcasting, vectorized operations — 100x faster than loops",
          "2.2 Pandas DataFrames: selection, filtering, groupby, pivot tables",
          "2.3 Data types: handling dates, categories, strings, and missing values",
          "2.4 Method chaining: clean, readable data transformations",
          "2.5 Performance: when to use Polars over Pandas (10-100x speed gains)",
          "2.6 Reproducibility: virtual environments, requirements.txt, seeds",
        ]
      },
      {
        title: "Chapter 3: SQL Mastery for Analytics",
        readTime: "45 min",
        summary: "SQL is the lingua franca of data. Master window functions, CTEs, and query optimization for real-world analytics.",
        sections: [
          "3.1 JOINs deep dive: INNER, LEFT, FULL, CROSS — when to use each",
          "3.2 Window functions: ROW_NUMBER, LAG, LEAD, running totals, moving averages",
          "3.3 CTEs and subqueries: writing readable, composable SQL",
          "3.4 Aggregation patterns: GROUP BY with HAVING, ROLLUP, CUBE",
          "3.5 Query optimization: EXPLAIN ANALYZE, indexing strategies, partitioning",
          "3.6 Advanced: recursive CTEs, LATERAL joins, ARRAY/JSON operations",
          "3.7 Hands-on: 10 real-world analytics queries (retention, cohorts, funnels)",
        ]
      },
      {
        title: "Chapter 4: Data Wrangling & Cleaning",
        readTime: "35 min",
        summary: "80% of data science is data cleaning. Master techniques for handling messy, incomplete, and inconsistent data.",
        sections: [
          "4.1 Missing data: MCAR, MAR, MNAR — detection and imputation strategies",
          "4.2 Outlier detection: IQR, Z-score, Isolation Forest — when to remove vs keep",
          "4.3 Data type issues: mixed types, encoding errors, timezone hell",
          "4.4 Deduplication: exact and fuzzy matching with Levenshtein distance",
          "4.5 Merging datasets: handling key mismatches, many-to-many joins",
          "4.6 Regular expressions for text extraction and validation",
          "4.7 Data quality frameworks: Great Expectations, Pandera",
        ]
      },
      {
        title: "Chapter 5: Exploratory Data Analysis",
        readTime: "35 min",
        summary: "The art of understanding your data before modeling. Distributions, correlations, patterns, and the questions that matter.",
        sections: [
          "5.1 Univariate analysis: histograms, box plots, density plots",
          "5.2 Bivariate analysis: scatter plots, correlation matrices, pair plots",
          "5.3 Categorical analysis: count plots, mosaic plots, chi-square tests",
          "5.4 Time series EDA: trend decomposition, seasonality, autocorrelation",
          "5.5 Automated EDA: ydata-profiling, sweetviz — when to use them",
          "5.6 The EDA checklist: 15 questions to ask every new dataset",
        ]
      },
      {
        title: "Chapter 6: Data Visualization",
        readTime: "40 min",
        summary: "Creating visualizations that tell stories: from Matplotlib basics to interactive Plotly dashboards.",
        sections: [
          "6.1 Grammar of Graphics: what makes a chart effective",
          "6.2 Matplotlib: the foundation — figures, axes, customization",
          "6.3 Seaborn: statistical visualizations made easy",
          "6.4 Plotly: interactive charts for web and dashboards",
          "6.5 Choosing the right chart: decision framework for 20+ chart types",
          "6.6 Color theory: colormaps, accessibility, avoiding misleading visuals",
          "6.7 Dashboard design: Streamlit, Plotly Dash, Gradio",
          "6.8 Hands-on: build a complete analytics dashboard",
        ]
      },
      {
        title: "Chapter 7: Statistical Foundations",
        readTime: "45 min",
        summary: "The statistics every data scientist must know: probability, distributions, hypothesis testing, and Bayesian thinking.",
        sections: [
          "7.1 Probability: conditional probability, Bayes' theorem, independence",
          "7.2 Distributions: Normal, Binomial, Poisson, Exponential — when each applies",
          "7.3 Central Limit Theorem: why it matters for everything in statistics",
          "7.4 Confidence intervals: interpretation, width, and sample size",
          "7.5 Hypothesis testing: t-test, chi-square, ANOVA, Mann-Whitney U",
          "7.6 P-value pitfalls: multiple testing, p-hacking, effect size matters more",
          "7.7 Bayesian statistics: priors, posteriors, and updating beliefs with data",
        ]
      },
      {
        title: "Chapter 8: A/B Testing & Experimentation",
        readTime: "35 min",
        summary: "Running experiments rigorously: sample size calculation, significance testing, and common pitfalls.",
        sections: [
          "8.1 Designing experiments: control, treatment, randomization",
          "8.2 Power analysis: how many samples do you need?",
          "8.3 Statistical significance vs practical significance",
          "8.4 Sequential testing: stop early without inflating false positives",
          "8.5 Multi-armed bandits: adaptive experimentation",
          "8.6 Common pitfalls: novelty effects, Simpson's paradox, peeking",
          "8.7 Communicating results: the executive summary template",
        ]
      },
      {
        title: "Chapter 9: Feature Engineering",
        readTime: "35 min",
        summary: "The art of creating informative features from raw data — often the difference between a good and great model.",
        sections: [
          "9.1 Numerical features: scaling, binning, log transforms, interactions",
          "9.2 Categorical features: one-hot, target encoding, embedding",
          "9.3 Text features: TF-IDF, word counts, sentiment scores",
          "9.4 Date features: day of week, holidays, cyclical encoding",
          "9.5 Aggregation features: rolling windows, lag features, cumulative sums",
          "9.6 Feature selection: mutual information, LASSO, recursive elimination",
          "9.7 Automated feature engineering: Featuretools, tsfresh",
        ]
      },
      {
        title: "Chapter 10: Machine Learning for Data Scientists",
        readTime: "45 min",
        summary: "The ML algorithms data scientists use most: regression, classification, clustering, and when to use each.",
        sections: [
          "10.1 The bias-variance tradeoff: why complex ≠ better",
          "10.2 Linear models: regression, LASSO, Ridge, ElasticNet",
          "10.3 Tree models: Decision Trees, Random Forest, XGBoost, LightGBM",
          "10.4 Classification metrics: precision, recall, F1, AUC-ROC, confusion matrix",
          "10.5 Regression metrics: MAE, RMSE, R², MAPE",
          "10.6 Cross-validation: K-fold, stratified, time series split",
          "10.7 Hyperparameter tuning: grid search, random search, Optuna",
          "10.8 Model interpretation: SHAP, LIME, feature importance",
        ]
      },
      {
        title: "Chapter 11: Time Series Analysis",
        readTime: "40 min",
        summary: "Analyzing and forecasting time-dependent data: decomposition, ARIMA, Prophet, and modern approaches.",
        sections: [
          "11.1 Time series components: trend, seasonality, residuals",
          "11.2 Stationarity: ADF test, differencing, transformations",
          "11.3 ARIMA: understanding p, d, q parameters",
          "11.4 Facebook Prophet: automatic seasonality, holidays, changepoints",
          "11.5 Feature-based forecasting: lag features + XGBoost",
          "11.6 Evaluation: backtesting, walk-forward validation, MAPE vs RMSE",
          "11.7 Anomaly detection in time series: Z-score, Isolation Forest, LSTM",
        ]
      },
      {
        title: "Chapter 12: Clustering & Unsupervised Learning",
        readTime: "30 min",
        summary: "Finding patterns without labels: customer segmentation, anomaly detection, and dimensionality reduction.",
        sections: [
          "12.1 K-Means: the classic — choosing K with elbow and silhouette",
          "12.2 DBSCAN: density-based clustering for arbitrary shapes",
          "12.3 Hierarchical clustering: dendrograms and agglomerative methods",
          "12.4 Dimensionality reduction: PCA, t-SNE, UMAP — visualization vs feature",
          "12.5 Customer segmentation: RFM analysis + clustering",
          "12.6 Evaluating clusters: silhouette, Davies-Bouldin, business validation",
        ]
      },
      {
        title: "Chapter 13: Communicating with Data",
        readTime: "30 min",
        summary: "The most underrated data science skill: telling compelling stories with data to drive business decisions.",
        sections: [
          "13.1 The pyramid principle: lead with the answer, support with data",
          "13.2 Executive presentations: 5 slides that tell the whole story",
          "13.3 Technical reports: reproducible notebooks with clear narratives",
          "13.4 Dashboard design: what to show, what to hide, interactivity",
          "13.5 Common mistakes: too many charts, vanity metrics, missing context",
          "13.6 Stakeholder management: translating business questions to data questions",
        ]
      },
      {
        title: "Chapter 14: Career & Portfolio",
        readTime: "20 min",
        summary: "Building a data science career: portfolio projects, interview preparation, and continuous learning.",
        sections: [
          "14.1 Building a portfolio: 3-5 projects that showcase end-to-end skills",
          "14.2 Project ideas: customer churn prediction, NLP analysis, recommendation engine",
          "14.3 Interview preparation: SQL, statistics, ML, case studies",
          "14.4 The take-home assignment: structure, presentation, edge cases",
          "14.5 Continuous learning: papers, Kaggle, communities, conferences",
        ]
      },
    ]
  },
  {
    id: "system-design-book",
    title: "The System Design for ML Handbook",
    subtitle: "Architect Scalable, Reliable Machine Learning Systems",
    icon: "🏛️",
    color: "#9C27B0",
    totalChapters: 12,
    estimatedTime: "~9 hours read",
    description: "A complete guide to designing ML systems that scale. From recommendation engines to fraud detection, search ranking to real-time inference — with architecture diagrams and trade-off analysis.",
    audience: ["ML Engineers preparing for system design interviews", "Senior Engineers designing ML architecture", "Tech Leads building ML platforms"],
    chapters: [
      {
        title: "Chapter 1: ML System Design Framework",
        readTime: "30 min",
        summary: "A structured approach to designing ML systems: problem scoping, metrics, data strategy, and architecture patterns.",
        sections: [
          "1.1 The 4-step framework: Scope → Data → Model → Deploy",
          "1.2 Clarifying requirements: latency, throughput, freshness, cost budgets",
          "1.3 Offline vs online metrics: proxy metrics and their pitfalls",
          "1.4 Data availability: what data exists vs what you wish existed",
          "1.5 Architecture patterns: batch, real-time, hybrid, lambda architecture",
          "1.6 Common mistakes: premature optimization, over-engineering, ignoring data",
        ]
      },
      {
        title: "Chapter 2: Recommendation Systems at Scale",
        readTime: "50 min",
        summary: "From Netflix to Spotify: how recommendation systems work, scale, and evolve in production.",
        sections: [
          "2.1 Candidate generation: collaborative filtering, content-based, graph-based",
          "2.2 Ranking: learn-to-rank models, feature engineering for recommendations",
          "2.3 The cold-start problem: new users, new items, and hybrid approaches",
          "2.4 Two-tower architecture: separate user and item encoders",
          "2.5 Real-time personalization: feature stores + online models",
          "2.6 Diversity and exploration: avoiding filter bubbles",
          "2.7 Evaluation: offline (NDCG, MAP) vs online (CTR, engagement) metrics",
          "2.8 Case study: design YouTube's recommendation system",
        ]
      },
      {
        title: "Chapter 3: Search & Ranking Systems",
        readTime: "45 min",
        summary: "How Google, Amazon, and LinkedIn build search: from inverted indices to learned ranking.",
        sections: [
          "3.1 Search architecture: query understanding → retrieval → ranking → re-ranking",
          "3.2 Query understanding: spell correction, intent classification, expansion",
          "3.3 Retrieval: inverted index (BM25), dense retrieval (embeddings), hybrid",
          "3.4 Learning-to-rank: pointwise, pairwise, listwise approaches",
          "3.5 Features for ranking: relevance, freshness, popularity, personalization",
          "3.6 Real-time indexing: handling updates with near-zero latency",
          "3.7 Case study: design LinkedIn's job search ranking",
        ]
      },
      {
        title: "Chapter 4: Fraud & Anomaly Detection",
        readTime: "40 min",
        summary: "Designing real-time fraud detection: feature engineering, model architecture, and human-in-the-loop.",
        sections: [
          "4.1 Fraud detection architecture: streaming features + real-time scoring",
          "4.2 Feature engineering: velocity features, graph features, behavioral patterns",
          "4.3 Dealing with class imbalance: SMOTE, focal loss, cost-sensitive learning",
          "4.4 Graph-based fraud: detecting fraud rings with GNNs",
          "4.5 Rules + ML hybrid: business rules as a first filter, ML for nuance",
          "4.6 Human-in-the-loop: flagging uncertain cases for review",
          "4.7 Case study: design a payment fraud detection system",
        ]
      },
      {
        title: "Chapter 5: Ad Prediction & Click-Through Rate",
        readTime: "40 min",
        summary: "The billion-dollar models: how ad systems predict clicks, optimize bids, and maximize revenue.",
        sections: [
          "5.1 Ad serving pipeline: ad request → candidate selection → auction → rendering",
          "5.2 CTR prediction: logistic regression → Wide&Deep → DeepFM",
          "5.3 Feature engineering: user features, ad features, context features",
          "5.4 Real-time bidding: predicting value, budget pacing",
          "5.5 Calibration: making predicted probabilities trustworthy",
          "5.6 Multi-objective optimization: clicks, conversions, revenue, user experience",
          "5.7 Case study: design Facebook's ad targeting system",
        ]
      },
      {
        title: "Chapter 6: Content Moderation & Safety",
        readTime: "35 min",
        summary: "Building automated content moderation: text, image, and video classification at scale.",
        sections: [
          "6.1 Multi-modal moderation: text + image + video + audio",
          "6.2 Taxonomy: hate speech, violence, misinformation, spam, CSAM",
          "6.3 Model architecture: ensemble of specialized classifiers",
          "6.4 Human-in-the-loop: confidence thresholds and review queues",
          "6.5 Handling adversarial content: text obfuscation, image manipulation",
          "6.6 Fairness: avoiding bias in moderation (dialect, cultural context)",
          "6.7 Case study: design TikTok's content moderation pipeline",
        ]
      },
      {
        title: "Chapter 7: Real-Time ML Infrastructure",
        readTime: "45 min",
        summary: "The infrastructure behind sub-100ms ML predictions: feature stores, model serving, and caching.",
        sections: [
          "7.1 Feature serving architecture: offline compute → online store (Redis)",
          "7.2 Streaming features: Kafka → Flink → Redis in real-time",
          "7.3 Model serving: TorchServe vs Triton vs vLLM vs custom",
          "7.4 Caching: response caching, embedding caching, feature caching",
          "7.5 Load balancing: GPU-aware routing, queue-based autoscaling",
          "7.6 Fallback strategies: model degradation, rule-based fallback",
          "7.7 Latency optimization: batching, quantization, model distillation",
        ]
      },
      {
        title: "Chapter 8: Conversational AI & Chatbots",
        readTime: "40 min",
        summary: "Designing production chatbots: intent routing, RAG integration, guardrails, and conversation management.",
        sections: [
          "8.1 Chatbot architecture: intent classifier → router → specialized handlers",
          "8.2 RAG for chatbots: knowledge base integration, source attribution",
          "8.3 Conversation management: context window, summarization, memory",
          "8.4 Guardrails: topic boundaries, PII detection, hallucination prevention",
          "8.5 Multi-turn reasoning: maintaining state across complex dialogues",
          "8.6 Handoff to human: confidence-based escalation",
          "8.7 Case study: design a customer support chatbot for a telco",
        ]
      },
      {
        title: "Chapter 9: Autonomous Vehicles & Robotics ML",
        readTime: "40 min",
        summary: "Safety-critical ML systems: perception, prediction, planning, and the unique challenges of real-world deployment.",
        sections: [
          "9.1 Perception pipeline: camera, LiDAR, radar fusion",
          "9.2 Object detection and tracking: YOLO, CenterPoint, multi-object tracking",
          "9.3 Prediction: forecasting other agents' trajectories",
          "9.4 Planning: route planning, behavior planning, motion planning",
          "9.5 Safety: redundancy, fallback behaviors, operational design domain",
          "9.6 Simulation: testing millions of scenarios before deployment",
          "9.7 Validation: ISO 26262, SOTIF, and statistical safety arguments",
        ]
      },
      {
        title: "Chapter 10: Data Platform Architecture",
        readTime: "35 min",
        summary: "The data infrastructure that powers ML: data lakes, warehouses, lakehouses, and feature stores.",
        sections: [
          "10.1 Data lake vs warehouse vs lakehouse — when to use each",
          "10.2 Batch pipelines: Spark, Airflow, dbt — the modern data stack",
          "10.3 Streaming pipelines: Kafka, Flink, real-time feature computation",
          "10.4 Feature stores: offline + online serving, feature versioning",
          "10.5 Data quality: Great Expectations, monitoring, alerting",
          "10.6 Data governance: lineage, catalog, access control",
        ]
      },
      {
        title: "Chapter 11: ML Platform Design",
        readTime: "35 min",
        summary: "Building an internal ML platform: experiment tracking, model registry, serving, and monitoring.",
        sections: [
          "11.1 ML platform components: experimentation → training → serving → monitoring",
          "11.2 Experiment tracking: MLflow, W&B — design decisions",
          "11.3 Model registry: versioning, promotion gates, rollback",
          "11.4 Training infrastructure: Kubernetes, GPU management, spot instances",
          "11.5 Model serving: multi-model serving, A/B testing, shadow mode",
          "11.6 Monitoring: data drift, model performance, infrastructure health",
          "11.7 Self-service: making ML accessible to product teams",
        ]
      },
      {
        title: "Chapter 12: Interview Preparation",
        readTime: "30 min",
        summary: "How to approach ML system design interviews: framework, communication, and common questions.",
        sections: [
          "12.1 Interview format: 45 minutes to design a complete ML system",
          "12.2 Communication: whiteboarding, structured thinking, trade-off analysis",
          "12.3 Common questions: recommend, rank, detect, classify, generate",
          "12.4 What interviewers look for: problem scoping, data intuition, depth",
          "12.5 Practice problems with worked solutions",
          "12.6 Resources: papers, blogs, and books for further study",
        ]
      },
    ]
  },
];

export default function Books() {
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  const toggleChapter = (idx: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="books-container">
      {BOOKS.map(book => {
        const isExpanded = expandedBook === book.id;
        return (
          <div key={book.id} className="book-card" style={{ '--book-accent': book.color } as React.CSSProperties}>
            <div className="book-cover" onClick={() => { setExpandedBook(isExpanded ? null : book.id); setExpandedChapters(new Set()); }}>
              <div className="book-spine" style={{ background: book.color }} />
              <div className="book-cover-content">
                <span className="book-icon">{book.icon}</span>
                <div className="book-meta-top">
                  <span className="book-chapters-badge">{book.totalChapters} Chapters</span>
                  <span className="book-time-badge">{book.estimatedTime}</span>
                </div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-subtitle">{book.subtitle}</p>
                <p className="book-desc">{book.description}</p>
                <div className="book-audience">
                  {book.audience.map((a, i) => <span key={i} className="book-audience-tag">👤 {a}</span>)}
                </div>
                <span className={`blog-chevron ${isExpanded ? 'blog-chevron--open' : ''}`}>
                  ↓ {isExpanded ? 'Close Book' : 'Read Table of Contents'}
                </span>
              </div>
            </div>

            {isExpanded && (
              <div className="book-toc">
                <h4 className="book-toc-title">📖 Table of Contents</h4>
                <div className="book-progress-bar">
                  <div className="book-progress-track">
                    <div className="book-progress-fill" style={{ width: '0%', background: book.color }} />
                  </div>
                  <span className="book-progress-label">0% — Start reading</span>
                </div>
                <div className="book-chapters">
                  {book.chapters.map((ch, idx) => {
                    const chExpanded = expandedChapters.has(idx);
                    return (
                      <div key={idx} className={`book-chapter ${chExpanded ? 'book-chapter--expanded' : ''}`}>
                        <div className="book-chapter-header" onClick={(e) => { e.stopPropagation(); toggleChapter(idx); }}>
                          <span className="book-chapter-num" style={{ background: book.color }}>{idx + 1}</span>
                          <div className="book-chapter-info">
                            <h5 className="book-chapter-title">{ch.title}</h5>
                            <span className="book-chapter-time">⏱ {ch.readTime}</span>
                          </div>
                          <span className={`learn-chevron ${chExpanded ? 'learn-chevron--open' : ''}`}>↓</span>
                        </div>
                        {chExpanded && (
                          <div className="book-chapter-body">
                            <p className="book-chapter-summary">{ch.summary}</p>
                            <div className="book-sections">
                              {ch.sections.map((sec, si) => (
                                <div key={si} className="book-section-item">
                                  <span className="book-section-bullet" style={{ background: book.color }} />
                                  <span className="book-section-text">{sec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
