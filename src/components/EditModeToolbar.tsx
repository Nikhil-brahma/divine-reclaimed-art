import { useEditMode } from "@/contexts/EditModeContext";
import { Button } from "@/components/ui/button";
import { Pencil, X, LogOut, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function EditModeToolbar() {
  const { user, isEditor, editMode, setEditMode, signOut } = useEditMode();

  if (!user) {
    return (
      <Link
        to="/auth"
        className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white text-xs px-3 py-2 rounded-full shadow-lg hover:bg-black flex items-center gap-1"
        title="Editor sign in"
      >
        <LogIn className="w-3 h-3" /> Editor
      </Link>
    );
  }

  if (!isEditor) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white text-xs px-3 py-2 rounded-full shadow-lg flex items-center gap-2">
        Signed in (no editor role)
        <button onClick={signOut}><LogOut className="w-3 h-3" /></button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black text-white px-3 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-yellow-400/60">
      <Button
        size="sm"
        variant={editMode ? "destructive" : "default"}
        onClick={() => setEditMode(!editMode)}
        className="h-8 text-xs"
      >
        {editMode ? <><X className="w-3 h-3 mr-1" /> Exit edit</> : <><Pencil className="w-3 h-3 mr-1" /> Edit page</>}
      </Button>
      <button onClick={signOut} className="text-white/70 hover:text-white" title="Sign out">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
