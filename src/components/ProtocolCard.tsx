import { Pill } from "lucide-react";
import { useI18n } from "@/i18n/context";

interface ProtocolCardProps {
  name: string;
  mechanism: string;
  startingDose: string;
  targets: string[];
  color: string;
}

export function ProtocolCard({ name, mechanism, startingDose, targets, color }: ProtocolCardProps) {
  const { t } = useI18n();
  return (
    <div className="glass-card rounded-2xl p-6 card-hover cursor-pointer">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${color}15` }}>
          <Pill className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-xs font-medium text-muted-foreground">{t("proto.starting")} {startingDose}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{mechanism}</p>
      <div className="flex flex-wrap gap-1.5">
        {targets.map((target) => (
          <span
            key={target}
            className="px-3 py-1 rounded-full text-[11px] font-semibold bg-accent text-accent-foreground"
          >
            {target}
          </span>
        ))}
      </div>
    </div>
  );
}
