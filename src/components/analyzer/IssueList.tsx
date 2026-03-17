import type { Issue } from "./analyzeCode";
import "./IssueList.css";

interface IssueListProps {
  issues: Issue[];
}

const severityToClass = (s: Issue["severity"]) => {
  if (s === "error") return "tag--error";
  if (s === "warning") return "tag--warning";
  return "tag--subtle";
};

export const IssueList = ({ issues }: IssueListProps) => {
  if (issues.length === 0) {
    return (
      <div className="issue-list-empty">
        <p className="ods-typography-body-m-regular" style={{ color: "var(--colours-basic-text-recessive)" }}>
          No issues found — your code is solid! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="issue-list">
      <h2 className="ods-typography-title-s" style={{ color: "var(--colours-basic-text)" }}>
        Issues Found ({issues.length})
      </h2>
      <div className="issue-items">
        {issues.map((issue, i) => (
          <div key={i} className={`issue-item issue-item--${issue.severity}`}>
            <div className="issue-item-top">
              <span className="ods-typography-body-m-bold" style={{ color: "var(--colours-basic-text)" }}>
                {issue.title}
              </span>
              <span className={`tag ${severityToClass(issue.severity)}`}>{issue.severity}</span>
            </div>
            <p className="ods-typography-body-s-regular" style={{ color: "var(--colours-basic-text-recessive)" }}>
              {issue.message}
            </p>
            {issue.suggestion && (
              <div className="issue-suggestion">
                <span className="ods-typography-body-s-bold" style={{ color: "var(--colours-basic-text-dominant)" }}>
                  💡 Fix:
                </span>
                <span className="ods-typography-body-s-regular" style={{ color: "var(--colours-basic-text)" }}>
                  {" "}{issue.suggestion}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
