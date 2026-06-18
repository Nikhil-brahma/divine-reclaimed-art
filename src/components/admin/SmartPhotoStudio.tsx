import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Upload, X, Check, RotateCw } from "lucide-react";

interface Props {
  productId?: string;
  productHandle?: string;
  open: boolean;
  onClose: () => void;
  onApply: (imageUrls: string[]) => void;
}

type Style = "regal-ivory" | "temple-black" | "marigold-festival";

const STYLES: { id: Style; label: string; swatch: string }[] = [
  { id: "regal-ivory", label: "Regal Ivory", swatch: "linear-gradient(135deg,#FAF3E3,#e6c97a)" },
  { id: "temple-black", label: "Temple Black", swatch: "linear-gradient(135deg,#1a1a1a,#c9a84c)" },
  { id: "marigold-festival", label: "Marigold Festival", swatch: "linear-gradient(135deg,#ffb84d,#8b0000)" },
];

const fileToDataUrl = (f: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(f);
  });

const SLOTS: { id: string; label: string }[] = [
  { id: "primary", label: "Front (primary)" },
  { id: "back", label: "Back" },
  { id: "left", label: "Left side" },
  { id: "right", label: "Right side" },
  { id: "top", label: "Top / detail" },
];

const SmartPhotoStudio = ({ productId, productHandle, open, onClose, onApply }: Props) => {
  const [sources, setSources] = useState<Record<string, string>>({});
  const [style, setStyle] = useState<Style>("regal-ivory");
  const [includeSpin, setIncludeSpin] = useState(true);
  const [includeAngles, setIncludeAngles] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ hero?: string; angles?: string[]; spin?: string[] } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const reset = () => { setSources({}); setResult(null); setSelected(new Set()); };

  const orderedSources = (): string[] =>
    SLOTS.map((s) => sources[s.id]).filter(Boolean) as string[];

  const handleFile = async (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { toast.error("Image must be under 8 MB"); return; }
    const url = await fileToDataUrl(f);
    setSources((s) => ({ ...s, [slot]: url }));
    setResult(null);
  };

  const run = async () => {
    const imgs = orderedSources();
    if (imgs.length === 0) { toast.error("Upload at least one product photo"); return; }
    if (!productId) { toast.error("Save the product first, then enhance its photo"); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-product-image", {
        body: {
          mode: "save",
          source_images: imgs,
          style,
          include_spin: includeSpin,
          include_angles: includeAngles,
          product_id: productId,
          product_handle: productHandle || "untitled",
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const r = data as { hero: string; angles: string[]; spin: string[] };
      setResult(r);
      setSelected(new Set([r.hero]));
      toast.success(`Sacred shots ready from ${imgs.length} reference photo${imgs.length > 1 ? "s" : ""} ✨`);
    } catch (e: any) {
      toast.error(e?.message || "Generation failed");
    } finally {
      setBusy(false);
    }
  };

  const toggle = (url: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  };

  const apply = () => {
    onApply(Array.from(selected));
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card max-w-5xl w-full rounded-2xl border border-border/40 shadow-sacred my-8">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={18} />
            <h2 className="font-display text-xl">Smart Photo Studio</h2>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-2">AI-enhanced product imagery</span>
          </div>
          <button onClick={() => { reset(); onClose(); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        <div className="p-5 grid md:grid-cols-[280px,1fr] gap-5">
          {/* Controls */}
          <div className="space-y-5">
            <div>
              <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Reference photos (up to 5 sides)</label>
              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                Add as many sides as you have — the AI uses all of them to understand the product's true 3D form.
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SLOTS.map((slot) => (
                  <label
                    key={slot.id}
                    className="aspect-square rounded-lg border-2 border-dashed border-border/60 hover:border-primary cursor-pointer overflow-hidden bg-muted/30 relative flex flex-col items-center justify-center gap-1 text-[9px] text-muted-foreground text-center px-1"
                  >
                    {sources[slot.id] ? (
                      <>
                        <img src={sources[slot.id]} alt={slot.label} className="absolute inset-0 w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setSources((s) => { const n = { ...s }; delete n[slot.id]; return n; }); }}
                          className="absolute top-1 right-1 z-10 bg-black/60 text-white rounded-full w-5 h-5 inline-flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                        <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] py-0.5">{slot.label}</span>
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>{slot.label}</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFile(slot.id, e)} className="hidden" />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">Style</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-lg p-2 border text-[10px] font-body ${style === s.id ? "border-primary ring-2 ring-primary/30" : "border-border/50 hover:border-border"}`}
                  >
                    <div className="aspect-square rounded mb-1" style={{ background: s.swatch }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs font-body">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeAngles} onChange={(e) => setIncludeAngles(e.target.checked)} />
                Generate 4 angle shots
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeSpin} onChange={(e) => setIncludeSpin(e.target.checked)} />
                <RotateCw size={12} /> Generate 360° spin (8 frames)
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                More reference angles = better 360° consistency. Skip the spin to save credits and time.
              </p>
            </div>

            <button
              onClick={run}
              disabled={busy || orderedSources().length === 0 || !productId}
              className="w-full bg-gradient-saffron text-primary-foreground rounded-full py-3 font-body text-xs tracking-[0.2em] uppercase inline-flex items-center justify-center gap-2 disabled:opacity-40 shadow-sacred"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {busy ? "Sanctifying..." : `Enhance with AI (${orderedSources().length} ref)`}
            </button>
            {!productId && (
              <p className="text-[10px] text-amber-700">Save the product (title + handle) once, then return here to enhance its photo.</p>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            {!result && !busy && (
              <div className="aspect-[16/10] rounded-xl border border-border/40 bg-muted/20 flex items-center justify-center text-center text-muted-foreground p-8">
                <div>
                  <Sparkles size={28} className="mx-auto mb-2 text-primary/60" />
                  <p className="font-body text-sm">Upload one or more side photos on the left.<br/>The studio will craft a hero shot, four angle shots, and an optional 360° spin in Punarvsu's regal aesthetic.</p>
                </div>
              </div>
            )}
            {busy && (
              <div className="aspect-[16/10] rounded-xl border border-border/40 bg-muted/20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 size={28} className="animate-spin text-primary" />
                <p className="font-body text-xs uppercase tracking-widest">Generating sacred imagery — may take 30–90 seconds</p>
              </div>
            )}
            {result && (
              <>
                {result.hero && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Hero</p>
                    <FrameTile url={result.hero} selected={selected.has(result.hero)} onToggle={() => toggle(result.hero!)} large />
                  </div>
                )}
                {result.angles && result.angles.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Angles</p>
                    <div className="grid grid-cols-4 gap-2">
                      {result.angles.map((u) => <FrameTile key={u} url={u} selected={selected.has(u)} onToggle={() => toggle(u)} />)}
                    </div>
                  </div>
                )}
                {result.spin && result.spin.length > 0 && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1 inline-flex items-center gap-1">
                      <RotateCw size={10} /> 360° spin — saved with the product
                    </p>
                    <div className="grid grid-cols-8 gap-1">
                      {result.spin.map((u) => <img key={u} src={u} alt="" className="aspect-square object-cover rounded border border-border/40" />)}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Spin frames auto-save with the product — they power the hover-to-spin preview on the storefront.</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <p className="text-xs text-muted-foreground">{selected.size} image(s) selected to add to the product gallery</p>
                  <button
                    onClick={apply}
                    disabled={selected.size === 0}
                    className="bg-primary text-primary-foreground rounded-full px-5 py-2 font-body text-xs tracking-[0.2em] uppercase inline-flex items-center gap-2 disabled:opacity-40"
                  >
                    <Check size={14} /> Apply to product
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FrameTile = ({ url, selected, onToggle, large }: { url: string; selected: boolean; onToggle: () => void; large?: boolean }) => (
  <button
    onClick={onToggle}
    className={`relative ${large ? "aspect-[16/10]" : "aspect-square"} w-full rounded-lg overflow-hidden border-2 transition-all ${selected ? "border-primary ring-2 ring-primary/30" : "border-border/40 hover:border-border"}`}
  >
    <img src={url} alt="" className="w-full h-full object-cover" />
    {selected && (
      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <Check size={14} />
      </div>
    )}
  </button>
);

export default SmartPhotoStudio;
