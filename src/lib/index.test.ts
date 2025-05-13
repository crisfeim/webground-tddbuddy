import { describe, it, expect } from "vitest";

type Client = (specs: string) => Promise<string>;

type ProcessOutput = {
  stdout: string;
  stderr: string;
  exitCode: number;
};
type Runner = (code: string) => ProcessOutput;

class Generator {
  constructor(
    private client: Client,
    private runner: Runner,
  ) {}

  async generateCode(specs: string): Promise<ProcessOutput> {
    const code = await this.client(specs);
    const processOutput = this.runner(code);
    return processOutput;
  }
}

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
});

function makeSUT({
  client = clientDummy,
  runner = runnerDummy,
}: {
  client?: Client;
  runner?: Runner;
} = {}): Generator {
  return new Generator(client, runner);
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
