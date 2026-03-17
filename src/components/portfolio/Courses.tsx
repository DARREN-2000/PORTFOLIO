import { useState } from "react";

interface CourseModule {
  title: string;
  topics: string[];
  duration: string;
}

interface Course {
  id: string;
  title: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  description: string;
  learningOutcomes: string[];
  modules: CourseModule[];
  prerequisites: string[];
  tools: string[];
}

const COURSES: Course[] = [
  {
    id: "ml-fundamentals",
    title: "Machine Learning A-Z: Complete Guide",
    icon: "🧠",
    level: "Beginner",
    duration: "40 hours",
    description: "Go from zero to building and deploying ML models. Covers math foundations, classical algorithms, deep learning, and production deployment.",
    learningOutcomes: [
      "Understand linear algebra, calculus & probability for ML",
      "Implement regression, classification & clustering from scratch",
      "Build neural networks with PyTorch",
      "Deploy models with FastAPI & Docker",
      "Evaluate & monitor models in production"
    ],
    prerequisites: ["Basic Python knowledge", "High school math"],
    tools: ["Python", "NumPy", "Pandas", "Scikit-learn", "PyTorch", "Docker"],
    modules: [
      { title: "1. Math Foundations", topics: ["Linear Algebra", "Calculus", "Probability & Statistics", "Optimization Theory"], duration: "6h" },
      { title: "2. Data Preprocessing", topics: ["Pandas & NumPy", "Feature Engineering", "Handling Missing Data", "Data Visualization"], duration: "5h" },
      { title: "3. Supervised Learning", topics: ["Linear/Logistic Regression", "Decision Trees & Random Forests", "SVM & KNN", "Cross-Validation"], duration: "8h" },
      { title: "4. Unsupervised Learning", topics: ["K-Means Clustering", "PCA & Dimensionality Reduction", "DBSCAN", "Anomaly Detection"], duration: "5h" },
      { title: "5. Deep Learning", topics: ["Neural Networks from Scratch", "CNNs for Computer Vision", "RNNs & LSTMs", "Transfer Learning"], duration: "8h" },
      { title: "6. Production ML", topics: ["Model Serialization", "FastAPI Endpoints", "Docker Containerization", "CI/CD Pipelines"], duration: "5h" },
      { title: "7. Capstone Project", topics: ["End-to-End ML Pipeline", "Data Collection to Deployment", "Monitoring & Retraining", "Portfolio Presentation"], duration: "3h" },
    ]
  },
  {
    id: "llm-engineering",
    title: "LLM Engineering: Build AI Applications",
    icon: "💬",
    level: "Intermediate",
    duration: "30 hours",
    description: "Master Large Language Models from prompt engineering to fine-tuning. Build RAG systems, AI agents, and production LLM applications.",
    learningOutcomes: [
      "Design effective prompts with advanced techniques",
      "Build production RAG pipelines with vector databases",
      "Fine-tune LLMs with LoRA & QLoRA",
      "Create autonomous AI agents with tool use",
      "Deploy and monitor LLM applications at scale"
    ],
    prerequisites: ["Python proficiency", "Basic ML knowledge", "API experience"],
    tools: ["OpenAI API", "LangChain", "ChromaDB", "Hugging Face", "Qdrant"],
    modules: [
      { title: "1. LLM Fundamentals", topics: ["Transformer Architecture", "Tokenization & Embeddings", "Attention Mechanism", "Scaling Laws"], duration: "4h" },
      { title: "2. Prompt Engineering", topics: ["Zero/Few-Shot Prompting", "Chain-of-Thought", "Self-Consistency", "Prompt Templates"], duration: "4h" },
      { title: "3. RAG Systems", topics: ["Document Chunking", "Embedding Models", "Vector Databases", "Hybrid Search"], duration: "6h" },
      { title: "4. Fine-Tuning", topics: ["Full Fine-Tuning vs LoRA", "QLoRA & 4-bit Quantization", "Dataset Preparation", "Evaluation Metrics"], duration: "5h" },
      { title: "5. AI Agents", topics: ["ReAct Pattern", "Tool Use & Function Calling", "Multi-Agent Systems", "Memory & Planning"], duration: "5h" },
      { title: "6. Production LLMs", topics: ["Guardrails & Safety", "Caching & Rate Limiting", "Cost Optimization", "Monitoring & Observability"], duration: "4h" },
      { title: "7. Capstone: AI Assistant", topics: ["Full-Stack AI App", "Multi-Modal Inputs", "User Feedback Loop", "A/B Testing Prompts"], duration: "2h" },
    ]
  },
  {
    id: "mlops-pipeline",
    title: "MLOps: End-to-End Pipeline Mastery",
    icon: "⚙️",
    level: "Advanced",
    duration: "35 hours",
    description: "Build robust ML pipelines from data ingestion to production monitoring. Master Kubernetes, Terraform, CI/CD, and observability for ML systems.",
    learningOutcomes: [
      "Design scalable ML architecture patterns",
      "Automate training & deployment with CI/CD",
      "Monitor model drift and data quality",
      "Manage infrastructure with Terraform",
      "Orchestrate ML workflows with Airflow"
    ],
    prerequisites: ["ML experience", "Docker basics", "Cloud familiarity (AWS/GCP)"],
    tools: ["Kubernetes", "Terraform", "MLflow", "Airflow", "Prometheus", "Grafana"],
    modules: [
      { title: "1. MLOps Foundations", topics: ["ML System Design", "Maturity Model Levels", "Team Topology", "Tool Landscape"], duration: "4h" },
      { title: "2. Data Engineering", topics: ["Feature Stores", "Data Validation (Great Expectations)", "DVC for Data Versioning", "ETL/ELT Pipelines"], duration: "5h" },
      { title: "3. Model Training", topics: ["Experiment Tracking (MLflow)", "Hyperparameter Optimization", "Distributed Training", "GPU Management"], duration: "5h" },
      { title: "4. CI/CD for ML", topics: ["GitHub Actions Pipelines", "Model Validation Gates", "Canary Deployments", "Rollback Strategies"], duration: "5h" },
      { title: "5. Infrastructure", topics: ["Kubernetes for ML", "Terraform Modules", "Spot Instances for Training", "Auto-Scaling Inference"], duration: "6h" },
      { title: "6. Monitoring", topics: ["Data Drift Detection (PSI)", "Model Performance Tracking", "Alerting & Dashboards", "Automated Retraining"], duration: "5h" },
      { title: "7. Capstone: Full Pipeline", topics: ["End-to-End Automated Pipeline", "Multi-Environment Deploy", "SLA & Error Budgets", "Documentation"], duration: "5h" },
    ]
  },
  {
    id: "data-engineering",
    title: "Data Engineering with Python & Cloud",
    icon: "🔄",
    level: "Intermediate",
    duration: "28 hours",
    description: "Learn to build scalable data pipelines, design data warehouses, and manage real-time streaming systems on AWS and GCP.",
    learningOutcomes: [
      "Build ETL/ELT pipelines with Apache Airflow",
      "Design star/snowflake schema data warehouses",
      "Implement real-time streaming with Kafka",
      "Master SQL for analytics at scale",
      "Deploy data infrastructure with IaC"
    ],
    prerequisites: ["SQL knowledge", "Python basics", "Cloud account (AWS/GCP)"],
    tools: ["Apache Airflow", "Apache Kafka", "dbt", "Snowflake", "AWS S3/Redshift"],
    modules: [
      { title: "1. Data Architecture", topics: ["Data Lake vs Warehouse vs Lakehouse", "Schema Design Patterns", "Data Modeling", "Partitioning Strategies"], duration: "4h" },
      { title: "2. Batch Processing", topics: ["Apache Spark Fundamentals", "PySpark DataFrames", "Efficient Joins & Aggregations", "Output Partitioning"], duration: "5h" },
      { title: "3. Orchestration", topics: ["Apache Airflow DAGs", "Task Dependencies", "Sensors & Hooks", "Error Handling & Retries"], duration: "5h" },
      { title: "4. Streaming", topics: ["Kafka Producers & Consumers", "Stream Processing", "Exactly-Once Semantics", "Window Functions"], duration: "5h" },
      { title: "5. Analytics Engineering", topics: ["dbt Models & Tests", "Incremental Materialization", "Data Quality Checks", "Documentation"], duration: "4h" },
      { title: "6. Cloud Infrastructure", topics: ["AWS S3/Glue/Redshift", "GCP BigQuery", "Terraform for Data Infra", "Cost Management"], duration: "5h" },
    ]
  },
  {
    id: "ai-agents-course",
    title: "AI Agents: Build Autonomous Systems",
    icon: "🤖",
    level: "Advanced",
    duration: "32 hours",
    description: "Master the art of building AI agents that can reason, plan, use tools, and collaborate. From single agents to multi-agent orchestration with LangGraph and CrewAI.",
    learningOutcomes: [
      "Build ReAct agents with tool use and function calling",
      "Design multi-agent systems with LangGraph",
      "Implement safety guardrails and human-in-the-loop patterns",
      "Create production-grade agentic RAG systems",
      "Deploy and monitor agent systems at scale"
    ],
    prerequisites: ["Python proficiency", "LLM API experience", "Basic RAG knowledge"],
    tools: ["LangGraph", "CrewAI", "OpenAI API", "Anthropic API", "MCP"],
    modules: [
      { title: "1. Agent Fundamentals", topics: ["What Makes an Agent", "ReAct Pattern", "Tool Use & Function Calling", "Agent Memory Types"], duration: "5h" },
      { title: "2. Building Single Agents", topics: ["LangChain Agent Framework", "Custom Tool Creation", "Structured Output Parsing", "Error Recovery Patterns"], duration: "5h" },
      { title: "3. Agentic RAG", topics: ["Query Planning Agent", "Multi-Source Retrieval", "Self-Evaluation & Retry", "Adaptive Chunking Strategies"], duration: "5h" },
      { title: "4. Multi-Agent Systems", topics: ["Supervisor Pattern", "Debate & Consensus", "LangGraph StateGraph", "Shared Memory & Communication"], duration: "6h" },
      { title: "5. CrewAI & AutoGen", topics: ["Role-Based Agents (CrewAI)", "Conversational Agents (AutoGen)", "Group Chat Patterns", "Framework Comparison"], duration: "4h" },
      { title: "6. Safety & Guardrails", topics: ["Input/Output Validation", "Cost & Token Budgets", "Human-in-the-Loop", "Audit Logging & Compliance"], duration: "3h" },
      { title: "7. Production Deployment", topics: ["Async Agent Execution", "Streaming UI Updates", "Monitoring & Observability", "Scaling Multi-Agent Workloads"], duration: "4h" },
    ]
  },
  {
    id: "prompt-engineering-course",
    title: "Prompt Engineering Masterclass",
    icon: "✍️",
    level: "Beginner",
    duration: "15 hours",
    description: "From basic prompting to advanced techniques like Chain-of-Thought, Tree-of-Thought, and systematic prompt optimization. Applicable to any LLM.",
    learningOutcomes: [
      "Write clear, effective prompts for any task",
      "Apply Chain-of-Thought and few-shot techniques",
      "Design system prompts for consistent behavior",
      "Evaluate and iterate on prompt performance",
      "Build prompt templates for production applications"
    ],
    prerequisites: ["No programming required", "Access to ChatGPT or similar"],
    tools: ["ChatGPT", "Claude", "OpenAI Playground", "LangSmith"],
    modules: [
      { title: "1. Prompting Foundations", topics: ["Anatomy of a Prompt", "Role-Context-Task Framework", "Clear Instructions", "Output Formatting"], duration: "3h" },
      { title: "2. Core Techniques", topics: ["Zero-Shot vs Few-Shot", "Chain-of-Thought (CoT)", "Self-Consistency", "Prompt Chaining"], duration: "3h" },
      { title: "3. Advanced Methods", topics: ["Tree-of-Thought", "ReAct Prompting", "Constitutional Prompting", "Retrieval-Augmented Prompting"], duration: "3h" },
      { title: "4. Domain Applications", topics: ["Code Generation Prompts", "Data Analysis Prompts", "Creative Writing Prompts", "Business & Marketing Prompts"], duration: "3h" },
      { title: "5. Optimization & Evaluation", topics: ["A/B Testing Prompts", "Automated Evaluation", "Prompt Versioning", "Cost Optimization"], duration: "3h" },
    ]
  },
  {
    id: "computer-vision-course",
    title: "Computer Vision with Deep Learning",
    icon: "👁️",
    level: "Intermediate",
    duration: "30 hours",
    description: "From image classification to object detection, segmentation, and generative vision models. Build real-world CV applications with PyTorch and Hugging Face.",
    learningOutcomes: [
      "Build CNNs and Vision Transformers from scratch",
      "Train object detection models (YOLO, DETR)",
      "Implement semantic & instance segmentation",
      "Use transfer learning effectively for CV tasks",
      "Deploy vision models as APIs and edge applications"
    ],
    prerequisites: ["Python & PyTorch basics", "Linear algebra fundamentals"],
    tools: ["PyTorch", "torchvision", "Hugging Face", "OpenCV", "YOLO", "Roboflow"],
    modules: [
      { title: "1. Image Fundamentals", topics: ["Digital Image Representation", "OpenCV Operations", "Data Augmentation", "Dataset Creation"], duration: "4h" },
      { title: "2. CNNs Deep Dive", topics: ["Convolution & Pooling", "ResNet & EfficientNet", "Feature Visualization", "Grad-CAM Explainability"], duration: "5h" },
      { title: "3. Vision Transformers", topics: ["ViT Architecture", "DeiT & Swin Transformer", "Hybrid CNN-Transformer", "Self-Supervised Pre-training"], duration: "5h" },
      { title: "4. Object Detection", topics: ["YOLO Family (v5-v11)", "DETR & RT-DETR", "Anchor-Free Detection", "Custom Dataset Training"], duration: "5h" },
      { title: "5. Segmentation", topics: ["Semantic Segmentation (U-Net)", "Instance Segmentation (Mask R-CNN)", "Panoptic Segmentation", "SAM (Segment Anything)"], duration: "5h" },
      { title: "6. Generative Vision", topics: ["Diffusion Models for Images", "ControlNet & IP-Adapter", "Image Inpainting & Editing", "Video Generation Basics"], duration: "4h" },
      { title: "7. Deployment", topics: ["ONNX Export", "TensorRT Optimization", "Edge Deployment (Jetson)", "Streaming Video Inference"], duration: "2h" },
    ]
  },
  // ===== NEW COURSES =====
  {
    id: "nlp-course",
    title: "NLP & Text Processing: From Basics to Transformers",
    icon: "📝",
    level: "Intermediate",
    duration: "28 hours",
    description: "Master Natural Language Processing from text preprocessing to transformer-based models. Build text classifiers, NER systems, summarizers, and sentiment analyzers.",
    learningOutcomes: [
      "Preprocess and tokenize text for NLP pipelines",
      "Build text classification and NER models with spaCy & BERT",
      "Implement sentiment analysis at production scale",
      "Train custom NER models for domain-specific entity extraction",
      "Build text summarization and question answering systems"
    ],
    prerequisites: ["Python proficiency", "Basic ML concepts", "Familiarity with neural networks"],
    tools: ["spaCy", "Hugging Face Transformers", "NLTK", "BERT", "GPT", "FastAPI"],
    modules: [
      { title: "1. Text Preprocessing", topics: ["Tokenization & Normalization", "Stemming vs Lemmatization", "Stopword Removal & POS Tagging", "Regex for Text Extraction", "Unicode & Encoding Handling"], duration: "4h" },
      { title: "2. Feature Engineering for Text", topics: ["Bag-of-Words & TF-IDF", "Word2Vec & GloVe Embeddings", "Contextual Embeddings (BERT)", "Text Vectorization Pipelines", "Feature Hashing for Scale"], duration: "4h" },
      { title: "3. Text Classification", topics: ["Naive Bayes Baseline", "CNN for Text (TextCNN)", "BERT Fine-Tuning for Classification", "Multi-Label Classification", "Handling Class Imbalance"], duration: "5h" },
      { title: "4. Named Entity Recognition", topics: ["spaCy NER Pipeline", "Custom Entity Training", "Transformer-Based NER (BERT-NER)", "Regular Expression Patterns", "Active Learning for Annotation"], duration: "4h" },
      { title: "5. Sentiment & Opinion Mining", topics: ["Lexicon-Based Sentiment", "Aspect-Based Sentiment Analysis", "Emotion Detection", "Sarcasm & Irony Detection", "Multilingual Sentiment"], duration: "4h" },
      { title: "6. Text Generation & Summarization", topics: ["Extractive vs Abstractive Summarization", "T5 & BART for Summarization", "Controlled Text Generation", "Question Answering with SQuAD", "Evaluation: ROUGE & BERTScore"], duration: "4h" },
      { title: "7. Production NLP", topics: ["Model Serving with FastAPI", "Batch vs Real-Time Inference", "Multilingual Deployment", "A/B Testing NLP Models", "Capstone: Document Intelligence Pipeline"], duration: "3h" },
    ]
  },
  {
    id: "reinforcement-learning",
    title: "Reinforcement Learning: Theory to Practice",
    icon: "🎮",
    level: "Advanced",
    duration: "35 hours",
    description: "From bandits to deep RL. Master Q-learning, policy gradients, PPO, and RLHF. Train agents for games, robotics, and LLM alignment.",
    learningOutcomes: [
      "Understand MDP, Bellman equations & value functions",
      "Implement Q-learning, SARSA and DQN from scratch",
      "Train agents with Policy Gradients and PPO",
      "Apply RLHF to align language models",
      "Build RL environments and reward shaping strategies"
    ],
    prerequisites: ["Python & PyTorch", "Probability & Statistics", "Basic neural networks"],
    tools: ["Gymnasium", "Stable-Baselines3", "PyTorch", "TRL", "Ray RLlib"],
    modules: [
      { title: "1. RL Foundations", topics: ["Markov Decision Processes", "Bellman Equations", "Value Functions & Q-Functions", "Exploration vs Exploitation", "Multi-Armed Bandits"], duration: "5h" },
      { title: "2. Tabular Methods", topics: ["Monte Carlo Methods", "Temporal Difference Learning", "Q-Learning & SARSA", "N-Step Methods", "Planning with Dynamic Programming"], duration: "5h" },
      { title: "3. Deep Q-Networks", topics: ["DQN Architecture", "Experience Replay", "Target Networks", "Double DQN & Dueling DQN", "Prioritized Experience Replay"], duration: "5h" },
      { title: "4. Policy Gradient Methods", topics: ["REINFORCE Algorithm", "Actor-Critic Methods", "A2C & A3C", "Advantage Estimation (GAE)", "Entropy Regularization"], duration: "6h" },
      { title: "5. PPO & Advanced Methods", topics: ["PPO: Clipped Objective", "TRPO: Trust Region", "SAC: Soft Actor-Critic", "Multi-Agent RL Basics", "Reward Shaping"], duration: "5h" },
      { title: "6. RLHF & LLM Alignment", topics: ["Reward Models from Human Preferences", "PPO for Language Models", "DPO: Direct Preference Optimization", "Constitutional AI", "Evaluation & Red Teaming"], duration: "5h" },
      { title: "7. Capstone: Train a Game Agent", topics: ["Custom Gymnasium Environment", "Reward Engineering", "Training Loop with Stable-Baselines3", "Hyperparameter Tuning", "Visualization & Analysis"], duration: "4h" },
    ]
  },
  {
    id: "data-science-python",
    title: "Data Science with Python: Complete Bootcamp",
    icon: "📊",
    level: "Beginner",
    duration: "32 hours",
    description: "Learn data analysis, visualization, statistical testing, and machine learning with Python. From Jupyter notebooks to Streamlit dashboards.",
    learningOutcomes: [
      "Perform exploratory data analysis with Pandas & Matplotlib",
      "Apply statistical tests and interpret results correctly",
      "Build interactive dashboards with Streamlit",
      "Create compelling data visualizations for stakeholders",
      "Implement end-to-end data science projects"
    ],
    prerequisites: ["Basic Python syntax", "No math beyond high school"],
    tools: ["Pandas", "Matplotlib", "Seaborn", "Plotly", "Scikit-learn", "Streamlit"],
    modules: [
      { title: "1. Python for Data Science", topics: ["Jupyter Notebooks", "NumPy Array Operations", "Pandas DataFrames", "Data Types & Cleaning", "File I/O (CSV, JSON, Excel)"], duration: "5h" },
      { title: "2. Exploratory Data Analysis", topics: ["Descriptive Statistics", "Correlation Analysis", "Distribution Analysis", "Outlier Detection", "Missing Data Strategies"], duration: "5h" },
      { title: "3. Data Visualization", topics: ["Matplotlib Fundamentals", "Seaborn Statistical Plots", "Plotly Interactive Charts", "Choosing the Right Chart", "Dashboard Design Principles"], duration: "5h" },
      { title: "4. Statistics for Data Science", topics: ["Probability Distributions", "Hypothesis Testing (t-test, chi-square)", "Confidence Intervals", "A/B Testing Methodology", "Bayesian vs Frequentist Thinking"], duration: "5h" },
      { title: "5. Machine Learning Essentials", topics: ["Scikit-learn Pipeline", "Regression & Classification", "Cross-Validation & Metrics", "Feature Selection", "Model Comparison"], duration: "5h" },
      { title: "6. Time Series Analysis", topics: ["Trend & Seasonality Decomposition", "Moving Averages", "ARIMA & Prophet", "Forecasting Metrics (MAPE, RMSE)", "Anomaly Detection in Time Series"], duration: "4h" },
      { title: "7. Capstone: Interactive Dashboard", topics: ["Streamlit App Development", "Data Pipeline Automation", "Caching & Performance", "Deployment to Streamlit Cloud", "Portfolio Presentation"], duration: "3h" },
    ]
  },
  {
    id: "system-design-ml",
    title: "System Design for ML Engineers",
    icon: "🏛️",
    level: "Advanced",
    duration: "25 hours",
    description: "Design scalable ML systems from scratch. Cover recommendation engines, search systems, fraud detection, real-time inference, and data-intensive architectures.",
    learningOutcomes: [
      "Design end-to-end ML system architectures",
      "Build recommendation engines at scale",
      "Design real-time feature computation pipelines",
      "Architect search and ranking systems",
      "Pass ML system design interviews"
    ],
    prerequisites: ["ML fundamentals", "Basic system design knowledge", "Cloud experience"],
    tools: ["AWS/GCP", "Kafka", "Redis", "Elasticsearch", "Kubernetes"],
    modules: [
      { title: "1. ML System Design Framework", topics: ["Problem Definition & Scoping", "Data Strategy & Collection", "Feature Engineering Architecture", "Model Selection & Training", "Serving & Monitoring Patterns"], duration: "4h" },
      { title: "2. Recommendation Systems", topics: ["Collaborative Filtering at Scale", "Content-Based Recommendations", "Hybrid Approaches", "Cold Start Problem", "Real-Time Personalization"], duration: "4h" },
      { title: "3. Search & Ranking Systems", topics: ["Inverted Index Architecture", "Learning-to-Rank", "Query Understanding Pipeline", "Embedding-Based Retrieval", "A/B Testing Search Quality"], duration: "4h" },
      { title: "4. Fraud & Anomaly Detection", topics: ["Real-Time Scoring Architecture", "Feature Store Design", "Graph-Based Fraud Detection", "Rule Engine + ML Hybrid", "Feedback Loop & Label Collection"], duration: "4h" },
      { title: "5. Real-Time ML Infrastructure", topics: ["Stream Processing (Kafka + Flink)", "Online Feature Computation", "Low-Latency Model Serving", "Caching Strategies", "Fallback & Degradation"], duration: "4h" },
      { title: "6. Interview Practice", topics: ["Design a News Feed Ranking System", "Design Uber Surge Pricing", "Design YouTube Video Recommendations", "Design Gmail Spam Filter", "Whiteboard Presentation Skills"], duration: "5h" },
    ]
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#4CAF50",
  Intermediate: "#FF9800",
  Advanced: "#E20074",
};

export default function Courses() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="courses-container">
      {COURSES.map(course => {
        const isExpanded = expandedCourse === course.id;
        return (
          <div key={course.id} className={`course-card ${isExpanded ? 'course-card--expanded' : ''}`}>
            <div className="course-header" onClick={() => setExpandedCourse(isExpanded ? null : course.id)}>
              <div className="course-top">
                <span className="course-icon">{course.icon}</span>
                <div className="course-badges">
                  <span className="course-level" style={{ background: LEVEL_COLORS[course.level] }}>{course.level}</span>
                  <span className="course-duration">⏱ {course.duration}</span>
                </div>
              </div>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              <div className="course-tools">
                {course.tools.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <span className={`blog-chevron ${isExpanded ? 'blog-chevron--open' : ''}`}>
                ↓ {isExpanded ? 'Collapse' : 'View Curriculum'}
              </span>
            </div>

            {isExpanded && (
              <div className="course-body">
                <div className="course-section">
                  <h4 className="course-section-title">🎯 Learning Outcomes</h4>
                  <ul className="course-outcomes">
                    {course.learningOutcomes.map((o, i) => <li key={i}>✅ {o}</li>)}
                  </ul>
                </div>

                <div className="course-section">
                  <h4 className="course-section-title">📋 Prerequisites</h4>
                  <ul className="course-prereqs">
                    {course.prerequisites.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>

                <div className="course-section">
                  <h4 className="course-section-title">📚 Modules ({course.modules.length})</h4>
                  <div className="course-modules">
                    {course.modules.map((mod, i) => {
                      const modKey = `${course.id}-${i}`;
                      const modExpanded = expandedModule === modKey;
                      return (
                        <div key={i} className={`course-module ${modExpanded ? 'course-module--expanded' : ''}`}>
                          <div className="module-header" onClick={(e) => { e.stopPropagation(); setExpandedModule(modExpanded ? null : modKey); }}>
                            <span className="module-title">{mod.title}</span>
                            <span className="module-dur">{mod.duration}</span>
                          </div>
                          {modExpanded && (
                            <div className="module-topics">
                              {mod.topics.map((t, j) => (
                                <span key={j} className="module-topic">📌 {t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="course-progress-mock">
                  <div className="progress-label">Course Progress</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '0%' }} />
                  </div>
                  <span className="progress-text">0% — Ready to start</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
