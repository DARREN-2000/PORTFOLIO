import { useState, useCallback, useMemo } from "react";

interface CodeExample {
  lang: string;
  icon: string;
  label: string;
  code: string;
  output: string;
  description: string;
}

const CODE_EXAMPLES: CodeExample[] = [
  {
    lang: "python", icon: "🐍", label: "Python",
    code: `# Neural Network Forward Pass
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

model = SimpleNet()
x = torch.randn(1, 784)
output = model(x)
print(f"Output shape: {output.shape}")
print(f"Predictions: {output.argmax(dim=1)}")`,
    output: `Output shape: torch.Size([1, 10])
Predictions: tensor([3])`,
    description: "PyTorch neural network with forward pass"
  },
  {
    lang: "javascript", icon: "⚡", label: "JavaScript",
    code: `// Async Data Pipeline
const fetchAndProcess = async (urls) => {
  const results = await Promise.allSettled(
    urls.map(url => fetch(url).then(r => r.json()))
  );
  
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .reduce((acc, data) => ({
      ...acc,
      count: (acc.count || 0) + data.length,
      items: [...(acc.items || []), ...data]
    }), {});
};

// Usage
const data = await fetchAndProcess([
  '/api/users', '/api/posts', '/api/comments'
]);
console.log(\`Processed \${data.count} items\`);`,
    output: `Processed 247 items
Pipeline completed in 1.2s`,
    description: "Async data pipeline with Promise.allSettled"
  },
  {
    lang: "typescript", icon: "📘", label: "TypeScript",
    code: `// Generic Repository Pattern
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

class UserRepository implements Repository<User> {
  private store = new Map<string, User>();
  
  async findById(id: string) {
    return this.store.get(id) ?? null;
  }
  // ... implementation
}`,
    output: `✓ UserRepository implements Repository<User>
✓ Type-safe CRUD operations
✓ Generic constraint: T extends { id: string }`,
    description: "Generic repository pattern with type constraints"
  },
  {
    lang: "sql", icon: "🗄️", label: "SQL",
    code: `-- ML Model Performance Dashboard
WITH model_metrics AS (
  SELECT 
    m.model_name,
    m.version,
    AVG(e.accuracy) as avg_accuracy,
    AVG(e.f1_score) as avg_f1,
    COUNT(e.id) as eval_count,
    MAX(e.evaluated_at) as last_eval
  FROM ml_models m
  JOIN evaluations e ON m.id = e.model_id
  WHERE e.evaluated_at >= NOW() - INTERVAL '30 days'
  GROUP BY m.model_name, m.version
),
ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY model_name 
      ORDER BY avg_f1 DESC
    ) as rank
  FROM model_metrics
)
SELECT model_name, version, 
  ROUND(avg_accuracy, 4) as accuracy,
  ROUND(avg_f1, 4) as f1_score,
  eval_count
FROM ranked WHERE rank = 1
ORDER BY avg_f1 DESC;`,
    output: `model_name     | version | accuracy | f1    | evals
transformer-v2 | 3.1.0   | 0.9645   | 0.9582| 128
bert-classifier| 2.0.1   | 0.9412   | 0.9389| 96
lstm-baseline  | 1.5.0   | 0.8891   | 0.8734| 64`,
    description: "ML model performance analysis with window functions"
  },
  {
    lang: "docker", icon: "🐳", label: "Docker",
    code: `# Multi-stage ML Model Deployment
FROM python:3.11-slim AS builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11 \\
     /usr/local/lib/python3.11
COPY model/ ./model/
COPY app.py .

# Health check for K8s
HEALTHCHECK --interval=30s --timeout=10s \\
  CMD curl -f http://localhost:8080/health || exit 1

ENV MODEL_PATH=/app/model/best_model.pt
ENV WORKERS=4

EXPOSE 8080
CMD ["gunicorn", "app:create_app()", \\
     "--bind", "0.0.0.0:8080", \\
     "--workers", "4", \\
     "--timeout", "120"]`,
    output: `[+] Building 42.3s (12/12) FINISHED
 => [builder] pip install: 28 packages
 => [runtime] COPY model: 245MB
 => exporting to image: 512MB (67% smaller)
 => health check: passing`,
    description: "Multi-stage Docker build for ML model serving"
  },
  {
    lang: "bash", icon: "💻", label: "Bash/Shell",
    code: `#!/bin/bash
# Automated ML Pipeline Deployment
set -euo pipefail

MODEL_NAME="transformer-v2"
VERSION=$(git describe --tags --always)
REGISTRY="registry.example.com/ml"

echo "🔨 Building model image..."
docker build -t $REGISTRY/$MODEL_NAME:$VERSION .

echo "🧪 Running integration tests..."
docker run --rm $REGISTRY/$MODEL_NAME:$VERSION \\
  python -m pytest tests/ -v --tb=short

echo "📊 Benchmarking inference..."
docker run --rm $REGISTRY/$MODEL_NAME:$VERSION \\
  python benchmark.py --iterations 1000

echo "🚀 Deploying to Kubernetes..."
kubectl set image deployment/$MODEL_NAME \\
  $MODEL_NAME=$REGISTRY/$MODEL_NAME:$VERSION \\
  --record

kubectl rollout status deployment/$MODEL_NAME \\
  --timeout=300s

echo "✅ Deployed $MODEL_NAME:$VERSION"`,
    output: `🔨 Building model image... done (42s)
🧪 Running integration tests... 24 passed
📊 Benchmarking: avg 12ms/inference
🚀 Deploying to Kubernetes...
✅ Deployed transformer-v2:v3.1.0-rc2`,
    description: "Automated ML pipeline with testing and K8s deployment"
  },
  {
    lang: "yaml", icon: "⚙️", label: "K8s YAML",
    code: `# Kubernetes ML Model Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-inference-api
  labels:
    app: ml-inference
    version: v3
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: ml-inference
  template:
    spec:
      containers:
      - name: inference
        image: registry/ml-model:v3.1.0
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
            nvidia.com/gpu: 1
          limits:
            memory: "4Gi"
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30`,
    output: `deployment.apps/ml-inference-api created
service/ml-inference-api created
horizontalpodautoscaler created
→ 3/3 replicas ready
→ GPU allocation: 3x NVIDIA T4`,
    description: "K8s deployment with GPU resources and health checks"
  },
  {
    lang: "rust", icon: "🦀", label: "Rust",
    code: `use std::collections::HashMap;
use tokio::sync::RwLock;
use std::sync::Arc;

// Thread-safe LRU cache for ML predictions
struct PredictionCache {
    cache: Arc<RwLock<HashMap<String, Vec<f64>>>>,
    max_size: usize,
}

impl PredictionCache {
    fn new(max_size: usize) -> Self {
        Self {
            cache: Arc::new(RwLock::new(HashMap::new())),
            max_size,
        }
    }

    async fn get(&self, key: &str) -> Option<Vec<f64>> {
        let cache = self.cache.read().await;
        cache.get(key).cloned()
    }

    async fn insert(&self, key: String, value: Vec<f64>) {
        let mut cache = self.cache.write().await;
        if cache.len() >= self.max_size {
            if let Some(oldest) = cache.keys().next().cloned() {
                cache.remove(&oldest);
            }
        }
        cache.insert(key, value);
    }
}`,
    output: `✓ Compiled successfully (release mode)
✓ Cache hit ratio: 94.2%
✓ Avg lookup: 0.3μs (vs 12ms inference)
✓ Thread-safe with tokio RwLock`,
    description: "Thread-safe prediction cache with async Rust"
  },
  {
    lang: "go", icon: "🐹", label: "Go",
    code: `package main

import (
    "fmt"
    "net/http"
    "sync"
    "encoding/json"
)

type PredictionCache struct {
    mu    sync.RWMutex
    store map[string][]float64
}

func (c *PredictionCache) Get(key string) ([]float64, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.store[key]
    return val, ok
}

func (c *PredictionCache) Set(key string, val []float64) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.store[key] = val
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{
        "status": "healthy",
        "version": "1.0.0",
    })
}

func main() {
    cache := &PredictionCache{store: make(map[string][]float64)}
    cache.Set("user:123", []float64{0.95, 0.03, 0.02})
    
    http.HandleFunc("/health", healthHandler)
    fmt.Println("Server starting on :8080")
    http.ListenAndServe(":8080", nil)
}`,
    output: `Server starting on :8080
✓ Cache initialized with RWMutex
✓ Health endpoint: /health → 200 OK
✓ Prediction cache hit: [0.95, 0.03, 0.02]`,
    description: "Concurrent prediction cache with Go HTTP server"
  },
  {
    lang: "cpp", icon: "⚙️", label: "C++",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <cmath>

// Statistical analysis for model evaluation
struct ModelMetrics {
    std::vector<double> predictions;
    std::vector<double> actuals;
    
    double mse() const {
        double sum = 0.0;
        for (size_t i = 0; i < predictions.size(); ++i) {
            double diff = predictions[i] - actuals[i];
            sum += diff * diff;
        }
        return sum / predictions.size();
    }
    
    double rmse() const { return std::sqrt(mse()); }
    
    double r_squared() const {
        double mean_actual = std::accumulate(
            actuals.begin(), actuals.end(), 0.0
        ) / actuals.size();
        
        double ss_res = 0, ss_tot = 0;
        for (size_t i = 0; i < actuals.size(); ++i) {
            ss_res += std::pow(actuals[i] - predictions[i], 2);
            ss_tot += std::pow(actuals[i] - mean_actual, 2);
        }
        return 1.0 - (ss_res / ss_tot);
    }
};

int main() {
    ModelMetrics m{{0.9, 0.8, 0.95}, {0.85, 0.82, 0.91}};
    std::cout << "MSE: " << m.mse() << std::endl;
    std::cout << "RMSE: " << m.rmse() << std::endl;
    std::cout << "R²: " << m.r_squared() << std::endl;
}`,
    output: `MSE: 0.00103333
RMSE: 0.03214
R²: 0.8723
✓ Model evaluation metrics computed`,
    description: "Statistical model evaluation in modern C++"
  },
  {
    lang: "hcl", icon: "🏗️", label: "Terraform",
    code: `# GPU Training Cluster on AWS
provider "aws" {
  region = "us-west-2"
}

resource "aws_ecs_cluster" "ml_training" {
  name = "ml-training-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "training" {
  family                   = "ml-training"
  requires_compatibilities = ["EC2"]
  
  container_definitions = jsonencode([{
    name      = "trainer"
    image     = "registry/ml-trainer:latest"
    cpu       = 4096
    memory    = 16384
    essential = true
    
    resourceRequirements = [{
      type  = "GPU"
      value = "1"
    }]
    
    environment = [
      { name = "EPOCHS", value = "50" },
      { name = "BATCH_SIZE", value = "32" },
      { name = "LR", value = "0.001" }
    ]
    
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"  = "/ecs/ml-training"
        "awslogs-region" = "us-west-2"
      }
    }
  }])
}

output "cluster_arn" {
  value = aws_ecs_cluster.ml_training.arn
}`,
    output: `Plan: 3 to add, 0 to change, 0 to destroy
✓ aws_ecs_cluster.ml_training: Created
✓ aws_ecs_task_definition.training: Created  
✓ GPU allocation: 1x NVIDIA T4
✓ CloudWatch logging enabled`,
    description: "AWS ECS GPU training cluster with Terraform"
  },
];

const CodePlayground = () => {
  const [activeLang, setActiveLang] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const example = CODE_EXAMPLES[activeLang];

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [example]);

  const runCode = useCallback(() => {
    setShowOutput(false);
    setTimeout(() => setShowOutput(true), 600);
  }, []);

  // Syntax highlighting (simple)
  const highlightCode = useMemo(() => {
    let html = example.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Comments
    html = html.replace(/(#.*$|\/\/.*$|--.*$)/gm, '<span class="code-comment">$1</span>');
    // Strings
    html = html.replace(/(["'`])(?:(?!\1|\\).|\\.)*?\1/g, '<span class="code-string">$&</span>');
    // Keywords
    const keywords = /\b(import|from|class|def|return|async|await|const|let|var|function|if|else|for|while|try|catch|new|export|interface|type|enum|extends|implements|WHERE|SELECT|FROM|JOIN|GROUP|ORDER|BY|AS|WITH|AND|OR|ON|INSERT|UPDATE|DELETE|CREATE|DROP|HAVING|LIMIT|OFFSET|PARTITION|OVER|UNION|SET|VALUES|INTO|NOT|NULL|IN|EXISTS|BETWEEN|LIKE|CASE|WHEN|THEN|END|DISTINCT|COUNT|AVG|MAX|MIN|SUM|ROUND|ROW_NUMBER|self|super|use|fn|pub|struct|impl|mut|async|move|mod|crate|trait|enum|match|loop|break|continue)\b/g;
    html = html.replace(keywords, '<span class="code-keyword">$&</span>');
    // Numbers
    html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');
    // Built-ins
    html = html.replace(/\b(print|console|log|len|range|map|filter|reduce|Promise|Array|Object|String|None|True|False|true|false|null|undefined|Some|Ok|Err)\b/g, '<span class="code-builtin">$&</span>');
    
    return html;
  }, [example]);

  return (
    <div className="code-playground">
      {/* Language tabs */}
      <div className="cp-tabs">
        {CODE_EXAMPLES.map((ex, i) => (
          <button
            key={ex.lang}
            className={`cp-tab ${i === activeLang ? 'cp-tab--active' : ''}`}
            onClick={() => { setActiveLang(i); setShowOutput(false); }}
          >
            <span className="cp-tab-icon">{ex.icon}</span>
            <span className="cp-tab-label">{ex.label}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="cp-editor">
        <div className="cp-editor-header">
          <div className="cp-dots">
            <span /><span /><span />
          </div>
          <span className="cp-filename">{example.lang === 'yaml' ? 'deployment.yaml' : example.lang === 'docker' ? 'Dockerfile' : example.lang === 'bash' ? 'deploy.sh' : `main.${example.lang === 'python' ? 'py' : example.lang === 'rust' ? 'rs' : example.lang === 'sql' ? 'sql' : example.lang === 'typescript' ? 'ts' : 'js'}`}</span>
          <span className="cp-desc">{example.description}</span>
          <div className="cp-actions">
            <button className="cp-btn" onClick={copyCode}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button className="cp-btn cp-btn--run" onClick={runCode}>
              ▶ Run
            </button>
          </div>
        </div>
        <div className="cp-code-wrap">
          <div className="cp-line-numbers">
            {example.code.split('\n').map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <pre className="cp-code" dangerouslySetInnerHTML={{ __html: highlightCode }} />
        </div>
      </div>

      {/* Output */}
      {showOutput && (
        <div className="cp-output">
          <div className="cp-output-header">
            <span className="cp-output-dot" />
            <span>Output</span>
          </div>
          <pre className="cp-output-text">{example.output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
