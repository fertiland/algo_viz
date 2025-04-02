import React, { useState, useEffect, useRef } from 'react';
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
  Switch,
} from '@mui/material';
import CodeHighlighter from '../components/CodeHighlighter';
// import CodeEditor from '../components/CodeEditor';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';

const DivideConquerVisualizer = () => {
  const [algorithm, setAlgorithm] = useState('mergeSort');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [problemSize, setProblemSize] = useState(10);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [algorithmHistory, setAlgorithmHistory] = useState([]);
  const [originalProblem, setOriginalProblem] = useState([]);
  const [problem, setProblem] = useState([]);
  const [result, setResult] = useState(null);
  const [highlightedLines, setHighlightedLines] = useState([]);
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Canvas and animation refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Control button handlers
  const handlePlay = () => {
    if (!isRunning) {
      runAlgorithm();
    } else {
      setIsPaused(!isPaused);
      
      if (isPaused) {
        animateAlgorithm(true);
      } else {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }
      }
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleStep = () => {
    if (currentStep < totalSteps && algorithmHistory.length > 0) {
      // Cancel any existing animation to prevent overriding manual steps
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Update state based on next history item
      const historyItem = algorithmHistory[nextStep - 1];
      if (historyItem) {
        setExplanation(historyItem.explanation);
        setHighlightedLines(historyItem.highlightedLines || []);
        drawProblem(historyItem);
      }
      
      // If was running automatically, pause
      if (isRunning && !isPaused) {
        setIsPaused(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setExplanation('');
    setProblem([...originalProblem]);
    setAlgorithmHistory([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  
  // Divide and Conquer algorithm prompts
  const divideConquerPrompts = [
    {
      title: 'Welcome to Divide and Conquer Algorithm Visualizer',
      content: 'This tool helps you understand how divide and conquer algorithms work by visualizing the process step by step. Divide and conquer is a technique that breaks a problem into smaller subproblems, solves them, and then combines their solutions.'
    },
    {
      title: 'Select an Algorithm',
      content: 'Choose a specific algorithm to visualize. Each algorithm demonstrates a different application of the divide and conquer technique.'
    },
    {
      title: 'Generate a Problem',
      content: 'Click the "Generate Random Problem" button to create a new problem instance. You can also adjust the problem size using the slider or input your own values.'
    },
    {
      title: 'Control the Visualization',
      content: 'Use the play, pause, and step buttons to control the visualization. You can also adjust the speed to see the algorithm process faster or slower.'
    },
    {
      title: 'Understand the Technique',
      content: 'Divide and conquer algorithms solve problems by dividing them into smaller subproblems, solving each subproblem independently, and then combining the solutions to create a solution to the original problem.'
    }
  ];
  
  // Code snippets for each divide and conquer algorithm
  const codeSnippets = {
    mergeSort: `// Merge Sort Implementation
function mergeSort(arr) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide the array into two halves
  const middle = Math.floor(arr.length / 2);
  const leftHalf = arr.slice(0, middle);
  const rightHalf = arr.slice(middle);
  
  // Recursively sort both halves
  const sortedLeft = mergeSort(leftHalf);
  const sortedRight = mergeSort(rightHalf);
  
  // Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

// Merge two sorted arrays into one sorted array
function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and add the smaller one to result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  };

  
  // Add remaining elements from left array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  
  // Add remaining elements from right array
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  
  return result;
}`,
    
    quickSort: `// Quick Sort Implementation
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, left, right);
    
    // Recursively sort the subarrays
    quickSort(arr, left, pivotIndex - 1);  // Sort left subarray
    quickSort(arr, pivotIndex + 1, right); // Sort right subarray
  }
  
  return arr;
}

// Partition the array and return the pivot index
function partition(arr, left, right) {
  // Choose the rightmost element as pivot
  const pivot = arr[right];
  
  // Index of the smaller element
  let i = left - 1;
  
  // Compare each element with pivot
  for (let j = left; j < right; j++) {
    // If current element is smaller than or equal to the pivot
    if (arr[j] <= pivot) {
      // Increment index of smaller element
      i++;
      
      // Swap elements
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  
  // Swap the pivot element with the element at (i + 1)
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  
  // Return the pivot index
  return i + 1;
}`,

    binarySearch: `// Binary Search Implementation
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  // Base case: element not found
  if (left > right) {
    return -1;
  }
  
  // Calculate middle index
  const mid = Math.floor((left + right) / 2);
  
  // Found the target
  if (arr[mid] === target) {
    return mid;
  }
  
  // If target is smaller, search in the left half
  if (arr[mid] > target) {
    return binarySearch(arr, target, left, mid - 1);
  }
  
  // If target is larger, search in the right half
  return binarySearch(arr, target, mid + 1, right);
}`,

    maxSubarray: `// Maximum Subarray Sum (Divide and Conquer)
function maxSubArray(nums) {
  // Base case: only one element
  if (nums.length === 1) {
    return nums[0];
  }
  
  // Find the middle point
  const mid = Math.floor(nums.length / 2);
  
  // Calculate maximum subarray sum for left half
  const leftMax = maxSubArray(nums.slice(0, mid));
  
  // Calculate maximum subarray sum for right half
  const rightMax = maxSubArray(nums.slice(mid));
  
  // Calculate maximum subarray sum that crosses the middle
  const crossMax = maxCrossingSum(nums, mid);
  
  // Return the maximum of the three
  return Math.max(leftMax, rightMax, crossMax);
}

// Find the maximum crossing subarray sum
function maxCrossingSum(nums, mid) {
  // Find maximum sum of left subarray including mid-1
  let leftSum = -Infinity;
  let sum = 0;
  
  for (let i = mid - 1; i >= 0; i--) {
    sum += nums[i];
    leftSum = Math.max(leftSum, sum);
  }
  
  // Find maximum sum of right subarray including mid
  let rightSum = -Infinity;
  sum = 0;
  
  for (let i = mid; i < nums.length; i++) {
    sum += nums[i];
    rightSum = Math.max(rightSum, sum);
  }
  
  // Return the combination of the two
  return leftSum + rightSum;
}`,

    closestPair: `// Closest Pair of Points
function closestPair(points) {
  // Sort points by x-coordinate
  const pointsByX = [...points].sort((a, b) => a.x - b.x);
  
  // Recursively find closest pair
  return closestPairRec(pointsByX);
}

function closestPairRec(pointsByX) {
  // Base cases
  if (pointsByX.length <= 3) {
    return bruteForceClosestPair(pointsByX);
  }
  
  // Divide points into two halves
  const mid = Math.floor(pointsByX.length / 2);
  const midX = pointsByX[mid].x;
  
  const leftPoints = pointsByX.slice(0, mid);
  const rightPoints = pointsByX.slice(mid);
  
  // Recursively find minimum distance in left and right halves
  const leftMinDist = closestPairRec(leftPoints);
  const rightMinDist = closestPairRec(rightPoints);
  
  // Determine minimum of left and right distances
  let minDist = Math.min(leftMinDist, rightMinDist);
  
  // Build a strip of points around the middle
  const strip = [];
  for (let i = 0; i < pointsByX.length; i++) {
    if (Math.abs(pointsByX[i].x - midX) < minDist) {
      strip.push(pointsByX[i]);
    }
  };

  
  // Sort strip by y-coordinate
  strip.sort((a, b) => a.y - b.y);
  
  // Find minimum distance within the strip
  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < minDist; j++) {
      const dist = distance(strip[i], strip[j]);
      minDist = Math.min(minDist, dist);
    }
  };

  
  return minDist;
}

// Calculate Euclidean distance between two points
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Brute force approach for small number of points
function bruteForceClosestPair(points) {
  let minDist = Infinity;
  let closestPair = [];
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = distance(points[i], points[j]);
      if (dist < minDist) {
        minDist = dist;
        closestPair = [i, j];
      }
    }
  };

  return minDist;
}`,

    heap: `// Heap Implementation
function heapSort(arr) {
  // Build max heap
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i);
  }
  
  // Extract elements from heap one by one
  for (let i = arr.length - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

// To heapify a subtree with root at index i
function heapify(arr, n, i) {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // left = 2*i + 1
  const right = 2 * i + 2; // right = 2*i + 2
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    // Swap
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}`,

    karatsuba: {
      name: 'Karatsuba Multiplication',
      description: 'Karatsuba algorithm is a fast multiplication algorithm that uses a divide and conquer approach to multiply two numbers.',
      timeComplexity: {
        best: 'O(n^log₂(3))',
        average: 'O(n^log₂(3))',
        worst: 'O(n^log₂(3))'
      },
      spaceComplexity: 'O(n)'
    },
    strassenMatrix: {
      name: 'Strassen Matrix Multiplication',
      description: 'Strassen algorithm is a divide and conquer algorithm for matrix multiplication that is faster than the standard matrix multiplication algorithm.',
      timeComplexity: {
        best: 'O(n^log₂(7))',
        average: 'O(n^log₂(7))',
        worst: 'O(n^log₂(7))'
      },
      spaceComplexity: 'O(n²)'
    }
  };


  // Algorithm complexity information
  const algorithmInfo = {
    mergeSort: {
      name: 'Merge Sort',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Merge Sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves to produce the final sorted array.'
    },
    quickSort: {
      name: 'Quick Sort',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(log n)',
      description: 'Quick Sort is a divide and conquer algorithm that picks an element as a pivot and partitions the array around the pivot. It can be very efficient when implemented correctly.'
    },
    binarySearch: {
      name: 'Binary Search',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      spaceComplexity: 'O(log n) recursive, O(1) iterative',
      description: 'Binary Search is a divide and conquer algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element and continues the search in the appropriate half.'
    },
    maxSubarray: {
      name: 'Maximum Subarray',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(log n)',
      description: 'The Maximum Subarray problem finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum. This implementation uses a divide and conquer approach.'
    },
    closestPair: {
      name: 'Closest Pair of Points',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Closest Pair of Points algorithm finds the pair of points in a set that have the smallest distance between them. It uses a divide and conquer approach to achieve better time complexity than the naive O(n²) solution.'
    },
    karatsuba: {
      name: 'Karatsuba Multiplication',
      description: 'Karatsuba algorithm is a fast multiplication algorithm that uses a divide and conquer approach to multiply two numbers.',
      timeComplexity: {
        best: 'O(n^log₂(3))',
        average: 'O(n^log₂(3))',
        worst: 'O(n^log₂(3))'
      },
      spaceComplexity: 'O(n)'
    },
    strassenMatrix: {
      name: 'Strassen Matrix Multiplication',
      description: 'Strassen algorithm is a divide and conquer algorithm for matrix multiplication that is faster than the standard matrix multiplication algorithm.',
      timeComplexity: {
        best: 'O(n^log₂(7))',
        average: 'O(n^log₂(7))',
        worst: 'O(n^log₂(7))'
      },
      spaceComplexity: 'O(n²)'
    }
  };


  // Helper functions for algorithm states and data visualization
  const getAvailableAlgorithms = () => {
    return ['mergeSort', 'quickSort', 'binarySearch', 'maxSubarray', 'closestPair', 'heap'];
  }

  // Generate random problem based on selected algorithm
  const generateRandomProblem = () => {
    let newProblem = [];
    
    switch (algorithm) {
      case 'mergeSort':
      case 'quickSort':
        // Generate unsorted array
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 100));
        break;
        
      case 'binarySearch':
        // Generate sorted array
        newProblem = Array.from({ length: problemSize }, (_, i) => i * 2 + Math.floor(Math.random() * 5));
        // Set random target from the array
        setResult({ target: newProblem[Math.floor(Math.random() * newProblem.length)] });
        break;
        
      case 'maxSubarray':
        // Generate array with mix of positive and negative values
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 40) - 20);
        break;
        
      case 'closestPair':
        // Generate 2D points for closest pair algorithm
        const width = 500;
        const height = 300;
        newProblem = Array.from({ length: problemSize }, () => ({
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height)
        }));
        break;
        
      case 'heap':
        // Generate heap elements
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 100));
        break;
        
      default:
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 100));
    }
    
    setProblem(newProblem);
    setOriginalProblem([...newProblem]);
    resetVisualization();
    
    // Draw the initial state of the problem
    setTimeout(() => {
      drawProblem({ array: newProblem });
    }, 0);
  }

  // Handle custom input
  const handleCustomInput = () => {
    try {
      let parsedInput;
      
      if (algorithm === 'closestPair') {
        // Parse points input as pairs of numbers (x,y)
        const pointPairs = customInput.split('),').map(pair => pair.replace(/[()]/g, '').trim());
        parsedInput = pointPairs.map(pair => {
          const [x, y] = pair.split(',').map(num => parseInt(num.trim()));
          if (isNaN(x) || isNaN(y)) throw new Error('Invalid point format');
          return { x, y };
        });
      } else {
        // Parse regular array
        parsedInput = customInput.split(',').map(item => parseInt(item.trim()));
        if (parsedInput.some(isNaN)) throw new Error('Invalid number format');
      }
      
      setProblem(parsedInput);
      setOriginalProblem([...parsedInput]);
      setProblemSize(parsedInput.length);
      resetVisualization();
      
      // For binary search, set a default target if not provided
      if (algorithm === 'binarySearch' && parsedInput.length > 0) {
        setResult({ target: parsedInput[Math.floor(Math.random() * parsedInput.length)] });
      }
    } catch (error) {
      alert(`Please enter valid input: ${error.message}`);
    }
  };


  // Reset visualization state
  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setAlgorithmHistory([]);
    setExplanation('');
    setHighlightedLines([]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };


  // Prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, divideConquerPrompts.length - 1));
  }
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  }
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  }

  // Initialize component
  useEffect(() => {
    // Only generate random problem if algorithm is defined
    if (algorithm) {
      generateRandomProblem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  // Draw problem based on algorithm type
  const drawProblem = (historyItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (algorithm) {
      case 'mergeSort':
      case 'quickSort':
        drawSortingArray(ctx, historyItem);
        break;
      case 'binarySearch':
        drawBinarySearch(ctx, historyItem);
        break;
      case 'maxSubarray':
        drawMaxSubarray(ctx, historyItem);
        break;
      case 'closestPair':
        drawClosestPair(ctx, historyItem);
        break;
      case 'heap':
        drawHeap(ctx, historyItem);
        break;
      default:
        break;
    }
  };


  // Draw functions for different algorithms
  const drawSortingArray = (ctx, data) => {
    const { array, subArrays, comparing, merged, pivot, left, right, sorted } = data || {};
    if (!array) return;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barWidth = width / array.length;
    const maxValue = Math.max(...array) || 1;
    
    // Draw array bars
    array.forEach((value, index) => {
      // Calculate bar height proportional to canvas height and max value
      const barHeight = (value / maxValue) * (height - 60);
      const x = index * barWidth;
      const y = height - barHeight - 30;
      
      // Set bar color based on state
      let color = '#90caf9'; // Default blue
      
      // Element is in a sorted subarray
      if (sorted && sorted.includes(index)) {
        color = '#4caf50'; // Green
      }
      
      // Element is in current processing range
      if (left !== undefined && right !== undefined && index >= left && index <= right) {
        color = '#ffeb3b'; // Yellow
      }
      
      // Element is being compared
      if (comparing && comparing.includes(index)) {
        color = '#ff9800'; // Orange
      }
      
      // Element is pivot
      if (pivot === index) {
        color = '#f44336'; // Red
      }
      
      // Element has just been merged
      if (merged && merged.includes(index)) {
        color = '#9c27b0'; // Purple
      }
      
      // Draw the bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Draw value on top of the bar
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      
      // Draw index below the bar
      ctx.fillText(index.toString(), x + barWidth / 2, height - 5);
    });
    
    // Draw subarray boundaries if available
    if (subArrays && subArrays.length > 0) {
      ctx.strokeStyle = '#ff5722';
      ctx.lineWidth = 2;
      
      subArrays.forEach(({ start, end }) => {
        const startX = start * barWidth;
        const endX = (end + 1) * barWidth - 1;
        
        // Draw bracket above the subarray
        ctx.beginPath();
        ctx.moveTo(startX, 20);
        ctx.lineTo(startX, 30);
        ctx.lineTo(endX, 30);
        ctx.lineTo(endX, 20);
        ctx.stroke();
      });
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#90caf9', label: 'Unsorted' },
      { color: '#ffeb3b', label: 'Current Range' },
      { color: '#ff9800', label: 'Comparing' },
      { color: '#f44336', label: 'Pivot' },
      { color: '#9c27b0', label: 'Just Merged' },
      { color: '#4caf50', label: 'Sorted' }
    ]);
  }

  const drawBinarySearch = (ctx, data) => {
    const { array, left, right, mid, target, found } = data || {};
    if (!array || target === undefined) return;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barWidth = width / array.length;
    const maxValue = Math.max(...array) || 1;
    
    // Draw array bars
    array.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 60);
      const x = index * barWidth;
      const y = height - barHeight - 30;
      
      // Set bar color based on state
      let color = '#90caf9'; // Default blue
      
      // Element is in current search range
      if (left !== undefined && right !== undefined && index >= left && index <= right) {
        color = '#4caf50'; // Green for search range
      }
      
      // Element is middle
      if (mid === index) {
        color = '#ff9800'; // Orange for middle element
      }
      
      // Element is found
      if (found === index) {
        color = '#f44336'; // Red for found element
      }
      
      // Draw the bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Draw value on top of the bar
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      
      // Draw index below the bar
      ctx.fillText(index.toString(), x + barWidth / 2, height - 5);
    });
    
    // Draw target value
    ctx.fillStyle = '#f44336';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Target: ${target}`, 10, 20);
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#90caf9', label: 'Array Element' },
      { color: '#4caf50', label: 'Search Range' },
      { color: '#ff9800', label: 'Middle Element' },
      { color: '#f44336', label: 'Found Element' }
    ]);
  }

  const drawMaxSubarray = (ctx, data) => {
    const { array, leftHalf, rightHalf, leftMax, rightMax, crossMax, maxSum, currentRange } = data || {};
    if (!array) return;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barWidth = width / array.length;
    
    // Find min and max values for scaling
    const minValue = Math.min(...array);
    const maxValue = Math.max(...array);
    const absMax = Math.max(Math.abs(minValue), Math.abs(maxValue));
    
    // Draw zero line
    const zeroY = height / 2;
    ctx.strokeStyle = '#888888';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw array bars
    array.forEach((value, index) => {
      // Calculate bar height (positive goes up, negative goes down)
      const barHeight = (Math.abs(value) / absMax) * (height / 2 - 40);
      const x = index * barWidth;
      let y = zeroY;
      
      if (value >= 0) {
        y -= barHeight;
      }
      
      // Set bar color based on state
      let color = '#90caf9'; // Default blue
      
      // Element is in left half
      if (leftHalf && leftHalf.includes(index)) {
        color = '#8bc34a'; // Light green
      }
      
      // Element is in right half
      if (rightHalf && rightHalf.includes(index)) {
        color = '#ff9800'; // Orange
      }
      
      // Element is in crossing subarray
      if (crossMax && crossMax.includes(index)) {
        color = '#9c27b0'; // Purple
      }
      
      // Element is in current best max subarray
      if (maxSum && maxSum.includes(index)) {
        color = '#f44336'; // Red
      }
      
      // Element is in current range being processed
      if (currentRange && currentRange.includes(index)) {
        color = '#ffeb3b'; // Yellow
      }
      
      // Draw the bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 1, value >= 0 ? barHeight : -barHeight);
      
      // Draw value on the bar
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const textY = value >= 0 ? y - 5 : y + barHeight + 12;
      ctx.fillText(value.toString(), x + barWidth / 2, textY);
      
      // Draw index below the chart
      ctx.fillText(index.toString(), x + barWidth / 2, height - 5);
    });
    
    // Draw current max sum
    if (maxSum) {
      const sum = maxSum.reduce((acc, index) => acc + array[index], 0);
      ctx.fillStyle = '#f44336';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Max Sum: ${sum}`, 10, 20);
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#90caf9', label: 'Array Element' },
      { color: '#8bc34a', label: 'Left Half' },
      { color: '#ff9800', label: 'Right Half' },
      { color: '#9c27b0', label: 'Crossing Subarray' },
      { color: '#ffeb3b', label: 'Current Range' },
      { color: '#f44336', label: 'Max Subarray' }
    ]);
  }

  const drawClosestPair = (ctx, data) => {
    const { points, leftPoints, rightPoints, closestPair, strip, currentPair, midLine } = data || {};
    if (!points) return;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Draw all points
    points.forEach((point, index) => {
      // Determine point color based on state
      let color = '#90caf9'; // Default blue
      
      // Point is in left half
      if (leftPoints && leftPoints.includes(index)) {
        color = '#4caf50'; // Green
      }
      
      // Point is in right half
      if (rightPoints && rightPoints.includes(index)) {
        color = '#ff9800'; // Orange
      }
      
      // Point is in strip
      if (strip && strip.includes(index)) {
        color = '#9c27b0'; // Purple
      }
      
      // Point is in current pair being checked
      if (currentPair && currentPair.includes(index)) {
        color = '#f44336'; // Red
      }
      
      // Draw the point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw point coordinates
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`(${point.x},${point.y})`, point.x, point.y - 10);
    });
    
    // Draw vertical line at middle x coordinate if provided
    if (midLine !== undefined) {
      ctx.strokeStyle = '#ff5722';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(midLine, 0);
      ctx.lineTo(midLine, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw line between closest pair if provided
    if (closestPair && closestPair.length === 2) {
      const p1 = points[closestPair[0]];
      const p2 = points[closestPair[1]];
      
      ctx.strokeStyle = '#f44336';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      
      // Draw distance
      const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dist.toFixed(2), midX, midY - 10);
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#90caf9', label: 'Point' },
      { color: '#4caf50', label: 'Left Half' },
      { color: '#ff9800', label: 'Right Half' },
      { color: '#9c27b0', label: 'Strip' },
      { color: '#f44336', label: 'Current Pair' }
    ]);
  }

  const drawHeap = (ctx, data) => {
    const { array, heapSize, heapify, insert } = data || {};
    if (!array) return;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barWidth = width / array.length;
    
    // Draw array bars
    array.forEach((value, index) => {
      const barHeight = (value / Math.max(...array)) * (height - 60);
      const x = index * barWidth;
      const y = height - barHeight - 30;
      
      // Set bar color based on state
      let color = '#90caf9'; // Default blue
      
      // Element is in heap
      if (heapSize && heapSize.includes(index)) {
        color = '#8bc34a'; // Light green
      }
      
      // Element is being heapified
      if (heapify && heapify.includes(index)) {
        color = '#ff9800'; // Orange
      }
      
      // Element is being inserted
      if (insert && insert.includes(index)) {
        color = '#f44336'; // Red
      }
      
      // Draw the bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Draw value on the bar
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      
      // Draw index below the chart
      ctx.fillText(index.toString(), x + barWidth / 2, height - 5);
    });
    
    // Draw heap size
    ctx.fillStyle = '#f44336';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Heap Size: ${heapSize ? heapSize.length : 0}`, 10, 20);
    
    // Draw heapify
    ctx.fillStyle = '#8bc34a';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Heapify: [${heapify ? heapify.join(', ') : ''}]`, 10, 40);
    
    // Draw insert
    ctx.fillStyle = '#f44336';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Insert: [${insert ? insert.join(', ') : ''}]`, 10, 60);
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#90caf9', label: 'Array Element' },
      { color: '#8bc34a', label: 'Heap' },
      { color: '#ff9800', label: 'Heapify' },
      { color: '#f44336', label: 'Insert' }
    ]);
  }

  // Helper function to draw legend
  const drawLegend = (ctx, items) => {
    const legendX = ctx.canvas.width - 150;
    const legendY = 30;
    const spacing = 20;
    
    items.forEach((item, index) => {
      const y = legendY + index * spacing;
      
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 20, y + 12);
    });
  }

  // Step forward function
  const stepForward = () => {
    if (currentStep < totalSteps && algorithmHistory.length > 0) {
      // Cancel any existing animation to prevent overriding manual steps
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Update state based on next history item
      const historyItem = algorithmHistory[nextStep - 1];
      if (historyItem) {
        setExplanation(historyItem.explanation);
        setHighlightedLines(historyItem.highlightedLines || []);
        drawProblem(historyItem);
      }
      
      // If was running automatically, pause
      if (isRunning && !isPaused) {
        setIsPaused(true);
      }
    }
  };


  // Run the selected algorithm with visualization
  const runAlgorithm = () => {
    if (!problem || (Array.isArray(problem) && problem.length === 0)) {
      alert('Please generate a problem first');
      return;
    }
    
    setIsRunning(true);
    setIsPaused(false);
    
    // Always regenerate algorithm history to ensure fresh state
    const history = [];
    let result;
    
    switch (algorithm) {
      case 'mergeSort':
        result = runMergeSort([...problem], history);
        break;
      case 'quickSort':
        result = runQuickSort([...problem], history);
        break;
      case 'binarySearch':
        result = runBinarySearch([...problem], result ? result.target : 0, history);
        break;
      case 'maxSubarray':
        result = runMaxSubarray([...problem], history);
        break;
      case 'closestPair':
        result = runClosestPair([...problem], history);
        break;
      case 'heap':
        result = runHeapSort([...problem], history);
        break;
      default:
        break;
    }
    
    setAlgorithmHistory(history);
    setResult(result);
    setTotalSteps(history.length);
    setCurrentStep(0);
    
    // Start animation from the first step
    animateAlgorithm(0, history);
  }

  // Run Merge Sort with history tracking
  const runMergeSort = (array, history) => {
    // Track recursion stack to visualize
    const stack = [];
    
    history.push({
      array: [...array],
      explanation: `Starting Merge Sort on array of ${array.length} elements.`,
      highlightedLines: [2, 3, 4, 5]
    });
    
    const sortedArray = mergeSortWithHistory(array, 0, array.length - 1, history, stack);
    
    history.push({
      array: sortedArray,
      sorted: Array.from({ length: sortedArray.length }, (_, i) => i),
      explanation: 'Array is now fully sorted.',
      highlightedLines: [40, 41]
    });
    
    return sortedArray;
  }
  
  // Helper function for merge sort with history tracking
  const mergeSortWithHistory = (array, startIdx, endIdx, history, stack) => {
    // Base case: array with 0 or 1 element is already sorted
    if (startIdx >= endIdx) {
      const subArray = [array[startIdx]];
      
      // For visualization, highlight this single element as a subarray
      if (startIdx === endIdx) {
        history.push({
          array: [...array],
          subArrays: [{ start: startIdx, end: endIdx }],
          explanation: `Subarray with single element ${array[startIdx]} is already sorted.`,
          highlightedLines: [2, 3, 4, 5]
        });
      }
      
      return subArray;
    }
    
    // Calculate middle index
    const mid = Math.floor((startIdx + endIdx) / 2);
    
    // For visualization, track current subarray being processed
    history.push({
      array: [...array],
      subArrays: [{ start: startIdx, end: endIdx }],
      explanation: `Dividing array[${startIdx}...${endIdx}] at mid=${mid}.`,
      highlightedLines: [8, 9, 10]
    });
    
    // Recursively sort left half
    stack.push({ type: 'left', start: startIdx, end: mid });
    const leftHalf = mergeSortWithHistory(array, startIdx, mid, history, stack);
    stack.pop();
    
    // Update history after left half is sorted
    history.push({
      array: [...array],
      subArrays: [{ start: startIdx, end: mid }, { start: mid + 1, end: endIdx }],
      explanation: `Left half array[${startIdx}...${mid}] is sorted: [${leftHalf.join(', ')}].`,
      highlightedLines: [13]
    });
    
    // Recursively sort right half
    stack.push({ type: 'right', start: mid + 1, end: endIdx });
    const rightHalf = mergeSortWithHistory(array, mid + 1, endIdx, history, stack);
    stack.pop();
    
    // Update history after right half is sorted
    history.push({
      array: [...array],
      subArrays: [{ start: startIdx, end: mid }, { start: mid + 1, end: endIdx }],
      explanation: `Right half array[${mid + 1}...${endIdx}] is sorted: [${rightHalf.join(', ')}].`,
      highlightedLines: [14]
    });
    
    // Merge the sorted halves
    stack.push({ type: 'merge', start: startIdx, end: endIdx });
    const merged = mergeWithHistory(leftHalf, rightHalf, array, startIdx, history);
    stack.pop();
    
    // Update the original array (for visualization purposes)
    for (let i = 0; i < merged.length; i++) {
      array[startIdx + i] = merged[i];
    }
    
    // For visualization, show the merged subarray
    history.push({
      array: [...array],
      subArrays: [{ start: startIdx, end: endIdx }],
      merged: Array.from({ length: merged.length }, (_, i) => startIdx + i),
      explanation: `Merged subarrays into [${merged.join(', ')}].`,
      highlightedLines: [17, 18]
    });
    
    return merged;
  }
  
  // Helper function to merge two sorted arrays with history tracking
  const mergeWithHistory = (left, right, originalArray, startIdx, history) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    history.push({
      array: [...originalArray],
      explanation: `Merging [${left.join(', ')}] and [${right.join(', ')}].`,
      highlightedLines: [22, 23, 24, 25]
    });
    
    // Compare elements from both arrays and merge them in sorted order
    while (leftIndex < left.length && rightIndex < right.length) {
      const comparing = [
        startIdx + leftIndex + (leftIndex < left.length ? 0 : right.length - rightIndex),
        startIdx + rightIndex + (rightIndex < right.length ? left.length : 0)
      ];
      
      history.push({
        array: [...originalArray],
        comparing,
        explanation: `Comparing ${left[leftIndex]} and ${right[rightIndex]}.`,
        highlightedLines: [27, 28, 29, 30, 31, 32, 33, 34]
      });
      
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
        
        history.push({
          array: [...originalArray],
          explanation: `${left[leftIndex - 1]} is smaller, adding to result.`,
          highlightedLines: [29, 30]
        });
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
        
        history.push({
          array: [...originalArray],
          explanation: `${right[rightIndex - 1]} is smaller (or equal), adding to result.`,
          highlightedLines: [31, 32, 33]
        });
      }
    }
    
    // Add remaining elements from left array
    if (leftIndex < left.length) {
      history.push({
        array: [...originalArray],
        explanation: `Adding remaining elements from left array: [${left.slice(leftIndex).join(', ')}].`,
        highlightedLines: [36, 37, 38, 39]
      });
      
      while (leftIndex < left.length) {
        result.push(left[leftIndex]);
        leftIndex++;
      }
    }
    
    // Add remaining elements from right array
    if (rightIndex < right.length) {
      history.push({
        array: [...originalArray],
        explanation: `Adding remaining elements from right array: [${right.slice(rightIndex).join(', ')}].`,
        highlightedLines: [41, 42, 43, 44]
      });
      
      while (rightIndex < right.length) {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    
    return result;
  }

  // Run Quick Sort with history tracking
  const runQuickSort = (array, history) => {
    history.push({
      array: [...array],
      explanation: `Starting Quick Sort on array of ${array.length} elements.`,
      highlightedLines: [2, 3, 4, 5, 6, 7]
    });
    
    quickSortWithHistory(array, 0, array.length - 1, history);
    
    history.push({
      array: [...array],
      sorted: Array.from({ length: array.length }, (_, i) => i),
      explanation: 'Array is now fully sorted.',
      highlightedLines: [8, 9]
    });
    
    return array;
  }
  
  // Helper function for quick sort with history tracking
  const quickSortWithHistory = (array, left, right, history) => {
    if (left < right) {
      // For visualization, track current partition
      history.push({
        array: [...array],
        left,
        right,
        explanation: `Partitioning array[${left}...${right}].`,
        highlightedLines: [4, 5]
      });
      
      // Partition the array and get the pivot index
      const pivotIndex = partitionWithHistory(array, left, right, history);
      
      // For visualization, show after partition
      history.push({
        array: [...array],
        left,
        right,
        pivot: pivotIndex,
        explanation: `Partitioned array. Pivot element ${array[pivotIndex]} is now at its correct position.`,
        highlightedLines: [14, 15, 16]
      });
      
      // Recursively sort the subarrays
      history.push({
        array: [...array],
        left,
        right: pivotIndex - 1,
        explanation: `Recursively sorting left subarray [${left}...${pivotIndex - 1}].`,
        highlightedLines: [18, 19]
      });
      
      quickSortWithHistory(array, left, pivotIndex - 1, history);
      
      history.push({
        array: [...array],
        left: pivotIndex + 1,
        right,
        explanation: `Recursively sorting right subarray [${pivotIndex + 1}...${right}].`,
        highlightedLines: [20, 21]
      });
      
      quickSortWithHistory(array, pivotIndex + 1, right, history);
    } else if (left === right) {
      // For visualization, highlight single element array
      history.push({
        array: [...array],
        left,
        right,
        explanation: `Subarray with single element ${array[left]} is already sorted.`,
        highlightedLines: [2, 3]
      });
    }
  };

  
  // Helper function to partition the array with history tracking
  const partitionWithHistory = (array, left, right, history) => {
    // Choose the rightmost element as pivot
    const pivot = array[right];
    
    history.push({
      array: [...array],
      pivot: right,
      explanation: `Selected pivot element ${pivot} at index ${right}.`,
      highlightedLines: [13, 14]
    });
    
    // Index of the smaller element
    let i = left - 1;
    
    // For visualization
    history.push({
      array: [...array],
      explanation: `Initialize smaller element index i = ${i}.`,
      highlightedLines: [16, 17]
    });
    
    // Compare each element with pivot
    for (let j = left; j < right; j++) {
      history.push({
        array: [...array],
        comparing: [j, right],
        explanation: `Comparing element ${array[j]} at index ${j} with pivot ${pivot}.`,
        highlightedLines: [19, 20, 21, 22, 23]
      });
      
      // If current element is smaller than or equal to the pivot
      if (array[j] <= pivot) {
        // Increment index of smaller element
        i++;
        
        history.push({
          array: [...array],
          comparing: [i, j],
          explanation: `${array[j]} <= ${pivot}, incrementing i to ${i} and swapping elements at indices ${i} and ${j}.`,
          highlightedLines: [24, 25, 26, 27, 28]
        });
        
        // Swap elements
        [array[i], array[j]] = [array[j], array[i]];
        
        history.push({
          array: [...array],
          explanation: `Swapped elements: ${array[i]} and ${array[j]}.`,
          highlightedLines: [29, 30]
        });
      } else {
        history.push({
          array: [...array],
          explanation: `${array[j]} > ${pivot}, no action needed.`,
          highlightedLines: [24, 25]
        });
      }
    }
    
    // Swap the pivot element with the element at (i + 1)
    history.push({
      array: [...array],
      comparing: [i + 1, right],
      explanation: `Placing pivot at its correct position. Swapping elements at indices ${i + 1} and ${right}.`,
      highlightedLines: [33, 34]
    });
    
    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    
    history.push({
      array: [...array],
      pivot: i + 1,
      explanation: `Pivot ${pivot} is now at its correct position (index ${i + 1}).`,
      highlightedLines: [35, 36]
    });
    
    // Return the pivot index
    return i + 1;
  }

  // Run Binary Search with history tracking
  const runBinarySearch = (array, target, history) => {
    // Ensure array is sorted
    array.sort((a, b) => a - b);
    
    history.push({
      array: [...array],
      target,
      explanation: `Starting Binary Search for target ${target} in sorted array.`,
      highlightedLines: [2, 3, 4, 5]
    });
    
    const result = binarySearchWithHistory(array, target, 0, array.length - 1, history);
    
    if (result !== -1) {
      history.push({
        array: [...array],
        target,
        found: result,
        explanation: `Target ${target} found at index ${result}.`,
        highlightedLines: [10, 11, 12]
      });
    } else {
      history.push({
        array: [...array],
        target,
        explanation: `Target ${target} not found in the array.`,
        highlightedLines: [16, 17]
      });
    }
    
    return result;
  }
  
  // Helper function for binary search with history tracking
  const binarySearchWithHistory = (array, target, left, right, history) => {
    // Base case: element not found
    if (left > right) {
      history.push({
        array: [...array],
        target,
        explanation: `Search range is empty (${left} > ${right}). Target not found.`,
        highlightedLines: [2, 3, 4]
      });
      return -1;
    }
    
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);
    
    history.push({
      array: [...array],
      target,
      left,
      right,
      mid,
      explanation: `Searching in range [${left}...${right}]. Middle element is at index ${mid} with value ${array[mid]}.`,
      highlightedLines: [7, 8]
    });
    
    // Found the target
    if (array[mid] === target) {
      history.push({
        array: [...array],
        target,
        found: mid,
        explanation: `Middle element ${array[mid]} equals target ${target}. Found at index ${mid}!`,
        highlightedLines: [10, 11, 12]
      });
      return mid;
    }
    
    // If target is smaller, search in the left half
    if (array[mid] > target) {
      history.push({
        array: [...array],
        target,
        left,
        right: mid - 1,
        explanation: `Middle element ${array[mid]} > target ${target}. Searching in left half [${left}...${mid - 1}].`,
        highlightedLines: [15, 16]
      });
      return binarySearchWithHistory(array, target, left, mid - 1, history);
    }
    
    // If target is larger, search in the right half
    history.push({
      array: [...array],
      target,
      left: mid + 1,
      right,
      explanation: `Middle element ${array[mid]} < target ${target}. Searching in right half [${mid + 1}...${right}].`,
      highlightedLines: [19, 20]
    });
    return binarySearchWithHistory(array, target, mid + 1, right, history);
  }

  // Run Maximum Subarray with history tracking
  const runMaxSubarray = (array, history) => {
    history.push({
      array: [...array],
      explanation: `Starting Maximum Subarray search on array of ${array.length} elements.`,
      highlightedLines: [2, 3, 4]
    });
    
    const { maxSum, indices } = maxSubarrayWithHistory(array, 0, array.length - 1, history);
    
    history.push({
      array: [...array],
      maxSum: indices,
      explanation: `Maximum subarray found with sum ${maxSum}. Indices: [${indices.join(', ')}].`,
      highlightedLines: [21, 22]
    });
    
    return { maxSum, indices };
  }
  
  // Helper function for maximum subarray with history tracking
  const maxSubarrayWithHistory = (array, start, end, history) => {
    // Base case: only one element
    if (start === end) {
      history.push({
        array: [...array],
        currentRange: [start],
        explanation: `Subarray with single element ${array[start]} at index ${start}.`,
        highlightedLines: [2, 3, 4]
      });
      
      return {
        maxSum: array[start],
        indices: array[start] > 0 ? [start] : []
      }
    }
    
    // Find the middle point
    const mid = Math.floor((start + end) / 2);
    
    history.push({
      array: [...array],
      currentRange: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      explanation: `Dividing array[${start}...${end}] at mid=${mid}.`,
      highlightedLines: [7, 8]
    });
    
    // Calculate maximum subarray sum for left half
    history.push({
      array: [...array],
      leftHalf: Array.from({ length: mid - start + 1 }, (_, i) => start + i),
      explanation: `Recursively finding maximum subarray in left half [${start}...${mid}].`,
      highlightedLines: [11, 12]
    });
    
    const leftResult = maxSubarrayWithHistory(array, start, mid, history);
    
    // Calculate maximum subarray sum for right half
    history.push({
      array: [...array],
      rightHalf: Array.from({ length: end - mid }, (_, i) => mid + 1 + i),
      explanation: `Recursively finding maximum subarray in right half [${mid + 1}...${end}].`,
      highlightedLines: [14, 15]
    });
    
    const rightResult = maxSubarrayWithHistory(array, mid + 1, end, history);
    
    // Calculate maximum subarray sum that crosses the middle
    history.push({
      array: [...array],
      explanation: `Finding maximum subarray that crosses the middle at index ${mid}.`,
      highlightedLines: [17, 18]
    });
    
    const crossResult = maxCrossingSumWithHistory(array, start, mid, end, history);
    
    // Return the maximum of the three
    history.push({
      array: [...array],
      leftHalf: leftResult.indices,
      rightHalf: rightResult.indices,
      crossMax: crossResult.indices,
      explanation: `Comparing sums: Left (${leftResult.maxSum}), Right (${rightResult.maxSum}), Cross (${crossResult.maxSum}).`,
      highlightedLines: [20, 21]
    });
    
    if (leftResult.maxSum >= rightResult.maxSum && leftResult.maxSum >= crossResult.maxSum) {
      return leftResult;
    } else if (rightResult.maxSum >= leftResult.maxSum && rightResult.maxSum >= crossResult.maxSum) {
      return rightResult;
    } else {
      return crossResult;
    }
  };

  
  // Find the maximum crossing subarray with history tracking
  const maxCrossingSumWithHistory = (array, start, mid, end, history) => {
    // Find maximum sum of left subarray including mid
    let leftSum = -Infinity;
    let sum = 0;
    let leftMaxEnd = mid;
    
    for (let i = mid; i >= start; i--) {
      sum += array[i];
      
      history.push({
        array: [...array],
        comparing: [i],
        explanation: `Adding element ${array[i]} at index ${i} to left sum. Current sum: ${sum}.`,
        highlightedLines: [40, 41, 42, 43]
      });
      
      if (sum > leftSum) {
        leftSum = sum;
        leftMaxEnd = i;
        
        history.push({
          array: [...array],
          explanation: `Found new maximum left sum ${leftSum} starting at index ${i}.`,
          highlightedLines: [43, 44]
        });
      }
    }
    
    // Find maximum sum of right subarray excluding mid
    let rightSum = -Infinity;
    sum = 0;
    let rightMaxEnd = mid + 1;
    
    for (let i = mid + 1; i <= end; i++) {
      sum += array[i];
      
      history.push({
        array: [...array],
        comparing: [i],
        explanation: `Adding element ${array[i]} at index ${i} to right sum. Current sum: ${sum}.`,
        highlightedLines: [52, 53, 54, 55]
      });
      
      if (sum > rightSum) {
        rightSum = sum;
        rightMaxEnd = i;
        
        history.push({
          array: [...array],
          explanation: `Found new maximum right sum ${rightSum} ending at index ${i}.`,
          highlightedLines: [55, 56]
        });
      }
    }
    
    // Calculate indices of crossing subarray
    const indices = [];
    for (let i = leftMaxEnd; i <= rightMaxEnd; i++) {
      indices.push(i);
    }
    
    const crossSum = leftSum + rightSum;
    
    history.push({
      array: [...array],
      crossMax: indices,
      explanation: `Crossing maximum subarray has sum ${crossSum}, spanning indices [${indices.join(', ')}].`,
      highlightedLines: [59, 60]
    });
    
    return {
      maxSum: crossSum,
      indices
    }
  };


  // Run Closest Pair of Points with history tracking
  const runClosestPair = (points, history) => {
    if (points.length < 2) {
      history.push({
        points: [...points],
        explanation: `Need at least 2 points to find closest pair. Current: ${points.length} points.`,
        highlightedLines: [2, 3, 4]
      });
      return { distance: Infinity, pair: [] };
    }
    
    history.push({
      points: [...points],
      explanation: `Starting Closest Pair search with ${points.length} points.`,
      highlightedLines: [1, 2]
    });
    
    // Sort points by x-coordinate
    const pointsByX = [...points].sort((a, b) => a.x - b.x);
    
    history.push({
      points: pointsByX,
      explanation: 'Sorted points by x-coordinate.',
      highlightedLines: [3, 4]
    });
    
    // Call recursive function
    const { minDist, closestPair } = closestPairRecWithHistory(pointsByX, history);
    
    history.push({
      points: pointsByX,
      closestPair,
      explanation: `Found closest pair with distance ${minDist.toFixed(2)}.`,
      highlightedLines: [5, 6]
    });
    
    return { distance: minDist, pair: closestPair };
  }
  
  // Helper function for closest pair with history tracking
  const closestPairRecWithHistory = (pointsByX, history) => {
    // Base cases
    if (pointsByX.length <= 3) {
      history.push({
        points: pointsByX,
        explanation: `Small set of ${pointsByX.length} points. Using brute force approach.`,
        highlightedLines: [10, 11]
      });
      
      return bruteForceClosestPairWithHistory(pointsByX, history);
    }
    
    // Divide points into two halves
    const mid = Math.floor(pointsByX.length / 2);
    const midX = pointsByX[mid].x;
    
    history.push({
      points: pointsByX,
      midLine: midX,
      explanation: `Dividing points at x = ${midX}. Left: ${mid} points, Right: ${pointsByX.length - mid} points.`,
      highlightedLines: [14, 15, 16, 17, 18]
    });
    
    const leftPoints = pointsByX.slice(0, mid);
    const rightPoints = pointsByX.slice(mid);
    
    const leftIndices = Array.from({ length: leftPoints.length }, (_, i) => i);
    const rightIndices = Array.from({ length: rightPoints.length }, (_, i) => mid + i);
    
    history.push({
      points: pointsByX,
      leftPoints: leftIndices,
      explanation: `Recursively finding closest pair in left half (${leftPoints.length} points).`,
      highlightedLines: [19, 20]
    });
    
    // Recursively find minimum distance in left half
    const { minDist: leftMinDist, closestPair: leftClosestPair } = 
      closestPairRecWithHistory(leftPoints, history);
    
    // Adjust indices for left closest pair
    const adjustedLeftPair = leftClosestPair.map(i => i);
    
    history.push({
      points: pointsByX,
      rightPoints: rightIndices,
      explanation: `Recursively finding closest pair in right half (${rightPoints.length} points).`,
      highlightedLines: [21, 22]
    });
    
    // Recursively find minimum distance in right half
    const { minDist: rightMinDist, closestPair: rightClosestPair } = 
      closestPairRecWithHistory(rightPoints, history);
    
    // Adjust indices for right closest pair
    const adjustedRightPair = rightClosestPair.map(i => i + mid);
    
    // Determine minimum of left and right distances
    let minDist, closestPair;
    
    if (leftMinDist <= rightMinDist) {
      minDist = leftMinDist;
      closestPair = adjustedLeftPair;
      
      history.push({
        points: pointsByX,
        closestPair: adjustedLeftPair,
        explanation: `Left half has the smaller distance so far: ${minDist.toFixed(2)}.`,
        highlightedLines: [24, 25]
      });
    } else {
      minDist = rightMinDist;
      closestPair = adjustedRightPair;
      
      history.push({
        points: pointsByX,
        closestPair: adjustedRightPair,
        explanation: `Right half has the smaller distance so far: ${minDist.toFixed(2)}.`,
        highlightedLines: [24, 25]
      });
    }
    
    // Build a strip of points around the middle
    const stripIndices = [];
    const strip = [];
    
    for (let i = 0; i < pointsByX.length; i++) {
      if (Math.abs(pointsByX[i].x - midX) < minDist) {
        stripIndices.push(i);
        strip.push({ ...pointsByX[i], originalIndex: i });
      }
    }
    
    history.push({
      points: pointsByX,
      strip: stripIndices,
      midLine: midX,
      explanation: `Created a strip of ${strip.length} points within distance ${minDist.toFixed(2)} of the middle line.`,
      highlightedLines: [27, 28, 29, 30, 31, 32]
    });
    
    // Sort strip by y-coordinate
    strip.sort((a, b) => a.y - b.y);
    
    history.push({
      points: pointsByX,
      strip: stripIndices,
      explanation: 'Sorted strip points by y-coordinate.',
      highlightedLines: [33, 34]
    });
    
    // Find minimum distance within the strip
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < minDist; j++) {
        const currentPair = [strip[i].originalIndex, strip[j].originalIndex];
        
        history.push({
          points: pointsByX,
          strip: stripIndices,
          currentPair,
          explanation: `Checking distance between points at indices ${currentPair[0]} and ${currentPair[1]}.`,
          highlightedLines: [35, 36, 37]
        });
        
        const dist = distance(strip[i], strip[j]);
        
        if (dist < minDist) {
          minDist = dist;
          closestPair = currentPair;
          
          history.push({
            points: pointsByX,
            closestPair: currentPair,
            explanation: `Found new minimum distance ${minDist.toFixed(2)} between points at indices ${currentPair[0]} and ${currentPair[1]}.`,
            highlightedLines: [37, 38]
          });
        }
      }
    }
    
    return { minDist, closestPair };
  }
  
  // Brute force approach for closest pair with history tracking
  const bruteForceClosestPairWithHistory = (points, history) => {
    let minDist = Infinity;
    let closestPair = [];
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const currentPair = [i, j];
        
        history.push({
          points,
          currentPair,
          explanation: `Checking distance between points at indices ${i} and ${j}.`,
          highlightedLines: [50, 51, 52, 53]
        });
        
        const dist = Math.sqrt(
          Math.pow(points[i].x - points[j].x, 2) + 
          Math.pow(points[i].y - points[j].y, 2)
        );
        
        if (dist < minDist) {
          minDist = dist;
          closestPair = currentPair;
          
          history.push({
            points,
            closestPair: currentPair,
            explanation: `Found new minimum distance ${minDist.toFixed(2)} between points at indices ${i} and ${j}.`,
            highlightedLines: [54, 55]
          });
        }
      }
    }
    
    return { minDist, closestPair };
  }
  
  // Helper function to calculate distance between two points
  const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  // Animate algorithm steps
  const animateAlgorithm = (step, history) => {
    if (isPaused) {
      return;
    }
    
    if (step >= history.length) {
      setIsRunning(false);
      return;
    }
    
    const historyItem = history[step];
    setCurrentStep(step);
    setExplanation(historyItem.explanation || '');
    setHighlightedLines(historyItem.highlightedLines || []);
    
    // Apply a smooth transition effect between steps
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Fade out current visualization
      const fadeOut = (alpha) => {
        if (alpha <= 0) {
          // When fade out completes, draw the new step and fade it in
          drawProblem(historyItem);
          fadeIn(0);
          return;
        }
        
        // Apply semi-transparent overlay to create fade effect
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Continue fading out
        requestAnimationFrame(() => fadeOut(alpha - 0.2));
      };
      
      // Fade in new visualization
      const fadeIn = (alpha) => {
        if (alpha >= 1) {
          // When fade in completes, schedule next step
          const delay = 1000 - (speed * 10);
          animationRef.current = setTimeout(() => {
            animateAlgorithm(step + 1, history);
          }, delay);
          return;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the problem
        drawProblem(historyItem);
        
        // Apply semi-transparent overlay for fade effect
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Continue fading in
        requestAnimationFrame(() => fadeIn(alpha + 0.2));
      };
      
      // Start the fade transition
      fadeOut(1);
    } else {
      // Fallback if canvas not available
      drawProblem(historyItem);
      
      // Calculate delay based on speed (inverted: higher speed = lower delay)
      const delay = 1000 - (speed * 10);
      
      // Schedule next animation frame
      animationRef.current = setTimeout(() => {
        animateAlgorithm(step + 1, history);
      }, delay);
    }
  };

  return (
    <VisualizerLayout
      title="Divide and Conquer Algorithm Visualizer"
      prompts={divideConquerPrompts}
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
                // Will trigger useEffect to generate new problem
              }}
              disabled={isRunning}
            >
              {getAvailableAlgorithms().map((algo) => (
                <MenuItem key={algo} value={algo}>
                  {algorithmInfo[algo].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Problem Size</Typography>
            <Slider
              value={problemSize}
              min={5}
              max={algorithm === 'closestPair' ? 20 : 50}
              onChange={(_, value) => setProblemSize(value)}
              disabled={isRunning}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Animation Speed</Typography>
            <Slider
              value={speed}
              min={1}
              max={100}
              onChange={(_, value) => setSpeed(value)}
            />
          </Box>
          
          {/* Generate Random Problem Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={generateRandomProblem}
              startIcon={<RestartAltIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Generate Random Problem
            </Button>
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
            onStep={() => {
              if (currentStep < totalSteps - 1) {
                // Clear any existing animation timer
                if (animationRef.current) {
                  clearTimeout(animationRef.current);
                  animationRef.current = null;
                }
                
                // Pause the animation
                setIsPaused(true);
                
                // Move to the next step
                const nextStep = currentStep + 1;
                
                // Get the history item and update visualization
                const historyItem = algorithmHistory[nextStep];
                if (historyItem) {
                  setCurrentStep(nextStep);
                  setExplanation(historyItem.explanation || '');
                  setHighlightedLines(historyItem.highlightedLines || []);
                  
                  // Ensure canvas is updated
                  const canvas = canvasRef.current;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawProblem(historyItem);
                  }
                }
              }
            }}
            onReset={resetVisualization}
            isRunning={isRunning}
            isPaused={isPaused}
            currentStep={currentStep}
            totalSteps={totalSteps}
            disabled={isRunning && !isPaused}
            speed={speed}
            onSpeedChange={setSpeed}
          />
          
        </>
      }
      visualization={
        <>
          {/* Visualization Canvas */}
          <Box sx={{ mb: 2 }}>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              style={{ border: '1px solid #ccc', width: '100%', height: '400px' }}
            />
          </Box>

          {/* Explanation Card */}
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

          {/* Code Highlighter */}
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

export default DivideConquerVisualizer;