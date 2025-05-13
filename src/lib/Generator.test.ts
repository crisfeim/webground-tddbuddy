import { describe, it, expect } from "vitest";
import type {
  Client,
  Runner,
  ProcessOutput,
  Concatenator,
} from "./Generator.js";
import { Generator } from "./Generator.js";

describe("generateCode", () => {
  it("delivers error on client error", async () => {
    const clientStub: Client = (_: string) => Promise.reject(anyError());
    const sut = makeSUT({ client: clientStub });
    await expect(sut.generateCode(anySpecs())).rejects.toEqual(anyError());
  });

  it("delivers output on client success", async () => {
    const clientStub: Client = (specs: string) => Promise.resolve(anyCode());
    const sut = makeSUT({ client: clientStub });
    await expect(sut.generateCode(anySpecs())).resolves.toEqual(anyOutput());
  });

  it("delivers output on code running", async () => {
    const runnerStub: Runner = (_: string) => {
      return {
        stdout: "",
        stderr: "",
        exitCode: 1,
      };
    };

    const sut = makeSUT({ runner: runnerStub });
    const expectedProcessOutput: ProcessOutput = {
      stdout: "",
      stderr: "",
      exitCode: 1,
    };
    await expect(sut.generateCode(anySpecs())).resolves.toEqual(
      expectedProcessOutput,
    );
  });

  it("uses concatenated code as runner input", async () => {
    // spy
    let capturedCode: string | undefined;

    const runnerSpy: Runner = (code: string) => {
      capturedCode = code;
      return { stdout: "", stderr: "", exitCode: 0 };
    };

    const concatenator: Concatenator = (code: string, specs: string) =>
      "concatenated";

    const sut = makeSUT({ runner: runnerSpy, concatenator: concatenator });
    await sut.generateCode(anySpecs());

    expect(capturedCode).toBe("concatenated");
  });

  it("sends specs to client", async () => {
    let capturedSpecs: string | undefined;
    const clientSpy: Client = (specs: string) => {
      capturedSpecs = specs;
      return Promise.resolve(anyCode());
    };

    const sut = makeSUT({ client: clientSpy });
    await sut.generateCode(anySpecs());

    expect(capturedSpecs).toBe(anySpecs());
  });
});

function makeSUT({
  client = clientDummy,
  runner = runnerDummy,
  concatenator = (code: string, specs: string) => code + " " + specs,
}: {
  client?: Client;
  runner?: Runner;
  concatenator?: Concatenator;
} = {}): Generator {
  return new Generator(client, runner, concatenator);
}

const clientDummy: Client = (_: string) => Promise.resolve(anyCode());
const runnerDummy: Runner = (_: string) => anyOutput();

function anyClient(specs: string): Promise<string> {
  return Promise.reject(anyError());
}

function anyRunner(code: string): string {
  throw anyError();
}

function anyError(): Error {
  return new Error("any Error");
}

function anySpecs(): string {
  return "any specs";
}

function anyOutput(): ProcessOutput {
  return {
    stdout: "",
    stderr: "",
    exitCode: 0,
  };
}

function anyCode(): string {
  return "any code";
}
