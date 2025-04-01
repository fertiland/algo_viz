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
import { measureExecutionTime, compareAlgorithms } from '../utils/AlgorithmUtils';

const AlgorithmComparison = ({ algorithms, title = 'Algorithm Comparison' }) => {
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
        algorithmsToCompare[algoName] = algorithms[algoName].fn;
      }
    });
    
    const comparisonResults = compareAlgorithms(algorithmsToCompare, [...dataToUse]);
    setResults(comparisonResults);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      
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

export default AlgorithmComparison;