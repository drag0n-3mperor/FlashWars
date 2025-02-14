export default class Pair {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }

  getFirst() {
    return this.first;
  }

  getSecond() {
    return this.second;
  }

  setFirst(value) {
    this.first = value;
  }

  setSecond(value) {
    this.second = value;
  }

  toString() {
    return `(${this.first}, ${this.second})`;
  }
}