import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

const sites = [
  { id: "abdomen-left", label: "Abdomen (Left)", region: "Abdomen" },
  { id: "abdomen-right", label: "Abdomen (Right)", region: "Abdomen" },
  { id: "thigh-left", label: "Thigh (Left)", region: "Thigh" },
  { id: "thigh-right", label: "Thigh (Right)", region: "Thigh" },
  { id: "arm-left", label: "Arm (Left)", region: "Arm" },
  { id: "arm-right", label: "Arm (Right)", region: "Arm" },
];

const history = [
  { site: "abdomen-left", date: "Apr 28" },
  { site: "thigh-right", date: "Apr 21" },
  { site: "abdomen-right", date: "Apr 14" },
  { site: "arm-left", date: "Apr 7" },
  { site: "thigh-left", date: "Mar 31" },
];

export function InjectionSiteTracker() {
  const [selected, setSelected] = useState("abdomen-left");
  const lastUsed = history[0]?.site;
  
  // Smart suggestion: pick the site least recently used
  const usedSites = history.map(h => h.site);
  const suggested = sites.find(s => !usedSites.includes(s.id))?.id ?? 
    sites.find(s => s.id !== lastUsed)?.id ?? sites[0].id;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground">Injection Sites</h3>
        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
          <RotateCcw className="h-3 w-3" />
          Rotation Tracker
        </div>
      </div>

      {/* Suggested site */}
      <div className="mb-4 rounded-xl bg-bio-success/8 border border-bio-success/15 p-3.5">
        <p className="text-xs font-semibold text-bio-success uppercase tracking-wider mb-0.5">Suggested Next</p>
        <p className="text-sm font-bold text-foreground">
          {sites.find(s => s.id === suggested)?.label}
        </p>
      </div>

      {/* Site grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {sites.map(site => {
          const isLast = site.id === lastUsed;
          const isSuggested = site.id === suggested;
          return (
            <button
              key={site.id}
              onClick={() => setSelected(site.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                selected === site.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : isLast
                  ? "bg-accent text-muted-foreground border border-border"
                  : "bg-accent/50 text-foreground border border-transparent hover:bg-accent"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{site.label}</span>
                {isLast && <span className="text-[9px] text-muted-foreground font-bold uppercase">Last</span>}
                {isSuggested && !isLast && <span className="text-[9px] text-bio-success font-bold uppercase">Next</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent history */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent</p>
        <div className="space-y-1.5">
          {history.slice(0, 3).map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-bio-success" />
                <span className="text-foreground font-medium">{sites.find(s => s.id === h.site)?.label}</span>
              </div>
              <span className="text-muted-foreground">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
