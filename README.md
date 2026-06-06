# @ghostlogic/openclaw-evidence

**Black Box for AI Agents — Verified Activity Record.**

> ## STATUS — v0.1.0-alpha.0 (2026-06-06)
> **Build state:** SCAFFOLD COMPLETE · capture pipeline PENDING.
>
> The production capture path requires `ghosthash` (endpoint hash+merkle witness, pip+npm, **unpublished**) and `ghostseal` (server-side proprietary sealing, hosted at `api.ghostlogic.tech`). Until `ghosthash` ships, this plugin is a **scaffold with honest stubs**. Nothing in this package fabricates seals or hashes.
>
> **What's wired:**
> - npm package, Apache-2.0, manifest valid (`kind: "evidence"`)
> - `/evidence today` slash command → returns the Evidence Record URL
> - `evidence_record` AI tool → records intent to capture (no-op until ghosthash)
> - `openclaw evidence setup/status` CLI → reports disclosure
>
> **What's stubbed and disclosed (every invocation prints a banner):**
> - `agent_end` hook → no-op pending ghosthash
> - Capsule build / sealing → pending ghosthash + server-side ghostseal
> - Backend ingest → not wired (would point at sandbox, not prod)
>
> **What ships next (target: end of June 2026):**
> - `ghosthash` v0.1 published to pip + npm
> - `blackbox-v3` ingest acceptance of `{payload, witness}` envelopes
> - Server-side ghostseal binding into the proprietary chain
> - Live Evidence Record rendering at `evidence.ghostlogic.tech`

## What this product is

A tamper-evident record of what your AI agent actually did. Endpoint computes a cryptographic witness (hash + merkle); server attests with a proprietary seal. The record persists even after raw payload deletion — receipts and seals survive (rule #16 of the GhostLogic v6 architecture).

## What it answers

- What actually happened?
- Can you prove it?
- Was this altered?
- Who did it?
- When did it occur?
- Can this survive a dispute?

## Install (when ghosthash ships)

```bash
openclaw plugins install @ghostlogic/openclaw-evidence
openclaw evidence setup
```

For now, the install works but the capture pipeline is the scaffold described above.

## License

Apache-2.0. Endpoint code is open by design — only the server seal is proprietary.
