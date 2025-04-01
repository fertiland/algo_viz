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
  Switch,
} from '@mui/material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';
import AlgorithmComparisonSection from './SearchingVisualizer/AlgorithmComparisonSection';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';

const SearchingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('binarySearch');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [problemSize, setProblemSize] = useState(20);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [targetValue, setTargetValue] = useState(50);
  const [searchResult, setSearchResult] = useState({ found: false, index: -1 });
  const [showOriginalArray, setShowOriginalArray] = useState(true);
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [lowerBound, setLowerBound] = useState(25);
  const [upperBound, setUpperBound] = useState(75);
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Searching algorithm prompts
  const searchingPrompts = [
    {
      title: 'Welcome to Searching Visualizer',
      content: 'This tool helps you understand how different searching algorithms work by visualizing the process step by step. You can see the algorithms in action and learn about their efficiency.'
    },
    {
      title: 'Choose an Algorithm',
      content: 'Select a searching algorithm from the dropdown menu. Each algorithm has different characteristics and performance metrics. You can learn about their time and space complexity in the information panel.'
    },
    {
      title: 'Generate an Array',
      content: 'Click the "Generate Random Array" button to create a new sorted array to search through. You can also adjust the array size using the slider or input your own values.'
    },
    {
      title: 'Set a Target',
      content: 'Enter a target value to search for in the array. The visualization will show how the algorithm finds (or fails to find) this value.'
    },
    {
      title: 'Control the Visualization',
      content: 'Use the play, pause, and step buttons to control the visualization. You can also adjust the speed to see the searching process faster or slower.'
    }
  ];
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Code snippets for each searching algorithm
  const codeSnippets = {
    linearSearch: `// Linear Search Implementation
function linearSearch(arr, target) {
  // Iterate through each element in the array
  for (let i = 0; i < arr.length; i++) {
    // Check if current element equals target
    if (arr[i] === target) {
      // Return the index if found
      return { found: true, index: i };
    }
  }
  
  // Return -1 if target not found
  return { found: false, index: -1 };
}`,
    
    binarySearch: `// Binary Search Implementation
function binarySearch(arr, target) {
  // Initialize left and right pointers
  let left = 0;
  let right = arr.length - 1;
  
  // Continue searching while left pointer is less than or equal to right
  while (left <= right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);
    
    // Check if middle element is the target
    if (arr[mid] === target) {
      return { found: true, index: mid };
    }
    
    // If middle element is less than target, search right half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If middle element is greater than target, search left half
    else {
      right = mid - 1;
    }
  }
  
  // Return -1 if target not found
  return { found: false, index: -1 };
}`,

    rangeSearch: `// Range Search Implementation
function rangeSearch(arr, lower, upper) {
  // Initialize result array and indices
  let result = [];
  let left = 0;
  let right = arr.length - 1;
  
  // First find the leftmost element >= lower bound
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] < lower) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  // Check if any elements are in the range
  if (left >= arr.length || arr[left] > upper) {
    return { found: false, indices: [] };
  }
  
  // Starting from leftmost index, collect all elements <= upper bound
  for (let i = left; i < arr.length && arr[i] <= upper; i++) {
    result.push(i);
  }
  
  return { found: result.length > 0, indices: result };
}`,

    peakElement: `// Peak Element Search Implementation
function findPeakElement(arr) {
  // Initialize left and right pointers
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);
    
    // If middle element is less than the next element,
    // then peak is in the right half
    if (arr[mid] < arr[mid + 1]) {
      left = mid + 1;
    } 
    // Otherwise, peak is in the left half (including mid)
    else {
      right = mid;
    }
  }
  
  // At this point, left == right and is the peak element
  return { found: true, index: left };
}`,

    rotatedArraySearch: `// Search in Rotated Sorted Array Implementation
function searchRotatedArray(arr, target) {
  // Initialize left and right pointers
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);
    
    // Check if target is at mid
    if (arr[mid] === target) {
      return { found: true, index: mid };
    }
    
    // Check if left half is sorted
    if (arr[left] <= arr[mid]) {
      // If target is in the left sorted half
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      // If target is in the right sorted half
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  
  // Target not found
  return { found: false, index: -1 };
}`
  };
  
  // Algorithm complexity information
  const algorithmInfo = {
    linearSearch: {
      name: 'Linear Search',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Linear Search is the simplest searching algorithm that checks each element in the list sequentially until the target element is found or the list ends.'
    },
    binarySearch: {
      name: 'Binary Search',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Binary Search is an efficient algorithm that works on sorted arrays by repeatedly dividing the search interval in half.'
    },
    rangeSearch: {
      name: 'Range Search',
      timeComplexity: {
        best: 'O(log n)',
        average: 'O(log n + k)',
        worst: 'O(log n + k)'
      },
      spaceComplexity: 'O(k)',
      description: 'Range Search finds all elements within a given range [lower, upper]. It uses binary search to find the first element in range, then collects all elements up to the upper bound. k is the number of elements in the range.'
    },
    peakElement: {
      name: 'Peak Element Search',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Peak Element Search finds an element that is greater than or equal to its neighbors. This implementation uses a binary search approach to efficiently find a peak element in the array.'
    },
    rotatedArraySearch: {
      name: 'Search in Rotated Sorted Array',
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      spaceComplexity: 'O(1)',
      description: 'This algorithm searches for a target value in a sorted array that has been rotated at some pivot. It uses a modified binary search that handles the rotation by identifying which half is sorted and checking if the target is in that half.'
    }
  };

  // Generate an array with guaranteed peaks for the Peak Element Search algorithm
  const generatePeakedArray = (size) => {
    const array = [];
    // Ensure there is at least one peak in the array
    for (let i = 0; i < size; i++) {
      // First few values with increasing trend
      if (i < size / 3) {
        array.push(Math.floor((i + 1) * (100 / size) + Math.random() * 10));
      } 
      // Create a peak in the middle section
      else if (i === Math.floor(size / 2)) {
        const lastValue = array[array.length - 1];
        array.push(lastValue + 10 + Math.floor(Math.random() * 20));
      }
      // Create a valley after the peak
      else if (i > Math.floor(size / 2) && i < Math.floor(2 * size / 3)) {
        const lastValue = array[array.length - 1];
        array.push(Math.max(lastValue - 5 - Math.floor(Math.random() * 10), 1));
      }
      // Create another potential peak near the end
      else if (i === Math.floor(3 * size / 4)) {
        const lastValue = array[array.length - 1];
        array.push(lastValue + 15 + Math.floor(Math.random() * 20));
      }
      // Decreasing trend at the end
      else {
        const lastValue = array[array.length - 1];
        array.push(Math.max(lastValue - Math.floor(Math.random() * 15), 1));
      }
    }
    return array;
  };

  // Generate sorted random array
  const generateRandomArray = () => {
    let newArray = [];
    
    // Generate random array based on the selected algorithm
    if (algorithm === 'peakElement') {
      newArray = generatePeakedArray(problemSize);
    } else {
      // Generate random numbers
      for (let i = 0; i < problemSize; i++) {
        newArray.push(Math.floor(Math.random() * 100) + 1);
      }
      
      // Sort the array (for binary search and other algorithms that need sorted arrays)
      if (algorithm !== 'peakElement') {
        newArray.sort((a, b) => a - b);
      }
    }
    
    // For rotated array search, rotate the array randomly if that's the selected algorithm
    if (algorithm === 'rotatedArraySearch' && newArray.length > 0) {
      const rotationPoint = Math.floor(Math.random() * newArray.length);
      const rotatedArray = [
        ...newArray.slice(rotationPoint),
        ...newArray.slice(0, rotationPoint)
      ];
      setArray(rotatedArray);
      setOriginalArray([...newArray]); // Keep original sorted array for reference
    } else {
      setArray(newArray);
      setOriginalArray([...newArray]);
    }
    
    resetVisualization();
    drawArray(array);
    
    // Set appropriate random target based on algorithm
    if (newArray.length > 0) {
      // For range search, set meaningful range bounds
      if (algorithm === 'rangeSearch') {
        const min = Math.min(...newArray);
        const max = Math.max(...newArray);
        const range = max - min;
        setLowerBound(min + Math.floor(range * 0.25));
        setUpperBound(min + Math.floor(range * 0.75));
      } 
      // For other searches, use a random element as target
      else if (algorithm !== 'peakElement') {
        const randomIndex = Math.floor(Math.random() * newArray.length);
        setTargetValue(newArray[randomIndex]);
      }
    }
  };

  // Handle custom input
  const handleCustomInput = () => {
    try {
      let inputArray = customInput.split(',').map(num => parseInt(num.trim()));
      if (inputArray.some(isNaN)) {
        alert('Please enter valid numbers separated by commas');
        return;
      }
      
      // Sort the array for algorithms that need sorted data
      if (algorithm !== 'rotatedArraySearch') {
        inputArray.sort((a, b) => a - b);
      }
      
      setArray(inputArray);
      setOriginalArray(algorithm === 'rotatedArraySearch' ? 
        [...inputArray].sort((a, b) => a - b) : 
        [...inputArray]);
      setProblemSize(inputArray.length);
      resetVisualization();
      drawArray(inputArray);
    } catch (error) {
      alert('Please enter valid numbers separated by commas');
    }
  };

  // Reset search state
  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setSearchHistory([]);
    setExplanation('');
    setHighlightedLines([]);
    setSearchResult({ found: false, index: -1 });
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, searchingPrompts.length - 1));
  };
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  };

  // Draw array on canvas
  const drawArray = (arr, highlightIndices = [], currentIndex = -1, low = -1, high = -1, rangeIndices = []) => {
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
    
    const barWidth = width / arr.length;
    const maxValue = Math.max(...arr, ...originalArray, 1); // Ensure we don't divide by zero
    
    // Draw the current array
    arr.forEach((value, index) => {
      const barHeight = (value / maxValue) * (sectionHeight - 60); // More space for index display
      const x = index * barWidth;
      const y = sectionHeight - barHeight - 30;
      
      // Set color based on the current state
      if (index === currentIndex) {
        ctx.fillStyle = '#ff5722'; // Orange for current index
      } else if (highlightIndices.includes(index)) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for comparing
      } else if (rangeIndices && rangeIndices.includes(index)) {
        ctx.fillStyle = '#8bc34a'; // Light green for elements in range
      } else if (index >= low && index <= high) {
        ctx.fillStyle = '#4caf50'; // Green for search range
      } else {
        ctx.fillStyle = '#90caf9'; // Default blue
      }
      
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Add border to highlight the current element more clearly
      if (index === currentIndex || highlightIndices.includes(index) || (rangeIndices && rangeIndices.includes(index))) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth - 1, barHeight);
        
        // Add a marker on top of the current element
        if (index === currentIndex) {
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.moveTo(x + barWidth / 2, y - 15);
          ctx.lineTo(x + barWidth / 2 - 5, y - 5);
          ctx.lineTo(x + barWidth / 2 + 5, y - 5);
          ctx.fill();
        }
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
      
      // Draw index below the bar with more prominence
      ctx.fillStyle = '#000000';
      ctx.font = index === currentIndex ? 'bold 12px Arial' : '10px Arial';
      
      // Create a background for the index to make it more visible
      if (index === currentIndex) {
        const indexText = index.toString();
        const textWidth = ctx.measureText(indexText).width;
        ctx.fillStyle = '#ff9800'; // Orange background for current index
        ctx.fillRect(x + (barWidth - textWidth) / 2 - 2, sectionHeight - 25, textWidth + 4, 16);
        ctx.fillStyle = '#000000'; // Black text
      }
      
      ctx.fillText(index.toString(), x + barWidth / 4, sectionHeight - 15);
    });
    
    // Draw the original array if enabled
    if (showOriginalArray && originalArray.length > 0) {
      // Draw title for original array
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Original Array', 10, sectionHeight + 30);
      
      originalArray.forEach((value, index) => {
        const barHeight = (value / maxValue) * (sectionHeight - 60);
        const x = index * barWidth;
        const y = height - barHeight - 30;
        
        // Use a different color for the original array
        ctx.fillStyle = '#a5d6a7'; // Light green for original array
        
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        
        // Draw value on top of the bar
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText(value.toString(), x + barWidth / 4, y - 5);
        
        // Draw index below the bar
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText(index.toString(), x + barWidth / 4, height - 15);
      });
    }
    
    // Draw target value indicator
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Target: ${targetValue}`, width - 120, 20);
    
    // Draw legend
    const legendY = 20;
    const legendX = width - 180;
    const legendSpacing = 20;
    
    // Current element legend
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(legendX, legendY + legendSpacing, 15, 15);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('Current Element', legendX + 20, legendY + legendSpacing + 12);
    
    // Comparing elements legend
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(legendX, legendY + 2 * legendSpacing, 15, 15);
    ctx.fillStyle = '#000000';
    ctx.fillText('Comparing Elements', legendX + 20, legendY + 2 * legendSpacing + 12);
    
    // Search range legend
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(legendX, legendY + 3 * legendSpacing, 15, 15);
    ctx.fillStyle = '#000000';
    ctx.fillText('Search Range', legendX + 20, legendY + 3 * legendSpacing + 12);
    
    // Range elements legend (for range search)
    if (algorithm === 'rangeSearch') {
      ctx.fillStyle = '#8bc34a';
      ctx.fillRect(legendX, legendY + 4 * legendSpacing, 15, 15);
      ctx.fillStyle = '#000000';
      ctx.fillText('Elements in Range', legendX + 20, legendY + 4 * legendSpacing + 12);
    }
    
    // Original array legend
    const arrayLegendSpacing = algorithm === 'rangeSearch' ? 5 : 4;
    if (showOriginalArray) {
      ctx.fillStyle = '#a5d6a7';
      ctx.fillRect(legendX, legendY + arrayLegendSpacing * legendSpacing, 15, 15);
      ctx.fillStyle = '#000000';
      ctx.fillText('Original Array', legendX + 20, legendY + arrayLegendSpacing * legendSpacing + 12);
    }
  };

  // Linear Search Implementation with History
  const linearSearchWithHistory = (arr, target, history) => {
    for (let i = 0; i < arr.length; i++) {
      history.push({
        comparing: [i],
        currentIndex: i,
        explanation: `Checking if element at index ${i} (value ${arr[i]}) equals target ${target}`,
        highlightedLines: [4, 5] // Highlight the loop and comparison lines
      });
      
      if (arr[i] === target) {
        history.push({
          comparing: [i],
          currentIndex: i,
          explanation: `Found target ${target} at index ${i}!`,
          highlightedLines: [6, 7, 8] // Highlight the return statement when found
        });
        return { found: true, index: i };
      }
    }
    
    history.push({
      comparing: [],
      currentIndex: -1,
      explanation: `Target ${target} not found in the array.`,
      highlightedLines: [11, 12] // Highlight the return statement when not found
    });
    
    return { found: false, index: -1 };
  };

  // Binary Search Implementation with History
  const binarySearchWithHistory = (arr, target, history) => {
    let left = 0;
    let right = arr.length - 1;
    
    history.push({
      comparing: [],
      low: left,
      high: right,
      explanation: `Starting binary search for target ${target} in the sorted array.`,
      highlightedLines: [2, 3] // Highlight initialization lines
    });
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      history.push({
        comparing: [mid],
        currentIndex: mid,
        low: left,
        high: right,
        explanation: `Checking middle element at index ${mid} (value ${arr[mid]})`,
        highlightedLines: [6, 7, 8, 9] // Highlight the loop and mid calculation
      });
      
      if (arr[mid] === target) {
        history.push({
          comparing: [mid],
          currentIndex: mid,
          low: left,
          high: right,
          explanation: `Found target ${target} at index ${mid}!`,
          highlightedLines: [12, 13] // Highlight the found condition
        });
        return { found: true, index: mid };
      }
      
      if (arr[mid] < target) {
        left = mid + 1;
        history.push({
          comparing: [],
          low: left,
          high: right,
          explanation: `Middle element ${arr[mid]} is less than target ${target}. Search in right half.`,
          highlightedLines: [17, 18] // Highlight the right half search
        });
      } else {
        right = mid - 1;
        history.push({
          comparing: [],
          low: left,
          high: right,
          explanation: `Middle element ${arr[mid]} is greater than target ${target}. Search in left half.`,
          highlightedLines: [21, 22] // Highlight the left half search
        });
      }
    }
    
    history.push({
      comparing: [],
      low: -1,
      high: -1,
      explanation: `Target ${target} not found in the array.`,
      highlightedLines: [26, 27] // Highlight the not found return
    });
    
    return { found: false, index: -1 };
  };

  // Range Search Implementation with History
  const rangeSearchWithHistory = (arr, lower, upper, history) => {
    let result = [];
    let left = 0;
    let right = arr.length - 1;
    
    history.push({
      comparing: [],
      low: left,
      high: right,
      explanation: `Starting range search for elements between ${lower} and ${upper}.`,
      highlightedLines: [2, 3, 4, 5]
    });
    
    // First find the leftmost element >= lower bound
    let originalLeft = left;
    let originalRight = right;
    
    history.push({
      comparing: [],
      low: left,
      high: right,
      explanation: `First, we need to find the leftmost element greater than or equal to ${lower}.`,
      highlightedLines: [8, 9, 10]
    });
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      history.push({
        comparing: [mid],
        currentIndex: mid,
        low: left,
        high: right,
        explanation: `Checking middle element at index ${mid} (value ${arr[mid]}) against lower bound ${lower}.`,
        highlightedLines: [11, 12]
      });
      
      if (arr[mid] < lower) {
        left = mid + 1;
        history.push({
          comparing: [],
          low: left,
          high: right,
          explanation: `${arr[mid]} is less than lower bound ${lower}. Look in the right half.`,
          highlightedLines: [14, 15]
        });
      } else {
        right = mid - 1;
        history.push({
          comparing: [],
          low: left,
          high: right,
          explanation: `${arr[mid]} is greater than or equal to lower bound ${lower}. Look in the left half.`,
          highlightedLines: [16, 17]
        });
      }
    }
    
    // Check if any elements are in the range
    if (left >= arr.length || arr[left] > upper) {
      history.push({
        comparing: [],
        explanation: `No elements found in the range [${lower}, ${upper}].`,
        highlightedLines: [22, 23]
      });
      return { found: false, indices: [] };
    }
    
    history.push({
      comparing: [left],
      currentIndex: left,
      explanation: `Found first element ${arr[left]} at index ${left} that is within the range.`,
      highlightedLines: [26, 27]
    });
    
    // Collect all elements in range
    for (let i = left; i < arr.length && arr[i] <= upper; i++) {
      result.push(i);
      
      history.push({
        comparing: [i],
        currentIndex: i,
        rangeIndices: [...result], // Track all indices found so far
        explanation: `Element at index ${i} (value ${arr[i]}) is in range. Adding to result.`,
        highlightedLines: [28, 29]
      });
      
      if (i + 1 < arr.length && arr[i + 1] > upper) {
        history.push({
          comparing: [i + 1],
          currentIndex: -1,
          rangeIndices: [...result],
          explanation: `Next element at index ${i + 1} (value ${arr[i + 1]}) exceeds upper bound ${upper}. Stopping search.`,
          highlightedLines: [30]
        });
        break;
      }
    }
    
    history.push({
      comparing: [],
      rangeIndices: [...result],
      explanation: `Found ${result.length} elements in the range [${lower}, ${upper}].`,
      highlightedLines: [32, 33]
    });
    
    return { found: result.length > 0, indices: result };
  };

  // Peak Element Search Implementation with History
  const findPeakElementWithHistory = (arr, history) => {
    let left = 0;
    let right = arr.length - 1;
    
    history.push({
      comparing: [],
      low: left,
      high: right,
      explanation: `Starting search for a peak element. A peak element is greater than or equal to its neighbors.`,
      highlightedLines: [2, 3]
    });
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      history.push({
        comparing: [mid, mid + 1],
        currentIndex: mid,
        low: left,
        high: right,
        explanation: `Comparing middle element at index ${mid} (value ${arr[mid]}) with next element at index ${mid + 1} (value ${arr[mid + 1]}).`,
        highlightedLines: [7, 8, 9]
      });
      
      if (arr[mid] < arr[mid + 1]) {
        left = mid + 1;
        history.push({
          comparing: [],
          low: left,
          high: right,
          explanation: `${arr[mid]} is less than ${arr[mid + 1]}. The peak must be in the right half.`,
          highlightedLines: [13, 14]
        });
      } else {
        right = mid;
        history.push({
          comparing: [],
          low: left,
          high: right,
          explanation: `${arr[mid]} is greater than or equal to ${arr[mid + 1]}. The peak could be in the left half or at mid.`,
          highlightedLines: [17, 18]
        });
      }
    }
    
    // left == right at this point
    history.push({
      comparing: [left],
      currentIndex: left,
      explanation: `Found a peak element at index ${left} with value ${arr[left]}.`,
      highlightedLines: [22, 23]
    });
    
    return { found: true, index: left };
  };

  // Search in Rotated Sorted Array with History
  const searchRotatedArrayWithHistory = (arr, target, history) => {
    let left = 0;
    let right = arr.length - 1;
    
    history.push({
      comparing: [],
      low: left,
      high: right,
      explanation: `Starting search for target ${target} in a rotated sorted array.`,
      highlightedLines: [2, 3]
    });
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      history.push({
        comparing: [mid],
        currentIndex: mid,
        low: left,
        high: right,
        explanation: `Checking middle element at index ${mid} (value ${arr[mid]}).`,
        highlightedLines: [7, 8]
      });
      
      if (arr[mid] === target) {
        history.push({
          comparing: [mid],
          currentIndex: mid,
          explanation: `Found target ${target} at index ${mid}!`,
          highlightedLines: [11, 12]
        });
        return { found: true, index: mid };
      }
      
      // Check if left half is sorted
      if (arr[left] <= arr[mid]) {
        history.push({
          comparing: [left, mid],
          low: left,
          high: right,
          explanation: `Left half from index ${left} to ${mid} is sorted (${arr[left]} to ${arr[mid]}).`,
          highlightedLines: [16, 17]
        });
        
        // Check if target is in left sorted half
        if (arr[left] <= target && target < arr[mid]) {
          right = mid - 1;
          history.push({
            comparing: [],
            low: left,
            high: right,
            explanation: `Target ${target} is in the sorted left half. Searching from ${left} to ${right}.`,
            highlightedLines: [19, 20]
          });
        } else {
          left = mid + 1;
          history.push({
            comparing: [],
            low: left,
            high: right,
            explanation: `Target ${target} is not in the sorted left half. Searching from ${left} to ${right}.`,
            highlightedLines: [21, 22]
          });
        }
      }
      // Right half must be sorted
      else {
        history.push({
          comparing: [mid, right],
          low: left,
          high: right,
          explanation: `Right half from index ${mid} to ${right} is sorted (${arr[mid]} to ${arr[right]}).`,
          highlightedLines: [25, 26]
        });
        
        // Check if target is in right sorted half
        if (arr[mid] < target && target <= arr[right]) {
          left = mid + 1;
          history.push({
            comparing: [],
            low: left,
            high: right,
            explanation: `Target ${target} is in the sorted right half. Searching from ${left} to ${right}.`,
            highlightedLines: [28, 29]
          });
        } else {
          right = mid - 1;
          history.push({
            comparing: [],
            low: left,
            high: right,
            explanation: `Target ${target} is not in the sorted right half. Searching from ${left} to ${right}.`,
            highlightedLines: [30, 31]
          });
        }
      }
    }
    
    history.push({
      comparing: [],
      explanation: `Target ${target} not found in the array.`,
      highlightedLines: [36, 37]
    });
    
    return { found: false, index: -1 };
  };

  // Start searching
  const startSearch = () => {
    // Already searching and not paused, don't restart
    if (isRunning && !isPaused) {
      return;
    }
    
    // If paused, just resume
    if (isPaused) {
      setIsPaused(false);
      animateAlgorithm(currentStep, searchHistory);
      return;
    }
    
    // Reset any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Generate search history
    const history = [];
    let result = { found: false, index: -1 };
    
    switch (algorithm) {
      case 'linearSearch':
        result = linearSearchWithHistory(array, targetValue, history);
        break;
      case 'binarySearch':
        result = binarySearchWithHistory(array, targetValue, history);
        break;
      case 'rangeSearch':
        result = rangeSearchWithHistory(array, lowerBound, upperBound, history);
        break;
      case 'peakElement':
        result = findPeakElementWithHistory(array, history);
        break;
      case 'rotatedArraySearch':
        result = searchRotatedArrayWithHistory(array, targetValue, history);
        break;
      default:
        break;
    }
    
    if (history.length === 0) {
      setExplanation('No steps to visualize for this search algorithm.');
      return;
    }
    
    // Set initial state
    setSearchHistory(history);
    setTotalSteps(history.length);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
    setSearchResult(result);
    
    // Set initial explanation and highlighted lines from the first history item
    if (history.length > 0) {
      const firstItem = history[0];
      setExplanation(firstItem.explanation || 'Starting search process...');
      setHighlightedLines(firstItem.highlightedLines || []);
      
      // Draw initial state
      drawArray(
        array,
        firstItem.comparing || [],
        firstItem.currentIndex !== undefined ? firstItem.currentIndex : -1,
        firstItem.low !== undefined ? firstItem.low : -1,
        firstItem.high !== undefined ? firstItem.high : -1,
        firstItem.rangeIndices || []
      );
    }
    
    // Start the animation without delay
    animateAlgorithm(currentStep, history);
  };

  // Pause searching
  const pauseSearch = () => {
    setIsPaused(true);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  // Step forward
  const stepForward = () => {
    if (currentStep < totalSteps && searchHistory.length > 0) {
      // Cancel any existing animation timer to prevent it from overriding manual steps
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const historyItem = searchHistory[nextStep - 1];
      if (historyItem) {
        setExplanation(historyItem.explanation);
        // Set highlighted lines for code display
        setHighlightedLines(historyItem.highlightedLines || []);
        // Ensure all highlighting properties are properly passed to drawArray
        drawArray(
          array,
          historyItem.comparing || [],
          historyItem.currentIndex !== undefined ? historyItem.currentIndex : -1,
          historyItem.low !== undefined ? historyItem.low : -1,
          historyItem.high !== undefined ? historyItem.high : -1,
          historyItem.rangeIndices || []
        );
      }
      
      // Set isPaused to true to prevent auto-animation from continuing
      if (isRunning && !isPaused) {
        setIsPaused(true);
      }
    }
  };

  // Animate search
  const animateAlgorithm = (currentStep, history) => {
    // If paused and not forced to run, or not in searching mode, don't proceed
    if ((isPaused && !isRunning) || !isRunning) {
      return;
    }
    
    // Check if we've reached the end of the search steps
    if (currentStep >= totalSteps) {
      setIsRunning(false);
      setIsPaused(false);
      
      if (searchResult.found) {
        if (algorithm === 'rangeSearch') {
          setExplanation(`Found ${searchResult.indices.length} elements in the range [${lowerBound}, ${upperBound}].`);
        } else if (algorithm === 'peakElement') {
          setExplanation(`Found a peak element at index ${searchResult.index} with value ${array[searchResult.index]}.`);
        } else {
          setExplanation(`Target ${targetValue} found at index ${searchResult.index}!`);
        }
      } else {
        if (algorithm === 'rangeSearch') {
          setExplanation(`No elements found in the range [${lowerBound}, ${upperBound}].`);
        } else {
          setExplanation(`Target ${targetValue} not found in the array.`);
        }
      }
      return;
    }
    
    // Get the history item for the current step
    const historyItem = history[currentStep];
    if (!historyItem) {
      console.error('No history item found for step', currentStep);
      return;
    }
    
    // Update explanation and highlighted lines
    setExplanation(historyItem.explanation);
    setHighlightedLines(historyItem.highlightedLines || []);
    
    // Draw the array with the current state
    drawArray(
      array,
      historyItem.comparing || [],
      historyItem.currentIndex !== undefined ? historyItem.currentIndex : -1,
      historyItem.low !== undefined ? historyItem.low : -1,
      historyItem.high !== undefined ? historyItem.high : -1,
      historyItem.rangeIndices || []
    );
    
    // Calculate delay based on speed (inverted: higher speed = lower delay)
    const delay = 1000 - (speed * 10);
    
    // Clear any existing timeout
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Schedule the next step
    animationRef.current = setTimeout(() => {
      // Important: First increase the step, then call animateAlgorithm in next render cycle
      if (currentStep < totalSteps) {
        setCurrentStep(prevStep => prevStep + 1);
      }
    }, delay);
  };

  // Monitor currentStep changes to continue animation
  useEffect(() => {
    if (isRunning && !isPaused && currentStep < totalSteps) {
      // Use a small timeout to avoid React state batching issues
      const timeoutId = setTimeout(() => {
        animateAlgorithm(currentStep, searchHistory);
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [currentStep, isRunning, isPaused, totalSteps, searchHistory]);

  // Initialize component
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Get available algorithms
  const getAvailableAlgorithms = () => {
    return ['binarySearch', 'linearSearch'];
  };

  return (
    <VisualizerLayout
      title="Searching Algorithm Visualizer"
      prompts={searchingPrompts}
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
            <Typography gutterBottom>Target Value</Typography>
            <TextField
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
              disabled={isRunning}
              fullWidth
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Show Original Array:</Typography>
            <Switch
              checked={showOriginalArray}
              onChange={(e) => setShowOriginalArray(e.target.checked)}
              color="primary"
              size="small"
            />
          </Box>
          
          {algorithm === 'rangeSearch' ? (
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Range Bounds</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Lower Bound"
                    type="number"
                    value={lowerBound}
                    onChange={(e) => setLowerBound(parseInt(e.target.value) || 0)}
                    disabled={isRunning}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Upper Bound"
                    type="number"
                    value={upperBound}
                    onChange={(e) => setUpperBound(parseInt(e.target.value) || 0)}
                    disabled={isRunning}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          ) : algorithm !== 'peakElement' ? (
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Target Value</Typography>
              <TextField
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                disabled={isRunning}
                fullWidth
              />
            </Box>
          ) : null}
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Custom Array Input</Typography>
            <TextField
              placeholder="e.g. 10,20,30,40,50"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={isRunning}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button 
              variant="outlined" 
              onClick={handleCustomInput}
              disabled={isRunning}
              fullWidth
            >
              Use Custom Array
            </Button>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="contained" 
              onClick={generateRandomArray}
              disabled={isRunning}
              fullWidth
              sx={{ mb: 1 }}
            >
              Generate New Array
            </Button>
          </Box>
          
          <VisualizerControls 
            onRun={startSearch}
            onPauseResume={() => {
              if (isPaused) {
                setIsPaused(false);
                animateAlgorithm(currentStep, searchHistory);
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
                const historyItem = searchHistory[nextStep];
                if (historyItem) {
                  setCurrentStep(nextStep);
                  setExplanation(historyItem.explanation || '');
                  setHighlightedLines(historyItem.highlightedLines || []);
                  drawArray(
                    array,
                    historyItem.comparing || [],
                    historyItem.currentIndex !== undefined ? historyItem.currentIndex : -1,
                    historyItem.low !== undefined ? historyItem.low : -1,
                    historyItem.high !== undefined ? historyItem.high : -1,
                    historyItem.rangeIndices || []
                  );
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

export default SearchingVisualizer;