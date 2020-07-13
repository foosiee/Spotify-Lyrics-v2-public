export default class LinkedListNode<T> {
  data: T;
  next: LinkedListNode<T> | null;
  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}
