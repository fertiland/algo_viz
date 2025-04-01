# AlgoViz - Algorithm Visualization Tool

AlgoViz is an interactive web application designed to help users understand and visualize common algorithms and data structures. Through step-by-step animations and explanations, users can gain insights into how different algorithms work and compare their performance.

![AlgoViz Screenshot](public/screenshot.png)

## Features

- **Interactive Visualizations** - Step through algorithms at your own pace
- **Multiple Algorithm Categories** - Sorting, Searching, Graph, Dynamic Programming, Divide & Conquer, Greedy, and more
- **Detailed Explanations** - Each step includes explanations of what's happening
- **Code Display** - View the actual implementation code alongside visualizations
- **Adjustable Parameters** - Change array sizes, speeds, and other parameters
- **Responsive Design** - Works on desktop and mobile devices

## Algorithm Categories

- **Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, Heap Sort, Insertion Sort
- **Searching Algorithms**: Linear Search, Binary Search
- **Graph Algorithms**: BFS, DFS, Dijkstra's, Kruskal's, Prim's
- **Dynamic Programming**: Fibonacci, Knapsack, Longest Common Subsequence
- **Divide & Conquer**: Binary Search, Merge Sort, Quick Sort
- **Greedy Algorithms**: Activity Selection, Fractional Knapsack
- **Data Structures**: Arrays, Linked Lists, Stacks, Queues, Trees
- **Two Pointer Technique**: Two Sum, Container With Most Water

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/algo-viz.git
   cd algo-viz
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. Select an algorithm category from the sidebar
2. Choose a specific algorithm from the dropdown menu
3. Adjust parameters like array size and animation speed
4. Click "Run" to start the visualization
5. Use the control buttons to pause, step forward/backward, or reset
6. View the explanation panel to understand what's happening at each step
7. Examine the code panel to see the algorithm implementation

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Algorithm visualizer pages
- `src/utils/` - Helper functions and utilities
- `src/assets/` - Static assets like images

## Key Components

- **VisualizerLayout** - Standardized layout for all algorithm visualizers
- **VisualizerControls** - Unified control panel with step counter and progress bar
- **CodeHighlighter** - Syntax highlighting for algorithm code
- **AlgorithmComparison** - Compare different algorithms side by side

## Technology Stack

- **React** - Frontend framework
- **Material-UI** - UI component library
- **React Router** - Navigation and routing
- **React Syntax Highlighter** - Code syntax highlighting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various algorithm visualization tools and educational resources
- Thanks to all contributors who have helped improve this project
