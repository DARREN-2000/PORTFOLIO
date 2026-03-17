import { useState, useMemo } from "react";
import { useInView } from "../../hooks/useAnimations";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  icon: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string[];
  codeSnippet?: { lang: string; code: string };
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "scalable-rest-api",
    title: "How I Built a Scalable REST API with FastAPI & Docker",
    excerpt: "A deep dive into designing, building, and deploying a production-grade REST API that handles 10K+ requests/sec.",
    category: "Tutorial",
    icon: "🚀",
    date: "2025-12-15",
    readTime: "8 min",
    tags: ["FastAPI", "Docker", "Python", "REST"],
    content: [
      "Building a scalable API isn't just about writing endpoints — it's about architecture decisions that compound over time.",
      "I chose FastAPI over Flask/Django for three reasons: async support out of the box, automatic OpenAPI docs, and Pydantic validation that catches bugs before they reach production.",
      "The key insight was implementing a layered architecture: Controllers → Services → Repositories. This separation means you can swap your database without touching business logic.",
      "For deployment, I used a multi-stage Docker build that reduced the image from 1.2GB to 180MB. Combined with Gunicorn workers and uvloop, we hit 12K req/sec on a single container.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI(title="ML Model API")

@app.post("/predict")
async def predict(
    request: PredictRequest,
    db: AsyncSession = Depends(get_db),
    cache: Redis = Depends(get_cache)
):
    # Check cache first
    cached = await cache.get(request.hash)
    if cached:
        return PredictResponse.parse_raw(cached)
    
    # Run inference
    result = await model.predict(request.features)
    await cache.setex(request.hash, 3600, result.json())
    
    # Log to DB asynchronously
    asyncio.create_task(log_prediction(db, request, result))
    return result`
    }
  },
  {
    id: "docker-kubernetes",
    title: "Deploying ML Models with Docker & Kubernetes: A Complete Guide",
    excerpt: "From local development to production K8s cluster — the full journey of containerizing and orchestrating ML workloads.",
    category: "DevOps",
    icon: "🐳",
    date: "2025-11-28",
    readTime: "12 min",
    tags: ["Docker", "Kubernetes", "MLOps", "DevOps"],
    content: [
      "The biggest challenge in ML deployment isn't the model — it's the infrastructure. Your model might be 99% accurate locally but fail in production due to dependency mismatches, memory limits, or cold start times.",
      "My approach: treat ML models like microservices. Each model gets its own container, health check endpoint, and resource limits. Kubernetes handles scaling based on inference queue depth.",
      "Key learnings: Always use multi-stage builds (saves 60-70% image size). Pin your CUDA versions. Use init containers for model download. Set resource requests AND limits.",
      "For GPU workloads, I use the NVIDIA device plugin with node affinity rules. This ensures GPU models only schedule on GPU nodes while CPU models use the general pool.",
    ],
    codeSnippet: {
      lang: "yaml",
      code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-inference-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ml-inference
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Pods
    pods:
      metric:
        name: inference_queue_depth
      target:
        type: AverageValue
        averageValue: "10"`
    }
  },
  {
    id: "rag-pipeline",
    title: "Building Production RAG Pipelines: Lessons from Real Projects",
    excerpt: "Retrieval-Augmented Generation pipelines that actually work in production — embeddings, chunking strategies, and evaluation.",
    category: "AI/ML",
    icon: "🧠",
    date: "2025-10-20",
    readTime: "10 min",
    tags: ["RAG", "LLM", "LangChain", "Embeddings"],
    content: [
      "Everyone talks about RAG but few discuss what makes it work in production. After building RAG systems at BMW and CARIAD, here's what I've learned.",
      "Chunking strategy matters more than embedding model choice. Overlapping chunks of 500 tokens with 50-token overlap outperformed fixed 1000-token chunks by 23% on our retrieval benchmarks.",
      "The evaluation framework is critical: I use a three-tier approach — retrieval recall@k, answer faithfulness (does the answer come from the context?), and end-user satisfaction ratings.",
      "Hybrid search (dense embeddings + BM25 sparse retrieval) consistently beats pure vector search. We use reciprocal rank fusion to combine the results.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

# Optimized chunking strategy
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", ". ", " "]
)

# Hybrid retrieval
dense_results = vectorstore.similarity_search(query, k=10)
sparse_results = bm25_retriever.get_relevant_documents(query)

# Reciprocal Rank Fusion
final_results = reciprocal_rank_fusion(
    [dense_results, sparse_results],
    k=60  # RRF constant
)`
    }
  },
  {
    id: "mlops-monitoring",
    title: "MLOps Monitoring: Detecting Model Drift Before It's Too Late",
    excerpt: "How to build a comprehensive monitoring system that catches data drift, concept drift, and performance degradation.",
    category: "MLOps",
    icon: "📊",
    date: "2025-09-15",
    readTime: "9 min",
    tags: ["MLOps", "Monitoring", "Grafana", "Prometheus"],
    content: [
      "A deployed ML model without monitoring is a ticking time bomb. I learned this the hard way when a model's accuracy dropped 15% over two weeks because the input data distribution shifted.",
      "My monitoring stack: Prometheus for metrics collection, Grafana for dashboards, and custom Python jobs for statistical tests (PSI for data drift, KS test for feature distributions).",
      "The three signals I always monitor: prediction distribution shift (are outputs changing?), feature drift (are inputs changing?), and ground truth performance (when labels become available).",
      "Automated alerting: If PSI > 0.2 on any feature, trigger a Slack alert. If prediction entropy increases by 20%, schedule a model retrain. These thresholds came from months of calibration.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import numpy as np
from scipy import stats

def calculate_psi(expected, actual, bins=10):
    """Population Stability Index for drift detection"""
    breakpoints = np.linspace(0, 100, bins + 1)
    expected_pcts = np.percentile(expected, breakpoints)
    
    expected_counts = np.histogram(expected, expected_pcts)[0]
    actual_counts = np.histogram(actual, expected_pcts)[0]
    
    # Avoid division by zero
    expected_pcts = np.maximum(expected_counts / len(expected), 0.001)
    actual_pcts = np.maximum(actual_counts / len(actual), 0.001)
    
    psi = np.sum((actual_pcts - expected_pcts) * 
                  np.log(actual_pcts / expected_pcts))
    return psi  # > 0.2 = significant drift`
    }
  },
  {
    id: "graph-neural-networks",
    title: "Graph Neural Networks Explained: From Theory to PyTorch Implementation",
    excerpt: "Understanding GNNs through intuitive examples and building one from scratch with PyTorch Geometric.",
    category: "AI/ML",
    icon: "🔮",
    date: "2025-08-10",
    readTime: "11 min",
    tags: ["GNN", "PyTorch", "Deep Learning", "Research"],
    content: [
      "Traditional neural networks assume data points are independent. But what about social networks, molecules, or citation graphs? That's where Graph Neural Networks shine.",
      "The core idea is message passing: each node aggregates information from its neighbors, transforms it, and updates its own representation. After K rounds, each node has information from its K-hop neighborhood.",
      "In my thesis at FAU, I applied GNNs to classify mathematical publications. The graph was built from citation networks, co-authorship, and keyword similarity. GNN outperformed traditional NLP methods by 18%.",
      "Key insight: the choice of aggregation function matters enormously. Sum aggregation preserves structural information that mean aggregation loses. For heterogeneous graphs, attention-based aggregation (GAT) often wins.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import torch
from torch_geometric.nn import GCNConv, global_mean_pool

class GNN(torch.nn.Module):
    def __init__(self, in_channels, hidden, num_classes):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden)
        self.conv2 = GCNConv(hidden, hidden)
        self.classifier = torch.nn.Linear(hidden, num_classes)
    
    def forward(self, x, edge_index, batch):
        # Message passing layers
        x = self.conv1(x, edge_index).relu()
        x = F.dropout(x, p=0.5, training=self.training)
        x = self.conv2(x, edge_index).relu()
        
        # Graph-level readout
        x = global_mean_pool(x, batch)
        return self.classifier(x)`
    }
  },
  {
    id: "prompt-engineering",
    title: "Advanced Prompt Engineering: Techniques That Actually Work",
    excerpt: "Beyond 'act as X' — systematic approaches to prompt design including chain-of-thought, few-shot, and self-consistency.",
    category: "AI/ML",
    icon: "✨",
    date: "2025-07-22",
    readTime: "7 min",
    tags: ["LLM", "Prompt Engineering", "GPT", "AI"],
    content: [
      "Prompt engineering is moving from art to science. After months of A/B testing prompts at scale, I've identified patterns that consistently improve LLM output quality.",
      "Chain-of-Thought (CoT) with 'Let's think step by step' improves accuracy on reasoning tasks by 30-40%. But structured CoT — where you explicitly outline the steps — is even better.",
      "Few-shot examples should be diverse, not just numerous. 3 well-chosen examples beat 10 similar ones. I use embedding similarity to select maximally diverse few-shot examples for each query.",
      "Self-consistency (generate N outputs, take majority vote) is the cheapest way to improve reliability. For classification tasks, 5 samples with temperature=0.7 and majority voting reduces errors by 40%.",
    ],
    codeSnippet: {
      lang: "python",
      code: `# Self-consistency with structured CoT
async def robust_classify(text, labels, n_samples=5):
    prompt = f"""Classify the text into: {labels}
    
    Step 1: Identify key entities
    Step 2: Determine sentiment/intent  
    Step 3: Match to closest label
    Step 4: State your classification
    
    Text: {text}"""
    
    results = await asyncio.gather(*[
        llm.generate(prompt, temperature=0.7)
        for _ in range(n_samples)
    ])
    
    votes = Counter(extract_label(r) for r in results)
    return votes.most_common(1)[0][0]`
    }
  },
  {
    id: "ci-cd-ml",
    title: "CI/CD for Machine Learning: Automating the Entire Pipeline",
    excerpt: "How to set up GitHub Actions workflows that test, validate, and deploy ML models automatically on every push.",
    category: "DevOps",
    icon: "⚙️",
    date: "2025-06-18",
    readTime: "8 min",
    tags: ["CI/CD", "GitHub Actions", "MLOps", "Testing"],
    content: [
      "Manual ML deployments are error-prone and slow. After one too many 'it works on my machine' incidents, I built a full CI/CD pipeline that takes a model from commit to production in under 15 minutes.",
      "The pipeline has four stages: lint & type-check, unit tests (including model output shape validation), integration tests against a staging database, and canary deployment with automatic rollback.",
      "The secret sauce is data validation gates. Before any model goes to production, a DVC pipeline checks that training data passes Great Expectations suites — schema, distribution, and freshness checks.",
      "Rollback is automatic: if the canary shows >5% error rate increase over 10 minutes, the pipeline reverts to the previous model version and alerts the team via Slack.",
    ],
    codeSnippet: {
      lang: "yaml",
      code: `name: ML Pipeline
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: pytest tests/ --cov=src --cov-fail-under=85
      - run: python scripts/validate_model.py
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - run: docker build -t model:$GITHUB_SHA .
      - run: kubectl set image deploy/ml model=model:$GITHUB_SHA
      - run: python scripts/canary_check.py --timeout=600`
    }
  },
  {
    id: "vector-databases",
    title: "Vector Databases Deep Dive: Choosing the Right One for Your AI App",
    excerpt: "Comparing Pinecone, Weaviate, Qdrant, and FAISS for production vector search — benchmarks, costs, and trade-offs.",
    category: "AI/ML",
    icon: "🗄️",
    date: "2025-05-05",
    readTime: "10 min",
    tags: ["Vector DB", "Embeddings", "RAG", "Infrastructure"],
    content: [
      "Vector databases are the backbone of modern AI applications. But with so many options, choosing the right one is critical. I benchmarked four popular solutions on our production workload.",
      "FAISS wins on raw speed for in-memory search (5ms p99 on 10M vectors). But it's not a database — no CRUD, no filtering, no persistence out of the box. Great for read-heavy, batch-updated workloads.",
      "Qdrant offers the best balance of speed and features. Its payload filtering is fast, the Rust core is memory-efficient, and the gRPC API handles 8K QPS on a single node.",
      "My recommendation: Start with FAISS for prototyping, move to Qdrant or Weaviate for production. Use Pinecone only if you need zero-ops and can accept the vendor lock-in and cost.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, Filter

client = QdrantClient("localhost", port=6333)

# Create collection with HNSW index
client.create_collection(
    "documents",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE)
)

# Search with metadata filtering
results = client.search(
    "documents",
    query_vector=embedding,
    query_filter=Filter(must=[
        {"key": "category", "match": {"value": "technical"}},
        {"key": "date", "range": {"gte": "2025-01-01"}}
    ]),
    limit=10
)`
    }
  },
  {
    id: "terraform-infra",
    title: "Infrastructure as Code for ML: Terraform Patterns That Scale",
    excerpt: "Battle-tested Terraform modules for GPU clusters, model registries, and auto-scaling inference endpoints.",
    category: "DevOps",
    icon: "🏗️",
    date: "2025-04-12",
    readTime: "9 min",
    tags: ["Terraform", "AWS", "Infrastructure", "MLOps"],
    content: [
      "Managing ML infrastructure manually is a recipe for snowflake servers and surprise bills. Terraform brings order to the chaos — every GPU instance, every S3 bucket, every IAM role is version-controlled.",
      "My module structure: one root module per environment (dev/staging/prod), shared modules for common patterns (VPC, EKS cluster, SageMaker endpoints), and data sources for cross-account access.",
      "The key Terraform pattern for ML: use aws_spot_instance_request for training (70% cheaper) but on-demand instances for inference (reliability matters). Wrap both in ASGs with lifecycle policies.",
      "Cost optimization tip: schedule GPU instances to scale down outside business hours. A simple cron-based scaling policy saved us $12K/month on training infrastructure.",
    ],
    codeSnippet: {
      lang: "hcl",
      code: `resource "aws_sagemaker_endpoint_configuration" "ml" {
  name = "inference-\${var.model_version}"

  production_variants {
    variant_name           = "primary"
    model_name             = aws_sagemaker_model.ml.name
    initial_instance_count = var.min_instances
    instance_type          = "ml.g4dn.xlarge"
    
    serverless_config {
      max_concurrency    = 50
      memory_size_in_mb  = 4096
    }
  }

  tags = { Environment = var.env, ManagedBy = "terraform" }
}`
    }
  },
  {
    id: "llm-fine-tuning",
    title: "Fine-Tuning LLMs on a Budget: LoRA, QLoRA, and Beyond",
    excerpt: "Practical guide to fine-tuning large language models when you don't have unlimited GPU budgets.",
    category: "AI/ML",
    icon: "🔧",
    date: "2025-03-01",
    readTime: "11 min",
    tags: ["LLM", "Fine-tuning", "LoRA", "PyTorch"],
    content: [
      "Full fine-tuning a 7B parameter model requires 4x A100 GPUs. LoRA reduces this to a single A100 (or even an A10G) by training only low-rank adapter matrices — typically 0.1% of the total parameters.",
      "QLoRA goes further: quantize the base model to 4-bit, apply LoRA on top. This means you can fine-tune a 13B model on a single 24GB GPU. The quality loss is surprisingly small (< 2% on most benchmarks).",
      "Data quality > data quantity. 1000 high-quality, domain-specific examples beat 100K noisy web-scraped samples. I spend 80% of my fine-tuning time on data curation and 20% on actual training.",
      "Always evaluate on held-out data with task-specific metrics. Perplexity alone is misleading — a model can have great perplexity but terrible instruction-following behavior.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# 4-bit quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config
)

# LoRA config — only train ~0.1% of parameters
lora_config = LoraConfig(
    r=16, lora_alpha=32, lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    task_type=TaskType.CAUSAL_LM
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable: 4.2M / 6.7B (0.06%)`
    }
  },
  {
    id: "kubernetes-gpu",
    title: "Running GPU Workloads on Kubernetes: Complete Setup Guide",
    excerpt: "Step-by-step guide to configuring NVIDIA GPU support in K8s for ML inference and training workloads.",
    category: "DevOps",
    icon: "🎮",
    date: "2025-02-15",
    readTime: "10 min",
    tags: ["Kubernetes", "GPU", "NVIDIA", "Infrastructure"],
    content: [
      "Getting GPUs working in Kubernetes is surprisingly tricky. You need the NVIDIA device plugin, container runtime, and proper resource requests — miss any step and your pods won't schedule.",
      "First, install the NVIDIA Container Toolkit on all GPU nodes. Then deploy the NVIDIA device plugin DaemonSet. This exposes nvidia.com/gpu as a schedulable resource.",
      "Use node affinity to ensure GPU workloads only land on GPU nodes. Taint GPU nodes with nvidia.com/gpu=present:NoSchedule and add tolerations to your ML pods.",
      "For multi-GPU training, use MPI Operator or PyTorch's DistributedDataParallel. Each pod gets its own GPU, and NCCL handles inter-GPU communication over InfiniBand or RoCE."
    ],
    codeSnippet: {
      lang: "yaml",
      code: `apiVersion: v1
kind: Pod
metadata:
  name: gpu-training
spec:
  tolerations:
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule
  containers:
  - name: trainer
    image: nvcr.io/nvidia/pytorch:24.01-py3
    resources:
      limits:
        nvidia.com/gpu: 2
    env:
    - name: NCCL_DEBUG
      value: INFO
    command: ["torchrun", "--nproc_per_node=2", "train.py"]`
    }
  },
  {
    id: "feature-stores",
    title: "Feature Stores Explained: Feast, Tecton, and Custom Solutions",
    excerpt: "Why every ML team needs a feature store and how to build one that serves both batch training and real-time inference.",
    category: "MLOps",
    icon: "🏪",
    date: "2025-01-20",
    readTime: "9 min",
    tags: ["Feature Store", "Feast", "MLOps", "Data"],
    content: [
      "The #1 cause of training-serving skew? Feature computation differences. Your training pipeline computes features in Spark, but your serving endpoint uses Python — subtle bugs creep in.",
      "Feature stores solve this with a single source of truth. Define features once, compute them consistently, and serve them with low latency. Feast is the most popular open-source option.",
      "My setup: Feast with an offline store (BigQuery) for training and an online store (Redis) for real-time serving. Feature definitions live in version-controlled Python files.",
      "The key insight: materialize features on a schedule so your online store stays fresh. For real-time features (e.g., 'transactions in last 5 min'), use streaming feature pipelines with Kafka."
    ],
    codeSnippet: {
      lang: "python",
      code: `from feast import FeatureStore, Entity, Feature, ValueType
from feast import BigQuerySource, RedisOnlineStore

# Define a feature view
driver_stats = FeatureView(
    name="driver_stats",
    entities=["driver_id"],
    ttl=timedelta(days=1),
    features=[
        Feature("avg_trip_distance", ValueType.FLOAT),
        Feature("trips_today", ValueType.INT64),
        Feature("rating", ValueType.FLOAT),
    ],
    source=BigQuerySource(
        table="project.dataset.driver_stats",
        timestamp_field="event_timestamp"
    )
)

# Serve features for real-time inference
store = FeatureStore("feature_repo/")
features = store.get_online_features(
    feature_refs=["driver_stats:avg_trip_distance", "driver_stats:rating"],
    entity_rows=[{"driver_id": 1001}]
).to_dict()`
    }
  },
  {
    id: "ai-agents",
    title: "Building Autonomous AI Agents: ReAct, Tool Use, and Memory",
    excerpt: "How to build AI agents that reason, use tools, and maintain context — from simple chains to multi-agent systems.",
    category: "AI/ML",
    icon: "🤖",
    date: "2024-12-10",
    readTime: "12 min",
    tags: ["AI Agents", "LangChain", "ReAct", "LLM"],
    content: [
      "AI agents go beyond simple prompt→response. They observe, reason, act, and learn from feedback in a loop. The ReAct pattern (Reason + Act) is the foundation.",
      "Tool use is what makes agents powerful. Give an LLM access to a calculator, code executor, web search, and database — it decides which tool to use based on the task.",
      "Memory is the hardest part. Short-term memory (conversation buffer) is easy. Long-term memory (vector store of past interactions) requires careful retrieval and summarization.",
      "Multi-agent systems assign specialized roles: a Planner agent decomposes tasks, Worker agents execute subtasks, and a Critic agent validates results. This beats monolithic agents on complex tasks."
    ],
    codeSnippet: {
      lang: "python",
      code: `from langchain.agents import create_react_agent, Tool
from langchain.memory import ConversationBufferWindowMemory

# Define tools the agent can use
tools = [
    Tool("Calculator", calculator_func, "For math calculations"),
    Tool("Search", web_search, "Search the web for info"),
    Tool("SQL", run_sql_query, "Query the database"),
    Tool("CodeExec", execute_python, "Run Python code"),
]

# Create ReAct agent with memory
memory = ConversationBufferWindowMemory(k=10, return_messages=True)
agent = create_react_agent(
    llm=ChatOpenAI(model="gpt-4", temperature=0),
    tools=tools,
    prompt=react_prompt,
)

# Agent reasons and acts autonomously
result = agent.invoke({
    "input": "Find our top 5 customers by revenue last quarter"
})
# Agent: I need to query the database → runs SQL → formats results`
    }
  },
  {
    id: "observability-ml",
    title: "Observability for ML Systems: Beyond Traditional Monitoring",
    excerpt: "Why ML systems need specialized observability — tracking predictions, embeddings, and model behavior in production.",
    category: "MLOps",
    icon: "🔭",
    date: "2024-11-05",
    readTime: "8 min",
    tags: ["Observability", "Monitoring", "Grafana", "ML"],
    content: [
      "Traditional APM (latency, errors, throughput) isn't enough for ML. A model can return 200 OK with 5ms latency while giving completely wrong predictions.",
      "ML observability has three pillars: data quality (are inputs valid?), model performance (are predictions accurate?), and operational health (is the system responsive?).",
      "I instrument every prediction endpoint with: input feature distributions, prediction confidence scores, latency percentiles, and ground truth feedback when available.",
      "The golden signal for ML: prediction confidence entropy. When this increases, the model is uncertain. Pair with feature drift detection (PSI) for a complete picture."
    ],
    codeSnippet: {
      lang: "python",
      code: `from prometheus_client import Histogram, Counter, Gauge
import numpy as np

# ML-specific Prometheus metrics
prediction_latency = Histogram(
    'ml_prediction_duration_seconds',
    'Prediction latency', buckets=[.01, .05, .1, .25, .5, 1]
)
prediction_confidence = Histogram(
    'ml_prediction_confidence',
    'Model confidence score', buckets=[.5, .6, .7, .8, .9, .95, .99]
)
drift_score = Gauge('ml_feature_drift_psi', 'PSI drift score', ['feature'])

@prediction_latency.time()
def predict(features):
    probs = model.predict_proba(features)
    confidence = float(np.max(probs))
    prediction_confidence.observe(confidence)
    
    if confidence < 0.7:
        low_confidence_counter.inc()
        logger.warning(f"Low confidence: {confidence:.3f}")
    
    return {"prediction": int(np.argmax(probs)), "confidence": confidence}`
    }
  },
  {
    id: "streaming-data",
    title: "Real-Time ML with Kafka & Feature Pipelines",
    excerpt: "Building streaming feature pipelines for real-time ML predictions — from Kafka ingestion to sub-100ms inference.",
    category: "Data",
    icon: "⚡",
    date: "2024-10-01",
    readTime: "11 min",
    tags: ["Kafka", "Streaming", "Real-time", "Feature Engineering"],
    content: [
      "Batch ML is yesterday's game. Users expect real-time: fraud detection in milliseconds, dynamic pricing that updates constantly, recommendation feeds that reflect the last click.",
      "The architecture: Kafka ingests events → Flink/Spark Streaming computes real-time features → Redis stores them → the inference service reads features and predicts in <100ms.",
      "The tricky part is feature consistency. Your 'rolling 5-minute average' must use the exact same window logic in both the streaming pipeline and the batch training job.",
      "I use a 'lambda architecture lite': batch pipeline backfills historical features into the feature store, streaming pipeline updates the same features in real-time. Same feature definitions, two execution engines."
    ],
    codeSnippet: {
      lang: "python",
      code: `from confluent_kafka import Consumer, Producer
import json, redis

consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'feature-pipeline',
    'auto.offset.reset': 'latest'
})
consumer.subscribe(['user-events'])

redis_client = redis.Redis(host='redis', port=6379)

# Streaming feature computation
while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None: continue
    
    event = json.loads(msg.value())
    user_id = event['user_id']
    
    # Update rolling features in Redis
    pipe = redis_client.pipeline()
    pipe.incr(f"user:{user_id}:event_count_5m")
    pipe.expire(f"user:{user_id}:event_count_5m", 300)
    pipe.lpush(f"user:{user_id}:recent_actions", event['action'])
    pipe.ltrim(f"user:{user_id}:recent_actions", 0, 49)
    pipe.execute()`
    }
  },
  {
    id: "model-compression",
    title: "Model Compression: Quantization, Pruning & Distillation in Production",
    excerpt: "How to shrink ML models by 4-10x without sacrificing accuracy — techniques we used to deploy on edge devices.",
    category: "AI/ML",
    icon: "📦",
    date: "2024-09-15",
    readTime: "10 min",
    tags: ["Quantization", "Pruning", "Distillation", "Edge AI"],
    content: [
      "Deploying a 7B parameter model on a mobile device or edge GPU seems impossible — until you apply compression. We reduced a BERT model from 440MB to 45MB with only 1.2% accuracy loss.",
      "Three techniques work best in combination: quantization (FP32→INT8 reduces size 4x), pruning (remove 60% of weights with magnitude pruning), and knowledge distillation (train a small student from a large teacher).",
      "Post-training quantization (PTQ) is the easiest win. ONNX Runtime's dynamic quantization takes 5 minutes to set up and gives 2-3x speedup with minimal quality loss.",
      "For production edge deployment, I use TensorRT for NVIDIA GPUs and ONNX Runtime for CPU. The inference pipeline: load quantized model → warm up with dummy input → serve via gRPC.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from optimum.onnxruntime import ORTQuantizer
from optimum.onnxruntime.configuration import AutoQuantizationConfig

# Dynamic quantization — easiest compression
quantizer = ORTQuantizer.from_pretrained("bert-base-uncased")
qconfig = AutoQuantizationConfig.avx512_vnni(
    is_static=False,
    per_channel=True
)

# Quantize: 440MB → 110MB, 2.5x faster
quantizer.quantize(
    save_dir="./quantized_model",
    quantization_config=qconfig
)

# Compare sizes
# Original:  440MB, 12ms/inference
# Quantized: 110MB,  5ms/inference
# Accuracy:  99.1% of original`
    }
  },
  {
    id: "multi-modal-ai",
    title: "Building Multi-Modal AI: Text + Image + Audio Pipelines",
    excerpt: "Combining vision, language, and audio models into unified pipelines — architecture patterns from real projects.",
    category: "AI/ML",
    icon: "🎭",
    date: "2024-08-20",
    readTime: "12 min",
    tags: ["Multi-Modal", "Vision", "CLIP", "Whisper"],
    content: [
      "The future is multi-modal. Users don't just type — they speak, photograph, and gesture. Modern AI systems need to understand all modalities simultaneously.",
      "At BMW, our diagnostic system processed both text reports and vehicle images. The key was a shared embedding space — CLIP embeds images and text into the same vector space for cross-modal retrieval.",
      "Architecture pattern: each modality gets its own encoder (ViT for images, Whisper for audio, BERT for text), then a fusion layer combines representations before the task head.",
      "The hardest challenge is alignment. When a user says 'the dent near the left headlight' while pointing at a photo, the system must ground the text reference to the correct image region.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import torch
from transformers import CLIPModel, CLIPProcessor

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Encode image and text into shared space
inputs = processor(
    text=["a dent on car door", "scratch on bumper", "cracked windshield"],
    images=vehicle_image,
    return_tensors="pt", padding=True
)

outputs = model(**inputs)
# Cosine similarity → find best text match for the image
similarity = outputs.logits_per_image  # [1, 3]
best_match = similarity.argmax(dim=1)  # "a dent on car door"`
    }
  },
  {
    id: "llm-evaluation",
    title: "LLM Evaluation Frameworks: Beyond BLEU and Perplexity",
    excerpt: "How to properly evaluate LLM outputs — from automated metrics to LLM-as-judge patterns used in production.",
    category: "AI/ML",
    icon: "📏",
    date: "2024-07-10",
    readTime: "9 min",
    tags: ["LLM", "Evaluation", "DeepEval", "Benchmarking"],
    content: [
      "Traditional NLP metrics (BLEU, ROUGE, perplexity) fail for LLMs. A response can have low BLEU score but be perfectly correct — it just phrased things differently.",
      "At Deutsche Telekom, I built a three-tier evaluation framework: automated metrics (DeepEval for faithfulness, relevance, toxicity), human eval (Likert scale ratings), and LLM-as-judge (GPT-4 grades outputs).",
      "LLM-as-judge is surprisingly reliable when calibrated properly. The trick is providing detailed rubrics, using few-shot examples of good/bad outputs, and averaging across multiple judge calls.",
      "For RAG systems specifically, I measure: context relevance (did we retrieve the right docs?), faithfulness (does the answer stick to the context?), and answer relevance (does it actually answer the question?).",
    ],
    codeSnippet: {
      lang: "python",
      code: `from deepeval.metrics import (
    FaithfulnessMetric, AnswerRelevancyMetric,
    ContextualRelevancyMetric, ToxicityMetric
)
from deepeval.test_case import LLMTestCase

# Define test case
test_case = LLMTestCase(
    input="What is our refund policy?",
    actual_output=llm_response,
    retrieval_context=retrieved_docs,
    expected_output="30-day refund window..."
)

# Run evaluation suite
metrics = [
    FaithfulnessMetric(threshold=0.8),
    AnswerRelevancyMetric(threshold=0.7),
    ContextualRelevancyMetric(threshold=0.7),
    ToxicityMetric(threshold=0.1),
]

for metric in metrics:
    metric.measure(test_case)
    print(f"{metric.__class__.__name__}: {metric.score:.2f}")`
    }
  },
  {
    id: "data-versioning",
    title: "Data Versioning with DVC: Git for Your ML Datasets",
    excerpt: "How to version control datasets, track experiments, and build reproducible ML pipelines with DVC.",
    category: "MLOps",
    icon: "📂",
    date: "2024-06-15",
    readTime: "8 min",
    tags: ["DVC", "Data Versioning", "MLOps", "Reproducibility"],
    content: [
      "Git tracks code. But what about the 50GB dataset your model trains on? You can't put that in Git. DVC (Data Version Control) solves this by storing data in S3/GCS while keeping lightweight pointers in Git.",
      "Every `dvc push` uploads data to remote storage and commits a .dvc file (a pointer) to Git. `dvc pull` downloads the exact version. Your teammate can reproduce your experiment with `git checkout <commit> && dvc pull`.",
      "DVC pipelines are game-changing: define your ML pipeline (preprocess → train → evaluate) as stages. DVC tracks inputs/outputs and only re-runs stages whose dependencies changed.",
      "Pro tip: combine DVC with MLflow. DVC versions the data and pipeline, MLflow tracks the experiment metrics. Together, they give you full reproducibility — data, code, and results.",
    ],
    codeSnippet: {
      lang: "yaml",
      code: `# dvc.yaml — ML pipeline definition
stages:
  preprocess:
    cmd: python src/preprocess.py
    deps:
      - src/preprocess.py
      - data/raw/
    outs:
      - data/processed/
  
  train:
    cmd: python src/train.py --epochs 50
    deps:
      - src/train.py
      - data/processed/
    outs:
      - models/model.pkl
    metrics:
      - metrics.json:
          cache: false
  
  evaluate:
    cmd: python src/evaluate.py
    deps:
      - models/model.pkl
      - data/test/
    plots:
      - plots/confusion_matrix.png`
    }
  },
  {
    id: "secure-ml-deployment",
    title: "Securing ML APIs: Authentication, Rate Limiting & Input Validation",
    excerpt: "Production ML endpoints need more than just model serving — they need security hardening against adversarial inputs.",
    category: "DevOps",
    icon: "🔐",
    date: "2024-05-20",
    readTime: "9 min",
    tags: ["Security", "API", "FastAPI", "ML Deployment"],
    content: [
      "Most ML tutorials deploy a model with `uvicorn app:app` and call it done. In production, that's an open invitation for abuse — no auth, no rate limits, no input validation.",
      "Layer 1: API key authentication via middleware. Layer 2: rate limiting with Redis (100 requests/min per key). Layer 3: input validation (reject payloads over 1MB, validate feature ranges).",
      "Adversarial input detection is unique to ML APIs. I add a 'distribution check' that flags inputs statistically far from the training distribution — these often cause wild predictions.",
      "At CARIAD, I designed Azure Private Link architecture for air-gapped LLM access. Zero internet exposure, all traffic through private endpoints. This is the gold standard for sensitive ML deployments.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import APIKeyHeader
from slowapi import Limiter
from slowapi.util import get_remote_address
import numpy as np

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
api_key_header = APIKeyHeader(name="X-API-Key")

async def validate_api_key(key: str = Depends(api_key_header)):
    if key not in VALID_KEYS:
        raise HTTPException(status_code=403, detail="Invalid API key")

def validate_input(features: list[float]):
    arr = np.array(features)
    if arr.shape[0] != EXPECTED_DIMS:
        raise HTTPException(400, f"Expected {EXPECTED_DIMS} features")
    if np.any(np.abs(arr) > 100):  # Distribution check
        raise HTTPException(400, "Feature values out of expected range")

@app.post("/predict")
@limiter.limit("100/minute")
async def predict(request: Request, key=Depends(validate_api_key)):
    validate_input(request.features)
    return model.predict(request.features)`
    }
  },
  {
    id: "embeddings-production",
    title: "Embedding Models in Production: Selection, Caching & Scaling",
    excerpt: "How to choose, deploy, and optimize embedding models for vector search at scale — lessons from building RAG systems.",
    category: "AI/ML",
    icon: "🧲",
    date: "2024-04-10",
    readTime: "10 min",
    tags: ["Embeddings", "Vector Search", "Optimization", "RAG"],
    content: [
      "The embedding model is the most critical component in any RAG or semantic search system. A bad embedding model means irrelevant retrievals, no matter how good your LLM is.",
      "Model selection: for English text, BGE-large or E5-large consistently win on MTEB benchmarks. For multilingual, use multilingual-e5. Always benchmark on YOUR data — general benchmarks can be misleading.",
      "Caching embeddings is a massive performance win. I use a two-tier cache: in-memory LRU for the last 10K queries (sub-millisecond), Redis for the last 1M (single-digit ms). Cache hit rate is typically 60-80%.",
      "Batching is crucial for throughput. Instead of embedding one document at a time, batch 32-64 documents per GPU call. This alone improved our pipeline from 50 docs/sec to 800 docs/sec.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from sentence_transformers import SentenceTransformer
from functools import lru_cache
import hashlib, redis, json, numpy as np

model = SentenceTransformer("BAAI/bge-large-en-v1.5")
redis_client = redis.Redis()

def get_embedding(text: str) -> np.ndarray:
    # Check Redis cache first
    key = f"emb:{hashlib.md5(text.encode()).hexdigest()}"
    cached = redis_client.get(key)
    if cached:
        return np.frombuffer(cached, dtype=np.float32)
    
    # Compute and cache
    embedding = model.encode(text, normalize_embeddings=True)
    redis_client.setex(key, 86400, embedding.tobytes())
    return embedding

def batch_embed(texts: list[str], batch_size=64):
    """Batch encoding: 50→800 docs/sec"""
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        embs = model.encode(batch, normalize_embeddings=True)
        all_embeddings.extend(embs)
    return np.array(all_embeddings)`
    }
  },
  {
    id: "agentic-workflows",
    title: "Agentic AI Workflows: From Simple Chains to Production Orchestration",
    excerpt: "Building reliable AI agent systems with tool use, error recovery, and human-in-the-loop patterns.",
    category: "AI/ML",
    icon: "🔗",
    date: "2024-03-05",
    readTime: "11 min",
    tags: ["AI Agents", "Orchestration", "LangGraph", "Production"],
    content: [
      "Simple prompt chains break in production. Real agentic systems need error handling, retries, human approval gates, and audit logging. This is where most tutorials stop and real engineering begins.",
      "I use a state machine pattern: each agent step is a node with defined inputs, outputs, and failure modes. Transitions between nodes are conditional — a 'review' node can route to 'approve' or 'reject'.",
      "Human-in-the-loop is non-negotiable for high-stakes actions. My pattern: the agent proposes an action, a webhook notifies a human, and execution pauses until approval arrives (with a 24h timeout).",
      "Error recovery strategy: each tool call gets 3 retries with exponential backoff. If all retries fail, the agent reformulates its approach (different tool or decomposed sub-steps) before escalating to a human.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal

class AgentState(TypedDict):
    task: str
    plan: list[str]
    results: list[str]
    status: Literal["planning", "executing", "reviewing", "done"]

graph = StateGraph(AgentState)

graph.add_node("planner", plan_task)      # Decompose into steps
graph.add_node("executor", execute_step)   # Run each step
graph.add_node("reviewer", review_result)  # Validate output
graph.add_node("human_gate", await_approval)  # Human approval

graph.add_edge("planner", "executor")
graph.add_conditional_edges("executor", check_result, {
    "success": "reviewer",
    "failure": "planner",  # Re-plan on failure
})
graph.add_conditional_edges("reviewer", needs_approval, {
    "auto_approve": END,
    "needs_human": "human_gate",
})

agent = graph.compile()`
    }
  },
  {
    id: "cost-optimization-ml",
    title: "ML Cloud Cost Optimization: Cutting $50K/Month Without Losing Performance",
    excerpt: "Practical strategies for reducing ML infrastructure costs — spot instances, right-sizing, and smart scheduling.",
    category: "MLOps",
    icon: "💰",
    date: "2024-02-01",
    readTime: "8 min",
    tags: ["Cost Optimization", "AWS", "GPU", "Infrastructure"],
    content: [
      "ML infrastructure costs spiral out of control fast. GPU instances at $3-30/hour, always-on inference endpoints, redundant storage — I've seen teams burn $50K/month unnecessarily.",
      "Biggest win: spot instances for training. AWS spot g4dn.xlarge is $0.16/hour vs $0.53 on-demand (70% savings). Use checkpointing every 30 minutes so spot interruptions don't lose progress.",
      "Right-size your inference endpoints. Most teams over-provision by 3-5x. Profile your actual P99 latency and throughput, then pick the smallest instance that meets your SLO.",
      "Schedule everything: scale training clusters to zero outside work hours (save 65%), use inference auto-scaling with scale-to-zero for low-traffic models. One cron job saved us $12K/month.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import boto3
from datetime import datetime

# Auto-scale inference endpoints based on traffic
sagemaker = boto3.client('sagemaker')

def scale_endpoint(endpoint_name: str):
    hour = datetime.now().hour
    
    if 8 <= hour <= 20:  # Business hours
        min_instances, max_instances = 2, 10
    elif hour in [21, 22]:  # Wind-down
        min_instances, max_instances = 1, 3
    else:  # Night: scale to zero
        min_instances, max_instances = 0, 1
    
    autoscaling = boto3.client('application-autoscaling')
    autoscaling.register_scalable_target(
        ServiceNamespace='sagemaker',
        ResourceId=f'endpoint/{endpoint_name}/variant/primary',
        ScalableDimension='sagemaker:variant:DesiredInstanceCount',
        MinCapacity=min_instances,
        MaxCapacity=max_instances,
    )
    # Monthly savings: ~$12K from night scaling alone`
    }
  },
  // ========== QUICK READS (3-5 min) ==========
  {
    id: "python-one-liners",
    title: "7 Python One-Liners Every ML Engineer Should Know",
    excerpt: "Compact, powerful Python patterns that save hours in data wrangling, feature engineering, and model evaluation.",
    category: "Quick Tips",
    icon: "⚡",
    date: "2024-01-10",
    readTime: "3 min",
    tags: ["Python", "Tips", "Productivity"],
    content: [
      "After 5 years of writing Python for ML, these one-liners have become muscle memory. They're not clever tricks — they're practical patterns that make daily work faster.",
      "1) Flatten nested lists: `flat = [x for sub in nested for x in sub]`. 2) Dictionary merge: `merged = {**dict_a, **dict_b}`. 3) Conditional assignment: `result = value if condition else default`. 4) Group by key: `from itertools import groupby; groups = {k: list(v) for k, v in groupby(sorted(data, key=fn), key=fn)}`. 5) Parallel map: `from multiprocessing import Pool; results = Pool(8).map(process, items)`. 6) Memory-efficient iteration: `chunks = (data[i:i+1000] for i in range(0, len(data), 1000))`. 7) Quick benchmarking: `from timeit import timeit; timeit(lambda: your_function(), number=1000)`.",
    ],
  },
  {
    id: "cuda-oom-debugging",
    title: "Debugging CUDA Out-of-Memory Errors: A Quick Guide",
    excerpt: "The 5 most common causes of GPU OOM errors and how to fix each one in under 5 minutes.",
    category: "Quick Tips",
    icon: "💥",
    date: "2024-01-05",
    readTime: "4 min",
    tags: ["CUDA", "GPU", "Debugging", "PyTorch"],
    content: [
      "CUDA OOM is the most common error in deep learning. Before you rent a bigger GPU, try these fixes: 1) Reduce batch size (obvious but start here). 2) Use `torch.cuda.empty_cache()` between experiments. 3) Enable gradient checkpointing: `model.gradient_checkpointing_enable()` — trades compute for memory, ~30% savings. 4) Use mixed precision: `torch.cuda.amp.autocast()` halves memory for activations. 5) Check for memory leaks: detach tensors in validation loops with `.detach()` and avoid storing computation graphs.",
      "Pro tip: `torch.cuda.memory_summary()` shows exactly where your GPU memory went. Often it's not the model — it's the optimizer states (Adam uses 2x model size) or accumulated gradients from not calling `optimizer.zero_grad()`.",
    ],
    codeSnippet: {
      lang: "python",
      code: `# Quick memory profiler
import torch

def print_gpu_memory():
    allocated = torch.cuda.memory_allocated() / 1e9
    reserved = torch.cuda.memory_reserved() / 1e9
    print(f"Allocated: {allocated:.2f}GB | Reserved: {reserved:.2f}GB")

# Gradient checkpointing — 30% memory savings
model.gradient_checkpointing_enable()

# Mixed precision — halves activation memory
scaler = torch.cuda.amp.GradScaler()
with torch.cuda.amp.autocast():
    output = model(input_ids)
    loss = criterion(output, labels)
scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()`
    }
  },
  {
    id: "git-ml-branching",
    title: "Git Branching Strategies for ML Projects",
    excerpt: "Why gitflow doesn't work for ML and what to use instead — experiment branches, model versioning, and data lineage.",
    category: "Quick Tips",
    icon: "🌿",
    date: "2023-12-15",
    readTime: "4 min",
    tags: ["Git", "MLOps", "Workflow", "Best Practices"],
    content: [
      "Traditional gitflow (feature/develop/release/main) breaks down for ML because code changes are only half the story. Data changes, hyperparameter sweeps, and model artifacts don't fit neatly into feature branches.",
      "My ML branching strategy: `main` (production model + code), `experiment/*` branches for each hypothesis (e.g., `experiment/try-gpt4-embeddings`), and `data/*` branches when training data changes. Each experiment branch includes a `results.md` with metrics, and we use DVC to track the associated data version. Merge experiments to main only after passing automated quality gates.",
    ],
  },
  {
    id: "type-hints-ml",
    title: "The Case for Type Hints in ML Python Code",
    excerpt: "How adding type annotations to ML pipelines caught 23 bugs in our first week — and made onboarding 3x faster.",
    category: "Quick Tips",
    icon: "🏷️",
    date: "2023-11-20",
    readTime: "3 min",
    tags: ["Python", "Type Hints", "Code Quality", "Best Practices"],
    content: [
      "ML code is notoriously untyped. Notebooks encourage `df`, `X`, `y` with no types. But when that code goes to production, bugs hide in shape mismatches, wrong dtypes, and None values that silently propagate.",
      "Adding `def preprocess(df: pd.DataFrame, config: TrainConfig) -> tuple[np.ndarray, np.ndarray]` to our pipeline caught 23 bugs in week one via mypy. The biggest win: new team members could read function signatures and understand the data flow without tracing through Jupyter notebooks.",
    ],
  },
  {
    id: "grafana-ml-patterns",
    title: "5 Grafana Dashboard Patterns for ML Monitoring",
    excerpt: "Copy-paste dashboard designs that give instant visibility into model health, data quality, and infrastructure costs.",
    category: "Quick Tips",
    icon: "📊",
    date: "2023-10-20",
    readTime: "4 min",
    tags: ["Grafana", "Monitoring", "Dashboard", "MLOps"],
    content: [
      "After building 20+ Grafana dashboards for ML systems, these 5 patterns cover 90% of monitoring needs: 1) Model Health Overview — prediction volume, latency P50/P95/P99, error rate, confidence distribution. 2) Data Drift Tracker — PSI scores per feature with threshold lines, updated hourly. 3) Infrastructure Cost — GPU utilization, instance hours by team, cost trending with budget alerts. 4) Experiment Tracker — live training loss curves, validation metrics, GPU memory usage during training. 5) A/B Test Dashboard — canary vs champion metrics side-by-side with statistical significance indicators.",
      "The key design principle: every dashboard should answer ONE question at a glance. If someone needs to click around to understand model health, the dashboard has failed. Use Grafana's stat panels for the top-level number, time series for trends, and tables for drill-down details.",
    ],
  },
  {
    id: "ml-code-reviews",
    title: "The Art of Code Reviews in ML Teams",
    excerpt: "What to look for when reviewing ML code — beyond syntax, check for data leakage, reproducibility, and statistical validity.",
    category: "Quick Tips",
    icon: "👀",
    date: "2023-09-20",
    readTime: "5 min",
    tags: ["Code Review", "Best Practices", "Team", "ML Engineering"],
    content: [
      "Reviewing ML code is fundamentally different from reviewing web app code. The code can be syntactically perfect but scientifically wrong. My ML code review checklist: 1) Data leakage — is test data touching training in any way? 2) Random seeds — can this experiment be reproduced? 3) Metric selection — is accuracy the right metric, or should we use F1/AUC? 4) Feature engineering — are features available at inference time, or only in hindsight? 5) Edge cases — what happens with missing values, empty inputs, or adversarial data?",
      "The most common ML code review finding in our team: data leakage through improper train/test splits. If you fit a scaler on the full dataset before splitting, your test metrics are optimistic. Always fit on train, transform on test. This single check has prevented more production issues than any other.",
    ],
  },
  // ========== MEDIUM ARTICLES (7-10 min) ==========
  {
    id: "transformers-attention",
    title: "Transformers from Scratch: Understanding Self-Attention Intuitively",
    excerpt: "A visual, math-light explanation of how self-attention works — from word embeddings to multi-head attention in 10 minutes.",
    category: "AI/ML",
    icon: "🔄",
    date: "2024-02-20",
    readTime: "10 min",
    tags: ["Transformers", "Attention", "Deep Learning", "NLP"],
    content: [
      "Every ML engineer uses Transformers, but few truly understand self-attention. Here's the intuition: imagine you're reading a sentence. For each word, you 'look at' every other word and decide how much attention to pay to it. 'The cat sat on the mat' — when processing 'sat', you attend strongly to 'cat' (who sat?) and 'mat' (where?).",
      "Mechanically: each word becomes three vectors — Query (what am I looking for?), Key (what do I contain?), and Value (what information do I carry). Attention score = softmax(Q·K^T / √d). High score means 'this word is relevant to me'. The output is a weighted sum of Values.",
      "Multi-head attention runs this process N times in parallel with different learned projections. Head 1 might learn syntactic relationships, Head 2 semantic similarity, Head 3 positional patterns. The outputs are concatenated and projected back to the model dimension.",
      "The 'scaling factor' √d prevents dot products from becoming too large (which pushes softmax into regions with tiny gradients). This seemingly small detail was crucial — without it, training fails on longer sequences.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import torch
import torch.nn.functional as F

def self_attention(Q, K, V, mask=None):
    """Scaled dot-product attention from 'Attention Is All You Need'"""
    d_k = Q.size(-1)
    
    # Compute attention scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # Softmax → attention weights (each row sums to 1)
    attention_weights = F.softmax(scores, dim=-1)
    
    # Weighted sum of values
    output = torch.matmul(attention_weights, V)
    return output, attention_weights

# Example: "The cat sat" → 3 tokens, 64-dim embeddings
Q = K = V = torch.randn(1, 3, 64)  # [batch, seq_len, d_model]
output, weights = self_attention(Q, K, V)
print(weights)  # Shows which words attend to which`
    }
  },
  {
    id: "anomaly-detection-timeseries",
    title: "Anomaly Detection in Time Series: Statistical vs Deep Learning Approaches",
    excerpt: "Comparing Z-scores, Isolation Forest, and autoencoders for detecting anomalies in production metrics data.",
    category: "AI/ML",
    icon: "📉",
    date: "2024-02-05",
    readTime: "9 min",
    tags: ["Anomaly Detection", "Time Series", "Statistics", "Autoencoders"],
    content: [
      "Not every anomaly detection problem needs deep learning. At Deutsche Telekom, we evaluated three approaches on our network metrics data: statistical methods, tree-based models, and autoencoders. The winner surprised us.",
      "Statistical baseline (Z-score + rolling window): simple, interpretable, and caught 78% of known anomalies. The beauty is explainability — 'this metric is 4.2 standard deviations above its 7-day rolling mean' is something operators understand immediately.",
      "Isolation Forest performed best overall: 91% detection rate with only 3% false positives. It excels at multivariate anomalies where individual features look normal but their combination is unusual. Training takes seconds on millions of data points.",
      "LSTM autoencoder was overkill for our use case: 93% detection (only +2% over Isolation Forest) but required GPU training, careful hyperparameter tuning, and was a black box. We use it only for the most complex, high-value monitoring signals.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from sklearn.ensemble import IsolationForest
import numpy as np

# Isolation Forest — best balance of accuracy & simplicity
clf = IsolationForest(
    n_estimators=200,
    contamination=0.02,  # Expected anomaly rate
    max_features=0.8,
    random_state=42
)

# Train on historical "normal" data
clf.fit(normal_metrics)  # shape: (n_samples, n_features)

# Predict: -1 = anomaly, 1 = normal
predictions = clf.predict(new_metrics)
scores = clf.decision_function(new_metrics)  # Lower = more anomalous

# Alert on anomalies with context
anomalies = np.where(predictions == -1)[0]
for idx in anomalies:
    print(f"⚠️ Anomaly at t={idx}, score={scores[idx]:.3f}")
    print(f"   Features: {new_metrics[idx]}")`
    }
  },
  {
    id: "ab-testing-ml",
    title: "A/B Testing ML Models: Statistical Rigor in Production",
    excerpt: "How to properly compare model versions in production — sample sizes, significance testing, and when to call a winner.",
    category: "MLOps",
    icon: "🧪",
    date: "2024-01-25",
    readTime: "8 min",
    tags: ["A/B Testing", "Statistics", "Production", "Experimentation"],
    content: [
      "Most ML teams 'A/B test' by eyeballing metrics for a few hours. That's not a test — it's confirmation bias. Proper A/B testing requires pre-defined sample sizes, significance thresholds, and guard rails.",
      "Step 1: Power analysis. Before the test, calculate the required sample size. For detecting a 2% accuracy improvement with 95% confidence and 80% power, you typically need 3,000-10,000 predictions per variant. Use `statsmodels.stats.power` to compute this.",
      "Step 2: Random traffic splitting. Hash user_id to ensure consistent assignment (same user always sees the same model). Don't use random per-request splitting — it adds noise and makes user-level analysis impossible.",
      "Step 3: Sequential testing. Instead of waiting for the full sample, use sequential analysis (e.g., always-valid p-values) to stop early if one variant is clearly better or clearly harmful. This saved us from running a harmful model variant for 2 extra weeks.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from scipy import stats
import numpy as np

def ab_test_significance(control_metrics, treatment_metrics, alpha=0.05):
    """Two-sample t-test for model comparison"""
    t_stat, p_value = stats.ttest_ind(control_metrics, treatment_metrics)
    
    # Effect size (Cohen's d)
    pooled_std = np.sqrt((np.var(control_metrics) + np.var(treatment_metrics)) / 2)
    cohens_d = (np.mean(treatment_metrics) - np.mean(control_metrics)) / pooled_std
    
    result = {
        "control_mean": np.mean(control_metrics),
        "treatment_mean": np.mean(treatment_metrics),
        "lift": (np.mean(treatment_metrics) - np.mean(control_metrics)) / np.mean(control_metrics) * 100,
        "p_value": p_value,
        "significant": p_value < alpha,
        "effect_size": cohens_d,
        "n_control": len(control_metrics),
        "n_treatment": len(treatment_metrics),
    }
    return result`
    }
  },
  {
    id: "transfer-learning-guide",
    title: "Transfer Learning: When to Fine-Tune vs Feature Extract",
    excerpt: "A decision framework for choosing between full fine-tuning, partial fine-tuning, and using pretrained models as feature extractors.",
    category: "AI/ML",
    icon: "🔀",
    date: "2023-12-05",
    readTime: "8 min",
    tags: ["Transfer Learning", "Fine-Tuning", "Computer Vision", "NLP"],
    content: [
      "Transfer learning isn't one-size-fits-all. The right approach depends on two factors: how similar your data is to the pretrained data, and how much labeled data you have. This creates a 2×2 matrix of strategies.",
      "High similarity + lots of data → Full fine-tune all layers. High similarity + little data → Freeze early layers, fine-tune later layers only. Low similarity + lots of data → Fine-tune with a low learning rate. Low similarity + little data → Use as feature extractor only (freeze everything, train a new head).",
      "In practice at BMW, we used ImageNet-pretrained ResNet50 for vehicle damage detection (high similarity). Freezing the first 3 blocks and fine-tuning the last block + classifier head gave the best results with only 2,000 labeled images — 94% accuracy vs 87% with full fine-tuning (which overfit).",
      "The learning rate schedule matters enormously: use discriminative learning rates — 1e-5 for early layers, 1e-4 for middle, 1e-3 for the new head. This prevents catastrophic forgetting of useful pretrained features.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import torch
from torchvision import models

# Strategy: Partial fine-tuning with discriminative LRs
model = models.resnet50(weights='IMAGENET1K_V2')

# Freeze early layers (general features)
for param in list(model.parameters())[:-20]:
    param.requires_grad = False

# Replace classifier head
model.fc = torch.nn.Sequential(
    torch.nn.Linear(2048, 512),
    torch.nn.ReLU(),
    torch.nn.Dropout(0.3),
    torch.nn.Linear(512, num_classes),
)

# Discriminative learning rates
optimizer = torch.optim.Adam([
    {"params": model.layer3.parameters(), "lr": 1e-5},   # Early: tiny LR
    {"params": model.layer4.parameters(), "lr": 1e-4},   # Middle: medium
    {"params": model.fc.parameters(), "lr": 1e-3},       # Head: normal
])`
    }
  },
  {
    id: "rest-vs-graphql-ml",
    title: "REST vs GraphQL for ML Model Serving: When to Use What",
    excerpt: "Comparing API paradigms for ML inference — latency, flexibility, and real-world trade-offs from production systems.",
    category: "DevOps",
    icon: "🔌",
    date: "2023-11-05",
    readTime: "7 min",
    tags: ["REST", "GraphQL", "API Design", "ML Serving"],
    content: [
      "REST is the default for ML serving — simple POST /predict endpoints. But GraphQL shines when clients need different response shapes: a mobile app wants just the prediction, a dashboard wants prediction + confidence + feature importance + metadata.",
      "At Deutsche Telekom, we started with REST but switched our multi-model recommendation system to GraphQL. The frontend could request exactly the data it needed: `query { recommend(userId: \"123\") { items { title score } modelVersion latencyMs } }` — one request instead of three separate API calls.",
      "Performance-wise, REST wins for simple predict endpoints (lower overhead, easier caching). GraphQL wins for complex ML systems with multiple models, feature stores, and metadata — it eliminates over-fetching and reduces round trips.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import strawberry
from strawberry.fastapi import GraphQLRouter

@strawberry.type
class Prediction:
    label: str
    confidence: float
    model_version: str
    features_used: list[str]
    latency_ms: float

@strawberry.type
class Query:
    @strawberry.field
    async def predict(self, text: str, include_features: bool = False) -> Prediction:
        start = time.time()
        result = await model.predict(text)
        return Prediction(
            label=result.label,
            confidence=result.confidence,
            model_version="v2.3.1",
            features_used=result.features if include_features else [],
            latency_ms=(time.time() - start) * 1000,
        )

app.include_router(GraphQLRouter(strawberry.Schema(Query)), prefix="/graphql")`
    }
  },
  {
    id: "data-lakehouse",
    title: "Data Lakehouse Architecture with Delta Lake for ML",
    excerpt: "Combining the best of data lakes and warehouses — ACID transactions, schema enforcement, and time travel for ML datasets.",
    category: "Data Engineering",
    icon: "🏠",
    date: "2023-10-10",
    readTime: "9 min",
    tags: ["Delta Lake", "Data Lakehouse", "Spark", "Data Engineering"],
    content: [
      "Data lakes are great for storage but terrible for reliability. Data warehouses are reliable but expensive and rigid. The lakehouse pattern — specifically Delta Lake — gives you both: cheap object storage with ACID transactions, schema enforcement, and time travel.",
      "For ML, the killer feature is time travel: `spark.read.format('delta').option('timestampAsOf', '2024-01-01').load('/data/features')`. You can reproduce any training run by reading the exact data version used. No more 'the model was trained on slightly different data' issues.",
      "Schema enforcement prevents silent data corruption. When an upstream team adds a column or changes a type, Delta Lake rejects the write with a clear error instead of silently breaking your feature pipeline days later.",
      "At Deutsche Telekom, moving from raw Parquet to Delta Lake reduced our 'data quality incidents' by 70%. The MERGE operation alone — upsert semantics for slowly changing dimensions — replaced 200 lines of brittle Spark code with a 10-line query.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from delta.tables import DeltaTable
from pyspark.sql import SparkSession

spark = SparkSession.builder.config(
    "spark.jars.packages", "io.delta:delta-spark_2.12:3.0.0"
).getOrCreate()

# Write with schema enforcement
df.write.format("delta").mode("overwrite").save("/data/features/v2")

# Time travel — read data as it was on a specific date
historical_df = spark.read.format("delta") \
    .option("timestampAsOf", "2024-01-15T00:00:00") \
    .load("/data/features/v2")

# MERGE — upsert pattern for feature updates
delta_table = DeltaTable.forPath(spark, "/data/features/v2")
delta_table.alias("target").merge(
    new_features.alias("source"),
    "target.user_id = source.user_id"
).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()`
    }
  },
  // ========== BIG DEEP-DIVE ARTICLES (12-15 min) ==========
  {
    id: "complete-mlops-architecture",
    title: "The Complete MLOps Architecture Guide: From Notebook to Production",
    excerpt: "A comprehensive walkthrough of building an end-to-end MLOps platform — covering every layer from data ingestion to model monitoring.",
    category: "MLOps",
    icon: "🏗️",
    date: "2024-02-28",
    readTime: "15 min",
    tags: ["MLOps", "Architecture", "Production", "End-to-End"],
    content: [
      "After building MLOps platforms at BMW, CARIAD, and Deutsche Telekom, I've converged on an architecture that scales from 1 data scientist to 50+. It has 7 layers, and getting any one wrong creates bottlenecks that compound over time.",
      "Layer 1 — Data Platform: Delta Lake on S3/ADLS for structured data, MinIO for unstructured. Feature Store (Feast) bridges the gap between batch training and real-time serving. DVC tracks dataset versions alongside code.",
      "Layer 2 — Experimentation: JupyterHub for exploration, MLflow for experiment tracking. Every experiment logs parameters, metrics, and artifacts automatically via a custom `@track_experiment` decorator that wraps training functions.",
      "Layer 3 — Training Infrastructure: Kubernetes with GPU node pools. Training jobs submitted via Argo Workflows. Spot instances for cost efficiency (70% savings), with checkpointing every 30 minutes for fault tolerance.",
      "Layer 4 — Model Registry & Validation: MLflow Model Registry with automated quality gates. Before any model reaches 'Staging', it must pass: accuracy threshold, bias audit (Fairlearn), data drift check, and latency benchmark. Human approval required for 'Production'.",
      "Layer 5 — Serving: TorchServe/Triton behind an API gateway. Blue-green deployments for zero-downtime updates. Auto-scaling based on inference queue depth, not CPU — because GPU utilization is what matters.",
      "Layer 6 — Monitoring: Prometheus + Grafana for infrastructure. Custom Python jobs for ML-specific metrics: prediction distribution drift, feature drift (PSI), and confidence calibration. Alerts go to Slack with actionable context.",
      "Layer 7 — Feedback Loop: Ground truth labels flow back via event streams. When enough labeled data accumulates, an automated pipeline evaluates whether retraining would improve performance. If yes, it triggers the full CI/CD pipeline.",
    ],
    codeSnippet: {
      lang: "python",
      code: `# The glue: automated quality gates before promotion
import mlflow
from fairlearn.metrics import MetricFrame, selection_rate

def promote_model(model_name: str, version: int) -> bool:
    """Automated quality gates for model promotion"""
    client = mlflow.tracking.MlflowClient()
    model_version = client.get_model_version(model_name, version)
    run = mlflow.get_run(model_version.run_id)
    
    # Gate 1: Accuracy threshold
    accuracy = run.data.metrics.get("test_accuracy", 0)
    if accuracy < 0.92:
        return reject(f"Accuracy {accuracy:.3f} < 0.92 threshold")
    
    # Gate 2: Bias audit
    predictions = load_test_predictions(run.info.run_id)
    fairness = MetricFrame(metrics=selection_rate,
                           y_true=y_test, y_pred=predictions,
                           sensitive_features=sensitive_attrs)
    if fairness.ratio() < 0.8:
        return reject(f"Fairness ratio {fairness.ratio():.3f} < 0.8")
    
    # Gate 3: Latency benchmark
    p99_latency = run.data.metrics.get("inference_p99_ms", float('inf'))
    if p99_latency > 100:
        return reject(f"P99 latency {p99_latency}ms > 100ms SLO")
    
    # All gates passed → promote
    client.transition_model_version_stage(model_name, version, "Staging")
    notify_team(f"✅ {model_name} v{version} promoted to Staging")
    return True`
    }
  },
  {
    id: "production-chatbot",
    title: "Building a Production AI Chatbot: Architecture, RAG, and Lessons Learned",
    excerpt: "End-to-end guide to building a customer-facing AI chatbot — from architecture decisions to handling edge cases in production.",
    category: "AI/ML",
    icon: "💬",
    date: "2024-02-10",
    readTime: "14 min",
    tags: ["Chatbot", "RAG", "LLM", "Production", "Architecture"],
    content: [
      "Building a demo chatbot takes a weekend. Building one that handles 10,000 conversations/day without hallucinating, going off-topic, or leaking PII? That takes months of engineering. Here's what I learned building customer-facing chatbots.",
      "Architecture: User message → Intent classifier (fast, cheap model) → Router → Specialized handlers. Simple queries (FAQ, order status) use retrieval-only. Complex queries go through a full RAG pipeline with GPT-4. This hybrid approach cuts LLM costs by 60%.",
      "RAG pipeline tuning: The default 'chunk and embed' approach gives mediocre results. Our improvements: 1) Hierarchical chunking — documents → sections → paragraphs with parent-child relationships. 2) Hypothetical document embeddings (HyDE) — generate an ideal answer, embed that, then retrieve. 3) Re-ranking — retrieve 20 candidates, re-rank with a cross-encoder to pick the top 3.",
      "Guardrails are non-negotiable: Input filtering (detect and reject prompt injection attempts), output validation (PII detection, hallucination checks against source docs), topic boundaries (redirect off-topic queries gracefully), and token limits (prevent runaway costs from adversarial inputs).",
      "Conversation memory is tricky at scale. We use a sliding window of the last 5 turns + a summary of the full conversation generated every 10 turns. This keeps context relevant without blowing up the token budget. Summaries are cached in Redis with a 24h TTL.",
      "The #1 lesson: test with real users early. Our 'perfect' chatbot in development failed spectacularly when real users asked misspelled questions, switched topics mid-conversation, and pasted entire error logs as input. Edge case handling is 80% of the work.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from enum import Enum
from pydantic import BaseModel

class Intent(Enum):
    FAQ = "faq"
    ORDER_STATUS = "order_status"
    TECHNICAL_SUPPORT = "technical_support"
    GENERAL_CHAT = "general_chat"
    OFF_TOPIC = "off_topic"

class ChatRouter:
    """Route messages to the cheapest effective handler"""
    
    async def route(self, message: str, history: list) -> str:
        # Step 1: Fast intent classification (local model, <5ms)
        intent = self.intent_classifier.predict(message)
        
        if intent == Intent.OFF_TOPIC:
            return "I'm here to help with Telekom services. How can I assist?"
        
        if intent == Intent.FAQ:
            # Retrieval only — no LLM needed ($0)
            answer = self.faq_store.search(message, top_k=1)
            if answer.confidence > 0.9:
                return answer.text
        
        if intent == Intent.ORDER_STATUS:
            # Tool call — query order API directly
            order = await self.order_api.lookup(extract_order_id(message))
            return format_order_status(order)
        
        # Complex query → full RAG pipeline (expensive, but necessary)
        context = await self.rag_pipeline.retrieve(message, top_k=3)
        response = await self.llm.generate(
            system="You are a Telekom support agent...",
            context=context,
            message=message,
            history=history[-5:],  # Sliding window
            max_tokens=500,
        )
        
        # Guardrail: check for hallucination
        if not self.faithfulness_check(response, context):
            return "Let me connect you with a human agent for this question."
        
        return response`
    }
  },
  {
    id: "aws-mlops-end-to-end",
    title: "End-to-End MLOps on AWS: SageMaker, Step Functions, and Lambda",
    excerpt: "A complete AWS-native MLOps pipeline — from data ingestion to automated retraining, using only managed services.",
    category: "MLOps",
    icon: "☁️",
    date: "2023-11-25",
    readTime: "13 min",
    tags: ["AWS", "SageMaker", "Step Functions", "MLOps", "Serverless"],
    content: [
      "Self-managed MLOps (Kubernetes + MLflow + Airflow) gives maximum flexibility but requires a dedicated platform team. For teams without that luxury, AWS-native MLOps using SageMaker Pipelines, Step Functions, and Lambda can get you 80% of the way with 20% of the ops burden.",
      "Data layer: S3 for raw data, Glue for ETL, Athena for ad-hoc queries. SageMaker Feature Store handles both offline (S3-backed) and online (DynamoDB-backed) feature serving. Data quality checks run via Glue Data Quality before any training pipeline starts.",
      "Training: SageMaker Training Jobs with spot instances (70% cost savings). Hyperparameter tuning via SageMaker HyperBand — it's surprisingly good and eliminates the need for custom Ray Tune setups. Model artifacts land in S3, experiment metadata in SageMaker Experiments.",
      "Orchestration: Step Functions ties everything together. A state machine that goes: trigger (S3 event / schedule) → validate data → train → evaluate → compare with champion → deploy canary → monitor → promote or rollback. Each step is a Lambda or SageMaker action.",
      "Monitoring: CloudWatch custom metrics for model performance, SageMaker Model Monitor for data drift detection. EventBridge rules trigger automated retraining when drift exceeds thresholds. The whole pipeline runs without any servers to manage.",
      "Cost reality: for a mid-size ML team (5 models, daily retraining), the AWS-native stack costs ~$800/month. The self-managed equivalent (EKS cluster + managed databases + monitoring) was $3,200/month. The trade-off is vendor lock-in, but for many teams it's worth it.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import sagemaker
from sagemaker.workflow.pipeline import Pipeline
from sagemaker.workflow.steps import TrainingStep, ProcessingStep, CreateModelStep
from sagemaker.workflow.conditions import ConditionGreaterThanOrEqualTo
from sagemaker.workflow.condition_step import ConditionStep

# Define the ML pipeline
step_process = ProcessingStep(name="PreprocessData", ...)
step_train = TrainingStep(name="TrainModel",
    estimator=PyTorch(
        entry_point="train.py",
        instance_type="ml.g4dn.xlarge",
        use_spot_instances=True,   # 70% savings
        max_wait=7200,
    ),
    inputs={"train": step_process.properties.ProcessingOutputConfig...}
)
step_eval = ProcessingStep(name="EvaluateModel", ...)

# Conditional deployment — only if accuracy > threshold
condition = ConditionGreaterThanOrEqualTo(
    left=JsonGet(step_eval.properties.ProcessingOutputConfig, "accuracy"),
    right=0.92,
)
step_deploy = CreateModelStep(name="DeployModel", ...)
step_condition = ConditionStep(
    name="AccuracyCheck",
    conditions=[condition],
    if_steps=[step_deploy],
    else_steps=[],  # Skip deployment if accuracy too low
)

pipeline = Pipeline(
    name="ml-training-pipeline",
    steps=[step_process, step_train, step_eval, step_condition],
)`
    }
  },
  {
    id: "reinforcement-learning-prod",
    title: "Reinforcement Learning in Production: Beyond OpenAI Gym",
    excerpt: "Deploying RL agents in real-world systems — reward engineering, safety constraints, and online learning challenges.",
    category: "AI/ML",
    icon: "🎮",
    date: "2023-08-25",
    readTime: "13 min",
    tags: ["Reinforcement Learning", "Production", "Reward Engineering", "Safety"],
    content: [
      "RL in research: train in a simulator, report reward curves, publish. RL in production: deal with sparse rewards, safety constraints, non-stationary environments, and the cold-start problem. The gap is enormous.",
      "Reward engineering is the hardest part. Your reward function encodes your business objective, and getting it wrong leads to reward hacking — the agent finds unintended shortcuts. At one company, an RL-based pricing agent learned to price items at $0.01 because that maximized 'transactions per minute' (the poorly designed reward).",
      "Safety constraints are non-negotiable in production RL. We use constrained policy optimization: the agent maximizes reward SUBJECT TO safety constraints (e.g., never price below cost, never recommend out-of-stock items). Lagrangian relaxation makes this tractable.",
      "The exploration-exploitation dilemma is real in production. Pure exploration means showing bad recommendations to real users. Our solution: offline RL. Train on historical logged data using Conservative Q-Learning (CQL) — no exploration needed. Then deploy with epsilon-greedy (95% exploitation, 5% exploration) for continuous improvement.",
      "Online learning introduces non-stationarity. User preferences change seasonally, new products appear, competitors change pricing. We retrain the policy weekly on a rolling 30-day window, with A/B testing against the previous policy before full rollout.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import torch
import numpy as np

class SafeRecommendationAgent:
    """RL agent with safety constraints for production recommendations"""
    
    def __init__(self, model, safety_constraints):
        self.model = model  # Trained policy network
        self.constraints = safety_constraints
        self.epsilon = 0.05  # 5% exploration
    
    def act(self, state, available_items):
        # Epsilon-greedy exploration
        if np.random.random() < self.epsilon:
            action = np.random.choice(available_items)
        else:
            with torch.no_grad():
                q_values = self.model(state)
                # Mask unavailable items
                q_values[~np.isin(range(len(q_values)), available_items)] = -float('inf')
                action = q_values.argmax().item()
        
        # Safety check — reject unsafe actions
        if not self.constraints.is_safe(action, state):
            action = self.constraints.get_safe_fallback(state)
        
        return action
    
    def compute_reward(self, action, outcome):
        """Multi-objective reward with safety penalty"""
        revenue = outcome.get("revenue", 0)
        satisfaction = outcome.get("user_rating", 0) / 5.0
        safety_penalty = -10 if outcome.get("constraint_violated", False) else 0
        
        return 0.6 * revenue + 0.3 * satisfaction + safety_penalty`
    }
  },
  {
    id: "automotive-ai-lessons",
    title: "AI in Automotive: Lessons from BMW, CARIAD, and the Future of Mobility",
    excerpt: "What I learned building AI systems for the automotive industry — from diagnostic models to autonomous testing pipelines.",
    category: "Industry",
    icon: "🚗",
    date: "2023-07-15",
    readTime: "14 min",
    tags: ["Automotive", "BMW", "CARIAD", "Industry", "Autonomous"],
    content: [
      "The automotive industry is simultaneously the most exciting and most frustrating place to deploy AI. The stakes are high (safety-critical systems), the data is rich (millions of sensor readings), and the regulatory requirements are intense (ISO 26262, UNECE R155). Here's what I learned across BMW and CARIAD.",
      "At BMW, I built RAG-powered diagnostic models that helped service technicians diagnose vehicle issues. The challenge wasn't the AI — it was the data. Service reports were free-text in 12 languages, with abbreviations, typos, and domain jargon. We spent 6 months just cleaning and structuring the data before training the first model. Lesson: in automotive AI, data engineering is 70% of the work.",
      "The RAG system achieved a 12% precision improvement over keyword search. But the real win was the feedback loop: technicians could rate suggestions, and we fine-tuned the retrieval model monthly on this feedback. After 6 months, precision improved by another 18% — the system learned from its users.",
      "At CARIAD (Volkswagen's software company), I worked on integrating LLMs into automotive CI/CD/CT pipelines for cybersecurity testing. The goal: use LLMs to generate fuzz test cases that find vulnerabilities in vehicle ECU software. We evaluated 16 LLM models in Azure AI Foundry and found that GPT-4 generated test cases that found 13% more vulnerabilities than traditional fuzzing tools.",
      "The biggest challenge in automotive AI: trust and validation. When a model's suggestion could affect vehicle safety, you need exhaustive validation. Our pipeline: unit tests on model outputs → integration tests against simulation environments → hardware-in-the-loop testing → limited fleet deployment → full rollout. Each stage gates the next. This pipeline takes weeks, but it ensures safety.",
      "The future is exciting: AI-driven adaptive vehicle calibration (no more manual tuning of 10,000+ parameters), predictive maintenance that knows about failures before they happen, and autonomous testing that generates edge cases humans would never think of. The companies that master MLOps for safety-critical systems will lead the next generation of mobility.",
    ],
  },
  {
    id: "spark-data-pipelines",
    title: "Building Scalable Data Pipelines with Apache Spark: Patterns That Work",
    excerpt: "Battle-tested Spark patterns for ML data pipelines — from efficient joins to handling data skew at terabyte scale.",
    category: "Data Engineering",
    icon: "⚡",
    date: "2023-06-20",
    readTime: "12 min",
    tags: ["Apache Spark", "Data Engineering", "ETL", "Big Data"],
    content: [
      "Spark is the backbone of most ML data pipelines. But 'it runs on Spark' doesn't mean 'it runs well on Spark'. After processing terabytes of data at Deutsche Telekom and BMW, these patterns consistently separate slow-and-expensive from fast-and-cheap.",
      "Pattern 1: Broadcast joins for dimension tables. If one side of a join fits in memory (< 10GB), broadcast it. This avoids the shuffle that makes joins slow. `df.join(broadcast(small_df), 'key')` can turn a 30-minute job into a 2-minute one.",
      "Pattern 2: Handle data skew with salting. If 80% of your data has key='default', the reducer processing that key becomes a bottleneck. Add a random salt (0-9) to the key, join on salted_key, then aggregate. This distributes the load across 10 reducers instead of 1.",
      "Pattern 3: Predicate pushdown. When reading from Parquet/Delta, filter BEFORE join. Spark can push filters down to the data source, reading only relevant partitions. Moving a `.filter()` before a `.join()` once reduced our job runtime from 4 hours to 20 minutes.",
      "Pattern 4: Cache strategically. `df.cache()` keeps data in memory between multiple operations on the same DataFrame. But caching too much causes spills to disk (worse than recomputing). Profile with Spark UI to find the right balance.",
      "Pattern 5: Adaptive Query Execution (AQE). Enable it (`spark.sql.adaptive.enabled=true`). AQE dynamically optimizes query plans at runtime — auto-coalescing partitions, auto-optimizing skew joins, and auto-selecting broadcast joins. It's free performance.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.skewJoin.enabled", "true") \
    .getOrCreate()

# Pattern 1: Broadcast join for small dimension tables
from pyspark.sql.functions import broadcast
enriched = events.join(broadcast(users), "user_id")  # 30min → 2min

# Pattern 2: Salted join for skewed keys
salt_range = 10
skewed_df = skewed_df.withColumn("salt", (F.rand() * salt_range).cast("int"))
small_df_exploded = small_df.crossJoin(
    spark.range(salt_range).withColumnRenamed("id", "salt")
)
result = skewed_df.join(small_df_exploded, ["key", "salt"]).drop("salt")

# Pattern 3: Filter BEFORE join (predicate pushdown)
# ❌ Slow: events.join(users).filter("country = 'DE'")
# ✅ Fast: events.filter("country = 'DE'").join(users)
filtered = events.filter(F.col("date") >= "2024-01-01") \
    .join(broadcast(users), "user_id")`
    }
  },
  // ===== NEW ARTICLES =====
  {
    id: "mcp-protocol-guide",
    title: "Model Context Protocol (MCP): The USB-C of AI Integration",
    excerpt: "A deep dive into Anthropic's MCP standard — how it works, why it matters, and how to build MCP servers for your tools.",
    category: "AI/ML",
    icon: "🔌",
    date: "2026-03-10",
    readTime: "11 min",
    tags: ["MCP", "AI Agents", "Protocol", "Anthropic", "Tool Use"],
    content: [
      "Every AI application eventually needs to connect to external systems — databases, APIs, file systems, SaaS tools. Without a standard, this means N models × M tools = N×M custom integrations. MCP changes this.",
      "MCP (Model Context Protocol) is to AI what USB-C is to devices: a single standard interface. An MCP server exposes Resources (data), Tools (actions), and Prompts (templates). Any MCP-compatible AI client can use any MCP server — write once, use everywhere.",
      "Building an MCP server is surprisingly simple. Define your tools with JSON schemas, implement the handler functions, and expose them via the MCP SDK. I built one for our internal knowledge base in 2 hours — it now works with Claude, ChatGPT, and our custom agents.",
      "The real power is composability: chain multiple MCP servers together. A 'research agent' connects to an MCP server for web search, another for database access, and a third for document generation. Each server is independently developed, tested, and deployed.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("knowledge-base")

@server.tool("search_docs")
async def search_docs(query: str, limit: int = 5) -> list[TextContent]:
    """Search the internal knowledge base for relevant documents."""
    results = await vectorstore.similarity_search(query, k=limit)
    return [TextContent(text=f"[{r.metadata['title']}]\\n{r.page_content}") 
            for r in results]

@server.tool("create_ticket")
async def create_ticket(title: str, description: str, priority: str = "medium"):
    """Create a support ticket in the ticketing system."""
    ticket = await jira_client.create_issue(
        project="SUPPORT", summary=title,
        description=description, priority=priority
    )
    return TextContent(text=f"Created ticket {ticket.key}: {title}")

# Expose as stdio transport (for local) or SSE (for remote)
server.run(transport="stdio")`
    }
  },
  {
    id: "deepseek-r1-analysis",
    title: "DeepSeek-R1: Open-Source Reasoning Models and What They Mean for AI Engineering",
    excerpt: "Analyzing DeepSeek's reasoning model: chain-of-thought at inference time, performance vs GPT-4o, and implications for production AI.",
    category: "AI/ML",
    icon: "🧩",
    date: "2026-02-20",
    readTime: "10 min",
    tags: ["DeepSeek", "Reasoning", "Open Source", "LLM", "Analysis"],
    content: [
      "DeepSeek-R1 represents a paradigm shift: test-time compute scaling. Instead of making the model bigger, give it more time to 'think'. R1 generates internal chain-of-thought reasoning before answering, and the results are remarkable — matching GPT-4o on math and coding benchmarks at a fraction of the cost.",
      "The key innovation: reinforcement learning for reasoning. R1 is trained with RL (not just SFT) to explore multiple reasoning paths and select the best one. This is fundamentally different from GPT-4 — it's not just pattern matching, it's genuine problem-solving.",
      "For production use: R1's reasoning tokens add latency (2-10x more tokens generated) but dramatically improve accuracy on complex tasks. The trick is routing: use a fast model (GPT-4o-mini) for simple queries, R1 for complex reasoning. Our hybrid approach saves 70% cost while maintaining quality.",
      "The open-source angle: R1's weights are freely available. This means on-premise deployment with no API costs, full data privacy, and customization. We fine-tuned R1-Distill-Qwen-7B for our domain and it outperforms GPT-4o on our specific benchmarks while running on a single A10G GPU.",
    ],
    codeSnippet: {
      lang: "python",
      code: `from openai import OpenAI

# Smart routing: simple → fast model, complex → reasoning model
async def smart_route(query: str) -> str:
    complexity = await classify_complexity(query)  # fast classifier
    
    if complexity == "simple":
        # GPT-4o-mini: fast, cheap ($0.15/1M tokens)
        response = await client.chat.completions.create(
            model="gpt-4o-mini", messages=[{"role": "user", "content": query}]
        )
    else:
        # DeepSeek-R1: slower but much better reasoning
        response = await deepseek_client.chat.completions.create(
            model="deepseek-reasoner",
            messages=[{"role": "user", "content": query}],
            # R1 generates <think>...</think> reasoning tokens
            # then provides the final answer
        )
    
    return response.choices[0].message.content

# Result: 70% cost savings, equal quality on complex tasks`
    }
  },
  {
    id: "llm-caching-strategies",
    title: "LLM Caching Strategies: Cutting Costs by 60% Without Losing Quality",
    excerpt: "Semantic caching, prompt caching, and KV-cache optimization — practical techniques to make LLM apps affordable.",
    category: "AI/ML",
    icon: "💾",
    date: "2026-01-15",
    readTime: "9 min",
    tags: ["LLM", "Caching", "Cost Optimization", "Redis", "Production"],
    content: [
      "LLM API calls are expensive. At $2.50/1M input tokens for GPT-4o, a chatbot handling 10K conversations/day can cost $3,000+/month. Caching is the single most effective cost reduction technique — we cut costs by 62% with three layers.",
      "Layer 1: Exact match cache (Redis). Hash the prompt + model + temperature, cache the response. Hit rate: ~15% for FAQ-style queries. Layer 2: Semantic cache. Embed the query, search for similar cached queries (cosine > 0.95), return the cached response. Hit rate: 30-45% depending on query diversity.",
      "Layer 3: Prompt caching (provider-level). Anthropic and OpenAI both offer prompt caching for system prompts and few-shot examples. If your system prompt is 2000 tokens and you make 1000 calls/day, caching saves $5/day just on that prefix.",
      "The implementation detail that matters: cache invalidation. We tag cached responses with source document versions. When a document updates, all responses derived from it are invalidated. Without this, you serve stale answers from your knowledge base.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import hashlib, redis, numpy as np
from sentence_transformers import SentenceTransformer

redis_client = redis.Redis()
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

class SemanticCache:
    def __init__(self, similarity_threshold=0.95):
        self.threshold = similarity_threshold
    
    async def get(self, query: str) -> str | None:
        # Layer 1: Exact match
        exact_key = f"llm:exact:{hashlib.md5(query.encode()).hexdigest()}"
        cached = redis_client.get(exact_key)
        if cached:
            return cached.decode()
        
        # Layer 2: Semantic similarity
        query_emb = embed_model.encode(query)
        # Search vector index for similar queries
        similar = await self.vector_search(query_emb, top_k=1)
        if similar and similar[0].score > self.threshold:
            return similar[0].response
        
        return None  # Cache miss → call LLM
    
    async def set(self, query: str, response: str, ttl=3600):
        exact_key = f"llm:exact:{hashlib.md5(query.encode()).hexdigest()}"
        redis_client.setex(exact_key, ttl, response)
        # Also store in vector index for semantic matching
        query_emb = embed_model.encode(query)
        await self.vector_store(query_emb, query, response)`
    }
  },
  {
    id: "kubernetes-gpu-autoscaling",
    title: "GPU Autoscaling on Kubernetes: Scaling ML Inference from 0 to 1000 RPS",
    excerpt: "How to build a Kubernetes setup that scales GPU inference pods from zero to handle traffic spikes — with cost optimization.",
    category: "DevOps",
    icon: "📈",
    date: "2026-01-05",
    readTime: "10 min",
    tags: ["Kubernetes", "GPU", "Autoscaling", "Cost", "Infrastructure"],
    content: [
      "GPU instances are expensive ($3-30/hour). Running them 24/7 for an ML service that gets 10 RPS at night and 1000 RPS during peaks is wasteful. Kubernetes GPU autoscaling solves this — but it's tricky to get right.",
      "The challenge: GPU pod startup is slow (30-60 seconds for model loading). You can't use standard HPA with CPU metrics. Instead, use custom metrics: inference queue depth, P99 latency, or GPU memory utilization.",
      "Our setup: KEDA (Kubernetes Event-Driven Autoscaler) watches a Prometheus metric for queue depth. When queue > 10, scale up. When queue = 0 for 10 minutes, scale to zero. KEDA's cooldown period prevents flapping.",
      "The model loading problem: we pre-bake models into the container image and use init containers to warm the GPU. Combined with PodDisruptionBudgets (always keep at least 1 pod), this ensures zero-downtime scaling with <30s new pod readiness.",
    ],
    codeSnippet: {
      lang: "yaml",
      code: `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: ml-inference-scaler
spec:
  scaleTargetRef:
    name: ml-inference
  minReplicaCount: 0          # Scale to zero!
  maxReplicaCount: 20
  cooldownPeriod: 600          # 10 min before scale-down
  triggers:
  - type: prometheus
    metadata:
      serverAddress: http://prometheus:9090
      metricName: inference_queue_depth
      query: sum(inference_queue_depth{service="ml-inference"})
      threshold: "10"           # Scale when queue > 10
  - type: prometheus
    metadata:
      metricName: inference_p99_latency_ms
      query: histogram_quantile(0.99, rate(inference_duration_seconds_bucket[5m]))
      threshold: "200"          # Scale when P99 > 200ms`
    }
  },
  {
    id: "vllm-production-guide",
    title: "vLLM in Production: Serving LLMs at Scale with Continuous Batching",
    excerpt: "A production deployment guide for vLLM: configuration, monitoring, multi-model serving, and performance tuning.",
    category: "AI/ML",
    icon: "⚡",
    date: "2025-12-28",
    readTime: "10 min",
    tags: ["vLLM", "LLM Serving", "Production", "GPU", "Performance"],
    content: [
      "vLLM is the gold standard for LLM inference serving. Its continuous batching and PagedAttention give 2-4x throughput improvement over naive serving. But going from 'vllm serve model' to production requires careful configuration.",
      "Key settings: --max-model-len controls the maximum sequence length (lower = more concurrent requests). --gpu-memory-utilization=0.9 leaves headroom for the OS. --tensor-parallel-size for multi-GPU serving. --max-num-batched-tokens controls the batch size.",
      "Monitoring is critical: track tokens/second throughput, time-to-first-token (TTFT), inter-token latency, and GPU memory utilization. We use Prometheus + Grafana with vLLM's built-in metrics endpoint.",
      "Multi-model serving: run multiple vLLM instances behind a load balancer. Route based on model: /v1/chat/completions with model='llama-3.1-8b' goes to GPU pool A, model='llama-3.1-70b' goes to GPU pool B. This maximizes GPU utilization per model size.",
    ],
    codeSnippet: {
      lang: "python",
      code: `# Production vLLM deployment with monitoring
from vllm import LLM, SamplingParams
from prometheus_client import Histogram, Counter

# Metrics
ttft_histogram = Histogram('llm_ttft_seconds', 'Time to first token')
throughput_counter = Counter('llm_tokens_generated_total', 'Total tokens')

# Initialize with production settings
llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    tensor_parallel_size=1,          # 1 GPU for 8B model
    gpu_memory_utilization=0.90,     # 90% GPU memory
    max_model_len=8192,              # Limit context for throughput
    enforce_eager=False,             # Use CUDA graphs
    enable_prefix_caching=True,      # Cache common prefixes
    max_num_batched_tokens=32768,    # Batch size budget
)

# Serve with OpenAI-compatible API
# vllm serve meta-llama/Llama-3.1-8B-Instruct \\
#   --host 0.0.0.0 --port 8000 \\
#   --api-key $VLLM_API_KEY \\
#   --enable-prefix-caching \\
#   --max-model-len 8192`
    }
  },
  {
    id: "dspy-prompt-optimization",
    title: "DSPy: Replacing Prompt Engineering with Programming",
    excerpt: "How DSPy compiles natural language signatures into optimized prompts — moving from artisanal prompting to systematic optimization.",
    category: "AI/ML",
    icon: "🔬",
    date: "2025-11-15",
    readTime: "9 min",
    tags: ["DSPy", "Prompt Optimization", "LLM", "Research", "Stanford"],
    content: [
      "DSPy (Declarative Self-improving Python) treats LLM prompts as programs, not strings. Instead of hand-crafting prompts, you define signatures (input → output), compose them into pipelines, and let DSPy's optimizers find the best prompts automatically.",
      "The key insight: prompts are hyperparameters. Just as we tune learning rates for neural networks, DSPy tunes prompts with few-shot examples, instruction phrasing, and chain-of-thought strategies — all based on a metric you define.",
      "In our RAG system, switching from hand-crafted prompts to DSPy-optimized prompts improved faithfulness by 15% and answer relevancy by 12%. The optimizer found few-shot examples we would never have chosen manually.",
      "The workflow: 1) Define signatures (question, context → answer). 2) Compose modules (Retrieve → Generate). 3) Define a metric (faithfulness score). 4) Run the optimizer (BootstrapFewShotWithRandomSearch). 5) Deploy the compiled program.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import dspy

# Define the LLM and retriever
lm = dspy.LM("openai/gpt-4o-mini", temperature=0.7)
dspy.configure(lm=lm)

# Define signatures — what goes in, what comes out
class GenerateAnswer(dspy.Signature):
    """Answer questions based on the given context."""
    context: str = dspy.InputField(desc="relevant passages")
    question: str = dspy.InputField()
    answer: str = dspy.OutputField(desc="concise, factual answer")

# Compose into a RAG pipeline
class RAG(dspy.Module):
    def __init__(self):
        self.retrieve = dspy.Retrieve(k=3)
        self.generate = dspy.ChainOfThought(GenerateAnswer)
    
    def forward(self, question):
        context = self.retrieve(question).passages
        return self.generate(context=context, question=question)

# Optimize prompts automatically
optimizer = dspy.BootstrapFewShotWithRandomSearch(
    metric=faithfulness_metric, max_bootstrapped_demos=4
)
compiled_rag = optimizer.compile(RAG(), trainset=train_examples)
# Now compiled_rag has optimized prompts + few-shot examples`
    }
  },
  {
    id: "testing-llm-applications",
    title: "Testing LLM Applications: A Practical Framework for Non-Deterministic Systems",
    excerpt: "How to write tests for systems that give different answers every time — unit tests, eval suites, and regression detection.",
    category: "AI/ML",
    icon: "🧪",
    date: "2025-10-20",
    readTime: "9 min",
    tags: ["Testing", "LLM", "Quality", "CI/CD", "Evaluation"],
    content: [
      "Testing LLM applications is fundamentally different from testing traditional software. The same input can produce different outputs, and 'correct' is often subjective. But that doesn't mean we can't test rigorously.",
      "Three-tier testing framework: Tier 1 — Unit tests (deterministic): test input parsing, output formatting, tool schemas, guardrail rules. These are traditional tests. Tier 2 — Eval suite (statistical): run 100+ test cases, measure pass rate. 'The system answers correctly 85%+ of the time' is a testable assertion.",
      "Tier 3 — Regression detection: every deploy runs the eval suite. If any metric drops by >5% from the baseline, the deploy is blocked. We store baseline metrics in Git alongside the code.",
      "LLM-as-judge: for subjective quality, use a stronger model to evaluate a weaker model's outputs. GPT-4 judging GPT-3.5 responses against a rubric is surprisingly reliable (>90% agreement with human raters when the rubric is specific).",
    ],
    codeSnippet: {
      lang: "python",
      code: `import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric

# Tier 1: Deterministic unit tests
def test_input_parsing():
    assert parse_query("weather in Berlin") == {"intent": "weather", "city": "Berlin"}

def test_guardrail_blocks_injection():
    assert guardrail.check("ignore previous instructions") == "blocked"

# Tier 2: Statistical eval suite
@pytest.mark.parametrize("case", load_eval_dataset("rag_eval_100.json"))
def test_rag_quality(case):
    response = rag_pipeline.invoke(case["question"])
    test_case = LLMTestCase(
        input=case["question"],
        actual_output=response,
        retrieval_context=case["context"],
        expected_output=case["expected"],
    )
    # Assert faithfulness > 0.8 and relevancy > 0.7
    assert_test(test_case, [
        FaithfulnessMetric(threshold=0.8),
        AnswerRelevancyMetric(threshold=0.7),
    ])

# Tier 3: Regression gate in CI
def test_no_regression():
    current = run_eval_suite()
    baseline = load_baseline("metrics_baseline.json")
    for metric, value in current.items():
        assert value >= baseline[metric] * 0.95, f"{metric} regressed!"`
    }
  },
  {
    id: "structured-outputs-guide",
    title: "Structured Outputs from LLMs: JSON, Pydantic, and Type-Safe AI",
    excerpt: "Getting reliable structured data from LLMs — JSON mode, function calling, Instructor library, and when to use each.",
    category: "AI/ML",
    icon: "📋",
    date: "2025-09-25",
    readTime: "8 min",
    tags: ["LLM", "Structured Output", "Pydantic", "JSON", "Production"],
    content: [
      "Free-text LLM responses are great for chatbots but terrible for automation. When you need to extract entities, classify documents, or feed LLM output into downstream systems, you need structured, validated output.",
      "Three approaches: 1) JSON mode (simple): ask for JSON, hope for the best. OpenAI's response_format={'type':'json_object'} guarantees valid JSON but not valid schema. 2) Function calling (reliable): define a JSON schema, the LLM fills in the values. Works well for flat structures.",
      "3) Instructor library (best): wraps any LLM API with Pydantic validation and automatic retries. Define a Pydantic model, call `instructor.patch(client).chat.completions.create(response_model=MyModel)`. If the LLM output doesn't validate, it retries with the error message.",
      "In production, we use Instructor for all structured extraction. Retry rates are typically 5-10% (the LLM needs one correction), and final validation success is >99.5%. This turns LLMs into reliable data extraction engines.",
    ],
    codeSnippet: {
      lang: "python",
      code: `import instructor
from pydantic import BaseModel, Field
from openai import OpenAI

client = instructor.patch(OpenAI())

class ExtractedEntity(BaseModel):
    name: str = Field(description="Full entity name")
    category: str = Field(description="Entity type: person, org, location, product")
    confidence: float = Field(ge=0, le=1, description="Extraction confidence")

class DocumentAnalysis(BaseModel):
    summary: str = Field(max_length=200)
    entities: list[ExtractedEntity]
    sentiment: float = Field(ge=-1, le=1, description="-1 negative to 1 positive")
    language: str

# Type-safe, validated, auto-retried
analysis = client.chat.completions.create(
    model="gpt-4o-mini",
    response_model=DocumentAnalysis,  # Pydantic model
    max_retries=3,                     # Auto-retry on validation failure
    messages=[{"role": "user", "content": f"Analyze: {document_text}"}]
)
# analysis.entities[0].name → guaranteed to be a string
# analysis.sentiment → guaranteed to be between -1 and 1`
    }
  },
];

const BlogSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(BLOG_POSTS.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter(p => {
      const matchCat = filter === "All" || p.category === filter;
      const matchSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="blog-container">
      <div className="blog-toolbar">
        <div className="blog-toolbar-top">
          <input
            className="blog-search"
            placeholder="🔍 Search articles by title, tag, or content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="rss-btn" title="Subscribe via RSS">
            📡 RSS Feed
          </a>
        </div>
        <div className="blog-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${filter === cat ? 'filter-chip--active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="blog-result-count">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="blog-grid">
        {filtered.map((post, i) => (
          <BlogCard
            key={post.id}
            post={post}
            index={i}
            expanded={expandedId === post.id}
            onToggle={() => setExpandedId(expandedId === post.id ? null : post.id)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="blog-empty">No articles match your search.</p>
      )}
    </div>
  );
};

const BlogCard = ({ post, index, expanded, onToggle }: {
  post: BlogPost;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const { ref, isInView } = useInView();

  // Auto-calculate reading time from content
  const calculatedReadTime = useMemo(() => {
    const wordCount = post.content.join(' ').split(/\s+/).length + 
      (post.codeSnippet ? post.codeSnippet.code.split(/\s+/).length * 0.5 : 0);
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }, [post]);

  // Simple syntax highlighting for blog code snippets
  const highlightSnippet = useMemo(() => {
    if (!post.codeSnippet) return '';
    let html = post.codeSnippet.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/(#.*$|\/\/.*$|--.*$)/gm, '<span class="code-comment">$1</span>');
    html = html.replace(/(["'`])(?:(?!\1|\\).|\\.)*?\1/g, '<span class="code-string">$&</span>');
    const keywords = /\b(import|from|class|def|return|async|await|const|let|var|function|if|else|for|while|self|super|apiVersion|kind|metadata|spec|name)\b/g;
    html = html.replace(keywords, '<span class="code-keyword">$&</span>');
    return html;
  }, [post.codeSnippet]);

  return (
    <div
      ref={ref}
      className={`blog-card reveal-item ${isInView ? 'revealed' : ''} ${expanded ? 'blog-card--expanded' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="blog-card-header" onClick={onToggle}>
        <div className="blog-card-top">
          <span className="blog-card-icon">{post.icon}</span>
          <div className="blog-card-meta-row">
            <span className="blog-card-cat">{post.category}</span>
            <span className="blog-card-date">{post.date}</span>
            <span className="blog-card-read">⏱ {calculatedReadTime}</span>
          </div>
        </div>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-tags">
          {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <span className={`blog-chevron ${expanded ? 'blog-chevron--open' : ''}`}>↓ {expanded ? 'Read less' : 'Read more'}</span>
      </div>

      {expanded && (
        <div className="blog-card-body">
          {post.content.map((p, i) => (
            <p key={i} className="blog-p">{p}</p>
          ))}
          {post.codeSnippet && (
            <div className="blog-code-block">
              <div className="blog-code-header">
                <span className="blog-code-lang">{post.codeSnippet.lang}</span>
                <button className="cp-btn" onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(post.codeSnippet!.code);
                }}>📋 Copy</button>
              </div>
              <pre className="blog-code" dangerouslySetInnerHTML={{ __html: highlightSnippet }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogSection;
