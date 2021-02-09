export class StandardDataBuilder {
  public BuildRecords<T>(creationFunction: (n) => T, numberOfRecords = 4): T[] {
    const data: T[] = [];
    for (let i = 0; i < numberOfRecords; i++) {
      data.push(creationFunction(i));
    }
    return data;
  }
}
