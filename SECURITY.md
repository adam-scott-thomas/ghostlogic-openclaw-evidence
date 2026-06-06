# Security

## Threat model

This package is part of a forensic evidence platform. Its job is to produce records that can survive a dispute. Our threat model assumes a determined adversary who controls one of:

| Adversary | What they can do | What we still guarantee |
|---|---|---|
| **End user (compromised endpoint)** | Modify the plugin source, suppress events, run a fork | They cannot forge a valid server seal — they don't have the sealing key. Tampering shows as a chain break or a missing-heartbeat gap. |
| **Network attacker** | Intercept, drop, or replay ingest POSTs | TLS-only egress (R-CT-1). `Idempotency-Key: batch_id` makes replays no-ops. Gaps surface as missing capsules on the Evidence Record. |
| **Compromised server operator** | Inject fake capsules into the chain | Witnesses are computed at the endpoint. A server-side fake capsule cannot produce a Merkle root that matches client-observable hashes — a downstream verifier with the published public key catches it. |
| **Lost or expired API key** | Server rejects ingest | Capsules accumulate locally in the dead-letter queue. Reissuing the key drains the queue without loss. The chain is unbroken. |
| **GDPR erasure of raw payloads** | Content goes away | The seal record and receipt persist as a cryptographic tombstone (rule #16). You can still prove an event existed without holding its content. |

We do **not** defend against:

- A compromised endpoint that runs before this plugin is installed (the agent already lied about what it did)
- A compromised server that controls both the sealing key AND the published public key (the entire chain becomes worthless — this is why the key is published and audited)
- An adversary with root on the endpoint AND the server AND the published-key infrastructure simultaneously

## What this package never does

- **It never imports `@ghostlogic/ghostseal`.** Sealing is server-side. The endpoint produces witnesses (open-source, verifiable), not signatures.
- **It never fabricates a hash.** Every hash in a shipped capsule comes from `ghosthash` over real bytes. Stub surfaces refuse to act and surface a disclosure banner; they do not invent values.
- **It never phones home except to the configured `ingestUrl`.** No telemetry, no analytics, no third-party calls.
- **It never logs raw secrets.** API keys are read once at setup and held in memory; they never appear in disclosure banners or status output.

## Reporting a vulnerability

Email `security@ghostlogic.tech` with:

- The version (`@ghostlogic/openclaw-evidence@<version>`)
- The smallest reproducer you can produce
- Whether the issue is exploitable in the current alpha state (some surfaces are stubbed; not every "this doesn't work" is a vulnerability)

We acknowledge within 48 hours. Coordinated disclosure: 90 days unless the issue is actively exploited in the wild, in which case we ship a fix as fast as we can verify.

## Public verification

When v0.3 ships, every sealed Evidence Record will be verifiable offline against the server's published ed25519 public key. The key lives at `https://ghostlogic.tech/.well-known/ghostseal/keys.json` and is rotated on the public key-issuance log audited by `ghostlogic-inspector`.

Trust the math, not the company.
