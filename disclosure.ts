// disclosure.ts
const BANNER = `
[openclaw-evidence v0.1.0-alpha.0]
This surface is a stub. The production path requires:
  - ghosthash (endpoint witness; pip+npm; unpublished)
  - server-side ghostseal (proprietary; pending)
See STATUS.md for the roadmap. https://github.com/adam-scott-thomas/ghostlogic-openclaw-evidence
`.trim();

export function disclose(surface: string, logger?: { info: (s: string) => void }): void {
  const msg = `${BANNER}\nstub surface: ${surface}`;
  if (logger) logger.info(msg);
  else console.log(msg);
}

export const DISCLOSED_RESULT = {
  status: "stubbed_and_disclosed" as const,
  reason: "Production capture path pending ghosthash publication",
  next: "https://github.com/adam-scott-thomas/ghostlogic-openclaw-evidence/blob/main/STATUS.md",
};
