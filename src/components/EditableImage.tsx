import { useRef, useState, ImgHTMLAttributes } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  contentKey: string;
  defaultSrc: string;
  defaultAlt: string;
}

export default function EditableImage({
  contentKey, defaultSrc, defaultAlt, className, ...rest
}: Props) {
  const { editMode, isEditor, getImage, saveOverride } = useEditMode();
  const { url, alt } = getImage(contentKey, defaultSrc, defaultAlt);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altDraft, setAltDraft] = useState(alt);

  const editable = editMode && isEditor;

  const upload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${contentKey.replace(/[^a-z0-9-]/gi, "_")}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("site-content").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("site-content").getPublicUrl(path);
      await saveOverride(contentKey, { image_url: pub.publicUrl });
      toast.success("Image updated");
    } catch (e: any) {
      toast.error("Upload failed: " + e.message);
    } finally { setUploading(false); }
  };

  const saveAlt = async () => {
    if (altDraft !== alt) {
      try { await saveOverride(contentKey, { alt_text: altDraft }); toast.success("Alt text saved"); }
      catch (e: any) { toast.error(e.message); }
    }
    setEditingAlt(false);
  };

  if (!editable) return <img src={url} alt={alt} className={className} {...rest} />;

  return (
    <div className="relative inline-block group">
      <img src={url} alt={alt} className={`${className ?? ""} outline-dashed outline-1 outline-yellow-400/60`} {...rest} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="px-3 py-1.5 bg-yellow-400 text-black text-xs font-semibold rounded shadow"
        >{uploading ? "Uploading…" : "Replace image"}</button>
        <button
          type="button"
          onClick={() => setEditingAlt(true)}
          className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded shadow flex items-center gap-1"
        ><Pencil className="w-3 h-3" /> Edit alt text</button>
      </div>
      {editingAlt && (
        <div className="absolute left-0 right-0 bottom-0 p-2 bg-white/95 border-t-2 border-yellow-400 z-10">
          <input
            value={altDraft}
            onChange={e => setAltDraft(e.target.value)}
            onBlur={saveAlt}
            onKeyDown={e => { if (e.key === "Enter") saveAlt(); }}
            placeholder="Describe the image (alt text)…"
            autoFocus
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded text-black"
          />
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </div>
  );
}
