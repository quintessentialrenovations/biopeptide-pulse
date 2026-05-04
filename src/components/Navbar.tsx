import { Link, useLocation } from "@tanstack/react-router";
import { Activity, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

const navLinks: { to: "/" | "/dashboard" | "/consultation" | "/protocols" | "/admin"; labelKey: TranslationKey }[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/consultation", labelKey: "nav.aiDoctor" },
  { to: "/protocols", labelKey: "nav.protocols" },
  { to: "/admin", labelKey: "nav.admin" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { locale, setLocale, t } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-blue">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Bio<span className="text-gradient-blue">PeptideX</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Language Toggle */}
            <div className="ml-2 flex items-center gap-0.5 p-1 rounded-xl bg-accent border border-border">
              <button
                onClick={() => setLocale("en")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                  locale === "en"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("es")}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                  locale === "es"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ES
              </button>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            {/* Mobile language toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-accent border border-border">
              <button
                onClick={() => setLocale("en")}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-semibold transition-all",
                  locale === "en" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("es")}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-semibold transition-all",
                  locale === "es" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                )}
              >
                ES
              </button>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl hover:bg-accent text-muted-foreground"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
