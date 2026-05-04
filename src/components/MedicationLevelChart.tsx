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

const medLevelData = [
  { day: "Mon", level: 85, dose: true },
  { day: "Tue", level: 92 },
  { day: "Wed", level: 78 },
  { day: "Thu", level: 65 },
  { day: "Fri", level: 52 },
  { day: "Sat", level: 40 },
  { day: "Sun", level: 30 },
];

export function MedicationLevelChart() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-foreground">Estimated Medication Levels</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Approximate active compound in your system</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-bio-cyan/10 text-bio-cyan text-xs font-semibold">
          Active
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={medLevelData}>
          <defs>
            <linearGradient id="medGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6BBFB5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6BBFB5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
          <XAxis dataKey="day" tick={{ fill: "#8A94A6", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8A94A6", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8ECF1",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          />
          <Area type="monotone" dataKey="level" fill="url(#medGradient)" stroke="none" />
          <Line type="monotone" dataKey="level" stroke="#6BBFB5" strokeWidth={2.5} dot={{ r: 4, fill: "#6BBFB5", strokeWidth: 2, stroke: "#fff" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
