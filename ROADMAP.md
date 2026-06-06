# Roadmap

The honest plan from alpha to production. Dates are targets, not promises.

## v0.1.0-alpha.0 — 2026-06-06 (current)

**Shipped.**

- npm package, Apache-2.0, manifest valid (`kind: "evidence"`)
- `/evidence today | yesterday | YYYY-MM-DD` slash command returns the Evidence Record URL
- `evidence_record` AI tool (records intent, returns `stubbed_and_disclosed`)
- `evidence_verify` / `evidence_dossier` / `evidence_replay` tool stubs (each discloses)
- CLI: `openclaw evidence setup` · `openclaw evidence status`
- `agent_end` + `before_prompt_build` hooks register and disclose on invocation
- README + STATUS.md surface the alpha state in the first screen

**Not shipped (by design).**

- No `@ghostlogic/ghostseal` import. The endpoint never signs.
- No fabricated hashes anywhere in the codebase.

## v0.2.0-alpha — target 2026-06-20

**Dependency: `ghosthash` v0.1 published to npm + PyPI.**

- Replace stub disclosure on `agent_end` with real canonical-event capture
- 5-minute wall-clock-aligned window driver + heartbeat capsule emission
- Capsule builder produces `{events, witness}` where `witness` is a `ghosthash` Merkle root + leaves
- Dead-letter queue persisted to `~/.openclaw/evidence/<container>/dead-letter/`
- `openclaw evidence verify` performs a local-only chain integrity check (no network)
- ALL stubs from v0.1 except `evidence_dossier` and `evidence_replay` light up

## v0.3.0-alpha — target 2026-06-30

**Dependency: `blackbox-v3` ingest acceptance of `{payload, witness}` envelopes + server-side `ghostseal` binding live.**

- Real POST to `api.ghostlogic.tech/api/v1/ingest`
- Receipt-id round-trip surfaced in `openclaw evidence status`
- `evidence_dossier` returns a real PDF (server-side `ghostlogic-inspector` pipeline)
- 24h burn-in soak test passes (288 capsules/day, chain unbroken)

## v0.4.0-beta — target 2026-07-15

- `evidence_replay` light-up — re-walk a session step-by-step from the sealed record
- Public verification page: `evidence.ghostlogic.tech/verify` accepts a sealed JSON download and confirms the chain against the server's published public key
- Cross-channel stitching: a day's record interleaves WhatsApp + Slack + Telegram + Discord + iMessage in one timeline

## v1.0.0 — when it's ready

- Production-grade pip + npm SDK
- Self-serve API key issuance from `console.ghostlogic.tech`
- Public docs at `docs.ghostlogic.tech/openclaw-evidence/`
- Stable wire contract, semantic version guarantees

## What this roadmap does not do

It does not promise dates we cannot keep. Each milestone names its blocking dependency. If `ghosthash` slips, v0.2 slips. We will not ship a fake `ghosthash` shim to hit a date.

It does not include features that don't fit the evidence framing. This is not a memory product. We will not add "personal knowledge graph," "AI journal," or "remembered preferences." If someone asks for them, the answer is "use Supermemory."

It does not silently drop alpha disclosures. Every released version that includes a stub will continue to surface the disclosure banner on invocation. The day a surface is real, the banner comes off — not before.
