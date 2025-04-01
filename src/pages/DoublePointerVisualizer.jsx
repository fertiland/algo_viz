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
  Switch,
} from '@mui/material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';

const DoublePointerVisualizer = () => {
  const [algorithm, setAlgorithm] = useState('twoSum');
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
  const [target, setTarget] = useState(0);
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Double pointer algorithm prompts
  const doublePointerPrompts = [
    {
      title: 'Welcome to Double Pointer Algorithm Visualizer',
      content: 'This tool helps you understand how double pointer algorithms work by visualizing the process step by step. Double pointer algorithms use two pointers to solve problems efficiently, often reducing time complexity compared to naive approaches.'
    },
    {
      title: 'Select an Algorithm',
      content: 'Choose a specific algorithm to visualize. Each algorithm demonstrates a different application of the double pointer technique.'
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
      title: 'Understand the Approach',
      content: 'Double pointer techniques are commonly used to solve problems more efficiently than using nested loops. They\'re particularly useful for sorted arrays, linked lists, and string manipulation problems.'
    }
  ];
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Code snippets for each double pointer algorithm
  const codeSnippets = {
    twoSum: `// Two Sum (Return indices of two numbers that add up to target)
function twoSum(nums, target) {
  // Create a map to store visited numbers and their indices
  const numMap = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    // Calculate the complement needed to reach target
    const complement = target - nums[i];
    
    // If complement exists in map, we found our pair
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    
    // Otherwise, add current number and index to map
    numMap.set(nums[i], i);
  }
  
  // If no solution is found
  return null;
}`,
    
    threeSum: `// Three Sum (Find all triplets that sum to zero)
function threeSum(nums) {
  // Sort the array to use two-pointer technique
  nums.sort((a, b) => a - b);
  
  const result = [];
  
  // Fix first element and use two pointers for the remaining two
  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates for first pointer
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum < 0) {
        // Move left pointer to increase sum
        left++;
      } else if (sum > 0) {
        // Move right pointer to decrease sum
        right--;
      } else {
        // Found a triplet
        result.push([nums[i], nums[left], nums[right]]);
        
        // Skip duplicates for left and right pointers
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        // Move both pointers inward
        left++;
        right--;
      }
    }
  }
  
  return result;
}`,

    containerWithMostWater: `// Container With Most Water
function maxArea(height) {
  let maxWater = 0;
  let left = 0;
  let right = height.length - 1;
  
  while (left < right) {
    // Calculate water area using the shorter height
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    const area = h * w;
    
    // Update maximum area
    maxWater = Math.max(maxWater, area);
    
    // Move the pointer with the smaller height
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}`,

    removeDuplicates: `// Remove Duplicates from Sorted Array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  
  // Use slow pointer as position to place next unique element
  let slow = 0;
  
  // Fast pointer scans through the array
  for (let fast = 1; fast < nums.length; fast++) {
    // When we find a new unique element
    if (nums[fast] !== nums[slow]) {
      // Move slow pointer forward
      slow++;
      // Place the unique element at slow position
      nums[slow] = nums[fast];
    }
  }
  
  // slow+1 is the length of the array without duplicates
  return slow + 1;
}`,

    reverseString: `// Reverse String using Two Pointers
function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    // Swap characters at left and right pointers
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    
    // Move pointers toward each other
    left++;
    right--;
  }
  
  return s;
}`
  };
  
  // Algorithm complexity information
  const algorithmInfo = {
    twoSum: {
      name: 'Two Sum',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(n)',
      description: 'The Two Sum algorithm finds a pair of numbers in an array that add up to a target value. It uses a hash map to store previously seen values and their indices, allowing for O(n) time complexity instead of O(n²).'
    },
    threeSum: {
      name: 'Three Sum',
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(n)',
      description: 'The Three Sum algorithm finds all triplets in an array that sum to zero. It sorts the array first, then uses a combination of a for-loop and two pointers to find triplets efficiently. This approach avoids the O(n³) complexity of nested loops.'
    },
    containerWithMostWater: {
      name: 'Container With Most Water',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'The Container With Most Water algorithm finds two lines that, along with the x-axis, form a container that holds the maximum amount of water. It uses two pointers starting from both ends and moves the pointer with the smaller height inward.'
    },
    removeDuplicates: {
      name: 'Remove Duplicates',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'This algorithm removes duplicates from a sorted array in-place. It uses a slow pointer to track the position for the next unique element, while a fast pointer scans through the array to find unique elements.'
    },
    reverseString: {
      name: 'Reverse String',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'The Reverse String algorithm reverses a string or array in-place using two pointers. One pointer starts from the beginning, the other from the end, and they swap elements as they move toward each other.'
    }
  };

  // Get available algorithms
  const getAvailableAlgorithms = () => {
    return ['twoSum', 'threeSum', 'containerWithMostWater', 'removeDuplicates', 'reverseString'];
  };

  // Generate random problem based on algorithm
  const generateRandomProblem = () => {
    let newProblem = [];
    let newTarget = 0;
    
    switch (algorithm) {
      case 'twoSum':
        // Generate random array of integers for two sum problem
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 20) - 5);
        // Generate a random target that has a solution (sum of two random elements)
        const idx1 = Math.floor(Math.random() * newProblem.length);
        let idx2;
        do {
          idx2 = Math.floor(Math.random() * newProblem.length);
        } while (idx2 === idx1);
        newTarget = newProblem[idx1] + newProblem[idx2];
        setTarget(newTarget);
        break;
      
      case 'threeSum':
        // Generate random array with some negative and positive numbers
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 30) - 15);
        break;
      
      case 'containerWithMostWater':
        // Generate random heights for the container problem
        newProblem = Array.from({ length: problemSize }, () => Math.floor(Math.random() * 15) + 1);
        break;
      
      case 'removeDuplicates':
        // Generate sorted array with potential duplicates
        const uniqueNums = new Set();
        while (uniqueNums.size < problemSize / 2) {
          uniqueNums.add(Math.floor(Math.random() * 10));
        }
        // Duplicate some elements
        newProblem = Array.from(uniqueNums).flatMap(num => [num, num, num]).slice(0, problemSize);
        // Sort the array (required for the algorithm)
        newProblem.sort((a, b) => a - b);
        break;
      
      case 'reverseString':
        // Generate a random string (as an array of characters)
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        newProblem = Array.from({ length: problemSize }, () => 
          chars.charAt(Math.floor(Math.random() * chars.length))
        );
        break;
      
      default:
        break;
    }
    
    setProblem(newProblem);
    setOriginalProblem(JSON.parse(JSON.stringify(newProblem)));
    resetVisualization();
    drawProblem(newProblem);
  };

  // Handle custom input
  const handleCustomInput = () => {
    try {
      let inputProblem;
      
      if (algorithm === 'twoSum') {
        // Parse custom input for Two Sum problem (array and target)
        const { array, target: customTarget } = JSON.parse(customInput);
        inputProblem = array;
        setTarget(customTarget);
      } else {
        // For other problems, just parse the array
        inputProblem = JSON.parse(customInput);
      }
      
      setProblem(inputProblem);
      setOriginalProblem(JSON.parse(JSON.stringify(inputProblem)));
      resetVisualization();
      drawProblem(inputProblem);
    } catch (error) {
      alert('Please enter valid JSON format for the problem: ' + error.message);
    }
  };

  // Reset visualization state
  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setAlgorithmHistory([]);
    setResult(null);
    setExplanation('');
    setHighlightedLines([]);
  };

  // Draw problem on canvas
  const drawProblem = (problemData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (algorithm) {
      case 'twoSum':
        // If problemData is a history item, extract relevant data
        if (problemData.step) {
          drawTwoSum(ctx, problemData);
        } else {
          drawTwoSum(ctx, { nums: problemData, target });
        }
        break;
      
      case 'threeSum':
        // If problemData is a history item, extract relevant data
        if (problemData.step) {
          drawThreeSum(ctx, problemData);
        } else {
          drawThreeSum(ctx, { nums: problemData });
        }
        break;
      
      case 'containerWithMostWater':
        // If problemData is a history item, extract relevant data
        if (problemData.step) {
          drawContainerWithMostWater(ctx, problemData);
        } else {
          drawContainerWithMostWater(ctx, { heights: problemData });
        }
        break;
      
      case 'removeDuplicates':
        // If problemData is a history item, extract relevant data
        if (problemData.step) {
          drawRemoveDuplicates(ctx, problemData);
        } else {
          drawRemoveDuplicates(ctx, { nums: problemData });
        }
        break;
      
      case 'reverseString':
        // If problemData is a history item, extract relevant data
        if (problemData.step) {
          drawReverseString(ctx, problemData);
        } else {
          drawReverseString(ctx, { s: problemData });
        }
        break;
      
      default:
        break;
    }
  };

  // Draw Two Sum problem
  const drawTwoSum = (ctx, data) => {
    const { nums, target: targetValue, currentIndex, numMap, foundPair } = data;
    // Fix the self-reference issue by using the component's target state as fallback
    const targetToUse = targetValue !== undefined ? targetValue : target;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const boxSize = 50;
    const boxSpacing = 15;
    const startX = Math.max(50, (width - (nums.length * (boxSize + boxSpacing))) / 2);
    const startY = 100;
    
    // Draw title and target value
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Two Sum - Find two numbers that add up to: ${target}`, 50, 40);
    
    // Draw current numMap if available
    if (numMap) {
      ctx.font = '14px Arial';
      ctx.fillText('Number Map (value → index):', 50, 70);
      
      let mapX = 250;
      numMap.forEach((index, num) => {
        ctx.fillStyle = '#3f51b5';
        ctx.fillRect(mapX, 58, 60, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(`${num} → ${index}`, mapX + 5, 73);
        mapX += 70;
      });
    }
    
    // Draw array elements
    nums.forEach((num, index) => {
      const x = startX + index * (boxSize + boxSpacing);
      const y = startY;
      
      // Determine box color
      let boxColor = '#e0e0e0';
      
      if (foundPair && (foundPair[0] === index || foundPair[1] === index)) {
        // Highlight the solution pair
        boxColor = '#4caf50';
      } else if (index === currentIndex) {
        // Highlight current index
        boxColor = '#ff9800';
      } else if (numMap && numMap.has(target - num) && numMap.get(target - num) !== index) {
        // Highlight complement if it exists in the map (but not if it's the same index)
        boxColor = '#f48fb1';
      } else if (numMap && numMap.has(num) && numMap.get(num) === index) {
        // Highlight numbers already in the map
        boxColor = '#90caf9';
      }
      
      // Draw box
      ctx.fillStyle = boxColor;
      ctx.fillRect(x, y, boxSize, boxSize);
      
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxSize, boxSize);
      
      // Draw number
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(num.toString(), x + boxSize/2 - 8, y + boxSize/2 + 5);
      
      // Draw index
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(`[${index}]`, x + boxSize/2 - 8, y + boxSize + 15);
    });
    
    // Draw current state information
    if (currentIndex !== undefined) {
      const currentNum = nums[currentIndex];
      const complement = target - currentNum;
      
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      
      let infoY = startY + boxSize + 40;
      
      ctx.fillText(`Current number: ${currentNum} at index ${currentIndex}`, 50, infoY);
      infoY += 25;
      
      ctx.fillText(`Looking for complement: ${complement}`, 50, infoY);
      infoY += 25;
      
      if (numMap && numMap.has(complement) && numMap.get(complement) !== currentIndex) {
        ctx.fillStyle = '#4caf50';
        ctx.fillText(`Found! Complement ${complement} is at index ${numMap.get(complement)}`, 50, infoY);
      }
    }
    
    // Draw result if found
    if (foundPair) {
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Solution: indices [${foundPair[0]}, ${foundPair[1]}] (values ${nums[foundPair[0]]}, ${nums[foundPair[1]]})`, 50, height - 50);
    }
  };

  // Draw Three Sum problem
  const drawThreeSum = (ctx, data) => {
    const { nums, currentI, left, right, triplets, currentSum } = data;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const boxSize = 40;
    const boxSpacing = 10;
    const startX = Math.max(50, (width - (nums.length * (boxSize + boxSpacing))) / 2);
    const startY = 100;
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Three Sum - Find triplets that sum to zero', 50, 40);
    
    // Draw sorted array note
    if (nums) {
      ctx.font = '14px Arial';
      ctx.fillText('Sorted Array:', 50, 70);
    }
    
    // Draw array elements
    nums.forEach((num, index) => {
      const x = startX + index * (boxSize + boxSpacing);
      const y = startY;
      
      // Determine box color
      let boxColor = '#e0e0e0';
      
      if (currentI !== undefined && index === currentI) {
        // First pointer (i)
        boxColor = '#3f51b5'; // Blue
      } else if (left !== undefined && index === left) {
        // Left pointer
        boxColor = '#f44336'; // Red
      } else if (right !== undefined && index === right) {
        // Right pointer
        boxColor = '#4caf50'; // Green
      }
      
      // Draw box
      ctx.fillStyle = boxColor;
      ctx.fillRect(x, y, boxSize, boxSize);
      
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxSize, boxSize);
      
      // Draw number
      ctx.fillStyle = boxColor === '#e0e0e0' ? '#333' : 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(num.toString(), x + boxSize/2 - 8, y + boxSize/2 + 5);
      
      // Draw index
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(`[${index}]`, x + boxSize/2 - 8, y + boxSize + 15);
    });
    
    // Draw pointers legend
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    let legendY = startY + boxSize + 50;
    
    if (currentI !== undefined) {
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('i pointer (fixed)', 80, legendY);
      legendY += 30;
    }
    
    if (left !== undefined) {
      ctx.fillStyle = '#f44336';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('left pointer', 80, legendY);
      legendY += 30;
    }
    
    if (right !== undefined) {
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('right pointer', 80, legendY);
      legendY += 30;
    }
    
    // Draw current state information
    if (currentI !== undefined && left !== undefined && right !== undefined) {
      const currentTriplet = [nums[currentI], nums[left], nums[right]];
      
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      legendY += 20;
      
      ctx.fillText(`Current triplet: [${currentTriplet.join(', ')}]`, 50, legendY);
      legendY += 25;
      
      if (currentSum !== undefined) {
        ctx.fillText(`Sum: ${currentSum}`, 50, legendY);
        legendY += 25;
        
        if (currentSum < 0) {
          ctx.fillText('Sum < 0: Moving left pointer →', 50, legendY);
        } else if (currentSum > 0) {
          ctx.fillText('Sum > 0: Moving right pointer ←', 50, legendY);
        } else {
          ctx.fillStyle = '#4caf50';
          ctx.fillText('Sum = 0: Found triplet! Moving both pointers inward', 50, legendY);
        }
      }
    }
    
    // Draw found triplets
    if (triplets && triplets.length > 0) {
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Found triplets:', 50, height - 80);
      
      let tripletX = 50;
      ctx.font = '14px Arial';
      
      triplets.forEach((triplet, index) => {
        const tripletText = `[${triplet.join(', ')}]`;
        
        if (tripletX + ctx.measureText(tripletText).width + 20 > width) {
          // Move to next line if we run out of space
          tripletX = 50;
          ctx.fillText(`${index > 0 ? ',' : ''} ${tripletText}`, tripletX, height - 50);
          tripletX += ctx.measureText(`${index > 0 ? ',' : ''} ${tripletText}`).width + 10;
        } else {
          ctx.fillText(`${index > 0 ? ',' : ''} ${tripletText}`, tripletX, height - 50);
          tripletX += ctx.measureText(`${index > 0 ? ',' : ''} ${tripletText}`).width + 10;
        }
      });
    }
  };

  // Draw Container With Most Water problem
  const drawContainerWithMostWater = (ctx, data) => {
    const { heights, left, right, currentArea, maxArea } = data;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barWidth = Math.min(30, (width - 100) / heights.length);
    const spacing = 5;
    const startX = Math.max(50, (width - (heights.length * (barWidth + spacing))) / 2);
    const baseY = height - 80;
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Container With Most Water', 50, 40);
    
    // Draw baseline (water level)
    ctx.fillStyle = '#333';
    ctx.fillRect(startX - 10, baseY, width - startX * 2 + 20, 2);
    
    // Draw height bars
    heights.forEach((h, index) => {
      const x = startX + index * (barWidth + spacing);
      const barHeight = h * 15; // Scale height for visualization
      const y = baseY - barHeight;
      
      // Determine bar color
      let barColor = '#90caf9'; // Default light blue
      
      // Current container bars
      if (left !== undefined && right !== undefined && index >= left && index <= right) {
        if (index === left || index === right) {
          barColor = '#3f51b5'; // Dark blue for the container walls
        } else {
          barColor = '#bbdefb'; // Lighter blue for bars inside container
        }
      }
      
      // Active pointers
      if ((left !== undefined && index === left) || (right !== undefined && index === right)) {
        ctx.strokeStyle = '#f44336';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
      }
      
      // Draw bar
      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw height value
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(h.toString(), x + barWidth/2 - 5, y - 5);
      
      // Draw index
      ctx.fillText(`[${index}]`, x + barWidth/2 - 8, baseY + 15);
    });
    
    // Draw current container area
    if (left !== undefined && right !== undefined) {
      const container = {
        x1: startX + left * (barWidth + spacing),
        x2: startX + right * (barWidth + spacing) + barWidth,
        height: Math.min(heights[left], heights[right]) * 15,
        width: (right - left) * (barWidth + spacing)
      };
      
      // Draw water in the container
      ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
      ctx.fillRect(
        container.x1, 
        baseY - container.height, 
        container.width, 
        container.height
      );
      
      // Draw container dimensions
      const h = Math.min(heights[left], heights[right]);
      const w = right - left;
      
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText(`Current container: height=${h}, width=${w}, area=${h * w}`, 50, height - 40);
      
      if (maxArea !== undefined) {
        ctx.fillStyle = '#4caf50';
        ctx.fillText(`Maximum area so far: ${maxArea}`, 400, height - 40);
      }
    }
  };

  // Draw Remove Duplicates problem
  const drawRemoveDuplicates = (ctx, data) => {
    const { nums, slow, fast, result } = data;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const boxSize = 50;
    const boxSpacing = 10;
    const startX = Math.max(50, (width - (nums.length * (boxSize + boxSpacing))) / 2);
    const startY = 100;
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Remove Duplicates from Sorted Array', 50, 40);
    
    // Draw subtitle
    ctx.font = '14px Arial';
    ctx.fillText('Original array (sorted):', 50, 70);
    
    // Draw array elements
    nums.forEach((num, index) => {
      const x = startX + index * (boxSize + boxSpacing);
      const y = startY;
      
      // Determine box color
      let boxColor = '#e0e0e0';
      
      if (slow !== undefined && index === slow) {
        boxColor = '#3f51b5'; // Blue for slow pointer
      }
      
      if (fast !== undefined && index === fast) {
        boxColor = '#f44336'; // Red for fast pointer
      }
      
      // Draw box
      ctx.fillStyle = boxColor;
      ctx.fillRect(x, y, boxSize, boxSize);
      
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxSize, boxSize);
      
      // Draw number
      ctx.fillStyle = boxColor === '#e0e0e0' ? '#333' : 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(num.toString(), x + boxSize/2 - 8, y + boxSize/2 + 5);
      
      // Draw index
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(`[${index}]`, x + boxSize/2 - 8, y + boxSize + 15);
    });
    
    // Draw pointers legend
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    let legendY = startY + boxSize + 50;
    
    if (slow !== undefined) {
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('slow pointer (position for next unique element)', 80, legendY);
      legendY += 30;
    }
    
    if (fast !== undefined) {
      ctx.fillStyle = '#f44336';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('fast pointer (scanning for unique elements)', 80, legendY);
      legendY += 30;
    }
    
    // Draw result array if available
    if (result !== undefined) {
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText('Result array (after duplicates removed):', 50, legendY + 20);
      
      const uniqueLength = result;
      
      // Draw result array (first uniqueLength elements)
      for (let i = 0; i < uniqueLength; i++) {
        const x = startX + i * (boxSize + boxSpacing);
        const y = legendY + 40;
        
        // Draw box
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(x, y, boxSize, boxSize);
        
        // Draw border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, boxSize, boxSize);
        
        // Draw number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(nums[i].toString(), x + boxSize/2 - 8, y + boxSize/2 + 5);
        
        // Draw index
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText(`[${i}]`, x + boxSize/2 - 8, y + boxSize + 15);
      }
      
      // Draw final length
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Final length: ${uniqueLength}`, 50, height - 40);
    }
  };

  // Draw Reverse String problem
  const drawReverseString = (ctx, data) => {
    const { s, left, right, swapped } = data;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const boxSize = 40;
    const boxSpacing = 10;
    const startX = Math.max(50, (width - (s.length * (boxSize + boxSpacing))) / 2);
    const startY = 100;
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Reverse String', 50, 40);
    
    // Draw subtitle
    ctx.font = '14px Arial';
    ctx.fillText('String (as character array):', 50, 70);
    
    // Draw characters
    s.forEach((char, index) => {
      const x = startX + index * (boxSize + boxSpacing);
      const y = startY;
      
      // Determine box color
      let boxColor = '#e0e0e0';
      
      if (left !== undefined && index === left) {
        boxColor = '#3f51b5'; // Blue for left pointer
      } else if (right !== undefined && index === right) {
        boxColor = '#f44336'; // Red for right pointer
      } else if (swapped && ((index < left && index > right) || (index > left && index < right))) {
        boxColor = '#4caf50'; // Green for already swapped
      }
      
      // Draw box
      ctx.fillStyle = boxColor;
      ctx.fillRect(x, y, boxSize, boxSize);
      
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, boxSize, boxSize);
      
      // Draw character
      ctx.fillStyle = boxColor === '#e0e0e0' ? '#333' : 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(char, x + boxSize/2 - 8, y + boxSize/2 + 5);
      
      // Draw index
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.fillText(`[${index}]`, x + boxSize/2 - 8, y + boxSize + 15);
    });
    
    // Draw swap animation if current pointers are defined
    if (left !== undefined && right !== undefined && left < right) {
      // Draw swap arrow
      ctx.strokeStyle = '#ff9800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const leftX = startX + left * (boxSize + boxSpacing) + boxSize/2;
      const rightX = startX + right * (boxSize + boxSpacing) + boxSize/2;
      const arrowY = startY + boxSize + 30;
      
      // Draw arrow body
      ctx.moveTo(leftX, arrowY);
      ctx.lineTo(rightX, arrowY);
      
      // Draw arrow heads
      ctx.moveTo(leftX + 10, arrowY - 5);
      ctx.lineTo(leftX, arrowY);
      ctx.lineTo(leftX + 10, arrowY + 5);
      
      ctx.moveTo(rightX - 10, arrowY - 5);
      ctx.lineTo(rightX, arrowY);
      ctx.lineTo(rightX - 10, arrowY + 5);
      
      ctx.stroke();
      
      // Draw swap text
      ctx.fillStyle = '#ff9800';
      ctx.font = '14px Arial';
      ctx.fillText('Swap', (leftX + rightX) / 2 - 15, arrowY - 10);
    }
    
    // Draw pointers legend
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    let legendY = startY + boxSize + 60;
    
    if (left !== undefined) {
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('left pointer', 80, legendY);
      legendY += 30;
    }
    
    if (right !== undefined) {
      ctx.fillStyle = '#f44336';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('right pointer', 80, legendY);
      legendY += 30;
    }
    
    // Draw swapped indicator
    if (swapped) {
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(50, legendY - 12, 20, 20);
      ctx.fillStyle = '#333';
      ctx.fillText('swapped characters', 80, legendY);
    }
    
    // Draw original and reversed strings
    if (swapped) {
      const originalString = originalProblem.join('');
      const currentString = s.join('');
      
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`Original: "${originalString}"`, 50, height - 60);
      ctx.fillStyle = '#4caf50';
      ctx.fillText(`Reversed: "${currentString}"`, 50, height - 30);
    }
  };

  // Run algorithm step by step
  const runAlgorithm = () => {
    if (!problem || (Array.isArray(problem) && problem.length === 0)) {
      alert('Please generate a problem first');
      return;
    }
    
    setIsRunning(true);
    setIsPaused(false);
    
    let history = [];
    let result;
    
    switch (algorithm) {
      case 'twoSum':
        ({ history, result } = runTwoSum([...problem], target));
        break;
      
      case 'threeSum':
        ({ history, result } = runThreeSum([...problem]));
        break;
      
      case 'containerWithMostWater':
        ({ history, result } = runContainerWithMostWater([...problem]));
        break;
      
      case 'removeDuplicates':
        ({ history, result } = runRemoveDuplicates([...problem]));
        break;
      
      case 'reverseString':
        ({ history, result } = runReverseString([...problem]));
        break;
      
      default:
        break;
    }
    
    setAlgorithmHistory(history);
    setResult(result);
    setTotalSteps(history.length);
    setCurrentStep(0);
    
    animateAlgorithm(0, history);
  };
  
  // Run Two Sum algorithm
  const runTwoSum = (nums, target) => {
    const history = [];
    
    history.push({
      step: 'Initialize',
      nums: [...nums],
      target,
      numMap: new Map(),
      highlightedLines: [1, 2, 3],
      explanation: 'Initialize an empty map to store visited numbers and their indices.'
    });
    
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
      const currentMap = new Map(numMap);
      
      // Current step: Check if complement exists
      const complement = target - nums[i];
      
      history.push({
        step: `Check index ${i}`,
        nums: [...nums],
        target,
        currentIndex: i,
        numMap: new Map(currentMap),
        highlightedLines: [4, 5, 6, 7, 8],
        explanation: `For number ${nums[i]} at index ${i}, the complement needed is ${complement}. Checking if ${complement} exists in our map.`
      });
      
      if (numMap.has(complement)) {
        const result = [numMap.get(complement), i];
        
        history.push({
          step: 'Found solution',
          nums: [...nums],
          target,
          currentIndex: i,
          numMap: new Map(currentMap),
          foundPair: result,
          highlightedLines: [9, 10],
          explanation: `Found complement ${complement} at index ${numMap.get(complement)}. The solution is [${result[0]}, ${result[1]}].`
        });
        
        return { history, result };
      }
      
      // Add current number to map
      numMap.set(nums[i], i);
      
      history.push({
        step: `Update map with index ${i}`,
        nums: [...nums],
        target,
        currentIndex: i,
        numMap: new Map(numMap),
        highlightedLines: [13, 14],
        explanation: `Add number ${nums[i]} and its index ${i} to the map and continue.`
      });
    }
    
    history.push({
      step: 'No solution',
      nums: [...nums],
      target,
      numMap: new Map(numMap),
      highlightedLines: [17, 18],
      explanation: 'No two numbers add up to the target value.'
    });
    
    return { history, result: null };
  };
  
  // Run Three Sum algorithm
  const runThreeSum = (nums) => {
    const history = [];
    
    // Sort the array
    nums.sort((a, b) => a - b);
    
    history.push({
      step: 'Sort the array',
      nums: [...nums],
      highlightedLines: [1, 2],
      explanation: 'Sort the array in ascending order to use the two-pointer technique.'
    });
    
    const result = [];
    
    history.push({
      step: 'Initialize result array',
      nums: [...nums],
      triplets: [],
      highlightedLines: [3, 4],
      explanation: 'Initialize an empty array to store triplets that sum to zero.'
    });
    
    // Fix first element and use two pointers for the remaining two
    for (let i = 0; i < nums.length - 2; i++) {
      // Skip duplicates for first pointer
      if (i > 0 && nums[i] === nums[i - 1]) {
        history.push({
          step: `Skip duplicate at index ${i}`,
          nums: [...nums],
          currentI: i,
          triplets: [...result],
          highlightedLines: [7, 8],
          explanation: `Skip duplicate value ${nums[i]} at index ${i} to avoid duplicate triplets.`
        });
        continue;
      }
      
      history.push({
        step: `Fix first element at index ${i}`,
        nums: [...nums],
        currentI: i,
        triplets: [...result],
        highlightedLines: [6, 7],
        explanation: `Fix the first element of the triplet as ${nums[i]} at index ${i}.`
      });
      
      let left = i + 1;
      let right = nums.length - 1;
      
      history.push({
        step: 'Initialize two pointers',
        nums: [...nums],
        currentI: i,
        left,
        right,
        triplets: [...result],
        highlightedLines: [10, 11, 12],
        explanation: `Initialize left pointer at index ${left} (value ${nums[left]}) and right pointer at index ${right} (value ${nums[right]}).`
      });
      
      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];
        
        history.push({
          step: 'Calculate sum',
          nums: [...nums],
          currentI: i,
          left,
          right,
          currentSum: sum,
          triplets: [...result],
          highlightedLines: [14, 15],
          explanation: `Calculate sum of ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}.`
        });
        
        if (sum < 0) {
          // Move left pointer to increase sum
          history.push({
            step: 'Sum too small',
            nums: [...nums],
            currentI: i,
            left,
            right,
            currentSum: sum,
            triplets: [...result],
            highlightedLines: [16, 17, 18],
            explanation: `Sum ${sum} is less than zero, so move left pointer to increase the sum.`
          });
          left++;
        } else if (sum > 0) {
          // Move right pointer to decrease sum
          history.push({
            step: 'Sum too large',
            nums: [...nums],
            currentI: i,
            left,
            right,
            currentSum: sum,
            triplets: [...result],
            highlightedLines: [19, 20, 21],
            explanation: `Sum ${sum} is greater than zero, so move right pointer to decrease the sum.`
          });
          right--;
        } else {
          // Found a triplet
          result.push([nums[i], nums[left], nums[right]]);
          
          history.push({
            step: 'Found triplet',
            nums: [...nums],
            currentI: i,
            left,
            right,
            currentSum: sum,
            triplets: [...result],
            highlightedLines: [22, 23, 24],
            explanation: `Found triplet [${nums[i]}, ${nums[left]}, ${nums[right]}] that sums to zero.`
          });
          
          // Skip duplicates for left pointer
          while (left < right && nums[left] === nums[left + 1]) {
            history.push({
              step: 'Skip duplicate left',
              nums: [...nums],
              currentI: i,
              left,
              right,
              triplets: [...result],
              highlightedLines: [26, 27],
              explanation: `Skip duplicate value ${nums[left]} at left pointer to avoid duplicate triplets.`
            });
            left++;
          }
          
          // Skip duplicates for right pointer
          while (left < right && nums[right] === nums[right - 1]) {
            history.push({
              step: 'Skip duplicate right',
              nums: [...nums],
              currentI: i,
              left,
              right,
              triplets: [...result],
              highlightedLines: [28, 29],
              explanation: `Skip duplicate value ${nums[right]} at right pointer to avoid duplicate triplets.`
            });
            right--;
          }
          
          // Move both pointers inward
          left++;
          right--;
          
          history.push({
            step: 'Move both pointers',
            nums: [...nums],
            currentI: i,
            left,
            right,
            triplets: [...result],
            highlightedLines: [31, 32, 33],
            explanation: 'Move both pointers inward to find more triplets.'
          });
        }
      }
    }
    
    history.push({
      step: 'Final result',
      nums: [...nums],
      triplets: [...result],
      highlightedLines: [39, 40],
      explanation: `Found ${result.length} triplets that sum to zero.`
    });
    
    return { history, result };
  };
  
  // Run Container With Most Water algorithm
  const runContainerWithMostWater = (heights) => {
    const history = [];
    
    history.push({
      step: 'Initialize',
      heights: [...heights],
      highlightedLines: [1, 2, 3, 4],
      explanation: 'Initialize variables to track maximum water area and pointers at both ends of the array.'
    });
    
    let maxWater = 0;
    let left = 0;
    let right = heights.length - 1;
    
    history.push({
      step: 'Set pointers',
      heights: [...heights],
      left,
      right,
      maxArea: maxWater,
      highlightedLines: [3, 4],
      explanation: `Initialize left pointer at index ${left} (height ${heights[left]}) and right pointer at index ${right} (height ${heights[right]}).`
    });
    
    while (left < right) {
      // Calculate water area using the shorter height
      const h = Math.min(heights[left], heights[right]);
      const w = right - left;
      const area = h * w;
      
      history.push({
        step: 'Calculate area',
        heights: [...heights],
        left,
        right,
        currentArea: area,
        maxArea: maxWater,
        highlightedLines: [6, 7, 8, 9],
        explanation: `Calculate area with heights[${left}]=${heights[left]} and heights[${right}]=${heights[right]}. Area = min(${heights[left]}, ${heights[right]}) * (${right} - ${left}) = ${h} * ${w} = ${area}.`
      });
      
      // Update maximum area
      if (area > maxWater) {
        maxWater = area;
        
        history.push({
          step: 'Update max area',
          heights: [...heights],
          left,
          right,
          currentArea: area,
          maxArea: maxWater,
          highlightedLines: [11, 12],
          explanation: `Update maximum area to ${maxWater}.`
        });
      }
      
      // Move the pointer with the smaller height
      if (heights[left] < heights[right]) {
        history.push({
          step: 'Move left pointer',
          heights: [...heights],
          left,
          right,
          currentArea: area,
          maxArea: maxWater,
          highlightedLines: [14, 15, 16],
          explanation: `Left height (${heights[left]}) is smaller than right height (${heights[right]}), so move left pointer to potentially find a taller bar.`
        });
        left++;
      } else {
        history.push({
          step: 'Move right pointer',
          heights: [...heights],
          left,
          right,
          currentArea: area,
          maxArea: maxWater,
          highlightedLines: [17, 18, 19],
          explanation: `Right height (${heights[right]}) is smaller than or equal to left height (${heights[left]}), so move right pointer to potentially find a taller bar.`
        });
        right--;
      }
    }
    
    history.push({
      step: 'Final result',
      heights: [...heights],
      maxArea: maxWater,
      highlightedLines: [22, 23],
      explanation: `The maximum water area is ${maxWater}.`
    });
    
    return { history, result: maxWater };
  };
  
  // Run Remove Duplicates algorithm
  const runRemoveDuplicates = (nums) => {
    const history = [];
    
    if (nums.length === 0) {
      history.push({
        step: 'Empty array',
        nums: [],
        highlightedLines: [1, 2],
        explanation: 'The array is empty, so return 0.'
      });
      
      return { history, result: 0 };
    }
    
    history.push({
      step: 'Initialize',
      nums: [...nums],
      highlightedLines: [1, 4, 7],
      explanation: 'Initialize slow pointer at index 0, which will be the position to place the next unique element.'
    });
    
    // Use slow pointer as position to place next unique element
    let slow = 0;
    
    history.push({
      step: 'Set slow pointer',
      nums: [...nums],
      slow,
      highlightedLines: [4],
      explanation: `Initialize slow pointer at index ${slow} (value ${nums[slow]}).`
    });
    
    // Fast pointer scans through the array
    for (let fast = 1; fast < nums.length; fast++) {
      history.push({
        step: `Fast pointer at index ${fast}`,
        nums: [...nums],
        slow,
        fast,
        highlightedLines: [7],
        explanation: `Fast pointer is at index ${fast} (value ${nums[fast]}).`
      });
      
      // When we find a new unique element
      if (nums[fast] !== nums[slow]) {
        // Move slow pointer forward
        slow++;
        // Place the unique element at slow position
        nums[slow] = nums[fast];
        
        history.push({
          step: `Found unique element ${nums[fast]}`,
          nums: [...nums],
          slow,
          fast,
          highlightedLines: [8, 9, 10, 11, 12, 13],
          explanation: `Found a new unique element ${nums[fast]} at index ${fast}. Move slow pointer to ${slow} and place the new element there.`
        });
      } else {
        history.push({
          step: `Duplicate element ${nums[fast]}`,
          nums: [...nums],
          slow,
          fast,
          highlightedLines: [8],
          explanation: `Element ${nums[fast]} at index ${fast} is a duplicate of ${nums[slow]} at index ${slow}, so skip it.`
        });
      }
    }
    
    // slow+1 is the length of the array without duplicates
    const result = slow + 1;
    
    history.push({
      step: 'Final result',
      nums: [...nums],
      slow,
      result,
      highlightedLines: [17, 18],
      explanation: `The array without duplicates has length ${result}.`
    });
    
    return { history, result };
  };
  
  // Run Reverse String algorithm
  const runReverseString = (s) => {
    const history = [];
    
    history.push({
      step: 'Initialize',
      s: [...s],
      highlightedLines: [1, 2, 3],
      explanation: 'Initialize pointers at both ends of the string.'
    });
    
    let left = 0;
    let right = s.length - 1;
    
    history.push({
      step: 'Set pointers',
      s: [...s],
      left,
      right,
      highlightedLines: [1, 2],
      explanation: `Initialize left pointer at index ${left} (character "${s[left]}") and right pointer at index ${right} (character "${s[right]}").`
    });
    
    while (left < right) {
      history.push({
        step: `Compare indices ${left} and ${right}`,
        s: [...s],
        left,
        right,
        highlightedLines: [4],
        explanation: `Compare characters at indices ${left} ("${s[left]}") and ${right} ("${s[right]}").`
      });
      
      // Swap characters at left and right pointers
      const temp = s[left];
      s[left] = s[right];
      s[right] = temp;
      
      history.push({
        step: `Swap characters "${temp}" and "${s[left]}"`,
        s: [...s],
        left,
        right,
        swapped: true,
        highlightedLines: [5, 6, 7, 8],
        explanation: `Swap characters "${temp}" at index ${left} and "${s[right]}" at index ${right}.`
      });
      
      // Move pointers toward each other
      left++;
      right--;
      
      if (left < right) {
        history.push({
          step: 'Move pointers',
          s: [...s],
          left,
          right,
          swapped: true,
          highlightedLines: [10, 11, 12],
          explanation: `Move left pointer to index ${left} and right pointer to index ${right}.`
        });
      }
    }
    
    history.push({
      step: 'Final result',
      s: [...s],
      swapped: true,
      highlightedLines: [14, 15],
      explanation: `The string has been reversed successfully: "${s.join('')}".`
    });
    
    return { history, result: s };
  };

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
    setExplanation(historyItem.explanation);
    setHighlightedLines(historyItem.highlightedLines);
    
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
      title="Double Pointer Algorithm Visualizer"
      prompts={doublePointerPrompts}
      promptStep={promptStep}
      onNextPrompt={(step) => setPromptStep(step)}
      onPreviousPrompt={(step) => setPromptStep(step)}
      onFinishPrompts={() => setShowPrompts(false)}
      showPrompts={showPrompts}
      algorithmData={algorithmInfo[algorithm]}
      controls={
        <>
          {/* Algorithm Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Algorithm</InputLabel>
            <Select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              label="Algorithm"
            >
              {getAvailableAlgorithms().map((algo) => (
                <MenuItem key={algo} value={algo}>
                  {algorithmInfo[algo].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      
          {/* Problem Size Control */}
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Problem Size</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  value={problemSize}
                  onChange={(_, value) => setProblemSize(value)}
                  min={3}
                  max={20}
                  marks
                />
              </Grid>
              <Grid item>
                <TextField
                  value={problemSize}
                  onChange={(e) => setProblemSize(Number(e.target.value))}
                  type="number"
                  size="small"
                  sx={{ width: 80 }}
                />
              </Grid>
            </Grid>
          </Box>
      
          {/* Custom Input */}
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>
              Custom Input (JSON)
              <Tooltip title={algorithm === 'twoSum' ? 
                'For Two Sum, use format: {"array": [1, 2, 3], "target": 5}' : 
                'Enter an array in JSON format: [1, 2, 3]'
              }>
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={algorithm === 'twoSum' ? 
                    '{"array": [2, 7, 11, 15], "target": 9}' : 
                    '[1, 2, 3, 4, 5]'
                  }
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleCustomInput}
                  disabled={!customInput}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
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
          
          {/* Speed Control */}
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Animation Speed</Typography>
            <Slider
              value={speed}
              onChange={(_, value) => setSpeed(value)}
              min={0}
              max={100}
              marks
            />
          </Box>
            
          {/* Algorithm Controls */}
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
                setCurrentStep(nextStep);
                
                // Get the history item and update visualization
                const historyItem = algorithmHistory[nextStep];
                setExplanation(historyItem.explanation);
                setHighlightedLines(historyItem.highlightedLines);
                
                // Apply smooth transition for manual stepping
                const canvas = canvasRef.current;
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  
                  // Create fade effect
                  const fade = (alpha) => {
                    if (alpha >= 1) {
                      // Fade complete
                      return;
                    }
                    
                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw the problem
                    drawProblem(historyItem);
                    
                    // Apply semi-transparent overlay for fade effect
                    ctx.fillStyle = `rgba(255, 255, 255, ${1 - alpha})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Continue fade animation
                    requestAnimationFrame(() => fade(alpha + 0.1));
                  };
                  
                  // Start fade animation
                  fade(0);
                }
              }
            }}
            onReset={() => {
              // Reset visualization
              setIsRunning(false);
              setIsPaused(false);
              setCurrentStep(0);
              setExplanation('');
              setHighlightedLines([]);
              
              // Clear any existing animation timer
              if (animationRef.current) {
                clearTimeout(animationRef.current);
                animationRef.current = null;
              }
              
              // Redraw the original problem
              const canvas = canvasRef.current;
              if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawProblem({ problem: originalProblem });
              }
            }}
            isRunning={isRunning}
            isPaused={isPaused}
            currentStep={currentStep}
            totalSteps={totalSteps}
            disabled={!problem}
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

          {/* Explanation */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Explanation
              </Typography>
              <Typography>{explanation || 'Click Run Algorithm to start the visualization'}</Typography>
            </CardContent>
          </Card>

          {/* Code Display */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Implementation Code:</Typography>
            <CodeHighlighter
              code={codeSnippets[algorithm]}
              highlightedLines={highlightedLines}
              language="javascript"
              title={`${algorithmInfo[algorithm].name} Implementation`}
            />
          </Box>
        </>
      }
    />
  );
};

export default DoublePointerVisualizer;