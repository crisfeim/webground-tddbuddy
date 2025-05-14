import type { ProcessOutput } from "./ProcessOutput.js";
import type { Client } from "./Client.js";
import type { Runner } from "./Runner.js";
import type { Message } from "./Message.js";
export type Concatenator = (code: string, specs: string) => string;

export type GeneratorOutput = { code: String; processOutput: ProcessOutput };

export class Generator {
  constructor(
    private client: Client,
    private runner: Runner,
    private concatenator: Concatenator = (code: string, specs: string) =>
      code + "\n" + specs,
  ) {}

  async generateCode(
    specs: string,
    context: Message[],
  ): Promise<GeneratorOutput> {
    const specsMessage: Message = {
      role: "user",
      parts: [{ text: specs }],
    };
    const messages: Message[] = [specsMessage, ...context];
    const code = await this.client(messages);
    const concatenatedCode = this.concatenator(code, specs);
    const processOutput = this.runner(concatenatedCode);
    return { code: code, processOutput: processOutput };
  }
}
