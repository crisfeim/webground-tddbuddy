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
    const runnerDummy: Runner = (_: string) => anyCode();
    const sut = new Generator(clientStub, runnerDummy);
    await expect(sut.generateCode(anySpecs())).rejects.toEqual(anyError());
  });

  it("delivers code on client success", async () => {
    const clientStub: Client = (specs: string) => Promise.resolve(anyCode());
    const runnerDummy: Runner = (_: string) => anyCode();
    const sut = new Generator(clientStub, runnerDummy);
    await expect(sut.generateCode(anySpecs())).resolves.toEqual(anyCode());
  });

  it("delivers error on runner error", async () => {
    const clientDummy: Client = (_: string) => Promise.resolve(anyCode());
    const runnerStub: Runner = (_: string) => {
      throw anyError();
    };
    const sut = new Generator(clientDummy, runnerStub);
    await expect(sut.generateCode(anySpecs())).rejects.toEqual(anyError());
  });
});

function anyError(): Error {
  return new Error("any Error");
}

function anySpecs(): string {
  return "any specs";
}

function anyCode(): string {
  return "any code";
}
