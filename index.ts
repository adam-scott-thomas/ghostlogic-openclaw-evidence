// index.ts
import { hostname } from "node:os";
import { DISCLOSED_RESULT, disclose } from "./disclosure.js";

interface OpenClawApi {
  pluginConfig: Record<string, unknown>;
  logger: { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void };
  on: (event: string, handler: (e: Record<string, unknown>, ctx: Record<string, unknown>) => void) => void;
  registerTool: (def: { name: string; description: string; input_schema: unknown; handler: (input: Record<string, unknown>) => unknown }) => void;
  registerSlashCommand: (def: { id: string; run: (args: string[]) => Promise<{ text: string }> }) => void;
  registerService: (def: { id: string; start: () => void; stop: () => void }) => void;
  registerCli?: (def: { id: string; help: string; run: (args: string[]) => Promise<void> }) => void;
}

const BASE_URL = "https://evidence.ghostlogic.tech";

function containerTag(): string {
  return `openclaw_${hostname().replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function dateArg(arg: string | undefined, now: Date): string {
  const a = (arg ?? "today").trim().toLowerCase();
  if (a === "today") return now.toISOString().slice(0, 10);
  if (a === "yesterday") {
    const d = new Date(now); d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a)) throw new Error(`expected today|yesterday|YYYY-MM-DD, got ${arg}`);
  return a;
}

export default {
  id: "openclaw-evidence",
  name: "GhostLogic Evidence",
  description: "Black Box for AI Agents — Verified Activity Record (alpha · stubbed and disclosed)",
  kind: "evidence" as const,

  register(api: OpenClawApi): void {
    const tag = containerTag();

    api.on("agent_end", () => disclose("agent_end", api.logger));
    api.on("before_prompt_build", () => disclose("before_prompt_build", api.logger));

    api.registerTool({
      name: "evidence_record",
      description: "Record an evidence intent. (Alpha: returns stubbed-and-disclosed.)",
      input_schema: {
        type: "object",
        properties: { summary: { type: "string" }, tag: { type: "string" } },
        required: ["summary"],
      },
      handler: (input) => {
        disclose("evidence_record", api.logger);
        return { ...DISCLOSED_RESULT, recorded_intent: input };
      },
    });

    for (const name of ["evidence_verify", "evidence_dossier", "evidence_replay"] as const) {
      api.registerTool({
        name,
        description: `(Alpha: stubbed-and-disclosed. See STATUS.md.)`,
        input_schema: { type: "object", properties: {}, additionalProperties: true },
        handler: () => { disclose(name, api.logger); return DISCLOSED_RESULT; },
      });
    }

    api.registerSlashCommand({
      id: "evidence",
      run: async (args) => {
        try {
          const date = dateArg(args[0], new Date());
          const url = `${BASE_URL}/openclaw/${tag}/${date}`;
          return {
            text: [
              `Verified Activity Record — ${date}`,
              `Container: ${tag}`,
              `Build state: alpha · capture pipeline pending ghosthash`,
              `URL: ${url}`,
              `Disclosure: ${BASE_URL}/status`,
            ].join("\n"),
          };
        } catch (e) {
          return { text: `evidence: ${(e as Error).message}` };
        }
      },
    });

    if (api.registerCli) {
      api.registerCli({
        id: "evidence setup",
        help: "Show setup disclosure (alpha)",
        run: async () => { disclose("evidence setup", api.logger); },
      });
      api.registerCli({
        id: "evidence status",
        help: "Show plugin status",
        run: async () => {
          console.log([
            "openclaw-evidence v0.1.0-alpha.0",
            `container: ${tag}`,
            "build state: scaffold_complete",
            "capture pipeline: PENDING ghosthash",
            "ingest target: not configured (would be sandbox)",
            "see STATUS.md or https://github.com/adam-scott-thomas/ghostlogic-openclaw-evidence",
          ].join("\n"));
        },
      });
    }

    api.registerService({
      id: "openclaw-evidence",
      start: () => api.logger.info("openclaw-evidence v0.1.0-alpha.0 registered (stubbed + disclosed)"),
      stop: () => api.logger.info("openclaw-evidence stopped"),
    });
  },
};
