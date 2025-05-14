export class Iterator {
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
