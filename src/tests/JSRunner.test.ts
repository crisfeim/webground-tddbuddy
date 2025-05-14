import type { Runner } from "$lib/Runner.js";
import { describe, it, expect } from "vitest";

const JSRunner: Runner = (code: string) => {
  try {
    const result = eval(code);
    return undefined!;
  } catch (error) {
    return {
      stdout: "",
      stderr: String(error),
      exitCode: 1,
    };
  }
};

describe("run", () => {
  it("delivers exitCode 1 on running error", async () => {
    const sut = JSRunner;
    const codeWithSyntaxError = "console.log('unterminated string";
    const output = sut(codeWithSyntaxError);
    expect(output.exitCode).toBe(1);
  });
});
