import { Generator } from "./Generator.js";
import { Iterator } from "./Iterator.js";
import type { ProcessOutput } from "./ProcessOutput.js";

type Specs = string;

export interface CodeGenerator {
  generateCode(specs: Specs): Promise<ProcessOutput>;
}

export class Coordinator {
  constructor(
    private generator: CodeGenerator,
    private iterator: Iterator,
  ) {}

  async generateCode(
    specs: Specs,
    maxIterationCount: number,
  ): Promise<ProcessOutput> {
    let output: ProcessOutput | undefined;

    await this.iterator.iterate(
      maxIterationCount,
      () => output?.exitCode === 0,
      async () => {
        output = await this.generator.generateCode(specs);
      },
    );

    return output!;
  }
}
