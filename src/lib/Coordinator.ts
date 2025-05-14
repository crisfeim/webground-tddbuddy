import { Generator } from "./Generator.js";
import { Iterator } from "./Iterator.js";
import type { ProcessOutput } from "./ProcessOutput.js";
import type { GeneratorOutput } from "./Generator.js";
import type { Message } from "./Message.js";

type Specs = string;

export type CodeGenerator = (
  specs: string,
  messages: Message[],
) => Promise<GeneratorOutput>;

class ContextStore {
  #data: Message[];

  constructor(systemPrompt: string, specs: string) {
    this.#data = [
      { role: "system", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: specs }] },
    ];
  }

  get data(): Message[] {
    return this.#data;
  }

  add(item: GeneratorOutput) {
    this.#data.push({
      role: "assistant",
      parts: [{ text: `${item.code}\nError:\n${item.processOutput.stderr}` }],
    });
  }
}

export class Coordinator {
  constructor(
    private generator: CodeGenerator,
    private iterator: Iterator,
  ) {}

  async generateCode(
    specs: Specs,
    maxIterationCount: number,
  ): Promise<GeneratorOutput> {
    let context = new ContextStore("system prompt to inject", specs);

    const action = async () => {
      const messages: Message[] = [
        {
          role: "user",
          parts: [{ text: `new attempt}` }],
        },
      ];
      return await this.generator(specs, messages);
    };

    const runUntil = (result: GeneratorOutput | undefined) => {
      return result?.processOutput?.exitCode === 0;
    };

    return await this.iterator.run(
      action,
      maxIterationCount,
      runUntil,
      () => context.add,
    );
  }
}
