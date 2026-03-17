export interface Issue {
  title: string;
  message: string;
  severity: "error" | "warning" | "info";
  suggestion?: string;
}

export interface AnalysisResult {
  readability: number;
  maintainability: number;
  complexity: number;
  bestPractices: number;
  issues: Issue[];
}

export function analyzeCode(code: string): AnalysisResult {
  const issues: Issue[] = [];
  let readability = 100;
  let maintainability = 100;
  let complexity = 100;
  let bestPractices = 100;

  const lines = code.split("\n");
  const lineCount = lines.length;

  // var usage
  const varCount = (code.match(/\bvar\b/g) || []).length;
  if (varCount > 0) {
    issues.push({
      title: "Using `var` declarations",
      message: `Found ${varCount} usage(s) of \`var\`. This can cause hoisting bugs and scope leaks.`,
      severity: "warning",
      suggestion: "Replace `var` with `const` or `let`.",
    });
    bestPractices -= varCount * 8;
  }

  // console.log
  const consoleCount = (code.match(/console\.(log|warn|error|debug)/g) || []).length;
  if (consoleCount > 0) {
    issues.push({
      title: "Console statements left in code",
      message: `Found ${consoleCount} console statement(s). These should be removed in production.`,
      severity: "info",
      suggestion: "Remove console statements or use a proper logger.",
    });
    bestPractices -= consoleCount * 5;
  }

  // Long functions (lines > 30 between { })
  if (lineCount > 40) {
    issues.push({
      title: "Large code block",
      message: `This code is ${lineCount} lines long. Consider breaking it into smaller functions.`,
      severity: "warning",
      suggestion: "Extract logic into smaller, focused helper functions.",
    });
    maintainability -= 15;
    readability -= 10;
  }

  // Nested callbacks / deep nesting
  const maxIndent = lines.reduce((max, line) => {
    const indent = line.search(/\S/);
    return indent > max ? indent : max;
  }, 0);
  if (maxIndent > 16) {
    issues.push({
      title: "Deep nesting detected",
      message: "Code has deep indentation which hurts readability.",
      severity: "warning",
      suggestion: "Use early returns, extract functions, or use async/await.",
    });
    complexity -= 20;
    readability -= 15;
  }

  // No TypeScript types
  const hasTypes = /:\s*(string|number|boolean|any|void|object|Array|Record|interface|type\s)/g.test(code);
  if (!hasTypes && lineCount > 5) {
    issues.push({
      title: "No type annotations",
      message: "Code lacks TypeScript type annotations, making it harder to maintain.",
      severity: "info",
      suggestion: "Add TypeScript types for function parameters and return values.",
    });
    maintainability -= 12;
  }

  // any usage
  const anyCount = (code.match(/:\s*any\b/g) || []).length;
  if (anyCount > 0) {
    issues.push({
      title: "Using `any` type",
      message: `Found ${anyCount} usage(s) of \`any\`. This bypasses type safety.`,
      severity: "warning",
      suggestion: "Replace `any` with specific types or `unknown`.",
    });
    bestPractices -= anyCount * 6;
  }

  // Magic numbers
  const magicNumbers = code.match(/[^.\d\w](\d{2,})[^.\d\w]/g) || [];
  if (magicNumbers.length > 2) {
    issues.push({
      title: "Magic numbers",
      message: `Found hard-coded numbers. These make code harder to understand.`,
      severity: "info",
      suggestion: "Extract magic numbers into named constants.",
    });
    readability -= 10;
  }

  // TODO/FIXME/HACK
  const todoCount = (code.match(/\/\/\s*(TODO|FIXME|HACK|XXX)/gi) || []).length;
  if (todoCount > 0) {
    issues.push({
      title: "Unresolved TODOs",
      message: `Found ${todoCount} TODO/FIXME/HACK comment(s).`,
      severity: "info",
      suggestion: "Address or track these items before shipping.",
    });
    maintainability -= todoCount * 4;
  }

  // No error handling
  const hasTryCatch = /try\s*{/.test(code);
  const hasAsync = /async\s/.test(code);
  if (hasAsync && !hasTryCatch) {
    issues.push({
      title: "Missing error handling",
      message: "Async code without try/catch can silently fail.",
      severity: "error",
      suggestion: "Wrap async operations in try/catch blocks.",
    });
    bestPractices -= 15;
  }

  // == instead of ===
  const looseEquals = (code.match(/[^=!]==[^=]/g) || []).length;
  if (looseEquals > 0) {
    issues.push({
      title: "Loose equality operators",
      message: `Found ${looseEquals} usage(s) of \`==\` instead of \`===\`.`,
      severity: "warning",
      suggestion: "Use strict equality `===` to avoid type coercion bugs.",
    });
    bestPractices -= looseEquals * 5;
  }

  // Clamp scores
  readability = Math.max(0, Math.min(100, readability));
  maintainability = Math.max(0, Math.min(100, maintainability));
  complexity = Math.max(0, Math.min(100, complexity));
  bestPractices = Math.max(0, Math.min(100, bestPractices));

  return { readability, maintainability, complexity, bestPractices, issues };
}
