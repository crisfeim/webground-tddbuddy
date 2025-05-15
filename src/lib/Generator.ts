import type { ProcessOutput } from "./ProcessOutput.js";
import type { Client } from "./Client.js";
import type { Runner } from "./Runner.js";
import type { Message } from "./Message.js";
export type Concatenator = (code: string, specs: string) => string;
import { systemPrompt } from "./system-prompt.js";

export type GeneratorOutput = {
  generatedCode: String;
  processOutput: ProcessOutput;
};

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
    const systemPromptMessage: Message = {
      role: "model",
      parts: [{ text: systemPrompt }],
    };

    const specsMessage: Message = {
      role: "user",
      parts: [{ text: specs }],
    };
    const messages: Message[] = [specsMessage, systemPromptMessage, ...context];
    const generatedCode = await this.client(messages);
    const concatenatedCode = this.concatenator(generatedCode, specs);
    const processOutput = this.runner(concatenatedCode);
    return { generatedCode: generatedCode, processOutput: processOutput };
  }
}
