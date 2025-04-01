import { useState } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CloseIcon from '@mui/icons-material/Close';

const PromptSystem = ({ 
  prompts, 
  currentStep = 0, 
  onNext, 
  onPrevious, 
  onFinish,
  showPrompts = true,
  setShowPrompts = () => {},
  promptStep = 0,
  setPromptStep = () => {} 
}) => {
  // If no prompts are provided or showPrompts is false, don't render anything
  if (!prompts || prompts.length === 0 || !showPrompts) return null;
  
  const currentPrompt = prompts[promptStep];
  const isLastStep = promptStep === prompts.length - 1;
  const isFirstStep = promptStep === 0;
  
  // Handle direct updates if onNext/onPrevious are not provided
  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      setPromptStep(prev => Math.min(prev + 1, prompts.length - 1));
    }
  };
  
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      setPromptStep(prev => Math.max(prev - 1, 0));
    }
  };
  
  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setShowPrompts(false);
    }
  };
  
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        zIndex: 1200, 
        p: 2, 
        width: '350px',
        maxWidth: '90vw',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          {currentPrompt.title}
        </Typography>
        <IconButton size="small" onClick={handleFinish}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        {currentPrompt.content}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePrevious}
          disabled={isFirstStep}
          variant="outlined"
          size="small"
        >
          Previous
        </Button>
        
        {isLastStep ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinish}
            size="small"
          >
            Got it
          </Button>
        ) : (
          <Button
            endIcon={<NavigateNextIcon />}
            onClick={handleNext}
            variant="contained"
            color="primary"
            size="small"
          >
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default PromptSystem;