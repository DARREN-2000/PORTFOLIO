import { ODSBox, ODSText, ODSTagStatic } from "@telekom-ods/react-ui-kit";
import type { Issue } from "./analyzeCode";
import "./IssueList.css";

interface IssueListProps {
  issues: Issue[];
}

const severityToTagType = (s: Issue["severity"]) => {
  if (s === "error") return "error" as const;
  if (s === "warning") return "warning" as const;
  return "subtle" as const;
};

export const IssueList = ({ issues }: IssueListProps) => {
  if (issues.length === 0) {
    return (
      <ODSBox as="div" className="issue-list-empty">
        <ODSText as="p" className="ods-typography-body-m-regular" style={{ color: "var(--colours-basic-text-recessive)" }}>
          No issues found — your code is solid! ✨
        </ODSText>
      </ODSBox>
    );
  }

  return (
    <ODSBox as="div" className="issue-list">
      <ODSText as="h2" className="ods-typography-title-s" style={{ color: "var(--colours-basic-text)" }}>
        Issues Found ({issues.length})
      </ODSText>
      <ODSBox as="div" className="issue-items">
        {issues.map((issue, i) => (
          <ODSBox as="div" key={i} className={`issue-item issue-item--${issue.severity}`}>
            <ODSBox as="div" className="issue-item-top">
              <ODSText as="span" className="ods-typography-body-m-bold" style={{ color: "var(--colours-basic-text)" }}>
                {issue.title}
              </ODSText>
              <ODSTagStatic label={issue.severity} type={severityToTagType(issue.severity)} />
            </ODSBox>
            <ODSText as="p" className="ods-typography-body-s-regular" style={{ color: "var(--colours-basic-text-recessive)" }}>
              {issue.message}
            </ODSText>
            {issue.suggestion && (
              <ODSBox as="div" className="issue-suggestion">
                <ODSText as="span" className="ods-typography-body-s-bold" style={{ color: "var(--colours-basic-text-dominant)" }}>
                  💡 Fix:
                </ODSText>
                <ODSText as="span" className="ods-typography-body-s-regular" style={{ color: "var(--colours-basic-text)" }}>
                  {" "}{issue.suggestion}
                </ODSText>
              </ODSBox>
            )}
          </ODSBox>
        ))}
      </ODSBox>
    </ODSBox>
  );
};
