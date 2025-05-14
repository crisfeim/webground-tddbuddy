import { describe, it, expect } from "vitest";
import { Iterator } from "$lib/Iterator.js";

export class NewIterator {
  async run<T>(
    action: () => Promise<T>,
    nTimes: number,
    until: (result: T | undefined) => boolean,
    onNewIteration: (result: T) => void,
  ): Promise<T> {
    let result: T | undefined;
    let currentIteration = 0;

    while (currentIteration < nTimes && !until(result)) {
      result = await action();
      currentIteration += 1;
      onNewIteration(result);
    }

    if (result === undefined) {
      throw new Error("Iterator did not run any iterations.");
    }

    return result;
  }
}

describe("New Iterator", () => {
  it("iterates N times", async () => {
    const sut = new NewIterator();
    let count = 0;

    await sut.run(
      async () => {
        count += 1;
        return "any result";
      },
      5,
      () => false,
      () => {},
    );

    expect(count).toBe(5);
  });

  it("iterates until condition is met", async () => {
    const sut = new NewIterator();
    let count = 0;

    await sut.run(
      async () => {
        count += 1;
        return "any result";
      },
      5,
      () => count == 3,
      () => {},
    );

    expect(count).toBe(3);
  });
});
