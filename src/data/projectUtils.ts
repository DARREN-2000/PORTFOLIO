export const projectSlug = (title: string) => title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

type ProjectLike = {
  title: string;
  subtitle: string;
  tags: string[];
};

export const projectCategory = (project: ProjectLike) => {
  const text = `${project.title} ${project.subtitle} ${project.tags.join(" ")}`.toLowerCase();
  if (text.includes("agent") || text.includes("workflow") || text.includes("automation") || text.includes("consent")) return "Developer Tools";
  if (text.includes("research") || text.includes("gnn") || text.includes("publication") || text.includes("thesis") || text.includes("runtime")) return "Research";
  if (text.includes("data") || text.includes("search") || text.includes("recommend") || text.includes("ocr") || text.includes("nlp")) return "Data & ML";
  return "AI Systems";
};

export const flagshipProjectTitles = new Set([
  "FlowBoard",
  "ZyntriQ",
  "ReconKit",
]);

export const selectedProjectTitles = new Set([
  ...flagshipProjectTitles,
  "AI Hypervisor Platform",
  "MCP Provenance Capsules",
  "IntentGraph",
  "LLM Fuzzing Monitor Dashboard",
  "Deval",
  "AgentBox",
]);
