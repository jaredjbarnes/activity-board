export class Factory<T> {
  generator: () => T;
  availableInstances: T[] = [];
  usedInstances: T[] = [];
  constructor(generator: () => T) {
    this.generator = generator;
  }
  useInstance() {
    let instance: T;
    const availableInstances = this.availableInstances;
    if (availableInstances.length === 0) {
      instance = this.generator();
    } else {
      instance = availableInstances.pop() as T;
    }
    this.usedInstances.push(instance);
    return instance;
  }
  releaseAll() {
    const usedInstances = this.usedInstances;
    const length = usedInstances.length;
    for (let x = 0; x < length; x++) {
      this.availableInstances.push(this.usedInstances[x]);
    }

    // Fast way to clear an array.
    this.usedInstances.length = 0;
  }
}
