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
            return [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130, 1131, 1132, 1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190, 1191, 1192, 1193, 1194, 1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228, 1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300, 1301, 1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367, 1368, 1369, 1370, 1371, 1372, 1373, 1374, 1375, 1376, 1377, 1378, 1379, 1380, 1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1400, 1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415, 1416, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428, 1429, 1430, 1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440, 1441, 1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479, 1480, 1481, 1482, 1483, 1484, 1485, 1486, 1487, 1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1515, 1516, 1517, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531, 1532, 1533, 1534, 1535, 1536, 1537, 1538, 1539, 1540, 1541, 1542, 1543, 1544, 1545, 1546, 1547, 1548, 1549, 1550, 1551, 1552, 1553, 1554, 1555, 1556, 1557, 1558, 1559, 1560, 1561, 1562, 1563, 1564, 1565, 1566, 1567, 1568, 1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1595, 1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610, 1611]; // extractMax operation
          case 'linkedList':
            return [35, 36, 37, 38, 39, 40, 41, 42, 43, 44]; // removeHead operation
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