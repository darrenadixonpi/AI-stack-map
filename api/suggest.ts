/**
 * Vercel Edge Function: create a GitHub issue from an in-app suggestion.
 *
 * The GitHub token lives only here (server-side) — never in the client bundle.
 * Set these in the Vercel project (Settings → Environment Variables):
 *   GITHUB_TOKEN  — fine-grained PAT (or GitHub App token) with Issues: write on the repo
 *   GITHUB_REPO   — "owner/repo" (optional; defaults below)
 *   SUGGEST_LABEL — issue label (optional; defaults to "content")
 *   TURNSTILE_SECRET_KEY     — Cloudflare Turnstile secret (optional; enables captcha)
 *   UPSTASH_REDIS_REST_URL   — Upstash Redis REST URL (optional; enables durable rate limit)
 *   UPSTASH_REDIS_REST_TOKEN — Upstash Redis REST token (optional)
 *
 * Spam control: honeypot + length caps + Cloudflare Turnstile (when configured)
 * + a per-IP rate limit (durable via Upstash when configured, else in-memory).
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const config = { runtime: 'edge' }

// Vercel injects env vars on `process.env` at runtime. Declare it for the
// type-checker so we don't need @types/node (Edge isn't Node, and the app build
// shouldn't pull in Node globals). Module-scoped — does not affect src/.
declare const process: { env: Record<string, string | undefined> }

const REPO = process.env.GITHUB_REPO ?? 'darrenadixonpi/AI-stack-map'
const LABEL = process.env.SUGGEST_LABEL ?? 'content'
const MIN_LEN = 10
const MAX_LEN = 5000

// Best-effort throttle within a warm isolate (not a substitute for a real
// rate limiter, but raises the cost of casual abuse alongside the honeypot).
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function tooMany(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

// Durable per-IP rate limit via Upstash Redis when configured (else in-memory).
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(MAX_PER_WINDOW, '10 m'),
        prefix: 'suggest',
      })
    : null

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY

async function passesTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true // captcha not configured → skip
  const form = new URLSearchParams()
  form.set('secret', TURNSTILE_SECRET)
  form.set('response', token)
  if (ip !== 'unknown') form.set('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  const result = (await res.json().catch(() => ({}))) as { success?: boolean }
  return result.success === true
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.slice(0, max) : ''
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const token = process.env.GITHUB_TOKEN
  if (!token) return json({ error: 'not_configured' }, 501)

  let payload: Record<string, unknown>
  try {
    payload = (await req.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  // Honeypot — bots fill hidden fields. Pretend success and drop silently.
  if (str(payload.website, 200).trim() !== '') return json({ ok: true, skipped: true })

  const suggestion = str(payload.suggestion, MAX_LEN + 1).trim()
  if (suggestion.length < MIN_LEN) return json({ error: 'too_short' }, 400)
  if (suggestion.length > MAX_LEN) return json({ error: 'too_long' }, 400)

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || 'unknown'

  // Captcha (Cloudflare Turnstile) when configured
  if (!(await passesTurnstile(str(payload.turnstileToken, 2048), ip))) {
    return json({ error: 'captcha_failed' }, 403)
  }

  // Rate limit: durable (Upstash) when configured, else best-effort in-memory
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip)
    if (!success) return json({ error: 'rate_limited' }, 429)
  } else if (tooMany(ip)) {
    return json({ error: 'rate_limited' }, 429)
  }

  const section = str(payload.section, 80) || 'General'
  const topicName = str(payload.topicName, 80)
  const topicId = str(payload.topicId, 80)
  const pageUrl = str(payload.pageUrl, 300)

  const title = `[Suggestion] ${section}${topicName ? `: ${topicName}` : ''}`
  const body = [
    '## Suggestion',
    suggestion,
    '',
    '## Context',
    `- Section: ${section}`,
    topicName ? `- Topic: ${topicName}${topicId ? ` (\`${topicId}\`)` : ''}` : '',
    pageUrl ? `- Page: ${pageUrl}` : '',
    '',
    '---',
    '_Filed automatically from the AI Stack Map suggest-an-edit box._',
  ]
    .filter(Boolean)
    .join('\n')

  const ghRes = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      'user-agent': 'ai-stack-map-suggest',
    },
    body: JSON.stringify({ title, body, labels: [LABEL] }),
  })

  if (!ghRes.ok) {
    const detail = await ghRes.text().catch(() => '')
    return json({ error: 'github_error', status: ghRes.status, detail: detail.slice(0, 300) }, 502)
  }

  const issue = (await ghRes.json()) as { html_url?: string; number?: number }
  return json({ ok: true, url: issue.html_url, number: issue.number })
}
