export type PortfolioCommand = {
  category: string;
  title: string;
  command: string;
  note: string;
  project?: string;
};

export const portfolioCommands: PortfolioCommand[] = [
  { category: "Git", title: "Review repository state", command: "git status --short\ngit diff --check\ngit log --oneline -10", note: "Inspect changes before committing." },
  { category: "Git", title: "Create a clean feature branch", command: "git switch -c feat/<name>\ngit add -A\ngit commit -m \"feat: <summary>\"", note: "Keep a focused change set with a descriptive branch." },
  { category: "GitHub", title: "Inspect project history", command: "gh repo view <owner>/<repo>\ngh pr list --state open\ngh run list --limit 10", note: "Review repository context, open work, and recent automation." },
  { category: "Python", title: "Create an environment and test", command: "python -m venv .venv\nsource .venv/bin/activate\npython -m pip install -r requirements.txt\npytest -q", note: "Run project tests inside an isolated environment." },
  { category: "Python", title: "Format and type-check", command: "ruff format .\nruff check .\nmypy src", note: "Apply deterministic formatting and catch type or lint regressions." },
  { category: "AI / LLM", title: "Run an evaluation slice", command: "python -m evals.run \\\n  --dataset data/eval.jsonl \\\n  --model <model> \\\n  --output artifacts/eval.json", note: "Keep model comparisons reproducible and save the evidence artifact." },
  { category: "AI / LLM", title: "Serve a local model", command: "vllm serve <model> \\\n  --host 0.0.0.0 \\\n  --port 8000 \\\n  --max-model-len 8192", note: "Confirm GPU capacity and model licensing before serving." },
  { category: "Data", title: "Inspect a dataset safely", command: "python - <<'PY'\nimport pandas as pd\ndf = pd.read_parquet('data/input.parquet')\nprint(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum().sort_values(ascending=False).head())\nPY", note: "Check shape, schema, and missingness before modeling." },
  { category: "Rust / WebAssembly", title: "Validate a Wasm module", command: "cargo fmt --all -- --check\ncargo test\nwasm-tools validate module.wasm", note: "Verify formatting, tests, and module validity.", project: "TelosVM" },
  { category: "Rust", title: "Audit a Rust workspace", command: "cargo check --workspace\ncargo clippy --workspace --all-targets -- -D warnings\ncargo audit", note: "Combine compilation, lint, and dependency checks." },
  { category: "Docker", title: "Build and inspect a service", command: "docker compose up --build\ndocker compose ps\ndocker compose logs -f --tail=100\ndocker compose down", note: "Use only for the Compose project you intend to stop." },
  { category: "Kubernetes", title: "Inspect a workload", command: "kubectl config current-context\nkubectl get pods -A\nkubectl describe pod <pod-name>\nkubectl logs <pod-name> --tail=100", note: "Confirm the active context before running cluster commands." },
  { category: "Kubernetes", title: "Check rollout health", command: "kubectl rollout status deployment/<name>\nkubectl get events --sort-by=.lastTimestamp\nkubectl top pods", note: "Use namespace-qualified commands in shared clusters." },
  { category: "AWS", title: "Check identity and storage", command: "aws sts get-caller-identity\naws s3 ls", note: "These commands use the currently configured AWS credentials." },
  { category: "Observability", title: "Follow a service signal", command: "curl -fsS http://localhost:8000/health\ncurl -fsS http://localhost:8000/metrics | head -80\njournalctl -u <service> -n 100 --no-pager", note: "Check health, metrics, and recent logs together." },
  { category: "Security", title: "Scan before publishing", command: "gitleaks detect --no-banner\ntrivy fs --scanners vuln,secret,misconfig .\nsemgrep scan --config auto", note: "Review findings and authorization before sharing results.", project: "Deval" },
  { category: "Frontend", title: "Validate a production build", command: "npm ci\nnpm run lint\nnpm run build\nnpm run preview -- --host 0.0.0.0", note: "Validate the same artifact that will be previewed or deployed." },
  { category: "Database", title: "Inspect a PostgreSQL connection", command: "psql \"$DATABASE_URL\" -c '\\dt'\npsql \"$DATABASE_URL\" -c 'select now();'", note: "Never paste credentials into shell history or public logs." },
  { category: "Portfolio", title: "Explore the flagship work", command: "open https://darren-dev.netlify.app/projects?scope=selected\nopen https://darren-dev.netlify.app/commands", note: "Start with the selected project records and this command index." },
];
