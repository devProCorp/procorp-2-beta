"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleView from "@/components/journal/ArticleView";
import RichTextEditor from "@/components/journal/RichTextEditor";
import { fetchPreviewPostById, moderatePreviewPost, triggerDeploy } from "@/lib/journal-live";
import { getFeaturedImageUrl, type WPPost } from "@/lib/wordpress-presentation";

/**
 * Pulls the blogcast audio out of content_html so it never reaches the rich
 * editor — it's DOM-based, not regex, because the audio shows up in two
 * different shapes depending on where the post came from: new n8n drafts
 * get a bare `<audio ...></audio>` tag (see publish-blog-post/index.ts),
 * while posts migrated from WordPress carry a `<style>` block plus a
 * styled `procorp-audio-container-*` wrapper div around the player.
 * Balancing that wrapper's nested tags with a regex isn't reliable; walking
 * real parsed DOM nodes is. Strips every leading node that is a <style> tag
 * or contains an <audio> element (plus the whitespace between them) and
 * stops at the first node that's neither — that's where the real,
 * user-editable body starts. Client-only (needs `document`), which is fine:
 * this only ever runs from a click handler, never during render.
 */
function splitAudio(contentHtml: string): { audioHtml: string | null; rest: string } {
  const container = document.createElement("div");
  container.innerHTML = contentHtml;

  const fixedNodes: ChildNode[] = [];
  while (container.firstChild) {
    const node = container.firstChild;
    const isStyle = node.nodeType === 1 && (node as Element).tagName === "STYLE";
    const isAudioCarrier =
      node.nodeType === 1 &&
      ((node as Element).tagName === "AUDIO" || (node as Element).querySelector("audio") !== null);
    const isWhitespaceOnly = node.nodeType === 3 && !node.textContent?.trim();

    if (isStyle || isAudioCarrier) {
      fixedNodes.push(node);
      container.removeChild(node);
    } else if (isWhitespaceOnly && fixedNodes.length > 0) {
      container.removeChild(node);
    } else {
      break;
    }
  }

  if (fixedNodes.length === 0) return { audioHtml: null, rest: contentHtml };

  const fixedContainer = document.createElement("div");
  fixedNodes.forEach((n) => fixedContainer.appendChild(n));
  return { audioHtml: fixedContainer.innerHTML, rest: container.innerHTML };
}

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Small spinner that inherits the button's text color (border-t-current). */
function Spinner() {
  return (
    <span className="inline-block w-3 h-3 rounded-full border-2 border-current/25 border-t-current animate-spin" />
  );
}

const BUTTON_BASE =
  "inline-flex items-center gap-1.5 rounded-sm font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95";

type LoadState =
  | { status: "loading" }
  | { status: "found"; post: WPPost }
  | { status: "not-found" }
  | { status: "published" }
  | { status: "trashed" };

/**
 * Internal-only draft preview + moderation: /journal/preview/?id=<wp_id>&key=<PREVIEW_SECRET>.
 * Not linked from anywhere on the site — the only way in is the exact URL.
 * preview-blog-post gates viewing (id must exist AND be status='draft');
 * moderate-blog-post gates the three actions below with the same key. This
 * page never trusts the URL by itself, it just forwards id+key and renders
 * whatever (or nothing) comes back.
 */
function PreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const key = searchParams.get("key") ?? "";

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [workingAction, setWorkingAction] = useState<"publish" | "trash" | "save" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content_html: "", excerpt_html: "" });
  const [audioHtml, setAudioHtml] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function load() {
    if (!id || !key) {
      setState({ status: "not-found" });
      return;
    }
    setState({ status: "loading" });
    fetchPreviewPostById(id, key)
      .then((post) => setState(post ? { status: "found", post } : { status: "not-found" }))
      .catch(() => setState({ status: "not-found" }));
  }

  useEffect(() => {
    // Never indexable, regardless of outcome — this route only ever exists
    // to preview and moderate unpublished content via a direct link.
    setMetaTag("robots", "noindex, nofollow");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, key]);

  function startEditing(post: WPPost) {
    const { audioHtml: extractedAudio, rest } = splitAudio(post.content.rendered);
    setAudioHtml(extractedAudio);
    setForm({
      title: post.title.rendered,
      content_html: rest,
      excerpt_html: post.excerpt.rendered,
    });
    setCurrentImageUrl(getFeaturedImageUrl(post));
    setImageFile(null);
    setActionError(null);
    setEditing(true);
  }

  async function handlePublish() {
    setActionError(null);
    setWorkingAction("publish");
    const result = await moderatePreviewPost(id, key, "publish");
    if (result.ok) {
      // Fire-and-forget: the post is already visible on /journal (live
      // fetch), this just asks GitHub Actions to redeploy so the sitemap
      // picks it up sooner. Never blocks the success screen on this.
      triggerDeploy(key);
      setState({ status: "published" });
    } else {
      setActionError(result.error);
    }
    setWorkingAction(null);
  }

  async function handleTrash() {
    if (!window.confirm("¿Mover este borrador a la papelera? Podés pedir que lo borren definitivamente después.")) {
      return;
    }
    setActionError(null);
    setWorkingAction("trash");
    const result = await moderatePreviewPost(id, key, "trash");
    setWorkingAction(null);
    if (result.ok) setState({ status: "trashed" });
    else setActionError(result.error);
  }

  async function handleSave() {
    setActionError(null);
    setWorkingAction("save");
    try {
      const image_base64 = imageFile ? await fileToBase64(imageFile) : undefined;
      const fullContentHtml = audioHtml ? `${audioHtml}\n${form.content_html}` : form.content_html;
      const result = await moderatePreviewPost(id, key, "save", {
        title: form.title,
        content_html: fullContentHtml,
        excerpt_html: form.excerpt_html,
        ...(image_base64 && { image_base64 }),
      });
      if (result.ok) {
        setEditing(false);
        load();
      } else {
        setActionError(result.error);
      }
    } finally {
      setWorkingAction(null);
    }
  }

  if (state.status === "published" || state.status === "trashed") {
    return (
      <main className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center text-white/80 font-ui">
          <p className="text-lg mb-2">
            {state.status === "published"
              ? "Publicado. Ya está visible en /journal."
              : "Movido a la papelera."}
          </p>
          <p className="text-sm text-white/50">
            {state.status === "published"
              ? "/journal lee en vivo, así que ya se ve sin esperar nada. También se disparó un redeploy de producción para que el post entre al sitemap."
              : "web/ es un export estático, pero /journal lee en vivo — el cambio ya está en la base, no hace falta redeploy."}
          </p>
        </div>
      </main>
    );
  }

  if (state.status === "found") {
    return (
      <>
        <div className="sticky top-0 z-50 bg-primary text-black font-ui">
          <div className="text-center text-xs font-bold uppercase tracking-widest py-2">
            Vista previa interna — Borrador, aún no publicado
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pb-3 px-4">
            {!editing && (
              <button
                onClick={() => startEditing(state.post)}
                disabled={workingAction !== null}
                className={`${BUTTON_BASE} px-4 py-1.5 text-xs bg-black/10 hover:bg-black/30`}
              >
                Editar
              </button>
            )}
            <button
              onClick={handlePublish}
              disabled={workingAction !== null}
              className={`${BUTTON_BASE} px-4 py-1.5 text-xs bg-black text-white hover:bg-black/70`}
            >
              {workingAction === "publish" && <Spinner />}
              {workingAction === "publish" ? "Publicando…" : "Confirmar y publicar"}
            </button>
            <button
              onClick={handleTrash}
              disabled={workingAction !== null}
              className={`${BUTTON_BASE} px-4 py-1.5 text-xs bg-black/10 hover:bg-black/30`}
            >
              {workingAction === "trash" && <Spinner />}
              {workingAction === "trash" ? "Moviendo…" : "Eliminar"}
            </button>
          </div>
          {actionError && (
            <p className="text-center text-xs text-red-900 pb-2 px-4">{actionError}</p>
          )}
        </div>

        {editing ? (
          <main className="min-h-screen bg-background-dark pt-12 pb-20 px-6">
            <div className="max-w-3xl mx-auto font-ui">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                Título
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full mb-6 bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-white"
              />

              {audioHtml && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    <span className="material-symbols-outlined text-base">graphic_eq</span>
                    Blogcast (audio) — posición fija, no editable
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: audioHtml }} />
                </div>
              )}

              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                Contenido
              </label>
              <RichTextEditor
                value={form.content_html}
                onChange={(html) => setForm((f) => ({ ...f, content_html: html }))}
              />
              <div className="mb-6" />

              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                Extracto
              </label>
              <textarea
                value={form.excerpt_html}
                onChange={(e) => setForm((f) => ({ ...f, excerpt_html: e.target.value }))}
                rows={3}
                className="w-full mb-6 bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-white"
              />

              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                Imagen destacada
              </label>
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={workingAction !== null}
                  className="group relative block w-full max-w-sm aspect-[16/10] rounded-sm border border-white/15 bg-white/5 overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {imagePreviewUrl || currentImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- object: blob preview / remote Supabase URL, next/image adds nothing here
                    <img
                      src={imagePreviewUrl ?? currentImageUrl!}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/0 group-hover:bg-black/65 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">
                      {imagePreviewUrl || currentImageUrl ? "Cambiar imagen" : "Elegir imagen"}
                    </span>
                  </div>
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-white/40">
                    {imageFile ? `${imageFile.name} — se reemplaza al guardar.` : "Clic en la imagen para cambiarla."}
                  </p>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                    >
                      Quitar selección
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={workingAction !== null}
                  className={`${BUTTON_BASE} px-6 py-2 text-xs bg-primary text-black hover:bg-primary/80`}
                >
                  {workingAction === "save" && <Spinner />}
                  {workingAction === "save" ? "Guardando…" : "Guardar cambios"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  disabled={workingAction !== null}
                  className={`${BUTTON_BASE} px-6 py-2 text-xs bg-white/10 text-white hover:bg-white/25`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </main>
        ) : (
          <ArticleView post={state.post} />
        )}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center text-white/60 font-ui">
        {state.status === "loading" ? <p>Cargando…</p> : <p>No encontrado.</p>}
      </div>
    </main>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewContent />
    </Suspense>
  );
}
