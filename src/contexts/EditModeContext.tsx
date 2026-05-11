import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type Override = {
  page_path: string;
  key: string;
  text_value: string | null;
  image_url: string | null;
  alt_text: string | null;
};

type Ctx = {
  user: User | null;
  isEditor: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  overrides: Record<string, Override>;
  getText: (key: string, fallback: string) => string;
  getImage: (key: string, fallbackUrl: string, fallbackAlt: string) => { url: string; alt: string };
  saveOverride: (key: string, patch: Partial<Override>) => Promise<void>;
  signOut: () => Promise<void>;
};

const EditModeContext = createContext<Ctx | null>(null);

const pagePath = () => {
  if (typeof window === "undefined") return "/";
  // normalize dynamic product paths to template
  const p = window.location.pathname;
  const m = p.match(/^\/(product|products)\/([^/]+)/);
  if (m) return `/products/${m[2]}`;
  return p || "/";
};

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [path, setPath] = useState(pagePath());

  // track route changes
  useEffect(() => {
    const update = () => setPath(pagePath());
    window.addEventListener("popstate", update);
    const orig = window.history.pushState;
    window.history.pushState = function (...args) {
      const r = orig.apply(this, args as any);
      update();
      return r;
    };
    return () => window.removeEventListener("popstate", update);
  }, []);

  // auth
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // editor role check
  useEffect(() => {
    if (!user) { setIsEditor(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({ data }) => {
      setIsEditor(!!data?.some(r => r.role === "admin" || r.role === "editor"));
    });
  }, [user]);

  // load overrides for current page
  const loadOverrides = useCallback(async () => {
    const { data } = await supabase
      .from("content_overrides")
      .select("page_path,key,text_value,image_url,alt_text")
      .eq("page_path", path);
    const map: Record<string, Override> = {};
    data?.forEach(o => { map[o.key] = o as Override; });
    setOverrides(map);
  }, [path]);

  useEffect(() => { loadOverrides(); }, [loadOverrides]);

  const getText = (key: string, fallback: string) =>
    overrides[key]?.text_value ?? fallback;

  const getImage = (key: string, fallbackUrl: string, fallbackAlt: string) => ({
    url: overrides[key]?.image_url ?? fallbackUrl,
    alt: overrides[key]?.alt_text ?? fallbackAlt,
  });

  const saveOverride = async (key: string, patch: Partial<Override>) => {
    const existing = overrides[key];
    const row = {
      page_path: path,
      key,
      text_value: patch.text_value ?? existing?.text_value ?? null,
      image_url: patch.image_url ?? existing?.image_url ?? null,
      alt_text: patch.alt_text ?? existing?.alt_text ?? null,
      updated_by: user?.id ?? null,
    };
    const { error } = await supabase
      .from("content_overrides")
      .upsert(row, { onConflict: "page_path,key" });
    if (error) throw error;
    setOverrides(prev => ({ ...prev, [key]: row as any }));
  };

  const signOut = async () => { await supabase.auth.signOut(); setEditMode(false); };

  return (
    <EditModeContext.Provider value={{
      user, isEditor, editMode, setEditMode, overrides,
      getText, getImage, saveOverride, signOut,
    }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be used within EditModeProvider");
  return ctx;
};
