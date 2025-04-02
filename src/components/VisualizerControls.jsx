import React from 'react';
import { Box, LinearProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, SkipNext, RestartAlt } from '@mui/icons-material';

/**
 * Shared control buttons component for algorithm visualizers
 * 
 * @param {Object} props Component props
 * @param {Function} props.onRun Function to call when Run button is clicked
 * @param {Function} props.onPauseResume Function to call when Pause/Resume button is clicked
 * @param {Function} props.onStep Function to call when Step button is clicked
 * @param {Function} props.onReset Function to call when Reset button is clicked
 * @param {boolean} props.isRunning Whether the algorithm is currently running
 * @param {boolean} props.isPaused Whether the algorithm is currently paused
 * @param {number} props.currentStep Current step in the algorithm
 * @param {number} props.totalSteps Total number of steps in the algorithm
 * @param {boolean} props.disabled Whether the controls should be disabled
 * @param {number} props.speed Animation speed value (0-100) - kept for backward compatibility
 * @param {Function} props.onSpeedChange Function to call when speed is changed - kept for backward compatibility
 */
const VisualizerControls = ({
  onRun,
  onPauseResume,
  onStep,
  onReset,
  isRunning = false,
  isPaused = false,
  currentStep = 0,
  totalSteps = 0,
  disabled = false,
  speed = 50,
  onSpeedChange = () => {}
}) => {
  // Calculate progress percentage
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
        alignItems: 'center'
      }}>
        <Tooltip title="Run Algorithm">
          <span>
            <IconButton
              onClick={onRun}
              disabled={isRunning}
              color="primary"
              size="large"
            >
              <PlayArrow />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={isPaused ? "Resume" : "Pause"}>
          <span>
            <IconButton
              onClick={onPauseResume}
              disabled={!isRunning}
              color="primary"
              size="large"
            >
              {isPaused ? <PlayArrow /> : <Pause />}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Next Step">
          <span>
            <IconButton
              onClick={onStep}
              disabled={!isRunning || currentStep >= totalSteps - 1}
              color="primary"
              size="large"
            >
              <SkipNext />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Reset">
          <span>
            <IconButton
              onClick={onReset}
              disabled={!isRunning && currentStep === 0}
              color="primary"
              size="large"
            >
              <RestartAlt />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ width: '100%' }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          Step {currentStep + 1} of {totalSteps}
        </Typography>
      </Box>
    </Box>
  );
};

export default VisualizerControls; 