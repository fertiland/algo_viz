import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/Help';

const DataStructureVisualizer = () => {
  const [dataStructure, setDataStructure] = useState('stack');
  const [elements, setElements] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [operations, setOperations] = useState([]);
  const [speed, setSpeed] = useState(50);
  const [explanation, setExplanation] = useState('');
  const [maxElements, setMaxElements] = useState(10);
  const [highlightedLines, setHighlightedLines] = useState([]);
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Graph-specific state
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState({});
  
  // Add new state for edge mode
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  
  // Add new state for mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Data structure prompts
  const dataStructurePrompts = [
    {
      title: 'Welcome to Data Structure Visualizer',
      content: 'This tool helps you understand how different data structures work by visualizing their operations step by step. You can see the data structures in action and learn about their efficiency.'
    },
    {
      title: 'Choose a Data Structure',
      content: 'Select a data structure from the dropdown menu. Each data structure has different characteristics and performance metrics. You can learn about their time complexity in the information panel.'
    },
    {
      title: 'Perform Operations',
      content: 'Use the add, remove, and other operation buttons to see how data is stored and manipulated in the selected data structure.'
    },
    {
      title: 'Understand the Visualization',
      content: 'The visualization shows how elements are organized in the data structure. Watch how the structure changes as you perform different operations.'
    },
    {
      title: 'Learn About Complexity',
      content: 'Check the information panel to understand the time complexity of different operations on the selected data structure.'
    }
  ];
  
  const canvasRef = useRef(null);
  
  // Code snippets for each data structure
  const codeSnippets = {
    stack: {
      push: `// Stack implementation using array
class Stack {
  constructor() {
    this.items = [];
  }
  
  // Push operation - O(1)
  push(element) {
    // Add element to the top of stack
    this.items.push(element);
    return element;
  }
  
  // Pop operation - O(1)
  pop() {
    // Check if stack is empty
    if (this.isEmpty()) {
      return "Underflow";
    }
    // Remove and return the top element
    return this.items.pop();
  }
  
  // Peek operation - O(1)
  peek() {
    // Return the top element without removing it
    return this.items[this.items.length - 1];
  }
  
  // Helper method to check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }
}`,
    },
    heap: {
      insert: `// Max Heap implementation using array
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  
  // Get parent index
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // Get left child index
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  // Get right child index
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  // Swap elements
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  // Insert operation - O(log n)
  insert(value) {
    // Add new element to the end
    this.heap.push(value);
    
    // Heapify up to maintain heap property
    this.heapifyUp(this.heap.length - 1);
    
    return value;
  }
  
  // Heapify up - O(log n)
  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    
    // Continue until we reach the root or the heap property is satisfied
    while (currentIndex > 0 && this.heap[currentIndex] > this.heap[parentIndex]) {
      // Swap with parent
      this.swap(currentIndex, parentIndex);
      
      // Move up to parent
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }
  
  // Extract max operation - O(log n)
  extractMax() {
    // Check if heap is empty
    if (this.isEmpty()) {
      return "Heap is empty";
    }
    
    // Get the maximum value (root)
    const max = this.heap[0];
    
    // Replace root with last element
    const lastElement = this.heap.pop();
    
    // If heap is not empty, heapify down
    if (!this.isEmpty()) {
      this.heap[0] = lastElement;
      this.heapifyDown(0);
    }
    
    return max;
  }
  
  // Heapify down - O(log n)
  heapifyDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    
    // Continue until we reach a leaf or the heap property is satisfied
    while (true) {
      let largestIndex = currentIndex;
      
      // Compare with left child
      if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] > this.heap[largestIndex]) {
        largestIndex = leftChildIndex;
      }
      
      // Compare with right child
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] > this.heap[largestIndex]) {
        largestIndex = rightChildIndex;
      }
      
      // If no swap needed, heap property is satisfied
      if (largestIndex === currentIndex) {
        break;
      }
      
      // Swap with the larger child
      this.swap(currentIndex, largestIndex);
      
      // Move down to the larger child
      currentIndex = largestIndex;
      leftChildIndex = this.getLeftChildIndex(currentIndex);
      rightChildIndex = this.getRightChildIndex(currentIndex);
    }
  }
  
  // Peek operation - O(1)
  peek() {
    // Return the maximum value without removing it
    if (this.isEmpty()) {
      return "Heap is empty";
    }
    return this.heap[0];
  }
  
  // Helper method to check if heap is empty
  isEmpty() {
    return this.heap.length === 0;
  }
}`,
    },
    queue: {
      enqueue: `// Queue implementation using array
class Queue {
  constructor() {
    this.items = [];
  }
  
  // Enqueue operation - O(1)
  enqueue(element) {
    // Add element to the rear of queue
    this.items.push(element);
    return element;
  }
  
  // Dequeue operation - O(1)
  dequeue() {
    // Check if queue is empty
    if (this.isEmpty()) {
      return "Underflow";
    }
    // Remove and return the front element
    return this.items.shift();
  }
  
  // Front operation - O(1)
  front() {
    // Return the front element without removing it
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }
  
  // Helper method to check if queue is empty
  isEmpty() {
    return this.items.length === 0;
  }
}`,
    },
    binaryTree: {
      insert: `// Binary Tree implementation
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  // Insert operation - O(log n) for balanced tree, O(n) worst case
  insert(value) {
    // Create a new node
    const newNode = new TreeNode(value);
    
    // If tree is empty, set new node as root
    if (this.root === null) {
      this.root = newNode;
      return;
    }
    
    // Helper function to insert recursively
    const insertNode = (node, newNode) => {
      // Insert to the left if value is less than current node
      if (newNode.value < node.value) {
        // If left is null, insert here
        if (node.left === null) {
          node.left = newNode;
        } else {
          // Otherwise, continue down the left subtree
          insertNode(node.left, newNode);
        }
      } else {
        // Insert to the right if value is greater than or equal to current node
        if (node.right === null) {
          node.right = newNode;
        } else {
          // Otherwise, continue down the right subtree
          insertNode(node.right, newNode);
        }
      }
    };
    
    // Start insertion from root
    insertNode(this.root, newNode);
  }
  
  // Remove operation - O(log n) for balanced tree, O(n) worst case
  remove(value) {
    // Helper function to find minimum value node
    const findMinNode = (node) => {
      while (node.left !== null) {
        node = node.left;
      }
      return node;
    };
    
    // Helper function to remove node recursively
    const removeNode = (node, value) => {
      // Base case: if node is null
      if (node === null) return null;
      
      // If value is less than node's value, go left
      if (value < node.value) {
        node.left = removeNode(node.left, value);
        return node;
      }
      
      // If value is greater than node's value, go right
      if (value > node.value) {
        node.right = removeNode(node.right, value);
        return node;
      }
      
      // If value equals node's value, this is the node to remove
      
      // Case 1: Node is a leaf (no children)
      if (node.left === null && node.right === null) {
        return null;
      }
      
      // Case 2: Node has one child
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }
      
      // Case 3: Node has two children
      // Find the smallest node in the right subtree
      const minNode = findMinNode(node.right);
      // Replace current node's value with the minimum value
      node.value = minNode.value;
      // Remove the duplicate from the right subtree
      node.right = removeNode(node.right, minNode.value);
      return node;
    };
    
    // Start removal from root
    this.root = removeNode(this.root, value);
  }
}`,
    },
    linkedList: {
      append: `// Linked List implementation
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  // Append operation - O(n)
  append(data) {
    // Create a new node
    const newNode = new Node(data);
    
    // If list is empty, make new node the head
    if (this.head === null) {
      this.head = newNode;
      return;
    }
    
    // Traverse to the end of the list
    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    
    // Add the new node at the end
    current.next = newNode;
  }
  
  // Remove head operation - O(1)
  removeHead() {
    // Check if list is empty
    if (this.head === null) {
      return null;
    }
    
    // Store the data to return
    const data = this.head.data;
    
    // Update head to the next node
    this.head = this.head.next;
    
    return data;
  }
}
`,
    },
    adjacencyList: {
      addVertex: `// Adjacency List implementation
class Graph {
  constructor() {
    this.adjList = new Map();
  }
  
  // Add vertex - O(1)
  addVertex(vertex) {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }
  }
  
  // Add edge - O(1)
  addEdge(vertex1, vertex2) {
    if (!this.adjList.has(vertex1)) {
      this.addVertex(vertex1);
    }
    if (!this.adjList.has(vertex2)) {
      this.addVertex(vertex2);
    }
    this.adjList.get(vertex1).push(vertex2);
    this.adjList.get(vertex2).push(vertex1); // For undirected graph
  }
  
  // Remove edge - O(V)
  removeEdge(vertex1, vertex2) {
    if (this.adjList.has(vertex1) && this.adjList.has(vertex2)) {
      const edges1 = this.adjList.get(vertex1);
      const edges2 = this.adjList.get(vertex2);
      const index1 = edges1.indexOf(vertex2);
      const index2 = edges2.indexOf(vertex1);
      if (index1 > -1) edges1.splice(index1, 1);
      if (index2 > -1) edges2.splice(index2, 1);
    }
  }
}`,
    },
    adjacencyMatrix: {
      addVertex: `// Adjacency Matrix implementation
class Graph {
  constructor() {
    this.vertices = [];
    this.matrix = [];
  }
  
  // Add vertex - O(V)
  addVertex(vertex) {
    if (!this.vertices.includes(vertex)) {
      this.vertices.push(vertex);
      // Add new row and column to matrix
      for (let i = 0; i < this.matrix.length; i++) {
        this.matrix[i].push(0);
      }
      this.matrix.push(new Array(this.vertices.length).fill(0));
    }
  }
  
  // Add edge - O(1)
  addEdge(vertex1, vertex2) {
    const index1 = this.vertices.indexOf(vertex1);
    const index2 = this.vertices.indexOf(vertex2);
    if (index1 !== -1 && index2 !== -1) {
      this.matrix[index1][index2] = 1;
      this.matrix[index2][index1] = 1; // For undirected graph
    }
  }
  
  // Remove edge - O(1)
  removeEdge(vertex1, vertex2) {
    const index1 = this.vertices.indexOf(vertex1);
    const index2 = this.vertices.indexOf(vertex2);
    if (index1 !== -1 && index2 !== -1) {
      this.matrix[index1][index2] = 0;
      this.matrix[index2][index1] = 0; // For undirected graph
    }
  }
}`,
    },
    doublyLinkedList: {
      append: `// Doubly Linked List implementation
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  
  // Append operation - O(1)
  append(data) {
    // Create a new node
    const newNode = new Node(data);
    
    // If list is empty, make new node both head and tail
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    
    // Add the new node at the end
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }
  
  // Remove head operation - O(1)
  removeHead() {
    // Check if list is empty
    if (this.head === null) {
      return null;
    }
    
    // Store the data to return
    const data = this.head.data;
    
    // If there's only one node
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      // Update head and its prev pointer
      this.head = this.head.next;
      this.head.prev = null;
    }
    
    return data;
  }
}`,
    },
  };
  
  // Data structure information
  const dataStructureInfo = {
    stack: {
      name: 'Stack',
      timeComplexity: {
        push: 'O(1)',
        pop: 'O(1)',
        peek: 'O(1)',
      },
      spaceComplexity: 'O(n)',
      description: 'A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Elements are added and removed from the same end, called the top.'
    },
    queue: {
      name: 'Queue',
      timeComplexity: {
        enqueue: 'O(1)',
        dequeue: 'O(1)',
        peek: 'O(1)',
      },
      spaceComplexity: 'O(n)',
      description: 'A queue is a linear data structure that follows the First In First Out (FIFO) principle. Elements are added at the rear and removed from the front.'
    },
    heap: {
      name: 'Heap',
      timeComplexity: {
        insert: 'O(log n)',
        extractMax: 'O(log n)',
        peek: 'O(1)',
      },
      spaceComplexity: 'O(n)',
      description: 'A heap is a specialized tree-based data structure that satisfies the heap property. In a max heap, for any given node, the value of that node is greater than or equal to the values of its children.'
    },
    linkedList: {
      name: 'Linked List',
      timeComplexity: {
        insertAtHead: 'O(1)',
        insertAtTail: 'O(1)',
        delete: 'O(n)',
        search: 'O(n)',
      },
      spaceComplexity: 'O(n)',
      description: 'A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.'
    },
    binaryTree: {
      name: 'Binary Tree',
      timeComplexity: {
        insert: 'O(log n) average, O(n) worst',
        remove: 'O(log n) average, O(n) worst',
        search: 'O(log n) average, O(n) worst',
        traversal: 'O(n)',
      },
      spaceComplexity: 'O(n)',
      description: 'A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child. It is used for efficient searching and sorting.'
    },
    adjacencyList: {
      name: 'Adjacency List',
      timeComplexity: {
        addVertex: 'O(1)',
        addEdge: 'O(1)',
        removeEdge: 'O(V)',
        findNeighbors: 'O(1)',
      },
      spaceComplexity: 'O(V + E)',
      description: 'An adjacency list represents a graph as an array of linked lists. Each vertex has a list of its adjacent vertices.'
    },
    adjacencyMatrix: {
      name: 'Adjacency Matrix',
      timeComplexity: {
        addVertex: 'O(V²)',
        addEdge: 'O(1)',
        removeEdge: 'O(1)',
        findNeighbors: 'O(V)',
      },
      spaceComplexity: 'O(V²)',
      description: 'An adjacency matrix represents a graph as a 2D matrix where each cell indicates if an edge exists between two vertices.'
    },
    doublyLinkedList: {
      name: 'Doubly Linked List',
      timeComplexity: {
        append: 'O(1)',
        removeHead: 'O(1)',
        insertAtPosition: 'O(n)',
        removeAtPosition: 'O(n)',
      },
      spaceComplexity: 'O(n)',
      description: 'A doubly linked list is a linear data structure where each node contains data and two pointers: one to the next node and one to the previous node. This allows for bidirectional traversal.'
    }
  };

  // Reset data structure
  const resetDataStructure = () => {
    setElements([]);
    setOperations([]);
    setExplanation('');
    setVertices([]);
    setEdges([]);
    setSelectedVertex(null);
    setAdjacencyMatrix([]);
    setAdjacencyList({});
    setIsEdgeMode(false);
    drawDataStructure([]);
  };

  // Draw data structure on canvas
  const drawDataStructure = (elements) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    switch (dataStructure) {
      case 'stack':
        drawStack(ctx, elements, width, height);
        break;
      case 'queue':
        drawQueue(ctx, elements, width, height);
        break;
      case 'heap':
        drawHeap(ctx, elements, width, height);
        break;
      case 'linkedList':
        drawLinkedList(ctx, elements, width, height);
        break;
      case 'binaryTree':
        drawBinaryTree(ctx, elements, width, height);
        break;
      case 'adjacencyList':
      case 'adjacencyMatrix':
        drawGraph(ctx, width, height);
        break;
      case 'doublyLinkedList':
        drawDoublyLinkedList(ctx, elements, width, height);
        break;
      default:
        break;
    }
  };
  
  // Prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, dataStructurePrompts.length - 1));
  };
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  };

  // Draw stack visualization
  const drawStack = (ctx, elements, width, height) => {
    const boxWidth = 100;
    const boxHeight = 40;
    const startX = width / 2 - boxWidth / 2;
    const startY = height - 50;
    
    // Draw stack container
    ctx.strokeStyle = '#90caf9';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 10, startY - (elements.length * boxHeight) - 10, boxWidth + 20, (elements.length * boxHeight) + 20);
    
    // Draw stack elements
    elements.forEach((element, index) => {
      const y = startY - (index + 1) * boxHeight;
      
      // Draw box
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(startX, y, boxWidth, boxHeight);
      
      // Draw border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, y, boxWidth, boxHeight);
      
      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.toString(), startX + boxWidth / 2, y + boxHeight / 2);
    });
    
    // Draw top indicator
    if (elements.length > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Top', startX + boxWidth + 15, startY - elements.length * boxHeight);
      
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(startX + boxWidth + 10, startY - elements.length * boxHeight);
      ctx.lineTo(startX + boxWidth, startY - elements.length * boxHeight);
      ctx.stroke();
    }
  };

  // Draw queue visualization
  const drawQueue = (ctx, elements, width, height) => {
    const boxWidth = 60;
    const boxHeight = 40;
    const startX = 50;
    const startY = height / 2;
    
    // Draw queue container
    ctx.strokeStyle = '#90caf9';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX - 10, startY - 10, (elements.length * boxWidth) + 20, boxHeight + 20);
    
    // Draw queue elements
    elements.forEach((element, index) => {
      const x = startX + index * boxWidth;
      
      // Draw box
      ctx.fillStyle = '#9c27b0';
      ctx.fillRect(x, startY, boxWidth, boxHeight);
      
      // Draw border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, startY, boxWidth, boxHeight);
      
      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.toString(), x + boxWidth / 2, startY + boxHeight / 2);
    });
    
    // Draw front and rear indicators
    if (elements.length > 0) {
      // Front indicator
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Front', startX + boxWidth / 2, startY - 20);
      
      // Rear indicator
      ctx.fillText('Rear', startX + (elements.length - 1) * boxWidth + boxWidth / 2, startY - 20);
    }
  };

  // Draw linked list visualization
  const drawLinkedList = (ctx, elements, width, height) => {
    const nodeRadius = 25;
    const horizontalSpacing = 100;
    const startX = 50;
    const startY = height / 2;
    
    // Draw linked list nodes
    elements.forEach((element, index) => {
      const x = startX + index * horizontalSpacing;
      
      // Draw node circle
      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.toString(), x, startY);
      
      // Draw arrow to next node
      if (index < elements.length - 1) {
        const nextX = startX + (index + 1) * horizontalSpacing;
        
        // Draw arrow line
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius, startY);
        ctx.lineTo(nextX - nodeRadius, startY);
        ctx.stroke();
        
        // Draw arrow head
        ctx.beginPath();
        ctx.moveTo(nextX - nodeRadius, startY);
        ctx.lineTo(nextX - nodeRadius - 10, startY - 5);
        ctx.lineTo(nextX - nodeRadius - 10, startY + 5);
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw null pointer for last node
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius, startY);
        ctx.lineTo(x + nodeRadius + 30, startY);
        ctx.stroke();
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText('null', x + nodeRadius + 45, startY);
      }
    });
    
    // Draw head pointer
    if (elements.length > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Head', startX, startY - nodeRadius - 15);
    }
  };

  // Draw doubly linked list visualization
  const drawDoublyLinkedList = (ctx, elements, width, height) => {
    const nodeRadius = 25;
    const horizontalSpacing = 100;
    const startX = 50;
    const startY = height / 2;
    
    // Draw doubly linked list nodes
    elements.forEach((element, index) => {
      const x = startX + index * horizontalSpacing;
      
      // Draw node circle
      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, startY, nodeRadius, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.toString(), x, startY);
      
      // Draw next pointer
      if (index < elements.length - 1) {
        const nextX = startX + (index + 1) * horizontalSpacing;
        
        // Draw arrow line
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius, startY);
        ctx.lineTo(nextX - nodeRadius, startY);
        ctx.stroke();
        
        // Draw arrow head
        ctx.beginPath();
        ctx.moveTo(nextX - nodeRadius, startY);
        ctx.lineTo(nextX - nodeRadius - 10, startY - 5);
        ctx.lineTo(nextX - nodeRadius - 10, startY + 5);
        ctx.closePath();
        ctx.fill();
      }
      
      // Draw prev pointer
      if (index > 0) {
        const prevX = startX + (index - 1) * horizontalSpacing;
        
        // Draw arrow line
        ctx.strokeStyle = '#666666';
        ctx.setLineDash([5, 5]); // Dashed line for prev pointer
        ctx.beginPath();
        ctx.moveTo(x - nodeRadius, startY);
        ctx.lineTo(prevX + nodeRadius, startY);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw arrow head
        ctx.beginPath();
        ctx.moveTo(prevX + nodeRadius, startY);
        ctx.lineTo(prevX + nodeRadius + 10, startY - 5);
        ctx.lineTo(prevX + nodeRadius + 10, startY + 5);
        ctx.closePath();
        ctx.fill();
      }
    });
    
    // Draw head and tail pointers
    if (elements.length > 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Head', startX, startY - nodeRadius - 15);
      ctx.fillText('Tail', startX + (elements.length - 1) * horizontalSpacing, startY - nodeRadius - 15);
    }
  };

  // Draw binary tree visualization
  const drawBinaryTree = (ctx, elements, width, height) => {
    if (elements.length === 0) return;
    
    const nodeRadius = 25;
    const levelHeight = 80;
    const startX = width / 2;
    const startY = 50;
    
    // Create tree structure from elements array
    const createTree = (elements) => {
      if (elements.length === 0) return null;
      
      const root = { value: elements[0], left: null, right: null };
      
      // Helper function to insert a value into the BST
      const insertNode = (node, value) => {
        if (value < node.value) {
          if (node.left === null) {
            node.left = { value, left: null, right: null };
          } else {
            insertNode(node.left, value);
          }
        } else {
          if (node.right === null) {
            node.right = { value, left: null, right: null };
          } else {
            insertNode(node.right, value);
          }
        }
      };
      
      // Insert all elements into the tree
      for (let i = 1; i < elements.length; i++) {
        insertNode(root, elements[i]);
      }
      
      return root;
    };
    
    const tree = createTree(elements);
    
    // Calculate the maximum depth of the tree
    const getMaxDepth = (node) => {
      if (node === null) return 0;
      return 1 + Math.max(getMaxDepth(node.left), getMaxDepth(node.right));
    };
    
    const maxDepth = getMaxDepth(tree);
    
    // Calculate the width needed for the tree
    const treeWidth = Math.pow(2, maxDepth - 1) * 120;
    
    // Draw the tree recursively
    const drawNode = (node, x, y, level, parentX, parentY) => {
      if (node === null) return;
      
      // Draw connection line to parent if not root
      if (parentX !== null && parentY !== null) {
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(parentX, parentY + nodeRadius);
        ctx.lineTo(x, y - nodeRadius);
        ctx.stroke();
      }
      
      // Draw node circle
      ctx.fillStyle = '#4caf50';
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), x, y);
      
      // Calculate horizontal spacing for this level
      const spacing = treeWidth / Math.pow(2, level);
      
      // Draw left and right children
      drawNode(node.left, x - spacing / 2, y + levelHeight, level + 1, x, y);
      drawNode(node.right, x + spacing / 2, y + levelHeight, level + 1, x, y);
    };
    
    // Start drawing from the root
    drawNode(tree, startX, startY, 0, null, null);
    
    // Draw root label
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Root', startX, startY - nodeRadius - 15);
  };

  // Draw heap visualization
  const drawHeap = (ctx, elements, width, height) => {
    if (elements.length === 0) {
      // Draw empty heap message
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Empty Heap', width / 2, height / 2);
      return;
    }
    
    const nodeRadius = 25;
    const levelHeight = 60;
    const startY = 50;
    
    // Calculate the number of levels in the heap
    const levels = Math.floor(Math.log2(elements.length)) + 1;
    
    // Draw heap nodes level by level
    for (let level = 0; level < levels; level++) {
      const nodesInLevel = Math.min(Math.pow(2, level), elements.length - Math.pow(2, level) + 1);
      const levelWidth = nodesInLevel * (nodeRadius * 2 + 20);
      const startX = (width - levelWidth) / 2 + nodeRadius;
      
      for (let i = 0; i < nodesInLevel; i++) {
        const index = Math.pow(2, level) - 1 + i;
        if (index >= elements.length) break;
        
        const x = startX + i * (nodeRadius * 2 + 20);
        const y = startY + level * levelHeight;
        
        // Draw node circle
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw node value
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(elements[index].toString(), x, y);
        
        // Draw connections to children
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        
        if (leftChildIndex < elements.length) {
          const childLevel = level + 1;
          const childIndex = leftChildIndex - (Math.pow(2, childLevel) - 1);
          const childX = (width - (Math.min(Math.pow(2, childLevel), elements.length - Math.pow(2, childLevel) + 1) * (nodeRadius * 2 + 20))) / 2 + nodeRadius + childIndex * (nodeRadius * 2 + 20);
          const childY = startY + childLevel * levelHeight;
          
          // Draw line to left child
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(childX, childY - nodeRadius);
          ctx.stroke();
        }
        
        if (rightChildIndex < elements.length) {
          const childLevel = level + 1;
          const childIndex = rightChildIndex - (Math.pow(2, childLevel) - 1);
          const childX = (width - (Math.min(Math.pow(2, childLevel), elements.length - Math.pow(2, childLevel) + 1) * (nodeRadius * 2 + 20))) / 2 + nodeRadius + childIndex * (nodeRadius * 2 + 20);
          const childY = startY + childLevel * levelHeight;
          
          // Draw line to right child
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(childX, childY - nodeRadius);
          ctx.stroke();
        }
      }
    }
    
    // Draw heap property explanation
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Max Heap Property: Parent ≥ Children', 10, height - 10);
  };

  // Add mouse move handler
  const handleMouseMove = (event) => {
    if (!isEdgeMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  // Modify drawGraph to make vertices more prominent and easier to click
  const drawGraph = (ctx, width, height) => {
    if (dataStructure === 'adjacencyList' || dataStructure === 'adjacencyMatrix') {
      const vertexRadius = 35; // Increased from 30 to 35
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;

      // Draw edges first (so they appear behind vertices)
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      edges.forEach(([v1, v2]) => {
        const index1 = vertices.indexOf(v1);
        const index2 = vertices.indexOf(v2);
        const angle1 = (2 * Math.PI * index1) / vertices.length;
        const angle2 = (2 * Math.PI * index2) / vertices.length;
        const x1 = centerX + radius * Math.cos(angle1);
        const y1 = centerY + radius * Math.sin(angle1);
        const x2 = centerX + radius * Math.cos(angle2);
        const y2 = centerY + radius * Math.sin(angle2);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw edge preview line if in edge mode
      if (isEdgeMode && selectedVertex) {
        const index = vertices.indexOf(selectedVertex);
        const angle = (2 * Math.PI * index) / vertices.length;
        const startX = centerX + radius * Math.cos(angle);
        const startY = centerY + radius * Math.sin(angle);

        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed line for preview
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(mousePosition.x, mousePosition.y);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
      }

      // Draw vertices
      vertices.forEach((vertex, index) => {
        const angle = (2 * Math.PI * index) / vertices.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Draw vertex circle with different colors and effects based on state
        let fillColor = '#2196f3'; // Default blue
        let strokeWidth = 2;
        let glowSize = 0;
        
        if (selectedVertex === vertex) {
          fillColor = '#4caf50'; // Green for selected
          strokeWidth = 3;
          glowSize = 15;
        } else if (isEdgeMode) {
          fillColor = '#ff9800'; // Orange for edge mode
          strokeWidth = 2;
          glowSize = 10;
        }

        // Draw glow effect for clickable vertices
        if (glowSize > 0) {
          ctx.shadowColor = fillColor;
          ctx.shadowBlur = glowSize;
        }

        // Draw outer circle for better click detection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(x, y, vertexRadius + 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw main vertex circle
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(x, y, vertexRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.arc(x, y, vertexRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Draw vertex label with better contrast
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(vertex, x, y);
      });
    }
  };

  // Modify handleCanvasClick to improve vertex detection
  const handleCanvasClick = (event) => {
    if (dataStructure !== 'adjacencyList' && dataStructure !== 'adjacencyMatrix') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a vertex with increased detection radius
    const vertexRadius = 35; // Increased from 30 to 35
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;

    // Find the closest vertex to the click
    let closestVertex = null;
    let minDistance = Infinity;

    vertices.forEach((vertex, index) => {
      const angle = (2 * Math.PI * index) / vertices.length;
      const vertexX = centerX + radius * Math.cos(angle);
      const vertexY = centerY + radius * Math.sin(angle);

      const distance = Math.sqrt(
        Math.pow(x - vertexX, 2) + Math.pow(y - vertexY, 2)
      );

      if (distance <= vertexRadius && distance < minDistance) {
        minDistance = distance;
        closestVertex = vertex;
      }
    });

    if (closestVertex) {
      if (isEdgeMode) {
        // If in edge mode and we have a selected vertex, create the edge
        if (selectedVertex && selectedVertex !== closestVertex) {
          const newEdges = [...edges, [selectedVertex, closestVertex]];
          setEdges(newEdges);

          if (dataStructure === 'adjacencyMatrix') {
            const index1 = vertices.indexOf(selectedVertex);
            const index2 = vertices.indexOf(closestVertex);
            const newMatrix = [...adjacencyMatrix];
            newMatrix[index1][index2] = 1;
            newMatrix[index2][index1] = 1;
            setAdjacencyMatrix(newMatrix);
          } else {
            setAdjacencyList(prev => ({
              ...prev,
              [selectedVertex]: [...prev[selectedVertex], closestVertex],
              [closestVertex]: [...prev[closestVertex], selectedVertex]
            }));
          }

          setOperations(prev => [...prev, `AddEdge(${selectedVertex} -> ${closestVertex})`]);
          setExplanation(`Added edge between ${selectedVertex} and ${closestVertex}.`);
          drawDataStructure();
        }
        // Reset edge mode
        setIsEdgeMode(false);
        setSelectedVertex(null);
      } else {
        // Select vertex for edge creation
        setSelectedVertex(closestVertex);
        setIsEdgeMode(true);
        setExplanation(`Selected vertex ${closestVertex}. Click another vertex to create an edge.`);
      }
    }
  };

  // Add element to data structure
  const addElement = () => {
    if (newValue.trim() === '') {
      setExplanation('Please enter a value to add.');
      return;
    }
    
    if (elements.length >= maxElements) {
      setExplanation(`Cannot add more elements. Maximum size (${maxElements}) reached.`);
      return;
    }
    
    const value = newValue.trim();
    let newElements = [];
    let operation = '';
    let explanation = '';
    let lines = [];
    
    switch (dataStructure) {
      case 'stack':
        newElements = [...elements, value];
        operation = `Push(${value})`;
        explanation = `Pushed ${value} to the top of the stack with O(1) time complexity.`;
        lines = getHighlightedLines('add');
        break;
      case 'queue':
        newElements = [...elements, value];
        operation = `Enqueue(${value})`;
        explanation = `Enqueued ${value} to the rear of the queue with O(1) time complexity.`;
        lines = getHighlightedLines('add');
        break;
      case 'heap':
        // For heap, we need to maintain the heap property
        newElements = [...elements, value];
        // Simple heapify up implementation for visualization
        let index = newElements.length - 1;
        while (index > 0) {
          const parentIndex = Math.floor((index - 1) / 2);
          if (parseInt(newElements[index]) > parseInt(newElements[parentIndex])) {
            // Swap with parent
            [newElements[index], newElements[parentIndex]] = [newElements[parentIndex], newElements[index]];
            index = parentIndex;
          } else {
            break;
          }
        }
        operation = `Insert(${value})`;
        explanation = `Inserted ${value} into the heap with O(log n) time complexity.`;
        lines = getHighlightedLines('add');
        break;
      case 'linkedList':
        newElements = [...elements, value];
        operation = `Append(${value})`;
        explanation = `Appended ${value} to the end of the linked list with O(1) time complexity.`;
        lines = getHighlightedLines('add');
        break;
      case 'binaryTree':
        newElements = [...elements, value];
        operation = `Insert(${value})`;
        explanation = `Inserted ${value} into the binary tree. For a balanced tree, insertion has O(log n) time complexity, but in worst case it can be O(n).`;
        lines = getHighlightedLines('add');
        break;
      case 'adjacencyList':
      case 'adjacencyMatrix':
        addVertex();
        return;
      case 'doublyLinkedList':
        newElements = [...elements, value];
        operation = `Append(${value})`;
        explanation = `Appended ${value} to the end of the doubly linked list with O(1) time complexity.`;
        lines = getHighlightedLines('add');
        break;
      default:
        break;
    }
    
    setElements(newElements);
    setOperations([...operations, operation]);
    setExplanation(explanation);
    setHighlightedLines(lines);
    setNewValue('');
    drawDataStructure(newElements);
  };

  // Remove element from data structure
  const removeElement = () => {
    if (elements.length === 0) {
      setExplanation(`Cannot remove from an empty ${dataStructureInfo[dataStructure].name.toLowerCase()}.`);
      return;
    }
    
    let newElements = [];
    let removedValue = '';
    let operation = '';
    let explanation = '';
    let lines = [];
    
    switch (dataStructure) {
      case 'heap':
        // For heap, we always remove the maximum element (root)
        removedValue = elements[0];
        newElements = [...elements];
        
        // Replace root with last element
        newElements[0] = newElements[newElements.length - 1];
        newElements.pop();
        
        // Simple heapify down implementation for visualization
        let index = 0;
        while (true) {
          let largestIndex = index;
          const leftChildIndex = 2 * index + 1;
          const rightChildIndex = 2 * index + 2;
          
          if (leftChildIndex < newElements.length && parseInt(newElements[leftChildIndex]) > parseInt(newElements[largestIndex])) {
            largestIndex = leftChildIndex;
          }
          
          if (rightChildIndex < newElements.length && parseInt(newElements[rightChildIndex]) > parseInt(newElements[largestIndex])) {
            largestIndex = rightChildIndex;
          }
          
          if (largestIndex === index) {
            break;
          }
          
          // Swap with the larger child
          [newElements[index], newElements[largestIndex]] = [newElements[largestIndex], newElements[index]];
          index = largestIndex;
        }
        
        operation = 'ExtractMax()';
        explanation = `Extracted maximum value ${removedValue} from the heap with O(log n) time complexity.`;
        lines = getHighlightedLines('remove');
        break;
      case 'stack':
        removedValue = elements[elements.length - 1];
        newElements = elements.slice(0, -1);
        operation = 'Pop()';
        explanation = `Popped ${removedValue} from the top of the stack with O(1) time complexity.`;
        lines = getHighlightedLines('remove');
        break;
      case 'queue':
        removedValue = elements[0];
        newElements = elements.slice(1);
        operation = 'Dequeue()';
        explanation = `Dequeued ${removedValue} from the front of the queue with O(1) time complexity.`;
        lines = getHighlightedLines('remove');
        break;
      case 'linkedList':
        removedValue = elements[0];
        newElements = elements.slice(1);
        operation = 'RemoveHead()';
        explanation = `Removed head node with value ${removedValue} from the linked list with O(1) time complexity.`;
        lines = getHighlightedLines('remove');
        break;
      case 'adjacencyList':
      case 'adjacencyMatrix':
        removeVertex();
        return;
      case 'doublyLinkedList':
        removedValue = elements[0];
        newElements = elements.slice(1);
        operation = 'RemoveHead()';
        explanation = `Removed head node with value ${removedValue} from the doubly linked list with O(1) time complexity.`;
        lines = getHighlightedLines('remove');
        break;
      default:
        break;
    }
    
    setElements(newElements);
    setOperations([...operations, operation]);
    setExplanation(explanation);
    setHighlightedLines(lines);
    drawDataStructure(newElements);
  };

  // Add useEffect to handle canvas rendering when vertices change
  useEffect(() => {
    if (dataStructure === 'adjacencyList' || dataStructure === 'adjacencyMatrix') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGraph(ctx, canvas.width, canvas.height);
      }
    }
  }, [vertices, edges, selectedVertex, isEdgeMode, dataStructure]);

  // Add graph operation handlers
  const addVertex = () => {
    if (newValue.trim() === '') {
      setExplanation('Please enter a vertex name.');
      return;
    }
    
    const vertex = newValue.trim();
    if (vertices.includes(vertex)) {
      setExplanation('Vertex already exists.');
      return;
    }

    // Update all states synchronously
    const newVertices = [...vertices, vertex];
    const newAdjacencyList = {
      ...adjacencyList,
      [vertex]: []
    };
    const newAdjacencyMatrix = dataStructure === 'adjacencyMatrix' 
      ? [...adjacencyMatrix.map(row => [...row, 0]), new Array(newVertices.length).fill(0)]
      : adjacencyMatrix;

    // Update all states at once
    setVertices(newVertices);
    setAdjacencyList(newAdjacencyList);
    setAdjacencyMatrix(newAdjacencyMatrix);
    setOperations(prev => [...prev, `AddVertex(${vertex})`]);
    setExplanation(`Added vertex ${vertex} to the graph.`);
    setHighlightedLines(dataStructure === 'adjacencyList' ? [8, 9, 10, 11, 12] : [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    setNewValue('');
  };

  const addEdge = () => {
    if (!selectedVertex) {
      setExplanation('Please select a vertex first.');
      return;
    }
    if (newValue.trim() === '') {
      setExplanation('Please enter a target vertex name.');
      return;
    }

    const targetVertex = newValue.trim();
    if (!vertices.includes(targetVertex)) {
      setExplanation('Target vertex does not exist.');
      return;
    }

    const newEdges = [...edges, [selectedVertex, targetVertex]];
    setEdges(newEdges);

    if (dataStructure === 'adjacencyMatrix') {
      const index1 = vertices.indexOf(selectedVertex);
      const index2 = vertices.indexOf(targetVertex);
      const newMatrix = [...adjacencyMatrix];
      newMatrix[index1][index2] = 1;
      newMatrix[index2][index1] = 1;
      setAdjacencyMatrix(newMatrix);
    } else {
      setAdjacencyList(prev => ({
        ...prev,
        [selectedVertex]: [...prev[selectedVertex], targetVertex],
        [targetVertex]: [...prev[targetVertex], selectedVertex]
      }));
    }

    setOperations(prev => [...prev, `AddEdge(${selectedVertex} -> ${targetVertex})`]);
    setExplanation(`Added edge between ${selectedVertex} and ${targetVertex}.`);
    setHighlightedLines(dataStructure === 'adjacencyList' ? [10, 11, 12, 13, 14, 15, 16, 17] : [13, 14, 15, 16, 17, 18, 19]);
    setNewValue('');
    drawDataStructure();
  };

  // Remove vertex from graph
  const removeVertex = () => {
    if (!selectedVertex) {
      setExplanation('Please select a vertex first.');
      return;
    }

    const newVertices = vertices.filter((vertex) => vertex !== selectedVertex);
    const newEdges = edges.filter(([v1, v2]) => v1 !== selectedVertex && v2 !== selectedVertex);

    setVertices(newVertices);
    setEdges(newEdges);
    setSelectedVertex(null);
    setIsEdgeMode(false);

    if (dataStructure === 'adjacencyMatrix') {
      const newMatrix = adjacencyMatrix.map((row) => row.filter((_, index) => index !== vertices.indexOf(selectedVertex)));
      setAdjacencyMatrix(newMatrix);
    } else {
      setAdjacencyList(prev => ({
        ...prev,
        [selectedVertex]: []
      }));
    }

    setOperations(prev => [...prev, `RemoveVertex(${selectedVertex})`]);
    setExplanation(`Removed vertex ${selectedVertex} from the graph.`);
    setHighlightedLines(getHighlightedLines('removeVertex'));
    drawDataStructure();
  };

  // Initialize component
  useEffect(() => {
    resetDataStructure();
  }, [dataStructure]);

  // Add these helper functions before the return statement
  const getCurrentOperation = () => {
    switch (dataStructure) {
      case 'stack':
        return codeSnippets.stack.push;
      case 'queue':
        return codeSnippets.queue.enqueue;
      case 'heap':
        return codeSnippets.heap.insert;
      case 'linkedList':
        return codeSnippets.linkedList.append;
      case 'binaryTree':
        return codeSnippets.binaryTree.insert;
      case 'adjacencyList':
        return codeSnippets.adjacencyList.addVertex;
      case 'adjacencyMatrix':
        return codeSnippets.adjacencyMatrix.addVertex;
      case 'doublyLinkedList':
        return codeSnippets.doublyLinkedList.append;
      default:
        return '';
    }
  };

  const getOperationButtons = () => {
    switch (dataStructure) {
      case 'stack':
        return (
          <>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1].startsWith('Push') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([9, 10, 11]);
                setExplanation('The push operation adds an element to the top of the stack with O(1) time complexity.');
              }}
            >
              Push
            </Button>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1] === 'Pop()' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([15, 16, 17, 18, 19, 20]);
                setExplanation('The pop operation removes and returns the top element from the stack with O(1) time complexity.');
              }}
            >
              Pop
            </Button>
          </>
        );
      case 'queue':
        return (
          <>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1].startsWith('Enqueue') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([9, 10, 11]);
                setExplanation('The enqueue operation adds an element to the rear of the queue with O(1) time complexity.');
              }}
            >
              Enqueue
            </Button>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1] === 'Dequeue()' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([15, 16, 17, 18, 19, 20]);
                setExplanation('The dequeue operation removes and returns the front element from the queue with O(1) time complexity.');
              }}
            >
              Dequeue
            </Button>
          </>
        );
      case 'heap':
        return (
          <>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1].startsWith('Insert') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([31, 32, 33, 34, 35, 36, 37, 38]);
                setExplanation('The insert operation adds an element to the heap and maintains the heap property with O(log n) time complexity.');
              }}
            >
              Insert
            </Button>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1] === 'ExtractMax()' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([35, 36, 37, 38, 39, 40, 41, 42, 43, 44]);
                setExplanation('The removeHead operation removes and returns the first node from the linked list with O(1) time complexity.');
              }}
            >
              Remove Head
            </Button>
          </>
        );
      case 'adjacencyList':
      case 'adjacencyMatrix':
        return (
          <>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1].startsWith('AddVertex') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([8, 9, 10, 11, 12]);
                setExplanation('The addVertex operation adds a new vertex to the graph.');
              }}
            >
              Add Vertex
            </Button>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1].startsWith('AddEdge') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
                setExplanation('The addEdge operation adds an edge between two vertices.');
              }}
            >
              Add Edge
            </Button>
          </>
        );
      case 'doublyLinkedList':
        return (
          <>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1].startsWith('Append') ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([25, 26, 27, 28, 29, 30]);
                setExplanation('The append operation adds a new node to the doubly linked list with O(1) time complexity.');
              }}
            >
              Append
            </Button>
            <Button
              variant={operations.length > 0 && operations[operations.length - 1] === 'RemoveHead()' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setHighlightedLines([35, 36, 37, 38, 39, 40]);
                setExplanation('The removeHead operation removes and returns the head node from the doubly linked list with O(1) time complexity.');
              }}
            >
              Remove Head
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // Add getHighlightedLines function
  const getHighlightedLines = (operation) => {
    switch (operation) {
      case 'add':
        switch (dataStructure) {
          case 'stack':
            return [8, 9, 10, 11, 12]; // push operation
          case 'queue':
            return [8, 9, 10, 11, 12]; // enqueue operation
          case 'heap':
            return [31, 32, 33, 34, 35, 36, 37, 38]; // insert operation
          case 'linkedList':
            return [25, 26, 27, 28, 29, 30]; // append operation
          case 'doublyLinkedList':
            return [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]; // append operation
          case 'binaryTree':
            return [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]; // insert operation
          default:
            return [];
        }
      case 'remove':
        switch (dataStructure) {
          case 'stack':
            return [15, 16, 17, 18, 19, 20]; // pop operation
          case 'queue':
            return [15, 16, 17, 18, 19, 20]; // dequeue operation
          case 'heap':
            return [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]; // extractMax operation
          case 'linkedList':
            return [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]; // removeHead operation
          case 'doublyLinkedList':
            return [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]; // removeHead operation
          case 'binaryTree':
            return [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]; // remove operation
          default:
            return [];
        }
      case 'addVertex':
        return dataStructure === 'adjacencyList' 
          ? [8, 9, 10, 11, 12] // Adjacency List addVertex
          : [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // Adjacency Matrix addVertex
      case 'addEdge':
        return dataStructure === 'adjacencyList'
          ? [15, 16, 17, 18, 19, 20, 21, 22, 23, 24] // Adjacency List addEdge
          : [21, 22, 23, 24, 25, 26, 27, 28]; // Adjacency Matrix addEdge
      case 'removeVertex':
        return [4, 5, 6]; // removeVertex operation
      default:
        return [];
    }
  };

  return (
    <VisualizerLayout
      title="Data Structure Visualizer"
      prompts={dataStructurePrompts}
      promptStep={promptStep}
      onNextPrompt={handleNextPrompt}
      onPreviousPrompt={handlePreviousPrompt}
      onFinishPrompts={handleFinishPrompts}
      showPrompts={showPrompts}
      algorithmData={dataStructureInfo[dataStructure]}
      controls={
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Data Structure</InputLabel>
            <Select
              value={dataStructure}
              label="Data Structure"
              onChange={(e) => {
                setDataStructure(e.target.value);
                setHighlightedLines([]);
                resetDataStructure();
              }}
            >
              <MenuItem value="stack">Stack</MenuItem>
              <MenuItem value="queue">Queue</MenuItem>
              <MenuItem value="heap">Heap</MenuItem>
              <MenuItem value="linkedList">Linked List</MenuItem>
              <MenuItem value="doublyLinkedList">Doubly Linked List</MenuItem>
              <MenuItem value="binaryTree">Binary Tree</MenuItem>
              <MenuItem value="adjacencyList">Adjacency List</MenuItem>
              <MenuItem value="adjacencyMatrix">Adjacency Matrix</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Max Elements</Typography>
            <Slider
              value={maxElements}
              min={5}
              max={20}
              onChange={(_, value) => setMaxElements(value)}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label={dataStructure.includes('adjacency') 
                ? (isEdgeMode ? "Click another vertex to create edge" : "Enter vertex name")
                : "Value"}
              variant="outlined"
              size="small"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              helperText={dataStructure.includes('adjacency') 
                ? (isEdgeMode 
                    ? "Click another vertex to create an edge"
                    : "Enter a name for the new vertex")
                : "Enter a value to add"}
              disabled={isEdgeMode}
              sx={{ mr: 1, flexGrow: 1 }}
            />
            {dataStructure.includes('adjacency') ? (
              <>
                <Tooltip title={isEdgeMode ? "Cancel Edge Creation" : "Add Vertex"}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      if (isEdgeMode) {
                        setIsEdgeMode(false);
                        setSelectedVertex(null);
                        setExplanation('Edge creation cancelled.');
                      } else {
                        addElement();
                      }
                    }}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {isEdgeMode ? <RefreshIcon /> : <AddCircleIcon />}
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <IconButton
                  color="primary"
                  onClick={addElement}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <Tooltip title="Add Element">
                    <AddCircleIcon />
                  </Tooltip>
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={removeElement}
                  size="small"
                >
                  <Tooltip title="Remove Element">
                    <RemoveCircleIcon />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetDataStructure}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            Reset
          </Button>
        </>
      }
      visualization={
        <>
          {/* Canvas for visualization */}
          <Box sx={{ 
            mb: 2, 
            height: '500px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            borderRadius: 1
          }}>
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'block',
                cursor: dataStructure.includes('adjacency') ? 'pointer' : 'default'
              }}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
            />
          </Box>
          
          {/* Operations History */}
          <Paper variant="outlined" sx={{ p: 1, mb: 2, maxHeight: 100, overflow: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Operations:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {operations.map((op, index) => (
                <Chip key={index} label={op} size="small" variant="outlined" />
              ))}
            </Box>
          </Paper>
          
          {/* Explanation */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                <HelpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Explanation:
              </Typography>
              <Typography variant="body2">{explanation || 'No operations performed yet.'}</Typography>
            </CardContent>
          </Card>
          
          {/* Code Display */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Implementation Code:
            </Typography>
            <CodeHighlighter
              code={getCurrentOperation() || '// Select an operation to see the code'}
              language="javascript"
              highlightedLines={highlightedLines}
              title={`${dataStructureInfo[dataStructure].name} Implementation`}
            />
          </Box>
        </>
      }
    />
  );
};

export default DataStructureVisualizer;