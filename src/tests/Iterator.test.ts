import { describe, it, expect } from "vitest";
import { Iterator } from "../lib/Iterator.js";

describe("Iterator", () => {
  it("iterates N times", async () => {
    const sut = new Iterator();
    const neverFulfillsCondition = () => false;
    await sut.iterate(5, neverFulfillsCondition, () => {});
    expect(sut.count).toBe(5);
  });

  it("iterates until condition is met", async () => {
    const sut = new Iterator();
    const stopWhenCountIsOne = () => sut.count === 1;
    await sut.iterate(5, stopWhenCountIsOne, () => {});
    expect(sut.count).toBe(1);
  });
});
