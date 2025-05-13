import { describe, it, expect } from "vitest";
import { Generator } from "../lib/Generator.js";
import { Iterator } from "../lib/Iterator.js";
import type { ProcessOutput } from "../lib/Generator.js";

type Specs = string;

interface CodeGenerator {
  generateCode(specs: Specs): Promise<ProcessOutput>;
}

class GeneratorStub implements CodeGenerator {
  constructor(private output: ProcessOutput) {}

  async generateCode(_: Specs): Promise<ProcessOutput> {
    return this.output;
  }
}

class Coordinator {
  constructor(
    private generator: CodeGenerator,
    private iterator: Iterator,
  ) {}

  async generateCode(specs: Specs, maxIterationCount: number): Promise<void> {
    await this.iterator.iterate(
      maxIterationCount,
      () => false,
      async () => {
        await this.generator.generateCode(specs);
      },
    );
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

describe("generateCode", () => {
  it("retries until max iteration when process fails", async () => {
    const iterator = new Iterator();
    const generator = new GeneratorStub(anyFailingOutput());
    const sut = new Coordinator(generator, iterator);
    await sut.generateCode(anySpecs(), 5);
    expect(iterator.count).toBe(5);
  });
});
