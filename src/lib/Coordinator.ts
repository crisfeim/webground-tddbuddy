import { Generator } from "./Generator.js";
import { Iterator } from "./Iterator.js";
import type { ProcessOutput } from "./ProcessOutput.js";
import type { GeneratorOutput } from "./Generator.js";
import type { Message } from "./Message.js";

type Specs = string;

export interface CodeGenerator {
  generateCode(specs: Specs, messages: Message[]): Promise<GeneratorOutput>;
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
    let output: GeneratorOutput | undefined;

    await this.iterator.iterate(
      maxIterationCount,
      () => output?.processOutput?.exitCode === 0,
      async () => {
        output = await this.generator.generateCode(specs, []);
      },
    );

    return output!;
  }
}
