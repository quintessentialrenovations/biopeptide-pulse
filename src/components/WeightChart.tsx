import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

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
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Weight Progress</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-bio-cyan" />
            Expected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-bio-success" />
            Goal
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={mockData}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 250 / 50%)" />
          <XAxis dataKey="week" tick={{ fill: "oklch(0.60 0.02 250)", fontSize: 12 }} />
          <YAxis tick={{ fill: "oklch(0.60 0.02 250)", fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.17 0.015 250)",
              border: "1px solid oklch(0.30 0.02 250 / 40%)",
              borderRadius: "8px",
              color: "oklch(0.95 0.005 250)",
            }}
          />
          <Area type="monotone" dataKey="actual" fill="url(#actualGradient)" stroke="none" />
          <Line type="monotone" dataKey="actual" stroke="oklch(0.65 0.18 250)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.65 0.18 250)" }} />
          <Line type="monotone" dataKey="expected" stroke="oklch(0.78 0.12 200)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="goal" stroke="oklch(0.70 0.18 155)" strokeWidth={1} strokeDasharray="2 4" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
