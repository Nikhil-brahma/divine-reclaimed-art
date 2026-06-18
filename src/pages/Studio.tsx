import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, Upload, RotateCw, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

type Style = "regal-ivory" | "temple-black" | "marigold-festival";

const STYLES: { id: Style; label: string; swatch: string }[] = [
  { id: "regal-ivory", label: "Regal Ivory", swatch: "linear-gradient(135deg,#FAF3E3,#e6c97a)" },
  { id: "temple-black", label: "Temple Black", swatch: "linear-gradient(135deg,#1a1a1a,#c9a84c)" },
  { id: "marigold-festival", label: "Marigold Festival", swatch: "linear-gradient(135deg,#ffb84d,#8b0000)" },
];

const fileToDataUrl = (f: File): Promise<string> =>
  new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(f); });

const SLOTS = [
  { id: "primary", label: "Front" },
  { id: "back", label: "Back" },
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
  { id: "top", label: "Top" },
];

const StudioPage = () => {
  const [sources, setSources] = useState<Record<string, string>>({});
  const [style, setStyle] = useState<Style>("regal-ivory");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ hero?: string; angles?: string[]; spin?: string[] } | null>(null);
  const [hp, setHp] = useState("");
  const [spinFrame, setSpinFrame] = useState(0);

  const orderedSources = (): string[] =>
    SLOTS.map((s) => sources[s.id]).filter(Boolean) as string[];

  const handleFile = async (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { toast.error("Image must be under 8 MB"); return; }
    setSources((s) => ({ ...s, [slot]: await fileToDataUrl(f) }));
    setResult(null);
  };

  const run = async () => {
    const imgs = orderedSources();
    if (imgs.length === 0) { toast.error("Upload at least one product photo"); return; }
    if (hp) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-product-image", {
        body: { mode: "demo", source_images: imgs, style, include_spin: true, include_angles: true },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult(data as any);
      toast.success("Your sacred preview is ready ✨");
    } catch (e: any) {
      toast.error(e?.message || "Generation failed. Please try again later.");
    } finally {
      setBusy(false);
    }
  };

  // Animate spin frames if available
  const spin = result?.spin || [];
  const currentSpinImg = spin.length ? spin[spinFrame % spin.length] : null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Smart Photo Studio — Turn one product photo into a brand-grade gallery | Punarvsu"
        description="Upload a single product photo and watch our Sacred AI render a regal hero shot, multiple angles, and a 360° spin preview — instantly."
        canonical="https://punarvsu.com/studio"
      />
      <Navbar />

      <main className="pt-28 pb-24">
        <section className="max-w-5xl mx-auto px-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Sparkles size={12} className="text-primary" />
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-primary">Sacred AI Studio · Free preview</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4 leading-tight">
            One photo in.<br/>
            <span className="text-primary">A brand-grade gallery out.</span>
          </h1>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            Drop a simple product photo. Our Sacred AI re-renders it as a regal hero shot, four angle views,
            and an interactive 360° spin — in Punarvsu's signature aesthetic. No design team needed.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-[320px,1fr] gap-6">
          {/* Glass control panel */}
          <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-5 space-y-5 shadow-sm h-fit sticky top-24">
            <div>
              <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">1. Your product photo</label>
              <label className="mt-2 block aspect-square rounded-xl border-2 border-dashed border-border/60 hover:border-primary cursor-pointer overflow-hidden bg-muted/20 relative">
                {source ? (
                  <img src={source} alt="source" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Upload size={28} />
                    <span className="text-xs font-body">Drop or tap to upload</span>
                    <span className="text-[10px]">Max 8 MB</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div>
              <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">2. Choose a style</label>
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

            {/* Honeypot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <button
              onClick={run}
              disabled={busy || !source}
              className="w-full bg-gradient-saffron text-primary-foreground rounded-full py-3 font-body text-xs tracking-[0.2em] uppercase inline-flex items-center justify-center gap-2 disabled:opacity-40 shadow-sacred"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {busy ? "Sanctifying..." : "Generate sacred gallery"}
            </button>

            <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
              Preview only — images are not saved. Limited to 5 generations per hour per visitor.
            </p>
          </div>

          {/* Results canvas */}
          <div className="space-y-5">
            {!result && !busy && (
              <div className="aspect-[4/3] rounded-2xl border border-white/60 bg-white/30 backdrop-blur-xl flex items-center justify-center text-center text-muted-foreground p-10">
                <div>
                  <Sparkles size={36} className="mx-auto mb-3 text-primary/60" />
                  <p className="font-display text-xl text-foreground mb-1">Your gallery will bloom here</p>
                  <p className="font-body text-sm">Hero shot, four angles, and a 360° spin — generated in 30 to 90 seconds.</p>
                </div>
              </div>
            )}
            {busy && (
              <div className="aspect-[4/3] rounded-2xl border border-white/60 bg-white/30 backdrop-blur-xl flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 size={36} className="animate-spin text-primary" />
                <p className="font-display text-lg text-foreground">Crafting your sacred imagery</p>
                <p className="font-body text-xs uppercase tracking-widest">30 to 90 seconds</p>
              </div>
            )}
            {result?.hero && (
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Hero</p>
                <div className="rounded-2xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl">
                  <img src={result.hero} alt="hero" className="w-full aspect-[4/3] object-cover" />
                </div>
              </div>
            )}
            {result?.angles && result.angles.length > 0 && (
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Angle shots</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.angles.map((u, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl">
                      <img src={u} alt={`angle ${i}`} className="w-full aspect-square object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentSpinImg && (
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2 inline-flex items-center gap-1">
                  <RotateCw size={10} /> 360° spin — hover or drag
                </p>
                <div
                  className="rounded-2xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl aspect-square max-w-md mx-auto cursor-grab active:cursor-grabbing"
                  onMouseMove={(e) => {
                    if (!spin.length) return;
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width;
                    setSpinFrame(Math.floor(x * spin.length) % spin.length);
                  }}
                >
                  <img src={currentSpinImg} alt="spin" className="w-full h-full object-cover" draggable={false} />
                </div>
              </div>
            )}

            {result && (
              <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 text-center">
                <h2 className="font-display text-2xl text-foreground mb-2">Want this for your own store?</h2>
                <p className="font-body text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Punarvsu can transform your full product catalog with this same Sacred AI pipeline.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-body text-xs tracking-[0.2em] uppercase shadow-sacred"
                >
                  <Mail size={14} /> Get in touch
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudioPage;
