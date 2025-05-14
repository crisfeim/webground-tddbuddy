import type { ProcessOutput } from "./ProcessOutput.js";

export type Client = (specs: string) => Promise<string>;

export type Runner = (code: string) => ProcessOutput;

export type Concatenator = (code: string, specs: string) => string;

export class Generator {
  constructor(
    private client: Client,
    private runner: Runner,
    private concatenator: Concatenator = (code: string, specs: string) =>
      code + " " + specs,
  ) {}

  async generateCode(specs: string): Promise<ProcessOutput> {
    const code = await this.client(specs);
    const concatenatedCode = this.concatenator(code, specs);
    const processOutput = this.runner(concatenatedCode);
    return processOutput;
  }
}
