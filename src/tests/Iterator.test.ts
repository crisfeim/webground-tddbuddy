import { describe, it, expect } from "vitest";
import { Iterator } from "$lib/Iterator.js";

describe("New Iterator", () => {
  it("iterates N times", async () => {
    const sut = new Iterator();
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
    const sut = new Iterator();
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
