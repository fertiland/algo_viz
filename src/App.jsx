import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer';
import SearchingVisualizer from './pages/SearchingVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import DataStructureVisualizer from './pages/DataStructureVisualizer';
import GreedyVisualizer from './pages/GreedyVisualizer';
import DoublePointerVisualizer from './pages/DoublePointerVisualizer';
import DivideConquerVisualizer from './pages/DivideConquerVisualizer';
import DynamicProgrammingVisualizer from './pages/DynamicProgrammingVisualizer';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const theme = createTheme();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar toggleDrawer={toggleDrawer} />
        <Sidebar open={drawerOpen} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            ml: drawerOpen ? '20px' : 0,
            transition: theme => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/searching" element={<SearchingVisualizer />} />
            <Route path="/graph" element={<GraphVisualizer />} />
            <Route path="/data-structures" element={<DataStructureVisualizer />} />
            <Route path="/greedy" element={<GreedyVisualizer />} />
            <Route path="/double-pointer" element={<DoublePointerVisualizer />} />
            <Route path="/divide-conquer" element={<DivideConquerVisualizer />} />
            <Route path="/dynamic-programming" element={<DynamicProgrammingVisualizer />} />
          </Routes>
        </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
