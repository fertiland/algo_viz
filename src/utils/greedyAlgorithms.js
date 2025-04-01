// Greedy algorithm prompts
export const greedyPrompts = [
  {
    title: 'Welcome to Greedy Algorithm Visualizer',
    content: 'This tool helps you understand how greedy algorithms work by visualizing the process step by step. You can see how these algorithms make locally optimal choices at each step to find a global optimum.'
  },
  {
    title: 'Choose a Problem Type',
    content: 'Select a problem type from the dropdown menu. Each problem type demonstrates different applications of greedy algorithms. You can choose between assignment problems and interval problems.'
  },
  {
    title: 'Select an Algorithm',
    content: 'Choose a specific algorithm to visualize. Different algorithms use different greedy strategies to solve problems.'
  },
  {
    title: 'Generate a Problem',
    content: 'Click the "Generate Random Problem" button to create a new problem instance. You can also adjust the problem size using the slider or input your own values.'
  },
  {
    title: 'Control the Visualization',
    content: 'Use the play, pause, and step buttons to control the visualization. You can also adjust the speed to see the algorithm process faster or slower.'
  }
];

// Generate random problem data
export const generateRandomProblemData = (algorithm, problemSize) => {
  switch (algorithm) {
    case 'jobScheduling':
      // Generate random jobs with deadlines and profits
      return Array.from({ length: problemSize }, (_, i) => ({
        id: i + 1,
        deadline: Math.floor(Math.random() * problemSize) + 1,
        profit: Math.floor(Math.random() * 50) + 10
      }));
    
    case 'fractionalKnapsack':
      // Generate random items with values and weights
      return {
        items: Array.from({ length: problemSize }, (_, i) => ({
          id: i + 1,
          value: Math.floor(Math.random() * 50) + 10,
          weight: Math.floor(Math.random() * 20) + 5
        })),
        capacity: Math.floor(Math.random() * 50) + problemSize * 10
      };
    
    case 'activitySelection':
      // Generate random activities with start and finish times
      return Array.from({ length: problemSize }, (_, i) => {
        const start = Math.floor(Math.random() * 20);
        return {
          id: i + 1,
          start,
          finish: start + Math.floor(Math.random() * 10) + 1
        };
      });
    
    case 'intervalColoring':
      // Generate random intervals with start and end times
      return Array.from({ length: problemSize }, (_, i) => {
        const start = Math.floor(Math.random() * 20);
        return {
          id: i + 1,
          start,
          end: start + Math.floor(Math.random() * 10) + 1
        };
      });
    
    case 'maxSubArray':
      // Generate random array of integers for maximum subarray problem
      return Array.from({ length: problemSize }, () => {
        // Generate random integers between -20 and 30 to ensure some negative values
        return Math.floor(Math.random() * 50) - 20;
      });
      
    case 'nonOverlappingIntervals':
      // Generate random intervals with start and end times
      return Array.from({ length: problemSize }, (_, i) => {
        const start = Math.floor(Math.random() * 20);
        return {
          id: i + 1,
          start,
          end: start + Math.floor(Math.random() * 10) + 1
        };
      });
    
    default:
      return [];
  }
};

// Code snippets for each greedy algorithm
export const codeSnippets = {
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
}`,

  // Non-overlapping Intervals Problem
  nonOverlappingIntervals: `function eraseOverlapIntervals(intervals) {
  // Sort intervals by their end times
  intervals.sort((a, b) => a.end - b.end);
  
  let count = 0;
  let end = intervals[0].end;
  let removed = [];
  let kept = [intervals[0]];
  
  // Iterate through remaining intervals
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i].start < end) {
      // Current interval overlaps, remove it
      count++;
      removed.push(intervals[i]);
    } else {
      // No overlap, update end time
      end = intervals[i].end;
      kept.push(intervals[i]);
    }
  }
  
  return { count, removed, kept };
}`,
};

// Algorithm complexity information
export const algorithmInfo = {
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
  },
  
  // Non-overlapping Intervals Problem
  nonOverlappingIntervals: {
    name: 'Non-overlapping Intervals',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    description: 'The Non-overlapping Intervals problem finds the minimum number of intervals to remove to make the remaining intervals non-overlapping. It sorts intervals by end time and greedily keeps intervals that don\'t overlap with the previously selected interval.'
  }
}; 