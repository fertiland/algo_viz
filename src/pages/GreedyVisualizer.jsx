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
  Chip,
} from '@mui/material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import AlgorithmComparisonSection from './GreedyVisualizer/AlgorithmComparisonSection';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import HistoryIcon from '@mui/icons-material/History';
import CodeIcon from '@mui/icons-material/Code';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisualizerLayout from '../components/VisualizerLayout';
import VisualizerControls from '../components/VisualizerControls';

const GreedyVisualizer = () => {
  const [problemType, setProblemType] = useState('assignment');
  const [algorithm, setAlgorithm] = useState('jobScheduling');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [problemSize, setProblemSize] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [algorithmHistory, setAlgorithmHistory] = useState([]);
  const [originalProblem, setOriginalProblem] = useState([]);
  const [problem, setProblem] = useState([]);
  const [result, setResult] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [showOriginalProblem, setShowOriginalProblem] = useState(true);
  const [problemDescription, setProblemDescription] = useState('');
  
  // Prompt system state
  const [showPrompts, setShowPrompts] = useState(true);
  const [promptStep, setPromptStep] = useState(0);
  
  // Greedy algorithm prompts
  const greedyPrompts = [
    {
      title: 'Welcome to Greedy Algorithm Visualizer',
      content: 'This tool helps you understand how greedy algorithms work by visualizing their decision-making process step by step. You can see how the algorithm makes locally optimal choices to find a global solution.'
    },
    {
      title: 'Choose an Algorithm',
      content: 'Select a greedy algorithm from the dropdown menu. Each algorithm solves a different optimization problem using the greedy approach.'
    },
    {
      title: 'Generate Random Problem',
      content: 'Click the "Generate Random Problem" button to create a new problem instance for the selected algorithm.'
    },
    {
      title: 'Run the Algorithm',
      content: 'Use the control buttons to run the algorithm step by step. Watch how the algorithm makes decisions and builds the solution.'
    },
    {
      title: 'Understand the Solution',
      content: 'The visualization shows how the algorithm constructs the solution. The explanation panel provides details about each step.'
    }
  ];
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Code snippets for each greedy algorithm
  const codeSnippets = {
    // Assignment Problems
    jobScheduling: `// Job Scheduling with Deadlines and Profits
function jobScheduling(jobs) {
  // Sort jobs in decreasing order of profit
  jobs.sort((a, b) => b.profit - a.profit);
  
  // Find the maximum deadline
  const maxDeadline = Math.max(...jobs.map(job => job.deadline));
  
  // Initialize result array and slot array
  const result = Array(maxDeadline).fill(null);
  const slot = Array(maxDeadline).fill(false);
  
  // Iterate through all jobs
  for (let i = 0; i < jobs.length; i++) {
    // Find a free slot for this job
    for (let j = Math.min(maxDeadline - 1, jobs[i].deadline - 1); j >= 0; j--) {
      // If free slot found
      if (!slot[j]) {
        result[j] = jobs[i];
        slot[j] = true;
        break;
      }
    }
  }
  
  // Return scheduled jobs (non-null values)
  return result.filter(job => job !== null);
}`,
    
    fractionalKnapsack: `// Fractional Knapsack Problem
function fractionalKnapsack(items, capacity) {
  // Calculate value-to-weight ratio for each item
  const itemsWithRatio = items.map(item => ({
    ...item,
    ratio: item.value / item.weight
  }));
  
  // Sort items by value-to-weight ratio in descending order
  itemsWithRatio.sort((a, b) => b.ratio - a.ratio);
  
  let totalValue = 0;
  let remainingCapacity = capacity;
  const result = [];
  
  // Iterate through all items
  for (let i = 0; i < itemsWithRatio.length; i++) {
    const item = itemsWithRatio[i];
    
    // If we can take the whole item
    if (remainingCapacity >= item.weight) {
      result.push({ ...item, fraction: 1 });
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } 
    // If we can take a fraction of the item
    else if (remainingCapacity > 0) {
      const fraction = remainingCapacity / item.weight;
      result.push({ ...item, fraction });
      totalValue += item.value * fraction;
      remainingCapacity = 0;
      break;
    }
  }
  
  return { result, totalValue };
}`,
    
    // Interval Problems
    activitySelection: `// Activity Selection Problem
function activitySelection(activities) {
  // Sort activities by finish time
  activities.sort((a, b) => a.finish - b.finish);
  
  const selected = [activities[0]];
  let lastSelected = 0;
  
  // Consider all activities one by one
  for (let i = 1; i < activities.length; i++) {
    // If this activity has start time greater than or equal
    // to the finish time of previously selected activity,
    // then select it
    if (activities[i].start >= activities[lastSelected].finish) {
      selected.push(activities[i]);
      lastSelected = i;
    }
  }
  
  return selected;
}`,
    
    intervalColoring: `// Interval Coloring (Minimum Number of Rooms)
function intervalColoring(intervals) {
  // Create events for start and end times
  const events = [];
  for (let i = 0; i < intervals.length; i++) {
    events.push({ time: intervals[i].start, type: 'start', id: i });
    events.push({ time: intervals[i].end, type: 'end', id: i });
  }
  
  // Sort events by time
  events.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    // If times are equal, end comes before start
    return a.type === 'end' ? -1 : 1;
  });
  
  let currentRooms = 0;
  let maxRooms = 0;
  const colors = Array(intervals.length).fill(0);
  const availableColors = [];
  
  // Process events
  for (const event of events) {
    if (event.type === 'start') {
      // Assign a color (room)
      currentRooms++;
      let color;
      if (availableColors.length > 0) {
        color = availableColors.pop();
      } else {
        color = currentRooms;
      }
      colors[event.id] = color;
      maxRooms = Math.max(maxRooms, currentRooms);
    } else {
      // Free up a color (room)
      currentRooms--;
      availableColors.push(colors[event.id]);
    }
  }
  
  return { colors, maxRooms };
}`,
    
    // Maximum Subarray Problem
    maxSubArray: `// Maximum Subarray Problem (Kadane's Algorithm)
function maxSubArray(nums) {
  // Initialize current sum and maximum sum with the first element
  let curSum = nums[0];
  let maxSum = nums[0];
  
  // Start from the second element
  for (let i = 1; i < nums.length; i++) {
    // If current sum is negative, discard it and start fresh
    if (curSum < 0) {
      curSum = nums[i];
    } else {
      // Otherwise, add the current element to the running sum
      curSum += nums[i];
    }
    
    // Update maximum sum if current sum is greater
    maxSum = Math.max(curSum, maxSum);
  }
  
  return maxSum;
}`
  };
  
  // Algorithm complexity information
  const algorithmInfo = {
    // Assignment Problems
    jobScheduling: {
      name: 'Job Scheduling',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(n)',
      description: 'Job Scheduling is a greedy algorithm that schedules jobs to maximize profit while respecting deadlines. It sorts jobs by profit and assigns each job to the latest possible time slot before its deadline.'
    },
    fractionalKnapsack: {
      name: 'Fractional Knapsack',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Fractional Knapsack is a greedy algorithm that selects items based on value-to-weight ratio to maximize total value while respecting a weight capacity constraint. Unlike 0/1 Knapsack, it allows taking fractions of items.'
    },
    
    // Interval Problems
    activitySelection: {
      name: 'Activity Selection',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Activity Selection is a greedy algorithm that selects the maximum number of non-overlapping activities. It sorts activities by finish time and selects activities that start after the previously selected activity finishes.'
    },
    intervalColoring: {
      name: 'Interval Coloring',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      description: 'Interval Coloring (also known as the Meeting Room problem) finds the minimum number of rooms needed to schedule all intervals without overlap. It uses a greedy approach by processing events in chronological order.'
    },
    
    // Maximum Subarray Problem
    maxSubArray: {
      name: 'Maximum Subarray',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      description: 'Maximum Subarray Problem (also known as Kadane\'s Algorithm) finds the contiguous subarray with the largest sum within a one-dimensional array of numbers. It uses a greedy approach by keeping track of the current sum and maximum sum as it iterates through the array.'
    }
  };

  // Initialize problem data when component loads
  useEffect(() => {
    generateRandomProblem();
  }, []); // Empty dependency array means this runs once when component mounts

  // Get available algorithms based on problem type
  const getAvailableAlgorithms = () => {
    switch (problemType) {
      case 'assignment':
        return ['jobScheduling', 'fractionalKnapsack'];
      case 'interval':
        return ['activitySelection', 'intervalColoring', 'maxSubArray'];
      default:
        return [];
    }
  };

  // Generate random problem based on problem type and algorithm
  const generateRandomProblem = () => {
    let newProblem = [];
    let description = '';
    
    switch (algorithm) {
      case 'jobScheduling':
        // Generate random jobs with deadlines and profits
        newProblem = Array.from({ length: problemSize }, (_, i) => ({
          id: i + 1,
          deadline: Math.floor(Math.random() * problemSize) + 1,
          profit: Math.floor(Math.random() * 50) + 10
        }));
        description = `Job Scheduling Problem: You have ${problemSize} jobs, each with a deadline and profit. The goal is to schedule the jobs to maximize total profit while respecting deadlines. Each job can be completed in one unit of time.`;
        break;
      
      case 'fractionalKnapsack':
        // Generate random items with values and weights
        newProblem = {
          items: Array.from({ length: problemSize }, (_, i) => ({
            id: i + 1,
            value: Math.floor(Math.random() * 50) + 10,
            weight: Math.floor(Math.random() * 20) + 5
          })),
          capacity: Math.floor(Math.random() * 50) + problemSize * 10
        };
        description = `Fractional Knapsack Problem: You have ${problemSize} items, each with a value and weight. The goal is to maximize the total value of items in the knapsack while respecting the weight capacity of ${newProblem.capacity}. You can take fractions of items.`;
        break;
      
      case 'activitySelection':
        // Generate random activities with start and finish times
        newProblem = Array.from({ length: problemSize }, (_, i) => {
          const start = Math.floor(Math.random() * 20);
          return {
            id: i + 1,
            start,
            finish: start + Math.floor(Math.random() * 10) + 1
          };
        });
        description = `Activity Selection Problem: You have ${problemSize} activities, each with a start and finish time. The goal is to select the maximum number of non-overlapping activities that can be performed.`;
        break;
      
      case 'intervalColoring':
        // Generate random intervals with start and end times
        newProblem = Array.from({ length: problemSize }, (_, i) => {
          const start = Math.floor(Math.random() * 20);
          return {
            id: i + 1,
            start,
            end: start + Math.floor(Math.random() * 10) + 1
          };
        });
        description = `Interval Coloring Problem: You have ${problemSize} intervals, each with a start and end time. The goal is to assign colors to intervals so that overlapping intervals get different colors, using the minimum number of colors possible.`;
        break;
      
      case 'maxSubArray':
        // Generate random array of integers for maximum subarray problem
        newProblem = Array.from({ length: problemSize }, () => {
          // Generate random integers between -20 and 30 to ensure some negative values
          return Math.floor(Math.random() * 50) - 20;
        });
        description = `Maximum Subarray Problem: You have an array of ${problemSize} numbers. The goal is to find the contiguous subarray with the largest sum.`;
        break;
      
      default:
        break;
    }
    
    setProblem(newProblem);
    setOriginalProblem(JSON.parse(JSON.stringify(newProblem)));
    setProblemDescription(description);
    resetVisualization();
    drawProblem(newProblem);
  };

  // Handle custom input
  const handleCustomInput = () => {
    try {
      const inputProblem = JSON.parse(customInput);
      setProblem(inputProblem);
      setOriginalProblem(JSON.parse(JSON.stringify(inputProblem)));
      resetVisualization();
      drawProblem(inputProblem);
    } catch (error) {
      alert('Please enter valid JSON format for the problem');
    }
  };

  // Reset visualization state
  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setAlgorithmHistory([]);
    setResult([]);
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
      case 'jobScheduling':
        drawJobScheduling(ctx, problemData);
        break;
      
      case 'fractionalKnapsack':
        drawFractionalKnapsack(ctx, problemData);
        break;
      
      case 'activitySelection':
        drawActivitySelection(ctx, problemData);
        break;
      
      case 'intervalColoring':
        drawIntervalColoring(ctx, problemData);
        break;
      
      case 'maxSubArray':
        drawMaxSubArray(ctx, problemData);
        break;
      
      default:
        break;
    }
  };

  // Draw job scheduling problem
  const drawJobScheduling = (ctx, jobs) => {
    if (!Array.isArray(jobs)) {
      console.error('Invalid jobs data:', jobs);
      return;
    }
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barHeight = 30;
    const maxProfit = Math.max(...jobs.map(job => job.profit));
    const maxDeadline = Math.max(...jobs.map(job => job.deadline));
    
    // Draw timeline
    ctx.fillStyle = '#333';
    ctx.fillRect(50, height - 40, width - 100, 2);
    
    // Draw time markers
    for (let i = 0; i <= maxDeadline; i++) {
      const x = 50 + (i * (width - 100) / maxDeadline);
      ctx.fillRect(x, height - 45, 2, 10);
      ctx.fillText(i.toString(), x - 5, height - 25);
    }
    
    // Draw jobs
    jobs.forEach((job, index) => {
      const y = 50 + index * (barHeight + 10);
      const barWidth = (job.profit / maxProfit) * 200;
      
      // Draw job bar
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(50, y, barWidth, barHeight);
      
      // Draw job info
      ctx.fillStyle = 'white';
      ctx.fillText(`Job ${job.id}`, 60, y + barHeight/2 + 5);
      
      // Draw deadline marker
      const deadlineX = 50 + (job.deadline * (width - 100) / maxDeadline);
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(deadlineX, y);
      ctx.lineTo(deadlineX, y + barHeight);
      ctx.stroke();
      
      // Draw profit info
      ctx.fillStyle = '#333';
      ctx.fillText(`Profit: ${job.profit}`, 260, y + barHeight/2 + 5);
      ctx.fillText(`Deadline: ${job.deadline}`, 360, y + barHeight/2 + 5);
    });
  };

  // Draw fractional knapsack problem
  const drawFractionalKnapsack = (ctx, problem) => {
    const { items, capacity } = problem;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const itemHeight = 30;
    const maxValue = Math.max(...items.map(item => item.value));
    const maxWeight = Math.max(...items.map(item => item.weight));
    
    // Draw capacity
    ctx.fillStyle = '#333';
    ctx.fillText(`Knapsack Capacity: ${capacity}`, width/2 - 80, 30);
    
    // Draw items
    items.forEach((item, index) => {
      const y = 50 + index * (itemHeight + 10);
      const valueBarWidth = (item.value / maxValue) * 150;
      const weightBarWidth = (item.weight / maxWeight) * 150;
      
      // Draw value bar
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(50, y, valueBarWidth, itemHeight);
      
      // Draw weight bar
      ctx.fillStyle = '#f44336';
      ctx.fillRect(250, y, weightBarWidth, itemHeight);
      
      // Draw item info
      ctx.fillStyle = 'white';
      ctx.fillText(`Item ${item.id}`, 60, y + itemHeight/2 + 5);
      
      // Draw value and weight info
      ctx.fillStyle = '#333';
      ctx.fillText(`Value: ${item.value}`, 210, y + itemHeight/2 + 5);
      ctx.fillText(`Weight: ${item.weight}`, 410, y + itemHeight/2 + 5);
      ctx.fillText(`Ratio: ${(item.value / item.weight).toFixed(2)}`, 550, y + itemHeight/2 + 5);
    });
  };

  // Draw activity selection problem
  const drawActivitySelection = (ctx, activities) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const activityHeight = 30;
    const maxFinish = Math.max(...activities.map(activity => activity.finish));
    
    // Draw timeline
    ctx.fillStyle = '#333';
    ctx.fillRect(50, height - 40, width - 100, 2);
    
    // Draw time markers
    for (let i = 0; i <= maxFinish; i += 2) {
      const x = 50 + (i * (width - 100) / maxFinish);
      ctx.fillRect(x, height - 45, 2, 10);
      ctx.fillText(i.toString(), x - 5, height - 25);
    }
    
    // Draw activities
    activities.forEach((activity, index) => {
      const y = 50 + index * (activityHeight + 10);
      const startX = 50 + (activity.start * (width - 100) / maxFinish);
      const endX = 50 + (activity.finish * (width - 100) / maxFinish);
      const barWidth = endX - startX;
      
      // Draw activity bar
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(startX, y, barWidth, activityHeight);
      
      // Draw activity info
      ctx.fillStyle = 'white';
      ctx.fillText(`Activity ${activity.id}`, startX + 5, y + activityHeight/2 + 5);
      
      // Draw start and finish info
      ctx.fillStyle = '#333';
      ctx.fillText(`Start: ${activity.start}`, startX - 40, y - 5);
      ctx.fillText(`Finish: ${activity.finish}`, endX + 5, y - 5);
    });
  };

  // Draw interval coloring problem
  const drawIntervalColoring = (ctx, intervals) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const intervalHeight = 30;
    const maxEnd = Math.max(...intervals.map(interval => interval.end));
    
    // Draw timeline
    ctx.fillStyle = '#333';
    ctx.fillRect(50, height - 40, width - 100, 2);
    
    // Draw time markers
    for (let i = 0; i <= maxEnd; i += 2) {
      const x = 50 + (i * (width - 100) / maxEnd);
      ctx.fillRect(x, height - 45, 2, 10);
      ctx.fillText(i.toString(), x - 5, height - 25);
    }
    
    // Draw intervals
    intervals.forEach((interval, index) => {
      const y = 50 + index * (intervalHeight + 10);
      const startX = 50 + (interval.start * (width - 100) / maxEnd);
      const endX = 50 + (interval.end * (width - 100) / maxEnd);
      const barWidth = endX - startX;
      
      // Draw interval bar
      ctx.fillStyle = '#3f51b5';
      ctx.fillRect(startX, y, barWidth, intervalHeight);
      
      // Draw interval info
      ctx.fillStyle = 'white';
      ctx.fillText(`Interval ${interval.id}`, startX + 5, y + intervalHeight/2 + 5);
      
      // Draw start and end info
      ctx.fillStyle = '#333';
      ctx.fillText(`Start: ${interval.start}`, startX - 40, y - 5);
      ctx.fillText(`End: ${interval.end}`, endX + 5, y - 5);
    });
  };
  
  // Draw maximum subarray problem
  const drawMaxSubArray = (ctx, data) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barWidth = 40;
    const barSpacing = 10;
    const maxAbsValue = Math.max(...data.map(val => Math.abs(val)));
    const scale = 100 / maxAbsValue; // Scale factor for bar heights
    
    // Draw x-axis (zero line)
    ctx.fillStyle = '#333';
    const zeroY = height / 2;
    ctx.fillRect(50, zeroY, width - 100, 2);
    
    // Draw array elements as bars
    data.forEach((value, index) => {
      const x = 50 + index * (barWidth + barSpacing);
      const barHeight = Math.abs(value) * scale;
      
      // Draw bar (positive values go up, negative values go down)
      ctx.fillStyle = value >= 0 ? '#4caf50' : '#f44336';
      
      if (value >= 0) {
        ctx.fillRect(x, zeroY - barHeight, barWidth, barHeight);
      } else {
        ctx.fillRect(x, zeroY, barWidth, barHeight);
      }
      
      // Draw value
      ctx.fillStyle = '#333';
      ctx.fillText(value.toString(), x + barWidth/2 - 5, value >= 0 ? zeroY - barHeight - 10 : zeroY + barHeight + 15);
      
      // Draw index
      ctx.fillText(index.toString(), x + barWidth/2 - 5, zeroY + 20);
    });
    
    // If we have current and max sums in the history item, display them
    if (data.curSum !== undefined && data.maxSum !== undefined) {
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText(`Current Sum: ${data.curSum}`, 50, 30);
      ctx.fillText(`Maximum Sum: ${data.maxSum}`, 200, 30);
      
      // If we have current index, highlight it
      if (data.currentIndex !== undefined) {
        const x = 50 + data.currentIndex * (barWidth + barSpacing);
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, 50, barWidth + 4, height - 100);
      }
      
      // If we have best subarray range, highlight it
      if (data.bestStartIndex !== undefined && data.bestEndIndex !== undefined) {
        const startX = 50 + data.bestStartIndex * (barWidth + barSpacing);
        const endX = 50 + data.bestEndIndex * (barWidth + barSpacing) + barWidth;
        
        ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
        ctx.fillRect(startX, 50, endX - startX, height - 100);
        
        ctx.fillStyle = '#2196f3';
        ctx.fillText(`Best Subarray [${data.bestStartIndex}...${data.bestEndIndex}]`, width / 2 - 80, height - 20);
      }
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
      case 'jobScheduling':
        ({ history, result } = runJobScheduling([...problem]));
        break;
      
      case 'fractionalKnapsack':
        ({ history, result } = runFractionalKnapsack({ ...problem }));
        break;
      
      case 'activitySelection':
        ({ history, result } = runActivitySelection([...problem]));
        break;
      
      case 'intervalColoring':
        ({ history, result } = runIntervalColoring([...problem]));
        break;
      
      case 'maxSubArray':
        ({ history, result } = runMaxSubArray([...problem]));
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

  // Run job scheduling algorithm
  const runJobScheduling = (jobs) => {
    const history = [];
    const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
    const maxDeadline = Math.max(...jobs.map(job => job.deadline));
    const result = Array(maxDeadline).fill(null);
    const slot = Array(maxDeadline).fill(false);
    
    history.push({
      step: 'Sort jobs by profit in descending order',
      jobs: [...sortedJobs],
      highlightedLines: [1, 2],
      explanation: 'First, we sort all jobs by their profit in descending order to prioritize the most profitable jobs.'
    });
    
    for (let i = 0; i < sortedJobs.length; i++) {
      const job = sortedJobs[i];
      history.push({
        step: `Consider job ${job.id} with profit ${job.profit}`,
        jobs: [...sortedJobs],
        currentJob: job,
        result: [...result],
        slot: [...slot],
        highlightedLines: [4, 5],
        explanation: `Considering job ${job.id} with profit ${job.profit} and deadline ${job.deadline}.`
      });
      
      for (let j = Math.min(maxDeadline - 1, job.deadline - 1); j >= 0; j--) {
        if (!slot[j]) {
          result[j] = job;
          slot[j] = true;
          history.push({
            step: `Schedule job ${job.id} at time slot ${j}`,
            jobs: [...sortedJobs],
            currentJob: job,
            result: [...result],
            slot: [...slot],
            highlightedLines: [6, 7, 8],
            explanation: `Found a free slot at time ${j} and scheduled job ${job.id}.`
          });
          break;
        }
      }
    }
    
    const finalResult = result.filter(job => job !== null);
    history.push({
      step: 'Final schedule',
      jobs: [...sortedJobs],
      result: [...result],
      slot: [...slot],
      highlightedLines: [10],
      explanation: `Final schedule with ${finalResult.length} jobs and total profit: ${finalResult.reduce((sum, job) => sum + job.profit, 0)}.`
    });
    
    return { history, result: finalResult };
  };

  // Run fractional knapsack algorithm
  const runFractionalKnapsack = (problem) => {
    const history = [];
    const { items, capacity } = problem;
    const itemsWithRatio = items.map(item => ({
      ...item,
      ratio: item.value / item.weight
    })).sort((a, b) => b.ratio - a.ratio);
    
    history.push({
      step: 'Sort items by value-to-weight ratio',
      items: [...itemsWithRatio],
      capacity,
      highlightedLines: [1, 2],
      explanation: 'First, we sort all items by their value-to-weight ratio in descending order to prioritize the most valuable items per unit weight.'
    });
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    const result = [];
    
    for (let i = 0; i < itemsWithRatio.length; i++) {
      const item = itemsWithRatio[i];
      history.push({
        step: `Consider item ${item.id} with ratio ${item.ratio.toFixed(2)}`,
        items: [...itemsWithRatio],
        currentItem: item,
        remainingCapacity,
        result: [...result],
        highlightedLines: [4, 5],
        explanation: `Considering item ${item.id} with value ${item.value} and weight ${item.weight}.`
      });
      
      if (remainingCapacity >= item.weight) {
        result.push({ ...item, fraction: 1 });
        totalValue += item.value;
        remainingCapacity -= item.weight;
        history.push({
          step: `Take whole item ${item.id}`,
          items: [...itemsWithRatio],
          currentItem: item,
          remainingCapacity,
          result: [...result],
          highlightedLines: [6, 7, 8],
          explanation: `Taking the whole item ${item.id} as it fits in the remaining capacity.`
        });
      } else if (remainingCapacity > 0) {
        const fraction = remainingCapacity / item.weight;
        result.push({ ...item, fraction });
        totalValue += item.value * fraction;
        remainingCapacity = 0;
        history.push({
          step: `Take ${(fraction * 100).toFixed(1)}% of item ${item.id}`,
          items: [...itemsWithRatio],
          currentItem: item,
          remainingCapacity,
          result: [...result],
          highlightedLines: [9, 10, 11],
          explanation: `Taking ${(fraction * 100).toFixed(1)}% of item ${item.id} to fill the remaining capacity.`
        });
        break;
      }
    }
    
    history.push({
      step: 'Final selection',
      items: [...itemsWithRatio],
      result: [...result],
      totalValue,
      highlightedLines: [13],
      explanation: `Final selection with total value: ${totalValue.toFixed(2)}.`
    });
    
    return { history, result: { result, totalValue } };
  };

  // Run activity selection algorithm
  const runActivitySelection = (activities) => {
    const history = [];
    const sortedActivities = [...activities].sort((a, b) => a.finish - b.finish);
    
    history.push({
      step: 'Sort activities by finish time',
      activities: [...sortedActivities],
      highlightedLines: [1, 2],
      explanation: 'First, we sort all activities by their finish time in ascending order to prioritize activities that end early.'
    });
    
    const selected = [sortedActivities[0]];
    let lastSelected = 0;
    
    history.push({
      step: `Select first activity ${sortedActivities[0].id}`,
      activities: [...sortedActivities],
      selected: [...selected],
      highlightedLines: [4],
      explanation: `Selecting the first activity ${sortedActivities[0].id} as it ends earliest.`
    });
    
    for (let i = 1; i < sortedActivities.length; i++) {
      const activity = sortedActivities[i];
      history.push({
        step: `Consider activity ${activity.id}`,
        activities: [...sortedActivities],
        currentActivity: activity,
        selected: [...selected],
        highlightedLines: [6, 7],
        explanation: `Considering activity ${activity.id} with start time ${activity.start} and finish time ${activity.finish}.`
      });
      
      if (activity.start >= sortedActivities[lastSelected].finish) {
        selected.push(activity);
        lastSelected = i;
        history.push({
          step: `Select activity ${activity.id}`,
          activities: [...sortedActivities],
          currentActivity: activity,
          selected: [...selected],
          highlightedLines: [8, 9],
          explanation: `Selecting activity ${activity.id} as it starts after the last selected activity finishes.`
        });
      } else {
        history.push({
          step: `Skip activity ${activity.id}`,
          activities: [...sortedActivities],
          currentActivity: activity,
          selected: [...selected],
          highlightedLines: [10],
          explanation: `Skipping activity ${activity.id} as it overlaps with the last selected activity.`
        });
      }
    }
    
    history.push({
      step: 'Final selection',
      activities: [...sortedActivities],
      selected: [...selected],
      highlightedLines: [12],
      explanation: `Final selection with ${selected.length} non-overlapping activities.`
    });
    
    return { history, result: selected };
  };

  // Run interval coloring algorithm
  const runIntervalColoring = (intervals) => {
    const history = [];
    const events = [];
    intervals.forEach(interval => {
      events.push({ time: interval.start, type: 'start', id: interval.id });
      events.push({ time: interval.end, type: 'end', id: interval.id });
    });
    events.sort((a, b) => a.time - b.time);
    
    history.push({
      step: 'Create and sort events',
      intervals: [...intervals],
      events: [...events],
      highlightedLines: [1, 2, 3],
      explanation: 'First, we create events for the start and end times of each interval and sort them chronologically.'
    });
    
    const colors = new Set();
    const assignedColors = new Map();
    let maxRooms = 0;
    
    events.forEach(event => {
      history.push({
        step: `Process ${event.type} event for interval ${event.id}`,
        intervals: [...intervals],
        events: [...events],
        currentEvent: event,
        colors: [...colors],
        assignedColors: [...assignedColors],
        maxRooms,
        highlightedLines: [5, 6],
        explanation: `Processing ${event.type} event for interval ${event.id} at time ${event.time}.`
      });
      
      if (event.type === 'start') {
        let color = 0;
        while (colors.has(color)) {
          color++;
        }
        colors.add(color);
        assignedColors.set(event.id, color);
        maxRooms = Math.max(maxRooms, colors.size);
        history.push({
          step: `Assign color ${color} to interval ${event.id}`,
          intervals: [...intervals],
          events: [...events],
          currentEvent: event,
          colors: [...colors],
          assignedColors: [...assignedColors],
          maxRooms,
          highlightedLines: [7, 8, 9],
          explanation: `Assigned color ${color} to interval ${event.id}. Current rooms: ${colors.size}.`
        });
      } else {
        const color = assignedColors.get(event.id);
        colors.delete(color);
        history.push({
          step: `Free color ${color} from interval ${event.id}`,
          intervals: [...intervals],
          events: [...events],
          currentEvent: event,
          colors: [...colors],
          assignedColors: [...assignedColors],
          maxRooms,
          highlightedLines: [10, 11],
          explanation: `Freed color ${color} from interval ${event.id}. Current rooms: ${colors.size}.`
        });
      }
    });
    
    history.push({
      step: 'Final coloring',
      intervals: [...intervals],
      events: [...events],
      colors: [...colors],
      assignedColors: [...assignedColors],
      maxRooms,
      highlightedLines: [13],
      explanation: `Final coloring uses ${maxRooms} colors to color all intervals without overlap.`
    });
    
    return { history, result: { colors: Object.fromEntries(assignedColors), maxRooms } };
  };
  
  // Run maximum subarray algorithm
  const runMaxSubArray = (nums) => {
    const history = [];
    
    history.push({
      step: 'Initialize',
      nums: [...nums],
      curSum: nums[0],
      maxSum: nums[0],
      currentIndex: 0,
      bestStartIndex: 0,
      bestEndIndex: 0,
      highlightedLines: [1, 2],
      explanation: 'Initialize current sum and maximum sum with the first element of the array.'
    });
    
    let curSum = nums[0];
    let maxSum = nums[0];
    let startIndex = 0;
    let bestStartIndex = 0;
    let bestEndIndex = 0;
    
    for (let i = 1; i < nums.length; i++) {
      history.push({
        step: `Consider element at index ${i}`,
        nums: [...nums],
        curSum,
        maxSum,
        currentIndex: i,
        bestStartIndex,
        bestEndIndex,
        highlightedLines: [4, 5],
        explanation: `Considering element ${nums[i]} at index ${i}. Current sum is ${curSum}.`
      });
      
      if (curSum < 0) {
        curSum = nums[i];
        startIndex = i;
        history.push({
          step: `Reset current sum`,
          nums: [...nums],
          curSum,
          maxSum,
          currentIndex: i,
          startIndex,
          bestStartIndex,
          bestEndIndex,
          highlightedLines: [6, 7],
          explanation: `Current sum is negative (${curSum < 0 ? curSum : 0}), so we reset it to the current element ${nums[i]} and start a new subarray from index ${i}.`
        });
      } else {
        curSum += nums[i];
        history.push({
          step: `Add to current sum`,
          nums: [...nums],
          curSum,
          maxSum,
          currentIndex: i,
          startIndex,
          bestStartIndex,
          bestEndIndex,
          highlightedLines: [8, 9],
          explanation: `Current sum is non-negative, so we add the current element ${nums[i]} to it. New current sum is ${curSum}.`
        });
      }
      
      if (curSum > maxSum) {
        maxSum = curSum;
        bestStartIndex = startIndex;
        bestEndIndex = i;
        history.push({
          step: `Update maximum sum`,
          nums: [...nums],
          curSum,
          maxSum,
          currentIndex: i,
          startIndex,
          bestStartIndex,
          bestEndIndex,
          highlightedLines: [10, 11],
          explanation: `Current sum ${curSum} is greater than maximum sum ${maxSum < curSum ? maxSum : curSum}, so we update maximum sum to ${curSum} and the best subarray to indices [${startIndex}...${i}].`
        });
      }
    }
    
    history.push({
      step: 'Final result',
      nums: [...nums],
      curSum,
      maxSum,
      bestStartIndex,
      bestEndIndex,
      highlightedLines: [13],
      explanation: `The maximum subarray sum is ${maxSum}, found in the subarray from index ${bestStartIndex} to ${bestEndIndex}.`
    });
    
    return { history, result: { maxSum, bestStartIndex, bestEndIndex } };
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
    
    // Update visualization based on current step
    drawProblem(historyItem);
    
    // Calculate delay based on speed (inverted: higher speed = lower delay)
    const delay = 1000 - (speed * 10);
    
    // Schedule next animation frame
    animationRef.current = setTimeout(() => {
      animateAlgorithm(step + 1, history);
    }, delay);
  };

  // Add prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, greedyPrompts.length - 1));
  };
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  };

  return (
    <VisualizerLayout
      title="Greedy Algorithm Visualizer"
      prompts={greedyPrompts}
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

export default GreedyVisualizer;