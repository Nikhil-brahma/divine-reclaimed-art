import { useState, useRef, useEffect, ElementType, ReactNode } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { toast } from "sonner";

interface Props {
  contentKey: string;
  defaultText: string;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  children?: ReactNode;
}

export default function EditableText({
  contentKey, defaultText, as: Tag = "span", className, multiline = false,
}: Props) {
  const { editMode, isEditor, getText, saveOverride } = useEditMode();
  const value = getText(contentKey, defaultText);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  if (!editMode || !isEditor) {
    return <Tag className={className}>{value}</Tag>;
  }

  const save = async () => {
    if (draft === value) { setEditing(false); return; }
    try {
      await saveOverride(contentKey, { text_value: draft });
      toast.success("Saved");
    } catch (e: any) {
      toast.error("Save failed: " + e.message);
    }
    setEditing(false);
  };

  if (editing) {
    return multiline ? (
      <textarea
        ref={ref as any}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        className={`${className ?? ""} outline outline-2 outline-yellow-400 bg-yellow-50 w-full min-h-[3em] p-1`}
      />
    ) : (
      <input
        ref={ref as any}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={e => { if (e.key === "Enter") save(); }}
        className={`${className ?? ""} outline outline-2 outline-yellow-400 bg-yellow-50 px-1`}
      />
    );
  }

  return (
    <Tag
      className={`${className ?? ""} cursor-text outline-dashed outline-1 outline-yellow-400/60 hover:outline-yellow-500`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
}
