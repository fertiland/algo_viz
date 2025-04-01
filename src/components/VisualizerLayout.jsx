import React from 'react';
import { Box, Typography, Grid, Paper, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PromptSystem from './PromptSystem';

/**
 * Shared layout component for all algorithm visualizers
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.controls Control panel content (algorithm selection, settings, etc.)
 * @param {React.ReactNode} props.visualization Visualization content (canvas, explanations, etc.)
 * @param {React.ReactNode} props.algorithmInfo Algorithm information panel content
 * @param {string} props.title Visualizer title
 * @param {Array} props.prompts Array of prompt objects for the tutorial
 * @param {number} props.promptStep Current prompt step
 * @param {Function} props.onNextPrompt Function to handle next prompt
 * @param {Function} props.onPreviousPrompt Function to handle previous prompt
 * @param {Function} props.onFinishPrompts Function to handle finishing prompts
 * @param {boolean} props.showPrompts Whether to show prompts
 * @param {Object} props.algorithmData Algorithm data for the current algorithm
 */
const VisualizerLayout = ({
  controls,
  visualization,
  title = 'Algorithm Visualizer',
  prompts = [],
  promptStep = 0,
  onNextPrompt = () => {},
  onPreviousPrompt = () => {},
  onFinishPrompts = () => {},
  showPrompts = false,
  algorithmData = null,
  children
}) => {
  return (
    <Box className="flex flex-col flex-grow p-2 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Prompt System */}
      {showPrompts && prompts.length > 0 && (
        <div className="mb-4">
          <PromptSystem
            prompts={prompts}
            currentStep={promptStep}
            onNext={onNextPrompt}
            onPrevious={onPreviousPrompt}
            onFinish={onFinishPrompts}
          />
        </div>
      )}
      
      <Typography variant="h4" component="h1" className="mb-4 text-2xl font-bold text-indigo-800 dark:text-indigo-300">
        {title}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Controls Panel */}
        <Grid item xs={12} md={3.5}>
          <Paper elevation={0} className="p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <Typography variant="h6" className="pb-2 mb-2 text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Controls
            </Typography>
            <div className="space-y-2">
              {controls}
            </div>
          </Paper>
          
          {/* Algorithm Information */}
          {algorithmData && (
            <Paper elevation={0} className="mt-2 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Typography variant="h6" className="pb-2 mb-2 text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700">
                Algorithm Info
              </Typography>
              <div className="space-y-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <Typography variant="subtitle2" className="mb-1 font-medium text-gray-800 dark:text-gray-200 text-sm">
                    Time Complexity:
                  </Typography>
                  <div className="ml-2 space-y-1">
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300 flex text-sm">
                      <span className="w-14 font-medium">Best:</span>
                      <span className="font-mono">{algorithmData.timeComplexity?.best || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300 flex text-sm">
                      <span className="w-14 font-medium">Avg:</span>
                      <span className="font-mono">{algorithmData.timeComplexity?.average || 'N/A'}</span>
                    </Typography>
                    <Typography variant="body2" className="text-gray-700 dark:text-gray-300 flex text-sm">
                      <span className="w-14 font-medium">Worst:</span>
                      <span className="font-mono">{algorithmData.timeComplexity?.worst || 'N/A'}</span>
                    </Typography>
                  </div>
                </div>
                
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <Typography variant="subtitle2" className="mb-1 font-medium text-gray-800 dark:text-gray-200 text-sm">
                    Space:
                  </Typography>
                  <Typography variant="body2" className="ml-2 text-gray-700 dark:text-gray-300 font-mono text-sm">
                    {algorithmData.spaceComplexity || 'N/A'}
                  </Typography>
                </div>
              </div>
            </Paper>
          )}
        </Grid>
        
        {/* Visualization Panel */}
        <Grid item xs={12} md={8.5}>
          <Paper elevation={0} className="p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg h-full">
            <Typography variant="h6" className="pb-2 mb-2 text-base font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700">
              Visualization
            </Typography>
            <div className="space-y-2">
              {visualization}
            </div>
          </Paper>
        </Grid>
      </Grid>
      
      {children}
    </Box>
  );
};

export default VisualizerLayout;