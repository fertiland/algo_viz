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
  disabled = false
}) => {
  // Calculate progress percentage
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <Box>
      {/* Control Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
        <Tooltip title="Previous Step">
          <span>
            <IconButton 
              onClick={onStep}
              disabled={disabled || (!isRunning && !isPaused)}
              color="primary"
              size="large"
            >
              <SkipNext />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={isRunning ? (isPaused ? "Resume" : "Pause") : "Run"}>
          <span>
            <IconButton 
              onClick={isRunning ? onPauseResume : onRun}
              disabled={disabled}
              color="primary"
              size="large"
            >
              {isRunning && !isPaused ? <Pause /> : <PlayArrow />}
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Next Step">
          <span>
            <IconButton 
              onClick={onStep}
              disabled={disabled || (!isRunning && !isPaused)}
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
              disabled={disabled}
              color="primary"
              size="large"
            >
              <RestartAlt />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Progress Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        {/* Step Counter */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          minWidth: 120,
          bgcolor: 'background.paper',
          borderRadius: 1,
          py: 0.5,
          px: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            Step {String(currentStep).padStart(2, '0')} / {String(totalSteps - 1).padStart(2, '0')}
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: 'primary.main'
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VisualizerControls; 