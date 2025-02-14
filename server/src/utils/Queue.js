export default class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element); // Add to the end
  }

  dequeue() {
    return this.items.shift(); // Remove from the front
  }

  front() {
    return this.items[0]; // Peek at the first element
  }

  isEmpty() { // checks if empty
    return this.items.length === 0;
  }

  size() { // returns the size of queue
    return this.items.length;
  }

  delete(element) { // deletes the top element
    this.items = this.items.filter(item => item !== element);
  }

  print() { // prints the queue
    console.log(this.items);
  }
}