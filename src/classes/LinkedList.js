class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(value) {
    // create first node & set new node to head
    this.head = new _Node(value, this.head);
  }

  insertBefore(value, findValue) {
    let currentNode = this.head;
    if (currentNode === null) {
     
      return;
    }
    while (currentNode.next !== null) {
      if (currentNode.next.value === findValue) {
        currentNode.next = new _Node(value, currentNode.next);
        return;
      }
      currentNode = currentNode.next;
    }

  }

  insertAfter(value, findValue) {
    let currentNode = this.head;
    if (currentNode === null) {
     
      return;
    }
    while (currentNode.next !== null) {
      if (currentNode.value === findValue) {
        currentNode.next = new _Node(value, currentNode.next);
        return;
      }
      currentNode = currentNode.next;
    }
  

  }

  insertAt(value, numPosition) {
    if (numPosition < 0 ) {
      throw new Error ('Position error');
    }
    if (numPosition === 0) {
      this.insertFirst(value);
    } else {
      const node = this._findNthElement(numPosition -1);
      const newNode = new _Node(value, null);
      newNode.next = node.next;
      node.next = newNode;
    }
  }

  _findNthElement(position) {
    let node = this.head;
    for (let i=0; i<position; i++) {
      if (node.next === null) {
        return node;
      }
      node = node.next;
    }
    return node;
  }


  insertAtOrLast(value, numPosition) {
    let currentNode = this.head;
    if (numPosition === 0) {
      this.head = new _Node(value, currentNode.next);
      return;
    }
    let count = 1;
    while (currentNode.next !== null) {
      if (count === numPosition) {
        currentNode.next = new _Node(value, currentNode.next);
        return;
      }
      currentNode = currentNode.next;
      count++;
    }
    currentNode.next = new _Node(value, currentNode.next);
  }

  remove(value) {
    if (this.head === null) {
      return;
    }
    if (this.head.next === null) {
      if (this.head.value === value) {
        this.head = null;
        return;
      } else {
        return;
      }
    }

    if (this.head.value === value) {
      this.head.next = this.head.next.next;
      return;
    }
    let previousNode;
    let currentNode;
    while (currentNode.next !== null) {
      if (currentNode.next.value === value) {
        currentNode.next = currentNode.next.next;
        return;
      }
      previousNode = currentNode;
      currentNode = currentNode.next;
    }
    if (currentNode.value === value) {
      previousNode.next = null;
      return;
    }
  }

  // moveToNext() {
  //   if (this.head == null) {
  //     return;
  //   }
  //   this.head = this.head.next;
  // }

  find(value) {
    let currentNode = this.head;
    if (currentNode === null) {
      console.error('The list is empty');
    }
    while (currentNode.next !== null) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    console.error(`Node with ${value} does not exist.`);
  }


  insertLast(value) {
    let currentNode = this.head;
    if (currentNode === null) {
      this.insertFirst(value);
      return;
    }
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = new _Node(value, null);
  }
}

module.exports = {LinkedList};