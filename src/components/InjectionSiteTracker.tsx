import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

const sites: { id: string; labelKey: TranslationKey; region: string }[] = [
  { id: "abdomen-left", labelKey: "comp.abdomenLeft", region: "Abdomen" },
  { id: "abdomen-right", labelKey: "comp.abdomenRight", region: "Abdomen" },
  { id: "thigh-left", labelKey: "comp.thighLeft", region: "Thigh" },
  { id: "thigh-right", labelKey: "comp.thighRight", region: "Thigh" },
  { id: "arm-left", labelKey: "comp.armLeft", region: "Arm" },
  { id: "arm-right", labelKey: "comp.armRight", region: "Arm" },
];

const history = [
  { site: "abdomen-left", date: "Apr 28" },
  { site: "thigh-right", date: "Apr 21" },
  { site: "abdomen-right", date: "Apr 14" },
  { site: "arm-left", date: "Apr 7" },
  { site: "thigh-left", date: "Mar 31" },
];

export function InjectionSiteTracker() {
  const { t } = useI18n();
  const [selected, setSelected] = useState("abdomen-left");
  const lastUsed = history[0]?.site;

  const usedSites = history.map(h => h.site);
  const suggested = sites.find(s => !usedSites.includes(s.id))?.id ??
    sites.find(s => s.id !== lastUsed)?.id ?? sites[0].id;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground">{t("comp.injectionSitesTitle")}</h3>
        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
          <RotateCcw className="h-3 w-3" />
          {t("comp.rotationTracker")}
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-bio-success/8 border border-bio-success/15 p-3.5">
        <p className="text-xs font-semibold text-bio-success uppercase tracking-wider mb-0.5">{t("comp.suggestedNext")}</p>
        <p className="text-sm font-bold text-foreground">
          {t(sites.find(s => s.id === suggested)!.labelKey)}
        </p>
      </div>

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
                <span>{t(site.labelKey)}</span>
                {isLast && <span className="text-[9px] text-muted-foreground font-bold uppercase">{t("comp.last")}</span>}
                {isSuggested && !isLast && <span className="text-[9px] text-bio-success font-bold uppercase">{t("comp.next")}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t("comp.recent")}</p>
        <div className="space-y-1.5">
          {history.slice(0, 3).map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-bio-success" />
                <span className="text-foreground font-medium">{t(sites.find(s => s.id === h.site)!.labelKey)}</span>
              </div>
              <span className="text-muted-foreground">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
