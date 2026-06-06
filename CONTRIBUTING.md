# Contributing

Open to contributions. The package is Apache-2.0 by design — the endpoint surface is meant to be public, auditable, and forkable. The only proprietary piece (`ghostseal`) lives server-side.

## Ground rules

1. **Honesty by construction.** Every surface that doesn't yet work prints a disclosure banner on invocation and is named in `STATUS.md`. New stubs MUST follow this pattern — silent stubs are not accepted. See `disclosure.ts` for the helper.
2. **No client-side seal.** Do not add `@ghostlogic/ghostseal` to `package.json`. Do not fabricate hashes. If you need a witness, use `ghosthash` (pending publication).
3. **Evidence framing, not memory framing.** This is a forensic product. PRs that introduce "remember," "recall," "journal," "personal knowledge," or similar language will be asked to use evidence vocabulary instead. See `README.md` and the GhostLogic spec for the canonical terms.
4. **TDD when reasonable.** New behavior comes with a test. New stubs come with a test that confirms the stub discloses.

## Local development

```bash
git clone https://github.com/adam-scott-thomas/ghostlogic-openclaw-evidence
cd ghostlogic-openclaw-evidence
npm install
npm test
npm run typecheck
npm run lint
```

Strict TypeScript (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`). Biome for format + lint. Vitest for tests on Node 20 + 22.

## Commit hygiene

- One logical change per commit. Investors and auditors read commit history.
- Conventional commits: `feat:` · `fix:` · `chore:` · `docs:` · `test:` · `ci:` · `polish:`.
- Co-author tag is fine if an AI assistant helped.
- Push after every commit. Don't sit on local changes.

## Scope

In scope:

- Endpoint capture + witness path
- OpenClaw hook integration
- CLI + slash command + tool surfaces
- Documentation, examples, threat model, disclosure banners

Out of scope:

- Server-side anything (`blackbox-v3`, `ghostlogic-inspector`, `ghostseal`)
- The Evidence Record renderer (lives in `evidence-ghostlogic-tech`)
- Anything that wants to be a memory product (use Supermemory)

## License

Apache-2.0. By submitting a PR you agree your contribution is licensed under the same terms.
