import { describe, it, expect } from "vitest";
import { JSRunner } from "$lib/Infra/JSRunner.js";

describe("run", () => {
  it("delivers exitCode 1 on run error", () => {
    const sut = JSRunner;
    const codeWithSyntaxError = "console.log('unterminated string";
    const output = sut(codeWithSyntaxError);
    expect(output.exitCode).toBe(1);
  });

  const codeToRun = `
    function Adder(a, b) {
      return {
        result: a + b
      };
    }

    function test_adder() {
      let sut = Adder(1, 3);
      console.assert(sut.result === 4, "Expected 1 + 3 to be 4");

      sut = Adder(3, 4);
      console.assert(sut.result === 7, "Expected 3 + 4 to be 7");

      sut = Adder(5, 4);
      console.assert(sut.result === 9, "Expected 5 + 4 to be 9");
    }

    test_adder();
  `;
  it("delviers exitCode 0 on run success", () => {
    const sut = JSRunner;
    const codeWithNoError = "console.log('hello world')";
    const output = sut(codeToRun);

    expect(output.stderr).toBe("");
    expect(output.exitCode).toBe(0);
  });
});
