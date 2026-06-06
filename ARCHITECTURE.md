# Architecture

This plugin is one box in the GhostLogic forensic pipeline. The pipeline is five stages, the same as logicd (the Python production agent) and the planned Node agent:

```
   ENDPOINT (this plugin)                  SERVER (api.ghostlogic.tech)
   ─────────────────────────               ─────────────────────────────
   capture → witness → ship       ──▶      receive → seal → store → analyze
        ↑                                       ↓
   OpenClaw hooks                          ghostseal (proprietary)
   (agent_end, before_prompt_build)        ghostlogic-inspector (8-pass)
```

## The five stages

| # | Stage | Where | What |
|---|---|---|---|
| ① | **Capture** | this plugin | Hook OpenClaw's `agent_end` + `before_prompt_build`. Buffer canonical events with `captured_at_ns` precision. |
| ② | **Witness** | this plugin (via `ghosthash`, pending) | Hash each event, build a Merkle tree per 5-min window. Endpoint produces a witness, never a seal. |
| ③ | **Ship** | this plugin | POST `{payload, witness}` to `api.ghostlogic.tech/api/v1/ingest`, `Authorization: Bearer gl_agent_*`, `Idempotency-Key: batch_id`. |
| ④ | **Seal** | server (proprietary) | `ghostseal` binds the witness into a chained, ed25519-signed capsule. Receipt persists separately and survives capsule deletion. |
| ⑤ | **Analyze** | server (`ghostlogic-inspector`) | 8-pass forensic pipeline → reports, affidavits, PDFs. Surfaces as the Evidence Record at `evidence.ghostlogic.tech`. |

This plugin owns ①–③. ④ and ⑤ are the server's job.

## Why witness here, seal there

Forensic chain of custody starts at collection (witness) and gets formal attestation at the lab (seal). The same shape applies here:

- **Endpoint witness (`ghosthash`)** is open-source, pure, and verifiable by anyone with the package. It proves "I saw this happen, and here is its hash."
- **Server seal (`ghostseal`)** is proprietary, hosted, and binds the witness into a tamper-evident chain with a key the endpoint never sees.
- An attacker who reverse-engineers the endpoint cannot forge a chain — they don't have the sealing key.
- An attacker who compromises the server cannot mint witnesses that match endpoint logs — Merkle proofs anchor in client-observable hashes.

This is why `ghostseal` does not ship in this package's `node_modules`. It is intentionally absent.

## The capsule

A capsule is the unit of evidence — one 5-minute window of activity, sealed once, immutable thereafter:

```json
{
  "batch_id": "uuid5(NAMESPACE_URL, 'openclaw:<container>:<window_start_iso>')",
  "container_tag": "openclaw_<install_id>",
  "window_start": "2026-06-06T14:05:00.000Z",
  "chain_predecessor": "<content_sha256 of previous capsule>",
  "events": [
    {
      "event_id": "<uuid4>",
      "event_schema_version": "openclaw.evidence.v1",
      "captured_at_ns": "1717689600000000000",
      "impl_id": "openclaw-evidence",
      "payload": {
        "channel": "whatsapp",
        "actor": { "id": "...", "display_name": "..." },
        "user_message": { "text": "...", "attachments_summary": "..." },
        "ai_response": { "text": "...", "model": "...", "tokens": 1234, "latency_ms": 230 },
        "tool_calls": [ { "name": "...", "args_redacted": {}, "result_summary": "...", "latency_ms": 12 } ]
      }
    }
  ],
  "witness": {
    "leaves": ["<sha256 per event>", "..."],
    "merkle_root": "<sha256>",
    "algorithm": "ghosthash@v1"
  }
}
```

288 capsules per day per container. Empty windows still emit a heartbeat capsule (`event_schema_version: "openclaw.heartbeat.v1"`) so coverage gaps are themselves provable, not silent.

## Hook surface

OpenClaw emits events at plugin lifecycle points. This plugin uses two:

| Hook | When | What we do |
|---|---|---|
| `before_prompt_build` | Just before each LLM turn | Mark the turn's start time + context size in the buffer. Lightweight; no payload capture yet. |
| `agent_end` | After each LLM turn completes | Push the full canonical event (user message + AI response + tool calls + latencies) into the buffer. |

A wall-clock-aligned timer fires every 5 minutes (00:00, 00:05, 00:10, … UTC). The timer drains the buffer into a capsule, computes the witness, and ships it.

If shipping fails (4xx / 5xx / network), the capsule lands in `~/.openclaw/evidence/<container>/dead-letter/<batch_id>.json`. The next successful tick replays from the dead-letter directory before draining the new window. Capsules are never dropped.

## Rules this plugin obeys

These are architectural invariants from the GhostLogic v6 boundary diagram and the platform spec:

- **Rule #14 — billing never blocks collection.** Capture runs regardless of payment state. The gate sits on the Evidence Record consumer (results), not the producer (capture).
- **Rule #16 — seals survive deletion.** Even after GDPR erasure of raw payloads, the receipt and seal persist as a cryptographic tombstone.
- **Rule #8 — endpoint never imports seal SDK.** This plugin does not ship `ghostseal`. Sealing is the server's job.
- **R-HB — heartbeat sentinels.** Empty 5-min windows still emit a capsule. "No activity" is proof, not a gap.
- **R5 — `captured_at_ns` with microsecond precision.** Never `utcnow()`. Time is evidence.
- **R7 — `batch_id = uuid5(NAMESPACE_URL, ...)`.** Deterministic, idempotent, dedup-safe.

## Where this fits in `server-v6.0`

The plugin appears on Page 2 (Repo / Container Boundary Map) of the GhostLogic v6 architecture diagram as a new client-agent box. It joins:

- `ghostlogic-agent-watchdog` (logicd, Python, production, ships from HP_Envy)
- `ghostlogic-agent-watchdog-node` (Node agent, alpha)
- this plugin (OpenClaw agent, alpha)

All three are clients of the same `api.ghostlogic.tech` ingest surface, all three use the same canonical envelope shape (with their own `impl_id`), all three are wire-compatible.

The Evidence Record web page (`evidence.ghostlogic.tech/openclaw/{container}/{date}`) is a Cloudflare Worker that proxies the server-side daily rollup endpoint and renders four tabs over one sealed source:

- **Timeline** — 288-cell grid, one per 5-min window.
- **Tale** — LLM-stitched narrative, every paragraph anchored to its citing capsules.
- **Dossier** — exportable PDF with chain-of-custody (server's `ghostlogic-inspector` pipeline).
- **Raw** — sealed JSON download, verifiable offline against the server's published public key.

## What is alpha

See [STATUS.md](./STATUS.md) for the exact pending boundary. Short version: capture pipeline (stages ① and ③) is wired but the witness step (②) waits on `ghosthash` publication. Until then, every endpoint surface that would produce a witness self-discloses as a stub.
