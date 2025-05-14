import { describe, it, expect } from "vitest";
import { Generator, type GeneratorOutput } from "$lib/Generator.js";
import { Iterator } from "$lib/Iterator.js";
import type { ProcessOutput } from "$lib/ProcessOutput.js";
import { Coordinator } from "$lib/Coordinator.js";
import type { CodeGenerator } from "$lib/Coordinator.js";
import type { Message } from "$lib/Message.js";

describe("generateCode", () => {
  it("retries until max iteration when process fails", async () => {
    const generator = GeneratorStub([anyFailingOutput()]);
    const { sut, iterator } = makeSUT(generator);
    await sut.generateCode(anySpecs(), 5);
    expect(iterator.count).toBe(5);
  });

  it("retries until process succeeds", async () => {
    const generator = GeneratorStub([
      anyFailingOutput(),
      anyFailingOutput(),
      anySuccessfulOutput(),
    ]);
    const { sut, iterator } = makeSUT(generator);
    await sut.generateCode(anySpecs(), 5);
    expect(iterator.count).toBe(3);
  });
});

// Helpers

function makeSUT(generator: CodeGenerator): {
  sut: Coordinator;
  iterator: Iterator;
} {
  const iterator = new Iterator();
  const sut = new Coordinator(generator, iterator);
  return { sut, iterator };
}

const GeneratorStub = (outputs: ProcessOutput[]): CodeGenerator => {
  return async (_specs, _messages) => ({
    code: "any code",
    processOutput: outputs.shift()!,
  });
};

function anySpecs(): string {
  return "any specs";
}

function anyFailingOutput(): ProcessOutput {
  return {
    stdout: "",
    stderr: "💥",
    exitCode: 1,
  };
}

function anySuccessfulOutput(): ProcessOutput {
  return {
    stdout: "",
    stderr: "",
    exitCode: 0,
  };
}
