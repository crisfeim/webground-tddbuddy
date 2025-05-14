import { describe, it, expect } from "vitest";
import { gemini_key } from "../secrets/geminikey.js";
import { GeminiClient } from "$lib/Infra/GeminiClient.js";
import { Coordinator } from "$lib/Coordinator.js";
import { Iterator } from "$lib/Iterator.js";
import { JSRunner } from "$lib/Infra/JSRunner.js";
import { Generator } from "$lib/Generator.js";
import type { CodeGenerator } from "$lib/Coordinator.js";
import type { Message } from "$lib/Message.js";
import { systemPrompt } from "$lib/system-prompt.js";

describe("Integration", () => {
  it("", async () => {
    const adderSpecs = `
      function test_adder() {
        let sut = Adder(1, 3);
        console.assert(sut.result === 4, "Expected 1 + 3 to be 4");

        sut = Adder(3, 4);
        console.assert(sut.result === 7, "Expected 3 + 4 to be 7");

        sut = Adder(5, 4);
        console.assert(sut.result === 9, "Expected 5 + 4 to be 9");
      }

      test_adder();
      `;

    const coordinator = makeSUT();
    const result = await coordinator.generateCode(adderSpecs, 5);
  }, 10_000);
});

function makeSUT(): Coordinator {
  const client = GeminiClient(systemPrompt, gemini_key);
  const runner = JSRunner;

  const generator: CodeGenerator = async (
    specs: string,
    context: Message[],
  ) => {
    const generator = new Generator(client, runner);
    return await generator.generateCode(specs, context);
  };

  return new Coordinator(generator, new Iterator());
}
