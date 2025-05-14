import { describe, it, expect } from "vitest";
import { Generator } from "../lib/Generator.js";
import { Iterator } from "../lib/Iterator.js";
import type { ProcessOutput } from "../lib/ProcessOutput.js";
import { Coordinator } from "../lib/Coordinator.js";
import type { CodeGenerator } from "../lib/Coordinator.js";

describe("generateCode", () => {
  it("retries until max iteration when process fails", async () => {
    const generator = new GeneratorStub([anyFailingOutput()]);
    const { sut, iterator } = makeSUT(generator);
    await sut.generateCode(anySpecs(), 5);
    expect(iterator.count).toBe(5);
  });

  it("retries until process succeeds", async () => {
    const generator = new GeneratorStub([
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

class GeneratorStub implements CodeGenerator {
  constructor(private output: ProcessOutput[]) {}

  async generateCode(_: string): Promise<ProcessOutput> {
    return this.output.shift()!;
  }
}

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
