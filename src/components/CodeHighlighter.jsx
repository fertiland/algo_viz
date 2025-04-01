import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, Typography, Paper } from '@mui/material';

const CodeHighlighter = ({ code, language = 'javascript', highlightedLines = [], title }) => {
  // Custom style for the code block
  const customStyle = {
    fontSize: '14px',
    borderRadius: '4px',
    margin: 0,
    padding: '16px',
  };

  // Line props to highlight specific lines
  const lineProps = (lineNumber) => {
    const style = { display: 'block' };
    if (highlightedLines.includes(lineNumber)) {
      style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      style.borderLeft = '3px solid #ffeb3b';
      style.paddingLeft = '13px';
    }
    return { style };
  };

  return (
    <Paper elevation={3} sx={{ mb: 2, overflow: 'hidden' }}>
      {title && (
        <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={customStyle}
        wrapLines={true}
        showLineNumbers={true}
        lineProps={lineProps}
      >
        {code}
      </SyntaxHighlighter>
    </Paper>
  );
};

export default CodeHighlighter;