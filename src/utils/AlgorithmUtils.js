/**
 * Utility functions for algorithm visualization and analysis
 */

/**
 * Measures the execution time of an algorithm function
 * @param {Function} algorithmFn - The algorithm function to measure
 * @param {Array} args - Arguments to pass to the algorithm function
 * @returns {Object} Object containing the result and execution time in milliseconds
 */
export const measureExecutionTime = (algorithmFn, args) => {
  const startTime = performance.now();
  const result = algorithmFn(...args);
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return {
    result,
    executionTime
  };
};

/**
 * Compares multiple algorithms by running them with the same input
 * @param {Object} algorithms - Object with algorithm names as keys and functions as values
 * @param {Array} input - Input data to run the algorithms on
 * @returns {Object} Comparison results with execution times and outputs
 */
export const compareAlgorithms = (algorithms, input) => {
  const results = {};
  
  for (const [name, fn] of Object.entries(algorithms)) {
    const { result, executionTime } = measureExecutionTime(fn, [input]);
    results[name] = {
      executionTime,
      result
    };
  }
  
  return results;
};

/**
 * Saves the current visualization state to localStorage
 * @param {string} visualizerType - Type of visualizer (sorting, searching, etc.)
 * @param {Object} state - The state object to save
 */
export const saveVisualizationState = (visualizerType, state) => {
  try {
    const stateString = JSON.stringify(state);
    localStorage.setItem(`${visualizerType}State`, stateString);
    return true;
  } catch (error) {
    console.error('Error saving state:', error);
    return false;
  }
};

/**
 * Loads a saved visualization state from localStorage
 * @param {string} visualizerType - Type of visualizer (sorting, searching, etc.)
 * @returns {Object|null} The saved state object or null if not found
 */
export const loadVisualizationState = (visualizerType) => {
  try {
    const stateString = localStorage.getItem(`${visualizerType}State`);
    if (!stateString) return null;
    return JSON.parse(stateString);
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

/**
 * Generates a formatted complexity string for display
 * @param {Object} complexity - Complexity object with best, average, worst cases
 * @returns {string} Formatted complexity string
 */
export const formatComplexity = (complexity) => {
  return `Best: ${complexity.best} | Average: ${complexity.average} | Worst: ${complexity.worst}`;
};