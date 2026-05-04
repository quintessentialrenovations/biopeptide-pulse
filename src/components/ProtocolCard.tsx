import { ChevronRight, Pill } from "lucide-react";
import { motion } from "framer-motion";

interface ProtocolCardProps {
  name: string;
  mechanism: string;
  startingDose: string;
  targets: string[];
  color: string;
}

export function ProtocolCard({ name, mechanism, startingDose, targets, color }: ProtocolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-card rounded-xl p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: `${color}20` }}>
            <Pill className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">Starting: {startingDose}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{mechanism}</p>
      <div className="flex flex-wrap gap-1.5">
        {targets.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-border/50 text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
