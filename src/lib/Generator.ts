import type { ProcessOutput } from "./ProcessOutput.js";
import type { Client } from "./Client.js";
import type { Runner } from "./Runner.js";
export type Concatenator = (code: string, specs: string) => string;

export type GeneratorOutput = { code: String; processOutput: ProcessOutput };
export class Generator {
  constructor(
    private client: Client,
    private runner: Runner,
    private concatenator: Concatenator = (code: string, specs: string) =>
      code + "\n" + specs,
  ) {}

  async generateCode(specs: string): Promise<GeneratorOutput> {
    const code = await this.client(specs);
    const concatenatedCode = this.concatenator(code, specs);
    const processOutput = this.runner(concatenatedCode);
    return { code: code, processOutput: processOutput };
  }
}
