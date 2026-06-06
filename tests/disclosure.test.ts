import { describe, expect, it, vi } from "vitest";
import { DISCLOSED_RESULT, disclose } from "../disclosure.js";

describe("disclosure", () => {
  it("logs through provided logger", () => {
    const info = vi.fn();
    disclose("agent_end", { info });
    expect(info).toHaveBeenCalledOnce();
    expect(info.mock.calls[0][0]).toContain("stub surface: agent_end");
    expect(info.mock.calls[0][0]).toContain("ghosthash");
  });

  it("DISCLOSED_RESULT contains the standard shape", () => {
    expect(DISCLOSED_RESULT.status).toBe("stubbed_and_disclosed");
    expect(DISCLOSED_RESULT.next).toMatch(/STATUS\.md/);
  });
});
