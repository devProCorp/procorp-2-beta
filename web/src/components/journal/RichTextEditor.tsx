"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RichTextEditorProps {
  /** Initial HTML — only read once, on mount (see the effect below). */
  value: string;
  onChange: (html: string) => void;
}

const BLOCKS: { label: string; tag: string; title: string }[] = [
  { label: "P", tag: "p", title: "Párrafo" },
  { label: "H1", tag: "h1", title: "Título 1" },
  { label: "H2", tag: "h2", title: "Título 2" },
  { label: "H3", tag: "h3", title: "Título 3" },
];

/**
 * Minimal Word-like WYSIWYG editor for content_html — bold/italic/lists/
 * headings/links via document.execCommand, same approach the intranet's
 * blog-agent editor uses. No new dependency: this is the one place in the
 * static export that needs rich text, so a contentEditable + toolbar beats
 * pulling in a whole editor library for one page.
 *
 * The caller is responsible for keeping anything that must never be
 * editable (the blogcast audio tag) out of `value` — this component only
 * ever touches what's handed to it.
 */
export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Set innerHTML once, on mount — never on every keystroke (onChange
    // fires from the same element), or the caret would jump on each render.
    if (ref.current && !initialized.current) {
      ref.current.innerHTML = value;
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, commandValue?: string) {
    ref.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(ref.current?.innerHTML ?? "");
  }

  function handleLink() {
    const url = window.prompt("URL del enlace:");
    if (url) exec("createLink", url);
  }

  return (
    <div className="border border-white/15 rounded-sm overflow-hidden bg-white/[0.02]">
      <div className="flex flex-wrap gap-1 bg-white/5 border-b border-white/15 p-2">
        <ToolbarButton onClick={() => exec("bold")} title="Negrita">
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} title="Cursiva">
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("underline")} title="Subrayado">
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("strikeThrough")} title="Tachado">
          <s>S</s>
        </ToolbarButton>
        <Divider />
        {BLOCKS.map((b) => (
          <ToolbarButton key={b.tag} onClick={() => exec("formatBlock", b.tag)} title={b.title}>
            {b.label}
          </ToolbarButton>
        ))}
        <Divider />
        <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Lista con viñetas">
          • Lista
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertOrderedList")} title="Lista numerada">
          1. Lista
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("formatBlock", "blockquote")} title="Cita">
          " Cita
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => exec("justifyLeft")} title="Alinear izquierda">
          ⇤
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("justifyCenter")} title="Centrar">
          ↔
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("justifyRight")} title="Alinear derecha">
          ⇥
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={handleLink} title="Insertar enlace">
          🔗
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("removeFormat")} title="Quitar formato">
          Tx
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => exec("undo")} title="Deshacer">
          ↶
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("redo")} title="Rehacer">
          ↷
        </ToolbarButton>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        className="wp-content max-w-none font-ui min-h-[360px] px-5 py-4 text-white outline-none [&_*]:text-white"
      />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-2.5 py-1 text-xs rounded-sm bg-white/5 hover:bg-white/15 text-white font-ui"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px bg-white/15 mx-1" />;
}
