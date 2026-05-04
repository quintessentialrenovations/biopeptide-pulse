import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { useI18n } from "@/i18n/context";

const mockData = [
  { week: "W1", actual: 105, expected: 104.5, goal: 85 },
  { week: "W2", actual: 103.8, expected: 103.5, goal: 85 },
  { week: "W3", actual: 102.5, expected: 102.5, goal: 85 },
  { week: "W4", actual: 101.8, expected: 101.5, goal: 85 },
  { week: "W5", actual: 100.2, expected: 100.5, goal: 85 },
  { week: "W6", actual: 99.1, expected: 99.5, goal: 85 },
  { week: "W7", actual: 98.0, expected: 98.5, goal: 85 },
  { week: "W8", actual: 96.5, expected: 97.5, goal: 85 },
];

export function WeightChart() {
  const { t } = useI18n();
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-foreground">{t("comp.weightProgress")}</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#4F7AEF" }} />
            <span className="text-muted-foreground font-medium">{t("comp.actual")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#6BBFB5" }} />
            <span className="text-muted-foreground font-medium">{t("comp.expected")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#34C759" }} />
            <span className="text-muted-foreground font-medium">{t("comp.goalLine")}</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={mockData}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F7AEF" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4F7AEF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
          <XAxis dataKey="week" tick={{ fill: "#8A94A6", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8A94A6", fontSize: 12 }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8ECF1",
              borderRadius: "12px",
              color: "#1A1A2E",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          />
          <Area type="monotone" dataKey="actual" fill="url(#actualGradient)" stroke="none" />
          <Line type="monotone" dataKey="actual" stroke="#4F7AEF" strokeWidth={3} dot={{ r: 5, fill: "#4F7AEF", strokeWidth: 2, stroke: "#fff" }} />
          <Line type="monotone" dataKey="expected" stroke="#6BBFB5" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          <Line type="monotone" dataKey="goal" stroke="#34C759" strokeWidth={1.5} strokeDasharray="3 5" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
