import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, ShieldCheck } from "lucide-react";

type RoleRow = { id: string; user_id: string; role: string; created_at: string; email?: string };

export default function EditorsManager() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [me, setMe] = useState<{ id: string; isAdmin: boolean } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("id,user_id,role,created_at")
      .order("created_at", { ascending: false });
    setRows((roles ?? []) as any);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setMe(null); return; }
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      setMe({ id: data.user.id, isAdmin: !!r?.some(x => x.role === "admin") });
    });
    load();
  }, []);

  const grant = async () => {
    if (!email.trim()) return;
    // Look up user via auth admin not available client-side. Use RPC fallback:
    // Simplest: ask admin to paste user's UUID OR use email via SECURITY DEFINER func.
    // We'll just inform the user to paste UUID if it's not a UUID.
    const isUuid = /^[0-9a-f-]{36}$/i.test(email.trim());
    if (!isUuid) {
      toast.error("Paste the user's account ID (UUID) — get it from the Users panel in Cloud.");
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: email.trim(), role });
    if (error) { toast.error(error.message); return; }
    toast.success("Role granted");
    setEmail("");
    load();
  };

  const revoke = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Revoked");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/60 p-4 bg-card/40">
        <h3 className="font-display text-lg mb-2 flex items-center gap-2"><ShieldCheck size={18} /> Grant editor / admin access</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Editors can sign in at <code>/auth</code> and inline-edit any text/image on the live site. Admins can also grant roles.
        </p>
        {!me?.isAdmin && (
          <p className="text-xs text-amber-600 mb-3">
            You are not an admin yet. Promote yourself once via the database (insert a row in <code>user_roles</code> with your user id and role <code>admin</code>), then you can grant access here.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="User account ID (UUID from Users panel)" value={email} onChange={e => setEmail(e.target.value)} />
          <select value={role} onChange={e => setRole(e.target.value as any)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={grant} disabled={!me?.isAdmin}>Grant</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 p-4 bg-card/40">
        <h3 className="font-display text-lg mb-3">Current editors</h3>
        {loading ? <div className="text-sm text-muted-foreground">Loading…</div> : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">No editors yet.</div>
        ) : (
          <ul className="divide-y divide-border/50">
            {rows.map(r => (
              <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-mono text-xs">{r.user_id}</div>
                  <div className="text-xs text-muted-foreground">{r.role} · since {new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                {me?.isAdmin && (
                  <button onClick={() => revoke(r.id)} className="text-destructive hover:opacity-70" title="Revoke">
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
