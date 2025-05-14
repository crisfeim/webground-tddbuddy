import { describe, it, expect } from "vitest";
import { Generator, type GeneratorOutput } from "$lib/Generator.js";
import { Iterator } from "$lib/Iterator.js";
import type { ProcessOutput } from "$lib/ProcessOutput.js";
import { Coordinator } from "$lib/Coordinator.js";
import type { CodeGenerator } from "$lib/Coordinator.js";
import type { Message } from "$lib/Message.js";

describe("generateCode", () => {
  it("retries until max iteration when process fails", async () => {
    const { capturedMessages, generator } = GeneratorStubSpy([
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
    ]);
    const sut = makeSUT(generator);
    await sut.generateCode(anySpecs(), 5);
    expect(capturedMessages.length).toBe(5);
  });

  it("retries until process succeeds", async () => {
    const { capturedMessages, generator } = GeneratorStubSpy([
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anySuccessGeneratorOutput(),
    ]);
    const sut = makeSUT(generator);
    await sut.generateCode(anySpecs(), 5);
    expect(capturedMessages.length).toBe(3);
  });
});

// Helpers

function makeSUT(generator: CodeGenerator): Coordinator {
  const sut = new Coordinator(generator, new Iterator());
  return sut;
}

const GeneratorStubSpy = (
  outputs: GeneratorOutput[],
): { capturedMessages: Message[]; generator: CodeGenerator } => {
  const capturedMessages: Message[] = [];

  const generator: CodeGenerator = async (_specs, messages) => {
    capturedMessages.push(...messages);
    return outputs.shift()!;
  };

  return { capturedMessages, generator };
};

const GeneratorStub = (outputs: ProcessOutput[]): CodeGenerator => {
  return async (_specs, _messages) => ({
    code: "any code",
    processOutput: outputs.shift()!,
  });
};

function anySpecs(): string {
  return "any specs";
}

function anyFailingRunningOutput(): ProcessOutput {
  return {
    stdout: "",
    stderr: "💥",
    exitCode: 1,
  };
}

function anySuccessGeneratorOutput(): GeneratorOutput {
  return {
    code: "any code",
    processOutput: anySuccessRunningOutput(),
  };
}

function anyFailingGeneratorOutput(): GeneratorOutput {
  return {
    code: "any code",
    processOutput: anyFailingRunningOutput(),
  };
}

function anySuccessRunningOutput(): ProcessOutput {
  return {
    stdout: "",
    stderr: "",
    exitCode: 0,
  };
}
