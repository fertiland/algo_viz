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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Slider,
} from '@mui/material';
import { measureExecutionTime, compareAlgorithms } from '../../utils/AlgorithmUtils';

const AlgorithmComparisonSection = ({ algorithms }) => {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(
    Object.keys(algorithms).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );
  const [inputSize, setInputSize] = useState(10);
  const [customInput, setCustomInput] = useState('');
  const [results, setResults] = useState([]);
  const [problem, setProblem] = useState(null);
  const [problemType, setProblemType] = useState('jobScheduling');

  // Handle algorithm selection
  const handleAlgorithmSelection = (algorithm) => {
    setSelectedAlgorithms({
      ...selectedAlgorithms,
      [algorithm]: !selectedAlgorithms[algorithm]
    });
  };

  // Generate random problem
  const generateRandomProblem = () => {
    let generatedProblem;
    
    switch (problemType) {
      case 'jobScheduling':
        generatedProblem = Array.from({ length: inputSize }, (_, i) => ({
          id: i + 1,
          deadline: Math.floor(Math.random() * inputSize) + 1,
          profit: Math.floor(Math.random() * 50) + 10
        }));
        break;
      
      case 'fractionalKnapsack':
        generatedProblem = {
          items: Array.from({ length: inputSize }, (_, i) => ({
            id: i + 1,
            value: Math.floor(Math.random() * 50) + 10,
            weight: Math.floor(Math.random() * 20) + 5
          })),
          capacity: Math.floor(Math.random() * 50) + inputSize * 10
        };
        break;
      
      case 'activitySelection':
        generatedProblem = Array.from({ length: inputSize }, (_, i) => {
          const start = Math.floor(Math.random() * 20);
          return {
            id: i + 1,
            start,
            finish: start + Math.floor(Math.random() * 10) + 1
          };
        });
        break;
      
      case 'intervalColoring':
        generatedProblem = Array.from({ length: inputSize }, (_, i) => {
          const start = Math.floor(Math.random() * 20);
          return {
            id: i + 1,
            start,
            end: start + Math.floor(Math.random() * 10) + 1
          };
        });
        break;
      
      default:
        break;
    }
    
    setProblem(generatedProblem);
    setCustomInput(JSON.stringify(generatedProblem, null, 2));
  };

  // Handle custom input
  const handleCustomInput = () => {
    try {
      const parsedInput = JSON.parse(customInput);
      setProblem(parsedInput);
    } catch (error) {
      alert('Please enter valid JSON format for the problem');
    }
  };

  // Run comparison
  const runComparison = () => {
    if (!problem) {
      alert('Please generate a problem first');
      return;
    }
    
    const selectedAlgorithmKeys = Object.keys(selectedAlgorithms).filter(key => selectedAlgorithms[key]);
    
    if (selectedAlgorithmKeys.length === 0) {
      alert('Please select at least one algorithm to compare');
      return;
    }
    
    const algorithmFunctions = {};
    
    // Get the selected algorithm functions
    selectedAlgorithmKeys.forEach(key => {
      algorithmFunctions[key] = algorithms[key].fn;
    });
    
    // Run the comparison
    const comparisonResults = compareAlgorithms(algorithmFunctions, problem);
    
    setResults(comparisonResults);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Algorithm Selection</Typography>
        <FormGroup row>
          {Object.keys(algorithms).map(key => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={selectedAlgorithms[key]}
                  onChange={() => handleAlgorithmSelection(key)}
                />
              }
              label={algorithms[key].name}
            />
          ))}
        </FormGroup>
      </Paper>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Problem Setup</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Input Size</Typography>
              <Slider
                value={inputSize}
                onChange={(_, value) => setInputSize(value)}
                min={5}
                max={100}
                valueLabelDisplay="auto"
              />
            </Box>
            <Button
              variant="contained"
              onClick={generateRandomProblem}
              sx={{ mr: 1 }}
            >
              Generate Random Problem
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Custom Input (JSON)"
              multiline
              rows={4}
              fullWidth
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleCustomInput}
              disabled={!customInput}
            >
              Apply Custom Input
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Button
        variant="contained"
        color="primary"
        onClick={runComparison}
        disabled={!problem}
        sx={{ mb: 2 }}
      >
        Run Comparison
      </Button>
      
      {results.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Comparison Results</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Algorithm</TableCell>
                  <TableCell>Execution Time (ms)</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{algorithms[result.algorithm].name}</TableCell>
                    <TableCell>{result.executionTime.toFixed(4)}</TableCell>
                    <TableCell>
                      {result.result && typeof result.result === 'object' 
                        ? JSON.stringify(result.result).substring(0, 100) + '...'
                        : result.result}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AlgorithmComparisonSection;