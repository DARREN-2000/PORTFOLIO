import { useState, useCallback } from "react";
import jsPDF from "jspdf";

interface CheatsheetSection {
  title: string;
  items: { cmd: string; desc: string }[];
}

interface Cheatsheet {
  id: string;
  title: string;
  icon: string;
  category: string;
  sections: CheatsheetSection[];
}

const CHEATSHEETS: Cheatsheet[] = [
  {
    id: "python", title: "Python Cheatsheet", icon: "🐍", category: "Languages",
    sections: [
      { title: "Data Structures", items: [
        { cmd: "lst = [1, 2, 3]; lst.append(4)", desc: "List — mutable, ordered" },
        { cmd: "tup = (1, 2, 3)", desc: "Tuple — immutable, ordered" },
        { cmd: "s = {1, 2, 3}; s.add(4)", desc: "Set — unique, unordered" },
        { cmd: "d = {'a': 1}; d.get('b', 0)", desc: "Dict — key-value pairs" },
        { cmd: "[x**2 for x in range(10) if x%2==0]", desc: "List comprehension with filter" },
        { cmd: "{k: v for k, v in zip(keys, vals)}", desc: "Dict comprehension" },
      ]},
      { title: "Functions & Classes", items: [
        { cmd: "def f(x, *args, **kwargs):", desc: "Variadic function" },
        { cmd: "lambda x: x * 2", desc: "Anonymous function" },
        { cmd: "@decorator\\ndef func():", desc: "Decorator syntax" },
        { cmd: "class Dog(Animal):", desc: "Inheritance" },
        { cmd: "from dataclasses import dataclass", desc: "Auto __init__, __repr__" },
        { cmd: "async def fetch(): await resp", desc: "Async/await" },
      ]},
      { title: "One-Liners", items: [
        { cmd: "sorted(data, key=lambda x: x['score'], reverse=True)", desc: "Sort by key" },
        { cmd: "from collections import Counter; Counter(words).most_common(5)", desc: "Top N frequency" },
        { cmd: "import json; json.dumps(obj, indent=2)", desc: "Pretty print JSON" },
        { cmd: "Path('file.txt').read_text().splitlines()", desc: "Read file lines" },
      ]},
    ]
  },
  {
    id: "git", title: "Git Cheatsheet", icon: "📦", category: "DevOps",
    sections: [
      { title: "Basics", items: [
        { cmd: "git init / git clone <url>", desc: "Initialize or clone" },
        { cmd: "git add -A && git commit -m 'msg'", desc: "Stage all & commit" },
        { cmd: "git push origin main", desc: "Push to remote" },
        { cmd: "git pull --rebase origin main", desc: "Pull with rebase" },
        { cmd: "git status / git log --oneline -10", desc: "Check state / history" },
      ]},
      { title: "Branching", items: [
        { cmd: "git checkout -b feature/xyz", desc: "Create & switch branch" },
        { cmd: "git merge feature/xyz", desc: "Merge branch" },
        { cmd: "git rebase main", desc: "Rebase onto main" },
        { cmd: "git branch -d feature/xyz", desc: "Delete merged branch" },
        { cmd: "git stash / git stash pop", desc: "Stash & restore changes" },
      ]},
      { title: "Advanced", items: [
        { cmd: "git cherry-pick <hash>", desc: "Apply specific commit" },
        { cmd: "git reset --soft HEAD~1", desc: "Undo last commit, keep changes" },
        { cmd: "git bisect start / bad / good", desc: "Binary search for bugs" },
        { cmd: "git reflog", desc: "Recovery — see all HEAD changes" },
        { cmd: "git log --graph --all --oneline", desc: "Visual branch history" },
      ]},
    ]
  },
  {
    id: "docker", title: "Docker Cheatsheet", icon: "🐳", category: "DevOps",
    sections: [
      { title: "Images & Containers", items: [
        { cmd: "docker build -t app:v1 .", desc: "Build image" },
        { cmd: "docker run -d -p 8080:80 app:v1", desc: "Run detached, map port" },
        { cmd: "docker exec -it <id> /bin/sh", desc: "Shell into container" },
        { cmd: "docker logs -f <id>", desc: "Follow container logs" },
        { cmd: "docker ps -a / docker images", desc: "List containers / images" },
      ]},
      { title: "Docker Compose", items: [
        { cmd: "docker-compose up -d --build", desc: "Build & start services" },
        { cmd: "docker-compose down -v", desc: "Stop & remove volumes" },
        { cmd: "docker-compose logs -f web", desc: "Follow service logs" },
        { cmd: "docker-compose exec web sh", desc: "Shell into service" },
      ]},
      { title: "Cleanup & Optimization", items: [
        { cmd: "docker system prune -af", desc: "Remove all unused data" },
        { cmd: "docker image prune", desc: "Remove dangling images" },
        { cmd: "FROM python:3.11-slim AS builder", desc: "Multi-stage build" },
        { cmd: ".dockerignore", desc: "Exclude files from context" },
      ]},
    ]
  },
  {
    id: "kubernetes", title: "Kubernetes Cheatsheet", icon: "☸️", category: "DevOps",
    sections: [
      { title: "Core Commands", items: [
        { cmd: "kubectl get pods -A", desc: "List all pods" },
        { cmd: "kubectl describe pod <name>", desc: "Pod details & events" },
        { cmd: "kubectl logs -f <pod> -c <container>", desc: "Stream container logs" },
        { cmd: "kubectl exec -it <pod> -- /bin/sh", desc: "Shell into pod" },
        { cmd: "kubectl apply -f manifest.yaml", desc: "Apply config" },
      ]},
      { title: "Debugging", items: [
        { cmd: "kubectl get events --sort-by=.metadata.creationTimestamp", desc: "Recent events" },
        { cmd: "kubectl top pods / nodes", desc: "Resource usage" },
        { cmd: "kubectl port-forward svc/app 8080:80", desc: "Local port forward" },
        { cmd: "kubectl rollout undo deploy/app", desc: "Rollback deployment" },
      ]},
      { title: "Resources", items: [
        { cmd: "kubectl create secret generic db --from-literal=pw=123", desc: "Create secret" },
        { cmd: "kubectl scale deploy/app --replicas=5", desc: "Scale deployment" },
        { cmd: "kubectl autoscale deploy/app --min=2 --max=10 --cpu-percent=70", desc: "HPA" },
        { cmd: "kubectl cordon / drain <node>", desc: "Node maintenance" },
      ]},
    ]
  },
  {
    id: "sql", title: "SQL Cheatsheet", icon: "🗄️", category: "Data",
    sections: [
      { title: "Queries", items: [
        { cmd: "SELECT DISTINCT col FROM t WHERE col > 5 ORDER BY col DESC LIMIT 10", desc: "Filtered query" },
        { cmd: "SELECT a.*, b.name FROM a JOIN b ON a.id = b.a_id", desc: "Inner join" },
        { cmd: "SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 50k", desc: "Aggregate + filter" },
        { cmd: "WITH cte AS (SELECT ...) SELECT * FROM cte", desc: "Common Table Expression" },
      ]},
      { title: "Window Functions", items: [
        { cmd: "ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)", desc: "Row numbering" },
        { cmd: "LAG(salary, 1) OVER (ORDER BY date)", desc: "Previous row value" },
        { cmd: "SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING)", desc: "Running total" },
        { cmd: "NTILE(4) OVER (ORDER BY score)", desc: "Quartile assignment" },
      ]},
      { title: "Performance", items: [
        { cmd: "EXPLAIN ANALYZE SELECT ...", desc: "Query execution plan" },
        { cmd: "CREATE INDEX idx_col ON t(col)", desc: "Create index" },
        { cmd: "VACUUM ANALYZE table_name", desc: "Update stats (PostgreSQL)" },
        { cmd: "SELECT pg_size_pretty(pg_total_relation_size('t'))", desc: "Table size" },
      ]},
    ]
  },
  {
    id: "linux", title: "Linux/Bash Cheatsheet", icon: "💻", category: "DevOps",
    sections: [
      { title: "File Operations", items: [
        { cmd: "find . -name '*.py' -mtime -7", desc: "Find recent Python files" },
        { cmd: "grep -rn 'pattern' --include='*.ts' .", desc: "Recursive search" },
        { cmd: "awk '{print $1, $3}' file.csv", desc: "Extract columns" },
        { cmd: "sed -i 's/old/new/g' file.txt", desc: "Find & replace in-place" },
        { cmd: "tar -czf archive.tar.gz dir/", desc: "Create compressed archive" },
      ]},
      { title: "Process & System", items: [
        { cmd: "ps aux | grep python", desc: "Find processes" },
        { cmd: "htop / top", desc: "Interactive process viewer" },
        { cmd: "df -h / du -sh *", desc: "Disk usage" },
        { cmd: "lsof -i :8080", desc: "Who's using port 8080?" },
        { cmd: "nohup ./script.sh &", desc: "Run in background" },
      ]},
      { title: "Networking", items: [
        { cmd: "curl -X POST -H 'Content-Type: application/json' -d '{}'  url", desc: "POST request" },
        { cmd: "ss -tlnp / netstat -tlnp", desc: "Listening ports" },
        { cmd: "dig example.com / nslookup", desc: "DNS lookup" },
        { cmd: "scp file.txt user@host:/path/", desc: "Secure copy" },
      ]},
    ]
  },
  {
    id: "pytorch", title: "PyTorch Cheatsheet", icon: "🔥", category: "ML",
    sections: [
      { title: "Tensors", items: [
        { cmd: "x = torch.randn(3, 4, device='cuda')", desc: "Random tensor on GPU" },
        { cmd: "x.view(-1, 12) / x.reshape(2, 6)", desc: "Reshape tensor" },
        { cmd: "torch.cat([a, b], dim=0) / torch.stack([a,b])", desc: "Concatenate / stack" },
        { cmd: "x.requires_grad_(True)", desc: "Enable gradient tracking" },
      ]},
      { title: "Training Loop", items: [
        { cmd: "optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)", desc: "Adam optimizer" },
        { cmd: "loss = F.cross_entropy(logits, labels)", desc: "Cross-entropy loss" },
        { cmd: "loss.backward(); optimizer.step(); optimizer.zero_grad()", desc: "Backprop cycle" },
        { cmd: "torch.save(model.state_dict(), 'model.pt')", desc: "Save model" },
      ]},
      { title: "Data & Utils", items: [
        { cmd: "DataLoader(dataset, batch_size=32, shuffle=True, num_workers=4)", desc: "Data loader" },
        { cmd: "transforms.Compose([transforms.Resize(224), transforms.ToTensor()])", desc: "Image transforms" },
        { cmd: "with torch.no_grad(): pred = model(x)", desc: "Inference mode" },
        { cmd: "torch.cuda.is_available()", desc: "Check GPU" },
      ]},
    ]
  },
  {
    id: "terraform", title: "Terraform Cheatsheet", icon: "🏗️", category: "DevOps",
    sections: [
      { title: "Workflow", items: [
        { cmd: "terraform init", desc: "Initialize & download providers" },
        { cmd: "terraform plan -out=tfplan", desc: "Preview changes" },
        { cmd: "terraform apply tfplan", desc: "Apply saved plan" },
        { cmd: "terraform destroy", desc: "Tear down all resources" },
        { cmd: "terraform fmt -recursive", desc: "Format all .tf files" },
      ]},
      { title: "State Management", items: [
        { cmd: "terraform state list", desc: "List tracked resources" },
        { cmd: "terraform state show aws_instance.web", desc: "Show resource details" },
        { cmd: "terraform import aws_s3_bucket.b bucket-name", desc: "Import existing resource" },
        { cmd: "terraform state rm aws_instance.old", desc: "Remove from state" },
      ]},
      { title: "HCL Patterns", items: [
        { cmd: 'variable "name" { type = string, default = "prod" }', desc: "Input variable" },
        { cmd: 'output "ip" { value = aws_instance.web.public_ip }', desc: "Output value" },
        { cmd: 'for_each = toset(["a", "b", "c"])', desc: "Dynamic resources" },
        { cmd: "count = var.enabled ? 1 : 0", desc: "Conditional resource" },
      ]},
    ]
  },
  // ===== NEW CHEATSHEETS =====
  {
    id: "react-ts", title: "React & TypeScript", icon: "⚛️", category: "Languages",
    sections: [
      { title: "Hooks", items: [
        { cmd: "const [val, setVal] = useState<string>('')", desc: "Typed state" },
        { cmd: "useEffect(() => { /* */ return cleanup; }, [dep])", desc: "Side effect with cleanup" },
        { cmd: "const ref = useRef<HTMLDivElement>(null)", desc: "Typed ref" },
        { cmd: "const val = useMemo(() => expensive(a), [a])", desc: "Memoized computation" },
        { cmd: "const fn = useCallback((x: number) => x * 2, [])", desc: "Stable callback" },
        { cmd: "const ctx = useContext(ThemeContext)", desc: "Consume context" },
        { cmd: "const [state, dispatch] = useReducer(reducer, init)", desc: "Complex state management" },
      ]},
      { title: "Patterns", items: [
        { cmd: "type Props = { children: React.ReactNode }", desc: "Children typing" },
        { cmd: "React.FC<Props> / (props: Props) => JSX.Element", desc: "Component typing" },
        { cmd: "onChange: React.ChangeEvent<HTMLInputElement>", desc: "Event typing" },
        { cmd: "const [data] = useState<T[]>(() => init())", desc: "Lazy initializer" },
        { cmd: "{ ...rest }: Props & React.HTMLAttributes<HTMLDivElement>", desc: "Spread HTML attrs" },
        { cmd: "forwardRef<HTMLInputElement, Props>((props, ref) => ...)", desc: "Forwarded ref component" },
      ]},
      { title: "ES6+ Essentials", items: [
        { cmd: "const { a, b: alias, ...rest } = obj", desc: "Destructuring with rename" },
        { cmd: "arr.flatMap(x => x.items)", desc: "Flatten + map" },
        { cmd: "Object.entries(obj).map(([k, v]) => ...)", desc: "Iterate object" },
        { cmd: "Promise.allSettled([p1, p2, p3])", desc: "All promises, no fail" },
        { cmd: "value ?? fallback", desc: "Nullish coalescing" },
        { cmd: "obj?.deeply?.nested?.value", desc: "Optional chaining" },
        { cmd: "using resource = getResource()", desc: "Explicit Resource Management (ES2024)" },
      ]},
    ]
  },
  {
    id: "regex", title: "Regex & Networking", icon: "🔗", category: "Data",
    sections: [
      { title: "Regex Patterns", items: [
        { cmd: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", desc: "Email validation" },
        { cmd: "(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}", desc: "Strong password" },
        { cmd: "\\b\\d{1,3}(\\.\\d{1,3}){3}\\b", desc: "IPv4 address" },
        { cmd: "(\\d{4})-(\\d{2})-(\\d{2})", desc: "Date capture groups" },
        { cmd: "(?<=@)\\w+(?=\\.)", desc: "Lookbehind / lookahead" },
        { cmd: "/pattern/gmi", desc: "Global, multiline, case-insensitive" },
      ]},
      { title: "HTTP & APIs", items: [
        { cmd: "fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })", desc: "Fetch POST" },
        { cmd: "curl -H 'Authorization: Bearer $TOKEN' https://api.example.com", desc: "Auth header" },
        { cmd: "200 OK | 201 Created | 301 Redirect | 404 Not Found | 500 Server Error", desc: "Status codes" },
        { cmd: "Access-Control-Allow-Origin: *", desc: "CORS header" },
      ]},
      { title: "DNS & Networking", items: [
        { cmd: "nslookup / dig example.com ANY", desc: "DNS lookup all records" },
        { cmd: "traceroute / mtr example.com", desc: "Route tracing" },
        { cmd: "openssl s_client -connect example.com:443", desc: "TLS/SSL check" },
        { cmd: "tcpdump -i eth0 port 80 -w capture.pcap", desc: "Packet capture" },
        { cmd: "iptables -A INPUT -p tcp --dport 22 -j ACCEPT", desc: "Firewall rule" },
      ]},
    ]
  },
  {
    id: "aws-cloud", title: "AWS / Cloud CLI", icon: "☁️", category: "DevOps",
    sections: [
      { title: "AWS CLI", items: [
        { cmd: "aws configure --profile prod", desc: "Set up credentials" },
        { cmd: "aws s3 sync ./dist s3://my-bucket --delete", desc: "Deploy to S3" },
        { cmd: "aws ec2 describe-instances --filters 'Name=tag:Env,Values=prod'", desc: "Filter EC2" },
        { cmd: "aws lambda invoke --function-name my-fn out.json", desc: "Invoke Lambda" },
        { cmd: "aws ecr get-login-password | docker login --username AWS --password-stdin <uri>", desc: "ECR login" },
        { cmd: "aws logs tail /aws/lambda/fn --follow", desc: "Stream CloudWatch logs" },
      ]},
      { title: "GCP CLI (gcloud)", items: [
        { cmd: "gcloud auth login && gcloud config set project my-proj", desc: "Auth & set project" },
        { cmd: "gcloud run deploy my-svc --image gcr.io/proj/img --region us-central1", desc: "Deploy Cloud Run" },
        { cmd: "gcloud compute instances list", desc: "List VMs" },
        { cmd: "gsutil cp -r ./data gs://my-bucket/", desc: "Upload to GCS" },
        { cmd: "gcloud ai models upload --region=us-central1 --display-name=my-model", desc: "Upload AI model" },
      ]},
      { title: "Azure CLI", items: [
        { cmd: "az login && az account set --subscription <id>", desc: "Auth & set subscription" },
        { cmd: "az webapp up --name my-app --resource-group rg --runtime 'PYTHON:3.11'", desc: "Deploy Web App" },
        { cmd: "az aks get-credentials --resource-group rg --name cluster", desc: "Connect to AKS" },
        { cmd: "az storage blob upload-batch -d container -s ./dist", desc: "Upload to Blob" },
        { cmd: "az ml online-endpoint invoke --name ep --request-file req.json", desc: "Invoke ML endpoint" },
      ]},
    ]
  },
  {
    id: "vim-tmux", title: "Vim & tmux", icon: "🖥️", category: "DevOps",
    sections: [
      { title: "Vim Essentials", items: [
        { cmd: "i / a / o / O", desc: "Insert: at cursor / after / below / above" },
        { cmd: "dd / yy / p / u / Ctrl+r", desc: "Delete / yank / paste / undo / redo" },
        { cmd: "ciw / ci\" / ci(", desc: "Change inside word / quotes / parens" },
        { cmd: ":%s/old/new/gc", desc: "Find & replace with confirm" },
        { cmd: "/pattern + n/N", desc: "Search forward, next / prev" },
        { cmd: ":vsp file | :sp file", desc: "Vertical / horizontal split" },
      ]},
      { title: "Vim Advanced", items: [
        { cmd: "qa ... q → @a → @@", desc: "Record & replay macro" },
        { cmd: "Ctrl+v → select → I → text → Esc", desc: "Block insert (visual block)" },
        { cmd: ":buffers / :bn / :bp", desc: "List / next / prev buffer" },
        { cmd: ":set number relativenumber", desc: "Hybrid line numbers" },
        { cmd: "zf / zo / zc / zR", desc: "Fold: create / open / close / open all" },
      ]},
      { title: "tmux", items: [
        { cmd: "tmux new -s work", desc: "New named session" },
        { cmd: "Ctrl+b c / n / p / w", desc: "New / next / prev / list windows" },
        { cmd: 'Ctrl+b % / "', desc: "Split vertical / horizontal" },
        { cmd: "Ctrl+b d → tmux attach -t work", desc: "Detach & reattach" },
        { cmd: "Ctrl+b [ → scroll → q", desc: "Scroll mode (copy mode)" },
        { cmd: "Ctrl+b : resize-pane -D 10", desc: "Resize pane" },
      ]},
    ]
  },
  // ===== AI & AGENTS CHEATSHEETS =====
  {
    id: "prompt-engineering", title: "Prompt Engineering", icon: "✍️", category: "AI",
    sections: [
      { title: "Core Techniques", items: [
        { cmd: "You are a {role}. Given {context}, {task}. Output as {format}.", desc: "Role-Context-Task-Format template" },
        { cmd: "Let's think step by step.", desc: "Chain-of-Thought (CoT) — improves reasoning 2-3x" },
        { cmd: "Here are 3 examples:\\n1. Input: X → Output: Y\\n...", desc: "Few-shot prompting with examples" },
        { cmd: "First, analyze the problem. Then, list assumptions. Finally, provide the solution.", desc: "Step-by-step decomposition" },
        { cmd: "Answer with ONLY valid JSON: {\"key\": \"value\"}", desc: "Structured output forcing" },
        { cmd: "If you're unsure, say 'I don't know' rather than guessing.", desc: "Hallucination guardrail" },
      ]},
      { title: "Advanced Patterns", items: [
        { cmd: "Generate 3 different solutions. Then evaluate each and pick the best.", desc: "Self-consistency / majority voting" },
        { cmd: "You are a critic. Review this response for errors: {response}", desc: "Self-reflection / critique pattern" },
        { cmd: "Given this context:\\n---\\n{retrieved_docs}\\n---\\nAnswer: ", desc: "RAG prompt template" },
        { cmd: "Think about what tools you need. Available: [search, calculator, code]. Use: Action: {tool} Input: {query}", desc: "ReAct pattern for tool use" },
        { cmd: "System: You are a senior Python dev. Never use global variables. Always add type hints.", desc: "System prompt constraints" },
        { cmd: "Rewrite the previous response but make it more concise and add bullet points.", desc: "Iterative refinement" },
      ]},
      { title: "Optimization Tips", items: [
        { cmd: "temperature=0 for deterministic, 0.7 for creative, 1.0+ for brainstorming", desc: "Temperature tuning guide" },
        { cmd: "max_tokens=500 for summaries, 2000 for articles, 4000 for code", desc: "Token budget planning" },
        { cmd: "top_p=0.9 (nucleus sampling) vs temperature (flat scaling)", desc: "Sampling strategies" },
        { cmd: "response_format: { type: 'json_object' }", desc: "OpenAI JSON mode (guaranteed valid JSON)" },
        { cmd: "Use delimiters: ###, ---, ```, <tag></tag> to separate sections", desc: "Clear section boundaries reduce confusion" },
        { cmd: "Negative prompting: 'Do NOT include disclaimers or caveats.'", desc: "Exclusion instructions" },
      ]},
    ]
  },
  {
    id: "langchain-agents", title: "LangChain & AI Agents", icon: "🦜", category: "AI",
    sections: [
      { title: "LangChain Basics", items: [
        { cmd: "from langchain_openai import ChatOpenAI\\nllm = ChatOpenAI(model='gpt-4o', temperature=0)", desc: "Initialize LLM" },
        { cmd: "from langchain_core.prompts import ChatPromptTemplate\\nprompt = ChatPromptTemplate.from_messages([('system', '...'), ('user', '{input}')])", desc: "Prompt template" },
        { cmd: "chain = prompt | llm | StrOutputParser()\\nresult = chain.invoke({'input': 'Hello'})", desc: "LCEL chain (pipe syntax)" },
        { cmd: "from langchain_core.runnables import RunnablePassthrough, RunnableParallel", desc: "Parallel & passthrough runnables" },
        { cmd: "chain.with_fallbacks([fallback_chain]).invoke(input)", desc: "Fallback chains for resilience" },
        { cmd: "chain.batch([{'input': 'q1'}, {'input': 'q2'}], config={'max_concurrency': 5})", desc: "Batch processing with concurrency" },
      ]},
      { title: "Tools & Agents", items: [
        { cmd: "@tool\\ndef search(query: str) -> str:\\n    \"\"\"Search the web.\"\"\"\\n    return results", desc: "Define a tool with @tool decorator" },
        { cmd: "from langchain.agents import create_tool_calling_agent\\nagent = create_tool_calling_agent(llm, tools, prompt)", desc: "Create tool-calling agent" },
        { cmd: "from langchain.agents import AgentExecutor\\nexecutor = AgentExecutor(agent=agent, tools=tools, verbose=True)", desc: "Agent executor with logging" },
        { cmd: "from langchain_community.tools import DuckDuckGoSearchRun\\nsearch = DuckDuckGoSearchRun()", desc: "Built-in web search tool" },
        { cmd: "from langchain.tools import Tool\\nTool(name='calc', func=calc_fn, description='...')", desc: "Custom tool from function" },
        { cmd: "executor.invoke({'input': 'What is the weather?'}, config={'callbacks': [handler]})", desc: "Invoke with streaming callbacks" },
      ]},
      { title: "RAG with LangChain", items: [
        { cmd: "from langchain_community.document_loaders import PyPDFLoader\\ndocs = PyPDFLoader('file.pdf').load()", desc: "Load PDF documents" },
        { cmd: "from langchain.text_splitter import RecursiveCharacterTextSplitter\\nchunks = splitter.split_documents(docs)", desc: "Chunk documents (500-1000 chars)" },
        { cmd: "from langchain_openai import OpenAIEmbeddings\\nembeddings = OpenAIEmbeddings(model='text-embedding-3-small')", desc: "Embedding model" },
        { cmd: "from langchain_chroma import Chroma\\nvectorstore = Chroma.from_documents(chunks, embeddings)", desc: "Create vector store" },
        { cmd: "retriever = vectorstore.as_retriever(search_kwargs={'k': 4})", desc: "Create retriever (top-4)" },
        { cmd: "from langchain.chains import create_retrieval_chain\\nrag = create_retrieval_chain(retriever, combine_docs_chain)", desc: "Full RAG chain" },
      ]},
      { title: "Memory & State", items: [
        { cmd: "from langchain_core.chat_history import InMemoryChatMessageHistory\\nstore = {}", desc: "Session-based chat memory" },
        { cmd: "from langchain_core.runnables.history import RunnableWithMessageHistory", desc: "Add memory to any chain" },
        { cmd: "ConversationBufferWindowMemory(k=10)", desc: "Keep last 10 messages" },
        { cmd: "ConversationSummaryMemory(llm=llm)", desc: "Summarize old messages to save tokens" },
      ]},
    ]
  },
  {
    id: "agentic-patterns", title: "Agentic AI Patterns", icon: "🤖", category: "AI",
    sections: [
      { title: "Core Agent Patterns", items: [
        { cmd: "Observe → Think → Act → Observe (ReAct loop)", desc: "ReAct: Reasoning + Acting in interleaved steps" },
        { cmd: "Plan: [step1, step2, ...] → Execute each → Replan if needed", desc: "Plan-and-Execute: upfront planning with replanning" },
        { cmd: "Thought → Action → Observation → ... → Final Answer", desc: "Chain-of-Thought Agent trace format" },
        { cmd: "Reflection: 'My previous answer was wrong because...' → Retry", desc: "Reflexion: self-critique and retry pattern" },
        { cmd: "if confidence < threshold: escalate_to_human()", desc: "Human-in-the-loop escalation" },
        { cmd: "max_iterations=10, early_stopping_method='force'", desc: "Prevent infinite agent loops" },
      ]},
      { title: "Multi-Agent Systems", items: [
        { cmd: "Supervisor → routes tasks → [Researcher, Coder, Reviewer]", desc: "Supervisor pattern: orchestrator delegates to specialists" },
        { cmd: "Agent A → Agent B → Agent C → Agent A (cycle)", desc: "Round-robin collaboration" },
        { cmd: "Planner generates plan → Executor runs steps → Critic reviews", desc: "Plan-Execute-Critique trio" },
        { cmd: "debate(agent1_response, agent2_response) → synthesize", desc: "Debate pattern: agents argue for best answer" },
        { cmd: "from langgraph.graph import StateGraph\\ngraph = StateGraph(State)", desc: "LangGraph: stateful multi-agent graphs" },
        { cmd: "graph.add_node('researcher', research_agent)\\ngraph.add_edge('researcher', 'writer')", desc: "LangGraph node/edge definition" },
      ]},
      { title: "Tool Use Patterns", items: [
        { cmd: "functions=[{'name':'search','parameters':{'query':{'type':'string'}}}]", desc: "OpenAI function calling schema" },
        { cmd: "tool_choice='auto' | 'required' | {'type':'function','function':{'name':'search'}}", desc: "Control when tools are called" },
        { cmd: "parallel_tool_calls=True", desc: "Allow LLM to call multiple tools simultaneously" },
        { cmd: "Code Interpreter: execute Python in sandbox → return result", desc: "Code execution as a tool" },
        { cmd: "MCP: Model Context Protocol — standardized tool/resource interface", desc: "Universal tool protocol (Anthropic)" },
        { cmd: "A2A: Agent-to-Agent Protocol — agents discover & communicate", desc: "Google's agent interop protocol" },
      ]},
      { title: "Safety & Guardrails", items: [
        { cmd: "input_guard(prompt) → if toxic/injection: block", desc: "Input validation before LLM" },
        { cmd: "output_guard(response) → if PII/harmful: redact or block", desc: "Output filtering after LLM" },
        { cmd: "budget_tracker: if cost > $X or tokens > Y: stop", desc: "Cost and token budget limits" },
        { cmd: "allowed_tools = ['search', 'calculator'] # whitelist only", desc: "Tool whitelist — never allow arbitrary code by default" },
        { cmd: "audit_log.append({'action': action, 'reasoning': thought, 'timestamp': now})", desc: "Full audit trail for compliance" },
      ]},
    ]
  },
  {
    id: "openai-api", title: "OpenAI API", icon: "🧠", category: "AI",
    sections: [
      { title: "Chat Completions", items: [
        { cmd: "from openai import OpenAI\\nclient = OpenAI()", desc: "Initialize client (reads OPENAI_API_KEY)" },
        { cmd: "response = client.chat.completions.create(model='gpt-4o', messages=[{'role':'user','content':'Hi'}])", desc: "Basic chat completion" },
        { cmd: "stream = client.chat.completions.create(..., stream=True)\\nfor chunk in stream: print(chunk.choices[0].delta.content)", desc: "Streaming response" },
        { cmd: "response_format={'type': 'json_schema', 'json_schema': {...}}", desc: "Structured outputs with JSON schema" },
        { cmd: "tools=[{'type':'function','function':{'name':'get_weather','parameters':{...}}}]", desc: "Function calling definition" },
        { cmd: "tool_calls = response.choices[0].message.tool_calls\\nfor tc in tool_calls: process(tc)", desc: "Handle tool call responses" },
      ]},
      { title: "Embeddings & Vision", items: [
        { cmd: "client.embeddings.create(model='text-embedding-3-small', input='Hello')", desc: "Generate embeddings (1536 dims)" },
        { cmd: "messages=[{'role':'user','content':[{'type':'text','text':'Describe'},{'type':'image_url','image_url':{'url':'...'}}]}]", desc: "Vision: send image to GPT-4o" },
        { cmd: "client.audio.transcriptions.create(model='whisper-1', file=open('audio.mp3','rb'))", desc: "Whisper transcription" },
        { cmd: "client.audio.speech.create(model='tts-1', voice='alloy', input='Hello world')", desc: "Text-to-speech" },
      ]},
      { title: "Assistants & Threads", items: [
        { cmd: "assistant = client.beta.assistants.create(name='Helper', model='gpt-4o', tools=[{'type':'code_interpreter'}])", desc: "Create persistent assistant" },
        { cmd: "thread = client.beta.threads.create()\\nclient.beta.threads.messages.create(thread_id=thread.id, role='user', content='...')", desc: "Thread-based conversation" },
        { cmd: "run = client.beta.threads.runs.create_and_poll(thread_id=thread.id, assistant_id=assistant.id)", desc: "Run assistant on thread" },
        { cmd: "client.files.create(file=open('data.csv','rb'), purpose='assistants')", desc: "Upload file for assistant" },
      ]},
      { title: "Best Practices", items: [
        { cmd: "max_tokens=1000, temperature=0, seed=42", desc: "Deterministic & reproducible outputs" },
        { cmd: "try: ... except openai.RateLimitError: time.sleep(60)", desc: "Rate limit handling" },
        { cmd: "tiktoken.encoding_for_model('gpt-4o').encode(text)", desc: "Count tokens before sending" },
        { cmd: "logprobs=True, top_logprobs=3", desc: "Get confidence scores per token" },
        { cmd: "client = OpenAI(timeout=30, max_retries=3)", desc: "Timeout and retry config" },
      ]},
    ]
  },
  {
    id: "rag-pipeline", title: "RAG Pipeline", icon: "📚", category: "AI",
    sections: [
      { title: "Document Processing", items: [
        { cmd: "PyPDFLoader / UnstructuredLoader / DocxLoader / CSVLoader", desc: "Document loaders by format" },
        { cmd: "RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)", desc: "Recursive chunking (recommended default)" },
        { cmd: "SemanticChunker(embeddings, breakpoint_threshold_type='percentile')", desc: "Semantic-aware chunking" },
        { cmd: "MarkdownHeaderTextSplitter(headers_to_split_on=[('#','H1'),('##','H2')])", desc: "Structure-aware markdown splitting" },
        { cmd: "chunk metadata: {source, page, section, date, author}", desc: "Attach metadata for filtering" },
        { cmd: "HTMLHeaderTextSplitter / TokenTextSplitter / SentenceTransformersTokenTextSplitter", desc: "Other splitter options" },
      ]},
      { title: "Embedding & Indexing", items: [
        { cmd: "OpenAIEmbeddings(model='text-embedding-3-small')  # 1536 dims, $0.02/1M tokens", desc: "OpenAI embeddings (best price/perf)" },
        { cmd: "HuggingFaceEmbeddings(model_name='BAAI/bge-small-en-v1.5')  # free, local", desc: "Open-source alternative" },
        { cmd: "Chroma.from_documents(docs, embeddings, persist_directory='./db')", desc: "ChromaDB (local, great for dev)" },
        { cmd: "Pinecone.from_documents(docs, embeddings, index_name='prod')", desc: "Pinecone (managed, scalable)" },
        { cmd: "FAISS.from_documents(docs, embeddings)  # in-memory, fastest", desc: "FAISS for speed" },
        { cmd: "Qdrant / Weaviate / pgvector / Milvus", desc: "Other vector DB options" },
      ]},
      { title: "Retrieval Strategies", items: [
        { cmd: "retriever = vectorstore.as_retriever(search_type='similarity', search_kwargs={'k': 4})", desc: "Basic similarity search" },
        { cmd: "search_type='mmr', search_kwargs={'k': 4, 'fetch_k': 20, 'lambda_mult': 0.5}", desc: "MMR: diversity + relevance balance" },
        { cmd: "EnsembleRetriever(retrievers=[bm25, vector], weights=[0.4, 0.6])", desc: "Hybrid search: BM25 + vector" },
        { cmd: "ContextualCompressionRetriever(base_retriever=retriever, base_compressor=compressor)", desc: "Rerank & compress results" },
        { cmd: "MultiQueryRetriever.from_llm(retriever=base, llm=llm)", desc: "Generate multiple query variations" },
        { cmd: "SelfQueryRetriever: parse user query → metadata filters + semantic search", desc: "Auto-filter by metadata" },
      ]},
      { title: "Generation & Evaluation", items: [
        { cmd: "prompt = 'Context: {context}\\n\\nQuestion: {question}\\n\\nAnswer based ONLY on the context.'", desc: "Grounded generation prompt" },
        { cmd: "include_sources=True → response['source_documents']", desc: "Source attribution" },
        { cmd: "RAGAS metrics: faithfulness, answer_relevancy, context_precision, context_recall", desc: "RAG evaluation framework" },
        { cmd: "if len(relevant_docs) == 0: return 'I don\\'t have enough info to answer.'", desc: "Graceful fallback when no context" },
        { cmd: "ConversationalRetrievalChain: reformulate follow-ups using chat history", desc: "Multi-turn RAG conversations" },
      ]},
    ]
  },
  {
    id: "huggingface", title: "Hugging Face & Transformers", icon: "🤗", category: "AI",
    sections: [
      { title: "Pipeline API (Quick Start)", items: [
        { cmd: "from transformers import pipeline\\nclassifier = pipeline('sentiment-analysis')", desc: "One-line inference" },
        { cmd: "pipeline('text-generation', model='meta-llama/Llama-3.1-8B-Instruct')", desc: "Text generation with specific model" },
        { cmd: "pipeline('question-answering', model='deepset/roberta-base-squad2')", desc: "Extractive QA" },
        { cmd: "pipeline('zero-shot-classification', model='facebook/bart-large-mnli')", desc: "Classify without training" },
        { cmd: "pipeline('image-classification', model='google/vit-base-patch16-224')", desc: "Vision transformer" },
        { cmd: "pipeline('automatic-speech-recognition', model='openai/whisper-large-v3')", desc: "Speech to text" },
      ]},
      { title: "Model & Tokenizer", items: [
        { cmd: "from transformers import AutoTokenizer, AutoModelForCausalLM", desc: "Auto classes load any model" },
        { cmd: "tokenizer = AutoTokenizer.from_pretrained('meta-llama/Llama-3.1-8B-Instruct')", desc: "Load tokenizer" },
        { cmd: "model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16, device_map='auto')", desc: "Load model with auto device mapping" },
        { cmd: "inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True)", desc: "Tokenize with padding" },
        { cmd: "outputs = model.generate(**inputs, max_new_tokens=256, do_sample=True, temperature=0.7)", desc: "Generate with sampling" },
        { cmd: "tokenizer.decode(outputs[0], skip_special_tokens=True)", desc: "Decode tokens to text" },
      ]},
      { title: "Fine-Tuning with PEFT", items: [
        { cmd: "from peft import LoraConfig, get_peft_model\\nlora = LoraConfig(r=16, lora_alpha=32, target_modules=['q_proj','v_proj'])", desc: "LoRA config" },
        { cmd: "model = get_peft_model(base_model, lora_config)\\nmodel.print_trainable_parameters()  # ~0.1%", desc: "Apply LoRA — only 0.1% params trained" },
        { cmd: "from transformers import TrainingArguments, Trainer\\nargs = TrainingArguments(output_dir='./out', num_train_epochs=3, per_device_train_batch_size=4)", desc: "Training config" },
        { cmd: "from trl import SFTTrainer\\ntrainer = SFTTrainer(model=model, train_dataset=ds, args=args)", desc: "Supervised fine-tuning trainer" },
        { cmd: "BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type='nf4', bnb_4bit_compute_dtype=torch.bfloat16)", desc: "QLoRA: 4-bit quantized training" },
        { cmd: "model.push_to_hub('username/my-fine-tuned-model')", desc: "Share on Hugging Face Hub" },
      ]},
      { title: "Datasets & Hub", items: [
        { cmd: "from datasets import load_dataset\\nds = load_dataset('squad', split='train[:1000]')", desc: "Load dataset subset" },
        { cmd: "ds = ds.map(preprocess_fn, batched=True, num_proc=4)", desc: "Parallel preprocessing" },
        { cmd: "ds.train_test_split(test_size=0.2)", desc: "Split dataset" },
        { cmd: "from huggingface_hub import snapshot_download\\nsnapshot_download('meta-llama/Llama-3.1-8B-Instruct')", desc: "Download full model snapshot" },
        { cmd: "huggingface-cli login --token hf_xxxxx", desc: "Authenticate with Hub" },
      ]},
    ]
  },
  {
    id: "vector-databases", title: "Vector Databases", icon: "🗃️", category: "AI",
    sections: [
      { title: "ChromaDB (Local)", items: [
        { cmd: "import chromadb\\nclient = chromadb.PersistentClient(path='./chroma_db')", desc: "Persistent local storage" },
        { cmd: "collection = client.create_collection('docs', metadata={'hnsw:space': 'cosine'})", desc: "Create collection with cosine distance" },
        { cmd: "collection.add(documents=['text...'], metadatas=[{'source':'file.pdf'}], ids=['doc1'])", desc: "Add documents (auto-embeds)" },
        { cmd: "results = collection.query(query_texts=['question'], n_results=5, where={'source': 'file.pdf'})", desc: "Query with metadata filter" },
        { cmd: "collection.update(ids=['doc1'], documents=['updated text'])", desc: "Update existing document" },
        { cmd: "collection.delete(where={'source': 'old.pdf'})", desc: "Delete by metadata filter" },
      ]},
      { title: "Pinecone (Managed)", items: [
        { cmd: "from pinecone import Pinecone\\npc = Pinecone(api_key='xxx')", desc: "Initialize client" },
        { cmd: "pc.create_index('my-index', dimension=1536, metric='cosine', spec=ServerlessSpec(cloud='aws', region='us-east-1'))", desc: "Create serverless index" },
        { cmd: "index = pc.Index('my-index')\\nindex.upsert(vectors=[('id1', [0.1,...], {'text': '...'})])", desc: "Upsert vectors with metadata" },
        { cmd: "results = index.query(vector=query_vec, top_k=5, filter={'category': {'$eq': 'tech'}})", desc: "Query with filter" },
        { cmd: "index.describe_index_stats()", desc: "Check index stats & count" },
      ]},
      { title: "FAISS (In-Memory)", items: [
        { cmd: "import faiss\\nindex = faiss.IndexFlatL2(dimension)  # brute force", desc: "Exact L2 search" },
        { cmd: "index = faiss.IndexIVFFlat(quantizer, dim, nlist)  # approximate", desc: "IVF for faster approximate search" },
        { cmd: "index = faiss.IndexHNSWFlat(dim, M=32)  # best recall/speed tradeoff", desc: "HNSW graph-based index" },
        { cmd: "index.add(np.array(embeddings, dtype='float32'))", desc: "Add vectors" },
        { cmd: "distances, indices = index.search(query_vector, k=10)", desc: "Search top-k neighbors" },
        { cmd: "faiss.write_index(index, 'index.faiss') / faiss.read_index('index.faiss')", desc: "Save & load index" },
      ]},
      { title: "Comparison & Tips", items: [
        { cmd: "ChromaDB: local dev, auto-embed, easy setup → great for prototyping", desc: "Best for: development & small projects" },
        { cmd: "Pinecone: managed, serverless, filtering → great for production", desc: "Best for: production SaaS applications" },
        { cmd: "FAISS: in-memory, fastest, no server → great for batch processing", desc: "Best for: offline/batch similarity search" },
        { cmd: "pgvector: PostgreSQL extension → great when you already use Postgres", desc: "Best for: existing Postgres infrastructure" },
        { cmd: "Qdrant: Rust-based, rich filtering, gRPC → great for high-throughput", desc: "Best for: performance-critical applications" },
        { cmd: "Weaviate: GraphQL API, modules, multi-modal → great for versatility", desc: "Best for: multi-modal search" },
      ]},
    ]
  },
  {
    id: "llm-finetuning", title: "LLM Fine-Tuning", icon: "🔧", category: "AI",
    sections: [
      { title: "Data Preparation", items: [
        { cmd: '{"messages": [{"role":"system","content":"..."}, {"role":"user","content":"..."}, {"role":"assistant","content":"..."}]}', desc: "Chat format (OpenAI/Llama)" },
        { cmd: '{"instruction": "...", "input": "...", "output": "..."}', desc: "Alpaca format (instruction tuning)" },
        { cmd: "Minimum: 100-500 high-quality examples for LoRA fine-tuning", desc: "Dataset size guidelines" },
        { cmd: "Deduplicate, filter low-quality, balance classes, add system prompts", desc: "Data cleaning checklist" },
        { cmd: "Train/Val split: 90/10, never leak eval data into training", desc: "Proper evaluation setup" },
      ]},
      { title: "LoRA / QLoRA Training", items: [
        { cmd: "LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, target_modules=['q_proj','k_proj','v_proj','o_proj'])", desc: "LoRA config (rank 16 is good default)" },
        { cmd: "load_in_4bit=True + LoRA = QLoRA → 70B model on 24GB GPU", desc: "QLoRA: 4-bit base + LoRA adapters" },
        { cmd: "learning_rate=2e-4, warmup_ratio=0.03, lr_scheduler_type='cosine'", desc: "Typical hyperparameters" },
        { cmd: "gradient_accumulation_steps=4 (simulates larger batch)", desc: "Accumulate gradients for effective batch size" },
        { cmd: "bf16=True, gradient_checkpointing=True", desc: "Memory optimization flags" },
        { cmd: "model.merge_and_unload() → save full merged model", desc: "Merge LoRA weights for deployment" },
      ]},
      { title: "Evaluation & Deployment", items: [
        { cmd: "BLEU, ROUGE for text generation; F1 for classification", desc: "Automatic metrics" },
        { cmd: "LLM-as-judge: use GPT-4 to rate responses 1-10", desc: "LLM evaluation (scalable)" },
        { cmd: "Human eval: A/B test fine-tuned vs base model", desc: "Gold standard evaluation" },
        { cmd: "vLLM serve model --dtype bfloat16 --max-model-len 4096", desc: "High-throughput serving with vLLM" },
        { cmd: "ollama run my-model  # local inference", desc: "Run locally with Ollama" },
        { cmd: "text-generation-inference (TGI) for production GPU serving", desc: "HuggingFace's production server" },
      ]},
    ]
  },
  {
    id: "langgraph", title: "LangGraph & Workflows", icon: "📊", category: "AI",
    sections: [
      { title: "Graph Basics", items: [
        { cmd: "from langgraph.graph import StateGraph, START, END\\nfrom typing import TypedDict", desc: "Core imports" },
        { cmd: "class State(TypedDict):\\n    messages: list\\n    next_step: str", desc: "Define graph state schema" },
        { cmd: "graph = StateGraph(State)\\ngraph.add_node('agent', agent_fn)\\ngraph.add_node('tool', tool_fn)", desc: "Add nodes (functions)" },
        { cmd: "graph.add_edge(START, 'agent')\\ngraph.add_edge('tool', 'agent')", desc: "Add fixed edges" },
        { cmd: "graph.add_conditional_edges('agent', should_continue, {'continue': 'tool', 'end': END})", desc: "Conditional routing" },
        { cmd: "app = graph.compile()\\nresult = app.invoke({'messages': [HumanMessage('Hi')]})", desc: "Compile & run graph" },
      ]},
      { title: "Advanced Patterns", items: [
        { cmd: "from langgraph.checkpoint.memory import MemorySaver\\napp = graph.compile(checkpointer=MemorySaver())", desc: "Persistent memory across runs" },
        { cmd: "config = {'configurable': {'thread_id': 'user-123'}}", desc: "Thread-based state isolation" },
        { cmd: "interrupt_before=['human_review']  # pause for human approval", desc: "Human-in-the-loop breakpoints" },
        { cmd: "from langgraph.prebuilt import create_react_agent\\nagent = create_react_agent(model, tools)", desc: "Pre-built ReAct agent" },
        { cmd: "subgraph = create_subgraph(...)\\nmain_graph.add_node('sub', subgraph)", desc: "Nested subgraphs" },
        { cmd: "async for event in app.astream_events(input, version='v2'): ...", desc: "Stream events for real-time UI" },
      ]},
      { title: "Multi-Agent", items: [
        { cmd: "Supervisor node: routes to [researcher, coder, reviewer] based on task", desc: "Supervisor orchestration pattern" },
        { cmd: "Each agent node: receives state → calls LLM → updates state → returns", desc: "Agent node contract" },
        { cmd: "Shared state: all agents read/write to same State object", desc: "Communication via shared state" },
        { cmd: "graph.add_node('researcher', functools.partial(agent_node, agent=researcher))", desc: "Parameterized agent nodes" },
        { cmd: "map-reduce: fan out to N agents → collect → aggregate", desc: "Parallel agent execution" },
      ]},
    ]
  },
  {
    id: "mlflow-experiment", title: "MLflow & Experiment Tracking", icon: "📈", category: "ML",
    sections: [
      { title: "Tracking", items: [
        { cmd: "import mlflow\\nmlflow.set_tracking_uri('http://localhost:5000')", desc: "Connect to tracking server" },
        { cmd: "mlflow.set_experiment('my-experiment')", desc: "Create/set experiment" },
        { cmd: "with mlflow.start_run(run_name='baseline'):\\n    mlflow.log_param('lr', 0.001)\\n    mlflow.log_metric('accuracy', 0.95)", desc: "Log params & metrics" },
        { cmd: "mlflow.log_artifact('model.pt')\\nmlflow.log_artifacts('./outputs/')", desc: "Log files & directories" },
        { cmd: "mlflow.pytorch.log_model(model, 'model')  # also: sklearn, transformers, etc.", desc: "Log model with flavor" },
        { cmd: "mlflow.autolog()  # auto-logs for sklearn, pytorch, transformers", desc: "Zero-config auto-logging" },
      ]},
      { title: "Model Registry", items: [
        { cmd: "mlflow.register_model('runs:/<run_id>/model', 'my-model')", desc: "Register model version" },
        { cmd: "client = MlflowClient()\\nclient.transition_model_version_stage('my-model', 1, 'Production')", desc: "Promote to production" },
        { cmd: "model = mlflow.pyfunc.load_model('models:/my-model/Production')", desc: "Load production model" },
        { cmd: "client.set_model_version_tag('my-model', 1, 'validated', 'true')", desc: "Tag model versions" },
      ]},
      { title: "Serving & Deployment", items: [
        { cmd: "mlflow models serve -m models:/my-model/Production -p 5001", desc: "REST API serving" },
        { cmd: "mlflow models build-docker -m models:/my-model/1 -n my-model-image", desc: "Build Docker image" },
        { cmd: "mlflow deployments create -t sagemaker -m models:/my-model/1", desc: "Deploy to SageMaker" },
        { cmd: "mlflow.evaluate(model, data, targets='label', model_type='classifier')", desc: "Evaluate with built-in metrics" },
      ]},
    ]
  },
  {
    id: "crewai-autogen", title: "CrewAI & AutoGen", icon: "👥", category: "AI",
    sections: [
      { title: "CrewAI", items: [
        { cmd: "from crewai import Agent, Task, Crew", desc: "Core imports" },
        { cmd: "researcher = Agent(role='Researcher', goal='Find latest info', backstory='Expert researcher', llm='gpt-4o')", desc: "Define agent with role" },
        { cmd: "task = Task(description='Research AI trends', agent=researcher, expected_output='Report with sources')", desc: "Create task" },
        { cmd: "crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task], process=Process.sequential)", desc: "Assemble crew" },
        { cmd: "result = crew.kickoff()", desc: "Run the crew" },
        { cmd: "@tool\\ndef search(query: str) -> str: ...  # Assign to agent via tools=[search]", desc: "Custom tools for agents" },
      ]},
      { title: "AutoGen", items: [
        { cmd: "from autogen import ConversableAgent\\nassistant = ConversableAgent('assistant', llm_config=llm_config)", desc: "Create conversable agent" },
        { cmd: "user_proxy = ConversableAgent('user', human_input_mode='NEVER', code_execution_config={'work_dir': 'code'})", desc: "User proxy with code execution" },
        { cmd: "user_proxy.initiate_chat(assistant, message='Write a Python script to...')", desc: "Start agent conversation" },
        { cmd: "GroupChat(agents=[user, coder, critic], messages=[], max_round=10)", desc: "Multi-agent group chat" },
        { cmd: "GroupChatManager(groupchat=gc, llm_config=config)", desc: "Manager routes conversation" },
      ]},
      { title: "Comparison & When to Use", items: [
        { cmd: "CrewAI: role-based, sequential/hierarchical, great for structured workflows", desc: "Best for: defined business processes" },
        { cmd: "AutoGen: conversation-based, flexible, great for open-ended collaboration", desc: "Best for: exploratory multi-agent chat" },
        { cmd: "LangGraph: graph-based, most control, great for complex state machines", desc: "Best for: production agent systems" },
        { cmd: "All support: custom tools, human-in-the-loop, memory", desc: "Common capabilities across frameworks" },
      ]},
    ]
  },
  {
    id: "fastapi", title: "FastAPI & REST APIs", icon: "🚀", category: "Languages",
    sections: [
      { title: "App Setup & Routes", items: [
        { cmd: "from fastapi import FastAPI\\napp = FastAPI(title='My API', version='1.0')", desc: "Initialize app — e.g., main.py entry point for a microservice" },
        { cmd: "@app.get('/users/{user_id}')\\nasync def get_user(user_id: int): return {'id': user_id}", desc: "Path param — GET /users/42 → {id: 42}" },
        { cmd: "@app.get('/items')\\nasync def list_items(skip: int = 0, limit: int = 10):", desc: "Query params — GET /items?skip=0&limit=10" },
        { cmd: "@app.post('/users', status_code=201)\\nasync def create_user(user: UserCreate):", desc: "POST with request body and 201 status" },
        { cmd: "@app.put('/users/{id}')\\n@app.patch('/users/{id}')\\n@app.delete('/users/{id}')", desc: "Full CRUD endpoints" },
        { cmd: "app.include_router(users_router, prefix='/api/v1', tags=['users'])", desc: "Router for modular API — e.g., separate routers per domain" },
      ]},
      { title: "Pydantic Models & Validation", items: [
        { cmd: "class UserCreate(BaseModel):\\n    name: str\\n    email: EmailStr\\n    age: int = Field(ge=18, le=120)", desc: "Request model with validation — rejects age<18" },
        { cmd: "class UserResponse(BaseModel):\\n    id: int\\n    name: str\\n    model_config = ConfigDict(from_attributes=True)", desc: "Response model — auto-serialize from ORM objects" },
        { cmd: "@app.post('/users', response_model=UserResponse)", desc: "Auto-filter response fields — hides internal fields" },
        { cmd: "class Filters(BaseModel):\\n    q: str | None = None\\n    category: Literal['tech','biz'] = 'tech'", desc: "Typed query filters — e.g., search with category constraint" },
        { cmd: "from pydantic import field_validator\\n@field_validator('email')\\ndef check(cls, v): ...", desc: "Custom validation — e.g., check domain whitelist" },
      ]},
      { title: "Auth & Middleware", items: [
        { cmd: "from fastapi.security import OAuth2PasswordBearer\\noauth2 = OAuth2PasswordBearer(tokenUrl='token')", desc: "OAuth2 scheme — auto Swagger 'Authorize' button" },
        { cmd: "async def get_current_user(token: str = Depends(oauth2)):\\n    payload = jwt.decode(token, SECRET, algorithms=['HS256'])", desc: "JWT auth dependency — reuse across all protected routes" },
        { cmd: "@app.middleware('http')\\nasync def log_requests(request, call_next): ...", desc: "Middleware — e.g., request logging, timing, CORS" },
        { cmd: "from fastapi.middleware.cors import CORSMiddleware\\napp.add_middleware(CORSMiddleware, allow_origins=['*'])", desc: "CORS — required for frontend apps to call your API" },
        { cmd: "Depends(get_db) — yield db session, auto-close after request", desc: "DB session dependency — e.g., SQLAlchemy session management" },
      ]},
      { title: "Advanced Patterns", items: [
        { cmd: "@app.on_event('startup')\\nasync def startup(): app.state.pool = await create_pool()", desc: "Startup event — init DB pool, load ML model, etc." },
        { cmd: "from fastapi import BackgroundTasks\\ndef send_email(bg: BackgroundTasks): bg.add_task(email_fn)", desc: "Background tasks — e.g., send email after signup" },
        { cmd: "from fastapi import UploadFile\\nasync def upload(file: UploadFile): content = await file.read()", desc: "File upload — e.g., CSV import, image upload" },
        { cmd: "from sse_starlette.sse import EventSourceResponse\\nasync def stream(): yield {'data': chunk}", desc: "Server-Sent Events — e.g., streaming LLM responses" },
        { cmd: "from fastapi.testclient import TestClient\\nclient = TestClient(app)\\nresp = client.get('/users')", desc: "Testing — e.g., integration tests with pytest" },
        { cmd: "uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4", desc: "Production run — multi-worker for performance" },
      ]},
    ]
  },
  {
    id: "pandas-numpy", title: "Pandas & NumPy", icon: "🐼", category: "Data",
    sections: [
      { title: "DataFrame Basics", items: [
        { cmd: "df = pd.read_csv('data.csv', parse_dates=['date'], dtype={'id': str})", desc: "Read CSV — e.g., parse dates and enforce types for clean data" },
        { cmd: "df.head(10) / df.info() / df.describe() / df.shape", desc: "Quick EDA — first look at any new dataset" },
        { cmd: "df[['name', 'age']] / df.loc[0:5, 'name':'age'] / df.iloc[:5, :3]", desc: "Selection — by column names, label index, or position" },
        { cmd: "df[df['age'] > 25] / df.query('age > 25 and city == \"Berlin\"')", desc: "Filtering — e.g., find all adults in Berlin" },
        { cmd: "df.sort_values(['score', 'date'], ascending=[False, True])", desc: "Multi-column sort — e.g., highest score, earliest date" },
        { cmd: "df.drop_duplicates(subset=['email'], keep='last')", desc: "Dedup — e.g., keep only latest record per email" },
        { cmd: "df.to_parquet('out.parquet', index=False) / df.to_csv('out.csv')", desc: "Export — Parquet is 10x smaller than CSV, use for large data" },
      ]},
      { title: "Transformations", items: [
        { cmd: "df['full_name'] = df['first'] + ' ' + df['last']", desc: "New column — e.g., combine name fields" },
        { cmd: "df['category'] = df['amount'].apply(lambda x: 'high' if x > 1000 else 'low')", desc: "Apply function — e.g., categorize transactions" },
        { cmd: "df['date'].dt.year / .dt.month / .dt.day_name()", desc: "Date extraction — e.g., group sales by month" },
        { cmd: "pd.cut(df['age'], bins=[0,18,35,60,100], labels=['teen','young','mid','senior'])", desc: "Binning — e.g., create age groups for analysis" },
        { cmd: "df.fillna({'age': df['age'].median(), 'city': 'Unknown'}) / df.dropna(subset=['email'])", desc: "Handle missing — fill with median or drop required fields" },
        { cmd: "pd.get_dummies(df, columns=['category'], drop_first=True)", desc: "One-hot encoding — e.g., prepare categorical features for ML" },
        { cmd: "df.replace({'status': {'active': 1, 'inactive': 0}})", desc: "Value mapping — e.g., encode labels" },
      ]},
      { title: "GroupBy & Aggregation", items: [
        { cmd: "df.groupby('dept')['salary'].agg(['mean', 'median', 'count'])", desc: "Multi-agg — e.g., salary stats per department" },
        { cmd: "df.groupby('dept').agg(avg_sal=('salary','mean'), headcount=('id','count'))", desc: "Named aggregation — clean output column names" },
        { cmd: "df.pivot_table(values='revenue', index='product', columns='quarter', aggfunc='sum', fill_value=0)", desc: "Pivot — e.g., product × quarter revenue matrix" },
        { cmd: "df.groupby('user')['amount'].transform('cumsum')", desc: "Running total — cumsum within each user group" },
        { cmd: "df.groupby('dept')['salary'].rank(pct=True)", desc: "Percentile rank — e.g., salary percentile within dept" },
        { cmd: "pd.merge(df1, df2, on='id', how='left', indicator=True)", desc: "Merge with indicator — find unmatched rows" },
      ]},
      { title: "NumPy Essentials", items: [
        { cmd: "arr = np.array([[1,2],[3,4]]); arr.shape, arr.dtype, arr.reshape(4,)", desc: "Create & inspect arrays" },
        { cmd: "np.zeros((3,4)) / np.ones((2,3)) / np.eye(4) / np.random.randn(100,5)", desc: "Common array constructors — e.g., init weights, identity matrix" },
        { cmd: "np.dot(A, B) / A @ B  # matrix multiplication", desc: "Matmul — e.g., neural network forward pass" },
        { cmd: "np.where(arr > 0, arr, 0)  # ReLU activation", desc: "Conditional — e.g., implement ReLU from scratch" },
        { cmd: "arr.mean(axis=0) / arr.std(axis=1) / np.percentile(arr, [25,50,75])", desc: "Stats — e.g., normalize features, compute quartiles" },
        { cmd: "np.linalg.norm(a - b)  # Euclidean distance", desc: "Distance — e.g., similarity between embeddings" },
        { cmd: "np.einsum('ij,jk->ik', A, B)  # Einstein summation", desc: "Einsum — e.g., batched matrix ops in one line" },
      ]},
    ]
  },
  {
    id: "github-actions", title: "CI/CD (GitHub Actions)", icon: "⚡", category: "DevOps",
    sections: [
      { title: "Workflow Basics", items: [
        { cmd: "name: CI\\non: [push, pull_request]\\njobs:\\n  test:\\n    runs-on: ubuntu-latest", desc: "Basic workflow — triggers on push & PR" },
        { cmd: "on:\\n  push:\\n    branches: [main]\\n  pull_request:\\n    branches: [main]", desc: "Branch-specific triggers — only main branch" },
        { cmd: "on:\\n  schedule:\\n    - cron: '0 6 * * 1'  # Monday 6am UTC", desc: "Cron schedule — e.g., weekly model retraining" },
        { cmd: "on:\\n  workflow_dispatch:\\n    inputs:\\n      environment:\\n        type: choice\\n        options: [staging, production]", desc: "Manual trigger with input — e.g., choose deploy target" },
        { cmd: "concurrency:\\n  group: ${{ github.ref }}\\n  cancel-in-progress: true", desc: "Cancel redundant runs — saves CI minutes" },
      ]},
      { title: "Steps & Actions", items: [
        { cmd: "- uses: actions/checkout@v4", desc: "Checkout code — required in almost every workflow" },
        { cmd: "- uses: actions/setup-python@v5\\n  with:\\n    python-version: '3.11'\\n    cache: 'pip'", desc: "Python setup with pip caching — 2x faster installs" },
        { cmd: "- uses: actions/setup-node@v4\\n  with:\\n    node-version: 20\\n    cache: 'npm'", desc: "Node.js setup — e.g., frontend build pipeline" },
        { cmd: "- run: |\\n    pip install -r requirements.txt\\n    pytest tests/ -v --cov=src", desc: "Multi-line run — install deps & run tests with coverage" },
        { cmd: "- uses: actions/cache@v4\\n  with:\\n    path: ~/.cache/huggingface\\n    key: hf-${{ hashFiles('models.txt') }}", desc: "Cache HuggingFace models — avoid re-downloading 5GB+ models" },
        { cmd: "- uses: actions/upload-artifact@v4\\n  with:\\n    name: test-report\\n    path: coverage.xml", desc: "Upload artifacts — e.g., test reports, built binaries" },
      ]},
      { title: "Secrets & Environments", items: [
        { cmd: "env:\\n  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}", desc: "Use secrets — e.g., API keys for integration tests" },
        { cmd: "environment: production\\n  # Requires approval in GitHub Settings", desc: "Protected environment — manual approval before deploy" },
        { cmd: "if: github.event_name == 'push' && github.ref == 'refs/heads/main'", desc: "Conditional step — only deploy on main branch push" },
        { cmd: "needs: [test, lint]\\n  # This job waits for test & lint to pass", desc: "Job dependencies — deploy only after tests pass" },
        { cmd: "strategy:\\n  matrix:\\n    python-version: ['3.10', '3.11', '3.12']\\n    os: [ubuntu-latest, macos-latest]", desc: "Matrix builds — test across Python versions & OS" },
      ]},
      { title: "Deploy Patterns", items: [
        { cmd: "- uses: docker/build-push-action@v5\\n  with:\\n    push: true\\n    tags: ghcr.io/${{ github.repository }}:latest", desc: "Build & push Docker — e.g., deploy ML model as container" },
        { cmd: "- uses: aws-actions/configure-aws-credentials@v4\\n  with:\\n    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}", desc: "OIDC auth to AWS — no long-lived keys, more secure" },
        { cmd: "- run: aws ecs update-service --cluster prod --service api --force-new-deployment", desc: "ECS deploy — e.g., rolling update of API service" },
        { cmd: "- uses: peaceiris/actions-gh-pages@v4\\n  with:\\n    publish_dir: ./build", desc: "Deploy to GitHub Pages — e.g., docs site or portfolio" },
        { cmd: "- uses: google-github-actions/deploy-cloudrun@v2\\n  with:\\n    service: my-api\\n    image: gcr.io/proj/img", desc: "Deploy to Cloud Run — serverless container deploy" },
      ]},
    ]
  },
  {
    id: "system-design", title: "System Design Patterns", icon: "🏛️", category: "Data",
    sections: [
      { title: "Scalability Patterns", items: [
        { cmd: "Horizontal scaling: add more servers behind load balancer", desc: "Scale out — e.g., 10 API servers behind nginx for 10K rps" },
        { cmd: "Vertical scaling: upgrade CPU/RAM on existing server", desc: "Scale up — simpler but has limits (e.g., 128 CPU max)" },
        { cmd: "Read replicas: primary writes, replicas serve reads (80% of traffic)", desc: "DB scaling — e.g., PostgreSQL with 3 read replicas" },
        { cmd: "Sharding: partition data by user_id % N across N databases", desc: "Horizontal DB split — e.g., users 1-1M → shard1, 1M-2M → shard2" },
        { cmd: "CDN: cache static assets at edge locations globally", desc: "Content delivery — e.g., CloudFront serves images in <50ms worldwide" },
        { cmd: "Auto-scaling: scale 2-20 instances based on CPU > 70%", desc: "Dynamic scaling — e.g., AWS ASG scales with traffic spikes" },
      ]},
      { title: "Caching Strategies", items: [
        { cmd: "Cache-Aside: app checks cache → miss → fetch DB → populate cache", desc: "Most common — e.g., Redis cache for user profiles (TTL 5min)" },
        { cmd: "Write-Through: write to cache + DB simultaneously", desc: "Strong consistency — e.g., shopping cart (always up-to-date)" },
        { cmd: "Write-Behind: write to cache → async batch write to DB", desc: "High write throughput — e.g., analytics events (eventual consistency)" },
        { cmd: "Redis: SET user:123 '{...}' EX 300  # 5 min TTL", desc: "Redis example — cache user data with expiration" },
        { cmd: "Cache invalidation: TTL, event-driven purge, versioned keys", desc: "The hard part — e.g., purge cache on user update event" },
        { cmd: "Multi-layer: L1 (in-process) → L2 (Redis) → L3 (CDN)", desc: "Layered caching — e.g., 10μs → 1ms → 50ms → 200ms (DB)" },
      ]},
      { title: "Message Queues & Events", items: [
        { cmd: "Kafka: high-throughput event streaming (millions/sec)", desc: "Event backbone — e.g., user-clicked, order-placed events" },
        { cmd: "RabbitMQ / SQS: task queues for async processing", desc: "Job queue — e.g., send email, process image, train model" },
        { cmd: "Pub/Sub: publisher → topic → multiple subscribers", desc: "Fan-out — e.g., order event → inventory + shipping + email" },
        { cmd: "Dead Letter Queue (DLQ): failed messages go here for retry/debug", desc: "Error handling — e.g., after 3 retries, move to DLQ for investigation" },
        { cmd: "Event sourcing: store events, not state — rebuild state by replaying", desc: "Audit trail — e.g., bank transactions as immutable event log" },
        { cmd: "CQRS: separate read models (optimized queries) from write models", desc: "Read/write split — e.g., write to normalized DB, read from denormalized views" },
      ]},
      { title: "API & Microservices", items: [
        { cmd: "API Gateway: single entry point → routes to microservices", desc: "Front door — e.g., Kong/nginx routes /users → user-svc, /orders → order-svc" },
        { cmd: "Rate limiting: 100 req/min per user (token bucket algorithm)", desc: "Protect APIs — e.g., prevent abuse, ensure fair usage" },
        { cmd: "Circuit Breaker: if service fails 5x → stop calling for 30s → retry", desc: "Resilience — e.g., payment service down → show cached prices" },
        { cmd: "Service mesh (Istio/Linkerd): mTLS, retries, observability between services", desc: "Infra layer — e.g., automatic retries, tracing, encryption" },
        { cmd: "gRPC: binary protocol, 10x faster than REST, contract-first (protobuf)", desc: "Internal comms — e.g., microservice-to-microservice calls" },
        { cmd: "Saga pattern: distributed transactions across services with compensating actions", desc: "Consistency — e.g., order → payment → shipping, rollback on failure" },
      ]},
    ]
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(CHEATSHEETS.map(c => c.category)))];

const generatePDF = (cs: Cheatsheet) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const usableW = pageW - margin * 2;
  let y = 24;

  const addFooter = () => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(160, 160, 160);
    doc.text("Generated from Morris Darren Babu's Portfolio | darren.dev", margin, pageH - 10);
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, pageH - 14, pageW - margin, pageH - 14);
  };

  const checkPage = (need: number) => {
    if (y + need > pageH - 20) {
      addFooter();
      doc.addPage();
      y = 20;
    }
  };

  // Title bar
  doc.setFillColor(30, 30, 40);
  doc.rect(0, 0, pageW, 18, "F");
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(cs.title.toUpperCase(), margin, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  const totalCmds = cs.sections.reduce((a, s) => a + s.items.length, 0);
  doc.text(`${totalCmds} commands | ${cs.category}`, pageW - margin, 12, { align: "right" });
  y = 28;

  cs.sections.forEach((sec, secIdx) => {
    checkPage(22);

    // Section header with accent line
    if (secIdx > 0) y += 3;
    doc.setFillColor(226, 0, 116); // Magenta accent
    doc.rect(margin, y - 4, 3, 7, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 40);
    doc.text(sec.title, margin + 6, y);
    y += 5;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, pageW - margin, y);
    y += 5;

    sec.items.forEach((item, itemIdx) => {
      // Estimate height needed
      const cmdLines = doc.splitTextToSize(item.cmd, usableW - 12);
      const neededH = cmdLines.length * 4 + 8;
      checkPage(neededH);

      // Alternating row background
      if (itemIdx % 2 === 0) {
        doc.setFillColor(248, 248, 250);
        doc.rect(margin, y - 3.5, usableW, neededH, "F");
      }

      // Command
      doc.setFontSize(8.5);
      doc.setFont("courier", "normal");
      doc.setTextColor(20, 60, 140);
      doc.text(cmdLines, margin + 4, y);
      y += cmdLines.length * 3.8;

      // Description
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.setFontSize(7.5);
      const descLines = doc.splitTextToSize(item.desc, usableW - 16);
      doc.text(descLines, margin + 8, y);
      y += descLines.length * 3.5 + 2.5;
    });
    y += 2;
  });

  addFooter();
  doc.save(`${cs.id}-cheatsheet.pdf`);
};

export default function Cheatsheets() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = CHEATSHEETS.filter(c => filter === "All" || c.category === filter);

  return (
    <div className="cheatsheets-container">
      <div className="cheatsheet-filters">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`filter-chip ${filter === cat ? 'filter-chip--active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
        ))}
      </div>

      <div className="cheatsheets-grid">
        {filtered.map(cs => {
          const isExpanded = expandedId === cs.id;
          return (
            <div key={cs.id} className={`cheatsheet-card ${isExpanded ? 'cheatsheet-card--expanded' : ''}`}>
              <div className="cheatsheet-header" onClick={() => setExpandedId(isExpanded ? null : cs.id)}>
                <span className="cheatsheet-icon">{cs.icon}</span>
                <h4 className="cheatsheet-title">{cs.title}</h4>
                <span className="cheatsheet-count">{cs.sections.reduce((a, s) => a + s.items.length, 0)} commands</span>
                <span className={`blog-chevron ${isExpanded ? 'blog-chevron--open' : ''}`}>↓</span>
              </div>

              {isExpanded && (
                <div className="cheatsheet-body">
                  {cs.sections.map((sec, i) => (
                    <div key={i} className="cs-section">
                      <h5 className="cs-section-title">{sec.title}</h5>
                      <div className="cs-items">
                        {sec.items.map((item, j) => (
                          <div key={j} className="cs-item" onClick={() => navigator.clipboard.writeText(item.cmd)}>
                            <code className="cs-cmd">{item.cmd}</code>
                            <span className="cs-desc">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="cs-download-row">
                    <button className="btn btn--primary btn--sm cs-download" onClick={(e) => { e.stopPropagation(); generatePDF(cs); }}>
                      📄 Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
