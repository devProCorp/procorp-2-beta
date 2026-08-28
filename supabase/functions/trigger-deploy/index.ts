// Supabase Edge Function (Deno) — lets n8n (or the "Confirmar y publicar"
// button on the internal draft preview) ask GitHub Actions to redeploy
// pro-corp.net, without either caller ever holding the GitHub token itself.
// See .github/workflows/deploy-produccion.yml (what GitHub actually runs)
// and web/scripts/deploy-produccion.sh (the real build+guards+rsync logic —
// the workflow only wraps it so it's callable over HTTPS).
//
// POST /trigger-deploy, header `x-publish-secret` OR `x-preview-secret` —
// whichever the caller already has is accepted: n8n already sends
// x-publish-secret to publish-blog-post, and the preview page already
// carries PREVIEW_SECRET in its URL, so no new credential needs to be
// handed to anyone for this.
const PUBLISH_SECRET = Deno.env.get("PUBLISH_SECRET");
const PREVIEW_SECRET = Deno.env.get("PREVIEW_SECRET");
const GITHUB_DEPLOY_TOKEN = Deno.env.get("GITHUB_DEPLOY_TOKEN")!;

const REPO = "devProCorp/procorp-2-beta";
const WORKFLOW = "deploy-produccion.yml";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed, use POST" }, 405);
  }

  const key = req.headers.get("x-publish-secret") ?? req.headers.get("x-preview-secret");
  if (!key || (key !== PUBLISH_SECRET && key !== PREVIEW_SECRET)) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GITHUB_DEPLOY_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "procorp-trigger-deploy",
        "content-type": "application/json",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  // workflow_dispatch returns 204 with an empty body on success — GitHub
  // never hands back a run id here, so there's nothing more specific to
  // report than "accepted".
  if (res.status !== 204) {
    const detail = await res.text();
    return jsonResponse({ error: `github dispatch failed: ${res.status} ${detail}` }, 502);
  }

  return jsonResponse({
    ok: true,
    note: "Deploy disparado — revisa la pestaña Actions del repo para ver el progreso.",
  });
});
