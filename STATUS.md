# STATUS — @ghostlogic/openclaw-evidence

version: 0.1.0-alpha.0
build_state: scaffold_complete
production_state: pending_ghosthash

## Pending external dependencies

- ghosthash@npm — UNPUBLISHED — endpoint hash+merkle witness
- ghosthash@pypi — UNPUBLISHED — Python variant
- blackbox-v3 ingest acceptance of `{payload, witness}` envelopes — PENDING
- Server-side ghostseal binding — PROPRIETARY, server-only

## Wired surfaces

- npm package + LICENSE + manifest
- /evidence slash command (returns URL)
- evidence_record AI tool (records intent)
- CLI: setup, status

## Stubbed surfaces (each prints a disclosure banner on invocation)

- agent_end hook → no-op
- before_prompt_build hook → no-op
- capsule sealing → pending ghosthash
- ingest POST → not configured

## Roadmap

- 2026-06: ghosthash v0.1 publish, ingest acceptance, server seal binding, Evidence Record live render
- 2026-07: production wire-up, byte-equality cross-impl CI, public-facing dossier export

## Honest by construction

This package will never fabricate a seal. Every surface that cannot deliver a verified record refuses to act and discloses why.
