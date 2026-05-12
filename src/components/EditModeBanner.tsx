import { useEditMode } from "@/contexts/EditModeContext";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

export default function EditModeBanner() {
  const { editMode, setEditMode } = useEditMode();
  const { pathname } = useLocation();
  // Don't show on the dashboard itself (already controlled there)
  if (!editMode || pathname.startsWith("/seo-dashboard")) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-2 rounded-full bg-yellow-400 text-black shadow-2xl border border-yellow-600 animate-in fade-in slide-in-from-bottom-4">
      <span className="text-xs font-semibold tracking-wider uppercase">
        ✎ Edit Mode — click any text or image
      </span>
      <button
        onClick={() => setEditMode(false)}
        className="rounded-full hover:bg-black/10 p-1"
        title="Disable edit mode"
      >
        <X size={14} />
      </button>
    </div>
  );
}
