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
  Card,
  CardContent,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipNext,
  RestartAlt,
  Info as InfoIcon
} from '@mui/icons-material';
import CodeHighlighter from '../components/CodeHighlighter';
import PromptSystem from '../components/PromptSystem';
import VisualizerControls from '../components/VisualizerControls';
import VisualizerLayout from '../components/VisualizerLayout';

const DynamicProgrammingVisualizer = () => {
  // State variables
  const [algorithm, setAlgorithm] = useState('fibonacci');
  const [problemSize, setProblemSize] = useState(10);
  const [speed, setSpeed] = useState(50);
  const [customInput, setCustomInput] = useState('');
  const [problem, setProblem] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [algorithmHistory, setAlgorithmHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [result, setResult] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(300);
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Prompt system
  const [showPrompts, setShowPrompts] = useState(false);
  const [promptStep, setPromptStep] = useState(0);
  
  // Dynamic Programming algorithm prompts
  const dpPrompts = [
    {
      title: 'Welcome to Dynamic Programming Algorithm Visualizer',
      content: 'This tool helps you understand how dynamic programming algorithms work by visualizing the process step by step. Dynamic programming solves complex problems by breaking them down into simpler subproblems and storing their solutions to avoid redundant calculations.'
    },
    {
      title: 'Select an Algorithm',
      content: 'Choose a specific algorithm to visualize. Each algorithm demonstrates a different application of the dynamic programming technique.'
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
      content: 'Dynamic programming is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable when subproblems overlap and have optimal substructure properties.'
    }
  ];
  
  // Code snippets for each dynamic programming algorithm
  const codeSnippets = {
    fibonacci: `// Fibonacci Sequence using Dynamic Programming
function fibonacci(n) {
  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  // Create array to store calculated values
  const dp = new Array(n + 1);
  
  // Initialize base cases
  dp[0] = 0;
  dp[1] = 1;
  
  // Fill the dp array
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`,
    
    knapsack: `// 0/1 Knapsack Problem using Dynamic Programming
function knapsack(weights, values, capacity) {
  const n = weights.length;
  
  // Create a 2D array for memoization
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));
  
  // Fill the dp table
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // If current item is too heavy, skip it
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w]; // Take value without current item
      } else {
        // Max of (excluding current item) or (including current item)
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }
    }
  }
  
  return dp[n][capacity];
}`,

    lcs: `// Longest Common Subsequence
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // Create a 2D array for memoization
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));
  
  // Fill the dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        // If characters match, add 1 to diagonal value
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Take maximum of left or top value
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,

    coinChange: `// Coin Change Problem
function coinChange(coins, amount) {
  // Initialize dp array with Infinity
  const dp = Array(amount + 1).fill(Infinity);
  
  // Base case: 0 coins needed to make amount 0
  dp[0] = 0;
  
  // Fill the dp array
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      // Minimum of current way or 1 + way to make (i - coin)
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,

    editDistance: `// Edit Distance (Levenshtein Distance)
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  
  // Create a 2D array for memoization
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // To convert to empty string, delete all characters
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // To convert from empty string, insert all characters
  }
  
  // Fill the dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // If characters match, no operation needed
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Minimum of insert, delete, or replace
        dp[i][j] = 1 + Math.min(
          dp[i][j - 1],      // Insert
          dp[i - 1][j],      // Delete
          dp[i - 1][j - 1]   // Replace
        );
      }
    }
  }
  
  return dp[m][n];
}`
  };
  
  // Algorithm complexity information
  const algorithmInfo = {
    fibonacci: {
      name: 'Fibonacci Sequence',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(n)',
      description: 'The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones. Dynamic programming allows us to compute Fibonacci numbers efficiently by storing previously calculated values.'
    },
    knapsack: {
      name: '0/1 Knapsack Problem',
      timeComplexity: {
        best: 'O(n * W)',
        average: 'O(n * W)',
        worst: 'O(n * W)'
      },
      spaceComplexity: 'O(n * W)',
      description: 'The Knapsack problem involves selecting items with weights and values to maximize total value while staying within a weight capacity. The 0/1 variant means each item can either be taken completely or not at all.'
    },
    lcs: {
      name: 'Longest Common Subsequence',
      timeComplexity: {
        best: 'O(m * n)',
        average: 'O(m * n)',
        worst: 'O(m * n)'
      },
      spaceComplexity: 'O(m * n)',
      description: 'Finds the longest subsequence common to two sequences. A subsequence is a sequence that appears in the same relative order but not necessarily consecutive.'
    },
    coinChange: {
      name: 'Coin Change Problem',
      timeComplexity: {
        best: 'O(n * amount)',
        average: 'O(n * amount)',
        worst: 'O(n * amount)'
      },
      spaceComplexity: 'O(amount)',
      description: 'Determines the minimum number of coins needed to make a given amount of money, given a set of coin denominations.'
    },
    editDistance: {
      name: 'Edit Distance',
      timeComplexity: {
        best: 'O(m * n)',
        average: 'O(m * n)',
        worst: 'O(m * n)'
      },
      spaceComplexity: 'O(m * n)',
      description: 'Measures the minimum number of operations (insert, delete, replace) required to convert one string into another.'
    }
  };

  // Helper functions for algorithm states and data visualization
  const getAvailableAlgorithms = () => {
    return ['fibonacci', 'knapsack', 'lcs', 'coinChange', 'editDistance'];
  };

  // Get custom input placeholder based on algorithm
  const getCustomInputPlaceholder = () => {
    switch (algorithm) {
      case 'fibonacci':
        return "Enter a number (e.g., 10)";
      case 'knapsack':
        return "weights,values,capacity (e.g., [1,2,3],[4,5,6],5)";
      case 'lcs':
        return "Enter two strings separated by comma (e.g., abcde,ace)";
      case 'coinChange':
        return "coins,amount (e.g., [1,2,5],11)";
      case 'editDistance':
        return "Enter two strings separated by comma (e.g., horse,ros)";
      default:
        return "Enter input";
    }
  };

  // Generate a random problem based on selected algorithm
  const generateRandomProblem = () => {
    // Reset visualization state
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setAlgorithmHistory([]);
    setExplanation('');
    setHighlightedLines([]);
    setResult(null);
    
    let newProblem;

    // Generate problem based on algorithm
    switch (algorithm) {
      case 'fibonacci':
        // For Fibonacci, the problem is just n
        newProblem = Math.min(Math.max(5, problemSize), 30);
        break;

      case 'knapsack':
        newProblem = generateKnapsackProblem();
        break;

      case 'lcs':
        newProblem = generateLCSProblem();
        break;

      case 'coinChange':
        newProblem = generateCoinChangeProblem();
        break;

      case 'editDistance':
        newProblem = generateEditDistanceProblem();
        break;

      default:
        console.error('Unknown algorithm:', algorithm);
        return;
    }

    setProblem(newProblem);

    // Clear the canvas and draw the initial problem state
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the initial problem state based on algorithm
      switch (algorithm) {
        case 'fibonacci':
          drawFibonacci({ n: newProblem, current: 0, dp: [] });
          break;
          
        case 'knapsack':
          drawKnapsack({
            weights: newProblem.weights,
            values: newProblem.values,
            capacity: newProblem.capacity,
            dp: []
          });
          break;
          
        case 'lcs':
          drawLCS({
            text1: newProblem.text1,
            text2: newProblem.text2,
            dp: []
          });
          break;
          
        case 'coinChange':
          drawCoinChange({
            coins: newProblem.coins,
            amount: newProblem.amount,
            dp: []
          });
          break;
          
        case 'editDistance':
          drawEditDistance({
            word1: newProblem.word1,
            word2: newProblem.word2,
            dp: []
          });
          break;
          
        default:
          break;
      }
    }
  };

  // Problem generation helper functions
  const generateKnapsackProblem = () => {
    // Generate random weights, values, and capacity
    const items = Math.max(5, Math.min(10, 15)); // Limit to 15 items for visualization
    const weights = Array.from({ length: items }, () => Math.floor(Math.random() * 10) + 1);
    const values = Array.from({ length: items }, () => Math.floor(Math.random() * 20) + 5);
    const capacity = Math.floor(Math.random() * 30) + 10;
    return { weights, values, capacity };
  };
  
  const generateLCSProblem = () => {
    // Generate two random strings
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const length1 = Math.max(5, Math.min(10, 15));
    const length2 = Math.max(5, Math.min(10, 15));
    
    const text1 = Array.from(
      { length: length1 }, 
      () => alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join('');
    
    const text2 = Array.from(
      { length: length2 }, 
      () => alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join('');
    
    return { text1, text2 };
  };
  
  const generateCoinChangeProblem = () => {
    // Generate random coins and amount
    const numCoins = Math.min(10, 5); // Limit to 5 different coin values
    const coins = [];
    // Ensure we have coin value 1 to guarantee solution
    coins.push(1);
    
    // Add other coin values
    for (let i = 1; i < numCoins; i++) {
      let coinValue;
      do {
        coinValue = Math.floor(Math.random() * 15) + 2;
      } while (coins.includes(coinValue));
      coins.push(coinValue);
    }
    
    // Sort coins
    coins.sort((a, b) => a - b);
    
    // Generate a reasonable amount
    const amount = Math.floor(Math.random() * 30) + 10;
    
    return { coins, amount };
  };
  
  const generateEditDistanceProblem = () => {
    // Generate two random strings
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const len1 = Math.max(5, Math.min(10, 10));
    const len2 = Math.max(5, Math.min(10, 10));
    
    const word1 = Array.from(
      { length: len1 }, 
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    
    const word2 = Array.from(
      { length: len2 }, 
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    
    return { word1, word2 };
  };

  // Handle custom input
  const handleCustomInput = () => {
    if (!customInput) {
      alert('Please enter a valid input');
      return;
    }
    
    // Reset visualization state before applying new input
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setAlgorithmHistory([]);
    setExplanation('');
    setHighlightedLines([]);
    setResult(null);
    
    let newProblem;
    
    try {
      switch (algorithm) {
        case 'fibonacci':
          // Parse int
          const n = parseInt(customInput);
          if (isNaN(n) || n < 1 || n > 30) {
            alert('Please enter a valid number between 1 and 30');
            return;
          }
          newProblem = n;
          break;
          
        case 'knapsack':
          // Parse weights, values, capacity
          const knapsackMatch = customInput.match(/\[(.*?)\],\[(.*?)\],(\d+)/);
          if (!knapsackMatch) {
            alert('Please enter valid input in the format [weights],[values],capacity');
            return;
          }
          
          const weights = knapsackMatch[1].split(',').map(w => parseInt(w.trim()));
          const values = knapsackMatch[2].split(',').map(v => parseInt(v.trim()));
          const capacity = parseInt(knapsackMatch[3]);
          
          if (weights.some(isNaN) || values.some(isNaN) || isNaN(capacity) || weights.length !== values.length) {
            alert('Please enter valid weights, values, and capacity');
            return;
          }
          
          newProblem = { weights, values, capacity };
          break;
          
        case 'lcs':
          // Parse two strings
          const lcsStrings = customInput.split(',');
          if (lcsStrings.length !== 2) {
            alert('Please enter two strings separated by a comma');
            return;
          }
          
          const [text1, text2] = lcsStrings.map(s => s.trim());
          if (!text1 || !text2) {
            alert('Please enter non-empty strings');
            return;
          }
          
          newProblem = { text1, text2 };
          break;
          
        case 'coinChange':
          // Parse coins array and amount
          const coinMatch = customInput.match(/\[(.*?)\],(\d+)/);
          if (!coinMatch) {
            alert('Please enter valid input in the format [coins],amount');
            return;
          }
          
          const coins = coinMatch[1].split(',').map(c => parseInt(c.trim()));
          const amount = parseInt(coinMatch[2]);
          
          if (coins.some(isNaN) || isNaN(amount)) {
            alert('Please enter valid coins and amount');
            return;
          }
          
          newProblem = { coins, amount };
          break;
          
        case 'editDistance':
          // Parse two strings
          const edStrings = customInput.split(',');
          if (edStrings.length !== 2) {
            alert('Please enter two strings separated by a comma');
            return;
          }
          
          const [word1, word2] = edStrings.map(s => s.trim());
          if (word1 === undefined || word2 === undefined) {
            alert('Please enter two valid strings');
            return;
          }
          
          newProblem = { word1, word2 };
          break;
          
        default:
          alert('Invalid algorithm selected');
          return;
      }
      
      setProblem(newProblem);
      
      // Clear the canvas and draw the initial problem state
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the initial problem state based on algorithm
        switch (algorithm) {
          case 'fibonacci':
            drawFibonacci({ n: newProblem, current: 0, dp: [] });
            break;
            
          case 'knapsack':
            drawKnapsack({
              weights: newProblem.weights,
              values: newProblem.values,
              capacity: newProblem.capacity,
              dp: []
            });
            break;
            
          case 'lcs':
            drawLCS({
              text1: newProblem.text1,
              text2: newProblem.text2,
              dp: []
            });
            break;
            
          case 'coinChange':
            drawCoinChange({
              coins: newProblem.coins,
              amount: newProblem.amount,
              dp: []
            });
            break;
            
          case 'editDistance':
            drawEditDistance({
              word1: newProblem.word1,
              word2: newProblem.word2,
              dp: []
            });
            break;
            
          default:
            break;
        }
      }
    } catch (error) {
      console.error('Error processing custom input:', error);
      alert('Error processing input. Please check format and try again.');
    }
  };

  // Prompt system handlers
  const handleNextPrompt = () => {
    setPromptStep(prev => Math.min(prev + 1, dpPrompts.length - 1));
  };
  
  const handlePreviousPrompt = () => {
    setPromptStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleFinishPrompts = () => {
    setShowPrompts(false);
  };

  // Initialize component
  useEffect(() => {
    generateRandomProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  // Run the selected algorithm
  const runAlgorithm = () => {
    if (!problem) {
      alert('Please generate a problem first');
      return;
    }
    
    // Reset any previous animation state
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset animation state
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(0);
    setExplanation('');
    setHighlightedLines([]);
    
    // Generate algorithm history and determine result
    const history = [];
    let algorithmResult;
    
    switch (algorithm) {
      case 'fibonacci':
        algorithmResult = runFibonacci(problem, history);
        break;
      case 'knapsack':
        algorithmResult = runKnapsack(problem.weights, problem.values, problem.capacity, history);
        break;
      case 'lcs':
        algorithmResult = runLCS(problem.text1, problem.text2, history);
        break;
      case 'coinChange':
        algorithmResult = runCoinChange(problem.coins, problem.amount, history);
        break;
      case 'editDistance':
        algorithmResult = runEditDistance(problem.word1, problem.word2, history);
        break;
      default:
        console.error('Invalid algorithm:', algorithm);
        return;
    }
    
    setAlgorithmHistory(history);
    setTotalSteps(history.length);
    setResult(algorithmResult);
    
    // Draw the initial state
    const firstStep = history[0];
    if (firstStep) {
      setExplanation(firstStep.explanation || '');
      setHighlightedLines(firstStep.highlightedLines || []);
      drawProblem(firstStep);
    }
    
    // Start animation after a short delay
    setTimeout(() => {
      if (!isPaused) {
        animateAlgorithm(0, history);
      }
    }, 500);
  };

  // Animate algorithm execution
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

  // Run Fibonacci algorithm with history tracking
  const runFibonacci = (n, history) => {
    // Base cases
    if (n <= 0) {
      history.push({
        step: 1,
        n,
        dp: [0],
        explanation: `For n = ${n}, the result is 0 (base case).`,
        highlightedLines: [2, 3],
        result: 0
      });
      return 0;
    }
    
    if (n === 1) {
      history.push({
        step: 1,
        n,
        dp: [0, 1],
        explanation: `For n = ${n}, the result is 1 (base case).`,
        highlightedLines: [4, 5],
        result: 1
      });
      return 1;
    }
    
    // Create DP array and initialize base cases
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    history.push({
      step: 1,
      n,
      dp: [...dp],
      currentIndex: null,
      explanation: `Initialize dp array with base cases: dp[0] = 0, dp[1] = 1`,
      highlightedLines: [8, 11, 12]
    });
    
    // Fill the dp array
    for (let i = 2; i <= n; i++) {
      history.push({
        step: history.length + 1,
        n,
        dp: [...dp],
        currentIndex: i,
        explanation: `Calculate dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]}`,
        highlightedLines: [15, 16]
      });
      
      dp[i] = dp[i - 1] + dp[i - 2];
      
      history.push({
        step: history.length + 1,
        n,
        dp: [...dp],
        currentIndex: i,
        explanation: `Set dp[${i}] = ${dp[i]}`,
        highlightedLines: [16]
      });
    }
    
    // Return final result
    history.push({
      step: history.length + 1,
      n,
      dp: [...dp],
      currentIndex: null,
      explanation: `Return the final result: dp[${n}] = ${dp[n]}`,
      highlightedLines: [19],
      result: dp[n]
    });
    
    return dp[n];
  };

  // Draw the current problem based on the algorithm
  const drawProblem = (historyItem) => {
    if (!historyItem) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate required canvas size based on algorithm and problem
    let requiredWidth = 800;
    let requiredHeight = 300;
    
    // Determine the required size based on the algorithm and problem data
    switch (algorithm) {
      case 'knapsack':
        if (historyItem.weights) {
          const capacity = historyItem.capacity || 0;
          const items = historyItem.weights.length || 0;
          // For knapsack, width depends on capacity, height on number of items
          requiredWidth = Math.max(800, 220 + (Math.min(capacity + 1, 15) * 35) + 50);
          requiredHeight = Math.max(300, 80 + (items * 40) + 150);
        }
        break;
        
      case 'lcs':
        if (historyItem.text1 && historyItem.text2) {
          const m = historyItem.text1.length || 0;
          const n = historyItem.text2.length || 0;
          // For LCS, size depends on string lengths
          const cellSize = Math.max(25, Math.min(40, Math.floor((800 - 100) / (n + 2))));
          requiredWidth = Math.max(800, 100 + ((n + 1) * cellSize) + 50);
          requiredHeight = Math.max(300, 120 + ((m + 1) * cellSize) + 100);
        }
        break;
        
      case 'editDistance':
        if (historyItem.word1 && historyItem.word2) {
          const m = historyItem.word1.length || 0;
          const n = historyItem.word2.length || 0;
          // For Edit Distance, size depends on string lengths
          const cellSize = Math.max(25, Math.min(40, Math.floor((800 - 100) / (n + 2))));
          requiredWidth = Math.max(800, 100 + ((n + 1) * cellSize) + 50);
          requiredHeight = Math.max(300, 120 + ((m + 1) * cellSize) + 100);
        }
        break;
        
      case 'coinChange':
        if (historyItem.coins && historyItem.amount) {
          const amount = historyItem.amount || 0;
          // For Coin Change, width depends on amount
          requiredWidth = Math.max(800, 100 + (Math.min(amount + 1, 20) * 40) + 50);
          requiredHeight = Math.max(300, 150 + 150);
        }
        break;
        
      case 'fibonacci':
      default:
        if (historyItem.n) {
          const n = historyItem.n || 0;
          // For Fibonacci, width depends on n
          const cellSize = Math.min(50, Math.floor((800 - 40) / (n + 1)));
          requiredWidth = Math.max(800, 40 + ((n + 1) * cellSize) + 40);
          requiredHeight = 300; // Default height is usually sufficient
        }
        break;
    }
    
    // Update canvas size if needed
    if (requiredWidth !== canvasWidth || requiredHeight !== canvasHeight) {
      setCanvasWidth(requiredWidth);
      setCanvasHeight(requiredHeight);
      canvas.width = requiredWidth;
      canvas.height = requiredHeight;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (algorithm) {
      case 'fibonacci':
        drawFibonacci(historyItem);
        break;
      case 'knapsack':
        drawKnapsack(historyItem);
        break;
      case 'lcs':
        drawLCS(historyItem);
        break;
      case 'coinChange':
        drawCoinChange(historyItem);
        break;
      case 'editDistance':
        drawEditDistance(historyItem);
        break;
      default:
        break;
    }
  };

  // Helper function to draw legend
  const drawLegend = (ctx, items) => {
    const legendX = ctx.canvas.width - 180;
    const legendY = 30;
    const spacing = 25;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(legendX - 10, legendY - 20, 180, items.length * spacing + 20);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 20, 180, items.length * spacing + 20);
    
    items.forEach((item, index) => {
      const y = legendY + index * spacing;
      
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 15);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 25, y + 12);
    });
  };

  // Draw Fibonacci visualization
  const drawFibonacci = (historyItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Extract data from historyItem
    const { n, dp, currentIndex, result } = historyItem;
    
    if (!n) {
      // Draw initial instruction
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click Run Algorithm to start the visualization', width / 2, height / 2);
      return;
    }
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Fibonacci Sequence (n = ${n})`, width / 2, 30);
    
    // Draw Fibonacci array
    const arrayWidth = Math.min(600, width - 40);
    const cellSize = Math.min(50, arrayWidth / (n + 1));
    const arrayX = (width - cellSize * (n + 1)) / 2;
    const arrayY = 100;
    
    // Draw array cells
    for (let i = 0; i <= n; i++) {
      let cellColor = '#f5f5f5';
      
      if (dp && dp[i] !== undefined) {
        cellColor = '#e3f2fd';  // Filled cells
      }
      
      if (currentIndex !== undefined && i === currentIndex) {
        cellColor = '#ffecb3';  // Current cell
      }
      
      // Draw cell box
      ctx.fillStyle = cellColor;
      ctx.fillRect(arrayX + i * cellSize, arrayY, cellSize, cellSize);
      ctx.strokeStyle = '#bdbdbd';
      ctx.lineWidth = 1;
      ctx.strokeRect(arrayX + i * cellSize, arrayY, cellSize, cellSize);
      
      // Draw index below cell
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i, arrayX + i * cellSize + cellSize / 2, arrayY + cellSize + 20);
      
      // Draw value if computed
      if (dp && dp[i] !== undefined) {
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(dp[i], arrayX + i * cellSize + cellSize / 2, arrayY + cellSize / 2 + 5);
      }
    }
    
    // Draw calculation if applicable
    if (currentIndex !== undefined && currentIndex >= 2) {
      const calcY = arrayY + cellSize + 50;
      
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      
      if (dp) {
        ctx.fillText(
          `dp[${currentIndex}] = dp[${currentIndex - 1}] + dp[${currentIndex - 2}] = ${dp[currentIndex - 1]} + ${dp[currentIndex - 2]} = ${dp[currentIndex]}`,
          width / 2,
          calcY
        );
      }
    }
    
    // Draw result if available
    if (result !== undefined) {
      const resultY = arrayY + cellSize + 100;
      
      ctx.fillStyle = '#1565c0';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Result: fibonacci(${n}) = ${result}`, width / 2, resultY);
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#f5f5f5', label: 'Empty cell' },
      { color: '#e3f2fd', label: 'Filled cell' },
      { color: '#ffecb3', label: 'Current cell' }
    ]);
  };

  // Draw Knapsack visualization
  const drawKnapsack = (historyItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Extract data from historyItem
    const { weights, values, capacity, dp, currentI, currentW, comparing, result } = historyItem;
    
    if (!weights || !values) {
      // Draw initial instruction
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click Run Algorithm to start the visualization', width / 2, height / 2);
      return;
    }
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`0/1 Knapsack Problem (Capacity: ${capacity})`, width / 2, 30);
    
    // Draw items information
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Items: ${weights.length}`, 20, 60);
    
    // Draw items table
    const itemCellWidth = 60;
    const itemCellHeight = 40;
    const itemTableX = 20;
    const itemTableY = 80;
    
    // Draw table headers
    ctx.fillStyle = '#333';
    ctx.fillRect(itemTableX, itemTableY, itemCellWidth, itemCellHeight);
    ctx.fillRect(itemTableX + itemCellWidth, itemTableY, itemCellWidth, itemCellHeight);
    ctx.fillRect(itemTableX + itemCellWidth * 2, itemTableY, itemCellWidth, itemCellHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Item #', itemTableX + itemCellWidth / 2, itemTableY + itemCellHeight / 2 + 5);
    ctx.fillText('Weight', itemTableX + itemCellWidth * 1.5, itemTableY + itemCellHeight / 2 + 5);
    ctx.fillText('Value', itemTableX + itemCellWidth * 2.5, itemTableY + itemCellHeight / 2 + 5);
    
    // Draw items data
    for (let i = 0; i < weights.length; i++) {
      let rowColor = '#f5f5f5';
      
      if (currentI !== undefined && i === currentI - 1) {
        rowColor = '#fff9c4'; // Highlight current item
      }
      
      ctx.fillStyle = rowColor;
      ctx.fillRect(itemTableX, itemTableY + (i + 1) * itemCellHeight, itemCellWidth, itemCellHeight);
      ctx.fillRect(itemTableX + itemCellWidth, itemTableY + (i + 1) * itemCellHeight, itemCellWidth, itemCellHeight);
      ctx.fillRect(itemTableX + itemCellWidth * 2, itemTableY + (i + 1) * itemCellHeight, itemCellWidth, itemCellHeight);
      
      ctx.strokeStyle = '#bdbdbd';
      ctx.lineWidth = 1;
      ctx.strokeRect(itemTableX, itemTableY + (i + 1) * itemCellHeight, itemCellWidth, itemCellHeight);
      ctx.strokeRect(itemTableX + itemCellWidth, itemTableY + (i + 1) * itemCellHeight, itemCellWidth, itemCellHeight);
      ctx.strokeRect(itemTableX + itemCellWidth * 2, itemTableY + (i + 1) * itemCellHeight, itemCellWidth, itemCellHeight);
      
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, itemTableX + itemCellWidth / 2, itemTableY + (i + 1.5) * itemCellHeight);
      ctx.fillText(`${weights[i]}`, itemTableX + itemCellWidth * 1.5, itemTableY + (i + 1.5) * itemCellHeight);
      ctx.fillText(`${values[i]}`, itemTableX + itemCellWidth * 2.5, itemTableY + (i + 1.5) * itemCellHeight);
    }
    
    // Draw DP table if available
    if (dp) {
      // Calculate cell size based on capacity
      const maxCols = Math.min(capacity + 1, 15); // Limit columns to prevent overflow
      const dpCellSize = Math.min(35, Math.floor((width - 220) / maxCols));
      const dpTableX = 220;
      const dpTableY = 80;
      
      // Draw table headers
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DP Table', dpTableX + ((maxCols * dpCellSize) / 2), dpTableY - 20);
      
      // Draw weight headers (columns)
      for (let w = 0; w <= Math.min(capacity, maxCols - 1); w++) {
        ctx.fillStyle = '#333';
        ctx.fillRect(dpTableX + w * dpCellSize, dpTableY, dpCellSize, dpCellSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${w}`, dpTableX + w * dpCellSize + dpCellSize / 2, dpTableY + dpCellSize / 2 + 4);
      }
      
      // Draw item headers (rows)
      for (let i = 0; i <= weights.length; i++) {
        ctx.fillStyle = '#333';
        ctx.fillRect(dpTableX - dpCellSize, dpTableY + i * dpCellSize, dpCellSize, dpCellSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${i}`, dpTableX - dpCellSize / 2, dpTableY + i * dpCellSize + dpCellSize / 2 + 4);
      }
      
      // Draw dp table cells
      for (let i = 0; i <= weights.length; i++) {
        for (let w = 0; w <= Math.min(capacity, maxCols - 1); w++) {
          let cellColor = '#f5f5f5';
          
          // Highlight current cell
          if (currentI === i && currentW === w) {
            cellColor = '#ff9800';
          } 
          // Highlight cells being compared
          else if (comparing && 
                  ((comparing.includes('exclude') && i - 1 === currentI - 1 && w === currentW) ||
                   (comparing.includes('include') && i - 1 === currentI - 1 && w - weights[currentI - 1] === currentW - weights[currentI - 1]))) {
            cellColor = '#4caf50';
          }
          // Highlight filled cells
          else if (dp[i] && dp[i][w] !== undefined) {
            cellColor = '#e3f2fd';
          }
          
          ctx.fillStyle = cellColor;
          ctx.fillRect(dpTableX + w * dpCellSize, dpTableY + i * dpCellSize, dpCellSize, dpCellSize);
          
          ctx.strokeStyle = '#bdbdbd';
          ctx.lineWidth = 1;
          ctx.strokeRect(dpTableX + w * dpCellSize, dpTableY + i * dpCellSize, dpCellSize, dpCellSize);
          
          // Draw cell value if defined
          if (dp[i] && dp[i][w] !== undefined) {
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${dp[i][w]}`, dpTableX + w * dpCellSize + dpCellSize / 2, dpTableY + i * dpCellSize + dpCellSize / 2 + 4);
          }
        }
      }
      
      // If capacity is larger than what we can display, show indication
      if (capacity >= maxCols) {
        ctx.fillStyle = '#333';
        ctx.font = 'italic 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`(table truncated, capacity=${capacity})`, dpTableX, dpTableY + (weights.length + 1) * dpCellSize + 20);
      }
    }
    
    // Display final result if available
    if (result !== undefined) {
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Maximum value: ${result}`, width / 2 - 100, height - 40);
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#f5f5f5', label: 'Empty cell' },
      { color: '#e3f2fd', label: 'Filled cell' },
      { color: '#fff9c4', label: 'Current item' },
      { color: '#ff9800', label: 'Current cell' },
      { color: '#4caf50', label: 'Cells being compared' }
    ]);
  };

  // Run Knapsack with history tracking
  const runKnapsack = (weights, values, capacity, history) => {
    const n = weights.length;
    
    // Create a 2D array for memoization
    const dp = Array(n + 1)
      .fill()
      .map(() => Array(capacity + 1).fill(0));
    
    history.push({
      step: 'Initialize',
      weights,
      values,
      capacity,
      dp: JSON.parse(JSON.stringify(dp)),
      explanation: `Initialize a 2D DP table of size (${n+1} x ${capacity+1}) with zeros.`,
      highlightedLines: [3, 4, 5, 6]
    });
    
    // Fill the dp table
    for (let i = 1; i <= n; i++) {
      const itemIndex = i - 1; // 0-based index for the actual item
      
      history.push({
        step: `Process Item ${i}`,
        weights,
        values,
        capacity,
        dp: JSON.parse(JSON.stringify(dp)),
        currentI: i,
        explanation: `Processing item ${i} with weight ${weights[itemIndex]} and value ${values[itemIndex]}.`,
        highlightedLines: [9, 10]
      });
      
      for (let w = 0; w <= capacity; w++) {
        history.push({
          step: `Subproblem (${i}, ${w})`,
          weights,
          values,
          capacity,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentW: w,
          explanation: `Calculating maximum value for first ${i} items with capacity ${w}.`,
          highlightedLines: [10, 11]
        });
        
        // If current item is too heavy, skip it
        if (weights[itemIndex] > w) {
          history.push({
            step: `Item too heavy`,
            weights,
            values,
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentW: w,
            comparing: ['exclude'],
            explanation: `Item ${i} with weight ${weights[itemIndex]} is too heavy for current capacity ${w}. Exclude it.`,
            highlightedLines: [12, 13, 14]
          });
          
          dp[i][w] = dp[i - 1][w]; // Take value without current item
          
          history.push({
            step: `Set DP[${i}][${w}]`,
            weights,
            values,
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentW: w,
            explanation: `Set dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`,
            highlightedLines: [13]
          });
        } else {
          // Compare including vs excluding current item
          const excludeValue = dp[i - 1][w];
          const includeValue = dp[i - 1][w - weights[itemIndex]] + values[itemIndex];
          
          history.push({
            step: `Compare options`,
            weights,
            values,
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentW: w,
            comparing: ['exclude', 'include'],
            explanation: `Compare:\n1. Exclude item ${i}: dp[${i-1}][${w}] = ${excludeValue}\n2. Include item ${i}: dp[${i-1}][${w-weights[itemIndex]}] + ${values[itemIndex]} = ${includeValue}`,
            highlightedLines: [15, 16, 17, 18, 19, 20]
          });
          
          // Max of (excluding current item) or (including current item)
          dp[i][w] = Math.max(excludeValue, includeValue);
          
          history.push({
            step: `Set DP[${i}][${w}]`,
            weights,
            values,
            capacity,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentW: w,
            explanation: `Set dp[${i}][${w}] = max(${excludeValue}, ${includeValue}) = ${dp[i][w]}`,
            highlightedLines: [19]
          });
        }
      }
    }
    
    // Final result
    history.push({
      step: 'Final Result',
      weights,
      values,
      capacity,
      dp: JSON.parse(JSON.stringify(dp)),
      result: dp[n][capacity],
      explanation: `The maximum value that can be obtained with capacity ${capacity} is ${dp[n][capacity]}.`,
      highlightedLines: [25]
    });
    
    return dp[n][capacity];
  };

  // Draw Longest Common Subsequence visualization
  const drawLCS = (historyItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Extract data from historyItem
    const { text1, text2, dp, currentI, currentJ, comparing, result, lcs } = historyItem;
    
    if (!text1 || !text2) {
      // Draw initial instruction
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click Run Algorithm to start the visualization', width / 2, height / 2);
      return;
    }
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Longest Common Subsequence', width / 2, 30);
    
    // Draw input strings
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`String 1: "${text1}"`, 20, 60);
    ctx.fillText(`String 2: "${text2}"`, 20, 85);
    
    // Draw DP table if available
    if (dp) {
      const m = text1.length;
      const n = text2.length;
      
      // Calculate cell size based on strings length
      const maxCellSize = 40;
      const minCellSize = 25;
      const cellSize = Math.max(minCellSize, Math.min(maxCellSize, Math.floor((width - 100) / (n + 2))));
      
      const tableX = Math.max(50, (width - (n + 1) * cellSize) / 2);
      const tableY = 120;
      
      // Draw table headers
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DP Table', tableX + ((n + 1) * cellSize) / 2, tableY - 20);
      
      // Draw column headers (string2 characters)
      ctx.fillStyle = '#333';
      ctx.fillRect(tableX, tableY, cellSize, cellSize); // Empty corner cell
      
      for (let j = 0; j <= n; j++) {
        const char = j === 0 ? "" : text2[j - 1];
        
        ctx.fillStyle = '#333';
        ctx.fillRect(tableX + (j + 1) * cellSize, tableY, cellSize, cellSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(char, tableX + (j + 1) * cellSize + cellSize / 2, tableY + cellSize / 2 + 5);
      }
      
      // Draw row headers (string1 characters)
      for (let i = 0; i <= m; i++) {
        const char = i === 0 ? "" : text1[i - 1];
        
        ctx.fillStyle = '#333';
        ctx.fillRect(tableX, tableY + (i + 1) * cellSize, cellSize, cellSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(char, tableX + cellSize / 2, tableY + (i + 1) * cellSize + cellSize / 2 + 5);
      }
      
      // Draw indices
      ctx.fillStyle = '#777';
      ctx.font = '12px Arial';
      
      // Column indices
      for (let j = 0; j <= n; j++) {
        ctx.textAlign = 'center';
        ctx.fillText(`${j}`, tableX + (j + 1) * cellSize + cellSize / 2, tableY - 5);
      }
      
      // Row indices
      for (let i = 0; i <= m; i++) {
        ctx.textAlign = 'right';
        ctx.fillText(`${i}`, tableX - 5, tableY + (i + 1) * cellSize + cellSize / 2 + 5);
      }
      
      // Draw dp table cells
      for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
          let cellColor = '#f5f5f5';
          
          // Highlight current cell
          if (currentI === i && currentJ === j) {
            cellColor = '#ff9800';
          } 
          // Highlight cells being compared
          else if (comparing) {
            if (comparing.includes('diagonal') && i - 1 === currentI - 1 && j - 1 === currentJ - 1) {
              cellColor = '#4caf50';
            } else if (comparing.includes('top') && i - 1 === currentI - 1 && j === currentJ) {
              cellColor = '#2196f3';
            } else if (comparing.includes('left') && i === currentI && j - 1 === currentJ - 1) {
              cellColor = '#9c27b0';
            }
          }
          // Highlight filled cells
          else if (dp[i] && dp[i][j] !== undefined) {
            cellColor = '#e3f2fd';
            
            // Highlight cells part of the LCS path
            if (lcs && lcs.path && lcs.path.some(pos => pos.i === i && pos.j === j)) {
              cellColor = '#c8e6c9';
            }
          }
          
          ctx.fillStyle = cellColor;
          ctx.fillRect(tableX + (j + 1) * cellSize, tableY + (i + 1) * cellSize, cellSize, cellSize);
          
          ctx.strokeStyle = '#bdbdbd';
          ctx.lineWidth = 1;
          ctx.strokeRect(tableX + (j + 1) * cellSize, tableY + (i + 1) * cellSize, cellSize, cellSize);
          
          // Draw cell value if defined
          if (dp[i] && dp[i][j] !== undefined) {
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${dp[i][j]}`, tableX + (j + 1) * cellSize + cellSize / 2, tableY + (i + 1) * cellSize + cellSize / 2 + 5);
          }
        }
      }
      
      // Draw match/mismatch indicators for current cell
      if (currentI > 0 && currentJ > 0) {
        const char1 = text1[currentI - 1];
        const char2 = text2[currentJ - 1];
        const match = char1 === char2;
        
        ctx.fillStyle = match ? '#4caf50' : '#f44336';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        const matchText = match 
          ? `Match: ${char1} == ${char2}` 
          : `Mismatch: ${char1} != ${char2}`;
          
        ctx.fillText(matchText, tableX, tableY + (m + 2) * cellSize + 30);
      }
    }
    
    // Display final result if available
    if (result !== undefined) {
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Length of LCS: ${result}`, 20, height - 60);
      
      if (lcs && lcs.sequence) {
        ctx.fillText(`Longest Common Subsequence: "${lcs.sequence}"`, 20, height - 30);
      }
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#f5f5f5', label: 'Empty cell' },
      { color: '#e3f2fd', label: 'Filled cell' },
      { color: '#ff9800', label: 'Current cell' },
      { color: '#4caf50', label: 'Diagonal cell' },
      { color: '#2196f3', label: 'Top cell' },
      { color: '#9c27b0', label: 'Left cell' },
      { color: '#c8e6c9', label: 'Part of LCS path' }
    ]);
  };

  // Run Longest Common Subsequence with history tracking
  const runLCS = (text1, text2, history) => {
    const m = text1.length;
    const n = text2.length;
    
    // Create a 2D array for memoization
    const dp = Array(m + 1)
      .fill()
      .map(() => Array(n + 1).fill(0));
    
    history.push({
      step: 'Initialize',
      text1,
      text2,
      dp: JSON.parse(JSON.stringify(dp)),
      explanation: `Initialize a 2D DP table of size (${m+1} x ${n+1}) with zeros.`,
      highlightedLines: [3, 4, 5, 6]
    });
    
    // Fill the dp table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        history.push({
          step: `Subproblem (${i}, ${j})`,
          text1,
          text2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          explanation: `Calculating LCS length for prefixes "${text1.substring(0, i)}" and "${text2.substring(0, j)}".`,
          highlightedLines: [9, 10, 11, 12]
        });
        
        if (text1[i - 1] === text2[j - 1]) {
          // Characters match, add 1 to diagonal value
          history.push({
            step: `Characters match`,
            text1,
            text2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            comparing: ['diagonal'],
            explanation: `Characters match: ${text1[i-1]} == ${text2[j-1]}. Add 1 to the diagonal value.`,
            highlightedLines: [13, 14, 15]
          });
          
          dp[i][j] = dp[i - 1][j - 1] + 1;
          
          history.push({
            step: `Set DP[${i}][${j}]`,
            text1,
            text2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            explanation: `Set dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`,
            highlightedLines: [14, 15]
          });
        } else {
          // Characters don't match, take max of left or top
          history.push({
            step: `Characters don't match`,
            text1,
            text2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            comparing: ['top', 'left'],
            explanation: `Characters don't match: ${text1[i-1]} != ${text2[j-1]}. Take maximum of top or left value.`,
            highlightedLines: [16, 17, 18]
          });
          
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          
          history.push({
            step: `Set DP[${i}][${j}]`,
            text1,
            text2,
            dp: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentJ: j,
            explanation: `Set dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
            highlightedLines: [17, 18]
          });
        }
      }
    }
    
    // Trace back to find the actual LCS
    let i = m, j = n;
    let lcsSequence = "";
    const lcsPath = [];
    
    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        lcsSequence = text1[i - 1] + lcsSequence;
        lcsPath.push({ i, j });
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    // Final result
    history.push({
      step: 'Final Result',
      text1,
      text2,
      dp: JSON.parse(JSON.stringify(dp)),
      result: dp[m][n],
      lcs: {
        sequence: lcsSequence,
        path: lcsPath
      },
      explanation: `The length of the longest common subsequence is ${dp[m][n]}.\nLCS: "${lcsSequence}"`,
      highlightedLines: [21]
    });
    
    return dp[m][n];
  };

  // Draw Coin Change visualization
  const drawCoinChange = (historyItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Extract data from historyItem
    const { coins, amount, dp, currentCoin, currentAmount, comparing, optimal, result } = historyItem;
    
    if (!coins || amount === undefined) {
      // Draw initial instruction
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click Run Algorithm to start the visualization', width / 2, height / 2);
      return;
    }
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Coin Change Problem (Amount: ${amount})`, width / 2, 30);
    
    // Draw coins information
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Coins: [${coins.join(', ')}]`, 20, 60);
    
    // Draw coins visually
    const coinY = 80;
    const coinSize = 40;
    const coinSpacing = 10;
    const coinStartX = 20;
    
    for (let i = 0; i < coins.length; i++) {
      // Determine coin color
      let coinColor = '#ffd54f';
      
      if (currentCoin !== undefined && coins[currentCoin] === coins[i]) {
        coinColor = '#ff9800'; // Highlight current coin
      }
      
      // Draw coin
      ctx.beginPath();
      ctx.arc(coinStartX + i * (coinSize + coinSpacing) + coinSize / 2, 
              coinY + coinSize / 2, 
              coinSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = coinColor;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw coin value
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${coins[i]}`, 
                  coinStartX + i * (coinSize + coinSpacing) + coinSize / 2, 
                  coinY + coinSize / 2 + 5);
    }
    
    // Draw DP array if available
    if (dp) {
      const maxDisplayAmount = Math.min(amount + 1, 20); // Limit to prevent overflow
      const dpCellSize = Math.min(40, Math.floor((width - 100) / maxDisplayAmount));
      const dpArrayX = 20;
      const dpArrayY = coinY + coinSize + 40;
      
      // Draw array header
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('DP Array (minimum coins needed for each amount):', dpArrayX, dpArrayY - 10);
      
      // Draw amount headers
      for (let amt = 0; amt < maxDisplayAmount; amt++) {
        ctx.fillStyle = '#333';
        ctx.fillRect(dpArrayX + amt * dpCellSize, dpArrayY, dpCellSize, 25);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${amt}`, dpArrayX + amt * dpCellSize + dpCellSize / 2, dpArrayY + 17);
      }
      
      // Draw dp array cells
      for (let amt = 0; amt < maxDisplayAmount; amt++) {
        let cellColor = '#f5f5f5';
        let textColor = '#333';
        
        // Highlight current amount
        if (currentAmount !== undefined && amt === currentAmount) {
          cellColor = '#ff9800';
        } 
        // Highlight amount being compared (current amount - coin value)
        else if (comparing !== undefined && amt === comparing) {
          cellColor = '#4caf50';
        }
        // Mark cells on the optimal solution path
        else if (optimal && optimal.includes(amt)) {
          cellColor = '#e1f5fe';
        }
        
        ctx.fillStyle = cellColor;
        ctx.fillRect(dpArrayX + amt * dpCellSize, dpArrayY + 25, dpCellSize, 40);
        
        ctx.strokeStyle = '#bdbdbd';
        ctx.lineWidth = 1;
        ctx.strokeRect(dpArrayX + amt * dpCellSize, dpArrayY + 25, dpCellSize, 40);
        
        // Draw cell value if defined
        if (dp[amt] !== undefined) {
          // Handle Infinity
          const displayValue = dp[amt] === Infinity ? '∞' : dp[amt];
          
          ctx.fillStyle = textColor;
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${displayValue}`, 
                      dpArrayX + amt * dpCellSize + dpCellSize / 2, 
                      dpArrayY + 25 + 25);
        }
      }
      
      // If amount is larger than what we can display, show indication
      if (amount >= maxDisplayAmount) {
        ctx.fillStyle = '#333';
        ctx.font = 'italic 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`(array truncated, total length: ${amount + 1})`, dpArrayX, dpArrayY + 80);
      }
      
      // Draw current calculation if applicable
      if (currentCoin !== undefined && currentAmount !== undefined && comparing !== undefined) {
        const coin = coins[currentCoin];
        const prevAmount = currentAmount - coin;
        const prevValue = dp[prevAmount];
        const curValue = dp[currentAmount];
        
        const calculationY = dpArrayY + 100;
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        if (prevAmount >= 0) {
          const calculationText = `dp[${currentAmount}] = min(dp[${currentAmount}], dp[${currentAmount} - ${coin}] + 1) = min(${curValue === Infinity ? '∞' : curValue}, ${prevValue === Infinity ? '∞' : prevValue} + 1)`;
          ctx.fillText(calculationText, dpArrayX, calculationY);
        }
      }
    }
    
    // Display final result if available
    if (result !== undefined) {
      const resultY = height - 40;
      ctx.fillStyle = result === -1 ? '#f44336' : '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      
      if (result === -1) {
        ctx.fillText(`Not possible to make amount ${amount} with given coins.`, 20, resultY);
      } else {
        ctx.fillText(`Minimum number of coins needed: ${result}`, 20, resultY);
      }
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#ffd54f', label: 'Coin' },
      { color: '#ff9800', label: 'Current coin/amount' },
      { color: '#4caf50', label: 'Comparing dp[i-coin]' },
      { color: '#e1f5fe', label: 'Optimal solution path' }
    ]);
  };

  // Run Coin Change with history tracking
  const runCoinChange = (coins, amount, history) => {
    // Initialize dp array with Infinity
    const dp = Array(amount + 1).fill(Infinity);
    
    history.push({
      step: 'Initialize',
      coins,
      amount,
      dp: [...dp],
      explanation: `Initialize dp array of size ${amount + 1} with Infinity. dp[i] will store the minimum number of coins needed to make amount i.`,
      highlightedLines: [2, 3]
    });
    
    // Base case: 0 coins needed to make amount 0
    dp[0] = 0;
    
    history.push({
      step: 'Base Case',
      coins,
      amount,
      dp: [...dp],
      explanation: 'Base case: 0 coins needed to make amount 0.',
      highlightedLines: [5, 6]
    });
    
    // Fill the dp array
    for (let coinIndex = 0; coinIndex < coins.length; coinIndex++) {
      const coin = coins[coinIndex];
      
      history.push({
        step: `Process Coin ${coin}`,
        coins,
        amount,
        dp: [...dp],
        currentCoin: coinIndex,
        explanation: `Processing coin with value ${coin}.`,
        highlightedLines: [8, 9, 10, 11]
      });
      
      for (let i = coin; i <= amount; i++) {
        history.push({
          step: `Subproblem (${i})`,
          coins,
          amount,
          dp: [...dp],
          currentCoin: coinIndex,
          currentAmount: i,
          comparing: i - coin,
          explanation: `Calculating minimum coins needed for amount ${i} using coin ${coin}.`,
          highlightedLines: [9, 10, 11]
        });
        
        // Check if using current coin improves the solution
        const withoutCoin = dp[i];
        const withCoin = dp[i - coin] + 1;
        
        history.push({
          step: `Compare options for amount ${i}`,
          coins,
          amount,
          dp: [...dp],
          currentCoin: coinIndex,
          currentAmount: i,
          comparing: i - coin,
          explanation: `Compare:\n1. Without using coin ${coin}: dp[${i}] = ${withoutCoin === Infinity ? '∞' : withoutCoin}\n2. With using coin ${coin}: dp[${i - coin}] + 1 = ${dp[i - coin] === Infinity ? '∞' : dp[i - coin]} + 1 = ${withCoin === Infinity ? '∞' : withCoin}`,
          highlightedLines: [10, 11]
        });
        
        // Minimum of current way or 1 + way to make (i - coin)
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        
        history.push({
          step: `Update DP[${i}]`,
          coins,
          amount,
          dp: [...dp],
          currentCoin: coinIndex,
          currentAmount: i,
          explanation: `Set dp[${i}] = min(${withoutCoin === Infinity ? '∞' : withoutCoin}, ${withCoin === Infinity ? '∞' : withCoin}) = ${dp[i] === Infinity ? '∞' : dp[i]}`,
          highlightedLines: [10, 11]
        });
      }
    }
    
    // Trace optimal solution if possible
    const optimal = [];
    if (dp[amount] !== Infinity) {
      let remainingAmount = amount;
      
      while (remainingAmount > 0) {
        for (const coin of coins) {
          if (remainingAmount >= coin && dp[remainingAmount] === dp[remainingAmount - coin] + 1) {
            optimal.push(remainingAmount);
            remainingAmount -= coin;
            break;
          }
        }
      }
      
      optimal.reverse();
    }
    
    // Final result
    const result = dp[amount] === Infinity ? -1 : dp[amount];
    
    history.push({
      step: 'Final Result',
      coins,
      amount,
      dp: [...dp],
      result,
      optimal,
      explanation: result === -1 
        ? `It's not possible to make amount ${amount} with the given coins.` 
        : `The minimum number of coins needed to make amount ${amount} is ${result}.`,
      highlightedLines: [15]
    });
    
    return result;
  };

  // Draw Edit Distance visualization
  const drawEditDistance = (historyItem) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Extract data from historyItem
    const { word1, word2, dp, currentI, currentJ, comparing, operation, result } = historyItem;
    
    if (!word1 || !word2) {
      // Draw initial instruction
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click Run Algorithm to start the visualization', width / 2, height / 2);
      return;
    }
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Edit Distance (Levenshtein Distance)', width / 2, 30);
    
    // Draw input strings
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Word 1: "${word1}"`, 20, 60);
    ctx.fillText(`Word 2: "${word2}"`, 20, 85);
    
    // Draw DP table if available
    if (dp) {
      const m = word1.length;
      const n = word2.length;
      
      // Calculate cell size based on strings length
      const maxCellSize = 40;
      const minCellSize = 25;
      const cellSize = Math.max(minCellSize, Math.min(maxCellSize, Math.floor((width - 100) / (n + 2))));
      
      const tableX = Math.max(50, (width - (n + 1) * cellSize) / 2);
      const tableY = 120;
      
      // Draw table headers
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DP Table', tableX + ((n + 1) * cellSize) / 2, tableY - 20);
      
      // Draw column headers (word2 characters)
      ctx.fillStyle = '#333';
      ctx.fillRect(tableX, tableY, cellSize, cellSize); // Empty corner cell
      
      for (let j = 0; j <= n; j++) {
        const char = j === 0 ? "" : word2[j - 1];
        
        ctx.fillStyle = '#333';
        ctx.fillRect(tableX + (j + 1) * cellSize, tableY, cellSize, cellSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(char, tableX + (j + 1) * cellSize + cellSize / 2, tableY + cellSize / 2 + 5);
      }
      
      // Draw row headers (word1 characters)
      for (let i = 0; i <= m; i++) {
        const char = i === 0 ? "" : word1[i - 1];
        
        ctx.fillStyle = '#333';
        ctx.fillRect(tableX, tableY + (i + 1) * cellSize, cellSize, cellSize);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(char, tableX + cellSize / 2, tableY + (i + 1) * cellSize + cellSize / 2 + 5);
      }
      
      // Draw indices
      ctx.fillStyle = '#777';
      ctx.font = '12px Arial';
      
      // Column indices
      for (let j = 0; j <= n; j++) {
        ctx.textAlign = 'center';
        ctx.fillText(`${j}`, tableX + (j + 1) * cellSize + cellSize / 2, tableY - 5);
      }
      
      // Row indices
      for (let i = 0; i <= m; i++) {
        ctx.textAlign = 'right';
        ctx.fillText(`${i}`, tableX - 5, tableY + (i + 1) * cellSize + cellSize / 2 + 5);
      }
      
      // Draw dp table cells
      for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
          let cellColor = '#f5f5f5';
          
          // Highlight current cell
          if (currentI === i && currentJ === j) {
            cellColor = '#ff9800';
          } 
          // Highlight cells being compared
          else if (comparing) {
            if (comparing === 'diagonal' && i - 1 === currentI - 1 && j - 1 === currentJ - 1) {
              cellColor = '#e91e63'; // Diagonal cell (replace)
            } else if (comparing === 'top' && i - 1 === currentI - 1 && j === currentJ) {
              cellColor = '#2196f3'; // Top cell (delete)
            } else if (comparing === 'left' && i === currentI && j - 1 === currentJ - 1) {
              cellColor = '#9c27b0'; // Left cell (insert)
            }
          }
          // Highlight filled cells
          else if (dp[i] && dp[i][j] !== undefined) {
            cellColor = '#e3f2fd';
          }
          
          ctx.fillStyle = cellColor;
          ctx.fillRect(tableX + (j + 1) * cellSize, tableY + (i + 1) * cellSize, cellSize, cellSize);
          
          ctx.strokeStyle = '#bdbdbd';
          ctx.lineWidth = 1;
          ctx.strokeRect(tableX + (j + 1) * cellSize, tableY + (i + 1) * cellSize, cellSize, cellSize);
          
          // Draw cell value if defined
          if (dp[i] && dp[i][j] !== undefined) {
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${dp[i][j]}`, tableX + (j + 1) * cellSize + cellSize / 2, tableY + (i + 1) * cellSize + cellSize / 2 + 5);
          }
        }
      }
      
      // Draw match/mismatch indicators for current cell
      if (currentI > 0 && currentJ > 0) {
        const char1 = word1[currentI - 1];
        const char2 = word2[currentJ - 1];
        const match = char1 === char2;
        
        ctx.fillStyle = match ? '#4caf50' : '#f44336';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        
        const matchText = match 
          ? `Match: ${char1} == ${char2}` 
          : `Mismatch: ${char1} != ${char2}`;
          
        ctx.fillText(matchText, tableX, tableY + (m + 2) * cellSize + 30);
      }
      
      // Draw operation explanation if available
      if (operation) {
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Operation: ${operation}`, tableX, tableY + (m + 2) * cellSize + 60);
      }
    }
    
    // Display final result if available
    if (result !== undefined) {
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Minimum edit distance: ${result}`, 20, height - 40);
    }
    
    // Draw legend
    drawLegend(ctx, [
      { color: '#f5f5f5', label: 'Empty cell' },
      { color: '#e3f2fd', label: 'Filled cell' },
      { color: '#ff9800', label: 'Current cell' },
      { color: '#e91e63', label: 'Replace operation' },
      { color: '#2196f3', label: 'Delete operation' },
      { color: '#9c27b0', label: 'Insert operation' }
    ]);
  };
  
  // Run Edit Distance with history tracking
  const runEditDistance = (word1, word2, history) => {
    const m = word1.length;
    const n = word2.length;
    
    // Create a 2D array for the DP table
    const dp = Array(m + 1)
      .fill()
      .map(() => Array(n + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }
    
    // Add initialization step to history
    history.push({
      step: 'Initialize',
      word1,
      word2,
      dp: JSON.parse(JSON.stringify(dp)),
      explanation: `Initialize a ${m+1}x${n+1} DP table. dp[i][j] represents the minimum edit distance between word1[0...i-1] and word2[0...j-1]. Fill first row and column with edit distances for empty string cases.`,
      highlightedLines: [2, 3, 4, 5, 6, 7, 8, 9]
    });
    
    // Fill the dp table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        // Add history item for this cell calculation
        history.push({
          step: `Processing dp[${i}][${j}]`,
          word1,
          word2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          explanation: `Calculating edit distance for substrings word1[0...${i-1}] (${word1.substring(0, i)}) and word2[0...${j-1}] (${word2.substring(0, j)})`,
          highlightedLines: [11, 12, 13]
        });
        
        // Check if current characters match
        const match = word1[i - 1] === word2[j - 1];
        
        history.push({
          step: `Compare characters at dp[${i}][${j}]`,
          word1,
          word2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          explanation: `Comparing characters: word1[${i-1}] (${word1[i-1]}) and word2[${j-1}] (${word2[j-1]}). ${match ? "They match!" : "They don't match."}`,
          highlightedLines: [14, 15]
        });
        
        // Calculate minimum edit distances for each operation
        const replace = dp[i - 1][j - 1] + (match ? 0 : 1);
        
        history.push({
          step: `Calculate replace cost at dp[${i}][${j}]`,
          word1,
          word2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          comparing: 'diagonal',
          operation: `Replace: ${match ? "No cost since characters match" : "Replace " + word1[i-1] + " with " + word2[j-1]}`,
          explanation: `If we ${match ? "match" : "replace"} characters: dp[${i-1}][${j-1}] ${match ? "" : "+ 1"} = ${dp[i-1][j-1]} ${match ? "" : "+ 1"} = ${replace}`,
          highlightedLines: [16, 17]
        });
        
        const delete_op = dp[i - 1][j] + 1;
        
        history.push({
          step: `Calculate delete cost at dp[${i}][${j}]`,
          word1,
          word2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          comparing: 'top',
          operation: `Delete: Remove ${word1[i-1]} from word1`,
          explanation: `If we delete a character from word1: dp[${i-1}][${j}] + 1 = ${dp[i-1][j]} + 1 = ${delete_op}`,
          highlightedLines: [16, 17]
        });
        
        const insert = dp[i][j - 1] + 1;
        
        history.push({
          step: `Calculate insert cost at dp[${i}][${j}]`,
          word1,
          word2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          comparing: 'left',
          operation: `Insert: Add ${word2[j-1]} to word1`,
          explanation: `If we insert a character to word1: dp[${i}][${j-1}] + 1 = ${dp[i][j-1]} + 1 = ${insert}`,
          highlightedLines: [16, 17]
        });
        
        // Take the minimum of the three operations
        dp[i][j] = Math.min(replace, delete_op, insert);
        
        let operationUsed;
        if (dp[i][j] === replace) {
          operationUsed = match ? "Match (no edit needed)" : `Replace ${word1[i-1]} with ${word2[j-1]}`;
        } else if (dp[i][j] === delete_op) {
          operationUsed = `Delete ${word1[i-1]} from word1`;
        } else {
          operationUsed = `Insert ${word2[j-1]} into word1`;
        }
        
        history.push({
          step: `Update dp[${i}][${j}]`,
          word1,
          word2,
          dp: JSON.parse(JSON.stringify(dp)),
          currentI: i,
          currentJ: j,
          operation: operationUsed,
          explanation: `Choose minimum: min(replace=${replace}, delete=${delete_op}, insert=${insert}) = ${dp[i][j]}. Operation chosen: ${operationUsed}`,
          highlightedLines: [16, 17, 18]
        });
      }
    }
    
    // Final result
    const result = dp[m][n];
    
    // Add final result to history
    history.push({
      step: 'Final Result',
      word1,
      word2,
      dp: JSON.parse(JSON.stringify(dp)),
      result,
      explanation: `The minimum edit distance between "${word1}" and "${word2}" is ${result}.`,
      highlightedLines: [20, 21]
    });
    
    return result;
  };

  // Step forward in the algorithm visualization
  const stepForward = () => {
    // Clear any existing animation timer
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    if (currentStep < totalSteps - 1 && algorithmHistory.length > 0) {
      const nextStep = currentStep + 1;
      const historyItem = algorithmHistory[nextStep];
      
      // Update state with the next step's data
      setCurrentStep(nextStep);
      setExplanation(historyItem.explanation || '');
      setHighlightedLines(historyItem.highlightedLines || []);
      
      // Redraw the problem
      drawProblem(historyItem);
      
      // If we've reached the end, mark as not running
      if (nextStep >= totalSteps - 1) {
        setIsRunning(false);
      } else {
        setIsPaused(true);
      }
    }
  };

  // Reset visualization to initial state
  const resetVisualization = () => {
    // Clear any existing animation timer
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset state
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setExplanation('');
    setHighlightedLines([]);
    
    // Reset canvas size to default
    setCanvasWidth(800);
    setCanvasHeight(300);
    
    // Clear the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // If we have a problem and no history, draw the initial problem state
      if (problem && (!algorithmHistory || algorithmHistory.length === 0)) {
        switch (algorithm) {
          case 'fibonacci':
            drawFibonacci({ n: problem, current: 0, dp: [] });
            break;
          case 'knapsack':
            drawKnapsack({ 
              weights: problem.weights, 
              values: problem.values, 
              capacity: problem.capacity,
              dp: [] 
            });
            break;
          case 'lcs':
            drawLCS({ 
              text1: problem.text1, 
              text2: problem.text2, 
              dp: []
            });
            break;
          case 'coinChange':
            drawCoinChange({
              coins: problem.coins,
              amount: problem.amount,
              dp: []
            });
            break;
          case 'editDistance':
            drawEditDistance({
              word1: problem.word1,
              word2: problem.word2,
              dp: []
            });
            break;
          default:
            break;
        }
      } 
      // If we have algorithmHistory, draw the initial state
      else if (algorithmHistory && algorithmHistory.length > 0) {
        drawProblem(algorithmHistory[0]);
      }
    }
  };

  // Pause or resume the algorithm visualization
  const pauseResumeVisualization = () => {
    if (isRunning) {
      if (isPaused) {
        setIsPaused(false);
        // Resume animation from current step
        animateAlgorithm(currentStep, algorithmHistory);
      } else {
        setIsPaused(true);
        // Clear any existing animation timer
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      }
    }
  };

  // Update visualization based on slider position
  const updateSliderPosition = (value) => {
    // Clear any existing animation timer
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Pause the animation
    setIsPaused(true);
    
    // Update to the selected step
    const stepValue = Number(value);
    
    if (algorithmHistory.length > 0 && stepValue >= 0 && stepValue < algorithmHistory.length) {
      const historyItem = algorithmHistory[stepValue];
      
      // Update state with the selected step's data
      setCurrentStep(stepValue);
      setExplanation(historyItem.explanation || '');
      setHighlightedLines(historyItem.highlightedLines || []);
      
      // Redraw the problem
      drawProblem(historyItem);
      
      // If we've reached the end, mark as not running
      if (stepValue >= totalSteps - 1) {
        setIsRunning(false);
      }
    }
  };

  // Return component JSX
  return (
    <VisualizerLayout
      title="Dynamic Programming Algorithm Visualizer"
      prompts={dpPrompts}
      promptStep={promptStep}
      onNextPrompt={handleNextPrompt}
      onPreviousPrompt={handlePreviousPrompt}
      onFinishPrompts={handleFinishPrompts}
      showPrompts={showPrompts}
      algorithmData={algorithmInfo[algorithm]}
      controls={
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Algorithm</InputLabel>
                <Select
                  value={algorithm}
                  onChange={(e) => {
                    setAlgorithm(e.target.value);
                    resetVisualization();
                  }}
                  label="Algorithm"
                  disabled={isRunning}
                >
                  {getAvailableAlgorithms().map((algo) => (
                    <MenuItem key={algo} value={algo}>
                      {algo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Problem Size</Typography>
              <Slider
                value={problemSize}
                onChange={(e, value) => setProblemSize(value)}
                min={5}
                max={20}
                step={1}
                disabled={isRunning}
              />
              <Typography variant="caption" color="text.secondary">
                {problemSize} elements
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>Speed</Typography>
              <Slider
                value={speed}
                onChange={(e, value) => setSpeed(value)}
                min={10}
                max={100}
                step={10}
                disabled={isRunning}
              />
              <Typography variant="caption" color="text.secondary">
                {speed}ms per step
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={generateRandomProblem}
                disabled={isRunning}
              >
                Generate Problem
              </Button>
            </Grid>

            <Grid item xs={12}>
              <VisualizerControls
                isRunning={isRunning}
                isPaused={isPaused}
                currentStep={currentStep}
                totalSteps={totalSteps}
                onRun={runAlgorithm}
                onPauseResume={pauseResumeVisualization}
                onNext={stepForward}
                onReset={resetVisualization}
              />
            </Grid>
          </Grid>
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

export default DynamicProgrammingVisualizer;