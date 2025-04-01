import React, { useState, useRef, useEffect } from 'react';
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
  Chip,
  Switch,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';
import AlgorithmComparisonSection from './SortingVisualizer/AlgorithmComparisonSection';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('quickSort');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [problemSize, setProblemSize] = useState(30);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [algorithmHistory, setAlgorithmHistory] = useState([]);
  const [currentSortingIndex, setCurrentSortingIndex] = useState(-1);
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [showOriginalArray, setShowOriginalArray] = useState(true);
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Sorting algorithm prompts
  const sortingPrompts = [
    {
      title: 'Welcome to Sorting Visualizer',
      content: 'This tool helps you understand how different sorting algorithms work by visualizing the process step by step. You can see the algorithms in action and learn about their efficiency.'
    },
    {
      title: 'Choose an Algorithm',
      content: 'Select a sorting algorithm from the dropdown menu. Each algorithm has different characteristics and performance metrics. You can learn about their time and space complexity in the information panel.'
    },
    {
      title: 'Generate an Array',
      content: 'Click the "Generate Random Array" button to create a new array to sort. You can also adjust the array size using the slider or input your own values.'
    },
    {
      title: 'Control the Visualization',
      content: 'Use the play, pause, and step buttons to control the visualization. You can also adjust the speed to see the sorting process faster or slower.'
    },
    {
      title: 'Understand the Process',
      content: 'Watch how the algorithm compares and swaps elements. The explanation panel will describe each step of the process, helping you understand how the algorithm works.'
    }
  ];
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Code snippets for each sorting algorithm
  const codeSnippets = {
    quickSort: `// Quick Sort Implementation
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find the partition index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  // Select the rightmost element as pivot
  const pivot = arr[high];
  
  // Index of smaller element
  let i = low - 1;
  
  // Compare each element with pivot
  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    if (arr[j] < pivot) {
      // Increment index of smaller element
      i++;
      // Swap elements
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Swap pivot element with element at i+1
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  // Return the position where partition is done
  return i + 1;
}`,
    
    mergeSort: `// Merge Sort Implementation
function mergeSort(arr) {
  // Base case
  if (arr.length <= 1) return arr;
  
  // Find the middle point
  const middle = Math.floor(arr.length / 2);
  
  // Divide the array into two halves
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  
  // Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and merge them in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`,
    
    heapSort: `// Heap Sort Implementation
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
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
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}`,
    
    bubbleSort: `// Bubble Sort Implementation
function bubbleSort(arr) {
  const n = arr.length;
  
  // Traverse through all array elements
  for (let i = 0; i < n - 1; i++) {
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if current element is greater than next
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`,
    
    insertionSort: `// Insertion Sort Implementation
function insertionSort(arr) {
  const n = arr.length;
  
  // Start from the second element
  for (let i = 1; i < n; i++) {
    // Element to be inserted
    let key = arr[i];
    
    // Index of the previous element
    let j = i - 1;
    
    // Move elements greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert the key at its correct position
    arr[j + 1] = key;
  }
  
  return arr;
}`
  };
  
  // Algorithm complexity information
  const algorithmInfo = {
    quickSort: {
      name: 'Quick Sort',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(log n)',
      description: 'Quick Sort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around the pivot.'
    },
    mergeSort: {
      name: 'Merge Sort',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.'
    },
    heapSort: {
      name: 'Heap Sort',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure to build a heap and then repeatedly extracts the maximum element.'
    },
    bubbleSort: {
      name: 'Bubble Sort',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      description: 'Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.'
    },
    insertionSort: {
      name: 'Insertion Sort',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      description: 'Insertion Sort builds the final sorted array one item at a time, taking each element and inserting it into its correct position among the previously sorted elements.'
    },
  };

  // Generate random array
  const generateRandomArray = () => {
    const newArray = [];
    for (let i = 0; i < problemSize; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 5);
    }
    setArray(newArray);
    setOriginalArray([...newArray]);
    resetVisualization();
    drawArray(newArray, [], [], -1, []);
  };

  // Handle custom input
  const handleCustomInput = () => {
    try {
      const inputArray = customInput.split(',').map(num => parseInt(num.trim()));
      if (inputArray.some(isNaN)) {
        alert('Please enter valid numbers separated by commas');
        return;
      }
      setArray(inputArray);
      setOriginalArray([...inputArray]);
      setProblemSize(inputArray.length);
      resetVisualization();
      drawArray(inputArray, [], [], -1, []);
    } catch (error) {
      alert('Please enter valid numbers separated by commas');
    }
  };

  // Reset visualization
  const resetVisualization = () => {
    // Cancel any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset state
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setAlgorithmHistory([]);
    setTotalSteps(0);
    setExplanation('');
    setHighlightedLines([]);
    
    // Reset to original array if available, or generate a new one
    if (originalArray.length > 0) {
      setArray([...originalArray]);
    }
    
    // Clear canvas and redraw the array
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Need to use the original array here to ensure we're drawing the unsorted array
      const arrayToUse = originalArray.length > 0 ? [...originalArray] : [...array];
      drawArray(arrayToUse, [], [], -1, []);
    }
  };
  
  // Prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, sortingPrompts.length - 1));
  };
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  };

  // Draw array on canvas
  const drawArray = (arr, highlightIndices = [], swapIndices = [], pivotIndex = -1, mergeIndices = []) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Calculate the height for each array section
    const sectionHeight = showOriginalArray ? height / 2 - 20 : height;
    
    // Draw title for current array
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Current Array', 10, 20);
    
    // Draw the current array
    const barWidth = width / arr.length;
    const maxValue = Math.max(...arr, ...originalArray);
    
    arr.forEach((value, index) => {
      const barHeight = (value / maxValue) * (sectionHeight - 50); // Increased space at bottom for index
      const x = index * barWidth;
      const y = sectionHeight - barHeight - 20; // Added space at bottom for index
      
      // Set color based on the current state with enhanced highlighting
      if (index === pivotIndex) {
        ctx.fillStyle = '#9c27b0'; // Purple for pivot element
      } else if (swapIndices.includes(index)) {
        ctx.fillStyle = '#ff5722'; // Orange for swapping
      } else if (mergeIndices.includes(index)) {
        ctx.fillStyle = '#2196f3'; // Blue for merge elements
      } else if (highlightIndices.includes(index)) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for comparing
      } else {
        ctx.fillStyle = '#90caf9'; // Default light blue
      }
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Add border to highlight the current element more clearly
      if (swapIndices.includes(index) || index === pivotIndex || highlightIndices.includes(index) || mergeIndices.includes(index)) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth - 1, barHeight);
      }
      
      // Draw value on top of the bar with better visibility
      // Create a small white background for the value text
      const valueText = value.toString();
      const valueTextWidth = ctx.measureText(valueText).width;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + (barWidth - valueTextWidth) / 2 - 2, y - 15, valueTextWidth + 4, 12);
      
      // Draw the value text in black for better readability
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.fillText(valueText, x + (barWidth - valueTextWidth) / 2, y - 5);
      
      // Draw index below the bar
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.fillText(index.toString(), x + barWidth / 4, sectionHeight - 5);
      
      // Add a special marker for pivot element
      if (index === pivotIndex) {
        ctx.fillStyle = '#9c27b0';
        ctx.beginPath();
        ctx.moveTo(x + barWidth / 2, y - 15);
        ctx.lineTo(x + barWidth / 2 - 5, y - 5);
        ctx.lineTo(x + barWidth / 2 + 5, y - 5);
        ctx.fill();
      }
    });
    
    // Draw the original array if enabled
    if (showOriginalArray && originalArray.length > 0) {
      // Draw title for original array
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Original Array', 10, sectionHeight + 30);
      
      originalArray.forEach((value, index) => {
        const barHeight = (value / maxValue) * (sectionHeight - 50);
        const x = index * barWidth;
        const y = height - barHeight - 20;
        
        // Use a different color for the original array
        ctx.fillStyle = '#a5d6a7'; // Light green for original array
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        
        // Draw value on top of the bar if there's enough space
        if (barWidth > 20) {
          ctx.fillStyle = '#000000';
          ctx.font = '10px Arial';
          ctx.fillText(value.toString(), x + barWidth / 4, y - 5);
        }
        
        // Draw index below the bar
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText(index.toString(), x + barWidth / 4, height - 5);
      });
    }
    
    // Draw legend
    const legendY = 20;
    const legendX = width - 180;
    const legendSpacing = 20;
    
    // Pivot element legend
    ctx.fillStyle = '#9c27b0';
    ctx.fillRect(legendX, legendY, 15, 15);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('Pivot Element', legendX + 20, legendY + 12);
    
    // Swapping elements legend
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(legendX, legendY + legendSpacing, 15, 15);
    ctx.fillStyle = '#000000';
    ctx.fillText('Swapping Elements', legendX + 20, legendY + legendSpacing + 12);
    
    // Comparing elements legend
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(legendX, legendY + 2 * legendSpacing, 15, 15);
    ctx.fillStyle = '#000000';
    ctx.fillText('Comparing Elements', legendX + 20, legendY + 2 * legendSpacing + 12);
    
    // Original array legend
    if (showOriginalArray) {
      ctx.fillStyle = '#a5d6a7';
      ctx.fillRect(legendX, legendY + 3 * legendSpacing, 15, 15);
      ctx.fillStyle = '#000000';
      ctx.fillText('Original Array', legendX + 20, legendY + 3 * legendSpacing + 12);
    }
  };

  // Start the sorting process
  const runAlgorithm = () => {
    // If array is too small, nothing to sort
    if (array.length <= 1) {
      setExplanation('Array is already sorted!');
      return;
    }
    
    // Already sorting and not paused, don't restart
    if (isRunning && !isPaused) {
      return;
    }
    
    // If paused, just resume
    if (isPaused) {
      setIsPaused(false);
      animateAlgorithm(currentStep, algorithmHistory);
      return;
    }
    
    // Reset any existing animation
    clearTimeout(animationRef.current);
    animationRef.current = null;
    
    // Generate sorting history based on selected algorithm
    let history = [];
    const arrayCopy = [...array];
    
    if (algorithm === 'quickSort') {
      quickSortWithHistory(arrayCopy, 0, arrayCopy.length - 1, history);
    } else if (algorithm === 'mergeSort') {
      mergeSortWithHistory(arrayCopy, 0, arrayCopy.length - 1, history);
    } else if (algorithm === 'heapSort') {
      heapSortWithHistory(arrayCopy, history);
    } else if (algorithm === 'bubbleSort') {
      bubbleSortWithHistory(arrayCopy, history);
    } else if (algorithm === 'insertionSort') {
      insertionSortWithHistory(arrayCopy, history);
    }
    
    if (history.length === 0) {
      setExplanation('No steps to visualize for this sorting algorithm.');
      return;
    }
    
    // Set initial state
    setAlgorithmHistory(history);
    setTotalSteps(history.length);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
    
    // Draw initial state without waiting
    const firstItem = history[0];
    setArray([...firstItem.array]);
    setExplanation(firstItem.explanation || 'Starting sorting process...');
    setHighlightedLines(firstItem.highlightedLines || []);
    
    // Start the animation from step 0
    animateAlgorithm(0, history);
  };

  // Pause sorting
  const pauseSorting = () => {
    setIsPaused(true);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  // Step forward in the animation
  const stepForward = () => {
    // Check if we're already at the end or if there's no history
    if (currentStep >= totalSteps - 1 || !algorithmHistory.length) {
      return;
    }
    
    // Pause any running animation
    clearTimeout(animationRef.current);
    setIsPaused(true);
    
    // Get the next history item
    const nextStep = currentStep + 1;
    const historyItem = algorithmHistory[nextStep];
    
    if (!historyItem) {
      console.error('No history item found for step', nextStep);
      return;
    }
    
    // Update state with the next step information
    setCurrentStep(nextStep);
    setArray([...historyItem.array]);
    setExplanation(historyItem.explanation || '');
    setHighlightedLines(historyItem.highlightedLines || []);
    
    // Draw the new state
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawArray(
        historyItem.array,
        historyItem.comparing || [],
        historyItem.swapping || [],
        historyItem.pivotIndex !== undefined ? historyItem.pivotIndex : -1,
        historyItem.mergeIndices || []
      );
    }
  };

  // Animate sorting
  const animateAlgorithm = (step, history) => {
    // If paused and not forced to run, or not in sorting mode, don't proceed
    if ((isPaused && !step) || !isRunning) {
      return;
    }
    
    // Check if we've reached the end of the sorting steps
    if (step >= totalSteps) {
      setIsRunning(false);
      setIsPaused(false);
      setExplanation('Sorting completed!');
      return;
    }
    
    // Get the history item for the current step
    const historyItem = history[step];
    if (!historyItem) {
      console.error('No history item found for step', step);
      return;
    }
    
    // Update state with current step information
    setArray([...historyItem.array]);
    setExplanation(historyItem.explanation || '');
    setHighlightedLines(historyItem.highlightedLines || []);
    
    // Draw the current state
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Clear canvas and draw the new state
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawArray(
        historyItem.array, 
        historyItem.comparing || [], 
        historyItem.swapping || [],
        historyItem.pivotIndex !== undefined ? historyItem.pivotIndex : -1,
        historyItem.mergeIndices || []
      );
    }
    
    // Calculate delay based on speed (inverted: higher speed = lower delay)
    const delay = 1000 - (speed * 9);
    
    // Clear any existing timeout
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Schedule the next step
    animationRef.current = setTimeout(() => {
      // Important: First increase the step, then call animateAlgorithm
      if (step < totalSteps) {
        animateAlgorithm(step + 1, history);
      }
    }, delay);
  };

  // Quick Sort Implementation with History
  const quickSortWithHistory = (arr, low, high, history) => {
    if (low < high) {
      const pivotIndex = partition(arr, low, high, history);
      quickSortWithHistory(arr, low, pivotIndex - 1, history);
      quickSortWithHistory(arr, pivotIndex + 1, high, history);
    }
    return arr;
  };

  const partition = (arr, low, high, history) => {
    const pivot = arr[high];
    let i = low - 1;
    
    history.push({
      array: [...arr],
      comparing: [high],
      pivotIndex: high,
      explanation: `Selecting pivot element: ${pivot}`,
      highlightedLines: [13, 14] // Highlight pivot selection lines
    });
    
    for (let j = low; j < high; j++) {
      history.push({
        array: [...arr],
        comparing: [j, high],
        pivotIndex: high,
        explanation: `Comparing element ${arr[j]} with pivot ${pivot}`,
        highlightedLines: [19, 20] // Highlight the comparison loop
      });
      
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        if (i !== j) {
          history.push({
            array: [...arr],
            swapping: [i, j],
            pivotIndex: high,
            explanation: `Swapping elements: ${arr[j]} and ${arr[i]}`,
            highlightedLines: [24, 25] // Highlight the swapping lines
          });
        }
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    history.push({
      array: [...arr],
      swapping: [i + 1, high],
      pivotIndex: i + 1, // Pivot is now at i+1
      explanation: `Placing pivot ${pivot} in its correct position`,
      highlightedLines: [30, 31] // Highlight the pivot swap lines
    });
    
    return i + 1;
  };

  // Merge Sort Implementation with History
  const mergeSortWithHistory = (arr, left, right, history) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      history.push({
        array: [...arr],
        comparing: [left, right],
        explanation: `Dividing array into two halves: [${left}...${mid}] and [${mid+1}...${right}]`,
        highlightedLines: [3, 4, 5] // Highlight the division lines
      });
      
      mergeSortWithHistory(arr, left, mid, history);
      mergeSortWithHistory(arr, mid + 1, right, history);
      
      merge(arr, left, mid, right, history);
    }
    return arr;
  };

  const merge = (arr, left, mid, right, history) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    const L = new Array(n1);
    const R = new Array(n2);
    
    for (let i = 0; i < n1; i++) {
      L[i] = arr[left + i];
    }
    for (let j = 0; j < n2; j++) {
      R[j] = arr[mid + 1 + j];
    }
    
    // Create an array of indices being merged
    const mergeIndices = Array.from({ length: right - left + 1 }, (_, i) => left + i);
    
    history.push({
      array: [...arr],
      comparing: mergeIndices,
      mergeIndices: mergeIndices,
      explanation: `Merging subarrays from index ${left} to ${right}`,
      highlightedLines: [19, 20, 21] // Highlight the merge preparation
    });
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      history.push({
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        mergeIndices: mergeIndices,
        explanation: `Comparing ${L[i]} and ${R[j]}`,
        highlightedLines: [25, 26] // Highlight the comparison
      });
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      
      history.push({
        array: [...arr],
        swapping: [k],
        mergeIndices: mergeIndices,
        explanation: `Placing ${arr[k]} at position ${k}`,
        highlightedLines: [26, 27, 28, 29, 30, 31] // Highlight the element placement
      });
      
      k++;
    }
    
    while (i < n1) {
      arr[k] = L[i];
      
      history.push({
        array: [...arr],
        swapping: [k],
        mergeIndices: mergeIndices,
        explanation: `Placing ${L[i]} at position ${k}`,
        highlightedLines: [35, 36, 37] // Highlight the remaining left elements placement
      });
      
      i++;
      k++;
    }
    
    while (j < n2) {
      arr[k] = R[j];
      
      history.push({
        array: [...arr],
        swapping: [k],
        mergeIndices: mergeIndices,
        explanation: `Placing ${R[j]} at position ${k}`,
        highlightedLines: [38, 39, 40] // Highlight the remaining right elements placement
      });
      
      j++;
      k++;
    }
  };

  // Heap Sort Implementation with History
  const heapSortWithHistory = (arr, history) => {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, history);
    }
    
    history.push({
      array: [...arr],
      comparing: Array.from({ length: n }, (_, i) => i),
      explanation: 'Max heap built. Ready to extract elements.',
      highlightedLines: [3, 4, 5, 6, 7] // Highlight the heap building phase
    });
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      [arr[0], arr[i]] = [arr[i], arr[0]];
      
      history.push({
        array: [...arr],
        swapping: [0, i],
        explanation: `Moving largest element ${arr[i]} to position ${i}`,
        highlightedLines: [9, 10, 11, 12] // Highlight the extraction phase
      });
      
      // Call max heapify on the reduced heap
      heapify(arr, i, 0, history);
    }
    
    return arr;
  };
  
  const heapify = (arr, n, i, history) => {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // left = 2*i + 1
    const right = 2 * i + 2; // right = 2*i + 2
    
    // Highlight the current subtree being heapified
    const heapNodes = [i];
    if (left < n) heapNodes.push(left);
    if (right < n) heapNodes.push(right);
    
    history.push({
      array: [...arr],
      comparing: heapNodes,
      explanation: `Heapifying subtree rooted at index ${i}`,
      highlightedLines: [15, 16, 17] // Highlight the heapify initialization
    });
    
    // If left child is larger than root
    if (left < n) {
      history.push({
        array: [...arr],
        comparing: [left, largest],
        explanation: `Comparing left child ${arr[left]} with largest ${arr[largest]}`,
        highlightedLines: [20, 21] // Highlight the left child comparison
      });
      
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    // If right child is larger than largest so far
    if (right < n) {
      history.push({
        array: [...arr],
        comparing: [right, largest],
        explanation: `Comparing right child ${arr[right]} with largest ${arr[largest]}`,
        highlightedLines: [22, 23, 24] // Highlight the right child comparison
      });
      
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    // If largest is not root
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      
      history.push({
        array: [...arr],
        swapping: [i, largest],
        explanation: `Swapping ${arr[i]} and ${arr[largest]} to maintain heap property`,
        highlightedLines: [25, 26, 27, 28] // Highlight the swapping operation
      });
      
      // Recursively heapify the affected sub-tree
      heapify(arr, n, largest, history);
    }
  };

  // Bubble Sort Implementation with History
  const bubbleSortWithHistory = (arr, history) => {
    const n = arr.length;
    let swapped;
    
    for (let i = 0; i < n; i++) {
      swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        history.push({
          array: [...arr],
          comparing: [j, j + 1],
          explanation: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          highlightedLines: [7, 8] // Highlight the comparison loop
        });
        
        if (arr[j] > arr[j + 1]) {
          // Swap arr[j] and arr[j+1]
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          
          history.push({
            array: [...arr],
            swapping: [j, j + 1],
            explanation: `Swapping ${arr[j]} and ${arr[j + 1]} since ${arr[j + 1]} < ${arr[j]}`,
            highlightedLines: [10, 11] // Highlight the swapping operation
          });
        }
      }
      
      // If no swapping occurred in this pass, array is sorted
      if (!swapped) {
        history.push({
          array: [...arr],
          explanation: 'No swaps needed in this pass. Array is sorted!',
          highlightedLines: [12, 13, 14] // Highlight the early termination check
        });
        break;
      }
      
      // Highlight the fact that the largest element is now at the end
      if (i < n - 1) {
        history.push({
          array: [...arr],
          comparing: [n - i - 1],
          explanation: `Element ${arr[n - i - 1]} is now in its correct position at index ${n - i - 1}`,
          highlightedLines: [15, 16] // Highlight the completion of one pass
        });
      }
    }
    
    return arr;
  };

  // Insertion Sort Implementation with History
  const insertionSortWithHistory = (arr, history) => {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
      // Element to be inserted
      let key = arr[i];
      let j = i - 1;
      
      history.push({
        array: [...arr],
        comparing: [i],
        explanation: `Selecting element ${key} at index ${i} as the key`,
        highlightedLines: [3, 4, 5, 6, 7] // Highlight the key selection
      });
      
      // Move elements greater than key to one position ahead
      while (j >= 0 && arr[j] > key) {
        history.push({
          array: [...arr],
          comparing: [j, j + 1],
          explanation: `Comparing ${arr[j]} with key ${key}`,
          highlightedLines: [9, 10] // Highlight the comparison
        });
        
        arr[j + 1] = arr[j];
        
        history.push({
          array: [...arr],
          swapping: [j, j + 1],
          explanation: `Shifting ${arr[j]} one position ahead`,
          highlightedLines: [11, 12, 13] // Highlight the shifting operation
        });
        
        j--;
      }
      
      // Insert the key at its correct position
      arr[j + 1] = key;
      
      if (j + 1 !== i) {
        history.push({
          array: [...arr],
          swapping: [j + 1],
          explanation: `Inserting key ${key} at position ${j + 1}`,
          highlightedLines: [14, 15, 16] // Highlight the key placement
        });
      }
    }
    
    return arr;
  };

  // Monitor currentStep changes to continue animation
  useEffect(() => {
    if (isRunning && !isPaused && currentStep < totalSteps) {
      // Use a small timeout to avoid React state batching issues
      const timeoutId = setTimeout(() => {
        animateAlgorithm(currentStep, algorithmHistory);
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, isRunning, isPaused, totalSteps, algorithmHistory]);

  // Initialize canvas on component mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Update canvas when array changes
  useEffect(() => {
    // Only redraw without highlighting if not in the middle of sorting
    if (!isRunning) {
      drawArray(array, [], [], -1, []);
    }
  }, [array, isRunning]);

  // Get available algorithms
  const getAvailableAlgorithms = () => {
    return ['quickSort', 'mergeSort', 'heapSort', 'bubbleSort', 'insertionSort'];
  };

  return (
    <VisualizerLayout
      title="Sorting Visualizer"
      prompts={sortingPrompts}
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
                resetVisualization();
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
              max={20}
              onChange={(_, value) => setProblemSize(value)}
              disabled={isRunning}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Speed</Typography>
            <Slider
              value={speed}
              min={10}
              max={100}
              onChange={(_, value) => setSpeed(value)}
              disabled={isRunning}
            />
          </Box>

          <VisualizerControls 
            onRun={runAlgorithm}
            onPauseResume={() => {
              if (isPaused) {
                setIsPaused(false);
                animateAlgorithm(currentStep, algorithmHistory);
              } else {
                setIsPaused(true);
                if (animationRef.current) {
                  clearTimeout(animationRef.current);
                  animationRef.current = null;
                }
              }
            }}
            onStep={() => {
              if (currentStep < totalSteps - 1) {
                if (animationRef.current) {
                  clearTimeout(animationRef.current);
                  animationRef.current = null;
                }
                setIsPaused(true);
                const nextStep = currentStep + 1;
                const historyItem = algorithmHistory[nextStep];
                if (historyItem) {
                  setCurrentStep(nextStep);
                  setExplanation(historyItem.explanation || '');
                  setHighlightedLines(historyItem.highlightedLines || []);
                  updateVisualization(historyItem);
                }
              }
            }}
            onReset={resetVisualization}
            isRunning={isRunning}
            isPaused={isPaused}
            currentStep={currentStep}
            totalSteps={totalSteps}
            disabled={isRunning && !isPaused}
          />
        </>
      }
      visualization={
        <>
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

export default SortingVisualizer;