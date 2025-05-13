import { describe, it, expect } from "vitest";

class Generator {
  constructor(private client: Client) {}

  async generateCode(specs: string): Promise<string> {
    return this.client(specs);
  }
}

type Client = (specs: string) => Promise<string>;

describe("generateCode", () => {
  it("delivers error on client error", async () => {
    const clientStub: Client = (_: string) => Promise.reject(anyError());
    const sut = new Generator(clientStub);
    await expect(sut.generateCode(anySpecs())).rejects.toEqual(anyError());
  });
});

function anyError(): Error {
  return new Error("any Error");
}

function anySpecs(): string {
  return "any specs";
}
