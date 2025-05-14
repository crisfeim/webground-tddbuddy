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

  constructor() {
    this.#data = [];
  }

  get data(): Message[] {
    return this.#data;
  }

  add(item: GeneratorOutput) {
    this.#data.push({
      role: "assistant",
      parts: [
        { text: `code:${item.code}\nerror:${item.processOutput.stderr}` },
      ],
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
    let context = new ContextStore();

    const action = async () => {
      return await this.generator(specs, context.data);
    };

    const runUntil = (result: GeneratorOutput | undefined) => {
      return result?.processOutput?.exitCode === 0;
    };

    return await this.iterator.run(
      action,
      maxIterationCount,
      runUntil,
      (result) => context.add(result),
    );
  }
}
