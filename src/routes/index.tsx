import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, ArrowRight, BarChart3, Shield, Syringe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BioPeptideX — Client Progress Tracker" },
      { name: "description", content: "Professional peptide protocol tracking for Tirzepatide, Retatrutide, and performance peptides. Monitor client progress, optimize dosing, and track results." },
    ],
  }),
  component: HomePage,
});

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Progress",
    desc: "Visual weight curves comparing actual vs expected vs goal trajectories.",
  },
  {
    icon: Syringe,
    title: "Protocol Engine",
    desc: "Auto-calculated dose schedules with injection guidance and vial tracking.",
  },
  {
    icon: Shield,
    title: "Side Effect Management",
    desc: "Interactive monitoring with causes, severity scales, and action plans.",
  },
  {
    icon: Users,
    title: "Admin Control",
    desc: "CRM-style client overview with compliance alerts and protocol adjustments.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Peptide Protocol Management</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight"
          >
            Track Client Results{" "}
            <span className="text-gradient-blue">With Precision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Professional-grade tracking for Tirzepatide, Retatrutide, and performance peptides.
            Monitor progress, optimize protocols, and maximize outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/protocols">View Protocols</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 border-t border-border/30">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> BioPeptideX is for educational and tracking purposes only.
            It is not a substitute for medical advice, diagnosis, or treatment. Always consult
            with a qualified healthcare provider before starting any peptide protocol.
          </p>
        </div>
      </section>
    </div>
  );
}
