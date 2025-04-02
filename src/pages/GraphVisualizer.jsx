import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Divider,
  Tooltip,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { RestartAlt as RestartAltIcon } from '@mui/icons-material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';

const GraphVisualizer = () => {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [algorithm, setAlgorithm] = useState('bfs');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [nodeCount, setNodeCount] = useState(10);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(5);
  const [algorithmHistory, setAlgorithmHistory] = useState([]);
  const [result, setResult] = useState({ path: [], visited: [] });
  const [highlightedLines, setHighlightedLines] = useState([]);
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Graph algorithm prompts
  const graphPrompts = [
    {
      title: 'Welcome to Graph Algorithm Visualizer',
      content: 'This tool helps you understand how different graph algorithms work by visualizing the process step by step. You can see the algorithms in action and learn about their efficiency.'
    },
    {
      title: 'Choose an Algorithm',
      content: 'Select a graph algorithm from the dropdown menu. Each algorithm has different characteristics and performance metrics. You can learn about their time and space complexity in the information panel.'
    },
    {
      title: 'Generate a Graph',
      content: 'Click the "Generate Random Graph" button to create a new graph to visualize. You can also adjust the number of nodes using the slider.'
    },
    {
      title: 'Set Start and End Nodes',
      content: 'Select the start and end nodes for the algorithm to use. Different algorithms will find paths between these nodes in different ways.'
    },
    {
      title: 'Control the Visualization',
      content: 'Use the play, pause, and step buttons to control the visualization. You can also adjust the speed to see the algorithm process faster or slower.'
    }
  ];
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Code snippets for each graph algorithm
  const codeSnippets = {
    bfs: `// Breadth-First Search Implementation
function bfs(graph, start, end) {
  // Initialize visited array and queue
  const visited = [];
  const queue = [start];
  const prev = Array(graph.nodes.length).fill(-1);
  
  // Mark start node as visited
  visited.push(start);
  
  // Continue until queue is empty
  while (queue.length > 0) {
    // Get the next node from queue
    const current = queue.shift();
    
    // Check if we've reached the target node
    if (current === end) {
      // Reconstruct path
      const path = [];
      let at = end;
      while (at !== start) {
        if (at === -1) break;
        const prevNode = prev[at];
        path.push({ source: prevNode, target: at });
        at = prevNode;
      }
      path.reverse();
      
      return { visited, path };
    }
    
    // Find all neighbors of current node
    const neighbors = graph.edges
      .filter(edge => edge.source === current)
      .map(edge => edge.target);
    
    // Add unvisited neighbors to queue
    for (const neighbor of neighbors) {
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        prev[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }
  
  // No path found
  return { visited, path: [] };
}`,
    
    dfs: `// Depth-First Search Implementation
function dfs(graph, start, end) {
  // Initialize visited array and stack
  const visited = [];
  const stack = [start];
  const prev = Array(graph.nodes.length).fill(-1);
  
  // Continue until stack is empty
  while (stack.length > 0) {
    // Get the next node from stack
    const current = stack.pop();
    
    // Skip if already visited
    if (visited.includes(current)) continue;
    
    // Mark as visited
    visited.push(current);
    
    // Check if we've reached the target node
    if (current === end) {
      // Reconstruct path
      const path = [];
      let at = end;
      while (at !== start) {
        if (at === -1) break;
        const prevNode = prev[at];
        path.push({ source: prevNode, target: at });
        at = prevNode;
      }
      path.reverse();
      
      return { visited, path };
    }
    
    // Find all neighbors
    const neighbors = graph.edges
      .filter(edge => edge.source === current)
      .map(edge => edge.target);
    
    // Add unvisited neighbors to stack (in reverse order to explore left-to-right)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited.includes(neighbor)) {
        prev[neighbor] = current;
        stack.push(neighbor);
      }
    }
  }
  
  // No path found
  return { visited, path: [] };
}`,
    
    dijkstra: `// Dijkstra's Algorithm Implementation
function dijkstra(graph, start, end) {
  const n = graph.nodes.length;
  const dist = Array(n).fill(Infinity);
  const visited = [];
  const prev = Array(n).fill(-1);
  
  // Distance to start node is 0
  dist[start] = 0;
  
  for (let i = 0; i < n; i++) {
    // Find the node with the minimum distance
    let minDist = Infinity;
    let minNode = -1;
    
    for (let j = 0; j < n; j++) {
      if (!visited.includes(j) && dist[j] < minDist) {
        minDist = dist[j];
        minNode = j;
      }
    }
    
    // If no node found or reached end, break
    if (minNode === -1 || minNode === end) break;
    
    // Mark as visited
    visited.push(minNode);
    
    // Update distances to neighbors
    const edges = graph.edges.filter(edge => edge.source === minNode);
    
    for (const edge of edges) {
      const neighbor = edge.target;
      const weight = edge.weight;
      
      // If new path is shorter, update distance
      if (dist[minNode] + weight < dist[neighbor]) {
        dist[neighbor] = dist[minNode] + weight;
        prev[neighbor] = minNode;
      }
    }
  }
  
  // Check if end node was reached
  if (dist[end] !== Infinity) {
    // Reconstruct path
    const path = [];
    let at = end;
    while (at !== start) {
      if (at === -1) break;
      const prevNode = prev[at];
      path.push({ source: prevNode, target: at });
      at = prevNode;
    }
    path.reverse();
    
    return { visited, path };
  }
  
  // No path found
  return { visited, path: [] };
}`,

    bipartite: `// Bipartite Graph Check Implementation
function isBipartite(graph) {
  const n = graph.nodes.length;
  // Color array: -1 = not colored, 0 = red, 1 = blue
  const color = Array(n).fill(-1);
  const visited = [];
  
  // Function to check bipartite property using BFS
  function checkBipartite(start) {
    const queue = [start];
    color[start] = 0; // Color the start node with red (0)
    visited.push(start);
    
    while (queue.length > 0) {
      const current = queue.shift();
      const currentColor = color[current];
      
      // Get all adjacent vertices
      const neighbors = graph.edges
        .filter(edge => edge.source === current)
        .map(edge => edge.target);
      
      // Process all adjacent vertices
      for (const neighbor of neighbors) {
        // If the neighbor hasn't been colored yet
        if (color[neighbor] === -1) {
          // Color it with the opposite color
          color[neighbor] = 1 - currentColor;
          queue.push(neighbor);
          visited.push(neighbor);
        } 
        // If the neighbor has the same color as current node
        else if (color[neighbor] === currentColor) {
          return { isBipartite: false, conflictEdge: { source: current, target: neighbor } };
        }
      }
    }
    
    return { isBipartite: true, conflictEdge: null };
  }
  
  // Check each disconnected component
  for (let i = 0; i < n; i++) {
    if (color[i] === -1) {
      const result = checkBipartite(i);
      if (!result.isBipartite) {
        return result;
      }
    }
  }
  
  return { isBipartite: true, visited, colors: color };
}`,

    topologicalSort: `// Topological Sort Implementation
function topologicalSort(graph, history) {
  const n = graph.nodes.length;
  const visited = new Set();
  const temp = new Set();  // For cycle detection
  const order = [];  // Topological order
  const hasCycle = { value: false };
  const cycleEdge = { source: -1, target: -1 };
  const visitedNodes = [];
  
  // DFS function
  function dfs(node) {
    // If we're revisiting a node during current exploration, we have a cycle
    if (temp.has(node)) {
      hasCycle.value = true;
      
      history.push({
        visited: [...visitedNodes],
        order: [...order],
        current: node,
        explanation: \`Cycle detected! Node \${graph.nodes[node].label} is being revisited during the current exploration.\`,
        highlightedLines: [14, 15]
      });
      
      return;
    }
    
    // Skip already visited nodes
    if (visited.has(node)) {
      history.push({
        visited: [...visitedNodes],
        order: [...order],
        current: node,
        explanation: \`Node \${graph.nodes[node].label} is already processed. Skipping.\`,
        highlightedLines: [20, 21]
      });
      
      return;
    }
    
    // Mark node as being explored
    temp.add(node);
    visitedNodes.push(node);
    
    history.push({
      visited: [...visitedNodes],
      order: [...order],
      current: node,
      explanation: \`Starting DFS from node \${graph.nodes[node].label}.\`,
      highlightedLines: [25, 26]
    });
    
    // Find all outgoing edges
    const neighbors = graph.edges
      .filter(edge => edge.source === node)
      .map(edge => edge.target);
    
    // Visit all neighbors
    for (const neighbor of neighbors) {
      history.push({
        visited: [...visitedNodes],
        order: [...order],
        current: node,
        examining: neighbor,
        explanation: \`Examining edge from \${graph.nodes[node].label} to \${graph.nodes[neighbor].label}.\`,
        highlightedLines: [34, 35]
      });
      
      if (!visited.has(neighbor)) {
        dfs(neighbor);
        // If we detected a cycle, store the edge and return
        if (hasCycle.value) {
          if (cycleEdge.source === -1) {
            cycleEdge.source = node;
            cycleEdge.target = neighbor;
            
            history.push({
              visited: [...visitedNodes],
              order: [...order],
              current: node,
              examining: neighbor,
              cycleEdge: { source: node, target: neighbor },
              explanation: \`Cycle detected involving edge from \${graph.nodes[node].label} to \${graph.nodes[neighbor].label}.\`,
              highlightedLines: [38, 39, 40]
            });
          }
          return;
        }
      }
    }
    
    // Remove from temp set
    temp.delete(node);
    
    // Add to visited
    visited.add(node);
    
    // Add to order (prepend to get correct order)
    order.unshift(node);
    
    history.push({
      visited: [...visitedNodes],
      order: [...order],
      current: node,
      explanation: \`Finished processing node \${graph.nodes[node].label}. Adding to the topological order.\`,
      highlightedLines: [48, 49, 52]
    });
  }
  
  // Process all nodes
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      history.push({
        visited: [...visitedNodes],
        order: [...order],
        current: i,
        explanation: \`Starting a new DFS from node \${graph.nodes[i].label}.\`,
        highlightedLines: [57, 58]
      });
      
      dfs(i);
      
      if (hasCycle.value) {
        history.push({
          visited: [...visitedNodes],
          order: [],
          current: null,
          cycleEdge: { source: cycleEdge.source, target: cycleEdge.target },
          explanation: 'Topological sort failed: Graph contains a cycle.',
          highlightedLines: [59, 60, 61, 62]
        });
        
        return {
          hasCycle: true,
          order: [],
          cycleEdge: {
            source: cycleEdge.source,
            target: cycleEdge.target
          },
          visited: visitedNodes
        };
      }
    }
  }
  
  history.push({
    visited: [...visitedNodes],
    order: [...order],
    current: null,
    explanation: \`Topological sort complete. Order: \${order.map(node => graph.nodes[node].label).join(' → ')}\`,
    highlightedLines: [74, 75]
  });
  
  return {
    hasCycle: false,
    order,
    visited: visitedNodes
  };
}`,

    graphColoring: `// Graph Coloring Implementation
function graphColoring(graph, maxColors = 4) {
  const n = graph.nodes.length;
  const colors = Array(n).fill(0); // 0 means no color assigned
  const visited = [];
  
  // Function to check if it's safe to color vertex v with color c
  function isSafe(v, c) {
    // Check all adjacent vertices
    const neighbors = graph.edges
      .filter(edge => edge.source === v || edge.target === v)
      .map(edge => edge.source === v ? edge.target : edge.source);
    
    for (const neighbor of neighbors) {
      if (colors[neighbor] === c) {
        return false;
      }
    }
    return true;
  }
  
  // Recursive utility function to solve graph coloring
  function graphColoringUtil(vertex) {
    // Base case: all vertices are colored
    if (vertex === n) {
      return true;
    }
    
    visited.push(vertex);
    
    // Try different colors for vertex
    for (let color = 1; color <= maxColors; color++) {
      // Check if assignment of color is safe
      if (isSafe(vertex, color)) {
        colors[vertex] = color;
        
        // Recur to assign colors to rest of the vertices
        if (graphColoringUtil(vertex + 1)) {
          return true;
        }
        
        // If color doesn't lead to a solution, backtrack
        colors[vertex] = 0;
      }
    }
    
    return false;
  }
  
  // Start with vertex 0
  const possible = graphColoringUtil(0);
  
  return {
    possible,
    colors,
    visited,
    numColors: possible ? Math.max(...colors) : 0
  };
}`
  };
  
  // Algorithm complexity information
  const algorithmInfo = {
    bfs: {
      name: 'Breadth-First Search',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)'
      },
      spaceComplexity: 'O(V)',
      description: 'BFS explores all the vertices at the current level before moving to the next level. It uses a queue data structure and is optimal for finding the shortest path in unweighted graphs.'
    },
    dfs: {
      name: 'Depth-First Search',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)'
      },
      spaceComplexity: 'O(V)',
      description: 'DFS explores as far as possible along each branch before backtracking. It uses a stack data structure and is useful for topological sorting, detecting cycles, and solving puzzles.'
    },
    dijkstra: {
      name: 'Dijkstra\'s Algorithm',
      timeComplexity: {
        best: 'O((V + E) log V)',
        average: 'O((V + E) log V)',
        worst: 'O((V + E) log V)'
      },
      spaceComplexity: 'O(V)',
      description: 'Dijkstra\'s algorithm finds the shortest path from a start node to all other nodes in a weighted graph with non-negative weights. It uses a priority queue to select the next node to process.'
    },
    bipartite: {
      name: 'Bipartite Graph Check',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)'
      },
      spaceComplexity: 'O(V)',
      description: 'Checks if a graph can be divided into two groups such that no two adjacent nodes belong to the same group. Uses BFS to color vertices and detect conflicts.'
    },
    topologicalSort: {
      name: 'Topological Sort',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)'
      },
      spaceComplexity: 'O(V)',
      description: 'A linear ordering of vertices such that for every directed edge (u, v), vertex u comes before v in the ordering. Used for dependency resolution and scheduling.'
    },
    graphColoring: {
      name: 'Graph Coloring (Backtracking)',
      timeComplexity: {
        best: 'O(V + E)',
        average: 'O(V^c)',
        worst: 'O(V^c)' // where c is the number of colors
      },
      spaceComplexity: 'O(V)',
      description: 'Assigns colors to graph vertices such that no two adjacent vertices have the same color. Uses backtracking to find a valid coloring with the minimum number of colors.'
    }
  };

  // Generate random graph
  const generateRandomGraph = () => {
    const nodes = [];
    const minDistance = 80; // Minimum distance between node centers
    const padding = 30; // Padding from canvas edges
    const canvasWidth = 700;
    const canvasHeight = 300;
    
    // Create nodes with non-overlapping positions
    for (let i = 0; i < nodeCount; i++) {
      let newNode;
      let overlapping;
      let attempts = 0;
      const maxAttempts = 100; // Prevent infinite loops
      
      do {
        overlapping = false;
        // Generate a position within canvas bounds with padding
        newNode = {
        id: i,
          x: Math.random() * (canvasWidth - 2 * padding) + padding,
          y: Math.random() * (canvasHeight - 2 * padding) + padding,
        label: String.fromCharCode(65 + i) // A, B, C, ...
        };
        
        // Check distance against all existing nodes
        for (let j = 0; j < nodes.length; j++) {
          const dx = newNode.x - nodes[j].x;
          const dy = newNode.y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minDistance) {
            overlapping = true;
            break;
          }
        }
        
        attempts++;
        // If we've tried too many times and still can't place, relax constraints
        if (attempts > maxAttempts) {
          overlapping = false; // Force acceptance of the position
        }
      } while (overlapping);
      
      nodes.push(newNode);
    }
    
    const edges = [];
    
    // Rest of the function remains the same
    if (algorithm === 'topologicalSort') {
      // For topological sort, create a directed acyclic graph (DAG)
      // Nodes can only connect to higher-indexed nodes to avoid cycles
      for (let i = 0; i < nodes.length - 1; i++) {
        const numEdges = Math.floor(Math.random() * 2) + 1; // 1-2 edges per node
        const possibleTargets = [];
        
        // Only consider connections to higher-indexed nodes (to ensure acyclic)
        for (let j = i + 1; j < nodes.length; j++) {
          possibleTargets.push(j);
        }
        
        // Shuffle possible targets
        for (let j = possibleTargets.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [possibleTargets[j], possibleTargets[k]] = [possibleTargets[k], possibleTargets[j]];
        }
        
        // Create edges to unique targets
        for (let j = 0; j < Math.min(numEdges, possibleTargets.length); j++) {
          edges.push({
            source: i,
            target: possibleTargets[j],
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
      
      // 20% chance to add a cycle to make it more interesting
      if (Math.random() < 0.2) {
        const cycleStart = Math.floor(Math.random() * (nodes.length - 1));
        const cycleEnd = Math.max(0, cycleStart - Math.floor(Math.random() * cycleStart));
        
        edges.push({
          source: cycleStart,
          target: cycleEnd,
          weight: Math.floor(Math.random() * 9) + 1
        });
      }
    } else if (algorithm === 'bipartite') {
      // For bipartite checking, create a graph that's likely to be bipartite
      // Divide nodes into two sets and only create edges between sets
      const setA = [];
      const setB = [];
      
      // Divide nodes into two sets
    for (let i = 0; i < nodes.length; i++) {
        if (i % 2 === 0) {
          setA.push(i);
        } else {
          setB.push(i);
        }
      }
      
      // Create edges between sets (bipartite structure)
      for (let i = 0; i < setA.length; i++) {
      const numEdges = Math.floor(Math.random() * 3) + 1; // 1-3 edges per node
        
        // Create unique random connections to the other set
        const targetIndices = new Set();
        while (targetIndices.size < Math.min(numEdges, setB.length)) {
          const targetIdx = Math.floor(Math.random() * setB.length);
          targetIndices.add(targetIdx);
        }
        
        // Add the edges
        for (const targetIdx of targetIndices) {
          edges.push({
            source: setA[i],
            target: setB[targetIdx],
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
      
      // 20% chance to add an edge that breaks the bipartite property
      if (Math.random() < 0.2) {
        // Add an edge between two nodes in the same set
        const setToUse = Math.random() < 0.5 ? setA : setB;
        if (setToUse.length >= 2) {
          const idx1 = Math.floor(Math.random() * setToUse.length);
          let idx2 = Math.floor(Math.random() * setToUse.length);
          while (idx2 === idx1) {
            idx2 = Math.floor(Math.random() * setToUse.length);
          }
          
          edges.push({
            source: setToUse[idx1],
            target: setToUse[idx2],
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
    } else if (algorithm === 'graphColoring') {
      // For graph coloring, create a graph with varying density
      // Ensure all nodes have at least one connection
      
      // Create a connected graph
      for (let i = 1; i < nodes.length; i++) {
        // Connect to at least one previous node
        const prevNode = Math.floor(Math.random() * i);
        edges.push({
          source: prevNode,
          target: i,
          weight: Math.floor(Math.random() * 9) + 1
        });
      }
      
      // Add additional random edges
      const density = Math.random() * 0.3 + 0.1; // Between 10% and 40% of possible edges
      const maxPossibleEdges = (nodes.length * (nodes.length - 1)) / 2;
      const targetEdgeCount = Math.floor(maxPossibleEdges * density);
      
      while (edges.length < targetEdgeCount) {
        const source = Math.floor(Math.random() * nodes.length);
        const target = Math.floor(Math.random() * nodes.length);
        
        // Avoid self-loops and duplicate edges
        if (source !== target && !edges.some(e => 
          (e.source === source && e.target === target) || 
          (e.source === target && e.target === source))) {
          edges.push({
            source,
            target,
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
    } else {
      // For path-finding algorithms (BFS, DFS, Dijkstra), create a connected graph
      // Create a spanning tree first to ensure connectivity
      for (let i = 1; i < nodes.length; i++) {
        const prevNode = Math.floor(Math.random() * i);
        edges.push({
          source: prevNode,
          target: i,
          weight: Math.floor(Math.random() * 9) + 1
        });
      }
      
      // Add additional random edges
      const extraEdges = Math.floor(nodes.length * 0.5); // 50% more edges
      for (let i = 0; i < extraEdges; i++) {
        const source = Math.floor(Math.random() * nodes.length);
        const target = Math.floor(Math.random() * nodes.length);
        
        // Avoid self-loops and duplicate edges
        if (source !== target && !edges.some(e => 
          (e.source === source && e.target === target) || 
          (e.source === target && e.target === source))) {
          edges.push({
            source,
            target,
            weight: Math.floor(Math.random() * 9) + 1
          });
        }
      }
    }
    
    setGraph({ nodes, edges });
    resetAlgorithm();
    drawGraph({ nodes, edges });
    
    // Set start and end nodes based on algorithm type
    if (['bfs', 'dfs', 'dijkstra'].includes(algorithm)) {
    setStartNode(0);
      setEndNode(Math.min(nodes.length - 1, 5));
    } else {
      // For other algorithms, we don't need to highlight specific start/end nodes
      setStartNode(-1);
      setEndNode(-1);
    }
  };

  // Reset algorithm
  const resetAlgorithm = () => {
    // Clear any existing animation timer
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset state
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setAlgorithmHistory([]);
    setExplanation('');
    setHighlightedLines([]);
    setResult({ visited: [], path: [] });
    
    // Clear canvas and redraw the initial graph without any highlighting
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGraph(graph, [], [], null, {});
    }
  };
  
  // Prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, graphPrompts.length - 1));
  };
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  };

  // Draw graph on canvas
  const drawGraph = (graphData, visited = [], path = [], current = null, extra = {}) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Get algorithm-specific data from extra
    const { colors = [], order = [], examining = null, conflictEdge = null, coloring = null } = extra;
    
    // Define colors for different node types/states
    const nodeColors = {
      start: '#4caf50',          // Green for start node
      end: '#f44336',            // Red for end node
      current: '#ff5722',        // Orange for current node
      examining: '#03a9f4',      // Light blue for examining node
      visited: '#9c27b0',        // Purple for visited nodes
      path: '#ffeb3b',           // Yellow for path nodes
      default: '#90caf9',        // Default blue
      bipartiteRed: '#f44336',   // Red for bipartite coloring
      bipartiteBlue: '#2196f3',  // Blue for bipartite coloring
      // For graph coloring
      colors: ['#90caf9', '#f44336', '#4caf50', '#ffeb3b', '#9c27b0', '#ff9800', '#795548', '#00bcd4']
    };
    
    // Draw curved edges for better visibility when there are multiple edges
    const drawnEdges = new Map(); // Track edges between same node pairs
    
    // First pass: Draw regular edges
    graphData.edges.forEach(edge => {
      const source = graphData.nodes[edge.source];
      const target = graphData.nodes[edge.target];
      
      // Default edge style
        ctx.strokeStyle = '#90caf9'; // Default blue
      ctx.lineWidth = 2;  // Make lines slightly thicker
      
      // Set color based on different algorithms
      if (algorithm === 'bipartite' && conflictEdge && 
          ((conflictEdge.source === edge.source && conflictEdge.target === edge.target) ||
           (conflictEdge.source === edge.target && conflictEdge.target === edge.source))) {
        // Conflicting edge in bipartite check
        ctx.strokeStyle = '#f44336'; // Red for conflict
        ctx.lineWidth = 4;  // Thicker for conflict edges
      } else if (algorithm === 'topologicalSort' && conflictEdge && 
                ((conflictEdge.source === edge.source && conflictEdge.target === edge.target) ||
                 (conflictEdge.source === edge.target && conflictEdge.target === edge.source))) {
        // Edge involved in cycle for topological sort
        ctx.strokeStyle = '#f44336'; // Red for cycle
        ctx.lineWidth = 4;  // Thicker for cycle edges
      } else if (path.some(p => (p.source === edge.source && p.target === edge.target) ||
                               (p.source === edge.target && p.target === edge.source))) {
        // Edge is part of the path
        ctx.strokeStyle = '#ff5722'; // Orange for path
        ctx.lineWidth = 4;  // Thicker for path edges
      }
      
      // Check if we already have an edge between these nodes
      const edgeKey = edge.source < edge.target 
        ? `${edge.source}-${edge.target}` 
        : `${edge.target}-${edge.source}`;
        
      const reverseEdgeKey = edge.source < edge.target 
        ? `${edge.target}-${edge.source}` 
        : `${edge.source}-${edge.target}`;
      
      if (!drawnEdges.has(edgeKey) && !drawnEdges.has(reverseEdgeKey)) {
        // First edge between these nodes, draw straight
        drawnEdges.set(edgeKey, 0);
        
        // Draw edge line
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      } else {
        // We already have at least one edge between these nodes
        // Draw a curved line to distinguish multiple edges
        const curveCount = drawnEdges.get(edgeKey) || drawnEdges.get(reverseEdgeKey);
        drawnEdges.set(edgeKey, curveCount + 1);
        
        // Calculate control point for the curve
        // Offset based on how many edges we've already drawn between these nodes
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Perpendicular vector to the line between nodes
        const perpX = -dy / distance;
        const perpY = dx / distance;
        
        // Control point offset increases with each additional edge
        const controlPointOffset = 30 + (curveCount * 15);
        const controlX = (source.x + target.x) / 2 + perpX * controlPointOffset;
        const controlY = (source.y + target.y) / 2 + perpY * controlPointOffset;
        
        // Draw curved edge
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.quadraticCurveTo(controlX, controlY, target.x, target.y);
        ctx.stroke();
      }
      
      // Draw arrow for directed graphs (topological sort)
      if (algorithm === 'topologicalSort') {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const angle = Math.atan2(dy, dx);
        
        // Calculate position for arrowhead (slightly before target)
        const arrowLength = 15;
        const arrowX = target.x - Math.cos(angle) * 25; // 25 pixels from target center
        const arrowY = target.y - Math.sin(angle) * 25;
        
        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
          arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
      
      // Draw weight with improved visibility
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      
      // Draw white background for the weight text
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(midX, midY, 10, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw the weight text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.weight.toString(), midX, midY);
    });
    
    // Draw nodes
    graphData.nodes.forEach((node, index) => {
      let fillStyle = nodeColors.default;
      
      // Set color based on algorithm and node state
      if (algorithm === 'bipartite' && colors[index] !== undefined) {
        // Bipartite coloring: -1 = uncolored, 0 = red, 1 = blue
        if (colors[index] === 0) {
          fillStyle = nodeColors.bipartiteRed;
        } else if (colors[index] === 1) {
          fillStyle = nodeColors.bipartiteBlue;
        }
      } else if (algorithm === 'graphColoring' && colors[index] > 0) {
        // Graph coloring: use color from array
        fillStyle = nodeColors.colors[colors[index] % nodeColors.colors.length];
      } else {
        // Standard algorithm coloring
        if (index === startNode && ['bfs', 'dfs', 'dijkstra'].includes(algorithm)) {
          fillStyle = nodeColors.start;
        } else if (index === endNode && ['bfs', 'dfs', 'dijkstra'].includes(algorithm)) {
          fillStyle = nodeColors.end;
      } else if (index === current) {
          fillStyle = nodeColors.current;
        } else if (index === examining) {
          fillStyle = nodeColors.examining;
      } else if (path.some(p => p.source === index || p.target === index)) {
          fillStyle = nodeColors.path;
      } else if (visited.includes(index)) {
          fillStyle = nodeColors.visited;
        }
      }
      
      // If this node is being colored (graph coloring algorithm)
      if (algorithm === 'graphColoring' && index === current && coloring !== null) {
        fillStyle = nodeColors.colors[coloring % nodeColors.colors.length];
        // Add a stroke to indicate it's tentative
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
      }
      
      // Draw node with white border for better visibility
      ctx.beginPath();
      ctx.arc(node.x, node.y, 22, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      
      // Draw inner colored circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      
      // Add stroke if needed
      if (algorithm === 'graphColoring' && index === current && coloring !== null) {
        ctx.stroke();
      }
      
      // Draw node label
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      
      // For topological sort, draw the order number
      if (algorithm === 'topologicalSort' && order.length > 0) {
        const orderIndex = order.indexOf(index);
        if (orderIndex !== -1) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(node.x + 15, node.y - 15, 12, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px Arial';
          ctx.fillText((orderIndex + 1).toString(), node.x + 15, node.y - 15);
        }
      }
    });
    
    // Draw legend based on algorithm
    drawLegend(ctx, algorithm, colors);
  };
  
  // Helper function to draw algorithm-specific legend
  const drawLegend = (ctx, algorithmType, colors) => {
    const width = ctx.canvas.width;
    const legendX = width - 180;
    const legendY = 30;
    const legendItems = [];
    
    // Add algorithm-specific legend items
    switch (algorithmType) {
      case 'bfs':
      case 'dfs':
      case 'dijkstra':
        legendItems.push({ color: '#4caf50', label: 'Start Node' });
        legendItems.push({ color: '#f44336', label: 'Target Node' });
        legendItems.push({ color: '#ff5722', label: 'Current Node' });
        legendItems.push({ color: '#9c27b0', label: 'Visited Node' });
        legendItems.push({ color: '#ffeb3b', label: 'Path Node' });
        break;
      case 'bipartite':
        legendItems.push({ color: '#f44336', label: 'Red Group' });
        legendItems.push({ color: '#2196f3', label: 'Blue Group' });
        legendItems.push({ color: '#90caf9', label: 'Uncolored' });
        legendItems.push({ color: '#ff5722', label: 'Current Node' });
        if (colors && colors.some(c => c === -1)) {
          legendItems.push({ color: '#f44336', label: 'Conflict Edge', lineStyle: true });
        }
        break;
      case 'topologicalSort':
        legendItems.push({ color: '#ff5722', label: 'Current Node' });
        legendItems.push({ color: '#03a9f4', label: 'Examining Node' });
        legendItems.push({ color: '#9c27b0', label: 'Visited Node' });
        legendItems.push({ color: '#f44336', label: 'Cycle Edge', lineStyle: true });
        break;
      case 'graphColoring':
        legendItems.push({ color: '#f44336', label: 'Color 1' });
        legendItems.push({ color: '#4caf50', label: 'Color 2' });
        legendItems.push({ color: '#ffeb3b', label: 'Color 3' });
        legendItems.push({ color: '#9c27b0', label: 'Color 4' });
        legendItems.push({ color: '#ff5722', label: 'Current Node' });
        break;
      default:
        break;
    }
    
    // Draw legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(legendX - 10, legendY - 20, 180, legendItems.length * 25 + 10);
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 20, 180, legendItems.length * 25 + 10);
    
    // Draw legend items
    legendItems.forEach((item, index) => {
      const y = legendY + index * 25;
      
      if (item.lineStyle) {
        // For line-style legend items (edges)
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(legendX, y);
        ctx.lineTo(legendX + 20, y);
        ctx.stroke();
      } else {
        // For color boxes (nodes)
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, y - 8, 15, 15);
      }
      
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 25, y);
    });
  };

  // Animate algorithm
  const animateAlgorithm = (step, history) => {
    if (isPaused) return;
    
    if (step >= history.length) {
      setIsRunning(false);
      
      // Set final explanation based on algorithm type
      if (algorithm === 'bipartite') {
        const finalResult = history[history.length - 1];
        if (finalResult && finalResult.isBipartite) {
          setExplanation(`Graph is bipartite! It can be colored with 2 colors.`);
        } else {
          setExplanation(`Graph is not bipartite. Adjacent nodes have the same color.`);
        }
      } else if (algorithm === 'topologicalSort') {
        const finalResult = history[history.length - 1];
        if (finalResult && !finalResult.hasCycle && finalResult.order) {
          setExplanation(`Topological sort complete! Order: ${finalResult.order.map(node => graph.nodes[node].label).join(' → ')}`);
        } else {
          setExplanation(`Topological sort failed. Graph contains a cycle.`);
        }
      } else if (algorithm === 'graphColoring') {
        const finalResult = history[history.length - 1];
        if (finalResult && finalResult.possible) {
          setExplanation(`Graph coloring complete! Used ${finalResult.numColors} colors.`);
        } else {
          setExplanation(`Failed to color the graph with the given number of colors.`);
        }
      } else if (result.path && result.path.length > 0) {
        setExplanation(`Path found from node ${graph.nodes[startNode].label} to node ${graph.nodes[endNode].label}!`);
      } else {
        setExplanation(`No path found from node ${graph.nodes[startNode].label} to node ${graph.nodes[endNode].label}.`);
      }
      return;
    }
    
    // Update current step
    setCurrentStep(step + 1);
    
    // Get the current history item
    const historyItem = history[step];
    
    if (historyItem) {
      // Update explanation and highlighted code lines
      setExplanation(historyItem.explanation || '');
      setHighlightedLines(historyItem.highlightedLines || []);
      
      // Prepare extra data based on algorithm type
      const extra = {};
      
      if (algorithm === 'bipartite') {
        extra.colors = historyItem.colors || [];
        extra.conflictEdge = historyItem.conflictEdge;
        extra.examining = historyItem.examining;
      } else if (algorithm === 'topologicalSort') {
        extra.order = historyItem.order || [];
        extra.examining = historyItem.examining;
        extra.cycleEdge = historyItem.cycleEdge;
      } else if (algorithm === 'graphColoring') {
        extra.colors = historyItem.colors || [];
        extra.examining = historyItem.examining;
        extra.coloring = historyItem.coloring;
      }
      
      // Apply transition effect
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Fade out current state
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw new state
        drawGraph(graph, historyItem.visited || [], result.path || [], historyItem.current, extra);
        
        // Calculate delay based on speed (inverted: higher speed = lower delay)
        const delay = 1000 - (speed * 9);
        
        // Schedule next animation frame
        animationRef.current = setTimeout(() => {
          animateAlgorithm(step + 1, history);
        }, delay);
      } else {
        // Fallback if canvas not available
        drawGraph(graph, historyItem.visited || [], result.path || [], historyItem.current, extra);
        
        // Schedule next animation frame
        animationRef.current = setTimeout(() => {
          animateAlgorithm(step + 1, history);
        }, 1000 - (speed * 9));
      }
    }
  };

  // Run algorithm
  const runAlgorithm = () => {
    resetAlgorithm();
    setIsRunning(true);
    setIsPaused(false);
    
    let history = [];
    let result = {};
    
    // Generate algorithm history
    if (algorithm === 'bfs') {
      result = runBFS(graph, startNode, history);
    } else if (algorithm === 'dfs') {
      result = runDFS(graph, startNode, history);
    } else if (algorithm === 'dijkstra') {
      result = runDijkstra(graph, startNode, history);
    } else if (algorithm === 'bipartite') {
      result = checkBipartite(graph, history);
    } else if (algorithm === 'topologicalSort') {
      result = topologicalSort(graph, history);
    } else if (algorithm === 'graphColoring') {
      result = graphColoring(graph, history);
    }
    
    setAlgorithmHistory(history);
    setResult(result);
    setTotalSteps(history.length + 1);
    
    // Reset current step and set initial state
    setCurrentStep(0);
    
    // Draw initial state
    if (history.length > 0) {
      const initialState = history[0];
      setExplanation(initialState.explanation || 'Starting algorithm...');
      setHighlightedLines(initialState.highlightedLines || []);
      
      // Prepare extra data for initial state
      const extra = {};
      if (algorithm === 'bipartite') {
        extra.colors = initialState.colors || [];
        extra.examining = initialState.examining;
      } else if (algorithm === 'topologicalSort') {
        extra.order = initialState.order || [];
        extra.examining = initialState.examining;
      } else if (algorithm === 'graphColoring') {
        extra.colors = initialState.colors || [];
        extra.examining = initialState.examining;
      }
      
      // Draw initial state
      drawGraph(graph, initialState.visited || [], result.path || [], initialState.current, extra);
      
      // Start animation after a short delay to ensure initial state is displayed
      setTimeout(() => {
        if (!isPaused) {
          animateAlgorithm(0, history);
        }
      }, 500);
    }
  };

  // Step forward
  const stepForward = () => {
    if (currentStep < totalSteps - 1 && algorithmHistory.length > 0) {
      // Cancel any existing animation timer to prevent it from overriding manual steps
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      
      // Pause the animation
      setIsPaused(true);
      
      // Move to the next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Get the history item and update visualization
      const historyItem = algorithmHistory[nextStep - 1];
      if (historyItem) {
        setExplanation(historyItem.explanation || '');
        setHighlightedLines(historyItem.highlightedLines || []);
        
        // Prepare extra data based on algorithm type
        const extra = {};
        if (algorithm === 'bipartite') {
          extra.colors = historyItem.colors || [];
          extra.conflictEdge = historyItem.conflictEdge;
          extra.examining = historyItem.examining;
        } else if (algorithm === 'topologicalSort') {
          extra.order = historyItem.order || [];
          extra.examining = historyItem.examining;
          extra.cycleEdge = historyItem.cycleEdge;
        } else if (algorithm === 'graphColoring') {
          extra.colors = historyItem.colors || [];
          extra.examining = historyItem.examining;
          extra.coloring = historyItem.coloring;
        }
        
        // Apply transition effect
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          
          // Fade out current state
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw new state
          drawGraph(graph, historyItem.visited || [], result.path || [], historyItem.current, extra);
        }
      }
    }
  };

  // BFS Implementation with History
  const runBFS = (graph, start, history) => {
    const visited = [];
    const queue = [start];
    const prev = Array(graph.nodes.length).fill(-1);
    
    history.push({
      visited: [...visited],
      current: start,
      explanation: `Starting BFS from node ${graph.nodes[start].label}.`,
      highlightedLines: [3, 4, 5] // Highlight initialization lines
    });
    
    visited.push(start);
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      history.push({
        visited: [...visited],
        current: current,
        explanation: `Exploring node ${graph.nodes[current].label}.`,
        highlightedLines: [8, 9] // Highlight queue processing lines
      });
      
      if (current === endNode) {
        history.push({
          visited: [...visited],
          current: current,
          explanation: `Found target node ${graph.nodes[endNode].label}!`,
          highlightedLines: [12, 13] // Highlight target found lines
        });
        
        // Reconstruct path
        const path = [];
        let at = endNode;
        while (at !== start) {
          if (at === -1) break;
          const prevNode = prev[at];
          path.push({ source: prevNode, target: at });
          at = prevNode;
        }
        path.reverse();
        
        return { visited, path };
      }
      
      // Find all neighbors
      const neighbors = graph.edges
        .filter(edge => edge.source === current)
        .map(edge => edge.target);
      
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor)) {
          visited.push(neighbor);
          prev[neighbor] = current;
          queue.push(neighbor);
          
          history.push({
            visited: [...visited],
            current: neighbor,
            explanation: `Adding node ${graph.nodes[neighbor].label} to the queue.`,
            highlightedLines: [25, 26, 27, 28] // Highlight neighbor processing lines
          });
        }
      }
    }
    
    history.push({
      visited: [...visited],
      current: null,
      explanation: `No path found from ${graph.nodes[start].label} to ${graph.nodes[endNode].label}.`,
      highlightedLines: [49, 50]
    });
    
    return { visited, path: [] };
  };

  // DFS Implementation with History
  const runDFS = (graph, start, history) => {
    const visited = [];
    const stack = [start];
    const prev = Array(graph.nodes.length).fill(-1);
    
    history.push({
      visited: [...visited],
      current: start,
      explanation: `Starting DFS from node ${graph.nodes[start].label}.`,
      highlightedLines: [3, 4, 5] // Highlight initialization lines
    });
    
    while (stack.length > 0) {
      const current = stack.pop();
      
      if (!visited.includes(current)) {
        visited.push(current);
        
        history.push({
          visited: [...visited],
          current: current,
          explanation: `Exploring node ${graph.nodes[current].label}.`,
          highlightedLines: [8, 9, 10] // Highlight stack processing lines
        });
        
        if (current === endNode) {
          history.push({
            visited: [...visited],
            current: current,
            explanation: `Found target node ${graph.nodes[endNode].label}!`,
            highlightedLines: [13, 14] // Highlight target found lines
          });
          
          // Reconstruct path
          const path = [];
          let at = endNode;
          while (at !== start) {
            if (at === -1) break;
            const prevNode = prev[at];
            path.push({ source: prevNode, target: at });
            at = prevNode;
          }
          path.reverse();
          
          return { visited, path };
        }
        
        // Find all neighbors
        const neighbors = graph.edges
          .filter(edge => edge.source === current)
          .map(edge => edge.target);
        
        // Add neighbors to stack in reverse order to explore left-to-right
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const neighbor = neighbors[i];
          if (!visited.includes(neighbor)) {
            prev[neighbor] = current;
            stack.push(neighbor);
            
            history.push({
              visited: [...visited],
              current: current,
              explanation: `Adding node ${graph.nodes[neighbor].label} to the stack.`,
              highlightedLines: [25, 26, 27, 28] // Highlight neighbor processing lines
            });
          }
        }
      }
    }
    
    history.push({
      visited: [...visited],
      current: null,
      explanation: `No path found from ${graph.nodes[start].label} to ${graph.nodes[endNode].label}.`,
      highlightedLines: [49, 50]
    });
    
    return { visited, path: [] };
  };

  // Dijkstra's Algorithm Implementation with History
  const runDijkstra = (graph, start, history) => {
    const n = graph.nodes.length;
    const dist = Array(n).fill(Infinity);
    const visited = [];
    const prev = Array(n).fill(-1);
    
    dist[start] = 0;
    
    history.push({
      visited: [...visited],
      current: start,
      explanation: `Starting Dijkstra's algorithm from node ${graph.nodes[start].label}.`,
      highlightedLines: [6, 7] // Highlight initialization lines
    });
    
    for (let i = 0; i < n; i++) {
      // Find the node with the minimum distance
      let minDist = Infinity;
      let minNode = -1;
      
      for (let j = 0; j < n; j++) {
        if (!visited.includes(j) && dist[j] < minDist) {
          minDist = dist[j];
          minNode = j;
        }
      }
      
      if (minNode === -1 || minNode === endNode) break;
      
      visited.push(minNode);
      
      history.push({
        visited: [...visited],
        current: minNode,
        explanation: `Visiting node ${graph.nodes[minNode].label} with distance ${dist[minNode]}.`,
        highlightedLines: [10, 11, 12, 13] // Highlight node selection lines
      });
      
      // Update distances to neighbors
      const edges = graph.edges.filter(edge => edge.source === minNode);
      
      for (const edge of edges) {
        const neighbor = edge.target;
        const weight = edge.weight;
        
        if (dist[minNode] + weight < dist[neighbor]) {
          dist[neighbor] = dist[minNode] + weight;
          prev[neighbor] = minNode;
          
          history.push({
            visited: [...visited],
            current: neighbor,
            explanation: `Updated distance to node ${graph.nodes[neighbor].label} to ${dist[neighbor]}.`,
            highlightedLines: [25, 26, 27, 28] // Highlight distance update lines
          });
        }
      }
    }
    
    if (dist[endNode] !== Infinity) {
      // Reconstruct path
      const path = [];
      let at = endNode;
      while (at !== start) {
        if (at === -1) break;
        const prevNode = prev[at];
        path.push({ source: prevNode, target: at });
        at = prevNode;
      }
      path.reverse();
      
      history.push({
        visited: [...visited],
        current: endNode,
        explanation: `Found path from ${graph.nodes[start].label} to ${graph.nodes[endNode].label} with total distance ${dist[endNode]}.`,
        highlightedLines: [30, 31, 32, 33] // Highlight path reconstruction lines
      });
      
      return { visited, path };
    }
    
    history.push({
      visited: [...visited],
      current: null,
      explanation: `No path found from ${graph.nodes[start].label} to ${graph.nodes[endNode].label}.`,
      highlightedLines: [49, 50] // Highlight no path found lines
    });
    
    return { visited, path: [] };
  };

  // Check if graph is bipartite with history tracking
  const checkBipartite = (graph, history) => {
    const n = graph.nodes.length;
    // Color array: -1 = not colored, 0 = red, 1 = blue
    const color = Array(n).fill(-1);
    const visited = [];
    let conflictEdge = null;
    
    history.push({
      visited: [...visited],
      colors: [...color],
      current: null,
      explanation: 'Starting bipartite check. A graph is bipartite if it can be colored with 2 colors such that no adjacent nodes have the same color.',
      highlightedLines: [2, 3, 4]
    });
    
    // Function to check bipartite property using BFS
    function checkBipartiteInternal(start) {
      const queue = [start];
      color[start] = 0; // Color the start node with red (0)
      visited.push(start);
      
      history.push({
        visited: [...visited],
        colors: [...color],
        current: start,
        explanation: `Starting BFS from node ${graph.nodes[start].label}, coloring it RED.`,
        highlightedLines: [8, 9, 10]
      });
      
      while (queue.length > 0) {
        const current = queue.shift();
        const currentColor = color[current];
        
        history.push({
          visited: [...visited],
          colors: [...color],
          current: current,
          explanation: `Processing node ${graph.nodes[current].label} with color ${currentColor === 0 ? 'RED' : 'BLUE'}.`,
          highlightedLines: [14, 15]
        });
        
        // Get all adjacent vertices
        const neighbors = [];
        for (const edge of graph.edges) {
          if (edge.source === current && !neighbors.includes(edge.target)) {
            neighbors.push(edge.target);
          }
          // For undirected graphs, check both directions
          if (edge.target === current && !neighbors.includes(edge.source)) {
            neighbors.push(edge.source);
          }
        }
        
        // Process all adjacent vertices
        for (const neighbor of neighbors) {
          history.push({
            visited: [...visited],
            colors: [...color],
            current: current,
            examining: neighbor,
            explanation: `Examining neighbor ${graph.nodes[neighbor].label} of node ${graph.nodes[current].label}.`,
            highlightedLines: [25, 26]
          });
          
          // If the neighbor hasn't been colored yet
          if (color[neighbor] === -1) {
            // Color it with the opposite color
            color[neighbor] = 1 - currentColor;
            queue.push(neighbor);
            visited.push(neighbor);
            
            history.push({
              visited: [...visited],
              colors: [...color],
              current: current,
              examining: neighbor,
              explanation: `Coloring node ${graph.nodes[neighbor].label} with ${color[neighbor] === 0 ? 'RED' : 'BLUE'} (opposite of current node).`,
              highlightedLines: [29, 30, 31]
            });
          }
          // If the neighbor has the same color as current node
          else if (color[neighbor] === currentColor) {
            conflictEdge = { source: current, target: neighbor };
            
            history.push({
              visited: [...visited],
              colors: [...color],
              current: current,
              examining: neighbor,
              conflictEdge: conflictEdge,
              explanation: `Conflict detected: Node ${graph.nodes[current].label} and ${graph.nodes[neighbor].label} have the same color. Graph is not bipartite.`,
              highlightedLines: [34, 35]
            });
            
            return false;
          }
          else {
            history.push({
              visited: [...visited],
              colors: [...color],
              current: current,
              examining: neighbor,
              explanation: `Node ${graph.nodes[neighbor].label} is already colored differently. Continuing.`,
              highlightedLines: [26, 27]
            });
          }
        }
      }
      
      return true;
    }
    
    // Check each disconnected component
    for (let i = 0; i < n; i++) {
      if (color[i] === -1) {
        history.push({
          visited: [...visited],
          colors: [...color],
          current: i,
          explanation: `Starting a new component check with node ${graph.nodes[i].label}.`,
          highlightedLines: [38, 39]
        });
        
        const isBipartite = checkBipartiteInternal(i);
        
        if (!isBipartite) {
          history.push({
            visited: [...visited],
            colors: [...color],
            conflictEdge: conflictEdge,
            explanation: 'Graph is not bipartite. A conflict was found.',
            highlightedLines: [41, 42]
          });
          
          return { 
            isBipartite: false, 
            conflictEdge, 
            visited,
            colors
          };
        }
      }
    }
    
    history.push({
      visited: [...visited],
      colors: [...color],
      explanation: 'Graph is bipartite! All nodes can be colored with 2 colors.',
      highlightedLines: [47, 48]
    });
    
    return { 
      isBipartite: true, 
      conflictEdge: null, 
      visited,
      colors
    };
  };
  
  // Perform topological sort with history tracking
  const topologicalSort = (graph, history) => {
    const n = graph.nodes.length;
    const visited = new Set();
    const temp = new Set();  // For cycle detection
    const order = [];  // Topological order
    const hasCycle = { value: false };
    const cycleEdge = { source: -1, target: -1 };
    const visitedNodes = [];
    
    history.push({
      visited: [...visitedNodes],
      order: [...order],
      current: null,
      explanation: 'Starting topological sort. This algorithm finds an ordering where for each directed edge (u,v), u comes before v.',
      highlightedLines: [2, 3, 4, 5]
    });
    
    // DFS function
    function dfs(node) {
      // If we're revisiting a node during current exploration, we have a cycle
      if (temp.has(node)) {
        hasCycle.value = true;
        
        history.push({
          visited: [...visitedNodes],
          order: [...order],
          current: node,
          explanation: `Cycle detected! Node ${graph.nodes[node].label} is being revisited during the current exploration.`,
          highlightedLines: [14, 15]
        });
        
        return;
      }
      
      // Skip already visited nodes
      if (visited.has(node)) {
        history.push({
          visited: [...visitedNodes],
          order: [...order],
          current: node,
          explanation: `Node ${graph.nodes[node].label} is already processed. Skipping.`,
          highlightedLines: [20, 21]
        });
        
        return;
      }
      
      // Mark node as being explored
      temp.add(node);
      visitedNodes.push(node);
      
      history.push({
        visited: [...visitedNodes],
        order: [...order],
        current: node,
        explanation: `Starting DFS from node ${graph.nodes[node].label}.`,
        highlightedLines: [25, 26]
      });
      
      // Find all outgoing edges
      const neighbors = graph.edges
        .filter(edge => edge.source === node)
        .map(edge => edge.target);
      
      // Visit all neighbors
      for (const neighbor of neighbors) {
        history.push({
          visited: [...visitedNodes],
          order: [...order],
          current: node,
          examining: neighbor,
          explanation: `Examining edge from ${graph.nodes[node].label} to ${graph.nodes[neighbor].label}.`,
          highlightedLines: [34, 35]
        });
        
        if (!visited.has(neighbor)) {
          dfs(neighbor);
          // If we detected a cycle, store the edge and return
          if (hasCycle.value) {
            if (cycleEdge.source === -1) {
              cycleEdge.source = node;
              cycleEdge.target = neighbor;
              
              history.push({
                visited: [...visitedNodes],
                order: [...order],
                current: node,
                examining: neighbor,
                cycleEdge: { source: node, target: neighbor },
                explanation: `Cycle detected involving edge from ${graph.nodes[node].label} to ${graph.nodes[neighbor].label}.`,
                highlightedLines: [38, 39, 40]
              });
            }
            return;
          }
        }
      }
      
      // Remove from temp set
      temp.delete(node);
      
      // Add to visited
      visited.add(node);
      
      // Add to order (prepend to get correct order)
      order.unshift(node);
      
      history.push({
        visited: [...visitedNodes],
        order: [...order],
        current: node,
        explanation: `Finished processing node ${graph.nodes[node].label}. Adding to the topological order.`,
        highlightedLines: [48, 49, 52]
      });
    }
    
    // Process all nodes
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        history.push({
          visited: [...visitedNodes],
          order: [...order],
          current: i,
          explanation: `Starting a new DFS from node ${graph.nodes[i].label}.`,
          highlightedLines: [57, 58]
        });
        
        dfs(i);
        
        if (hasCycle.value) {
          history.push({
            visited: [...visitedNodes],
            order: [],
            current: null,
            cycleEdge: { source: cycleEdge.source, target: cycleEdge.target },
            explanation: 'Topological sort failed: Graph contains a cycle.',
            highlightedLines: [59, 60, 61, 62]
          });
          
          return {
            hasCycle: true,
            order: [],
            cycleEdge: {
              source: cycleEdge.source,
              target: cycleEdge.target
            },
            visited: visitedNodes
          };
        }
      }
    }
    
    history.push({
      visited: [...visitedNodes],
      order: [...order],
      current: null,
      explanation: `Topological sort complete. Order: ${order.map(node => graph.nodes[node].label).join(' → ')}`,
      highlightedLines: [74, 75]
    });
    
    return {
      hasCycle: false,
      order,
      visited: visitedNodes
    };
  };
  
  // Perform graph coloring with history tracking
  const graphColoring = (graph, history, maxColors = 4) => {
    const n = graph.nodes.length;
    const colors = Array(n).fill(0); // 0 means no color assigned
    const visited = [];
    const colorNames = ['None', 'Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 'Pink'];
    
    history.push({
      visited: [...visited],
      colors: [...colors],
      current: null,
      explanation: `Starting graph coloring with maximum ${maxColors} colors.`,
      highlightedLines: [2, 3]
    });
    
    // Function to check if it's safe to color vertex v with color c
    function isSafe(v, c) {
      // Check all adjacent vertices
      const neighbors = [];
      
      for (const edge of graph.edges) {
        if (edge.source === v && !neighbors.includes(edge.target)) {
          neighbors.push(edge.target);
        }
        if (edge.target === v && !neighbors.includes(edge.source)) {
          neighbors.push(edge.source);
        }
      }
      
      for (const neighbor of neighbors) {
        if (colors[neighbor] === c) {
          history.push({
            visited: [...visited],
            colors: [...colors],
            current: v,
            examining: neighbor,
            coloring: c,
            explanation: `Cannot color node ${graph.nodes[v].label} with ${colorNames[c]} because neighbor ${graph.nodes[neighbor].label} already has that color.`,
            highlightedLines: [11, 12, 13]
          });
          
          return false;
        }
      }
      
      history.push({
        visited: [...visited],
        colors: [...colors],
        current: v,
        coloring: c,
        explanation: `Safe to color node ${graph.nodes[v].label} with ${colorNames[c]}.`,
        highlightedLines: [16, 17]
      });
      
      return true;
    }
    
    // Recursive utility function to solve graph coloring
    function graphColoringUtil(vertex) {
      // Base case: all vertices are colored
      if (vertex === n) {
        history.push({
          visited: [...visited],
          colors: [...colors],
          current: null,
          explanation: 'All vertices have been colored successfully!',
          highlightedLines: [23, 24]
        });
        
        return true;
      }
      
      visited.push(vertex);
      
      history.push({
        visited: [...visited],
        colors: [...colors],
        current: vertex,
        explanation: `Trying to color node ${graph.nodes[vertex].label}.`,
        highlightedLines: [28, 29]
      });
      
      // Try different colors for vertex
      for (let color = 1; color <= maxColors; color++) {
        history.push({
          visited: [...visited],
          colors: [...colors],
          current: vertex,
          coloring: color,
          explanation: `Trying color ${colorNames[color]} for node ${graph.nodes[vertex].label}...`,
          highlightedLines: [32, 33]
        });
        
        // Check if assignment of color is safe
        if (isSafe(vertex, color)) {
          colors[vertex] = color;
          
          history.push({
            visited: [...visited],
            colors: [...colors],
            current: vertex,
            explanation: `Assigned color ${colorNames[color]} to node ${graph.nodes[vertex].label}. Moving to next node.`,
            highlightedLines: [35, 36]
          });
          
          // Recur to assign colors to rest of the vertices
          if (graphColoringUtil(vertex + 1)) {
            return true;
          }
          
          // If color doesn't lead to a solution, backtrack
          colors[vertex] = 0;
          
          history.push({
            visited: [...visited],
            colors: [...colors],
            current: vertex,
            explanation: `Backtracking: ${colorNames[color]} for node ${graph.nodes[vertex].label} doesn't lead to a solution.`,
            highlightedLines: [42, 43]
          });
        }
      }
      
      history.push({
        visited: [...visited],
        colors: [...colors],
        current: vertex,
        explanation: `No valid coloring found for node ${graph.nodes[vertex].label} with ${maxColors} colors.`,
        highlightedLines: [47, 48]
      });
      
      return false;
    }
    
    // Start with vertex 0
    const possible = graphColoringUtil(0);
    
    if (possible) {
      history.push({
        visited: [...visited],
        colors: [...colors],
        current: null,
        explanation: `Graph coloring complete! Used ${Math.max(...colors)} colors.`,
        highlightedLines: [52, 53]
      });
    } else {
      history.push({
        visited: [...visited],
        colors: Array(n).fill(0),
        current: null,
        explanation: `Graph cannot be colored with ${maxColors} colors.`,
        highlightedLines: [54, 55]
      });
    }
    
    return {
      possible,
      colors,
      visited,
      numColors: possible ? Math.max(...colors) : 0
    };
  };

  // Initialize component
  useEffect(() => {
    generateRandomGraph();
  }, []);

  return (
    <VisualizerLayout
      title="Graph Algorithm Visualizer"
          prompts={graphPrompts}
      promptStep={promptStep}
      onNextPrompt={handleNextPrompt}
      onPreviousPrompt={handlePreviousPrompt}
      onFinishPrompts={handleFinishPrompts}
      showPrompts={showPrompts}
      algorithmData={algorithmInfo[algorithm]}
      controls={
        <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={algorithm}
                label="Algorithm"
                onChange={(e) => {
                  setAlgorithm(e.target.value);
                  resetAlgorithm();
                setTimeout(() => generateRandomGraph(), 0);
                }}
                disabled={isRunning}
              >
                <MenuItem value="bfs">Breadth-First Search</MenuItem>
                <MenuItem value="dfs">Depth-First Search</MenuItem>
                <MenuItem value="dijkstra">Dijkstra's Algorithm</MenuItem>
              <MenuItem value="bipartite">Bipartite Graph Check</MenuItem>
              <MenuItem value="topologicalSort">Topological Sort</MenuItem>
              <MenuItem value="graphColoring">Graph Coloring</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Node Count</Typography>
              <Slider
                value={nodeCount}
                min={5}
                max={20}
                onChange={(_, value) => setNodeCount(value)}
                disabled={isRunning}
              />
            </Box>
            
          {/* Only show start/end node selection for path-finding algorithms */}
          {['bfs', 'dfs', 'dijkstra'].includes(algorithm) && (
            <>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Start Node</Typography>
              <Slider
                value={startNode}
                min={0}
                max={graph.nodes.length > 0 ? graph.nodes.length - 1 : 0}
                marks
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => graph.nodes[value]?.label || value}
                onChange={(_, value) => setStartNode(value)}
                disabled={isRunning}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>End Node</Typography>
              <Slider
                value={endNode}
                min={0}
                max={graph.nodes.length > 0 ? graph.nodes.length - 1 : 0}
                marks
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => graph.nodes[value]?.label || value}
                onChange={(_, value) => setEndNode(value)}
                disabled={isRunning}
              />
            </Box>
            </>
          )}
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                onClick={generateRandomGraph}
                disabled={isRunning}
                fullWidth
              startIcon={<RestartAltIcon />}
              sx={{ mb: 2 }}
              >
                Generate New Graph
              </Button>
            </Box>
            
          {/* Animation Controls */}
            <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Animation Speed</Typography>
              <Slider
              value={speed}
              min={1}
              max={100}
              onChange={(_, value) => setSpeed(value)}
            />
          </Box>
          
          <VisualizerControls 
            onRun={runAlgorithm}
            onPauseResume={() => {
              if (isPaused) {
                setIsPaused(false);
                // Resume animation from current step
                animateAlgorithm(currentStep, algorithmHistory);
              } else {
                setIsPaused(true);
                // Clear any existing animation timer
                if (animationRef.current) {
                  clearTimeout(animationRef.current);
                  animationRef.current = null;
                }
              }
            }}
            onStep={stepForward}
            onReset={resetAlgorithm}
            isRunning={isRunning}
            isPaused={isPaused}
            currentStep={currentStep}
            totalSteps={totalSteps}
            disabled={false}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </>
      }
      visualization={
        <>
          {/* Visualization Canvas */}
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
                display: 'block'
              }}
            />
          </Box>
            
          {/* Explanation */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Explanation
                </Typography>
                <Typography variant="body2">
                {explanation || 'Click Run Algorithm to start the visualization'}
                </Typography>
              </CardContent>
            </Card>
                
                {/* Code Display */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Implementation Code:</Typography>
                  <CodeHighlighter
                    code={codeSnippets[algorithm]}
                    language="javascript"
                    highlightedLines={highlightedLines}
                    title={`${algorithmInfo[algorithm].name} Implementation`}
                  />
                </Box>
        </>
      }
    />
  );
};

export default GraphVisualizer;