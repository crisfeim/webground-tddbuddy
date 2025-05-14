import { describe, it, expect } from "vitest";
import { Generator, type GeneratorOutput } from "$lib/Generator.js";
import { Iterator } from "$lib/Iterator.js";
import type { ProcessOutput } from "$lib/ProcessOutput.js";
import { Coordinator } from "$lib/Coordinator.js";
import type { CodeGenerator } from "$lib/Coordinator.js";
import type { Message } from "$lib/Message.js";

describe("generateCode", () => {
  it("retries until max iteration when process fails", async () => {
    const { capturedData, generator } = GeneratorMock([
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
    expect(capturedData.messages.length).toBe(5);
  });

  it("retries until process succeeds", async () => {
    const { capturedData, generator } = GeneratorMock([
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
      anySuccessGeneratorOutput(),
    ]);
    const sut = makeSUT(generator);
    await sut.generateCode(anySpecs(), 5);
    expect(capturedData.messages.length).toBe(3);
  });

  it("cumulates context on each retry", async () => {
    const { capturedData, generator } = GeneratorMock([
      anyFailingGeneratorOutput(),
      anyFailingGeneratorOutput(),
    ]);
    const sut = makeSUT(generator);
    await sut.generateCode(anySpecs(), 2);
    const expectedCapturedMessages = [
      { role: "assistant", parts: [{ text: "" }] },
      { role: "assistant", parts: [{ text: "" }] },
    ];
    console.log("capturedMessages:");
    console.log(capturedData.messages);
    expect(capturedData.messages).toEqual(expectedCapturedMessages);
  });
});

// Helpers

function makeSUT(generator: CodeGenerator): Coordinator {
  const sut = new Coordinator(generator, new Iterator());
  return sut;
}

const GeneratorMock = (
  outputs: GeneratorOutput[],
): {
  capturedData: { messages: Message[] };
  generator: CodeGenerator;
} => {
  const capturedData: { messages: Message[] } = {
    messages: [],
  };

  const generator: CodeGenerator = async (_specs, messages) => {
    capturedData.messages = messages;
    return outputs.shift()!;
  };

  return { capturedData, generator };
};

const GeneratorStubSpyBis = (
  outputs: GeneratorOutput[],
): { capturedMessages: Message[]; generator: CodeGenerator } => {
  var capturedMessages: Message[] = [];

  const generator: CodeGenerator = async (_specs, messages) => {
    capturedMessages = messages;
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
