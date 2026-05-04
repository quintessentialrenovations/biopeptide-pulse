import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Mail, Lock, ArrowRight, Eye, EyeOff, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/context";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — BioPeptideX" },
      { name: "description", content: "Sign in to your BioPeptideX account." },
    ],
  }),
  component: LoginPage,
});

const ADMIN_EMAIL = "rolando.aponte13@gmail.com";

function LoginPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const isAdminEmail = email.trim().toLowerCase() === ADMIN_EMAIL;

  // Redirect if already logged in
  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const validateInviteCode = async (code: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("invitation_codes")
      .select("id, active, max_uses, times_used, expires_at")
      .ilike("code", code)
      .single();

    if (error || !data) return false;
    if (!data.active) return false;
    if (data.times_used >= data.max_uses) return false;
    if (data.expires_at && new Date(data.expires_at) < new Date()) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Admin bootstrap: skip invite code for owner email
        if (!isAdminEmail) {
          if (!inviteCode.trim()) {
            throw new Error("An invitation code is required to create an account.");
          }
          const isValid = await validateInviteCode(inviteCode.trim());
          if (!isValid) {
            throw new Error("Invalid or expired invitation code. Please contact your provider.");
          }
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: isAdminEmail ? { role: "admin" } : { invite_code: inviteCode.trim() },
          },
        });
        if (signUpError) throw signUpError;

        // Consume the invitation code (skip for admin)
        if (signUpData.user && !isAdminEmail) {
          await supabase.rpc("use_invitation_code", {
            p_code: inviteCode.trim(),
            p_user_id: signUpData.user.id,
          });
        }

        setConfirmationSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSignup) {
      setError("Please use email signup with an invitation code to create your account.");
      return;
    }
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error instanceof Error ? result.error.message : "Google sign-in failed");
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center">
          <div className="h-16 w-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Check Your Email</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back to sign in.
          </p>
          <Button variant="outline" onClick={() => { setConfirmationSent(false); setIsSignup(false); }}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-blue">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Bio<span className="text-gradient-blue">PeptideX</span>
          </span>
        </Link>

        <div className="glass-card rounded-3xl p-8">
          <h1 className="text-2xl font-extrabold text-foreground text-center mb-1">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isSignup ? "Enter your invitation code to get started" : "Sign in to your dashboard"}
          </p>

          {/* Google Sign In - only for login */}
          {!isSignup && (
            <>
              <Button
                variant="outline"
                className="w-full mb-4 h-12 rounded-2xl font-semibold"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <div className="relative">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Invitation Code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="pl-10 h-12 rounded-2xl font-mono tracking-widest uppercase"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 ml-1">
                  💡 Your provider will give you this code
                </p>
              </div>
            )}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-2xl"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-2xl"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</p>
            )}

            <Button type="submit" variant="hero" className="w-full h-12 rounded-2xl" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}