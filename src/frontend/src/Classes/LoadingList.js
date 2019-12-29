import LinkedListNode from "./LinkedList";

const loadingList = new LinkedListNode(".");
loadingList.next = new LinkedListNode("..");
loadingList.next.next = new LinkedListNode("...");
loadingList.next.next.next = loadingList;

export default loadingList;
