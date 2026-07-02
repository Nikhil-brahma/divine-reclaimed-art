import { useEffect, useRef, useState } from "react";
import { X, Undo2, Eraser, Save, Loader2, Paintbrush } from "lucide-react";

interface Props {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (blob: Blob) => Promise<void> | void;
}

const MAX_W = 1600;

const BlurEditor = ({ open, imageUrl, onClose, onSave }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const origRef = useRef<HTMLCanvasElement | null>(null);
  const blurRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [brush, setBrush] = useState(40);
  const [intensity, setIntensity] = useState(14);
  const [erase, setErase] = useState(false);
  const [saving, setSaving] = useState(false);
  const strokes = useRef<Array<ImageData>>([]);
  const drawing = useRef(false);
  const scale = useRef(1);

  useEffect(() => {
    if (!open) return;
    setReady(false);
    strokes.current = [];
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ratio = Math.min(1, MAX_W / img.naturalWidth);
      const w = Math.round(img.naturalWidth * ratio);
      const h = Math.round(img.naturalHeight * ratio);
      scale.current = ratio;

      const orig = document.createElement("canvas");
      orig.width = w; orig.height = h;
      orig.getContext("2d")!.drawImage(img, 0, 0, w, h);
      origRef.current = orig;

      const blur = document.createElement("canvas");
      blur.width = w; blur.height = h;
      const bctx = blur.getContext("2d")!;
      bctx.filter = `blur(${intensity}px)`;
      bctx.drawImage(img, 0, 0, w, h);
      blurRef.current = blur;

      const mask = document.createElement("canvas");
      mask.width = w; mask.height = h;
      maskRef.current = mask;

      const disp = displayRef.current!;
      disp.width = w; disp.height = h;
      render();
      setReady(true);
    };
    img.onerror = () => { alert("Could not load image (CORS?)"); onClose(); };
    img.src = imageUrl + (imageUrl.includes("?") ? "&" : "?") + "cbust=1";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, imageUrl]);

  useEffect(() => {
    // rebuild blurred layer if intensity changes
    if (!ready || !origRef.current) return;
    const orig = origRef.current;
    const blur = blurRef.current!;
    const bctx = blur.getContext("2d")!;
    bctx.clearRect(0, 0, blur.width, blur.height);
    bctx.filter = `blur(${intensity}px)`;
    bctx.drawImage(orig, 0, 0);
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensity]);

  const render = () => {
    const disp = displayRef.current;
    const orig = origRef.current;
    const blur = blurRef.current;
    const mask = maskRef.current;
    if (!disp || !orig || !blur || !mask) return;
    const ctx = disp.getContext("2d")!;
    ctx.clearRect(0, 0, disp.width, disp.height);
    ctx.drawImage(orig, 0, 0);
    // composite blurred masked area
    const tmp = document.createElement("canvas");
    tmp.width = disp.width; tmp.height = disp.height;
    const tctx = tmp.getContext("2d")!;
    tctx.drawImage(blur, 0, 0);
    tctx.globalCompositeOperation = "destination-in";
    tctx.drawImage(mask, 0, 0);
    ctx.drawImage(tmp, 0, 0);
  };

  const pos = (e: React.PointerEvent) => {
    const rect = displayRef.current!.getBoundingClientRect();
    const sx = displayRef.current!.width / rect.width;
    const sy = displayRef.current!.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy, s: sx };
  };

  const start = (e: React.PointerEvent) => {
    if (!ready) return;
    const mask = maskRef.current!;
    strokes.current.push(mask.getContext("2d")!.getImageData(0, 0, mask.width, mask.height));
    if (strokes.current.length > 20) strokes.current.shift();
    drawing.current = true;
    paint(e);
  };
  const paint = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const p = pos(e);
    const mctx = maskRef.current!.getContext("2d")!;
    mctx.globalCompositeOperation = erase ? "destination-out" : "source-over";
    mctx.fillStyle = "rgba(0,0,0,1)";
    mctx.beginPath();
    mctx.arc(p.x, p.y, brush * p.s, 0, Math.PI * 2);
    mctx.fill();
    render();
  };
  const end = () => { drawing.current = false; };
  const undo = () => {
    const prev = strokes.current.pop();
    if (!prev) return;
    const mctx = maskRef.current!.getContext("2d")!;
    mctx.putImageData(prev, 0, 0);
    render();
  };
  const clear = () => {
    const mask = maskRef.current!;
    strokes.current.push(mask.getContext("2d")!.getImageData(0, 0, mask.width, mask.height));
    mask.getContext("2d")!.clearRect(0, 0, mask.width, mask.height);
    render();
  };

  const save = async () => {
    if (!displayRef.current) return;
    setSaving(true);
    try {
      const blob: Blob = await new Promise((res, rej) =>
        displayRef.current!.toBlob((b) => (b ? res(b) : rej(new Error("blob failed"))), "image/jpeg", 0.92)
      );
      await onSave(blob);
      onClose();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card max-w-5xl w-full max-h-[90vh] rounded-2xl border border-border/40 shadow-sacred flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Paintbrush size={16} className="text-primary" />
            <h3 className="font-display text-lg">Blur brush</h3>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-2">
              Paint over anything you want to hide
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-3 border-b border-border/40 text-xs">
          <label className="flex items-center gap-2">
            Brush
            <input type="range" min={5} max={200} value={brush} onChange={(e) => setBrush(+e.target.value)} />
            <span className="w-8 text-right">{brush}</span>
          </label>
          <label className="flex items-center gap-2">
            Blur
            <input type="range" min={4} max={40} value={intensity} onChange={(e) => setIntensity(+e.target.value)} />
            <span className="w-8 text-right">{intensity}</span>
          </label>
          <button
            onClick={() => setErase((v) => !v)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border ${erase ? "bg-primary text-primary-foreground border-primary" : "border-border/60"}`}
          >
            <Eraser size={12} /> {erase ? "Erasing" : "Erase"}
          </button>
          <button onClick={undo} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/60">
            <Undo2 size={12} /> Undo
          </button>
          <button onClick={clear} className="px-3 py-1.5 rounded-full border border-border/60">Clear</button>
          <button
            onClick={save}
            disabled={saving || !ready}
            className="ml-auto inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2 font-body text-xs tracking-widest uppercase disabled:opacity-40"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save as new image
          </button>
        </div>

        <div ref={wrapRef} className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:20px_20px]">
          {!ready && <Loader2 className="animate-spin text-primary" />}
          <canvas
            ref={displayRef}
            onPointerDown={start}
            onPointerMove={paint}
            onPointerUp={end}
            onPointerLeave={end}
            style={{ maxWidth: "100%", maxHeight: "70vh", cursor: "crosshair", touchAction: "none" }}
            className={ready ? "rounded-lg shadow-lg" : "hidden"}
          />
        </div>
      </div>
    </div>
  );
};

export default BlurEditor;
