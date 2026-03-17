import { useMemo } from "react";

const DAYS = 365;
const WEEKS = Math.ceil(DAYS / 7);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GitHubHeatmap() {
  const data = useMemo(() => {
    // Generate realistic contribution data
    const contributions: number[] = [];
    const now = new Date();
    for (let i = DAYS - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const day = date.getDay();
      // Weekdays more active, some random bursts
      const isWeekday = day > 0 && day < 6;
      const burst = Math.random() > 0.85 ? Math.floor(Math.random() * 8) : 0;
      const base = isWeekday ? Math.random() * 4 : Math.random() * 1.5;
      contributions.push(Math.floor(base + burst));
    }
    return contributions;
  }, []);

  const total = data.reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...data);
  const streak = (() => {
    let s = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i] > 0) s++;
      else break;
    }
    return s;
  })();

  const getColor = (val: number) => {
    if (val === 0) return "var(--heatmap-0, hsl(220, 10%, 20%))";
    const ratio = val / maxVal;
    if (ratio < 0.25) return "var(--heatmap-1, hsl(150, 50%, 25%))";
    if (ratio < 0.5) return "var(--heatmap-2, hsl(150, 55%, 35%))";
    if (ratio < 0.75) return "var(--heatmap-3, hsl(150, 60%, 45%))";
    return "var(--heatmap-4, hsl(150, 65%, 55%))";
  };

  // Build week columns
  const weeks: number[][] = [];
  let weekArr: number[] = [];
  // Pad first week
  const startDay = new Date();
  startDay.setDate(startDay.getDate() - DAYS + 1);
  const firstDayOfWeek = startDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) weekArr.push(-1);

  data.forEach((val) => {
    weekArr.push(val);
    if (weekArr.length === 7) {
      weeks.push(weekArr);
      weekArr = [];
    }
  });
  if (weekArr.length) weeks.push(weekArr);

  return (
    <div className="heatmap-widget">
      <div className="heatmap-header">
        <span className="heatmap-title">📊 Contribution Activity</span>
        <span className="heatmap-total">{total} contributions in the last year</span>
      </div>
      <div className="heatmap-stats">
        <span className="heatmap-stat">🔥 {streak} day streak</span>
        <span className="heatmap-stat">📈 Best day: {maxVal} commits</span>
        <span className="heatmap-stat">📅 Avg: {Math.round(total / 365)}/day</span>
      </div>
      <div className="heatmap-months">
        {MONTHS.map(m => <span key={m} className="heatmap-month">{m}</span>)}
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((val, di) => (
              <div
                key={di}
                className="heatmap-cell"
                style={{ background: val < 0 ? "transparent" : getColor(val) }}
                title={val >= 0 ? `${val} contributions` : ""}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 2, 4, 6, 8].map(v => (
          <div key={v} className="heatmap-cell" style={{ background: getColor(v) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
