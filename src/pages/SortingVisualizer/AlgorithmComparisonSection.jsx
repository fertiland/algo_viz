import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { measureExecutionTime, compareAlgorithms } from '../../utils/AlgorithmUtils';

const AlgorithmComparisonSection = ({ algorithms }) => {
  const [inputData, setInputData] = useState('');
  const [customInput, setCustomInput] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [error, setError] = useState('');

  // Handle algorithm selection
  const handleAlgorithmSelection = (event) => {
    setSelectedAlgorithms(event.target.value);
  };

  // Handle custom input
  const handleCustomInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Parse custom input
  const parseCustomInput = () => {
    try {
      const parsed = inputData.split(',').map(item => parseInt(item.trim()));
      if (parsed.some(isNaN)) {
        setError('Please enter valid numbers separated by commas');
        return false;
      }
      setCustomInput(parsed);
      setError('');
      return parsed;
    } catch (error) {
      setError('Please enter valid numbers separated by commas');
      return false;
    }
  };

  // Generate random input
  const generateRandomInput = (size = 20) => {
    const randomArray = [];
    for (let i = 0; i < size; i++) {
      randomArray.push(Math.floor(Math.random() * 100) + 1);
    }
    setCustomInput(randomArray);
    setInputData(randomArray.join(', '));
    return randomArray;
  };

  // Run comparison
  const runComparison = (input = null) => {
    const dataToUse = input || customInput.length > 0 ? customInput : parseCustomInput();
    
    if (!dataToUse) return;
    
    if (selectedAlgorithms.length === 0) {
      setError('Please select at least one algorithm to compare');
      return;
    }
    
    const algorithmsToCompare = {};
    selectedAlgorithms.forEach(algoName => {
      if (algorithms[algoName]) {
        // Create a clean version of the algorithm function without history tracking
        let algorithmFn;
        switch(algoName) {
          case 'quickSort':
            algorithmFn = (arr) => {
              const quickSort = (arr, low = 0, high = arr.length - 1) => {
                if (low < high) {
                  const pivotIndex = partition(arr, low, high);
                  quickSort(arr, low, pivotIndex - 1);
                  quickSort(arr, pivotIndex + 1, high);
                }
                return arr;
              };
              
              const partition = (arr, low, high) => {
                const pivot = arr[high];
                let i = low - 1;
                
                for (let j = low; j < high; j++) {
                  if (arr[j] <= pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                  }
                }
                
                [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
                return i + 1;
              };
              
              return quickSort([...arr]);
            };
            break;
          case 'mergeSort':
            algorithmFn = (arr) => {
              const mergeSort = (arr) => {
                if (arr.length <= 1) return arr;
                
                const mid = Math.floor(arr.length / 2);
                const left = arr.slice(0, mid);
                const right = arr.slice(mid);
                
                return merge(mergeSort(left), mergeSort(right));
              };
              
              const merge = (left, right) => {
                let result = [];
                let leftIndex = 0;
                let rightIndex = 0;
                
                while (leftIndex < left.length && rightIndex < right.length) {
                  if (left[leftIndex] < right[rightIndex]) {
                    result.push(left[leftIndex]);
                    leftIndex++;
                  } else {
                    result.push(right[rightIndex]);
                    rightIndex++;
                  }
                }
                
                return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
              };
              
              return mergeSort([...arr]);
            };
            break;
          case 'heapSort':
            algorithmFn = (arr) => {
              const heapSort = (arr) => {
                const n = arr.length;
                
                for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                  heapify(arr, n, i);
                }
                
                for (let i = n - 1; i > 0; i--) {
                  [arr[0], arr[i]] = [arr[i], arr[0]];
                  heapify(arr, i, 0);
                }
                
                return arr;
              };
              
              const heapify = (arr, n, i) => {
                let largest = i;
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                
                if (left < n && arr[left] > arr[largest]) {
                  largest = left;
                }
                
                if (right < n && arr[right] > arr[largest]) {
                  largest = right;
                }
                
                if (largest !== i) {
                  [arr[i], arr[largest]] = [arr[largest], arr[i]];
                  heapify(arr, n, largest);
                }
              };
              
              return heapSort([...arr]);
            };
            break;
          case 'bubbleSort':
            algorithmFn = (arr) => {
              const bubbleSort = (arr) => {
                const n = arr.length;
                
                for (let i = 0; i < n - 1; i++) {
                  for (let j = 0; j < n - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    }
                  }
                }
                
                return arr;
              };
              
              return bubbleSort([...arr]);
            };
            break;
          case 'insertionSort':
            algorithmFn = (arr) => {
              const insertionSort = (arr) => {
                const n = arr.length;
                
                for (let i = 1; i < n; i++) {
                  const key = arr[i];
                  let j = i - 1;
                  
                  while (j >= 0 && arr[j] > key) {
                    arr[j + 1] = arr[j];
                    j--;
                  }
                  
                  arr[j + 1] = key;
                }
                
                return arr;
              };
              
              return insertionSort([...arr]);
            };
            break;
          default:
            break;
        }
        
        algorithmsToCompare[algoName] = algorithmFn;
      }
    });
    
    const comparisonResults = compareAlgorithms(algorithmsToCompare, [...dataToUse]);
    setResults(comparisonResults);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Algorithm Performance Comparison</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Algorithms</InputLabel>
            <Select
              multiple
              value={selectedAlgorithms}
              onChange={handleAlgorithmSelection}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={algorithms[value]?.name || value} />
                  ))}
                </Box>
              )}
            >
              {Object.keys(algorithms).map((algoName) => (
                <MenuItem key={algoName} value={algoName}>
                  {algorithms[algoName].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Input Data (comma separated)"
            fullWidth
            multiline
            rows={2}
            value={inputData}
            onChange={handleCustomInputChange}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => generateRandomInput()}
              sx={{ flexGrow: 1 }}
            >
              Generate Random Input
            </Button>
            <Button 
              variant="contained" 
              onClick={() => runComparison()}
              sx={{ flexGrow: 1 }}
              disabled={selectedAlgorithms.length === 0}
            >
              Compare
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {results && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Algorithm</strong></TableCell>
                    <TableCell><strong>Execution Time (ms)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(results).map(([algoName, data]) => (
                    <TableRow key={algoName}>
                      <TableCell>{algorithms[algoName]?.name || algoName}</TableCell>
                      <TableCell>{data.executionTime.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AlgorithmComparisonSection;