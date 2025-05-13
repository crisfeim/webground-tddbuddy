export class Iterator {
  public count = 0;

  async iterate(
    nTimes: number,
    until: () => boolean,
    action: () => void | Promise<void>,
  ): Promise<void> {
    while (this.count < nTimes && !until()) {
      await action();
      this.count++;
    }
  }
}
