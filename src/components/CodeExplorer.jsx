import React, { useState } from 'react';
import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import CodeHighlighter from './CodeHighlighter';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * CodeExplorer component for displaying code with highlighted lines and explanations
 * 
 * @param {Object} props Component props
 * @param {string} props.code The code to display
 * @param {number[]} props.highlightedLines Array of line numbers to highlight
 * @param {number} props.promptStep Current step in the prompt sequence
 * @param {Function} props.setPromptStep Function to update the prompt step
 * @param {string} props.title Title for the code section
 */
const CodeExplorer = ({
  code,
  highlightedLines = [],
  promptStep = 0,
  setPromptStep = () => {},
  title = 'Implementation Code'
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="subtitle1" className="font-medium text-gray-800 dark:text-white">
          {title}
        </Typography>
        <Tooltip title="Toggle code explanation">
          <IconButton 
            size="small" 
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
          >
            {showInfo ? <InfoIcon /> : <InfoOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </div>
      
      <div className="p-4">
        {showInfo && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-700 text-blue-800 dark:text-blue-200 rounded-md border-l-4 border-blue-500">
            <Typography variant="body2">
              This code shows the implementation of the selected algorithm. 
              Highlighted lines indicate the current step being executed in the visualization.
            </Typography>
          </div>
        )}
        
        <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
          <CodeHighlighter
            code={code}
            language="javascript"
            highlightedLines={highlightedLines}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeExplorer; 