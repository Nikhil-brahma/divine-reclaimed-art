import { useEffect, useRef } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Global edit layer: when edit mode is ON, makes any text element or image
 * on the page click-to-edit, with no per-component wrapping required.
 *
 * Keys are derived from a stable CSS-path selector so edits persist per element.
 */

const TEXT_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "P", "SPAN", "A", "LI", "BUTTON", "LABEL",
  "STRONG", "EM", "BLOCKQUOTE", "FIGCAPTION",
  "TD", "TH", "DT", "DD", "SUMMARY", "CAPTION",
]);

// Skip elements inside these (UI chrome we should NOT make editable)
const SKIP_INSIDE = [
  "[data-no-edit]",
  ".edit-toolbar",
  "input", "textarea", "select",
  "[contenteditable='true']",
];

function buildSelector(el: Element): string {
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur.nodeType === 1 && cur.tagName !== "BODY") {
    let part = cur.tagName.toLowerCase();
    const parent = cur.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter(c => c.tagName === cur!.tagName);
      if (sameTag.length > 1) {
        const idx = sameTag.indexOf(cur) + 1;
        part += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(part);
    cur = cur.parentElement;
    if (parts.length > 8) break;
  }
  return parts.join(">");
}

function shouldSkip(el: Element): boolean {
  for (const sel of SKIP_INSIDE) {
    if (el.closest(sel)) return true;
  }
  return false;
}

function hasOwnTextContent(el: Element): boolean {
  // True if it has at least one direct text child with non-whitespace content
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3 && (node.textContent || "").trim().length > 0) return true;
  }
  return false;
}

export default function GlobalEditLayer() {
  const { editMode, isEditor, saveOverride, overrides } = useEditMode();
  const { pathname } = useLocation();
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Apply persisted overrides to the live DOM (text + image src/alt)
  useEffect(() => {
    if (!overrides) return;
    // Wait a tick so React renders first
    const t = setTimeout(() => {
      Object.entries(overrides).forEach(([key, ov]) => {
        if (!key.startsWith("auto:")) return;
        const sel = key.slice("auto:".length);
        let el: Element | null = null;
        try { el = document.querySelector(sel); } catch { return; }
        if (!el) return;
        if (el.tagName === "IMG") {
          const img = el as HTMLImageElement;
          if (ov.image_url) img.src = ov.image_url;
          if (ov.alt_text != null) img.alt = ov.alt_text;
        } else if (ov.text_value != null) {
          // Replace only direct text nodes (preserve child elements)
          let replaced = false;
          for (const node of Array.from(el.childNodes)) {
            if (node.nodeType === 3) {
              if (!replaced) { node.textContent = ov.text_value; replaced = true; }
              else node.textContent = "";
            }
          }
          if (!replaced) el.textContent = ov.text_value;
        }
      });
    }, 50);
    return () => clearTimeout(t);
  }, [overrides, pathname]);

  // Wire up edit-mode click handlers
  useEffect(() => {
    if (!editMode || !isEditor) return;

    // Inject hover styles
    const style = document.createElement("style");
    style.textContent = `
      [data-edit-hover]:hover {
        outline: 2px dashed #facc15 !important;
        outline-offset: 2px !important;
        cursor: text !important;
      }
      [data-edit-hover="img"]:hover { cursor: pointer !important; }
      [data-editing="true"] {
        outline: 2px solid #facc15 !important;
        background: rgba(254, 240, 138, 0.25) !important;
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    const annotate = () => {
      // Text elements
      document.querySelectorAll<HTMLElement>([...TEXT_TAGS].join(",")).forEach(el => {
        if (shouldSkip(el)) return;
        if (!hasOwnTextContent(el)) return;
        el.setAttribute("data-edit-hover", "text");
      });
      // Images
      document.querySelectorAll<HTMLImageElement>("img").forEach(el => {
        if (shouldSkip(el)) return;
        el.setAttribute("data-edit-hover", "img");
      });
    };

    annotate();
    const mo = new MutationObserver(() => annotate());
    mo.observe(document.body, { childList: true, subtree: true });

    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (shouldSkip(target)) return;

      // IMAGE
      if (target.tagName === "IMG") {
        e.preventDefault(); e.stopPropagation();
        const img = target as HTMLImageElement;
        const sel = buildSelector(img);
        const key = `auto:${sel}`;
        const choice = window.prompt(
          "Edit image — paste new image URL, or leave blank to only change ALT text:",
          img.src
        );
        if (choice === null) return;
        let image_url: string | undefined;
        if (choice.trim() && choice.trim() !== img.src) image_url = choice.trim();
        const newAlt = window.prompt("Alt text (for SEO & accessibility):", img.alt || "");
        if (newAlt === null) return;
        try {
          await saveOverride(key, {
            image_url: image_url ?? img.src,
            alt_text: newAlt,
          });
          if (image_url) img.src = image_url;
          img.alt = newAlt;
          toast.success("Image updated");
        } catch (err: any) { toast.error("Save failed: " + err.message); }
        return;
      }

      // TEXT
      if (TEXT_TAGS.has(target.tagName) && hasOwnTextContent(target)) {
        e.preventDefault(); e.stopPropagation();
        if (target.getAttribute("data-editing") === "true") return;
        target.setAttribute("data-editing", "true");
        target.setAttribute("contenteditable", "true");
        target.focus();
        // Select all
        const range = document.createRange();
        range.selectNodeContents(target);
        const selObj = window.getSelection();
        selObj?.removeAllRanges();
        selObj?.addRange(range);

        const original = target.innerText;
        const finish = async () => {
          target.removeAttribute("contenteditable");
          target.removeAttribute("data-editing");
          target.removeEventListener("blur", finish);
          target.removeEventListener("keydown", onKey);
          const updated = target.innerText;
          if (updated === original) return;
          try {
            const sel = buildSelector(target);
            await saveOverride(`auto:${sel}`, { text_value: updated });
            toast.success("Saved");
          } catch (err: any) {
            toast.error("Save failed: " + err.message);
            target.innerText = original;
          }
        };
        const onKey = (ev: KeyboardEvent) => {
          if (ev.key === "Escape") {
            target.innerText = original;
            target.blur();
          } else if (ev.key === "Enter" && !ev.shiftKey && target.tagName !== "P") {
            ev.preventDefault();
            target.blur();
          }
        };
        target.addEventListener("blur", finish);
        target.addEventListener("keydown", onKey);
      }
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      mo.disconnect();
      if (styleRef.current) styleRef.current.remove();
      document.querySelectorAll("[data-edit-hover]").forEach(el => el.removeAttribute("data-edit-hover"));
    };
  }, [editMode, isEditor, saveOverride]);

  return null;
}
