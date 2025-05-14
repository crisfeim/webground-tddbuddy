import type { Runner } from "$lib/Runner.js";
import { describe, it, expect } from "vitest";

const JSRunner: Runner = (code: string) => {
  try {
    const result = eval(code);
    return {
      stdout: String(result),
      stderr: "",
      exitCode: 0,
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: String(error),
      exitCode: 1,
    };
  }
};

describe("run", () => {
  it("delivers exitCode 1 on run error", () => {
    const sut = JSRunner;
    const codeWithSyntaxError = "console.log('unterminated string";
    const output = sut(codeWithSyntaxError);
    expect(output.exitCode).toBe(1);
  });

  it("delviers exitCode 0 on run success", () => {
    const sut = JSRunner;
    const codeWithNoError = "console.log('hello world')";
    const output = sut(codeWithNoError);
    expect(output.exitCode).toBe(0);
  });
});
