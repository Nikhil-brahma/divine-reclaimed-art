import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Package, Image as ImageIcon, Eye, EyeOff, X, Upload, Sparkles } from "lucide-react";
import SmartPhotoStudio from "@/components/admin/SmartPhotoStudio";

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  sku: string | null;
  stock: number;
  category: string | null;
  tags: string[];
  images: string[];
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  weight_grams: number | null;
  parent_product_id: string | null;
  variant_label: string | null;
  updated_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const empty = {
  id: "" as string | undefined,
  handle: "",
  title: "",
  description: "",
  price: 0,
  compare_at_price: null as number | null,
  currency: "INR",
  sku: "",
  stock: 0,
  category: "",
  tags: [] as string[],
  images: [] as string[],
  status: "active",
  seo_title: "",
  seo_description: "",
  weight_grams: null as number | null,
  parent_product_id: null as string | null,
  variant_label: "",
};

const ProductsManager = () => {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [handleTouched, setHandleTouched] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [studioOpen, setStudioOpen] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList((data || []) as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);
  useEffect(() => { if (!handleTouched) setForm((f) => ({ ...f, handle: slugify(f.title) })); }, [form.title, handleTouched]);

  const openNew = () => { setForm({ ...empty }); setHandleTouched(false); setEditing(true); };
  const openEdit = (p: Product) => {
    setForm({
      id: p.id, handle: p.handle, title: p.title, description: p.description || "",
      price: p.price, compare_at_price: p.compare_at_price, currency: p.currency,
      sku: p.sku || "", stock: p.stock, category: p.category || "",
      tags: p.tags || [], images: p.images || [], status: p.status,
      seo_title: p.seo_title || "", seo_description: p.seo_description || "",
      weight_grams: p.weight_grams,
      parent_product_id: p.parent_product_id ?? null,
      variant_label: p.variant_label ?? "",
    });
    setHandleTouched(true); setEditing(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const f of files) {
      const path = `products/${Date.now()}-${slugify(f.name.replace(/\.[^.]+$/, ""))}.${f.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("site-content").upload(path, f, { upsert: false });
      if (error) { toast.error(error.message); continue; }
      const { data } = supabase.storage.from("site-content").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
    e.target.value = "";
  };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    if (!form.handle.trim()) { toast.error("Handle required"); return; }
    setSaving(true);
    const payload = {
      handle: form.handle, title: form.title, description: form.description,
      price: Number(form.price) || 0, compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      currency: form.currency, sku: form.sku || null, stock: Number(form.stock) || 0,
      category: form.category || null, tags: form.tags, images: form.images,
      status: form.status, seo_title: form.seo_title || null, seo_description: form.seo_description || null,
      weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
      parent_product_id: form.parent_product_id || null,
      variant_label: form.variant_label?.trim() ? form.variant_label.trim() : null,
    } as any;
    const q = form.id
      ? supabase.from("products").update(payload).eq("id", form.id)
      : supabase.from("products").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(form.id ? "Updated" : "Created");
    setEditing(false);
    fetchList();
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setList((l) => l.filter((x) => x.id !== p.id)); }
  };

  const toggleStatus = async (p: Product) => {
    const next = p.status === "active" ? "draft" : "active";
    const { error } = await supabase.from("products").update({ status: next }).eq("id", p.id);
    if (error) toast.error(error.message);
    else setList((l) => l.map((x) => x.id === p.id ? { ...x, status: next } : x));
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (form.tags.includes(v)) { setTagInput(""); return; }
    setForm((f) => ({ ...f, tags: [...f.tags, v] }));
    setTagInput("");
  };

  if (editing) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{form.id ? "Edit Product" : "New Product"}</h2>
          <button onClick={() => setEditing(false)} className="font-body text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <X size={14} /> Cancel
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Handle (URL slug) *</label>
            <input value={form.handle} onChange={(e) => { setHandleTouched(true); setForm({ ...form, handle: slugify(e.target.value) }); }}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Price (in {form.currency})</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Compare-at Price (optional)</label>
            <input type="number" min="0" value={form.compare_at_price ?? ""} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value ? Number(e.target.value) : null })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Stock</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Potli / Lite / Classic / Premium"
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Weight (grams)</label>
            <input type="number" min="0" value={form.weight_grams ?? ""} onChange={(e) => setForm({ ...form, weight_grams: e.target.value ? Number(e.target.value) : null })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>

          <div className="sm:col-span-2 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-primary">Similar Edition (variant)</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1">
                Use this when a product is basically the <em>same design</em> as another product but with a small difference — a bulk / bigger size, slightly different cloth, or a subtle touch. On the site, this product will be hidden from the main collection grid and shown as a variant on the parent product's page (like colour swatches on other stores).
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Variant of (parent product)</label>
                <select
                  value={form.parent_product_id ?? ""}
                  onChange={(e) => setForm({ ...form, parent_product_id: e.target.value || null })}
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                >
                  <option value="">— None (this is a standalone product) —</option>
                  {list
                    .filter((p) => p.id !== form.id && !p.parent_product_id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">Variant label</label>
                <input
                  value={form.variant_label}
                  onChange={(e) => setForm({ ...form, variant_label: e.target.value })}
                  placeholder="e.g. Bulk size, Slightly larger, Alt cloth"
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full h-32 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none resize-y" />
          </div>

          <div className="sm:col-span-2">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Tags</label>
            <div className="flex gap-2 mt-1">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Press enter to add"
                className="flex-1 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
              <button onClick={addTag} className="px-4 rounded-xl border border-primary text-primary font-body text-xs uppercase">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {t}
                    <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Images</label>
            <div className="mt-1 flex flex-wrap gap-3">
              {form.images.map((url) => (
                <div key={url} className="relative group">
                  <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg border border-border/50" />
                  <button onClick={() => setForm((f) => ({ ...f, images: f.images.filter((x) => x !== url) }))}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 inline-flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary text-muted-foreground text-[10px]">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                <span>{uploading ? "Uploading" : "Upload"}</span>
                <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="w-24 h-24 rounded-lg border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 flex flex-col items-center justify-center gap-1 text-primary text-[10px]"
              >
                <Sparkles size={20} />
                <span>Smart Studio</span>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              <Sparkles size={10} className="inline" /> Smart Studio turns one raw photo into a regal hero shot, 4 angles, and a 360° spin powered by Sacred AI.
            </p>
          </div>

          <SmartPhotoStudio
            open={studioOpen}
            productId={form.id}
            productHandle={form.handle}
            onClose={() => setStudioOpen(false)}
            onApply={(urls) => setForm((f) => ({ ...f, images: [...f.images, ...urls.filter((u) => !f.images.includes(u))] }))}
          />

          <div className="sm:col-span-2">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">SEO Title</label>
            <input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">SEO Description</label>
            <textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
              className="mt-1 w-full h-20 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none resize-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-8 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
            {form.id ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl">Products ({list.length})</h2>
        <button onClick={openNew} className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90">
          <Plus size={14} /> New Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No products yet. Create your first one — you're now independent of Shopify.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((p) => (
            <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt={p.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={20} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-base truncate">{p.title}</h3>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${p.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {p.status}
                  </span>
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  ₹{p.price} {p.compare_at_price ? <span className="line-through ml-1">₹{p.compare_at_price}</span> : null} · Stock: {p.stock} · /{p.handle}
                </p>
                {p.category && <p className="font-body text-[10px] text-muted-foreground/70 mt-0.5">{p.category}</p>}
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="font-body text-[11px] uppercase tracking-wider text-primary hover:underline px-2 py-1">Edit</button>
                <button onClick={() => toggleStatus(p)} className="font-body text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-2 py-1">
                  {p.status === "active" ? <><EyeOff size={11} /> Draft</> : <><Eye size={11} /> Activate</>}
                </button>
                <button onClick={() => remove(p)} className="font-body text-[11px] uppercase tracking-wider text-destructive hover:underline inline-flex items-center gap-1 px-2 py-1">
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
