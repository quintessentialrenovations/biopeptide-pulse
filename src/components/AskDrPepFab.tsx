import { Link, useLocation } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";

export function AskDrPepFab() {
  const location = useLocation();
  if (location.pathname.startsWith("/consultation")) return null;

  return (
    <Link
      to="/consultation"
      aria-label="Ask Dr. Pep"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full pl-3 pr-4 py-3 gradient-blue text-white font-semibold text-sm shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-transform"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <Stethoscope className="h-4 w-4" />
      </span>
      Ask Dr. Pep
    </Link>
  );
}
