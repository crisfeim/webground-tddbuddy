import { describe, it, expect } from "vitest";

type Client = (specs: string) => Promise<string>;
type Runner = (code: string) => string;

class Generator {
  constructor(
    private client: Client,
    private runner: Runner,
  ) {}

  async generateCode(specs: string): Promise<string> {
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

  it("delivers code on client success", async () => {
    const clientStub: Client = (specs: string) => Promise.resolve(anyCode());
    const sut = makeSUT({ client: clientStub });
    await expect(sut.generateCode(anySpecs())).resolves.toEqual(anyCode());
  });

  it("delivers error on runner error", async () => {
    const runnerStub: Runner = (_: string) => {
      throw anyError();
    };

    const sut = makeSUT({ runner: runnerStub });
    await expect(sut.generateCode(anySpecs())).rejects.toEqual(anyError());
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
const runnerDummy: Runner = (_: string) => anyCode();

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

function anyCode(): string {
  return "any code";
}
