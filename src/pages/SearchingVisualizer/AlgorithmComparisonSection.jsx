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
  const [searchTarget, setSearchTarget] = useState(50);
  const [error, setError] = useState('');

  // Handle algorithm selection
  const handleAlgorithmSelection = (event) => {
    setSelectedAlgorithms(event.target.value);
  };

  // Handle custom input
  const handleCustomInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle search target change
  const handleSearchTargetChange = (e) => {
    setSearchTarget(parseInt(e.target.value) || 0);
  };

  // Parse custom input
  const parseCustomInput = () => {
    try {
      const parsed = inputData.split(',').map(item => parseInt(item.trim()));
      if (parsed.some(isNaN)) {
        setError('Please enter valid numbers separated by commas');
        return false;
      }
      // Sort the array for binary search
      const sortedArray = [...parsed].sort((a, b) => a - b);
      setCustomInput(sortedArray);
      setInputData(sortedArray.join(', '));
      setError('');
      return sortedArray;
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
    // Sort the array for binary search
    const sortedArray = [...randomArray].sort((a, b) => a - b);
    setCustomInput(sortedArray);
    setInputData(sortedArray.join(', '));
    
    // Set a random target within the range of the array
    if (sortedArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * sortedArray.length);
      setSearchTarget(sortedArray[randomIndex]);
    }
    
    return sortedArray;
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
          case 'linearSearch':
            algorithmFn = (arr) => {
              const linearSearch = (arr, target) => {
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i] === target) {
                    return { found: true, index: i };
                  }
                }
                return { found: false, index: -1 };
              };
              
              return linearSearch([...arr], searchTarget);
            };
            break;
          case 'binarySearch':
            algorithmFn = (arr) => {
              const binarySearch = (arr, target) => {
                let left = 0;
                let right = arr.length - 1;
                
                while (left <= right) {
                  const mid = Math.floor((left + right) / 2);
                  
                  if (arr[mid] === target) {
                    return { found: true, index: mid };
                  }
                  
                  if (arr[mid] < target) {
                    left = mid + 1;
                  } else {
                    right = mid - 1;
                  }
                }
                
                return { found: false, index: -1 };
              };
              
              return binarySearch([...arr], searchTarget);
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
          
          <TextField
            label="Search Target"
            fullWidth
            type="number"
            value={searchTarget}
            onChange={handleSearchTargetChange}
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
                    <TableCell><strong>Result</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(results).map(([algoName, data]) => (
                    <TableRow key={algoName}>
                      <TableCell>{algorithms[algoName]?.name || algoName}</TableCell>
                      <TableCell>{data.executionTime.toFixed(4)}</TableCell>
                      <TableCell>
                        {data.result?.found ? 
                          `Found at index ${data.result.index}` : 
                          'Not found'}
                      </TableCell>
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