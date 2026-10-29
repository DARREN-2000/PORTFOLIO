export const thesisData = {
  title: "LLM-Driven White-Box Fuzzing for Automotive Compute Platforms",
  shortTitle: "AI in Automotive Systems",
  context: "Master Thesis · Volkswagen Group / CARIAD · FAU Erlangen-Nürnberg · 2025",
  summary: "A research and engineering study of how large language models can generate useful C++ fuzz drivers, how model choice and fine-tuning affect results, and how the workflow can be integrated into secure CI/CD/CT pipelines.",
  sourceUrl: "https://raw.githubusercontent.com/DARREN-2000/DARREN-2000/e5a7f7cf9531ba5fd627f9d16d7c9ef1e8b45cbe/Master_Thesis.pdf",
  repositoryUrl: "https://github.com/DARREN-2000/DARREN-2000",
  confidentialityNote: "Some internal automotive targets and infrastructure details cannot be published. The public thesis and this summary focus on reproducible methodology, open evaluation targets, and transferable engineering patterns.",
  researchQuestions: [
    "How effectively can LLMs generate compilable and coverage-relevant fuzz drivers for C++ software?",
    "Which model and prompting choices produce the most useful test inputs across different target libraries?",
    "Can model optimization and CI/CD/CT integration make LLM-assisted fuzzing practical for engineering teams?",
  ],
  phases: [
    {
      number: "01",
      title: "Evaluate",
      label: "Model and target comparison",
      body: "Compare open-source models across C++ targets using compilation, execution, code coverage, and behavioral usefulness as the evaluation signals.",
      outputs: ["Model matrix", "Fuzz-driver validity", "Coverage baseline"],
    },
    {
      number: "02",
      title: "Optimize",
      label: "Adapt a promising model",
      body: "Use curated examples and LoRA/QLoRA fine-tuning to reduce inference cost and improve the consistency of generated drivers.",
      outputs: ["Training dataset", "Fine-tuned model", "Efficiency comparison"],
    },
    {
      number: "03",
      title: "Integrate",
      label: "Connect to delivery",
      body: "Place generation, compilation, execution, and coverage feedback inside a secure CI/CD/CT workflow suitable for automotive software teams.",
      outputs: ["Pipeline stages", "Private connectivity", "Regression signal"],
    },
  ],
  architecture: [
    { label: "C++ target", detail: "AST + API surface" },
    { label: "LLM generator", detail: "Prompt + model" },
    { label: "Build gate", detail: "Compile + sanitize" },
    { label: "Fuzz runner", detail: "Execute + mutate" },
    { label: "Coverage loop", detail: "Measure + refine" },
  ],
  results: [
    { value: "16", label: "models benchmarked", detail: "A broad comparison before selecting candidates for deeper optimization." },
    { value: "+13%", label: "flaw detection", detail: "Reported improvement in the thesis evaluation context." },
    { value: "-55%", label: "token consumption", detail: "Reported reduction after model and workflow optimization." },
    { value: "-33%", label: "generation time", detail: "Reported reduction in test-generation time." },
    { value: "+7%", label: "coverage", detail: "Reported line and branch coverage improvement in the integrated workflow." },
  ],
  methods: ["LLM benchmarking", "White-box fuzzing", "C / C++", "AST analysis", "Coverage evaluation", "LoRA / QLoRA", "Azure AI Foundry", "GitHub Actions", "Azure Private Link", "Sanitizers"],
  limitations: [
    "Results depend on target-library complexity, prompt design, model availability, and the execution environment.",
    "Confidential automotive targets cannot be reproduced publicly, so open-source targets provide the public comparison surface.",
    "Coverage is a useful signal, but it is not equivalent to complete defect discovery or production safety.",
    "Generated code still requires compilation, sandboxing, review, and security controls before entering an engineering pipeline.",
  ],
};

export type ThesisPhase = typeof thesisData.phases[number];
