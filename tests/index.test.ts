import { describe, expect, it, vi } from "vitest";
import plugin from "../index.js";

describe("plugin register", () => {
  it("registers four tools, one slash, one service", () => {
    const tools: string[] = [];
    const slashes: string[] = [];
    const services: string[] = [];
    const api = {
      pluginConfig: {},
      logger: { info: vi.fn(), error: vi.fn() },
      on: vi.fn(),
      registerTool: (def: { name: string }) => {
        tools.push(def.name);
      },
      registerSlashCommand: (def: { id: string }) => {
        slashes.push(def.id);
      },
      registerService: (def: { id: string }) => {
        services.push(def.id);
      },
      registerCli: vi.fn(),
    };
    plugin.register(api as never);
    expect(tools).toEqual([
      "evidence_record",
      "evidence_verify",
      "evidence_dossier",
      "evidence_replay",
    ]);
    expect(slashes).toEqual(["evidence"]);
    expect(services).toEqual(["openclaw-evidence"]);
  });
});
