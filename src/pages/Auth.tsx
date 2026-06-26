import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";



export default function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) nav("/admin", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) nav("/admin", { replace: true });
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (normalized !== ALLOWED_EMAIL) {
      toast.error("This email is not authorised.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: normalized, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
        setLoading(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: normalized, password });
        if (error) { setLoading(false); throw error; }
        toast.success("Signed in");
        // navigation handled by onAuthStateChange for instant redirect
      }
    } catch (e: any) { toast.error(e.message); setLoading(false); }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEOHead title="Sign In" description="Owner sign-in for the Punarvsu admin panel." noindex />
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-card border rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-serif">Admin Access</h1>
        <p className="text-sm text-muted-foreground">Restricted to the site owner.</p>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={4} autoComplete="current-password" />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs text-muted-foreground underline w-full text-center">
          {mode === "signin" ? "First time? Create the owner account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
